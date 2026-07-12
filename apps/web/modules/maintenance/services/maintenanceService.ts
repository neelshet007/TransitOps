import { maintenance } from '../../../lib/mockDb';

export class MaintenanceService {
  async getAll() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...maintenance];
  }

  async create(data: any) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const newMaint = {
      id: `maint-${7000 + maintenance.length}`,
      ...data,
      cost: Number(data.cost) || 0,
      status: 'scheduled',
    };
    maintenance.unshift(newMaint);
    return newMaint;
  }

  async update(id: string, data: any) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const index = maintenance.findIndex((m) => m.id === id);
    if (index === -1) throw new Error('Maintenance log not found');
    maintenance[index] = {
      ...maintenance[index],
      ...data,
    };
    return maintenance[index];
  }

  async delete(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = maintenance.findIndex((m) => m.id === id);
    if (index === -1) throw new Error('Maintenance log not found');
    maintenance.splice(index, 1);
    return { success: true };
  }
}

export const maintenanceService = new MaintenanceService();
export default maintenanceService;
