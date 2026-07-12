import {
  vehicleRepository,
  CreateVehicleDTO,
  UpdateVehicleDTO,
} from "../repositories/vehicle.repository";
import { ConflictError, NotFoundError } from "../helpers/errors";

export class VehicleService {
  async getAll() {
    return await vehicleRepository.findAll();
  }

  async getById(id: string) {
    const vehicle = await vehicleRepository.findById(id);

    if (!vehicle) {
      throw new NotFoundError("Vehicle not found.");
    }

    return vehicle;
  }

  async create(data: CreateVehicleDTO) {
    const existing = await vehicleRepository.findByPlateNumber(
      data.plate_number
    );

    if (existing) {
      throw new ConflictError("Vehicle with this plate number already exists.");
    }

    return await vehicleRepository.create(data);
  }

  async update(id: string, data: UpdateVehicleDTO) {
    const vehicle = await vehicleRepository.findById(id);

    if (!vehicle) {
      throw new NotFoundError("Vehicle not found.");
    }

    return await vehicleRepository.update(id, data);
  }

  async delete(id: string) {
    const vehicle = await vehicleRepository.findById(id);

    if (!vehicle) {
      throw new NotFoundError("Vehicle not found.");
    }

    await vehicleRepository.delete(id);

    return {
      message: "Vehicle deleted successfully.",
    };
  }
}

export const vehicleService = new VehicleService();
export default vehicleService;