'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, ShieldAlert, UserCheck, Users, Shield, UserX } from 'lucide-react';

import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import StatCard from '../../components/StatCard';

const initialUsers = [
  { id: 'USR-001', name: 'Rajesh Kumar', email: 'rajesh.k@vrl.in', role: 'Super Admin', status: 'active', lastLogin: '10 mins ago' },
  { id: 'USR-002', name: 'Gurpreet Singh', email: 'g.singh@vrl.in', role: 'Fleet Manager', status: 'active', lastLogin: '1 hour ago' },
  { id: 'USR-003', name: 'Amit Patel', email: 'amit.p@vrl.in', role: 'Dispatcher', status: 'active', lastLogin: '3 hours ago' },
  { id: 'USR-004', name: 'Suresh Sharma', email: 'suresh.s@vrl.in', role: 'Finance Admin', status: 'inactive', lastLogin: '2 days ago' },
  { id: 'USR-005', name: 'Vijay Yadav', email: 'vijay.y@vrl.in', role: 'Maintenance Lead', status: 'active', lastLogin: '5 mins ago' },
];

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Dispatcher',
    status: 'active',
  });

  const [activeFilter, setActiveFilter] = useState('all');

  const filteredUsers = React.useMemo(() => {
    if (activeFilter === 'all') return users;
    return users.filter((u) => u.status === activeFilter);
  }, [users, activeFilter]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      id: `USR-00${users.length + 1}`,
      ...formData,
      lastLogin: 'Never',
    };
    setUsers([newUser, ...users]);
    setIsCreateOpen(false);
    resetForm();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...formData } : u));
    setIsEditOpen(false);
    resetForm();
  };

  const handleDeleteSubmit = () => {
    setUsers(users.filter(u => u.id !== selectedUser.id));
    setIsDeleteOpen(false);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', role: 'Dispatcher', status: 'active' });
    setSelectedUser(null);
  };

  const columns = [
    { header: 'User ID', accessorKey: 'id', sortable: true },
    { header: 'Full Name', accessorKey: 'name', sortable: true },
    { header: 'Email Address', accessorKey: 'email' },
    { 
      header: 'Role', 
      accessorKey: 'role',
      cell: (row: any) => (
        <span className="flex items-center gap-1.5 text-text-secondary">
          <Shield size={12} className={row.role === 'Super Admin' ? 'text-accent-purple' : 'text-text-muted'} />
          {row.role}
        </span>
      )
    },
    { header: 'Last Login', accessorKey: 'lastLogin' },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: any) => (
        <span
          className={`badge ${
            row.status === 'active'
              ? 'badge-success'
              : row.status === 'inactive'
                ? 'badge-draft'
                : 'badge-warning'
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">User Management</h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Provision staff accounts, manage access controls, and monitor active sessions.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsCreateOpen(true);
          }}
          className="btn btn-primary self-start md:self-auto flex items-center gap-2 text-xs"
        >
          <Plus size={14} /> Add User
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={users.length}
          change="+1 this month"
          changeType="positive"
          icon={Users}
          iconColor="text-accent-blue"
          sparklineData={[30, 32, 32, 35, 38, 42, 42]}
        />
        <StatCard
          title="Active Sessions"
          value={users.filter(u => u.status === 'active').length}
          change="Real-time count"
          changeType="neutral"
          icon={UserCheck}
          iconColor="text-accent-green"
          sparklineData={[12, 14, 18, 16, 20, 24, 28]}
        />
        <StatCard
          title="Admin Accounts"
          value={users.filter(u => u.role === 'Super Admin' || u.role === 'Finance Admin').length}
          change="Highly privileged"
          changeType="neutral"
          icon={Shield}
          iconColor="text-accent-purple"
          sparklineData={[3, 3, 3, 3, 3, 4, 4]}
        />
        <StatCard
          title="Inactive Users"
          value={users.filter(u => u.status === 'inactive').length}
          change="Require review"
          changeType="negative"
          icon={UserX}
          iconColor="text-accent-amber"
          sparklineData={[1, 1, 2, 2, 3, 2, 1]}
        />
      </div>

      {/* Filters */}
      <div
        className="flex items-center gap-2 border-b border-brand-border pb-2 select-none"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        {['all', 'active', 'inactive', 'locked'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1.5 rounded-button text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeFilter === filter
                ? 'bg-brand-card text-white border border-brand-border'
                : 'text-text-secondary hover:text-white'
            }`}
            style={
              activeFilter === filter
                ? { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }
                : {}
            }
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredUsers}
        searchKey="name"
        searchPlaceholder="Search users by name..."
        actions={(row) => (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => {
                setSelectedUser(row);
                setFormData({
                  name: row.name,
                  email: row.email,
                  role: row.role,
                  status: row.status,
                });
                setIsEditOpen(true);
              }}
              className="p-1.5 hover:bg-brand-card rounded text-text-secondary hover:text-white transition-all"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={() => {
                setSelectedUser(row);
                setIsDeleteOpen(true);
              }}
              className="p-1.5 hover:bg-brand-card rounded text-text-secondary hover:text-accent-red transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      />

      {/* CREATE USER MODAL */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Provision New User"
        description="Create an account and assign enterprise roles"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label text-xs">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Ramesh Sharma"
                className="input-field text-xs"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="ramesh@vrl.in"
                className="input-field text-xs"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label text-xs">Assign Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="input-field text-xs bg-brand-panel"
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Fleet Manager">Fleet Manager</option>
                <option value="Dispatcher">Dispatcher</option>
                <option value="Finance Admin">Finance Admin</option>
                <option value="Maintenance Lead">Maintenance Lead</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label text-xs">Initial Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="input-field text-xs bg-brand-panel"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="locked">Locked</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-brand-divider">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="btn btn-outline text-xs"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary text-xs">
              Provision User
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT USER MODAL */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit User Profile"
        description="Modify personal details or adjust access controls"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label text-xs">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="input-field text-xs"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="input-field text-xs"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label text-xs">Assign Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="input-field text-xs bg-brand-panel"
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Fleet Manager">Fleet Manager</option>
                <option value="Dispatcher">Dispatcher</option>
                <option value="Finance Admin">Finance Admin</option>
                <option value="Maintenance Lead">Maintenance Lead</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label text-xs">Initial Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="input-field text-xs bg-brand-panel"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="locked">Locked</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-brand-divider">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="btn btn-outline text-xs"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary text-xs">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Confirm Deletion">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-accent-red/10 rounded-full text-accent-red">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-white text-xs">
              Are you sure you want to remove this user?
            </h4>
            <p className="text-xs text-text-secondary mt-1">
              Removing <strong className="text-white">{selectedUser?.name}</strong> will instantly revoke their access to TransitOps.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-brand-divider">
          <button
            type="button"
            onClick={() => setIsDeleteOpen(false)}
            className="btn btn-outline text-xs"
          >
            Cancel
          </button>
          <button type="button" onClick={handleDeleteSubmit} className="btn btn-danger text-xs">
            Revoke Access
          </button>
        </div>
      </Modal>
    </div>
  );
}
