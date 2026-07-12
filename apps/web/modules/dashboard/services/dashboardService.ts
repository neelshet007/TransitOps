import apiClient from '../../../services/apiClient';
import { APIResponse } from '@transitops/types';

export class DashboardService {
  async getStats() {
    const response = await apiClient.get<APIResponse<any>>('/dashboard/stats');
    return response.data.data!;
  }

  async logActivity(data: { action: string; details: string }) {
    await apiClient.post('/dashboard/activity', data);
  }

  async getAnalyticsTrends(range = 'monthly') {
    const response = await apiClient.get<APIResponse<any>>('/analytics/trends', { params: { range } });
    return response.data.data ?? [];
  }

  async getFuelAnalytics() {
    const response = await apiClient.get<APIResponse<any>>('/fuel/analytics');
    return response.data.data ?? { trends: [] };
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;
