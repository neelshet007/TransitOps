import { Router } from 'express';
import { fleetController } from '../controllers/fleet.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Fleet routes require authentication
router.get('/availability', requireAuth, fleetController.getAvailability);
router.get('/overview', requireAuth, fleetController.getOverview);
router.get('/available', requireAuth, fleetController.getAvailable);
router.patch('/:id/status', requireAuth, fleetController.updateStatus);

export default router;
