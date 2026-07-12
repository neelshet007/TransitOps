import { Router } from 'express';
import { lookupController } from '../controllers/lookup.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Lookup routes require authentication
router.get('/search', requireAuth, lookupController.globalSearch);
router.get('/:entity', requireAuth, lookupController.getLookup);

export default router;
