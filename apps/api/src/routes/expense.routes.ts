import { Router } from 'express';
import { expenseController } from '../controllers/expense.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Expense management endpoints require authentication
router.get('/dashboard', requireAuth, expenseController.getDashboard);
router.get('/', requireAuth, expenseController.getExpenses);
router.post('/', requireAuth, expenseController.createExpense);
router.put('/:id', requireAuth, expenseController.updateExpense);
router.delete('/:id', requireAuth, expenseController.deleteExpense);
router.patch('/:id/status', requireAuth, expenseController.updateStatus);

export default router;
