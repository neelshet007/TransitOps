import { fuelLogs } from '../../../lib/mockDb';

export class FuelService {
  async getAll() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...fuelLogs];
  }

  async create(data: any) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const newLog = {
      id: `fuel-${6000 + fuelLogs.length}`,
      ...data,
      gallons: Number(data.gallons) || 0,
      cost: Number(data.cost) || 0,
      odometer: Number(data.odometer) || 0,
    };
    fuelLogs.unshift(newLog);
    return newLog;
  }

  async update(id: string, data: any) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const index = fuelLogs.findIndex((f) => f.id === id);
    if (index === -1) throw new Error('Fuel log not found');
    fuelLogs[index] = {
      ...fuelLogs[index],
      ...data,
    };
    return fuelLogs[index];
  }

  async delete(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = fuelLogs.findIndex((f) => f.id === id);
    if (index === -1) throw new Error('Fuel log not found');
    fuelLogs.splice(index, 1);
    return { success: true };
  }
}

export const fuelService = new FuelService();
export default fuelService;
