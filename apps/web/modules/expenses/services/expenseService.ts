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
    const payload = {
      trip_id: data.trip_id || null,
      vehicle_id: data.vehicle_id || null,
      expense_category_id: data.expense_category_id || '33d5dfd5-567c-4ddf-7ab9-afedd0af4fff', // default from seeds
      amount: parseFloat(data.amount || '0'),
      expense_date: data.expense_date || new Date().toISOString().split('T')[0],
      notes: data.notes || '',
      driver_id: data.driver_id || null,
      status: data.status || 'pending',
      gst_number: data.gst_number || '',
      gst_rate: data.gst_rate ? parseFloat(data.gst_rate) : 18.0,
      vendor_name: data.vendor_name || 'Generic Vendor',
      invoice_number: data.invoice_number || '',
    };

    const response = await apiClient.post('/expenses', payload);
    return response.data?.data;
  }

  async update(id: string, data: any) {
    const payload = {
      ...data,
      amount: data.amount ? parseFloat(data.amount) : undefined,
      gst_rate: data.gst_rate ? parseFloat(data.gst_rate) : undefined,
    };

    const response = await apiClient.put(`/expenses/${id}`, payload);
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
