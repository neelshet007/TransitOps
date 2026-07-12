import { z } from 'zod';

export const createDriverSchema = z.object({
  body: z.object({
    employee_id: z.string().min(2, 'Employee ID must be at least 2 characters').max(50),
    first_name: z.string().min(1, 'First name is required').max(100),
    last_name: z.string().min(1, 'Last name is required').max(100),
    phone: z.string().min(10, 'Invalid phone number').max(20),
    email: z.string().email('Invalid email address'),
    date_of_birth: z.string().optional().nullable(),
    gender: z.string().max(20).optional().nullable(),
    blood_group: z.string().max(10).optional().nullable(),
    address: z.string().optional().nullable(),
    city: z.string().max(100).optional().nullable(),
    state: z.string().max(100).optional().nullable(),
    pincode: z.string().max(10).optional().nullable(),
    emergency_contact_name: z.string().max(100).optional().nullable(),
    emergency_contact_phone: z.string().max(20).optional().nullable(),
    emergency_contact_relation: z.string().max(50).optional().nullable(),
    license_number: z.string().min(5, 'License number is too short').max(100),
    license_class: z.string().min(1, 'License class is required').max(50),
    license_issue_date: z.string().optional().nullable(),
    license_expiry: z.string().min(1, 'License expiry date is required'),
    license_issuing_authority: z.string().max(100).optional().nullable(),
    medical_certificate_number: z.string().max(100).optional().nullable(),
    medical_certificate_expiry: z.string().optional().nullable(),
    avatar_url: z.string().url('Invalid avatar URL').optional().nullable(),
    date_of_joining: z.string().optional().nullable(),
    experience_years: z.coerce.number().int().nonnegative().optional().default(0),
    availability: z.enum(['available', 'assigned', 'driving', 'resting', 'leave', 'training', 'suspended', 'unavailable']).optional().default('available'),
    status: z.enum(['active', 'inactive', 'suspended']).optional().default('active'),
    notes: z.string().optional().nullable(),
  }),
});

export const updateDriverSchema = z.object({
  body: z.object({
    employee_id: z.string().min(2).max(50).optional(),
    first_name: z.string().min(1).max(100).optional(),
    last_name: z.string().min(1).max(100).optional(),
    phone: z.string().min(10).max(20).optional(),
    email: z.string().email().optional(),
    date_of_birth: z.string().optional().nullable(),
    gender: z.string().max(20).optional().nullable(),
    blood_group: z.string().max(10).optional().nullable(),
    address: z.string().optional().nullable(),
    city: z.string().max(100).optional().nullable(),
    state: z.string().max(100).optional().nullable(),
    pincode: z.string().max(10).optional().nullable(),
    emergency_contact_name: z.string().max(100).optional().nullable(),
    emergency_contact_phone: z.string().max(20).optional().nullable(),
    emergency_contact_relation: z.string().max(50).optional().nullable(),
    license_number: z.string().min(5).max(100).optional(),
    license_class: z.string().min(1).max(50).optional(),
    license_issue_date: z.string().optional().nullable(),
    license_expiry: z.string().optional(),
    license_issuing_authority: z.string().max(100).optional().nullable(),
    medical_certificate_number: z.string().max(100).optional().nullable(),
    medical_certificate_expiry: z.string().optional().nullable(),
    avatar_url: z.string().url().optional().nullable(),
    date_of_joining: z.string().optional().nullable(),
    experience_years: z.coerce.number().int().nonnegative().optional(),
    availability: z.enum(['available', 'assigned', 'driving', 'resting', 'leave', 'training', 'suspended', 'unavailable']).optional(),
    status: z.enum(['active', 'inactive', 'suspended']).optional(),
    notes: z.string().optional().nullable(),
  }),
});

export const updateDriverStatusSchema = z.object({
  body: z.object({
    status: z.enum(['active', 'inactive', 'suspended']),
  }),
});

export const uploadDocumentSchema = z.object({
  body: z.object({
    document_type: z.enum(['driving_license', 'government_id', 'medical_certificate', 'police_verification', 'address_proof', 'photograph', 'employment_contract', 'other']),
    document_number: z.string().max(100).optional().nullable(),
    issue_date: z.string().optional().nullable(),
    expiry_date: z.string().optional().nullable(),
    issuing_authority: z.string().max(100).optional().nullable(),
    file_url: z.string().url('Invalid file URL').optional().nullable(),
    notes: z.string().optional().nullable(),
  }),
});

export const getDriversQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    search: z.string().optional(),
    status: z.string().optional(),
    availability: z.string().optional(),
  }),
});
