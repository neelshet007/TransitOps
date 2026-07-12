import { BaseService } from './base.service';
import { Maintenance } from '@transitops/types';
import { maintenanceRepository } from '../repositories/maintenance.repository';
import { vehicleRepository } from '../repositories/vehicle.repository';
import { NotFoundError } from '../helpers/errors';
import { withTransaction } from '../database/transaction';
import { activityRepository } from '../repositories/activity.repository';

export class MaintenanceService extends BaseService<Maintenance> {
  protected repository = maintenanceRepository;
  protected entityName = 'Maintenance';

  async getCalendarEvents() {
    return maintenanceRepository.getCalendarEvents();
  }

  async getDashboardStats() {
    return maintenanceRepository.getDashboardStats();
  }

  async createMaintenance(data: Partial<Maintenance>, operatorId?: string): Promise<Maintenance> {
    const partsCost = Number(data.parts_cost || 0);
    const labourCost = Number(data.labour_cost || 0);
    const totalCost = partsCost + labourCost;

    return withTransaction(async (client) => {
      const record = await maintenanceRepository.create({
        ...data,
        cost: totalCost,
        status: data.status || 'scheduled'
      });

      await maintenanceRepository.logHistory(record.id, 'none', record.status, 'Record initialized', operatorId);

      // Cascade status change if it is created in_progress
      if (record.status === 'in_progress') {
        await vehicleRepository.update(record.vehicle_id, { status: 'maintenance' });
      }

      await activityRepository.log({
        user_id: operatorId,
        action: 'MAINTENANCE_CREATED',
        details: `Created maintenance task ${record.id} for vehicle ${record.vehicle_id}`
      });

      return record;
    });
  }

  async updateMaintenanceStatus(
    id: string,
    newStatus: 'scheduled' | 'in_progress' | 'completed' | 'cancelled',
    notes: string | null,
    operatorId?: string
  ): Promise<Maintenance> {
    const record = await maintenanceRepository.findById(id);
    if (!record) {
      throw new NotFoundError(`Maintenance task with ID '${id}' not found.`);
    }

    const oldStatus = record.status;
    if (oldStatus === newStatus) {
      return record;
    }

    return withTransaction(async (client) => {
      const updatePayload: Partial<Maintenance> = { status: newStatus };
      if (newStatus === 'completed') {
        updatePayload.completed_date = new Date();
      }

      const updated = await maintenanceRepository.update(id, updatePayload);
      if (!updated) {
        throw new Error('Failed to update maintenance task status.');
      }

      // Log status history
      await maintenanceRepository.logHistory(id, oldStatus, newStatus, notes, operatorId);

      // Handle vehicle status cascades
      if (newStatus === 'in_progress') {
        await vehicleRepository.update(record.vehicle_id, { status: 'maintenance' });
      } else if (newStatus === 'completed' || newStatus === 'cancelled') {
        // Return vehicle to available pool
        await vehicleRepository.update(record.vehicle_id, { status: 'available' });
      }

      await activityRepository.log({
        user_id: operatorId,
        action: 'MAINTENANCE_STATUS_CHANGED',
        details: `Maintenance task ${id} status changed from ${oldStatus} to ${newStatus}`
      });

      return updated;
    });
  }
}

export const maintenanceService = new MaintenanceService();
export default maintenanceService;
