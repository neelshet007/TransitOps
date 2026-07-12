import { Request, Response, NextFunction } from "express";
import { vehicleService } from "../services/vehicle.service";
import { successResponse } from "@transitops/utils";
import { HTTP_STATUS } from "../constants";

export class VehicleController {
  getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const vehicles = await vehicleService.getAll();

      res.status(HTTP_STATUS.OK).json(
        successResponse("Vehicles fetched successfully.", vehicles)
      );
    } catch (error) {
      next(error);
    }
  };

  getById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const vehicle = await vehicleService.getById(req.params.id);

      res.status(HTTP_STATUS.OK).json(
        successResponse("Vehicle fetched successfully.", vehicle)
      );
    } catch (error) {
      next(error);
    }
  };

  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const vehicle = await vehicleService.create(req.body);

      res.status(HTTP_STATUS.CREATED).json(
        successResponse("Vehicle created successfully.", vehicle)
      );
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const vehicle = await vehicleService.update(req.params.id, req.body);

      res.status(HTTP_STATUS.OK).json(
        successResponse("Vehicle updated successfully.", vehicle)
      );
    } catch (error) {
      next(error);
    }
  };

  delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await vehicleService.delete(req.params.id);

      res.status(HTTP_STATUS.OK).json(
        successResponse(result.message)
      );
    } catch (error) {
      next(error);
    }
  };
}

export const vehicleController = new VehicleController();
export default vehicleController;