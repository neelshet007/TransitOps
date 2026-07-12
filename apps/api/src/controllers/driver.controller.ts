import { Request, Response, NextFunction } from 'express';
import { driverService } from '../services/driver.service';
import { successResponse } from '@transitops/utils';
import { HTTP_STATUS } from '../constants';
import { AuthenticatedRequest } from '@transitops/types';

export class DriverController {
  getDrivers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const search = req.query.search as string | undefined;
      const status = req.query.status as string | undefined;
      const availability = req.query.availability as string | undefined;

      const result = await driverService.getDrivers({ page, limit, search, status, availability });

      res.status(HTTP_STATUS.OK).json(
        successResponse('Drivers retrieved successfully.', result.data, {
          page: result.page,
          limit: result.limit,
          total_records: result.total,
          total_pages: result.total_pages,
        })
      );
    } catch (error) {
      next(error);
    }
  };

  getDriverById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const driver = await driverService.getDriverById(req.params.id);
      res.status(HTTP_STATUS.OK).json(successResponse('Driver retrieved successfully.', driver));
    } catch (error) {
      next(error);
    }
  };

  getDriverDashboardStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await driverService.getDriverDashboardStats();
      res.status(HTTP_STATUS.OK).json(successResponse('Driver dashboard stats retrieved.', stats));
    } catch (error) {
      next(error);
    }
  };

  createDriver = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const driver = await driverService.createDriver(req.body, userId);
      res.status(HTTP_STATUS.CREATED).json(successResponse('Driver created successfully.', driver));
    } catch (error) {
      next(error);
    }
  };

  updateDriver = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const driver = await driverService.updateDriver(req.params.id, req.body, userId);
      res.status(HTTP_STATUS.OK).json(successResponse('Driver updated successfully.', driver));
    } catch (error) {
      next(error);
    }
  };

  deleteDriver = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const result = await driverService.deleteDriver(req.params.id, userId);
      res.status(HTTP_STATUS.OK).json(successResponse(result.message));
    } catch (error) {
      next(error);
    }
  };

  restoreDriver = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const driver = await driverService.restoreDriver(req.params.id, userId);
      res.status(HTTP_STATUS.OK).json(successResponse('Driver restored successfully.', driver));
    } catch (error) {
      next(error);
    }
  };

  updateDriverStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const driver = await driverService.updateDriverStatus(req.params.id, req.body.status, userId);
      res.status(HTTP_STATUS.OK).json(successResponse('Driver status updated successfully.', driver));
    } catch (error) {
      next(error);
    }
  };

  // --- Document Controller Methods ---

  getDriverDocuments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const docs = await driverService.getDriverDocuments(req.params.id);
      res.status(HTTP_STATUS.OK).json(successResponse('Driver documents retrieved successfully.', docs));
    } catch (error) {
      next(error);
    }
  };

  uploadDriverDocument = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const doc = await driverService.uploadDriverDocument(req.params.id, req.body, userId);
      res.status(HTTP_STATUS.CREATED).json(successResponse('Document uploaded successfully.', doc));
    } catch (error) {
      next(error);
    }
  };

  verifyDriverDocument = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const doc = await driverService.verifyDriverDocument(req.params.docId, req.body.verified, req.body.notes, userId);
      res.status(HTTP_STATUS.OK).json(successResponse('Document verification status updated.', doc));
    } catch (error) {
      next(error);
    }
  };

  deleteDriverDocument = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const result = await driverService.deleteDriverDocument(req.params.docId, userId);
      res.status(HTTP_STATUS.OK).json(successResponse(result.message));
    } catch (error) {
      next(error);
    }
  };
}

export const driverController = new DriverController();
export default driverController;
