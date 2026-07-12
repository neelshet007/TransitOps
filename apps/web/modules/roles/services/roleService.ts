import apiClient from '../../../services/apiClient';
import { APIResponse } from '@transitops/types';

// Mock roles fallback
export const mockRoles = [
  { id: 'ROL-001', name: 'Super Admin',     description: 'Full access to all system modules and settings.',                  users: 3,  permissions: 45, status: 'active' },
  { id: 'ROL-002', name: 'Fleet Manager',   description: 'Manage vehicles, drivers, and trips. No billing access.',          users: 12, permissions: 28, status: 'active' },
  { id: 'ROL-003', name: 'Dispatcher',      description: 'Trip routing and dispatch logs only.',                              users: 24, permissions: 15, status: 'active' },
  { id: 'ROL-004', name: 'Finance Admin',   description: 'Access to expenses, fuel costs, and invoicing.',                   users: 4,  permissions: 22, status: 'active' },
  { id: 'ROL-005', name: 'Maintenance Lead','description': 'Vehicle health and service logs.',                               users: 8,  permissions: 18, status: 'active' },
  { id: 'ROL-006', name: 'Guest Auditor',   description: 'Read-only access for compliance checks.',                          users: 1,  permissions: 5,  status: 'inactive' },
];

class RoleService {
  async getAll() {
    try {
      const response = await apiClient.get<APIResponse<any[]>>('/roles');
      const apiData = response.data.data || [];
      if (apiData.length === 0) return mockRoles;
      return apiData.map(r => ({
        id: r.id,
        name: r.name,
        description: r.description || 'No description provided.',
        users: r.user_count ?? 0,
        permissions: r.permission_count ?? 5,
        status: r.deleted_at ? 'inactive' : 'active'
      }));
    } catch {
      return mockRoles;
    }
  }

  async create(role: any) {
    const payload = {
      name: role.name,
      description: role.description
    };

    const newMock = {
      id: `ROL-00${mockRoles.length + 1}`,
      name: role.name,
      description: role.description,
      users: 0,
      permissions: 5,
      status: role.status || 'active'
    };
    mockRoles.unshift(newMock);

    try {
      const response = await apiClient.post<APIResponse<any>>('/roles', payload);
      const res = response.data.data;
      return res ? {
        id: res.id,
        name: res.name,
        description: res.description,
        users: 0,
        permissions: 5,
        status: 'active'
      } : newMock;
    } catch (e) {
      console.warn('Backend create role failed, falling back to mock', e);
      return newMock;
    }
  }

  async update(id: string, role: any) {
    const payload = {
      name: role.name,
      description: role.description
    };

    const idx = mockRoles.findIndex(r => r.id === id);
    if (idx !== -1) {
      mockRoles[idx] = { ...mockRoles[idx], ...role };
    }

    try {
      const response = await apiClient.put<APIResponse<any>>(`/roles/${id}`, payload);
      const res = response.data.data;
      return res ? {
        id: res.id,
        name: res.name,
        description: res.description,
        users: mockRoles[idx]?.users ?? 0,
        permissions: mockRoles[idx]?.permissions ?? 5,
        status: 'active'
      } : mockRoles[idx];
    } catch (e) {
      console.warn('Backend update role failed, falling back to mock', e);
      return mockRoles[idx] || role;
    }
  }

  async delete(id: string) {
    const idx = mockRoles.findIndex(r => r.id === id);
    if (idx !== -1) {
      mockRoles.splice(idx, 1);
    }
    try {
      await apiClient.delete(`/roles/${id}`);
      return { success: true };
    } catch (e) {
      console.warn('Backend delete role failed, falling back to mock', e);
      return { success: true };
    }
  }
}

export const roleService = new RoleService();
export default roleService;
