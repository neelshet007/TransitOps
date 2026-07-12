import { expenses } from '../../../lib/mockDb';

export class ExpenseService {
  async getAll() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...expenses];
  }

  async create(data: any) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const newExp = {
      id: `exp-${8000 + expenses.length}`,
      ...data,
      amount: Number(data.amount) || 0,
      status: 'pending',
    };
    expenses.unshift(newExp);
    return newExp;
  }

  async update(id: string, data: any) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const index = expenses.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Expense log not found');
    expenses[index] = {
      ...expenses[index],
      ...data,
    };
    return expenses[index];
  }

  async delete(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = expenses.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Expense log not found');
    expenses.splice(index, 1);
    return { success: true };
  }
}

export const expenseService = new ExpenseService();
export default expenseService;
