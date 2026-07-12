import { z } from "zod";

export const createVehicleSchema = z.object({
  body: z.object({
    plate_number: z.string().min(1),
    make: z.string().min(1),
    model: z.string().min(1),
    year: z.number().int().min(1990),
    vin: z.string().min(5),
    status: z.enum(["active", "inactive", "maintenance"]).optional(),
  }),
});

export const updateVehicleSchema = z.object({
  body: z.object({
    plate_number: z.string().optional(),
    make: z.string().optional(),
    model: z.string().optional(),
    year: z.number().optional(),
    vin: z.string().optional(),
    status: z.enum(["active", "inactive", "maintenance"]).optional(),
  }),
});