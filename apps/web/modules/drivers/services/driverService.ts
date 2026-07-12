import apiClient from '../../../services/apiClient';
import { APIResponse, Driver, DriverDocument } from '@transitops/types';

export class DriverService {
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    availability?: string;
  }) {
    const response = await apiClient.get<APIResponse<Driver[]>>('/drivers', { params });
    return {
      data: response.data.data || [],
      meta: response.data.meta || { page: 1, limit: 20, total_records: 0, total_pages: 1 }
    };
  }

  async getById(id: string) {
    const response = await apiClient.get<APIResponse<Driver>>(`/drivers/${id}`);
    return response.data.data;
  }

  async getDashboardStats() {
    const response = await apiClient.get<APIResponse<any>>('/drivers/dashboard');
    return response.data.data;
  }

  async create(data: Partial<Driver>) {
    const response = await apiClient.post<APIResponse<Driver>>('/drivers', data);
    return response.data.data!;
  }

  async update(id: string, data: Partial<Driver>) {
    const response = await apiClient.put<APIResponse<Driver>>(`/drivers/${id}`, data);
    return response.data.data!;
  }

  async delete(id: string) {
    await apiClient.delete(`/drivers/${id}`);
  }

  async restore(id: string) {
    const response = await apiClient.post<APIResponse<Driver>>(`/drivers/${id}/restore`);
    return response.data.data!;
  }

  async updateStatus(id: string, status: string) {
    const response = await apiClient.patch<APIResponse<Driver>>(`/drivers/${id}/status`, { status });
    return response.data.data!;
  }

  async getDocuments(driverId: string) {
    const response = await apiClient.get<APIResponse<DriverDocument[]>>(`/drivers/${driverId}/documents`);
    return response.data.data || [];
  }

  async uploadDocument(driverId: string, data: Partial<DriverDocument>) {
    const response = await apiClient.post<APIResponse<DriverDocument>>(`/drivers/${driverId}/documents`, data);
    return response.data.data!;
  }

  async verifyDocument(driverId: string, docId: string, verified: boolean, notes?: string) {
    const response = await apiClient.put<APIResponse<DriverDocument>>(`/drivers/${driverId}/documents/${docId}/verify`, { verified, notes });
    return response.data.data!;
  }

  async deleteDocument(driverId: string, docId: string) {
    await apiClient.delete(`/drivers/${driverId}/documents/${docId}`);
  }
}

export const driverService = new DriverService();
export default driverService;
