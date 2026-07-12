'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Edit, Trash2, Users, Clock, AlertTriangle, Award, PlusCircle, CheckCircle } from 'lucide-react';

import DataTable    from '../../components/DataTable';
import Modal        from '../../components/Modal';
import Drawer       from '../../components/Drawer';
import StatCard     from '../../components/StatCard';
import PageHeader   from '../../components/ui/PageHeader';
import FilterBar    from '../../components/ui/FilterBar';
import InfoRow      from '../../components/ui/InfoRow';
import InfoSection  from '../../components/ui/InfoSection';
import DrawerTabs   from '../../components/ui/DrawerTabs';
import ConfirmModal from '../../components/ui/ConfirmModal';
import FormFooter   from '../../components/ui/FormFooter';

import { useDrivers } from '../../modules/drivers/hooks/useDrivers';
import { driverService } from '../../modules/drivers/services/driverService';
import { Driver, DriverDocument } from '@transitops/types';

const STATUS_FILTERS = [
  { label: 'All',       value: 'all' },
  { label: 'Active',    value: 'active' },
  { label: 'Suspended', value: 'suspended' },
  { label: 'Inactive',  value: 'inactive' },
];

const AVAIL_FILTERS = [
  { label: 'All',        value: 'all' },
  { label: 'Available',  value: 'available' },
  { label: 'Driving',    value: 'driving' },
  { label: 'On Leave',   value: 'leave' },
];

const DRAWER_TABS = [
  { id: 'profile',     label: 'Profile' },
  { id: 'documents',   label: 'Documents' },
  { id: 'performance', label: 'Performance' },
];

const defaultForm = {
  employee_id: '', first_name: '', last_name: '', email: '', phone: '',
  date_of_birth: '', gender: 'Male', blood_group: 'B+',
  address: '', city: '', state: '', pincode: '',
  emergency_contact_name: '', emergency_contact_phone: '', emergency_contact_relation: '',
  license_number: '', license_class: 'HMV',
  license_issue_date: '', license_expiry: '', license_issuing_authority: '',
  medical_certificate_number: '', medical_certificate_expiry: '',
  experience_years: 0, availability: 'available', status: 'active', notes: '',
};

const defaultDocForm = {
  document_type: 'driving_license', document_number: '',
  issue_date: '', expiry_date: '', issuing_authority: '',
  file_url: 'https://example.com/mock-doc.pdf', notes: '',
};

