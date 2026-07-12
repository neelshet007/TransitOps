import apiClient from '../../../services/apiClient';

export class NotificationService {
  async getAll(params?: { page?: number; limit?: number; is_read?: boolean }) {
    const response = await apiClient.get('/notifications', { params });
    return response.data?.data ?? [];
  }

  async create(data: { title: string; message: string; type?: string; user_id?: string; action_url?: string }) {
    const response = await apiClient.post('/notifications', data);
    return response.data?.data;
  }

  async markAsRead(id: string) {
    const response = await apiClient.patch(`/notifications/${id}/read`);
    return response.data;
  }

  async markAllAsRead() {
    const response = await apiClient.patch('/notifications/read-all');
    return response.data;
  }

  async delete(id: string) {
    const response = await apiClient.delete(`/notifications/${id}`);
    return response.data;
  }
}

export const notificationService = new NotificationService();
export default notificationService;
