import apiClient from './apiClient';
import { APIResponse } from '@transitops/types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  roles: string[];
  permissions: string[];
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export const loginApi = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await apiClient.post<APIResponse<LoginResponse>>('/auth/login', payload);
  return response.data.data!;
};

export const logoutApi = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
};

export const refreshApi = async (): Promise<{ accessToken: string }> => {
  const response = await apiClient.post<APIResponse<{ accessToken: string }>>('/auth/refresh');
  return response.data.data!;
};

export const meApi = async (): Promise<AuthUser> => {
  const response = await apiClient.get<APIResponse<AuthUser>>('/auth/me');
  return response.data.data!;
};
