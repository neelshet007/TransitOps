'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Edit, Trash2, Shield, Lock, Users, Check } from 'lucide-react';

import DataTable    from '../../components/DataTable';
import Modal        from '../../components/Modal';
import PageHeader   from '../../components/ui/PageHeader';
import FilterBar    from '../../components/ui/FilterBar';
import ConfirmModal from '../../components/ui/ConfirmModal';
import FormFooter   from '../../components/ui/FormFooter';

const FILTERS = [
  { label: 'All',      value: 'all' },
  { label: 'Active',   value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

const initialRoles = [
  { id: 'ROL-001', name: 'Super Admin',     description: 'Full access to all system modules and settings.',                  users: 3,  permissions: 45, status: 'active' },
  { id: 'ROL-002', name: 'Fleet Manager',   description: 'Manage vehicles, drivers, and trips. No billing access.',          users: 12, permissions: 28, status: 'active' },
  { id: 'ROL-003', name: 'Dispatcher',      description: 'Trip routing and dispatch logs only.',                              users: 24, permissions: 15, status: 'active' },
  { id: 'ROL-004', name: 'Finance Admin',   description: 'Access to expenses, fuel costs, and invoicing.',                   users: 4,  permissions: 22, status: 'active' },
  { id: 'ROL-005', name: 'Maintenance Lead','description': 'Vehicle health and service logs.',                               users: 8,  permissions: 18, status: 'active' },
  { id: 'ROL-006', name: 'Guest Auditor',   description: 'Read-only access for compliance checks.',                          users: 1,  permissions: 5,  status: 'inactive' },
];

const defaultForm = { name: '', description: '', status: 'active' };

export default function RolesPage() {
  const [roles,        setRoles]        = useState(initialRoles);
  const [selected,     setSelected]     = useState<any | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen,   setIsEditOpen]   = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formData,     setFormData]     = useState(defaultForm);

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return roles;
    return roles.filter((r) => r.status === activeFilter);
  }, [roles, activeFilter]);

  const filtersWithCount = useMemo(() =>
    FILTERS.map((f) => ({
      ...f,
      count: f.value === 'all' ? roles.length : roles.filter((r) => r.status === f.value).length,
    })),
  [roles]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((p) => ({ ...p, [name]: value }));
    },
    [],
  );

  const resetForm = () => { setFormData(defaultForm); setSelected(null); };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setRoles([{ id: `ROL-00${roles.length + 1}`, ...formData, users: 0, permissions: 10 }, ...roles]);
    setIsCreateOpen(false);
    resetForm();
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setRoles(roles.map((r) => r.id === selected?.id ? { ...r, ...formData } : r));
    setIsEditOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    setRoles(roles.filter((r) => r.id !== selected?.id));
    setIsDeleteOpen(false);
    setSelected(null);
  };

  const columns = [
    {
      header: 'Role',
      accessorKey: 'name',
      sortable: true,
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-accent-purple/10">
            <Shield size={13} className="text-accent-purple-mid" />
          </div>
          <span className="text-xs font-semibold text-text-primary">{row.name}</span>
        </div>
      ),
    },
    {
      header: 'Description',
      accessorKey: 'description',
      cell: (row: any) => (
        <span className="text-xs text-text-secondary truncate block max-w-[260px]">{row.description}</span>
      ),
    },
    {
      header: 'Assigned Users',
      accessorKey: 'users',
      cell: (row: any) => (
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <Users size={12} /> {row.users}
        </div>
      ),
    },
    {
      header: 'Permissions',
      accessorKey: 'permissions',
      cell: (row: any) => (
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <Lock size={12} /> {row.permissions} rules
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: any) => (
        <span className={`badge ${row.status === 'active' ? 'badge-success' : 'badge-draft'}`}>
          {row.status}
        </span>
      ),
    },
  ];

  const RoleForm = ({ onSubmit, onClose }: { onSubmit: (e: React.FormEvent) => void; onClose: () => void }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="form-group">
        <label className="form-label">Role Name</label>
        <input name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Regional Supervisor" className="input-field" />
      </div>
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} placeholder="Describe what users with this role can access…" className="input-field" />
      </div>
      <div className="form-group">
        <label className="form-label">Status</label>
        <select name="status" value={formData.status} onChange={handleChange} className="input-field">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div className="p-4 rounded-xl bg-brand-panel border border-brand-border flex items-start gap-3">
        <Lock size={14} className="text-accent-amber-soft flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-text-primary">Permissions</p>
          <p className="text-xs text-text-muted mt-0.5">
            Fine-grained read/write access can be configured after creation via the permissions dashboard.
          </p>
        </div>
      </div>
      <FormFooter onCancel={onClose} />
    </form>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Access Control (RBAC)"
        description="Define permission blueprints and map module access rights to team roles"
        actions={
          <button onClick={() => { resetForm(); setIsCreateOpen(true); }} className="btn btn-primary">
            <Plus size={14} /> Create Role
          </button>
        }
      />

      <FilterBar filters={filtersWithCount} active={activeFilter} onChange={setActiveFilter} />

      <DataTable
        columns={columns}
        data={filtered}
        searchKey="name"
        searchPlaceholder="Search roles..."
        actions={(row) => (
          <div className="flex items-center justify-end gap-1">
            <button className="btn-icon" title="Edit role" onClick={() => { setSelected(row); setFormData({ name: row.name, description: row.description, status: row.status }); setIsEditOpen(true); }}>
              <Edit size={14} />
            </button>
            <button
              className={`btn-icon ${row.users > 0 ? 'opacity-30 cursor-not-allowed' : 'hover:text-accent-red-soft'}`}
              title={row.users > 0 ? 'Cannot delete role with assigned users' : 'Delete role'}
              disabled={row.users > 0}
              onClick={() => { if (row.users === 0) { setSelected(row); setIsDeleteOpen(true); } }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      />

      <Modal isOpen={isCreateOpen} onClose={() => { setIsCreateOpen(false); resetForm(); }} title="Create Role" description="Define a new template for system permissions">
        <RoleForm onSubmit={handleCreate} onClose={() => { setIsCreateOpen(false); resetForm(); }} />
      </Modal>

      <Modal isOpen={isEditOpen} onClose={() => { setIsEditOpen(false); resetForm(); }} title="Edit Role" description="Modify role naming and access scope">
        <RoleForm onSubmit={handleEdit} onClose={() => { setIsEditOpen(false); resetForm(); }} />
      </Modal>

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Role"
        confirmLabel="Delete Role"
        description={<>You are about to permanently delete <strong className="text-text-primary">{selected?.name}</strong>. This action cannot be undone.</>}
      />
    </div>
  );
}
