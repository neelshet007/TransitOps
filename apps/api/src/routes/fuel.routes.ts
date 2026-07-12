import { Router } from 'express';
import { fuelController } from '../controllers/fuel.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Fuel management endpoints require authentication
router.get('/dashboard', requireAuth, fuelController.getDashboard);
router.get('/analytics', requireAuth, fuelController.getAnalytics);
router.get('/', requireAuth, fuelController.getFuelLogs);
router.post('/', requireAuth, fuelController.createFuelLog);
router.put('/:id', requireAuth, fuelController.updateFuelLog);
router.delete('/:id', requireAuth, fuelController.deleteFuelLog);

export default router;
