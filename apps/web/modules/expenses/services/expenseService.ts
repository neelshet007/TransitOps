import apiClient from '../../../services/apiClient';

export class ExpenseService {
  async getAll(params?: { page?: number; limit?: number; status?: string; vehicle_id?: string }) {
    const response = await apiClient.get('/expenses', { params });
    return response.data?.data ?? [];
  }

  async getDashboard() {
    const response = await apiClient.get('/expenses/dashboard');
    return response.data?.data;
  }

  async getById(id: string) {
    const response = await apiClient.get(`/expenses/${id}`);
    return response.data?.data;
  }

  async create(data: any) {
    const response = await apiClient.post('/expenses', data);
    return response.data?.data;
  }

  async update(id: string, data: any) {
    const response = await apiClient.put(`/expenses/${id}`, data);
    return response.data?.data;
  }

  async updateStatus(id: string, status: string) {
    const response = await apiClient.patch(`/expenses/${id}/status`, { status });
    return response.data?.data;
  }

  async delete(id: string) {
    const response = await apiClient.delete(`/expenses/${id}`);
    return response.data;
  }
}

export const expenseService = new ExpenseService();
export default expenseService;
