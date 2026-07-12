import { z } from 'zod';

export const createRoleSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Role name is required').max(100),
    code: z
      .string()
      .min(1, 'Role code is required')
      .max(50)
      .regex(/^[a-z_]+$/, 'Code must be lowercase letters and underscores only'),
    description: z.string().max(255).optional(),
  }),
});

export const updateRoleSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(255).optional(),
  }),
});

export const setPermissionsSchema = z.object({
  body: z.object({
    permission_ids: z.array(z.string().uuid('Invalid permission ID')),
  }),
});

export const assignPermissionSchema = z.object({
  body: z.object({
    permission_id: z.string().uuid('Invalid permission ID'),
  }),
});
