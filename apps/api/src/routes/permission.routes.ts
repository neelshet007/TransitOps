import { Router } from 'express';
import { roleController } from '../controllers/role.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// GET /api/v1/permissions - any authenticated user can read permissions
router.get('/', requireAuth, roleController.getPermissions);

export default router;
