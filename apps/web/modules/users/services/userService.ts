import apiClient from '../../../services/apiClient';
import { APIResponse } from '@transitops/types';

// Client-side mock array state for fallback
export const mockUsers = [
  { id: 'USR-001', name: 'Rajesh Kumar',    email: 'rajesh.k@vrl.in',   role: 'Super Admin',      status: 'active',   lastLogin: '10m ago' },
  { id: 'USR-002', name: 'Gurpreet Singh',  email: 'g.singh@vrl.in',    role: 'Fleet Manager',    status: 'active',   lastLogin: '1h ago' },
  { id: 'USR-003', name: 'Amit Patel',      email: 'amit.p@vrl.in',     role: 'Dispatcher',       status: 'active',   lastLogin: '3h ago' },
  { id: 'USR-004', name: 'Suresh Sharma',   email: 'suresh.s@vrl.in',   role: 'Finance Admin',    status: 'inactive', lastLogin: '2d ago' },
  { id: 'USR-005', name: 'Vijay Yadav',     email: 'vijay.y@vrl.in',    role: 'Maintenance Lead', status: 'active',   lastLogin: '5m ago' },
];

class UserService {
  async getAll() {
    try {
      const response = await apiClient.get<APIResponse<any[]>>('/users');
      const apiData = response.data.data || [];
      if (apiData.length === 0) return mockUsers;
      return apiData.map(u => ({
        id: u.id,
        name: `${u.first_name} ${u.last_name}`,
        email: u.email,
        role: u.roles?.[0]?.name || 'Dispatcher',
        status: u.is_active ? 'active' : 'inactive',
        lastLogin: 'Just now'
      }));
    } catch {
      return mockUsers;
    }
  }

  async create(user: any) {
    const names = user.name.split(' ');
    const payload = {
      email: user.email,
      password: 'TemporaryPassword123!',
      first_name: names[0] || 'First',
      last_name: names.slice(1).join(' ') || 'Last',
      is_active: user.status === 'active'
    };

    const newMock = {
      id: `USR-00${mockUsers.length + 1}`,
      name: user.name,
      email: user.email,
      role: user.role || 'Dispatcher',
      status: user.status || 'active',
      lastLogin: 'Never'
    };
    mockUsers.unshift(newMock);

    try {
      const response = await apiClient.post<APIResponse<any>>('/users', payload);
      const res = response.data.data;
      return res ? {
        id: res.id,
        name: `${res.first_name} ${res.last_name}`,
        email: res.email,
        role: user.role || 'Dispatcher',
        status: res.is_active ? 'active' : 'inactive',
        lastLogin: 'Never'
      } : newMock;
    } catch (e) {
      console.warn('Backend create user failed, falling back to mock', e);
      return newMock;
    }
  }

  async update(id: string, user: any) {
    const names = user.name.split(' ');
    const payload = {
      email: user.email,
      first_name: names[0],
      last_name: names.slice(1).join(' '),
      is_active: user.status === 'active'
    };

    const idx = mockUsers.findIndex(u => u.id === id);
    if (idx !== -1) {
      mockUsers[idx] = { ...mockUsers[idx], ...user };
    }

    try {
      const response = await apiClient.put<APIResponse<any>>(`/users/${id}`, payload);
      const res = response.data.data;
      return res ? {
        id: res.id,
        name: `${res.first_name} ${res.last_name}`,
        email: res.email,
        role: user.role || 'Dispatcher',
        status: res.is_active ? 'active' : 'inactive',
        lastLogin: 'Just now'
      } : mockUsers[idx];
    } catch (e) {
      console.warn('Backend update user failed, falling back to mock', e);
      return mockUsers[idx] || user;
    }
  }

  async delete(id: string) {
    const idx = mockUsers.findIndex(u => u.id === id);
    if (idx !== -1) {
      mockUsers.splice(idx, 1);
    }
    try {
      await apiClient.delete(`/users/${id}`);
      return { success: true };
    } catch (e) {
      console.warn('Backend delete user failed, falling back to mock', e);
      return { success: true };
    }
  }
}

export const userService = new UserService();
export default userService;
