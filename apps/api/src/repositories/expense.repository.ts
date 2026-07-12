import { BaseRepository } from './base.repository';
import { Expense } from '@transitops/types';
import { query } from '../database';

export class ExpenseRepository extends BaseRepository<Expense> {
  protected tableName = 'expenses';
  protected columns = [
    'id', 'trip_id', 'vehicle_id', 'expense_category_id', 'amount', 'expense_date',
    'notes', 'driver_id', 'status', 'gst_number', 'gst_rate', 'gst_amount',
    'vendor_name', 'invoice_number',
    'created_at', 'updated_at', 'deleted_at', 'created_by', 'updated_by'
  ];

  async logHistory(
    expenseId: string,
    oldStatus: string,
    newStatus: string,
    notes: string | null,
    changedBy?: string
  ): Promise<void> {
    const sql = `
      INSERT INTO expense_history (expense_id, old_status, new_status, notes, changed_by)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await query(sql, [expenseId, oldStatus, newStatus, notes || null, changedBy || null]);
  }

  async getDashboardStats(): Promise<any> {
    const totalSql = `
      SELECT 
        COALESCE(SUM(amount), 0) as total_expenses,
        COALESCE(SUM(CASE WHEN expense_date >= DATE_TRUNC('month', CURRENT_DATE) THEN amount END), 0) as monthly_expenses,
        COALESCE(SUM(CASE WHEN ec.name = 'Fuel' THEN amount END), 0) as fuel_expenses,
        COALESCE(SUM(CASE WHEN ec.name = 'Maintenance' THEN amount END), 0) as maintenance_expenses
      FROM expenses e
      JOIN expense_categories ec ON e.expense_category_id = ec.id
      WHERE e.deleted_at IS NULL;
    `;

    const categorySql = `
      SELECT 
        ec.name as category,
        COALESCE(SUM(e.amount), 0) as total_amount
      FROM expenses e
      JOIN expense_categories ec ON e.expense_category_id = ec.id
      WHERE e.deleted_at IS NULL
      GROUP BY ec.name
      ORDER BY total_amount DESC
      LIMIT 5;
    `;

    const trendSql = `
      SELECT 
        DATE_TRUNC('month', e.expense_date) as month,
        COALESCE(SUM(e.amount), 0) as amount
      FROM expenses e
      WHERE e.deleted_at IS NULL
      GROUP BY month
      ORDER BY month ASC
      LIMIT 6;
    `;

    const recentSql = `
      SELECT 
        e.id, e.amount, e.expense_date, e.status, e.vendor_name,
        ec.name as category_name
      FROM expenses e
      JOIN expense_categories ec ON e.expense_category_id = ec.id
      WHERE e.deleted_at IS NULL
      ORDER BY e.expense_date DESC, e.created_at DESC
      LIMIT 5;
    `;

    const totalRes = await query(totalSql);
    const categoryRes = await query(categorySql);
    const trendRes = await query(trendSql);
    const recentRes = await query(recentSql);

    const totals = totalRes.rows[0];

    return {
      total_expenses: parseFloat(totals.total_expenses),
      monthly_expenses: parseFloat(totals.monthly_expenses),
      fuel_expenses: parseFloat(totals.fuel_expenses),
      maintenance_expenses: parseFloat(totals.maintenance_expenses),
      categories: categoryRes.rows,
      trends: trendRes.rows,
      recent: recentRes.rows
    };
  }
}

export const expenseRepository = new ExpenseRepository();
export default expenseRepository;
