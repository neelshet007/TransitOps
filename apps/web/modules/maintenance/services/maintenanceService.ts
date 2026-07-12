import apiClient from '../../../services/apiClient';

export class MaintenanceService {
  async getAll(params?: { page?: number; limit?: number; status?: string; vehicle_id?: string }) {
    const response = await apiClient.get('/maintenance', { params });
    return response.data?.data ?? [];
  }

  async getDashboard() {
    const response = await apiClient.get('/maintenance/dashboard');
    return response.data?.data;
  }

  async getCalendar() {
    const response = await apiClient.get('/maintenance/calendar');
    return response.data?.data ?? [];
  }

  async getById(id: string) {
    const response = await apiClient.get(`/maintenance/${id}`);
    return response.data?.data;
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

    const response = await apiClient.post('/maintenance', payload);
    return response.data?.data;
  }

  async update(id: string, data: any) {
    const payload = {
      ...data,
      parts_cost: data.parts_cost ? parseFloat(data.parts_cost) : undefined,
      labour_cost: data.labour_cost ? parseFloat(data.labour_cost) : undefined,
    };

    const response = await apiClient.put(`/maintenance/${id}`, payload);
    return response.data?.data;
  }

  async updateStatus(id: string, status: string, notes?: string) {
    const response = await apiClient.patch(`/maintenance/${id}/status`, { status, notes });
    return response.data?.data;
  }

  async delete(id: string) {
    const response = await apiClient.delete(`/maintenance/${id}`);
    return response.data;
  }
}

export const maintenanceService = new MaintenanceService();
export default maintenanceService;
