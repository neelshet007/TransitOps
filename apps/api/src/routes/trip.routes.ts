import { Router } from 'express';
import { tripController } from '../controllers/trip.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Trip management routes require authentication
router.get('/', requireAuth, tripController.getTrips);
router.get('/:id', requireAuth, tripController.getTripById);
router.post('/', requireAuth, tripController.createTrip);
router.put('/:id', requireAuth, tripController.updateTrip);
router.delete('/:id', requireAuth, tripController.deleteTrip);
router.patch('/:id/status', requireAuth, tripController.updateStatus);
router.post('/:id/assign', requireAuth, tripController.assignResources);

export default router;
