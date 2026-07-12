import { Request, Response, NextFunction } from 'express';
import { tripService } from '../services/trip.service';
import { successResponse } from '@transitops/utils';
import { HTTP_STATUS } from '../constants';
import { AuthenticatedRequest } from '@transitops/types';

export class TripController {
  getTrips = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '10', 10);
      const search = req.query.search as string;
      const status = req.query.status as string;

      const filters: any = {};
      if (status) {
        filters.status = status;
      }

      const result = await tripService.getAll({
        filters,
        search: search ? {
          query: search,
          fields: ['origin', 'destination', 'cargo', 'customer']
        } : undefined,
        pagination: { page, limit }
      });

      res.status(HTTP_STATUS.OK).json(successResponse('Trips retrieved successfully.', result?.rows, {
        page,
        limit,
        total_records: result?.count || 0,
        total_pages: Math.ceil((result?.count || 0) / limit)
      }));
    } catch (error) {
      next(error);
    }
  };

  getTripById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const trip = await tripService.getTripDetails(req.params.id);
      res.status(HTTP_STATUS.OK).json(successResponse('Trip details retrieved successfully.', trip));
    } catch (error) {
      next(error);
    }
  };

  createTrip = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const operatorId = req.user?.userId;
      const trip = await tripService.createTrip(req.body, operatorId);
      res.status(HTTP_STATUS.CREATED).json(successResponse('Trip created and scheduled successfully.', trip));
    } catch (error) {
      next(error);
    }
  };

  updateTrip = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const operatorId = req.user?.userId;
      const trip = await tripService.update(req.params.id, req.body, operatorId);
      res.status(HTTP_STATUS.OK).json(successResponse('Trip updated successfully.', trip));
    } catch (error) {
      next(error);
    }
  };

  deleteTrip = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const operatorId = req.user?.userId;
      await tripService.delete(req.params.id, operatorId);
      res.status(HTTP_STATUS.OK).json(successResponse('Trip soft-deleted successfully.'));
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { status, reason } = req.body;
      const operatorId = req.user?.userId;
      
      const trip = await tripService.updateTripStatus(req.params.id, status, reason, operatorId);
      res.status(HTTP_STATUS.OK).json(successResponse('Trip status updated successfully.', trip));
    } catch (error) {
      next(error);
    }
  };

  assignResources = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { vehicle_id, driver_id } = req.body;
      const operatorId = req.user?.userId;

      const trip = await tripService.assignResources(req.params.id, vehicle_id, driver_id, operatorId);
      res.status(HTTP_STATUS.OK).json(successResponse('Trip resources reassigned successfully.', trip));
    } catch (error) {
      next(error);
    }
  };
}

export const tripController = new TripController();
export default tripController;
