import { BaseService } from './base.service';
import { Trip } from '@transitops/types';
import { tripRepository } from '../repositories/trip.repository';
import { driverRepository } from '../repositories/driver.repository';
import { vehicleRepository } from '../repositories/vehicle.repository';
import { ValidationError, NotFoundError } from '../helpers/errors';
import { withTransaction } from '../database/transaction';
import { activityRepository } from '../repositories/activity.repository';
import { logger } from '../utils/logger';

export class TripService extends BaseService<Trip> {
  protected repository = tripRepository;
  protected entityName = 'Trip';

  async getTripDetails(id: string) {
    const details = await tripRepository.findTripDetails(id);
    if (!details) {
      throw new NotFoundError(`Trip with ID '${id}' not found.`);
    }
    return details;
  }

  async validateAssignment(vehicleId: string, driverId: string) {
    const today = new Date();

    // 1. Validate Driver
    const driver = await driverRepository.findById(driverId);
    if (!driver) {
      throw new NotFoundError(`Driver with ID '${driverId}' not found.`);
    }
    if (driver.status !== 'active') {
      throw new ValidationError(`Driver is not active (Current status: ${driver.status}).`);
    }
    if (driver.availability !== 'available') {
      throw new ValidationError(`Driver is busy or on leave (Current availability: ${driver.availability}).`);
    }
    if (driver.license_expiry && new Date(driver.license_expiry) <= today) {
      throw new ValidationError('Driver has an expired commercial driving license.');
    }

    // 2. Validate Vehicle
    const vehicle = await vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new NotFoundError(`Vehicle with ID '${vehicleId}' not found.`);
    }
    if (vehicle.status !== 'available' && vehicle.status !== 'active') {
      throw new ValidationError(`Vehicle is not available for dispatch (Current status: ${vehicle.status}).`);
    }
    
    const v = vehicle as any;
    if (v.fitness_expiry && new Date(v.fitness_expiry) <= today) {
      throw new ValidationError('Vehicle fitness certificate has expired.');
    }
    if (v.insurance_expiry && new Date(v.insurance_expiry) <= today) {
      throw new ValidationError('Vehicle insurance policy has expired.');
    }
    if (v.puc_expiry && new Date(v.puc_expiry) <= today) {
      throw new ValidationError('Vehicle PUC certificate has expired.');
    }
  }

  async createTrip(data: Partial<Trip>, operatorId?: string): Promise<Trip> {
    await this.validateAssignment(data.vehicle_id!, data.driver_id!);

    return withTransaction(async (client) => {
      // 1. Create trip record
      const trip = await tripRepository.create({
        ...data,
        status: 'scheduled'
      });

      // 2. Log initial assignment
      await tripRepository.logTripAssignment(trip.id, trip.vehicle_id, trip.driver_id);
      
      // 3. Log initial status history
      await tripRepository.logTripStatusChange(trip.id, 'none', 'scheduled', 'Trip initialized', operatorId);
      
      // 4. Log actions
      await tripRepository.logTripAction(trip.id, 'system', 'Trip scheduled and resources assigned.');

      // 5. Reserve driver and vehicle to assigned/reserved operational status
      await driverRepository.update(trip.driver_id, { availability: 'assigned' });
      await vehicleRepository.update(trip.vehicle_id, { status: 'reserved' });

      // 6. User activity log
      await activityRepository.log({
        user_id: operatorId,
        action: 'TRIP_CREATED',
        details: `Scheduled trip ${trip.id} from ${trip.origin} to ${trip.destination}`
      });

      return trip;
    });
  }

  async updateTripStatus(
    tripId: string,
    newStatus: 'scheduled' | 'in_progress' | 'completed' | 'cancelled',
    reason: string | null,
    operatorId?: string
  ): Promise<Trip> {
    const trip = await tripRepository.findById(tripId);
    if (!trip) {
      throw new NotFoundError(`Trip with ID '${tripId}' not found.`);
    }

    const oldStatus = trip.status;
    if (oldStatus === newStatus) {
      return trip;
    }

    return withTransaction(async (client) => {
      const today = new Date();
      const updatePayload: Partial<Trip> = { status: newStatus };

      if (newStatus === 'in_progress') {
        updatePayload.actual_start = today;
      } else if (newStatus === 'completed') {
        updatePayload.actual_end = today;
      }

      const updated = await tripRepository.update(tripId, updatePayload);
      if (!updated) {
        throw new Error('Failed to update trip status.');
      }

      // Record logs and status histories
      await tripRepository.logTripStatusChange(tripId, oldStatus, newStatus, reason, operatorId);
      await tripRepository.logTripAction(tripId, 'status_change', `Trip status moved from ${oldStatus} to ${newStatus}. Reason: ${reason || 'None'}`);

      // Handle status side effects on Driver and Vehicle availability pools
      if (newStatus === 'in_progress') {
        await driverRepository.update(trip.driver_id, { availability: 'driving' });
        await vehicleRepository.update(trip.vehicle_id, { status: 'on_trip' });
      } else if (newStatus === 'completed' || newStatus === 'cancelled') {
        await driverRepository.update(trip.driver_id, { availability: 'available' });
        await vehicleRepository.update(trip.vehicle_id, { status: 'available' });
      }

      // Audit trail logs
      await activityRepository.log({
        user_id: operatorId,
        action: 'TRIP_STATUS_CHANGED',
        details: `Trip ${tripId} status changed from ${oldStatus} to ${newStatus}`
      });

      return updated;
    });
  }

  async assignResources(
    tripId: string,
    vehicleId: string,
    driverId: string,
    operatorId?: string
  ): Promise<Trip> {
    const trip = await tripRepository.findById(tripId);
    if (!trip) {
      throw new NotFoundError(`Trip with ID '${tripId}' not found.`);
    }

    await this.validateAssignment(vehicleId, driverId);

    return withTransaction(async (client) => {
      // 1. Release previous assignments
      if (trip.driver_id !== driverId) {
        await driverRepository.update(trip.driver_id, { availability: 'available' });
      }
      if (trip.vehicle_id !== vehicleId) {
        await vehicleRepository.update(trip.vehicle_id, { status: 'available' });
      }

      // 2. Assign new resources
      const updated = await tripRepository.update(tripId, {
        vehicle_id: vehicleId,
        driver_id: driverId
      });

      if (!updated) {
        throw new Error('Failed to reassign resources.');
      }

      await tripRepository.logTripAssignment(tripId, vehicleId, driverId);
      await tripRepository.logTripAction(tripId, 'info', `Trip resource assignment updated by operator.`);

      await driverRepository.update(driverId, { availability: 'assigned' });
      await vehicleRepository.update(vehicleId, { status: 'reserved' });

      await activityRepository.log({
        user_id: operatorId,
        action: 'TRIP_REASSIGNED',
        details: `Trip ${tripId} reassigned to Vehicle ID ${vehicleId} and Driver ID ${driverId}`
      });

      return updated;
    });
  }
}

export const tripService = new TripService();
export default tripService;
