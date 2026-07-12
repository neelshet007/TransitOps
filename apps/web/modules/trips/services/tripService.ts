import { trips } from '../../../lib/mockDb';

export class TripService {
  async getAll() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...trips];
  }

  async getById(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const trip = trips.find((t) => t.id === id);
    if (!trip) throw new Error('Trip not found');
    return { ...trip };
  }

  async create(data: any) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const newTrip = {
      id: `trp-${5000 + trips.length}`,
      trip_number: `TRP-${10000 + trips.length}`,
      ...data,
      start_time: new Date().toISOString(),
      status: 'scheduled',
    };
    trips.unshift(newTrip); // Push to top of list
    return newTrip;
  }

  async update(id: string, data: any) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const index = trips.findIndex((t) => t.id === id);
    if (index === -1) throw new Error('Trip not found');

    trips[index] = {
      ...trips[index],
      ...data,
    };
    return trips[index];
  }

  async delete(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = trips.findIndex((t) => t.id === id);
    if (index === -1) throw new Error('Trip not found');
    trips.splice(index, 1);
    return { success: true };
  }
}

export const tripService = new TripService();
export default tripService;
