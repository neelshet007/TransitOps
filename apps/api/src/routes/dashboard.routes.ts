import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { requireAuth, requirePermissions } from '../middlewares/auth.middleware';
import { PERMISSIONS } from '../constants';

const router = Router();

router.get(
  '/stats',
  requireAuth,
  requirePermissions([PERMISSIONS.DRIVERS_VIEW]), // Dashboard requires general view permissions
  dashboardController.getStats
);

router.post(
  '/activity',
  requireAuth,
  dashboardController.logActivity
);

export default router;
