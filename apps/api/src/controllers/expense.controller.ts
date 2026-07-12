import { Request, Response, NextFunction } from 'express';
import { expenseService } from '../services/expense.service';
import { successResponse } from '@transitops/utils';
import { HTTP_STATUS } from '../constants';
import { AuthenticatedRequest } from '@transitops/types';

export class ExpenseController {
  getExpenses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '10', 10);
      const status = req.query.status as string;
      const vehicleId = req.query.vehicle_id as string;
      const driverId = req.query.driver_id as string;

      const filters: any = {};
      if (status) filters.status = status;
      if (vehicleId) filters.vehicle_id = vehicleId;
      if (driverId) filters.driver_id = driverId;

      const result = await expenseService.getAll({
        filters,
        pagination: { page, limit }
      });

      res.status(HTTP_STATUS.OK).json(successResponse('Expense records retrieved successfully.', result?.rows, {
        page,
        limit,
        total_records: result?.count || 0,
        total_pages: Math.ceil((result?.count || 0) / limit)
      }));
    } catch (error) {
      next(error);
    }
  };

  createExpense = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const operatorId = req.user?.userId;
      const record = await expenseService.createExpense(req.body, operatorId);
      res.status(HTTP_STATUS.CREATED).json(successResponse('Expense logged successfully.', record));
    } catch (error) {
      next(error);
    }
  };

  updateExpense = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const operatorId = req.user?.userId;
      const record = await expenseService.update(req.params.id, req.body, operatorId);
      res.status(HTTP_STATUS.OK).json(successResponse('Expense updated successfully.', record));
    } catch (error) {
      next(error);
    }
  };

  deleteExpense = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const operatorId = req.user?.userId;
      await expenseService.delete(req.params.id, operatorId);
      res.status(HTTP_STATUS.OK).json(successResponse('Expense deleted successfully.'));
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { status, notes } = req.body;
      const operatorId = req.user?.userId;
      const record = await expenseService.updateExpenseStatus(req.params.id, status, notes, operatorId);
      res.status(HTTP_STATUS.OK).json(successResponse('Expense status updated successfully.', record));
    } catch (error) {
      next(error);
    }
  };

  getDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await expenseService.getDashboardStats();
      res.status(HTTP_STATUS.OK).json(successResponse('Expense dashboard stats retrieved.', stats));
    } catch (error) {
      next(error);
    }
  };
}

export const expenseController = new ExpenseController();
export default expenseController;
