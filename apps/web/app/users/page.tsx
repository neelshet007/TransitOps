'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Edit, Trash2, Shield, Users, UserCheck, UserX } from 'lucide-react';

import DataTable    from '../../components/DataTable';
import Modal        from '../../components/Modal';
import StatCard     from '../../components/StatCard';
import PageHeader   from '../../components/ui/PageHeader';
import FilterBar    from '../../components/ui/FilterBar';
import ConfirmModal from '../../components/ui/ConfirmModal';
import FormFooter   from '../../components/ui/FormFooter';
import { useUsers } from '../../modules/users/hooks/useUsers';

const FILTERS = [
  { label: 'All',      value: 'all' },
  { label: 'Active',   value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Locked',   value: 'locked' },
];

const defaultForm = { name: '', email: '', role: 'Dispatcher', status: 'active' };

export default function UsersPage() {
  const { users, isLoading, createUser, updateUser, deleteUser } = useUsers();

  const [selected,     setSelected]     = useState<any | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen,   setIsEditOpen]   = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [formData,     setFormData]     = useState(defaultForm);

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return users;
    return users.filter((u) => u.status === activeFilter);
  }, [users, activeFilter]);

  const filtersWithCount = useMemo(() =>
    FILTERS.map((f) => ({
      ...f,
      count: f.value === 'all' ? users.length : users.filter((u) => u.status === f.value).length,
    })),
  [users]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  }, []);

  const resetForm = () => { setFormData(defaultForm); setSelected(null); };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Provision User] Submit button clicked');
    console.log('[Provision User] Form Validation started');
    if (!formData.name || !formData.email || !formData.role) {
      console.warn('[Provision User] Validation failed');
      alert('Please fill out all required fields');
      return;
    }
    console.log('[Provision User] Validation passed');
    setSubmitting(true);
    try {
      console.log('[Provision User] API function called with payload:', formData);
      const res = await createUser(formData);
      console.log('[Provision User] Response received:', res);
      console.log('[Provision User] Success handler finished');
      setIsCreateOpen(false);
      resetForm();
    } catch (err) {
      console.error('[Provision User] Error handler triggered:', err);
      alert('Failed to register user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Edit User] Submit button clicked');
    if (!selected) return;
    console.log('[Edit User] Form Validation started');
    if (!formData.name || !formData.email || !formData.role) {
      console.warn('[Edit User] Validation failed');
      alert('Please fill out all required fields');
      return;
    }
    console.log('[Edit User] Validation passed');
    setSubmitting(true);
    try {
      console.log('[Edit User] API function called with payload:', formData);
      const res = await updateUser(selected.id, formData);
      console.log('[Edit User] Response received:', res);
      console.log('[Edit User] Success handler finished');
      setIsEditOpen(false);
      resetForm();
    } catch (err) {
      console.error('[Edit User] Error handler triggered:', err);
      alert('Failed to update user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    console.log('[Remove User] Confirm button clicked');
    if (!selected) return;
    setSubmitting(true);
    try {
      console.log('[Remove User] API function called for ID:', selected.id);
      await deleteUser(selected.id);
      console.log('[Remove User] Success handler finished');
      setIsDeleteOpen(false);
      setSelected(null);
    } catch (err) {
      console.error('[Remove User] Error handler triggered:', err);
      alert('Failed to remove user');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'User',
      accessorKey: 'name',
      sortable: true,
      cell: (row: any) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center text-accent-purple-soft font-bold text-xs flex-shrink-0">
            {row.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <p className="text-xs font-semibold text-text-primary">{row.name}</p>
            <p className="text-2xs text-text-muted">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      accessorKey: 'role',
      sortable: true,
      cell: (row: any) => (
        <div className="flex items-center gap-1.5 text-text-secondary text-xs">
          <Shield size={12} className={row.role === 'Super Admin' ? 'text-accent-purple-soft' : 'text-text-muted'} />
          {row.role}
        </div>
      ),
    },
    {
      header: 'Last Login',
      accessorKey: 'lastLogin',
      cell: (row: any) => <span className="text-xs text-text-muted">{row.lastLogin}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: any) => (
        <span className={`badge ${
          row.status === 'active'   ? 'badge-success' :
          row.status === 'inactive' ? 'badge-draft'   : 'badge-error'
        }`}>
          {row.status}
        </span>
      ),
    },
  ];

  const UserForm = ({ onSubmit, onClose, loading }: { onSubmit: (e: React.FormEvent) => void; onClose: () => void; loading: boolean }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input name="name" value={formData.name} onChange={handleChange} required placeholder="Ramesh Sharma" className="input-field" />
        </div>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="ramesh@vrl.in" className="input-field" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">Assign Role</label>
          <select name="role" value={formData.role} onChange={handleChange} className="input-field">
            <option>Super Admin</option>
            <option>Fleet Manager</option>
            <option>Dispatcher</option>
            <option>Finance Admin</option>
            <option>Maintenance Lead</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="input-field">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="locked">Locked</option>
          </select>
        </div>
      </div>
      <FormFooter onCancel={onClose} loading={loading} />
    </form>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Provision staff accounts, manage access controls, and monitor sessions"
        actions={
          <button onClick={() => { console.log('[Add User Button] Clicked to open modal'); resetForm(); setIsCreateOpen(true); }} className="btn btn-primary">
            <Plus size={14} /> Add User
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Total Users"      value={users.length}                                    change="+1 this month"      changeType="positive" icon={Users}      iconColor="text-accent-blue-soft"   iconBg="bg-blue-500/10"   sparklineData={[30,32,32,35,38,42,42]} />
        <StatCard title="Active Sessions"  value={users.filter(u => u.status === 'active').length} change="Currently online"    changeType="neutral"  icon={UserCheck}  iconColor="text-accent-green-soft"  iconBg="bg-green-500/10"  sparklineData={[12,14,18,16,20,24,28]} />
        <StatCard title="Admins"           value={users.filter(u => u.role.includes('Admin')).length} change="High privilege"   changeType="neutral"  icon={Shield}     iconColor="text-accent-purple-soft" iconBg="bg-purple-500/10" sparklineData={[3,3,3,3,3,4,4]} />
        <StatCard title="Inactive / Locked" value={users.filter(u => u.status !== 'active').length} change="Requires review"  changeType="negative" icon={UserX}      iconColor="text-accent-amber-soft"  iconBg="bg-amber-500/10"  sparklineData={[1,1,2,2,3,2,1]} />
      </div>

      <FilterBar filters={filtersWithCount} active={activeFilter} onChange={setActiveFilter} />

      <DataTable
        columns={columns}
        data={filtered}
        searchKey="name"
        searchPlaceholder="Search by name or email..."
        isLoading={isLoading}
        actions={(row) => (
          <div className="flex items-center justify-end gap-1">
            <button className="btn-icon" title="Edit user" onClick={(e) => { e.stopPropagation(); console.log('[Edit User Button] Clicked for ID:', row.id); setSelected(row); setFormData({ name: row.name, email: row.email, role: row.role, status: row.status }); setIsEditOpen(true); }}>
              <Edit size={14} />
            </button>
            <button className="btn-icon hover:text-accent-red-soft" title="Remove user" onClick={(e) => { e.stopPropagation(); console.log('[Remove User Button] Clicked for ID:', row.id); setSelected(row); setIsDeleteOpen(true); }}>
              <Trash2 size={14} />
            </button>
          </div>
        )}
      />

      <Modal isOpen={isCreateOpen} onClose={() => { setIsCreateOpen(false); resetForm(); }} title="Provision User" description="Create a new account and assign enterprise roles">
        <UserForm onSubmit={handleCreate} onClose={() => { setIsCreateOpen(false); resetForm(); }} loading={submitting} />
      </Modal>

      <Modal isOpen={isEditOpen} onClose={() => { setIsEditOpen(false); resetForm(); }} title="Edit User" description="Modify access controls and account details">
        <UserForm onSubmit={handleEdit} onClose={() => { setIsEditOpen(false); resetForm(); }} loading={submitting} />
      </Modal>

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Revoke User Access"
        confirmLabel="Revoke Access"
        loading={submitting}
        description={<>This will permanently remove access for <strong className="text-text-primary">{selected?.name}</strong>. Their session will be terminated immediately.</>}
      />
    </div>
  );
}
