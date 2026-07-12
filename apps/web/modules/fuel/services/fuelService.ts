import apiClient from '../../../services/apiClient';

export class FuelService {
  async getAll(params?: { page?: number; limit?: number; vehicle_id?: string; driver_id?: string }) {
    const response = await apiClient.get('/fuel', { params });
    return response.data?.data ?? [];
  }

  async getDashboard() {
    const response = await apiClient.get('/fuel/dashboard');
    return response.data?.data;
  }

  async getAnalytics() {
    const response = await apiClient.get('/fuel/analytics');
    return response.data?.data;
  }

  async create(data: any) {
    // Map frontend field names to backend expected names
    const payload: any = {
      vehicle_id: data.vehicle_id,
      driver_id: data.driver_id || null,
      trip_id: data.trip_id || null,
      fuel_type: data.fuel_type || 'Diesel',
      quantity: Number(data.gallons || data.quantity || 0),
      price_per_liter: Number(data.price_per_liter || (data.cost / (data.gallons || 1)) || 0),
      total_cost: Number(data.cost || data.total_cost || 0),
      odometer: Number(data.odometer || 0),
      fuel_date: data.refuel_date || data.fuel_date || new Date().toISOString().split('T')[0],
      payment_method: data.payment_method || 'Cash',
      notes: data.notes || `Station: ${data.station_name || ''}`.trim() || null,
    };

    const response = await apiClient.post('/fuel', payload);
    return response.data?.data;
  }

  async update(id: string, data: any) {
    const response = await apiClient.put(`/fuel/${id}`, data);
    return response.data?.data;
  }

  async delete(id: string) {
    const response = await apiClient.delete(`/fuel/${id}`);
    return response.data;
  }
}

export const fuelService = new FuelService();
export default fuelService;
