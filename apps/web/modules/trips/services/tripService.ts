import apiClient from '../../../services/apiClient';
import { trips } from '../../../lib/mockDb';

export class TripService {
  async getAll(params?: { page?: number; limit?: number; status?: string; search?: string }) {
    try {
      const response = await apiClient.get('/trips', { params });
      const apiData = response.data?.data ?? [];
      if (apiData.length === 0) return trips;
      return apiData;
    } catch {
      return trips;
    }
  }

  async getById(id: string) {
    try {
      const response = await apiClient.get(`/trips/${id}`);
      return response.data?.data;
    } catch {
      const found = trips.find((t) => t.id === id);
      if (!found) throw new Error('Trip not found');
      return found;
    }
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

    const newMockTrip = {
      id: `trp-${5000 + trips.length}`,
      trip_number: `TRP-${10000 + trips.length}`,
      ...payload,
      status: 'scheduled',
      vehicle_plate: data.vehicle_plate || 'MH-12-Q-4521',
      driver_name: data.driver_name || 'Assigned Driver',
    };
    trips.unshift(newMockTrip);

    try {
      const response = await apiClient.post('/trips', payload);
      return response.data?.data;
    } catch (e) {
      console.warn('Backend create trip failed, falling back to mock data', e);
      return newMockTrip;
    }
  }

  async update(id: string, data: any) {
    const payload = {
      ...data,
      start_odometer: data.start_odometer ? parseInt(data.start_odometer, 10) : undefined,
      distance: data.distance ? parseFloat(data.distance) : undefined,
    };

    const index = trips.findIndex((t) => t.id === id);
    if (index !== -1) {
      trips[index] = {
        ...trips[index],
        ...data,
      };
    }

    try {
      const response = await apiClient.put(`/trips/${id}`, payload);
      return response.data?.data;
    } catch (e) {
      console.warn('Backend update trip failed, falling back to mock data', e);
      return trips[index] || data;
    }
  }

  async updateStatus(id: string, status: string, reason?: string) {
    const index = trips.findIndex((t) => t.id === id);
    if (index !== -1) {
      trips[index].status = status;
    }

    try {
      const response = await apiClient.patch(`/trips/${id}/status`, { status, reason });
      return response.data?.data;
    } catch (e) {
      console.warn('Backend update status failed, falling back to mock data', e);
      return trips[index];
    }
  }

  async assignResources(id: string, vehicleId: string, driverId: string) {
    const index = trips.findIndex((t) => t.id === id);
    if (index !== -1) {
      trips[index].vehicle_id = vehicleId;
      trips[index].driver_id = driverId;
    }

    try {
      const response = await apiClient.post(`/trips/${id}/assign`, { vehicle_id: vehicleId, driver_id: driverId });
      return response.data?.data;
    } catch (e) {
      console.warn('Backend assign resources failed, falling back to mock data', e);
      return trips[index];
    }
  }

  async delete(id: string) {
    const index = trips.findIndex((t) => t.id === id);
    if (index !== -1) {
      trips.splice(index, 1);
    }
    try {
      const response = await apiClient.delete(`/trips/${id}`);
      return response.data;
    } catch (e) {
      console.warn('Backend delete trip failed, falling back to mock data', e);
      return { success: true };
    }
  }
}

export const tripService = new TripService();
export default tripService;
