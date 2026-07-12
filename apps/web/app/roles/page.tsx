'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Shield, Lock, Users, ShieldAlert, Check } from 'lucide-react';

import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';

const initialRoles = [
  { id: 'ROL-001', name: 'Super Admin', description: 'Full access to all system modules and settings.', users: 3, permissions: 45, status: 'active' },
  { id: 'ROL-002', name: 'Fleet Manager', description: 'Can manage vehicles, drivers, and trips. No billing access.', users: 12, permissions: 28, status: 'active' },
  { id: 'ROL-003', name: 'Dispatcher', description: 'Only access to trip routing and dispatch logs.', users: 24, permissions: 15, status: 'active' },
  { id: 'ROL-004', name: 'Finance Admin', description: 'Access to expenses, fuel costs, and invoicing.', users: 4, permissions: 22, status: 'active' },
  { id: 'ROL-005', name: 'Maintenance Lead', description: 'Access to vehicle health and service logs.', users: 8, permissions: 18, status: 'active' },
  { id: 'ROL-006', name: 'Guest Auditor', description: 'Read-only access for compliance checks.', users: 1, permissions: 5, status: 'inactive' },
];

export default function RolesPage() {
  const [roles, setRoles] = useState(initialRoles);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
  });

  const [activeFilter, setActiveFilter] = useState('all');

  const filteredRoles = React.useMemo(() => {
    if (activeFilter === 'all') return roles;
    return roles.filter((r) => r.status === activeFilter);
  }, [roles, activeFilter]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRole = {
      id: `ROL-00${roles.length + 1}`,
      ...formData,
      users: 0,
      permissions: 10,
    };
    setRoles([newRole, ...roles]);
    setIsCreateOpen(false);
    resetForm();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRoles(roles.map(r => r.id === selectedRole.id ? { ...r, ...formData } : r));
    setIsEditOpen(false);
    resetForm();
  };

  const handleDeleteSubmit = () => {
    setRoles(roles.filter(r => r.id !== selectedRole.id));
    setIsDeleteOpen(false);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', status: 'active' });
    setSelectedRole(null);
  };

  const columns = [
    { 
      header: 'Role Name', 
      accessorKey: 'name', 
      sortable: true,
      cell: (row: any) => (
        <span className="flex items-center gap-1.5 font-semibold text-white">
          <Shield size={14} className="text-accent-purple" />
          {row.name}
        </span>
      )
    },
    { header: 'Description', accessorKey: 'description' },
    { 
      header: 'Assigned Users', 
      accessorKey: 'users',
      cell: (row: any) => (
        <span className="flex items-center gap-1.5 text-text-secondary">
          <Users size={12} /> {row.users}
        </span>
      )
    },
    { 
      header: 'Permissions', 
      accessorKey: 'permissions',
      cell: (row: any) => (
        <span className="flex items-center gap-1.5 text-text-secondary">
          <Lock size={12} /> {row.permissions} rules
        </span>
      )
    },
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
          <h2 className="text-xl font-bold text-white tracking-tight">Access Control (RBAC)</h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Configure permission blueprints and map module access rights.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsCreateOpen(true);
          }}
          className="btn btn-primary self-start md:self-auto flex items-center gap-2 text-xs"
        >
          <Plus size={14} /> Create Role
        </button>
      </div>

      {/* Filters */}
      <div
        className="flex items-center gap-2 border-b border-brand-border pb-2 select-none"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        {['all', 'active', 'inactive'].map((filter) => (
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
        data={filteredRoles}
        searchKey="name"
        searchPlaceholder="Search roles..."
        actions={(row) => (
          <div className="flex items-center justify-end gap-2">
            <button
              title="Edit Role Details"
              onClick={() => {
                setSelectedRole(row);
                setFormData({
                  name: row.name,
                  description: row.description,
                  status: row.status,
                });
                setIsEditOpen(true);
              }}
              className="p-1.5 hover:bg-brand-card rounded text-text-secondary hover:text-white transition-all"
            >
              <Edit size={14} />
            </button>
            <button
              title="Delete Role"
              onClick={() => {
                setSelectedRole(row);
                setIsDeleteOpen(true);
              }}
              className="p-1.5 hover:bg-brand-card rounded text-text-secondary hover:text-accent-red transition-all"
              disabled={row.users > 0} // Prevent deleting roles with assigned users
            >
              <Trash2 size={14} className={row.users > 0 ? 'opacity-30 cursor-not-allowed' : ''} />
            </button>
          </div>
        )}
      />

      {/* CREATE ROLE MODAL */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Access Role"
        description="Define a new template for system permissions."
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label text-xs">Role Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="e.g. Regional Supervisor"
              className="input-field text-xs"
            />
          </div>
          <div className="form-group">
            <label className="form-label text-xs">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              placeholder="Briefly describe what users with this role can do..."
              className="input-field text-xs resize-none"
            />
          </div>
          <div className="form-group">
            <label className="form-label text-xs">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="input-field text-xs bg-brand-panel"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <div className="bg-brand-panel p-4 rounded-lg border border-brand-border">
            <div className="flex items-start gap-3">
              <Lock className="text-accent-amber shrink-0 mt-0.5" size={16} />
              <div>
                <h5 className="text-xs font-semibold text-white">Permissions configuration</h5>
                <p className="text-[10px] text-text-secondary mt-1">
                  You can map specific read/write access controls to this role after it is created via the Advanced Permissions dashboard.
                </p>
              </div>
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
            <button type="submit" className="btn btn-primary text-xs flex items-center gap-2">
              <Check size={14} /> Save Role
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT ROLE MODAL */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Role Policy"
        description="Modify role naming and general description."
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label text-xs">Role Name</label>
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
            <label className="form-label text-xs">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              className="input-field text-xs resize-none"
            />
          </div>
          <div className="form-group">
            <label className="form-label text-xs">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="input-field text-xs bg-brand-panel"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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
              Update Role
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Role">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-accent-red/10 rounded-full text-accent-red">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-white text-xs">
              Confirm Role Deletion
            </h4>
            <p className="text-xs text-text-secondary mt-1">
              You are about to delete the <strong className="text-white">{selectedRole?.name}</strong> role. This action is irreversible.
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
            Delete Role
          </button>
        </div>
      </Modal>
    </div>
  );
}
