import apiClient from './apiClient';
import { APIResponse } from '@transitops/types';

export interface ApiRole {
  id: string;
  name: string;
  code: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  permissions: string[];
}

export interface ApiPermission {
  id: string;
  name: string;
  code: string;
  description: string | null;
}

export interface CreateRolePayload {
  name: string;
  code: string;
  description?: string;
}

export interface UpdateRolePayload {
  name?: string;
  description?: string;
}

export const getRolesApi = async (): Promise<ApiRole[]> => {
  const response = await apiClient.get<APIResponse<ApiRole[]>>('/roles');
  return response.data.data!;
};

export const getRoleByIdApi = async (id: string): Promise<ApiRole> => {
  const response = await apiClient.get<APIResponse<ApiRole>>(`/roles/${id}`);
  return response.data.data!;
};

export const createRoleApi = async (payload: CreateRolePayload): Promise<ApiRole> => {
  const response = await apiClient.post<APIResponse<ApiRole>>('/roles', payload);
  return response.data.data!;
};

export const updateRoleApi = async (id: string, payload: UpdateRolePayload): Promise<ApiRole> => {
  const response = await apiClient.put<APIResponse<ApiRole>>(`/roles/${id}`, payload);
  return response.data.data!;
};

export const deleteRoleApi = async (id: string): Promise<void> => {
  await apiClient.delete(`/roles/${id}`);
};

export const setRolePermissionsApi = async (
  roleId: string,
  permission_ids: string[],
): Promise<ApiRole> => {
  const response = await apiClient.put<APIResponse<ApiRole>>(`/roles/${roleId}/permissions`, {
    permission_ids,
  });
  return response.data.data!;
};

export const getPermissionsApi = async (): Promise<ApiPermission[]> => {
  const response = await apiClient.get<APIResponse<ApiPermission[]>>('/permissions');
  return response.data.data!;
};
