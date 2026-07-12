import apiClient from './apiClient';
import { APIResponse } from '@transitops/types';

export interface ApiUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  created_at: string;
  roles: string[];
  permissions: string[];
}

export interface PaginatedUsersResponse {
  data: ApiUser[];
  page: number;
  limit: number;
  total_records: number;
  total_pages: number;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  is_active?: boolean;
}

export interface UpdateUserPayload {
  email?: string;
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
}

export const getUsersApi = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
}): Promise<PaginatedUsersResponse> => {
  const response = await apiClient.get<{ data: ApiUser[]; meta: any }>('/users', { params });
  return {
    data: response.data.data,
    ...(response.data as any).meta,
  };
};

export const getUserByIdApi = async (id: string): Promise<ApiUser> => {
  const response = await apiClient.get<APIResponse<ApiUser>>(`/users/${id}`);
  return response.data.data!;
};

export const createUserApi = async (payload: CreateUserPayload): Promise<ApiUser> => {
  const response = await apiClient.post<APIResponse<ApiUser>>('/users', payload);
  return response.data.data!;
};

export const updateUserApi = async (id: string, payload: UpdateUserPayload): Promise<ApiUser> => {
  const response = await apiClient.put<APIResponse<ApiUser>>(`/users/${id}`, payload);
  return response.data.data!;
};

export const deleteUserApi = async (id: string): Promise<void> => {
  await apiClient.delete(`/users/${id}`);
};

export const resetPasswordApi = async (id: string, new_password: string): Promise<void> => {
  await apiClient.post(`/users/${id}/reset-password`, { new_password });
};

export const assignRoleApi = async (userId: string, role_id: string): Promise<ApiUser> => {
  const response = await apiClient.post<APIResponse<ApiUser>>(`/users/${userId}/roles`, { role_id });
  return response.data.data!;
};

export const removeRoleApi = async (userId: string, roleId: string): Promise<ApiUser> => {
  const response = await apiClient.delete<APIResponse<ApiUser>>(`/users/${userId}/roles/${roleId}`);
  return response.data.data!;
};
