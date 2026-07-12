import { Router } from 'express';
import { driverController } from '../controllers/driver.controller';
import { requireAuth, requirePermissions } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import {
  createDriverSchema,
  updateDriverSchema,
  updateDriverStatusSchema,
  uploadDocumentSchema,
  getDriversQuerySchema,
} from '../validators/driver.validator';
import { PERMISSIONS } from '../constants';

const router = Router();

// All driver routes require authentication
router.use(requireAuth);

// GET /api/v1/drivers/dashboard (Must be defined BEFORE general GET /:id)
router.get(
  '/dashboard',
  requirePermissions([PERMISSIONS.DRIVERS_VIEW]),
  driverController.getDriverDashboardStats
);

// GET /api/v1/drivers
router.get(
  '/',
  requirePermissions([PERMISSIONS.DRIVERS_VIEW]),
  validateRequest(getDriversQuerySchema),
  driverController.getDrivers
);

// GET /api/v1/drivers/:id
router.get(
  '/:id',
  requirePermissions([PERMISSIONS.DRIVERS_VIEW]),
  driverController.getDriverById
);

// POST /api/v1/drivers
router.post(
  '/',
  requirePermissions([PERMISSIONS.DRIVERS_CREATE]),
  validateRequest(createDriverSchema),
  driverController.createDriver
);

// PUT /api/v1/drivers/:id
router.put(
  '/:id',
  requirePermissions([PERMISSIONS.DRIVERS_EDIT]),
  validateRequest(updateDriverSchema),
  driverController.updateDriver
);

// DELETE /api/v1/drivers/:id
router.delete(
  '/:id',
  requirePermissions([PERMISSIONS.DRIVERS_DELETE]),
  driverController.deleteDriver
);

// POST /api/v1/drivers/:id/restore
router.post(
  '/:id/restore',
  requirePermissions([PERMISSIONS.DRIVERS_EDIT]),
  driverController.restoreDriver
);

// PATCH /api/v1/drivers/:id/status
router.patch(
  '/:id/status',
  requirePermissions([PERMISSIONS.DRIVERS_EDIT]),
  validateRequest(updateDriverStatusSchema),
  driverController.updateDriverStatus
);

// --- Driver Document Routes ---

// GET /api/v1/drivers/:id/documents
router.get(
  '/:id/documents',
  requirePermissions([PERMISSIONS.DRIVERS_VIEW]),
  driverController.getDriverDocuments
);

// POST /api/v1/drivers/:id/documents
router.post(
  '/:id/documents',
  requirePermissions([PERMISSIONS.DRIVERS_EDIT]),
  validateRequest(uploadDocumentSchema),
  driverController.uploadDriverDocument
);

// PUT /api/v1/drivers/:id/documents/:docId/verify
router.put(
  '/:id/documents/:docId/verify',
  requirePermissions([PERMISSIONS.DRIVERS_EDIT]),
  driverController.verifyDriverDocument
);

// DELETE /api/v1/drivers/:id/documents/:docId
router.delete(
  '/:id/documents/:docId',
  requirePermissions([PERMISSIONS.DRIVERS_EDIT]),
  driverController.deleteDriverDocument
);

export default router;
