import { vehicles } from '../../../lib/mockDb';

export class VehicleService {
  async getAll() {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...vehicles];
  }

  async getById(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const veh = vehicles.find((v) => v.id === id);
    if (!veh) throw new Error('Vehicle not found');
    return { ...veh };
  }

  async create(data: any) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const newVeh = {
      id: `veh-${1000 + vehicles.length}`,
      ...data,
      current_mileage: Number(data.current_mileage) || 0,
      year: Number(data.year) || new Date().getFullYear(),
      last_service_date: new Date().toISOString().split('T')[0],
    };
    vehicles.push(newVeh);
    return newVeh;
  }

  async update(id: string, data: any) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const index = vehicles.findIndex((v) => v.id === id);
    if (index === -1) throw new Error('Vehicle not found');

    vehicles[index] = {
      ...vehicles[index],
      ...data,
    };
    return vehicles[index];
  }

  async delete(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = vehicles.findIndex((v) => v.id === id);
    if (index === -1) throw new Error('Vehicle not found');
    vehicles.splice(index, 1);
    return { success: true };
  }
}

export const vehicleService = new VehicleService();
export default vehicleService;
