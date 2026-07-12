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
    const response = await apiClient.post('/maintenance', data);
    return response.data?.data;
  }

  async update(id: string, data: any) {
    const response = await apiClient.put(`/maintenance/${id}`, data);
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
