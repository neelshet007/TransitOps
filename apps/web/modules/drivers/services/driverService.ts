import { drivers } from '../../../lib/mockDb';

export class DriverService {
  async getAll() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...drivers];
  }

  async getById(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const drv = drivers.find((d) => d.id === id);
    if (!drv) throw new Error('Driver not found');
    return { ...drv };
  }

  async create(data: any) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const newDrv = {
      id: `drv-${2000 + drivers.length}`,
      ...data,
      rating: '5.0',
      join_date: new Date().toISOString().split('T')[0],
      current_vehicle_plate: 'N/A',
    };
    drivers.push(newDrv);
    return newDrv;
  }

  async update(id: string, data: any) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const index = drivers.findIndex((d) => d.id === id);
    if (index === -1) throw new Error('Driver not found');

    drivers[index] = {
      ...drivers[index],
      ...data,
    };
    return drivers[index];
  }

  async delete(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = drivers.findIndex((d) => d.id === id);
    if (index === -1) throw new Error('Driver not found');
    drivers.splice(index, 1);
    return { success: true };
  }
}

export const driverService = new DriverService();
export default driverService;