export default function DriversPage() {
  const {
    drivers, isLoading, createDriver, updateDriver, deleteDriver,
    stats, search, setSearch, status, setStatus, availability, setAvailability, refresh,
  } = useDrivers();

  const [selected,       setSelected]       = useState<Driver | null>(null);
  const [activeTab,      setActiveTab]       = useState('profile');
  const [documents,      setDocuments]       = useState<DriverDocument[]>([]);
  const [isDocsLoading,  setIsDocsLoading]   = useState(false);
  const [isCreateOpen,   setIsCreateOpen]    = useState(false);
  const [isEditOpen,     setIsEditOpen]      = useState(false);
  const [isDeleteOpen,   setIsDeleteOpen]    = useState(false);
  const [isDetailOpen,   setIsDetailOpen]    = useState(false);
  const [isUploadDocOpen,setIsUploadDocOpen] = useState(false);
  const [submitting,     setSubmitting]      = useState(false);
  const [formData,       setFormData]        = useState<any>(defaultForm);
  const [docForm,        setDocForm]         = useState(defaultDocForm);

  const loadDocuments = useCallback(async (driverId: string) => {
    setIsDocsLoading(true);
    try {
      const docs = await driverService.getDocuments(driverId);
      setDocuments(docs);
    } catch { /* silent */ }
    finally { setIsDocsLoading(false); }
  }, []);

  useEffect(() => {
    if (selected && isDetailOpen) loadDocuments(selected.id);
  }, [selected, isDetailOpen, loadDocuments]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((p: any) => ({ ...p, [name]: value }));
    }, [],
  );

  const handleDocChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setDocForm((p) => ({ ...p, [name]: value }));
    }, [],
  );

  const resetForm = useCallback(() => { setFormData(defaultForm); setSelected(null); }, []);

  const fillEdit = useCallback((row: Driver) => {
    setFormData({
      employee_id: row.employee_id || '', first_name: row.first_name || '', last_name: row.last_name || '',
      email: row.email || '', phone: row.phone || '',
      date_of_birth: row.date_of_birth ? String(row.date_of_birth).split('T')[0] : '',
      gender: row.gender || 'Male', blood_group: row.blood_group || 'B+',
      address: row.address || '', city: row.city || '', state: row.state || '', pincode: row.pincode || '',
      emergency_contact_name: row.emergency_contact_name || '',
      emergency_contact_phone: row.emergency_contact_phone || '',
      emergency_contact_relation: row.emergency_contact_relation || '',
      license_number: row.license_number || '', license_class: row.license_class || 'HMV',
      license_issue_date: row.license_issue_date ? String(row.license_issue_date).split('T')[0] : '',
      license_expiry: row.license_expiry ? String(row.license_expiry).split('T')[0] : '',
      license_issuing_authority: row.license_issuing_authority || '',
      medical_certificate_number: row.medical_certificate_number || '',
      medical_certificate_expiry: row.medical_certificate_expiry ? String(row.medical_certificate_expiry).split('T')[0] : '',
      experience_years: row.experience_years || 0,
      availability: row.availability || 'available', status: row.status || 'active', notes: row.notes || '',
    });
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    try { await createDriver(formData); setIsCreateOpen(false); resetForm(); }
    catch (err: any) { alert(err.message || 'Failed to register driver'); }
    finally { setSubmitting(false); }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    try { await updateDriver(selected.id, formData); setIsEditOpen(false); resetForm(); }
    catch (err: any) { alert(err.message || 'Failed to update driver'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSubmitting(true);
    try { await deleteDriver(selected.id); setIsDeleteOpen(false); setSelected(null); }
    catch (err: any) { alert(err.message || 'Failed to delete driver'); }
    finally { setSubmitting(false); }
  };

  const handleUploadDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    try {
      await driverService.uploadDocument(selected.id, docForm as any);
      setIsUploadDocOpen(false);
      setDocForm(defaultDocForm);
      loadDocuments(selected.id);
    } catch (err: any) { alert(err.message || 'Failed to upload document'); }
    finally { setSubmitting(false); }
  };

  const handleVerifyDoc = async (docId: string) => {
    if (!selected) return;
    try {
      await driverService.verifyDocument(selected.id, docId, true, 'Verified by operator');
      loadDocuments(selected.id);
      const updated = await driverService.getById(selected.id);
      if (updated) { setSelected(updated); refresh(); }
    } catch (err: any) { alert(err.message || 'Failed to verify document'); }
  };

  const handleDeleteDoc = async (docId: string) => {
    if (!selected || !confirm('Delete this document?')) return;
    try {
      await driverService.deleteDocument(selected.id, docId);
      loadDocuments(selected.id);
      const updated = await driverService.getById(selected.id);
      if (updated) { setSelected(updated); refresh(); }
    } catch (err: any) { alert(err.message || 'Failed to delete document'); }
  };

  const AVAIL_COLORS: Record<string, string> = {
    available: 'badge-success', assigned: 'badge-info', driving: 'badge-purple',
    resting: 'badge-draft', leave: 'badge-warning', suspended: 'badge-error',
  };

  const columns = [
    {
      header: 'Employee',
      accessorKey: 'first_name',
      sortable: true,
      cell: (row: Driver) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center text-accent-purple-soft font-bold text-xs flex-shrink-0">
            {row.first_name[0]}{row.last_name[0]}
          </div>
          <div>
            <p className="text-xs font-semibold text-text-primary">{row.first_name} {row.last_name}</p>
            <p className="text-2xs text-text-muted">{row.employee_id}</p>
          </div>
        </div>
      ),
    },
    { header: 'Phone', accessorKey: 'phone', cell: (row: Driver) => <span className="text-xs tabular-nums text-text-secondary">{row.phone}</span> },
    {
      header: 'License',
      accessorKey: 'license_number',
      cell: (row: Driver) => (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs text-text-secondary">{row.license_number}</span>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${row.license_verified ? 'bg-accent-green-soft' : 'bg-accent-red-soft'}`} title={row.license_verified ? 'Verified' : 'Unverified'} />
          </div>
          <span className="text-2xs text-text-muted">Class: {row.license_class}</span>
        </div>
      ),
    },
    {
      header: 'Availability',
      accessorKey: 'availability',
      cell: (row: Driver) => (
        <span className={`badge ${AVAIL_COLORS[row.availability] || 'badge-draft'}`}>{row.availability}</span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row: Driver) => (
        <span className={`badge ${row.status === 'active' ? 'badge-success' : row.status === 'suspended' ? 'badge-error' : 'badge-draft'}`}>{row.status}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Driver Management"
        description="Track availability, licence expiration, medical logs, and road safety metrics"
        actions={
          <button onClick={() => { resetForm(); setIsCreateOpen(true); }} className="btn btn-primary">
            <Plus size={14} /> Add Driver
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Drivers"       value={stats?.total_drivers || 0}       change={`${stats?.active_drivers || 0} active`}     changeType="positive" icon={Users}         iconColor="text-accent-purple-soft" iconBg="bg-purple-500/10" sparklineData={[12,14,15,17,18,19,20]} />
        <StatCard title="On Duty"             value={stats?.on_duty || 0}             change={`${stats?.off_duty || 0} resting`}           changeType="positive" icon={Clock}         iconColor="text-accent-blue-soft"   iconBg="bg-blue-500/10"   sparklineData={[8,10,9,11,12,11,10]} />
        <StatCard title="Expiring Licences"   value={stats?.expiring_licenses || 0}   change="Renew within 30d"                            changeType={stats?.expiring_licenses > 0 ? 'negative' : 'positive'} icon={AlertTriangle} iconColor="text-accent-red-soft"    iconBg="bg-red-500/10"    sparklineData={[2,1,3,2,2,1,0]} />
        <StatCard title="Safety Violations"   value={drivers.reduce((a, d) => a + (d.violations || 0), 0)} change="All-time events" changeType="neutral" icon={Award} iconColor="text-accent-green-soft" iconBg="bg-green-500/10" sparklineData={[10,8,9,7,6,5,4]} />
      </div>

      {/* Inline filter row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 card">
        <div className="input-with-icon flex-1 min-w-0 max-w-72">
          <span className="input-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, ID, licence…" className="input-field" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field w-auto">
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="inactive">Inactive</option>
          </select>
          <select value={availability} onChange={(e) => setAvailability(e.target.value)} className="input-field w-auto">
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

      <DataTable
        columns={columns}
        data={drivers}
        isLoading={isLoading}
        onRowClick={(row) => { setSelected(row); setActiveTab('profile'); setIsDetailOpen(true); }}
        actions={(row) => (
          <div className="flex items-center justify-end gap-1">
            <button className="btn-icon" title="Edit" onClick={() => { setSelected(row); fillEdit(row); setIsEditOpen(true); }}><Edit size={14} /></button>
            <button className="btn-icon hover:text-accent-red-soft" title="Delete" onClick={() => { setSelected(row); setIsDeleteOpen(true); }}><Trash2 size={14} /></button>
          </div>
        )}
      />

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => { setIsCreateOpen(false); resetForm(); }} title="Register Driver" description="Add a new commercial driver profile" size="lg">
        <form onSubmit={handleCreate} className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            <div className="form-group"><label className="form-label">Employee ID</label><input name="employee_id" value={formData.employee_id} onChange={handleChange} required placeholder="DRV-101" className="input-field" /></div>
            <div className="form-group"><label className="form-label">First Name</label><input name="first_name" value={formData.first_name} onChange={handleChange} required placeholder="Rajesh" className="input-field" /></div>
            <div className="form-group"><label className="form-label">Last Name</label><input name="last_name" value={formData.last_name} onChange={handleChange} required placeholder="Kumar" className="input-field" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group"><label className="form-label">Email</label><input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="rajesh@company.com" className="input-field" /></div>
            <div className="form-group"><label className="form-label">Phone</label><input name="phone" value={formData.phone} onChange={handleChange} required placeholder="+919876500000" className="input-field" /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="form-group"><label className="form-label">Licence Number</label><input name="license_number" value={formData.license_number} onChange={handleChange} required placeholder="MH012023001234" className="input-field font-mono" /></div>
            <div className="form-group"><label className="form-label">Licence Class</label>
              <select name="license_class" value={formData.license_class} onChange={handleChange} className="input-field">
                <option value="HMV">HMV – Heavy Motor Vehicle</option>
                <option value="LMV">LMV – Light Motor Vehicle</option>
                <option value="MCWG">MCWG – Motorcycle with Gear</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">Licence Expiry</label><input name="license_expiry" type="date" value={formData.license_expiry} onChange={handleChange} required className="input-field" /></div>
          </div>
          <FormFooter onCancel={() => { setIsCreateOpen(false); resetForm(); }} submitLabel="Register Driver" loading={submitting} />
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => { setIsEditOpen(false); resetForm(); }} title="Edit Driver Profile" description="Update personal, employment, and licence details" size="lg">
        <form onSubmit={handleEdit} className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            <div className="form-group"><label className="form-label">Employee ID</label><input name="employee_id" value={formData.employee_id} onChange={handleChange} required className="input-field" /></div>
            <div className="form-group"><label className="form-label">First Name</label><input name="first_name" value={formData.first_name} onChange={handleChange} required className="input-field" /></div>
            <div className="form-group"><label className="form-label">Last Name</label><input name="last_name" value={formData.last_name} onChange={handleChange} required className="input-field" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group"><label className="form-label">Email</label><input name="email" type="email" value={formData.email} onChange={handleChange} required className="input-field" /></div>
            <div className="form-group"><label className="form-label">Phone</label><input name="phone" value={formData.phone} onChange={handleChange} required className="input-field" /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="form-group"><label className="form-label">Licence Number</label><input name="license_number" value={formData.license_number} onChange={handleChange} required className="input-field font-mono" /></div>
            <div className="form-group"><label className="form-label">Availability</label>
              <select name="availability" value={formData.availability} onChange={handleChange} className="input-field">
                {['available','assigned','driving','resting','leave','training','suspended','unavailable'].map(v => <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="input-field">
                <option value="active">Active</option><option value="inactive">Inactive</option><option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
          <FormFooter onCancel={() => { setIsEditOpen(false); resetForm(); }} submitLabel="Save Changes" loading={submitting} />
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDelete} title="Remove Driver" confirmLabel="Remove Driver" loading={submitting}
        description={<>Remove <strong className="text-text-primary">{selected?.first_name} {selected?.last_name}</strong>? This will mark the driver as deleted.</>}
      />

      {/* Detail Drawer */}
      <Drawer
        isOpen={isDetailOpen}
        onClose={() => { setIsDetailOpen(false); setSelected(null); }}
        title={selected ? `${selected.first_name} ${selected.last_name}` : ''}
        description={`Employee ID: ${selected?.employee_id || '—'}`}
        width="max-w-lg"
      >
        {selected && (
          <div className="space-y-4">
            <DrawerTabs tabs={DRAWER_TABS} active={activeTab} onChange={setActiveTab} />

            {activeTab === 'profile' && (
              <div className="space-y-4">
                <InfoSection title="Personal Info">
                  <InfoRow label="Blood Group"   value={selected.blood_group || '—'} />
                  <InfoRow label="Gender"        value={selected.gender || '—'} />
                  <InfoRow label="Date of Birth" value={selected.date_of_birth ? String(selected.date_of_birth).split('T')[0] : '—'} />
                  <InfoRow label="Joined"        value={selected.date_of_joining ? String(selected.date_of_joining).split('T')[0] : '—'} />
                  <InfoRow label="Address"       value={[selected.address, selected.city, selected.state, selected.pincode].filter(Boolean).join(', ') || '—'} />
                </InfoSection>
                <InfoSection title="Emergency Contact">
                  <InfoRow label="Name"     value={selected.emergency_contact_name || '—'} />
                  <InfoRow label="Relation" value={selected.emergency_contact_relation || '—'} />
                  <InfoRow label="Phone"    value={selected.emergency_contact_phone || '—'} />
                </InfoSection>
                <InfoSection title="Licence & Medical">
                  <InfoRow label="Licence #"        value={selected.license_number} mono />
                  <InfoRow label="Licence Class"    value={selected.license_class} />
                  <InfoRow label="Licence Expiry"   value={selected.license_expiry ? String(selected.license_expiry).split('T')[0] : '—'} />
                  <InfoRow label="Medical Expiry"   value={selected.medical_certificate_expiry ? String(selected.medical_certificate_expiry).split('T')[0] : '—'} />
                </InfoSection>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-text-primary">Verification Documents</p>
                  <button onClick={() => setIsUploadDocOpen(true)} className="flex items-center gap-1.5 text-xs text-accent-purple-mid hover:text-accent-purple-soft transition-colors">
                    <PlusCircle size={13} /> Upload
                  </button>
                </div>
                {isDocsLoading ? (
                  <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="shimmer-bg h-14 rounded-xl" />)}</div>
                ) : documents.length === 0 ? (
                  <div className="empty-state border border-dashed border-brand-border rounded-xl">
                    <p className="text-xs text-text-muted">No documents uploaded yet.</p>
                  </div>
                ) : (
                  documents.map((doc) => (
                    <div key={doc.id} className="card p-3.5 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-text-primary capitalize">{doc.document_type.replace(/_/g, ' ')}</p>
                        <p className="text-2xs text-text-muted font-mono mt-0.5">{doc.document_number || '—'}</p>
                        {doc.expiry_date && <p className="text-2xs text-text-muted">Expires: {String(doc.expiry_date).split('T')[0]}</p>}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`badge ${doc.verified ? 'badge-success' : 'badge-draft'}`}>{doc.verified ? 'Verified' : 'Pending'}</span>
                        {!doc.verified && <button onClick={() => handleVerifyDoc(doc.id)} className="btn-icon text-accent-green-soft hover:bg-green-500/10" title="Verify"><CheckCircle size={14} /></button>}
                        <button onClick={() => handleDeleteDoc(doc.id)} className="btn-icon hover:text-accent-red-soft" title="Delete"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Safety Score',     value: `${selected.safety_score || 100}%`,           color: 'text-accent-green-soft' },
                    { label: 'Avg Rating',        value: `⭐ ${selected.average_rating || '5.00'}`,    color: 'text-text-primary' },
                    { label: 'On-Time %',         value: `${selected.on_time_percentage || 95}%`,       color: 'text-accent-blue-soft' },
                    { label: 'Experience',        value: `${selected.experience_years || 0} yrs`,       color: 'text-text-primary' },
                  ].map((m) => (
                    <div key={m.label} className="card p-3.5">
                      <p className="text-2xs text-text-muted mb-1">{m.label}</p>
                      <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
                    </div>
                  ))}
                </div>
                <InfoSection title="Trip Analytics">
                  <InfoRow label="Total Trips"     value={selected.total_trips || 0} />
                  <InfoRow label="Completed"       value={selected.completed_trips || 0} />
                  <InfoRow label="Cancelled"       value={selected.cancelled_trips || 0} />
                </InfoSection>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Upload Doc Modal */}
      <Modal isOpen={isUploadDocOpen} onClose={() => setIsUploadDocOpen(false)} title="Upload Document" description="Attach a verification or compliance document">
        <form onSubmit={handleUploadDoc} className="space-y-4">
          <div className="form-group"><label className="form-label">Document Type</label>
            <select name="document_type" value={docForm.document_type} onChange={handleDocChange} className="input-field">
              <option value="driving_license">Driving Licence</option>
              <option value="government_id">Government ID</option>
              <option value="medical_certificate">Medical Certificate</option>
              <option value="police_verification">Police Verification</option>
              <option value="address_proof">Address Proof</option>
              <option value="photograph">Photograph</option>
              <option value="employment_contract">Employment Contract</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group"><label className="form-label">Document Number</label><input name="document_number" value={docForm.document_number} onChange={handleDocChange} required placeholder="DOC-12345" className="input-field font-mono" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group"><label className="form-label">Issue Date</label><input name="issue_date" type="date" value={docForm.issue_date} onChange={handleDocChange} className="input-field" /></div>
            <div className="form-group"><label className="form-label">Expiry Date</label><input name="expiry_date" type="date" value={docForm.expiry_date} onChange={handleDocChange} className="input-field" /></div>
          </div>
          <div className="form-group"><label className="form-label">Issuing Authority</label><input name="issuing_authority" value={docForm.issuing_authority} onChange={handleDocChange} placeholder="RTO Mumbai" className="input-field" /></div>
          <div className="form-group"><label className="form-label">Notes</label><textarea name="notes" value={docForm.notes} onChange={handleDocChange} placeholder="Verification details…" className="input-field" rows={3} /></div>
          <FormFooter onCancel={() => setIsUploadDocOpen(false)} submitLabel="Upload Document" loading={submitting} />
        </form>
      </Modal>
    </div>
  );
}
