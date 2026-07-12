import apiClient from '../../../services/apiClient';

export class TripService {
  async getAll(params?: { page?: number; limit?: number; status?: string; search?: string }) {
    const response = await apiClient.get('/trips', { params });
    return response.data?.data ?? [];
  }

  async getById(id: string) {
    const response = await apiClient.get(`/trips/${id}`);
    return response.data?.data;
  }

  async create(data: any) {
    const response = await apiClient.post('/trips', data);
    return response.data?.data;
  }

  async update(id: string, data: any) {
    const response = await apiClient.put(`/trips/${id}`, data);
    return response.data?.data;
  }

  async updateStatus(id: string, status: string, reason?: string) {
    const response = await apiClient.patch(`/trips/${id}/status`, { status, reason });
    return response.data?.data;
  }

  async assignResources(id: string, vehicleId: string, driverId: string) {
    const response = await apiClient.post(`/trips/${id}/assign`, { vehicle_id: vehicleId, driver_id: driverId });
    return response.data?.data;
  }

  async delete(id: string) {
    const response = await apiClient.delete(`/trips/${id}`);
    return response.data;
  }
}

export const tripService = new TripService();
export default tripService;
