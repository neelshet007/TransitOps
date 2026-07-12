'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Truck, Compass, TrendingUp, AlertTriangle, UserCheck,
  Plus, FileText, CheckCircle, MapPin, Activity, CloudRain, CloudSun, ChevronRight,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';

import StatCard  from '../../components/StatCard';
import ChartCard from '../../components/ChartCard';
import Modal     from '../../components/Modal';
import FormFooter from '../../components/ui/FormFooter';

import { useDashboard } from '../../modules/dashboard/hooks/useDashboard';
import { driverService } from '../../modules/drivers/services/driverService';
import { Driver } from '@transitops/types';

const CHART_STYLE = {
  tooltip: { backgroundColor: '#181C28', borderColor: '#212636', borderRadius: 8 },
  grid:    '#1A1E2C',
  axis:    '#525B72',
  sz:      11,
};

const financialData = [
  { month: 'Jan', revenue: 4500000, expenses: 3100000 },
  { month: 'Feb', revenue: 5200000, expenses: 3400000 },
  { month: 'Mar', revenue: 6100000, expenses: 3800000 },
  { month: 'Apr', revenue: 5800000, expenses: 3600000 },
  { month: 'May', revenue: 6700000, expenses: 4100000 },
  { month: 'Jun', revenue: 7500000, expenses: 4500000 },
];

const fuelData = [
  { day: 'Mon', liters: 4520 },
  { day: 'Tue', liters: 4890 },
  { day: 'Wed', liters: 5120 },
  { day: 'Thu', liters: 4670 },
  { day: 'Fri', liters: 5280 },
  { day: 'Sat', liters: 3120 },
  { day: 'Sun', liters: 2450 },
];

const upcomingServices = [
  { id: 'm1', vehicle: 'MH-12-Q-4521', type: 'Brake Disc Inspection', date: 'Jul 15', cost: '₹12,500' },
  { id: 'm2', vehicle: 'DL-01-A-8962', type: 'Differential Oil Flush', date: 'Jul 18', cost: '₹8,400' },
];

const corridorNodes = [
  { label: 'Delhi Hub',          top: '10%', left: '50%', color: 'text-accent-amber-soft' },
  { label: 'Mumbai Depot',       top: '52%', left: '36%', color: 'text-accent-blue-soft' },
  { label: 'Bengaluru Terminal', top: '76%', left: '42%', color: 'text-accent-green-soft' },
  { label: 'Kolkata Hub',        top: '34%', left: '64%', color: 'text-accent-purple-soft' },
];

function getTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function DashboardPage() {
  const { stats, isLoading, logActivity } = useDashboard();
  const [isDispatchOpen,   setIsDispatchOpen]   = useState(false);
  const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([]);
  const [submitting,       setSubmitting]        = useState(false);
  const [dispatchForm,     setDispatchForm]      = useState({
    origin: 'Mumbai Depot', destination: 'Delhi Hub',
    driver_id: '', vehicle_plate: 'MH-12-Q-4521', start_odometer: '125400',
  });

  const loadDrivers = useCallback(async () => {
    try {
      const res = await driverService.getAll({ availability: 'available', limit: 100 });
      setAvailableDrivers(res.data);
      if (res.data.length > 0) setDispatchForm((p) => ({ ...p, driver_id: res.data[0].id }));
    } catch { /* silent */ }
  }, []);

  useEffect(() => { if (isDispatchOpen) loadDrivers(); }, [isDispatchOpen, loadDrivers]);

  const handleDispatchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDispatchForm((p) => ({ ...p, [name]: value }));
  };

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const drv = availableDrivers.find((d) => d.id === dispatchForm.driver_id);
      const name = drv ? `${drv.first_name} ${drv.last_name}` : 'Unknown';
      await logActivity('TRIP_DISPATCHED', `Route: ${dispatchForm.origin} → ${dispatchForm.destination} | Vehicle: ${dispatchForm.vehicle_plate} | Driver: ${name}`);
      setIsDispatchOpen(false);
    } catch { /* silent */ }
    finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="page-title">Operations Control</h1>
          <p className="page-subtitle">VRL Logistics India — Regional Dispatch Dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsDispatchOpen(true)} className="btn btn-primary btn-sm">
            <Plus size={13} /> New Dispatch
          </button>
          <button onClick={() => alert('Exporting logs…')} className="btn btn-secondary btn-sm">
            <FileText size={13} /> Export Logs
          </button>
        </div>
      </div>

      {/* Status widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: CloudRain, bg: 'bg-blue-500/10', color: 'text-accent-blue-soft',  label: 'MUMBAI TERMINAL', value: '31°C · Monsoon Rains', anim: true },
          { icon: CloudSun,  bg: 'bg-amber-500/10', color: 'text-accent-amber-soft', label: 'DELHI TRANSIT HUB', value: '38°C · Overcast haze', anim: false },
          null, // colspan placeholder
        ].filter(Boolean).map((w: any, i) => (
          <div key={i} className="card p-4 flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${w.bg}`}>
              <w.icon size={18} className={`${w.color} ${w.anim ? 'animate-bounce-sm' : ''}`} />
            </div>
            <div>
              <p className="label-xs">{w.label}</p>
              <p className="text-xs font-semibold text-text-primary">{w.value}</p>
            </div>
          </div>
        ))}
        <div className="md:col-span-2 card p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-green-500/10">
            <CheckCircle size={18} className="text-accent-green-soft" />
          </div>
          <div>
            <p className="label-xs">SYSTEM STATUS</p>
            <p className="text-xs font-semibold text-text-primary">All gateways operational · 0 latencies</p>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Active Vehicles" value={isLoading ? '…' : `${stats?.active_vehicles ?? 0} / ${stats?.total_vehicles ?? 0}`} change={`${stats?.total_vehicles ?? 0} registered`} changeType="positive" icon={Truck}     iconColor="text-accent-blue-soft"   iconBg="bg-blue-500/10"   sparklineData={[38,39,40,38,41,42,42]} />
        <StatCard title="Trips Tracked"   value={isLoading ? '…' : String(stats?.total_trips ?? 0)}                                  change={`${stats?.active_trips ?? 0} active`}       changeType="neutral"  icon={Compass}   iconColor="text-accent-purple-soft" iconBg="bg-purple-500/10" sparklineData={[15,18,16,20,19,17,18]} />
        <StatCard title="Total Users"     value={isLoading ? '…' : String(stats?.total_users ?? 0)}                                  change={`${stats?.total_roles ?? 0} roles`}          changeType="positive" icon={TrendingUp} iconColor="text-accent-green-soft"  iconBg="bg-green-500/10"  sparklineData={[80,81,83,82,83,84,84]} />
        <StatCard title="Upcoming Service" value={isLoading ? '…' : String(stats?.upcoming_maintenance ?? 0)}                        change="Brakes & Oil"                                changeType="negative" icon={AlertTriangle} iconColor="text-accent-red-soft"  iconBg="bg-red-500/10"    sparklineData={[5,4,3,4,2,3,3]} />
        <StatCard title="Drivers Available" value={isLoading ? '…' : `${stats?.available_drivers ?? 0} / ${stats?.total_drivers ?? 0}`} change={`${stats?.drivers_on_leave ?? 0} on leave`} changeType="neutral" icon={UserCheck} iconColor="text-accent-amber-soft"  iconBg="bg-amber-500/10"  sparklineData={[35,36,35,37,36,38,38]} />
      </div>

      {/* Map + Activity feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Corridor Map */}
        <div className="lg:col-span-2 card p-5 flex flex-col min-h-[360px]">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-brand-border">
            <div>
              <h4 className="section-title">Corridor Dispatch Status</h4>
              <p className="text-xs text-text-muted mt-0.5">Real-time connecting routes between primary Indian hub terminals</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-accent-green-soft bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-accent-green-soft rounded-full animate-pulse" /> Live
            </span>
          </div>
          <div className="flex-1 rounded-xl border border-brand-border bg-[#070810] relative overflow-hidden">
            {/* Dot grid */}
            <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:18px_18px]" />
            {/* SVG routes */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 300" fill="none" preserveAspectRatio="xMidYMid meet">
              <path d="M250,30 L180,155" stroke="#60A5FA" strokeWidth="1.5" className="route-animate" />
              <path d="M180,155 L210,228" stroke="#34D399" strokeWidth="1.5" className="route-animate" />
              <path d="M210,228 L320,102" stroke="#A78BFA" strokeWidth="1.5" className="route-animate" />
              <path d="M320,102 L250,30" stroke="#FCD34D" strokeWidth="1.5" className="route-animate" />
            </svg>
            {/* Nodes */}
            {corridorNodes.map((node) => (
              <div key={node.label} className="absolute flex flex-col items-center" style={{ top: node.top, left: node.left, transform: 'translate(-50%,-50%)' }}>
                <MapPin size={15} className={`${node.color} animate-bounce-sm`} />
                <span className="text-[9px] font-semibold text-text-muted mt-0.5 bg-brand-elevated/80 backdrop-blur-sm px-1.5 py-0.5 rounded border border-brand-border whitespace-nowrap">
                  {node.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div className="card p-5 flex flex-col">
          <h4 className="section-title mb-4">Operations Timeline</h4>
          <div className="flex-1 space-y-3 overflow-y-auto max-h-72 pr-1">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="shimmer-bg w-7 h-7 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-1.5 pt-1">
                    <div className="shimmer-bg h-3 w-3/4 rounded" />
                    <div className="shimmer-bg h-2.5 w-full rounded" />
                  </div>
                </div>
              ))
            ) : !stats?.recent_activities?.length ? (
              <p className="text-xs text-text-muted text-center py-8">No recent activities recorded.</p>
            ) : (
              stats.recent_activities.map((act: any) => (
                <motion.div
                  key={act.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3 p-3 card"
                >
                  <div className="p-1.5 rounded-lg bg-accent-purple/10 flex-shrink-0 mt-0.5">
                    <Activity size={12} className="text-accent-purple-soft" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-text-primary capitalize leading-tight">
                      {act.action.replace(/_/g, ' ').toLowerCase()}
                    </p>
                    <p className="text-2xs text-text-muted mt-0.5 leading-snug line-clamp-2">
                      {act.details || `${act.action} action performed`}
                    </p>
                    <span className="text-2xs text-text-disabled mt-1 block">{getTimeAgo(act.created_at)}</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <ChartCard title="Revenue Operations" subtitle="Gross shipping vs operating costs (₹)" minHeight={240}>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={financialData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="dRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#A78BFA" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#A78BFA" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="dExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#525B72" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#525B72" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_STYLE.grid} vertical={false} />
              <XAxis dataKey="month" stroke={CHART_STYLE.axis} fontSize={CHART_STYLE.sz} tickLine={false} axisLine={false} />
              <YAxis stroke={CHART_STYLE.axis} fontSize={CHART_STYLE.sz} tickFormatter={(v) => `₹${v / 100000}L`} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={CHART_STYLE.tooltip} />
              <Area type="monotone" dataKey="revenue"  stroke="#A78BFA" strokeWidth={2} fill="url(#dRev)" name="Gross Revenue" />
              <Area type="monotone" dataKey="expenses" stroke="#525B72" strokeWidth={2} fill="url(#dExp)" name="Operating Costs" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fuel Consumption" subtitle="Volumetric litres refuelled (7-day)" minHeight={240}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={fuelData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_STYLE.grid} vertical={false} />
              <XAxis dataKey="day" stroke={CHART_STYLE.axis} fontSize={CHART_STYLE.sz} tickLine={false} axisLine={false} />
              <YAxis stroke={CHART_STYLE.axis} fontSize={CHART_STYLE.sz} tickFormatter={(v) => `${v}L`} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={CHART_STYLE.tooltip} />
              <Bar dataKey="liters" fill="#60A5FA" radius={[4, 4, 0, 0]} name="Litres Refuelled" barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Upcoming Service */}
        <div className="card p-5 flex flex-col">
          <h4 className="section-title mb-4">Upcoming Service</h4>
          <div className="space-y-3 flex-1">
            {upcomingServices.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-3 p-3 card card-hover">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-text-primary leading-tight">{s.type}</p>
                  <p className="text-2xs text-text-muted mt-0.5">{s.vehicle} · {s.date}</p>
                </div>
                <span className="text-xs font-semibold text-accent-green-soft flex-shrink-0">{s.cost}</span>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full text-center text-xs text-accent-purple-mid hover:text-accent-purple-soft transition-colors flex items-center justify-center gap-1 pt-4 border-t border-brand-border">
            Schedule Service <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* Dispatch Modal */}
      <Modal isOpen={isDispatchOpen} onClose={() => setIsDispatchOpen(false)} title="New Fleet Dispatch" description="Assign a driver and vehicle to start a new transport corridor">
        <form onSubmit={handleDispatch} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Origin Station</label>
              <input name="origin" value={dispatchForm.origin} onChange={handleDispatchChange} required className="input-field" />
            </div>
            <div className="form-group">
              <label className="form-label">Destination Hub</label>
              <input name="destination" value={dispatchForm.destination} onChange={handleDispatchChange} required className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Available Driver</label>
              <select name="driver_id" value={dispatchForm.driver_id} onChange={handleDispatchChange} required className="input-field">
                {availableDrivers.length === 0
                  ? <option value="" disabled>No drivers available</option>
                  : availableDrivers.map((d) => (
                      <option key={d.id} value={d.id}>{d.first_name} {d.last_name} ({d.employee_id})</option>
                    ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Vehicle Plate</label>
              <input name="vehicle_plate" value={dispatchForm.vehicle_plate} onChange={handleDispatchChange} required className="input-field font-mono" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Starting Odometer (km)</label>
            <input name="start_odometer" type="number" value={dispatchForm.start_odometer} onChange={handleDispatchChange} required className="input-field" />
          </div>
          <FormFooter onCancel={() => setIsDispatchOpen(false)} submitLabel="Confirm Dispatch" loading={submitting} />
        </form>
      </Modal>
    </div>
  );
}
