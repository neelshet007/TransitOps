import apiClient from '../../../services/apiClient';
import { APIResponse } from '@transitops/types';

class VehicleService {
  private normalizeVehicle(vehicle: any) {
    if (!vehicle) return vehicle;
    return {
      ...vehicle,
      current_mileage: vehicle.odometer ?? vehicle.current_mileage ?? 0,
    };
  }

  async getAll() {
    const response = await apiClient.get<APIResponse<any[]>>('/vehicles');
    return (response.data.data || []).map((vehicle) => this.normalizeVehicle(vehicle));
  }

  async getById(id: string) {
    const response = await apiClient.get<APIResponse<any>>(`/vehicles/${id}`);
    return this.normalizeVehicle(response.data.data);
  }

  async create(vehicle: any) {
    const payload = {
      plate_number: vehicle.plate_number,
      make: vehicle.make,
      model: vehicle.model,
      year: parseInt(vehicle.year, 10) || 2023,
      vin: vehicle.vin,
      status: vehicle.status || 'active',
      odometer: parseInt(vehicle.current_mileage || vehicle.odometer || '0', 10),
    };

    const response = await apiClient.post<APIResponse<any>>('/vehicles', payload);
    return this.normalizeVehicle(response.data.data);
  }

  async update(id: string, vehicle: any) {
    const payload = {
      plate_number: vehicle.plate_number,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year ? parseInt(vehicle.year, 10) : undefined,
      vin: vehicle.vin,
      status: vehicle.status,
      odometer: (vehicle.current_mileage !== undefined || vehicle.odometer !== undefined)
        ? parseInt(vehicle.current_mileage || vehicle.odometer, 10)
        : undefined,
    };

    const response = await apiClient.put<APIResponse<any>>(`/vehicles/${id}`, payload);
    return this.normalizeVehicle(response.data.data);
  }

  async delete(id: string) {
    const response = await apiClient.delete(`/vehicles/${id}`);
    return response.data;
  }
}

export const vehicleService = new VehicleService();
export default vehicleService;
