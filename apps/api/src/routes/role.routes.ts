import { Router } from 'express';
import { roleController } from '../controllers/role.controller';
import { requireAuth, requirePermissions } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import {
  createRoleSchema,
  updateRoleSchema,
  setPermissionsSchema,
  assignPermissionSchema,
} from '../validators/role.validator';
import { PERMISSIONS } from '../constants';

const router = Router();

router.use(requireAuth);

// GET /api/v1/roles
router.get('/', requirePermissions([PERMISSIONS.ROLES_VIEW]), roleController.getRoles);

// GET /api/v1/roles/:id
router.get('/:id', requirePermissions([PERMISSIONS.ROLES_VIEW]), roleController.getRoleById);

// POST /api/v1/roles
router.post(
  '/',
  requirePermissions([PERMISSIONS.ROLES_MANAGE]),
  validateRequest(createRoleSchema),
  roleController.createRole,
);

// PUT /api/v1/roles/:id
router.put(
  '/:id',
  requirePermissions([PERMISSIONS.ROLES_MANAGE]),
  validateRequest(updateRoleSchema),
  roleController.updateRole,
);

// DELETE /api/v1/roles/:id
router.delete('/:id', requirePermissions([PERMISSIONS.ROLES_MANAGE]), roleController.deleteRole);

// PUT /api/v1/roles/:id/permissions  (replace all permissions)
router.put(
  '/:id/permissions',
  requirePermissions([PERMISSIONS.ROLES_MANAGE]),
  validateRequest(setPermissionsSchema),
  roleController.setPermissions,
);

// POST /api/v1/roles/:id/permissions (add one permission)
router.post(
  '/:id/permissions',
  requirePermissions([PERMISSIONS.ROLES_MANAGE]),
  validateRequest(assignPermissionSchema),
  roleController.assignPermission,
);

// DELETE /api/v1/roles/:id/permissions/:permissionId
router.delete(
  '/:id/permissions/:permissionId',
  requirePermissions([PERMISSIONS.ROLES_MANAGE]),
  roleController.removePermission,
);

export default router;
