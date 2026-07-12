import apiClient from '../../../services/apiClient';
import { APIResponse } from '@transitops/types';
import { vehicles } from '../../../lib/mockDb';

class VehicleService {
  async getAll() {
    try {
      const response = await apiClient.get<APIResponse<any[]>>('/vehicles');
      const apiData = response.data.data || [];
      if (apiData.length === 0) return vehicles;
      return apiData.map(v => ({
        ...v,
        current_mileage: v.odometer || v.current_mileage || 0
      }));
    } catch {
      return vehicles;
    }
  }

  async getById(id: string) {
    try {
      const response = await apiClient.get<APIResponse<any>>(`/vehicles/${id}`);
      const v = response.data.data;
      if (v) {
        v.current_mileage = v.odometer || v.current_mileage || 0;
      }
      return v;
    } catch {
      const found = vehicles.find((v) => v.id === id);
      if (!found) throw new Error('Vehicle not found');
      return found;
    }
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

    const newMockVehicle = {
      id: `veh-${1000 + vehicles.length}`,
      ...payload,
      current_mileage: payload.odometer,
      last_service_date: new Date().toISOString().split('T')[0],
    };
    vehicles.unshift(newMockVehicle);

    try {
      const response = await apiClient.post<APIResponse<any>>('/vehicles', payload);
      const res = response.data.data;
      if (res) {
        res.current_mileage = res.odometer || res.current_mileage || 0;
      }
      return res || newMockVehicle;
    } catch (e) {
      console.warn('Backend create vehicle failed, falling back to mock data', e);
      return newMockVehicle;
    }
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

    const index = vehicles.findIndex((v) => v.id === id);
    if (index !== -1) {
      vehicles[index] = {
        ...vehicles[index],
        ...vehicle,
        current_mileage: payload.odometer !== undefined ? payload.odometer : vehicles[index].current_mileage,
      };
    }

    try {
      const response = await apiClient.put<APIResponse<any>>(`/vehicles/${id}`, payload);
      const res = response.data.data;
      if (res) {
        res.current_mileage = res.odometer || res.current_mileage || 0;
      }
      return res || vehicles[index];
    } catch (e) {
      console.warn('Backend update vehicle failed, falling back to mock data', e);
      return vehicles[index] || vehicle;
    }
  }

  async delete(id: string) {
    const index = vehicles.findIndex((v) => v.id === id);
    if (index !== -1) {
      vehicles.splice(index, 1);
    }
    try {
      const response = await apiClient.delete(`/vehicles/${id}`);
      return response.data;
    } catch (e) {
      console.warn('Backend delete vehicle failed, falling back to mock data', e);
      return { success: true };
    }
  }
}

export const vehicleService = new VehicleService();
export default vehicleService;