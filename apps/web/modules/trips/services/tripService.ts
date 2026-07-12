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
    const payload = {
      vehicle_id: data.vehicle_id,
      driver_id: data.driver_id,
      origin: data.origin,
      destination: data.destination,
      start_time: data.start_time || new Date().toISOString(),
      start_odometer: parseInt(data.start_odometer || '0', 10),
      distance: data.distance ? parseFloat(data.distance) : 450,
      cargo: data.cargo || 'General Cargo',
      customer: data.customer || 'Standard Logistical Corp',
      notes: data.notes || '',
    };

    const response = await apiClient.post('/trips', payload);
    return response.data?.data;
  }

  async update(id: string, data: any) {
    const payload = {
      ...data,
      start_odometer: data.start_odometer ? parseInt(data.start_odometer, 10) : undefined,
      distance: data.distance ? parseFloat(data.distance) : undefined,
    };

    const response = await apiClient.put(`/trips/${id}`, payload);
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
