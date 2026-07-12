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

const FILTERS = [
  { label: 'All',      value: 'all' },
  { label: 'Active',   value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Locked',   value: 'locked' },
];

const initialUsers = [
  { id: 'USR-001', name: 'Rajesh Kumar',    email: 'rajesh.k@vrl.in',   role: 'Super Admin',      status: 'active',   lastLogin: '10m ago' },
  { id: 'USR-002', name: 'Gurpreet Singh',  email: 'g.singh@vrl.in',    role: 'Fleet Manager',    status: 'active',   lastLogin: '1h ago' },
  { id: 'USR-003', name: 'Amit Patel',      email: 'amit.p@vrl.in',     role: 'Dispatcher',       status: 'active',   lastLogin: '3h ago' },
  { id: 'USR-004', name: 'Suresh Sharma',   email: 'suresh.s@vrl.in',   role: 'Finance Admin',    status: 'inactive', lastLogin: '2d ago' },
  { id: 'USR-005', name: 'Vijay Yadav',     email: 'vijay.y@vrl.in',    role: 'Maintenance Lead', status: 'active',   lastLogin: '5m ago' },
];

const defaultForm = { name: '', email: '', role: 'Dispatcher', status: 'active' };

export default function UsersPage() {
  const [users,        setUsers]        = useState(initialUsers);
  const [selected,     setSelected]     = useState<any | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen,   setIsEditOpen]   = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
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

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setUsers([{ id: `USR-00${users.length + 1}`, ...formData, lastLogin: 'Never' }, ...users]);
    setIsCreateOpen(false);
    resetForm();
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setUsers(users.map((u) => u.id === selected?.id ? { ...u, ...formData } : u));
    setIsEditOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    setUsers(users.filter((u) => u.id !== selected?.id));
    setIsDeleteOpen(false);
    setSelected(null);
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

  const UserForm = ({ onSubmit, onClose }: { onSubmit: (e: React.FormEvent) => void; onClose: () => void }) => (
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
      <FormFooter onCancel={onClose} />
    </form>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Provision staff accounts, manage access controls, and monitor sessions"
        actions={
          <button onClick={() => { resetForm(); setIsCreateOpen(true); }} className="btn btn-primary">
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
        actions={(row) => (
          <div className="flex items-center justify-end gap-1">
            <button className="btn-icon" title="Edit user" onClick={() => { setSelected(row); setFormData({ name: row.name, email: row.email, role: row.role, status: row.status }); setIsEditOpen(true); }}>
              <Edit size={14} />
            </button>
            <button className="btn-icon hover:text-accent-red-soft" title="Remove user" onClick={() => { setSelected(row); setIsDeleteOpen(true); }}>
              <Trash2 size={14} />
            </button>
          </div>
        )}
      />

      <Modal isOpen={isCreateOpen} onClose={() => { setIsCreateOpen(false); resetForm(); }} title="Provision User" description="Create a new account and assign enterprise roles">
        <UserForm onSubmit={handleCreate} onClose={() => { setIsCreateOpen(false); resetForm(); }} />
      </Modal>

      <Modal isOpen={isEditOpen} onClose={() => { setIsEditOpen(false); resetForm(); }} title="Edit User" description="Modify access controls and account details">
        <UserForm onSubmit={handleEdit} onClose={() => { setIsEditOpen(false); resetForm(); }} />
      </Modal>

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Revoke User Access"
        confirmLabel="Revoke Access"
        description={<>This will permanently remove access for <strong className="text-text-primary">{selected?.name}</strong>. Their session will be terminated immediately.</>}
      />
    </div>
  );
}
