import { Request, Response, NextFunction } from 'express';
import { reportService } from '../services/report.service';
import { successResponse } from '@transitops/utils';
import { HTTP_STATUS } from '../constants';
import { ReportFilter } from '../repositories/report.repository';

export class ReportController {
  private getFilters(req: Request): ReportFilter {
    return {
      vehicleId: req.query.vehicle_id as string,
      driverId: req.query.driver_id as string,
      startDate: req.query.start_date as string,
      endDate: req.query.end_date as string,
      status: req.query.status as string,
      search: req.query.search as string
    };
  }

  private handleResponse = (res: Response, data: any[], format: string, filename: string) => {
    if (format === 'csv') {
      const csv = reportService.convertToCSV(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}.csv`);
      return res.status(HTTP_STATUS.OK).send(csv);
    }
    return res.status(HTTP_STATUS.OK).json(successResponse('Report generated successfully.', data));
  };

  getFleetReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = this.getFilters(req);
      const data = await reportService.getFleetReport(filters);
      this.handleResponse(res, data, req.query.export as string, 'fleet_report');
    } catch (error) {
      next(error);
    }
  };

  getDriverReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = this.getFilters(req);
      const data = await reportService.getDriverReport(filters);
      this.handleResponse(res, data, req.query.export as string, 'driver_report');
    } catch (error) {
      next(error);
    }
  };

  getTripReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = this.getFilters(req);
      const data = await reportService.getTripReport(filters);
      this.handleResponse(res, data, req.query.export as string, 'trip_report');
    } catch (error) {
      next(error);
    }
  };

  getFuelReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = this.getFilters(req);
      const data = await reportService.getFuelReport(filters);
      this.handleResponse(res, data, req.query.export as string, 'fuel_report');
    } catch (error) {
      next(error);
    }
  };

  getMaintenanceReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = this.getFilters(req);
      const data = await reportService.getMaintenanceReport(filters);
      this.handleResponse(res, data, req.query.export as string, 'maintenance_report');
    } catch (error) {
      next(error);
    }
  };

  getExpenseReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = this.getFilters(req);
      const data = await reportService.getExpenseReport(filters);
      this.handleResponse(res, data, req.query.export as string, 'expense_report');
    } catch (error) {
      next(error);
    }
  };

  getDashboardAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const analytics = await reportService.getDashboardAnalytics();
      res.status(HTTP_STATUS.OK).json(successResponse('Dashboard analytics metrics retrieved.', analytics));
    } catch (error) {
      next(error);
    }
  };

  getTrendsAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const range = req.query.range as string || 'monthly';
      const trends = await reportService.getTrendsAnalytics(range);
      res.status(HTTP_STATUS.OK).json(successResponse('Trends analytics dataset retrieved.', trends));
    } catch (error) {
      next(error);
    }
  };
}

export const reportController = new ReportController();
export default reportController;
