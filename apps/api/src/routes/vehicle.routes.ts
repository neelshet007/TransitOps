import { Router } from "express";
import { vehicleController } from "../controllers/vehicle.controller";
import { validateRequest } from "../middlewares/validation.middleware";
import {
  createVehicleSchema,
  updateVehicleSchema,
} from "../validators/vehicle.validator";

const router = Router();

// Get all vehicles
router.get("/", vehicleController.getAll);

// Get vehicle by ID
router.get("/:id", vehicleController.getById);

// Create vehicle
router.post(
  "/",
  validateRequest(createVehicleSchema),
  vehicleController.create
);

// Update vehicle
router.put(
  "/:id",
  validateRequest(updateVehicleSchema),
  vehicleController.update
);

// Delete vehicle
router.delete("/:id", vehicleController.delete);

export default router;