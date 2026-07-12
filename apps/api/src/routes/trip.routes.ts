import { Router } from 'express';
import { tripController } from '../controllers/trip.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { createTripSchema, updateTripStatusSchema, assignResourcesSchema } from '../validators/trip.validator';

const router = Router();

// Trip management routes require authentication
router.get('/', requireAuth, tripController.getTrips);
router.get('/:id', requireAuth, tripController.getTripById);
router.post('/', requireAuth, validateRequest(createTripSchema), tripController.createTrip);
router.put('/:id', requireAuth, tripController.updateTrip);
router.delete('/:id', requireAuth, tripController.deleteTrip);
router.patch('/:id/status', requireAuth, validateRequest(updateTripStatusSchema), tripController.updateStatus);
router.post('/:id/assign', requireAuth, validateRequest(assignResourcesSchema), tripController.assignResources);

export default router;
