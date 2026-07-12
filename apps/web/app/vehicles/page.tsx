'use client';

import React, { useState } from 'react';
import { Plus, Eye, Edit, Trash2, ShieldAlert } from 'lucide-react';

import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import Drawer from '../../components/Drawer';
import { useVehicles } from '../../modules/vehicles/hooks/useVehicles';

export default function VehiclesPage() {
  const { vehicles, isLoading, createVehicle, updateVehicle, deleteVehicle } = useVehicles();
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);

  // Modals / Drawer triggers
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    plate_number: '',
    make: '',
    model: '',
    year: '2022',
    vin: '',
    status: 'active',
    current_mileage: '',
  });

  const [activeFilter, setActiveFilter] = useState('all');

  // Filter local state based on selection
  const filteredVehicles = React.useMemo(() => {
    if (activeFilter === 'all') return vehicles;
    return vehicles.filter((v) => v.status === activeFilter);
  }, [vehicles, activeFilter]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createVehicle(formData);
      setIsCreateOpen(false);
      resetForm();
    } catch (err) {
      alert('Failed to create vehicle');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) return;
    try {
      await updateVehicle(selectedVehicle.id, formData);
      setIsEditOpen(false);
      resetForm();
    } catch (err) {
      alert('Failed to update vehicle');
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedVehicle) return;
    try {
      await deleteVehicle(selectedVehicle.id);
      setIsDeleteOpen(false);
    } catch (err) {
      alert('Failed to delete vehicle');
    }
  };

  const resetForm = () => {
    setFormData({
      plate_number: '',
      make: '',
      model: '',
      year: '2022',
      vin: '',
      status: 'active',
      current_mileage: '',
    });
    setSelectedVehicle(null);
  };

  const columns = [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: 'Plate Number', accessorKey: 'plate_number', sortable: true },
    {
      header: 'Vehicle Model',
      accessorKey: 'model',
      sortable: true,
      cell: (row: any) => `${row.make} ${row.model}`,
    },
    { header: 'Year', accessorKey: 'year', sortable: true },
    { header: 'VIN', accessorKey: 'vin' },
    {
      header: 'Mileage',
      accessorKey: 'current_mileage',
      sortable: true,
      cell: (row: any) => `${row.current_mileage.toLocaleString()} mi`,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: any) => (
        <span
          className={`badge ${
            row.status === 'active'
              ? 'badge-success'
              : row.status === 'maintenance'
                ? 'badge-warning'
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
          <h2 className="text-xl font-bold text-white tracking-tight">Vehicles Management</h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Manage fleet vehicles, specifications, operations and status logs
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsCreateOpen(true);
          }}
          className="btn btn-primary self-start md:self-auto flex items-center gap-2 text-xs"
        >
          <Plus size={16} /> Add Vehicle
        </button>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-brand-border pb-2 select-none">
        {['all', 'active', 'maintenance', 'inactive'].map((filter) => (
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
        data={filteredVehicles}
        searchKey="plate_number"
        searchPlaceholder="Filter by plate number..."
        isLoading={isLoading}
        onRowClick={(row) => {
          setSelectedVehicle(row);
          setIsDetailOpen(true);
        }}
        actions={(row) => (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => {
                setSelectedVehicle(row);
                setFormData({
                  plate_number: row.plate_number,
                  make: row.make,
                  model: row.model,
                  year: String(row.year),
                  vin: row.vin,
                  status: row.status,
                  current_mileage: String(row.current_mileage),
                });
                setIsEditOpen(true);
              }}
              className="p-1.5 hover:bg-brand-card rounded text-text-secondary hover:text-white transition-all"
              title="Edit Vehicle"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={() => {
                setSelectedVehicle(row);
                setIsDeleteOpen(true);
              }}
              className="p-1.5 hover:bg-brand-card rounded text-text-secondary hover:text-accent-red transition-all"
              title="Delete Vehicle"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      />

      {/* CREATE VEHICLE MODAL */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add Fleet Vehicle"
        description="Register a new cargo vehicle in the ERP system"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label text-xs">Plate Number</label>
              <input
                type="text"
                name="plate_number"
                value={formData.plate_number}
                onChange={handleInputChange}
                required
                placeholder="TX-12345"
                className="input-field text-xs"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs">Make</label>
              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleInputChange}
                required
                placeholder="Volvo"
                className="input-field text-xs"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label text-xs">Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                required
                placeholder="VNL 860"
                className="input-field text-xs"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs">Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                required
                placeholder="2022"
                className="input-field text-xs"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label text-xs">VIN</label>
            <input
              type="text"
              name="vin"
              value={formData.vin}
              onChange={handleInputChange}
              required
              placeholder="1FVACWDB..."
              className="input-field text-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label text-xs">Odometer (mi)</label>
              <input
                type="number"
                name="current_mileage"
                value={formData.current_mileage}
                onChange={handleInputChange}
                required
                placeholder="150000"
                className="input-field text-xs"
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
                <option value="maintenance">Maintenance</option>
                <option value="inactive">Inactive</option>
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
              Register Vehicle
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT VEHICLE MODAL */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Vehicle Details"
        description="Update current specifications or odometer stats"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label text-xs">Plate Number</label>
              <input
                type="text"
                name="plate_number"
                value={formData.plate_number}
                onChange={handleInputChange}
                required
                className="input-field text-xs"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs">Make</label>
              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleInputChange}
                required
                className="input-field text-xs"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label text-xs">Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                required
                className="input-field text-xs"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs">Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                required
                className="input-field text-xs"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label text-xs">Odometer (mi)</label>
              <input
                type="number"
                name="current_mileage"
                value={formData.current_mileage}
                onChange={handleInputChange}
                required
                className="input-field text-xs"
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
                <option value="maintenance">Maintenance</option>
                <option value="inactive">Inactive</option>
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
              Are you sure you want to delete this vehicle?
            </h4>
            <p className="text-xs text-text-secondary mt-1">
              Deleting vehicle{' '}
              <strong className="text-white">{selectedVehicle?.plate_number}</strong> will remove
              all related logs. This action cannot be undone.
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
            Delete Vehicle
          </button>
        </div>
      </Modal>

      {/* DETAILS SLIDE DRAWER */}
      <Drawer
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Vehicle Specifications"
        description="Core logs and status history"
      >
        {selectedVehicle && (
          <div className="space-y-4 text-xs select-none">
            <div className="flex justify-between border-b border-brand-divider py-2">
              <span className="text-text-secondary">Vehicle ID</span>
              <span className="font-semibold text-white">{selectedVehicle.id}</span>
            </div>
            <div className="flex justify-between border-b border-brand-divider py-2">
              <span className="text-text-secondary">Plate Number</span>
              <span className="font-semibold text-white">{selectedVehicle.plate_number}</span>
            </div>
            <div className="flex justify-between border-b border-brand-divider py-2">
              <span className="text-text-secondary">Make / Model</span>
              <span className="font-semibold text-white">
                {selectedVehicle.make} {selectedVehicle.model}
              </span>
            </div>
            <div className="flex justify-between border-b border-brand-divider py-2">
              <span className="text-text-secondary">Year</span>
              <span className="font-semibold text-white">{selectedVehicle.year}</span>
            </div>
            <div className="flex justify-between border-b border-brand-divider py-2">
              <span className="text-text-secondary">Odometer Reading</span>
              <span className="font-semibold text-white">
                {selectedVehicle.current_mileage.toLocaleString()} mi
              </span>
            </div>
            <div className="flex justify-between border-b border-brand-divider py-2">
              <span className="text-text-secondary">VIN</span>
              <span className="font-semibold text-white">{selectedVehicle.vin}</span>
            </div>
            <div className="flex justify-between border-b border-brand-divider py-2">
              <span className="text-text-secondary">Last Service</span>
              <span className="font-semibold text-white">{selectedVehicle.last_service_date}</span>
            </div>
            <div className="flex justify-between border-b border-brand-divider py-2">
              <span className="text-text-secondary">Status</span>
              <span
                className={`badge ${
                  selectedVehicle.status === 'active'
                    ? 'badge-success'
                    : selectedVehicle.status === 'maintenance'
                      ? 'badge-warning'
                      : 'badge-draft'
                }`}
              >
                {selectedVehicle.status}
              </span>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
