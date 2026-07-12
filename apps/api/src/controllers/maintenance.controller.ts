import { Request, Response, NextFunction } from 'express';
import { maintenanceService } from '../services/maintenance.service';
import { successResponse } from '@transitops/utils';
import { HTTP_STATUS } from '../constants';
import { AuthenticatedRequest } from '@transitops/types';

export class MaintenanceController {
  getMaintenance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '10', 10);
      const status = req.query.status as string;
      const vehicleId = req.query.vehicle_id as string;

      const filters: any = {};
      if (status) filters.status = status;
      if (vehicleId) filters.vehicle_id = vehicleId;

      const result = await maintenanceService.getAll({
        filters,
        pagination: { page, limit }
      });

      res.status(HTTP_STATUS.OK).json(successResponse('Maintenance records retrieved successfully.', result?.rows, {
        page,
        limit,
        total_records: result?.count || 0,
        total_pages: Math.ceil((result?.count || 0) / limit)
      }));
    } catch (error) {
      next(error);
    }
  };

  createMaintenance = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const operatorId = req.user?.userId;
      const record = await maintenanceService.createMaintenance(req.body, operatorId);
      res.status(HTTP_STATUS.CREATED).json(successResponse('Maintenance task scheduled successfully.', record));
    } catch (error) {
      next(error);
    }
  };

  updateMaintenance = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const operatorId = req.user?.userId;
      const record = await maintenanceService.update(req.params.id, req.body, operatorId);
      res.status(HTTP_STATUS.OK).json(successResponse('Maintenance task updated successfully.', record));
    } catch (error) {
      next(error);
    }
  };

  deleteMaintenance = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const operatorId = req.user?.userId;
      await maintenanceService.delete(req.params.id, operatorId);
      res.status(HTTP_STATUS.OK).json(successResponse('Maintenance task deleted successfully.'));
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { status, notes } = req.body;
      const operatorId = req.user?.userId;
      const record = await maintenanceService.updateMaintenanceStatus(req.params.id, status, notes, operatorId);
      res.status(HTTP_STATUS.OK).json(successResponse('Maintenance status updated successfully.', record));
    } catch (error) {
      next(error);
    }
  };

  getCalendar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const events = await maintenanceService.getCalendarEvents();
      res.status(HTTP_STATUS.OK).json(successResponse('Calendar events retrieved.', events));
    } catch (error) {
      next(error);
    }
  };

  getDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await maintenanceService.getDashboardStats();
      res.status(HTTP_STATUS.OK).json(successResponse('Dashboard statistics retrieved.', stats));
    } catch (error) {
      next(error);
    }
  };
}

export const maintenanceController = new MaintenanceController();
export default maintenanceController;
