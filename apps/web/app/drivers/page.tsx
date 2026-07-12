'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  ShieldAlert,
  Users,
  Award,
  ShieldCheck,
  Calendar,
  Clock,
  TrendingUp,
  AlertTriangle,
  FileText,
  CheckCircle,
  XCircle,
  Building,
  Phone,
  Mail,
  MapPin,
  User,
  PlusCircle,
  Download,
  Activity,
  UserCheck,
  UserX,
  FileDown,
  RefreshCw,
} from 'lucide-react';

import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import Drawer from '../../components/Drawer';
import StatCard from '../../components/StatCard';
import { useDrivers } from '../../modules/drivers/hooks/useDrivers';
import { driverService } from '../../modules/drivers/services/driverService';
import { Driver, DriverDocument } from '@transitops/types';

export default function DriversPage() {
  const {
    drivers,
    isLoading,
    error,
    createDriver,
    updateDriver,
    deleteDriver,
    updateDriverStatus,
    stats,
    isStatsLoading,
    search,
    setSearch,
    status,
    setStatus,
    availability,
    setAvailability,
    refresh,
  } = useDrivers();

  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'documents' | 'performance' | 'attendance'>('profile');

  // Document states
  const [documents, setDocuments] = useState<DriverDocument[]>([]);
  const [isDocsLoading, setIsDocsLoading] = useState(false);
  const [docForm, setDocForm] = useState({
    document_type: 'driving_license',
    document_number: '',
    issue_date: '',
    expiry_date: '',
    issuing_authority: '',
    file_url: 'https://example.com/mock-doc.pdf',
    notes: '',
  });
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);

  // Modals / Drawer triggers
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    employee_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: 'Male',
    blood_group: 'B+',
    address: '',
    city: '',
    state: '',
    pincode: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relation: '',
    license_number: '',
    license_class: 'HMV',
    license_issue_date: '',
    license_expiry: '',
    license_issuing_authority: '',
    medical_certificate_number: '',
    medical_certificate_expiry: '',
    experience_years: 0,
    availability: 'available',
    status: 'active',
    notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDocForm((prev) => ({ ...prev, [name]: value }));
  };

  const loadDocuments = async (driverId: string) => {
    setIsDocsLoading(true);
    try {
      const docs = await driverService.getDocuments(driverId);
      setDocuments(docs);
    } catch (err) {
      console.error('Failed to load documents', err);
    } finally {
      setIsDocsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDriver && isDetailOpen) {
      loadDocuments(selectedDriver.id);
    }
  }, [selectedDriver, isDetailOpen]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDriver(formData);
      setIsCreateOpen(false);
      resetForm();
    } catch (err: any) {
      alert(err.message || 'Failed to register driver');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriver) return;
    try {
      await updateDriver(selectedDriver.id, formData);
      setIsEditOpen(false);
      resetForm();
    } catch (err: any) {
      alert(err.message || 'Failed to update driver profile');
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedDriver) return;
    try {
      await deleteDriver(selectedDriver.id);
      setIsDeleteOpen(false);
      setSelectedDriver(null);
    } catch (err: any) {
      alert(err.message || 'Failed to remove driver');
    }
  };

  const handleUploadDocSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriver) return;
    try {
      await driverService.uploadDocument(selectedDriver.id, docForm);
      setIsUploadDocOpen(false);
      setDocForm({
        document_type: 'driving_license',
        document_number: '',
        issue_date: '',
        expiry_date: '',
        issuing_authority: '',
        file_url: 'https://example.com/mock-doc.pdf',
        notes: '',
      });
      loadDocuments(selectedDriver.id);
    } catch (err: any) {
      alert(err.message || 'Failed to upload document');
    }
  };

  const handleVerifyDoc = async (docId: string, verified: boolean) => {
    if (!selectedDriver) return;
    try {
      await driverService.verifyDocument(selectedDriver.id, docId, verified, 'Verified by operator');
      loadDocuments(selectedDriver.id);
      // Refresh driver info to show verification badge updates
      const updatedDriver = await driverService.getById(selectedDriver.id);
      if (updatedDriver) setSelectedDriver(updatedDriver);
      refresh();
    } catch (err: any) {
      alert(err.message || 'Failed to verify document');
    }
  };

  const handleDeleteDoc = async (docId: string) => {
    if (!selectedDriver) return;
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      await driverService.deleteDocument(selectedDriver.id, docId);
      loadDocuments(selectedDriver.id);
      const updatedDriver = await driverService.getById(selectedDriver.id);
      if (updatedDriver) setSelectedDriver(updatedDriver);
      refresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete document');
    }
  };

  const resetForm = () => {
    setFormData({
      employee_id: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      gender: 'Male',
      blood_group: 'B+',
      address: '',
      city: '',
      state: '',
      pincode: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      emergency_contact_relation: '',
      license_number: '',
      license_class: 'HMV',
      license_issue_date: '',
      license_expiry: '',
      license_issuing_authority: '',
      medical_certificate_number: '',
      medical_certificate_expiry: '',
      experience_years: 0,
      availability: 'available',
      status: 'active',
      notes: '',
    });
    setSelectedDriver(null);
  };

  const columns = [
    {
      header: 'Employee ID',
      accessorKey: 'employee_id',
      sortable: true,
      cell: (row: Driver) => (
        <span className="font-mono text-xs font-semibold text-text-secondary">{row.employee_id}</span>
      ),
    },
    {
      header: 'Name',
      accessorKey: 'first_name',
      sortable: true,
      cell: (row: Driver) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center text-accent-purple font-semibold text-xs shrink-0">
            {row.first_name[0]}
            {row.last_name[0]}
          </div>
          <div>
            <p className="font-semibold text-white text-xs">
              {row.first_name} {row.last_name}
            </p>
            <p className="text-[10px] text-text-muted">{row.email}</p>
          </div>
        </div>
      ),
    },
    { header: 'Phone Number', accessorKey: 'phone' },
    {
      header: 'Driving License',
      accessorKey: 'license_number',
      cell: (row: Driver) => (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs text-text-secondary">{row.license_number}</span>
            {row.license_verified ? (
              <span className="w-1.5 h-1.5 bg-accent-green rounded-full" title="License Verified" />
            ) : (
              <span className="w-1.5 h-1.5 bg-accent-red rounded-full" title="License Unverified" />
            )}
          </div>
          <span className="text-[10px] text-text-muted">Class: {row.license_class}</span>
        </div>
      ),
    },
    {
      header: 'Availability',
      accessorKey: 'availability',
      cell: (row: Driver) => {
        const colors: Record<string, string> = {
          available: 'badge-success',
          assigned: 'badge-info',
          driving: 'badge-primary',
          resting: 'badge-draft',
          leave: 'badge-warning',
          suspended: 'badge-error',
        };
        return <span className={`badge ${colors[row.availability] || 'badge-draft'}`}>{row.availability}</span>;
      },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: Driver) => (
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Driver Management</h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Track driver availability, license expiration, medical logs, and road safety metrics
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsCreateOpen(true);
          }}
          className="btn btn-primary self-start md:self-auto flex items-center gap-2 text-xs"
        >
          <Plus size={14} /> Add Driver Profile
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Drivers"
          value={stats?.total_drivers || 0}
          change={`${stats?.active_drivers || 0} active in service`}
          changeType="positive"
          icon={Users}
          iconColor="text-accent-purple"
          sparklineData={[12, 14, 15, 17, 18, 19, 20]}
        />
        <StatCard
          title="On Duty"
          value={stats?.on_duty || 0}
          change={`${stats?.off_duty || 0} resting/off-duty`}
          changeType="positive"
          icon={Clock}
          iconColor="text-accent-blue"
          sparklineData={[8, 10, 9, 11, 12, 11, 10]}
        />
        <StatCard
          title="Expiring Licenses"
          value={stats?.expiring_licenses || 0}
          change="Requires renewal within 30d"
          changeType={stats?.expiring_licenses > 0 ? 'negative' : 'positive'}
          icon={AlertTriangle}
          iconColor="text-accent-red"
          sparklineData={[2, 1, 3, 2, 2, 1, 0]}
        />
        <StatCard
          title="Safety Violations"
          value={drivers.reduce((acc, d) => acc + (d.violations || 0), 0)}
          change="All-time safety events"
          changeType="neutral"
          icon={Award}
          iconColor="text-accent-green"
          sparklineData={[10, 8, 9, 7, 6, 5, 4]}
        />
      </div>

      {/* Filters & Search Row */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-brand-card border border-brand-border p-4 rounded-card">
        <div className="relative w-full sm:w-72">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            <User size={14} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, employee ID, license..."
            className="w-full bg-brand-panel text-white border border-brand-border rounded-input pl-9 pr-4 py-2 text-xs focus:border-accent-purple outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-brand-panel text-white border border-brand-border rounded-input px-3 py-2 text-xs outline-none focus:border-accent-purple"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="bg-brand-panel text-white border border-brand-border rounded-input px-3 py-2 text-xs outline-none focus:border-accent-purple"
          >
            <option value="all">All Availabilities</option>
            <option value="available">Available</option>
            <option value="assigned">Assigned</option>
            <option value="driving">Driving</option>
            <option value="resting">Resting</option>
            <option value="leave">On Leave</option>
            <option value="training">Training</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={drivers}
        isLoading={isLoading}
        onRowClick={(row) => {
          setSelectedDriver(row);
          setActiveTab('profile');
          setIsDetailOpen(true);
        }}
        actions={(row) => (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => {
                setSelectedDriver(row);
                setFormData({
                  employee_id: row.employee_id || '',
                  first_name: row.first_name || '',
                  last_name: row.last_name || '',
                  email: row.email || '',
                  phone: row.phone || '',
                  date_of_birth: row.date_of_birth ? String(row.date_of_birth).split('T')[0] : '',
                  gender: row.gender || 'Male',
                  blood_group: row.blood_group || 'B+',
                  address: row.address || '',
                  city: row.city || '',
                  state: row.state || '',
                  pincode: row.pincode || '',
                  emergency_contact_name: row.emergency_contact_name || '',
                  emergency_contact_phone: row.emergency_contact_phone || '',
                  emergency_contact_relation: row.emergency_contact_relation || '',
                  license_number: row.license_number || '',
                  license_class: row.license_class || 'HMV',
                  license_issue_date: row.license_issue_date ? String(row.license_issue_date).split('T')[0] : '',
                  license_expiry: row.license_expiry ? String(row.license_expiry).split('T')[0] : '',
                  license_issuing_authority: row.license_issuing_authority || '',
                  medical_certificate_number: row.medical_certificate_number || '',
                  medical_certificate_expiry: row.medical_certificate_expiry ? String(row.medical_certificate_expiry).split('T')[0] : '',
                  experience_years: row.experience_years || 0,
                  availability: row.availability || 'available',
                  status: row.status || 'active',
                  notes: row.notes || '',
                });
                setIsEditOpen(true);
              }}
              className="p-1.5 hover:bg-brand-panel rounded text-text-secondary hover:text-white transition-all"
            >
              <Edit size={13} />
            </button>
            <button
              onClick={() => {
                setSelectedDriver(row);
                setIsDeleteOpen(true);
              }}
              className="p-1.5 hover:bg-brand-panel rounded text-text-secondary hover:text-accent-red transition-all"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
      />

      {/* CREATE DRIVER MODAL */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add Fleet Driver"
        description="Register a new commercial truck operator profile"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="form-group">
              <label className="form-label text-xs">Employee ID</label>
              <input
                type="text"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleInputChange}
                required
                placeholder="DRV-101"
                className="input-field text-xs"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs">First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                required
                placeholder="Rajesh"
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
                placeholder="Kumar"
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
                placeholder="rajesh@company.com"
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
                placeholder="+919876500000"
                className="input-field text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="form-group">
              <label className="form-label text-xs">License ID</label>
              <input
                type="text"
                name="license_number"
                value={formData.license_number}
                onChange={handleInputChange}
                required
                placeholder="MH012023001234"
                className="input-field text-xs"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs">License Class</label>
              <select
                name="license_class"
                value={formData.license_class}
                onChange={handleInputChange}
                className="input-field text-xs bg-brand-panel"
              >
                <option value="HMV">HMV (Heavy Motor Vehicle)</option>
                <option value="LMV">LMV (Light Motor Vehicle)</option>
                <option value="MCWG">MCWG (Motorcycle with Gear)</option>
              </select>
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
        title="Update Driver Profile"
        description="Modify personal, employment, and license details"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="form-group">
              <label className="form-label text-xs">Employee ID</label>
              <input
                type="text"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleInputChange}
                required
                className="input-field text-xs"
              />
            </div>
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

          <div className="grid grid-cols-3 gap-4">
            <div className="form-group">
              <label className="form-label text-xs">License ID</label>
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
              <label className="form-label text-xs">License Class</label>
              <select
                name="license_class"
                value={formData.license_class}
                onChange={handleInputChange}
                className="input-field text-xs bg-brand-panel"
              >
                <option value="HMV">HMV (Heavy)</option>
                <option value="LMV">LMV (Light)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label text-xs">License Expiry</label>
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

          <div className="grid grid-cols-3 gap-4">
            <div className="form-group">
              <label className="form-label text-xs">Years of Experience</label>
              <input
                type="number"
                name="experience_years"
                value={formData.experience_years}
                onChange={handleInputChange}
                className="input-field text-xs"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs">Availability</label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                className="input-field text-xs bg-brand-panel"
              >
                <option value="available">Available</option>
                <option value="assigned">Assigned</option>
                <option value="driving">Driving</option>
                <option value="resting">Resting</option>
                <option value="leave">On Leave</option>
                <option value="training">Training</option>
                <option value="suspended">Suspended</option>
                <option value="unavailable">Unavailable</option>
              </select>
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
                <option value="suspended">Suspended</option>
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

      {/* DELETE MODAL */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Driver Profile"
      >
        <div className="flex items-start gap-4">
          <div className="p-2 bg-accent-red/10 rounded-full text-accent-red">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-white text-xs">Remove Driver Profile?</h4>
            <p className="text-xs text-text-secondary mt-1">
              Are you sure you want to delete driver{' '}
              <strong className="text-white">
                {selectedDriver?.first_name} {selectedDriver?.last_name}
              </strong>
              ? This action will mark the driver as deleted.
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
            Confirm Delete
          </button>
        </div>
      </Modal>

      {/* DRIVER PROFILE SLIDE DRAWER */}
      <Drawer
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedDriver(null);
        }}
        title={`${selectedDriver?.first_name} ${selectedDriver?.last_name}`}
        description={`Employee ID: ${selectedDriver?.employee_id || 'N/A'}`}
      >
        {selectedDriver && (
          <div className="space-y-6">
            {/* Tabs Headers */}
            <div className="flex items-center gap-1 border-b border-brand-border select-none">
              {(['profile', 'documents', 'performance', 'attendance'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 -mb-[2px] ${
                    activeTab === t
                      ? 'border-accent-purple text-white'
                      : 'border-transparent text-text-secondary hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Tab Profiles content */}
            {activeTab === 'profile' && (
              <div className="space-y-4 text-xs">
                <div className="bg-brand-panel/30 border border-brand-border/60 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold text-white uppercase text-[10px] tracking-wider text-accent-purple">Personal Info</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-text-muted">Blood Group</p>
                      <p className="font-medium text-white">{selectedDriver.blood_group || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted">Gender</p>
                      <p className="font-medium text-white">{selectedDriver.gender || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted">Date of Birth</p>
                      <p className="font-medium text-white">
                        {selectedDriver.date_of_birth ? String(selectedDriver.date_of_birth).split('T')[0] : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted">Date of Joining</p>
                      <p className="font-medium text-white">
                        {selectedDriver.date_of_joining ? String(selectedDriver.date_of_joining).split('T')[0] : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-brand-divider">
                    <p className="text-[10px] text-text-muted">Address</p>
                    <p className="font-medium text-white">
                      {selectedDriver.address || 'N/A'}, {selectedDriver.city}, {selectedDriver.state} - {selectedDriver.pincode}
                    </p>
                  </div>
                </div>

                <div className="bg-brand-panel/30 border border-brand-border/60 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold text-white uppercase text-[10px] tracking-wider text-accent-purple">Emergency Contact</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-text-muted">Contact Name</p>
                      <p className="font-medium text-white">{selectedDriver.emergency_contact_name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted">Relation</p>
                      <p className="font-medium text-white">{selectedDriver.emergency_contact_relation || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] text-text-muted">Contact Phone</p>
                      <p className="font-medium text-white">{selectedDriver.emergency_contact_phone || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-brand-panel/30 border border-brand-border/60 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold text-white uppercase text-[10px] tracking-wider text-accent-purple">License & Medical Status</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-text-muted">Driving License</p>
                      <p className="font-medium text-white">{selectedDriver.license_number}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted">License Class</p>
                      <p className="font-medium text-white">{selectedDriver.license_class}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted">License Expiry</p>
                      <p className="font-medium text-white">
                        {selectedDriver.license_expiry ? String(selectedDriver.license_expiry).split('T')[0] : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted">Medical Cert Expiry</p>
                      <p className="font-medium text-white">
                        {selectedDriver.medical_certificate_expiry ? String(selectedDriver.medical_certificate_expiry).split('T')[0] : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-white">Verification Documents</h4>
                  <button
                    onClick={() => setIsUploadDocOpen(true)}
                    className="flex items-center gap-1.5 text-accent-purple hover:underline text-xs"
                  >
                    <PlusCircle size={14} /> Upload Doc
                  </button>
                </div>

                {isDocsLoading ? (
                  <div className="py-8 text-center text-text-muted text-xs">Loading documents...</div>
                ) : documents.length === 0 ? (
                  <div className="py-8 text-center text-text-muted text-xs border border-dashed border-brand-border rounded-lg">
                    No documents uploaded.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="bg-brand-panel/30 border border-brand-border/60 p-3.5 rounded-lg flex items-center justify-between text-xs"
                      >
                        <div className="space-y-1">
                          <p className="font-semibold text-white capitalize">{doc.document_type.replace('_', ' ')}</p>
                          <p className="text-[10px] text-text-muted font-mono">{doc.document_number || 'No number'}</p>
                          {doc.expiry_date && (
                            <p className="text-[10px] text-text-secondary">
                              Expires: {String(doc.expiry_date).split('T')[0]}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`badge ${
                              doc.verified ? 'badge-success' : 'badge-draft'
                            }`}
                          >
                            {doc.verified ? 'Verified' : 'Pending'}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {!doc.verified && (
                              <button
                                onClick={() => handleVerifyDoc(doc.id, true)}
                                className="p-1 hover:bg-accent-green/15 text-accent-green rounded"
                                title="Approve Document"
                              >
                                <CheckCircle size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteDoc(doc.id)}
                              className="p-1 hover:bg-accent-red/15 text-text-muted hover:text-accent-red rounded"
                              title="Delete Document"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-brand-panel/30 border border-brand-border/60 p-4 rounded-lg">
                    <p className="text-[10px] text-text-muted">Safety Score</p>
                    <p className="text-2xl font-bold text-accent-green">{selectedDriver.safety_score || 100}%</p>
                  </div>
                  <div className="bg-brand-panel/30 border border-brand-border/60 p-4 rounded-lg">
                    <p className="text-[10px] text-text-muted">Average Rating</p>
                    <p className="text-2xl font-bold text-white">⭐ {selectedDriver.average_rating || '5.00'}</p>
                  </div>
                  <div className="bg-brand-panel/30 border border-brand-border/60 p-4 rounded-lg">
                    <p className="text-[10px] text-text-muted">On Time Percentage</p>
                    <p className="text-2xl font-bold text-accent-blue">{selectedDriver.on_time_percentage || 95}%</p>
                  </div>
                  <div className="bg-brand-panel/30 border border-brand-border/60 p-4 rounded-lg">
                    <p className="text-[10px] text-text-muted">Experience Years</p>
                    <p className="text-2xl font-bold text-white">{selectedDriver.experience_years || 0} Yrs</p>
                  </div>
                </div>

                <div className="bg-brand-panel/30 border border-brand-border/60 p-4 rounded-lg space-y-2">
                  <h4 className="font-semibold text-white uppercase text-[10px] tracking-wider text-accent-purple">Ride Analytics</h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-[10px] text-text-muted">Total Trips</p>
                      <p className="font-semibold text-white">{selectedDriver.total_trips || 0}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted">Completed</p>
                      <p className="font-semibold text-white">{selectedDriver.completed_trips || 0}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted">Cancelled</p>
                      <p className="font-semibold text-white">{selectedDriver.cancelled_trips || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'attendance' && (
              <div className="space-y-4 text-xs">
                <div className="bg-brand-panel/30 border border-brand-border/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-white uppercase text-[10px] tracking-wider text-accent-purple mb-3">Today's Clock</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-text-muted">Status</p>
                      <span className="badge badge-success">Present</span>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted">Clock In</p>
                      <p className="font-semibold text-white">09:12 AM</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted">Working Hours</p>
                      <p className="font-semibold text-white">8.5 Hrs</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* UPLOAD DOCUMENT MODAL */}
      <Modal
        isOpen={isUploadDocOpen}
        onClose={() => setIsUploadDocOpen(false)}
        title="Upload Verification Document"
      >
        <form onSubmit={handleUploadDocSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label text-xs">Document Type</label>
            <select
              name="document_type"
              value={docForm.document_type}
              onChange={handleDocInputChange}
              className="input-field text-xs bg-brand-panel"
            >
              <option value="driving_license">Driving License</option>
              <option value="government_id">Government ID (Aadhaar/PAN)</option>
              <option value="medical_certificate">Medical Certificate</option>
              <option value="police_verification">Police Verification Log</option>
              <option value="address_proof">Address Proof</option>
              <option value="photograph">Photograph</option>
              <option value="employment_contract">Employment Contract</option>
              <option value="other">Other Document</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label text-xs">Document ID / Serial Number</label>
            <input
              type="text"
              name="document_number"
              value={docForm.document_number}
              onChange={handleDocInputChange}
              required
              placeholder="DOC-12345"
              className="input-field text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label text-xs">Issue Date</label>
              <input
                type="date"
                name="issue_date"
                value={docForm.issue_date}
                onChange={handleDocInputChange}
                className="input-field text-xs"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs">Expiry Date</label>
              <input
                type="date"
                name="expiry_date"
                value={docForm.expiry_date}
                onChange={handleDocInputChange}
                className="input-field text-xs"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label text-xs">Issuing Authority</label>
            <input
              type="text"
              name="issuing_authority"
              value={docForm.issuing_authority}
              onChange={handleDocInputChange}
              placeholder="RTO Mumbai / Central Gov"
              className="input-field text-xs"
            />
          </div>

          <div className="form-group">
            <label className="form-label text-xs">Notes</label>
            <textarea
              name="notes"
              value={docForm.notes}
              onChange={handleDocInputChange}
              placeholder="Verification details..."
              className="input-field text-xs h-20 bg-brand-panel"
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-brand-divider">
            <button
              type="button"
              onClick={() => setIsUploadDocOpen(false)}
              className="btn btn-outline text-xs"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary text-xs">
              Upload Document
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
