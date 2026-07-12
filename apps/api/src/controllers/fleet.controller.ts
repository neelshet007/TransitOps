import { Response, NextFunction } from 'express';
import { fleetService } from '../services/fleet.service';
import { successResponse } from '@transitops/utils';
import { HTTP_STATUS } from '../constants';
import { AuthenticatedRequest } from '@transitops/types';

export class FleetController {
  getAvailability = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await fleetService.getAvailability();
      res.status(HTTP_STATUS.OK).json(successResponse('Fleet operational availability metrics retrieved.', stats));
    } catch (error) {
      next(error);
    }
  };

  getOverview = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const overview = await fleetService.getOverview();
      res.status(HTTP_STATUS.OK).json(successResponse('Fleet overview dataset retrieved.', overview));
    } catch (error) {
      next(error);
    }
  };

  getAvailable = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const available = await fleetService.getAvailable();
      res.status(HTTP_STATUS.OK).json(successResponse('Available dispatch vehicles retrieved.', available));
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;
      const userId = req.user?.userId;
      
      const vehicle = await fleetService.updateVehicleStatus(id, status, reason, userId);
      res.status(HTTP_STATUS.OK).json(successResponse('Vehicle operational status updated successfully.', vehicle));
    } catch (error) {
      next(error);
    }
  };
}

export const fleetController = new FleetController();
export default fleetController;
