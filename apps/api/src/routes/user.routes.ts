import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { requireAuth, requirePermissions } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import {
  createUserSchema,
  updateUserSchema,
  assignRoleSchema,
  resetPasswordSchema,
} from '../validators/user.validator';
import { PERMISSIONS } from '../constants';

const router = Router();

// All user routes require authentication
router.use(requireAuth);

// GET /api/v1/users
router.get('/', requirePermissions([PERMISSIONS.USERS_VIEW]), userController.getUsers);

// GET /api/v1/users/:id
router.get('/:id', requirePermissions([PERMISSIONS.USERS_VIEW]), userController.getUserById);

// POST /api/v1/users
router.post(
  '/',
  requirePermissions([PERMISSIONS.USERS_CREATE]),
  validateRequest(createUserSchema),
  userController.createUser,
);

// PUT /api/v1/users/:id
router.put(
  '/:id',
  requirePermissions([PERMISSIONS.USERS_EDIT]),
  validateRequest(updateUserSchema),
  userController.updateUser,
);

// DELETE /api/v1/users/:id
router.delete('/:id', requirePermissions([PERMISSIONS.USERS_DELETE]), userController.deleteUser);

// POST /api/v1/users/:id/reset-password
router.post(
  '/:id/reset-password',
  requirePermissions([PERMISSIONS.USERS_EDIT]),
  validateRequest(resetPasswordSchema),
  userController.resetPassword,
);

// POST /api/v1/users/:id/roles
router.post(
  '/:id/roles',
  requirePermissions([PERMISSIONS.USERS_EDIT]),
  validateRequest(assignRoleSchema),
  userController.assignRole,
);

// DELETE /api/v1/users/:id/roles/:roleId
router.delete('/:id/roles/:roleId', requirePermissions([PERMISSIONS.USERS_EDIT]), userController.removeRole);

export default router;
