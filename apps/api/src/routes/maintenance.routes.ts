import { Router } from 'express';
import { maintenanceController } from '../controllers/maintenance.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Maintenance management endpoints require authentication
router.get('/calendar', requireAuth, maintenanceController.getCalendar);
router.get('/dashboard', requireAuth, maintenanceController.getDashboard);
router.get('/', requireAuth, maintenanceController.getMaintenance);
router.post('/', requireAuth, maintenanceController.createMaintenance);
router.put('/:id', requireAuth, maintenanceController.updateMaintenance);
router.delete('/:id', requireAuth, maintenanceController.deleteMaintenance);
router.patch('/:id/status', requireAuth, maintenanceController.updateStatus);

export default router;
