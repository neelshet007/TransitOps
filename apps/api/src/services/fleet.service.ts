import { fleetRepository } from '../repositories/fleet.repository';
import { vehicleRepository } from '../repositories/vehicle.repository';
import { ValidationError, NotFoundError } from '../helpers/errors';
import { activityRepository } from '../repositories/activity.repository';

export class FleetService {
  async getAvailability() {
    return fleetRepository.getOperationalStats();
  }

  async getOverview() {
    return fleetRepository.getFleetOverview();
  }

  async getAvailable() {
    return fleetRepository.getAvailableVehicles();
  }

  async updateVehicleStatus(
    vehicleId: string,
    newStatus: string,
    reason: string | null,
    userId?: string
  ) {
    const vehicle = await vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new NotFoundError(`Vehicle with ID '${vehicleId}' not found.`);
    }

    const oldStatus = vehicle.status;
    if (oldStatus === newStatus) {
      return vehicle;
    }

    // Business Rules validation when changing status to Available
    if (newStatus === 'available') {
      const v = vehicle as any;
      const today = new Date();
      
      if (v.fitness_expiry && new Date(v.fitness_expiry) <= today) {
        throw new ValidationError('Vehicle cannot become Available: Fitness certificate is expired.');
      }
      if (v.insurance_expiry && new Date(v.insurance_expiry) <= today) {
        throw new ValidationError('Vehicle cannot become Available: Insurance policy is expired.');
      }
      if (v.puc_expiry && new Date(v.puc_expiry) <= today) {
        throw new ValidationError('Vehicle cannot become Available: PUC certificate is expired.');
      }
    }

    // Update status in vehicles table
    // Note: We use base repo update or custom update
    const updated = await vehicleRepository.update(vehicleId, { status: newStatus });
    if (!updated) {
      throw new Error('Failed to update vehicle operational status.');
    }

    // Log operational history
    await fleetRepository.logStatusChange(vehicleId, oldStatus, newStatus, reason, userId);

    // Track state change inside system logs
    await activityRepository.log({
      user_id: userId,
      action: 'VEHICLE_STATUS_CHANGED',
      details: `Vehicle status changed for ${updated.plate_number} from ${oldStatus} to ${newStatus}. Reason: ${reason || 'None'}`
    });

    // Capture snapshot logs of current fleet metrics
    const stats = await fleetRepository.getOperationalStats();
    await fleetRepository.logFleetAvailability(stats);

    return updated;
  }
}

export const fleetService = new FleetService();
export default fleetService;
