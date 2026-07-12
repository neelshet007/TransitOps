import apiClient from '../../../services/apiClient';
import { maintenance } from '../../../lib/mockDb';

export class MaintenanceService {
  async getAll(params?: { page?: number; limit?: number; status?: string; vehicle_id?: string }) {
    try {
      const response = await apiClient.get('/maintenance', { params });
      const apiData = response.data?.data ?? [];
      if (apiData.length === 0) return maintenance;
      return apiData;
    } catch {
      return maintenance;
    }
  }

  async getDashboard() {
    try {
      const response = await apiClient.get('/maintenance/dashboard');
      return response.data?.data;
    } catch {
      // Mock metrics fallback
      const total = maintenance.length;
      const scheduled = maintenance.filter(m => m.status === 'scheduled').length;
      const progress = maintenance.filter(m => m.status === 'in_progress').length;
      const completed = maintenance.filter(m => m.status === 'completed').length;
      return {
        total_tasks: total,
        pending_tasks: scheduled,
        in_progress_tasks: progress,
        completed_tasks: completed,
        total_cost: maintenance.reduce((sum, m) => sum + (m.cost || 0), 0)
      };
    }
  }

  async getCalendar() {
    try {
      const response = await apiClient.get('/maintenance/calendar');
      return response.data?.data ?? [];
    } catch {
      return maintenance.map(m => ({
        id: m.id,
        title: `${m.vehicle_plate}: ${m.type}`,
        start: m.scheduled_date,
        end: m.completed_date || m.scheduled_date,
        color: m.status === 'completed' ? '#34D399' : m.status === 'in_progress' ? '#60A5FA' : '#FCD34D'
      }));
    }
  }

  async getById(id: string) {
    try {
      const response = await apiClient.get(`/maintenance/${id}`);
      return response.data?.data;
    } catch {
      const found = maintenance.find((m) => m.id === id);
      if (!found) throw new Error('Maintenance log not found');
      return found;
    }
  }

  async create(data: any) {
    const payload = {
      vehicle_id: data.vehicle_id || 'veh-1000',
      maintenance_type_id: data.maintenance_type_id || '11b3dfb3-345a-4bdf-5ab9-8fedd08f2fff', // default from seeds
      scheduled_date: data.scheduled_date || new Date().toISOString().split('T')[0],
      parts_cost: parseFloat(data.parts_cost || data.cost || '0'),
      labour_cost: parseFloat(data.labour_cost || '0'),
      notes: data.notes || '',
      status: data.status || 'scheduled',
      service_center: data.service_center || 'Tata Authorized Service Station',
    };

    const newMockMaint = {
      id: `maint-${7000 + maintenance.length}`,
      ...payload,
      cost: payload.parts_cost + payload.labour_cost,
      vehicle_plate: data.vehicle_plate || 'MH-12-Q-4521',
      completed_date: null,
      type: data.type || 'Routine Service'
    };
    maintenance.unshift(newMockMaint);

    try {
      const response = await apiClient.post('/maintenance', payload);
      return response.data?.data;
    } catch (e) {
      console.warn('Backend create maintenance failed, falling back to mock data', e);
      return newMockMaint;
    }
  }

  async update(id: string, data: any) {
    const payload = {
      ...data,
      parts_cost: data.parts_cost ? parseFloat(data.parts_cost) : undefined,
      labour_cost: data.labour_cost ? parseFloat(data.labour_cost) : undefined,
    };

    const index = maintenance.findIndex((m) => m.id === id);
    if (index !== -1) {
      maintenance[index] = {
        ...maintenance[index],
        ...data,
      };
    }

    try {
      const response = await apiClient.put(`/maintenance/${id}`, payload);
      return response.data?.data;
    } catch (e) {
      console.warn('Backend update maintenance failed, falling back to mock data', e);
      return maintenance[index] || data;
    }
  }

  async updateStatus(id: string, status: string, notes?: string) {
    const index = maintenance.findIndex((m) => m.id === id);
    if (index !== -1) {
      maintenance[index].status = status;
      if (status === 'completed') {
        maintenance[index].completed_date = new Date().toISOString().split('T')[0];
      }
    }

    try {
      const response = await apiClient.patch(`/maintenance/${id}/status`, { status, notes });
      return response.data?.data;
    } catch (e) {
      console.warn('Backend update maintenance status failed, falling back to mock data', e);
      return maintenance[index];
    }
  }

  async delete(id: string) {
    const index = maintenance.findIndex((m) => m.id === id);
    if (index !== -1) {
      maintenance.splice(index, 1);
    }
    try {
      const response = await apiClient.delete(`/maintenance/${id}`);
      return response.data;
    } catch (e) {
      console.warn('Backend delete maintenance failed, falling back to mock data', e);
      return { success: true };
    }
  }
}

export const maintenanceService = new MaintenanceService();
export default maintenanceService;
