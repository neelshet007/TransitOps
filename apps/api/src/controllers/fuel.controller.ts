import { Request, Response, NextFunction } from 'express';
import { fuelService } from '../services/fuel.service';
import { successResponse } from '@transitops/utils';
import { HTTP_STATUS } from '../constants';
import { AuthenticatedRequest } from '@transitops/types';

export class FuelController {
  getFuelLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '10', 10);
      const vehicleId = req.query.vehicle_id as string;
      const driverId = req.query.driver_id as string;

      const filters: any = {};
      if (vehicleId) filters.vehicle_id = vehicleId;
      if (driverId) filters.driver_id = driverId;

      const result = await fuelService.getAll({
        filters,
        pagination: { page, limit }
      });

      res.status(HTTP_STATUS.OK).json(successResponse('Fuel logs retrieved successfully.', result?.rows, {
        page,
        limit,
        total_records: result?.count || 0,
        total_pages: Math.ceil((result?.count || 0) / limit)
      }));
    } catch (error) {
      next(error);
    }
  };

  createFuelLog = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const operatorId = req.user?.userId;
      const record = await fuelService.createFuelLog(req.body, operatorId);
      res.status(HTTP_STATUS.CREATED).json(successResponse('Fuel logged successfully.', record));
    } catch (error) {
      next(error);
    }
  };

  updateFuelLog = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const operatorId = req.user?.userId;
      const record = await fuelService.update(req.params.id, req.body, operatorId);
      res.status(HTTP_STATUS.OK).json(successResponse('Fuel log updated successfully.', record));
    } catch (error) {
      next(error);
    }
  };

  deleteFuelLog = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const operatorId = req.user?.userId;
      await fuelService.delete(req.params.id, operatorId);
      res.status(HTTP_STATUS.OK).json(successResponse('Fuel log deleted successfully.'));
    } catch (error) {
      next(error);
    }
  };

  getDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await fuelService.getDashboardStats();
      res.status(HTTP_STATUS.OK).json(successResponse('Fuel dashboard stats retrieved.', stats));
    } catch (error) {
      next(error);
    }
  };

  getAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await fuelService.getAnalytics();
      res.status(HTTP_STATUS.OK).json(successResponse('Fuel analytics retrieved.', stats));
    } catch (error) {
      next(error);
    }
  };
}

export const fuelController = new FuelController();
export default fuelController;
