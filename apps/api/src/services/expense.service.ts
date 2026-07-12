import { BaseService } from './base.service';
import { Expense } from '@transitops/types';
import { expenseRepository } from '../repositories/expense.repository';
import { ValidationError, NotFoundError } from '../helpers/errors';
import { withTransaction } from '../database/transaction';
import { activityRepository } from '../repositories/activity.repository';

export class ExpenseService extends BaseService<Expense> {
  protected repository = expenseRepository;
  protected entityName = 'Expense';

  async getDashboardStats() {
    return expenseRepository.getDashboardStats();
  }

  private validateExpense(data: Partial<Expense>) {
    if (!data.vehicle_id && !data.driver_id && !data.trip_id) {
      throw new ValidationError('Every expense must reference a Vehicle, Driver, or Trip.');
    }
    
    if (Number(data.amount || 0) < 0) {
      throw new ValidationError('Expense amount cannot be negative.');
    }

    if (data.gst_number && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(data.gst_number)) {
      // Basic validation for GST (Indian GST format as standard corporate template, or we can relax it)
      // Let's print a warning but allow alphanumeric format of 15 characters
      if (data.gst_number.length !== 15) {
        throw new ValidationError('GST number must be exactly 15 characters alphanumeric.');
      }
    }
  }

  async createExpense(data: Partial<Expense>, operatorId?: string): Promise<Expense> {
    this.validateExpense(data);

    // Auto-calculate GST amount if rate is provided
    const amount = Number(data.amount || 0);
    const gstRate = Number(data.gst_rate || 0);
    const gstAmount = gstRate > 0 ? (amount * gstRate) / 100 : Number(data.gst_amount || 0);

    return withTransaction(async (client) => {
      const record = await expenseRepository.create({
        ...data,
        gst_amount: gstAmount,
        status: data.status || 'pending'
      });

      await expenseRepository.logHistory(record.id, 'none', record.status || 'pending', 'Record initialized', operatorId);

      await activityRepository.log({
        user_id: operatorId,
        action: 'EXPENSE_CREATED',
        details: `Created expense task ${record.id} of amount ${record.amount}`
      });

      return record;
    });
  }

  async updateExpenseStatus(
    id: string,
    newStatus: 'pending' | 'approved' | 'rejected' | 'paid',
    notes: string | null,
    operatorId?: string
  ): Promise<Expense> {
    const record = await expenseRepository.findById(id);
    if (!record) {
      throw new NotFoundError(`Expense task with ID '${id}' not found.`);
    }

    const oldStatus = record.status || 'pending';
    if (oldStatus === newStatus) {
      return record;
    }

    return withTransaction(async (client) => {
      const updated = await expenseRepository.update(id, { status: newStatus });
      if (!updated) {
        throw new Error('Failed to update expense status.');
      }

      await expenseRepository.logHistory(id, oldStatus, newStatus, notes, operatorId);

      await activityRepository.log({
        user_id: operatorId,
        action: 'EXPENSE_STATUS_CHANGED',
        details: `Expense task ${id} status changed from ${oldStatus} to ${newStatus}`
      });

      return updated;
    });
  }
}

export const expenseService = new ExpenseService();
export default expenseService;
