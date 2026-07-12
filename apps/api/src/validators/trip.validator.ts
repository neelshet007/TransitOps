import { z } from 'zod';

export const createTripSchema = z.object({
  body: z.object({
    vehicle_id: z.string().uuid('vehicle_id must be a valid UUID'),
    driver_id: z.string().uuid('driver_id must be a valid UUID'),
    origin: z.string().min(2, 'Origin must be at least 2 characters'),
    destination: z.string().min(2, 'Destination must be at least 2 characters'),
    start_time: z.string().min(1, 'Start time is required'),
    cargo: z.string().optional().nullable(),
    customer: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    distance: z.number().optional().nullable(),
    estimated_time: z.number().optional().nullable(),
  }),
});

export const updateTripStatusSchema = z.object({
  body: z.object({
    status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']),
    reason: z.string().optional().nullable(),
  }),
});

export const assignResourcesSchema = z.object({
  body: z.object({
    vehicle_id: z.string().uuid('vehicle_id must be a valid UUID'),
    driver_id: z.string().uuid('driver_id must be a valid UUID'),
  }),
});
