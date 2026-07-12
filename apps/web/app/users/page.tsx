'use client';

import React from 'react';
import { UserCheck, Shield } from 'lucide-react';
import DataTable from '../../components/DataTable';

const mockUsers = [
  { id: '1', name: 'System Admin', email: 'admin@transitops.com', role: 'admin', status: 'active' },
  {
    id: '2',
    name: 'Ronald Jenkins',
    email: 'r.jenkins@transitops.com',
    role: 'driver',
    status: 'active',
  },
  {
    id: '3',
    name: 'Elena Rostova',
    email: 'e.rostova@transitops.com',
    role: 'driver',
    status: 'active',
  },
  {
    id: '4',
    name: 'Marcus Vance',
    email: 'marcus.vance@transitops.com',
    role: 'driver',
    status: 'active',
  },
];

export default function UsersPage() {
  const columns = [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: 'User Name', accessorKey: 'name', sortable: true },
    { header: 'Email Address', accessorKey: 'email' },
    {
      header: 'Assigned Role',
      accessorKey: 'role',
      cell: (row: any) => (
        <span className="badge badge-info uppercase tracking-wider">{row.role}</span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: any) => <span className="badge badge-success">{row.status}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Users & Access Roles</h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Manage operator permissions, roles, and administrative accounts
        </p>
      </div>

      {/* Main Table Grid */}
      <DataTable
        columns={columns}
        data={mockUsers}
        searchKey="name"
        searchPlaceholder="Filter by user name..."
      />
    </div>
  );
}
