import apiClient from '../../../services/apiClient';
import { fuelLogs } from '../../../lib/mockDb';

export class FuelService {
  async getAll(params?: { page?: number; limit?: number; vehicle_id?: string; driver_id?: string }) {
    try {
      const response = await apiClient.get('/fuel', { params });
      const apiData = response.data?.data ?? [];
      if (apiData.length === 0) return fuelLogs;
      return apiData;
    } catch {
      return fuelLogs;
    }
  }

  async getDashboard() {
    try {
      const response = await apiClient.get('/fuel/dashboard');
      return response.data?.data;
    } catch {
      const totalCost = fuelLogs.reduce((sum, f) => sum + (f.cost || 0), 0);
      const totalLiters = fuelLogs.reduce((sum, f) => sum + (f.gallons || 0), 0);
      return {
        total_fuel_cost: totalCost,
        total_liters: totalLiters,
        total_logs: fuelLogs.length
      };
    }
  }

  async getAnalytics() {
    try {
      const response = await apiClient.get('/fuel/analytics');
      return response.data?.data;
    } catch {
      // Mock month grouping fallback
      return {
        trends: [
          { month: new Date(Date.now() - 60*24*60*60*1000).toISOString(), quantity: 12000, amount: 1100000 },
          { month: new Date(Date.now() - 30*24*60*60*1000).toISOString(), quantity: 14500, amount: 1350000 },
          { month: new Date().toISOString(), quantity: 15800, amount: 1485000 }
        ]
      };
    }
  }

  async create(data: any) {
    const payload: any = {
      vehicle_id: data.vehicle_id || 'veh-1000',
      driver_id: data.driver_id || null,
      trip_id: data.trip_id || null,
      fuel_type: data.fuel_type || 'Diesel',
      quantity: Number(data.gallons || data.quantity || 0),
      price_per_liter: Number(data.price_per_liter || (data.cost / (data.gallons || 1)) || 93.5),
      total_cost: Number(data.cost || data.total_cost || 0),
      odometer: Number(data.odometer || 0),
      fuel_date: data.refuel_date || data.fuel_date || new Date().toISOString().split('T')[0],
      payment_method: data.payment_method || 'Cash',
      notes: data.notes || `Station: ${data.station_name || ''}`.trim() || null,
    };

    const newMockFuel = {
      id: `fuel-${6000 + fuelLogs.length}`,
      vehicle_id: payload.vehicle_id,
      vehicle_plate: data.vehicle_plate || 'MH-12-Q-4521',
      driver_id: payload.driver_id,
      driver_name: data.driver_name || 'Assigned Driver',
      refuel_date: payload.fuel_date,
      gallons: payload.quantity,
      cost: payload.total_cost,
      odometer: payload.odometer,
      station_name: data.station_name || 'Indian Oil Retail Outlet',
      receipt_number: data.receipt_number || `REC-${80000 + fuelLogs.length}`
    };
    fuelLogs.unshift(newMockFuel);

    try {
      const response = await apiClient.post('/fuel', payload);
      return response.data?.data;
    } catch (e) {
      console.warn('Backend create fuel log failed, falling back to mock data', e);
      return newMockFuel;
    }
  }

  async update(id: string, data: any) {
    const index = fuelLogs.findIndex((f) => f.id === id);
    if (index !== -1) {
      fuelLogs[index] = {
        ...fuelLogs[index],
        ...data,
      };
    }
    try {
      const response = await apiClient.put(`/fuel/${id}`, data);
      return response.data?.data;
    } catch (e) {
      console.warn('Backend update fuel log failed, falling back to mock data', e);
      return fuelLogs[index] || data;
    }
  }

  async delete(id: string) {
    const index = fuelLogs.findIndex((f) => f.id === id);
    if (index !== -1) {
      fuelLogs.splice(index, 1);
    }
    try {
      const response = await apiClient.delete(`/fuel/${id}`);
      return response.data;
    } catch (e) {
      console.warn('Backend delete fuel log failed, falling back to mock data', e);
      return { success: true };
    }
  }
}

export const fuelService = new FuelService();
export default fuelService;
