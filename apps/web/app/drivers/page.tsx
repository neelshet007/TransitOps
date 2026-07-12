'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, ShieldAlert } from 'lucide-react';

import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import Drawer from '../../components/Drawer';
import { useDrivers } from '../../modules/drivers/hooks/useDrivers';

export default function DriversPage() {
  const { drivers, isLoading, createDriver, updateDriver, deleteDriver } = useDrivers();
  const [selectedDriver, setSelectedDriver] = useState<any | null>(null);

  // Modals / Drawer triggers
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    license_number: '',
    license_expiry: '',
    status: 'active',
  });

  const [activeFilter, setActiveFilter] = useState('all');

  const filteredDrivers = React.useMemo(() => {
    if (activeFilter === 'all') return drivers;
    return drivers.filter((d) => d.status === activeFilter);
  }, [drivers, activeFilter]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDriver(formData);
      setIsCreateOpen(false);
      resetForm();
    } catch (err) {
      alert('Failed to create driver');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriver) return;
    try {
      await updateDriver(selectedDriver.id, formData);
      setIsEditOpen(false);
      resetForm();
    } catch (err) {
      alert('Failed to update driver');
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedDriver) return;
    try {
      await deleteDriver(selectedDriver.id);
      setIsDeleteOpen(false);
    } catch (err) {
      alert('Failed to delete driver');
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      license_number: '',
      license_expiry: '',
      status: 'active',
    });
    setSelectedDriver(null);
  };

  const columns = [
    { header: 'ID', accessorKey: 'id', sortable: true },
    {
      header: 'Driver Name',
      accessorKey: 'last_name',
      sortable: true,
      cell: (row: any) => `${row.first_name} ${row.last_name}`,
    },
    { header: 'Email Address', accessorKey: 'email' },
    { header: 'Phone Number', accessorKey: 'phone' },
    { header: 'CDL License', accessorKey: 'license_number' },
    {
      header: 'Vehicle Assigned',
      accessorKey: 'current_vehicle_plate',
      sortable: true,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: any) => (
        <span
          className={`badge ${
            row.status === 'active'
              ? 'badge-success'
              : row.status === 'suspended'
                ? 'badge-error'
                : 'badge-draft'
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Module Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Driver Profiles</h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Manage transport operators, licenses, ratings and vehicle pairings
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsCreateOpen(true);
          }}
          className="btn btn-primary self-start md:self-auto flex items-center gap-2 text-xs"
        >
          <Plus size={16} /> Add Driver
        </button>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-brand-border pb-2 select-none">
        {['all', 'active', 'suspended', 'inactive'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1.5 rounded-button text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeFilter === filter
                ? 'bg-brand-card text-white border border-brand-border'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Main Table Grid */}
      <DataTable
        columns={columns}
        data={filteredDrivers}
        searchKey="last_name"
        searchPlaceholder="Filter by driver last name..."
        isLoading={isLoading}
        onRowClick={(row) => {
          setSelectedDriver(row);
          setIsDetailOpen(true);
        }}
        actions={(row) => (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => {
                setSelectedDriver(row);
                setFormData({
                  first_name: row.first_name,
                  last_name: row.last_name,
                  email: row.email,
                  phone: row.phone,
                  license_number: row.license_number,
                  license_expiry: row.license_expiry,
                  status: row.status,
                });
                setIsEditOpen(true);
              }}
              className="p-1.5 hover:bg-brand-card rounded text-text-secondary hover:text-white transition-all"
              title="Edit Driver"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={() => {
                setSelectedDriver(row);
                setIsDeleteOpen(true);
              }}
              className="p-1.5 hover:bg-brand-card rounded text-text-secondary hover:text-accent-red transition-all"
              title="Delete Driver"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      />

      {/* CREATE DRIVER MODAL */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add Fleet Operator"
        description="Register a new commercial truck operator profile"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label text-xs">First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                required
                placeholder="Marcus"
                className="input-field text-xs"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                required
                placeholder="Vance"
                className="input-field text-xs"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label text-xs">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="marcus.v@transitops.com"
                className="input-field text-xs"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="(404) 555-0143"
                className="input-field text-xs"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label text-xs">CDL License Number</label>
              <input
                type="text"
                name="license_number"
                value={formData.license_number}
                onChange={handleInputChange}
                required
                placeholder="CDL-88201"
                className="input-field text-xs"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs">License Expiration</label>
              <input
                type="date"
                name="license_expiry"
                value={formData.license_expiry}
                onChange={handleInputChange}
                required
                className="input-field text-xs"
              />
            </div>
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
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>
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
              Register Driver
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT DRIVER MODAL */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Driver Details"
        description="Update personal information, CDL expiration, or status logs"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label text-xs">First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                required
                className="input-field text-xs"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                required
                className="input-field text-xs"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label text-xs">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="input-field text-xs"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="input-field text-xs"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label text-xs">CDL License Number</label>
              <input
                type="text"
                name="license_number"
                value={formData.license_number}
                onChange={handleInputChange}
                required
                className="input-field text-xs"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs">License Expiration</label>
              <input
                type="date"
                name="license_expiry"
                value={formData.license_expiry}
                onChange={handleInputChange}
                required
                className="input-field text-xs"
              />
            </div>
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
              <option value="suspended">Suspended</option>
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
            <h4 className="font-semibold text-white text-xs">Delete this driver record?</h4>
            <p className="text-xs text-text-secondary mt-1">
              Deleting driver{' '}
              <strong className="text-white">
                {selectedDriver?.first_name} {selectedDriver?.last_name}
              </strong>{' '}
              will remove their assignment details. This action is permanent.
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
            Remove Driver
          </button>
        </div>
      </Modal>

      {/* DETAILS SLIDE DRAWER */}
      <Drawer
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Driver Profile Specs"
        description="Core operational metrics and registration details"
      >
        {selectedDriver && (
          <div className="space-y-4 text-xs select-none">
            <div className="flex justify-between border-b border-brand-divider py-2">
              <span className="text-text-secondary">Driver ID</span>
              <span className="font-semibold text-white">{selectedDriver.id}</span>
            </div>
            <div className="flex justify-between border-b border-brand-divider py-2">
              <span className="text-text-secondary">Full Name</span>
              <span className="font-semibold text-white">
                {selectedDriver.first_name} {selectedDriver.last_name}
              </span>
            </div>
            <div className="flex justify-between border-b border-brand-divider py-2">
              <span className="text-text-secondary">Email</span>
              <span className="font-semibold text-white">{selectedDriver.email}</span>
            </div>
            <div className="flex justify-between border-b border-brand-divider py-2">
              <span className="text-text-secondary">Phone</span>
              <span className="font-semibold text-white">{selectedDriver.phone}</span>
            </div>
            <div className="flex justify-between border-b border-brand-divider py-2">
              <span className="text-text-secondary">CDL Number</span>
              <span className="font-semibold text-white">{selectedDriver.license_number}</span>
            </div>
            <div className="flex justify-between border-b border-brand-divider py-2">
              <span className="text-text-secondary">License Expiration</span>
              <span className="font-semibold text-white">{selectedDriver.license_expiry}</span>
            </div>
            <div className="flex justify-between border-b border-brand-divider py-2">
              <span className="text-text-secondary">Date Joined</span>
              <span className="font-semibold text-white">{selectedDriver.join_date}</span>
            </div>
            <div className="flex justify-between border-b border-brand-divider py-2">
              <span className="text-text-secondary">Performance Rating</span>
              <span className="font-semibold text-white">⭐ {selectedDriver.rating} / 5.0</span>
            </div>
            <div className="flex justify-between border-b border-brand-divider py-2">
              <span className="text-text-secondary">Active Vehicle Assignment</span>
              <span className="font-semibold text-white">
                {selectedDriver.current_vehicle_plate}
              </span>
            </div>
            <div className="flex justify-between border-b border-brand-divider py-2">
              <span className="text-text-secondary">Status</span>
              <span
                className={`badge ${
                  selectedDriver.status === 'active'
                    ? 'badge-success'
                    : selectedDriver.status === 'suspended'
                      ? 'badge-error'
                      : 'badge-draft'
                }`}
              >
                {selectedDriver.status}
              </span>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
