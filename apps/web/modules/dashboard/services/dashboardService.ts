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
}

export const dashboardService = new DashboardService();
export default dashboardService;
