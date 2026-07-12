import { Router } from 'express';
import { reportController } from '../controllers/report.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Reports and Analytics endpoints require authentication
router.get('/reports/fleet', requireAuth, reportController.getFleetReport);
router.get('/reports/drivers', requireAuth, reportController.getDriverReport);
router.get('/reports/trips', requireAuth, reportController.getTripReport);
router.get('/reports/fuel', requireAuth, reportController.getFuelReport);
router.get('/reports/maintenance', requireAuth, reportController.getMaintenanceReport);
router.get('/reports/expenses', requireAuth, reportController.getExpenseReport);
router.get('/analytics/dashboard', requireAuth, reportController.getDashboardAnalytics);
router.get('/analytics/trends', requireAuth, reportController.getTrendsAnalytics);

export default router;
