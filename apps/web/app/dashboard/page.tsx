'use client';

import React, { useState } from 'react';
import {
  Truck,
  Compass,
  TrendingUp,
  AlertTriangle,
  UserCheck,
  ChevronRight,
  MapPin,
  Activity,
  CheckCircle,
  Plus,
  FileText,
  CloudRain,
  CloudSun,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import StatCard from '../../components/StatCard';
import ChartCard from '../../components/ChartCard';
import Modal from '../../components/Modal';
import { useDashboard } from '../../modules/dashboard/hooks/useDashboard';
import { driverService } from '../../modules/drivers/services/driverService';
import { Driver } from '@transitops/types';
import { useEffect } from 'react';

// Realistic Indian corporate dataset
const financialData = [
  { month: 'Jan', revenue: 4500000, expenses: 3100000 },
  { month: 'Feb', revenue: 5200000, expenses: 3400000 },
  { month: 'Mar', revenue: 6100000, expenses: 3800000 },
  { month: 'Apr', revenue: 5800000, expenses: 3600000 },
  { month: 'May', revenue: 6700000, expenses: 4100000 },
  { month: 'Jun', revenue: 7500000, expenses: 4500000 },
];

const fuelConsumptionData = [
  { day: 'Mon', liters: 4520 },
  { day: 'Tue', liters: 4890 },
  { day: 'Wed', liters: 5120 },
  { day: 'Thu', liters: 4670 },
  { day: 'Fri', liters: 5280 },
  { day: 'Sat', liters: 3120 },
  { day: 'Sun', liters: 2450 },
];

const upcomingServices = [
  {
    id: 'maint-101',
    vehicle: 'MH-12-Q-4521',
    type: 'Brake Disc Inspection',
    date: 'Jul 15, 2026',
    cost: '₹12,500',
  },
  {
    id: 'maint-102',
    vehicle: 'DL-01-A-8962',
    type: 'Differential Oil Flush',
    date: 'Jul 18, 2026',
    cost: '₹8,400',
  },
];

export default function DashboardPage() {
  const { stats, isLoading, logActivity } = useDashboard();
  const [activeFilter, setActiveFilter] = useState('all');
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([]);
  const [dispatchForm, setDispatchForm] = useState({
    origin: 'Mumbai Depot',
    destination: 'Delhi Hub',
    driver_id: '',
    vehicle_plate: 'MH-12-Q-4521',
    start_odometer: '125400',
  });

  const loadAvailableDrivers = async () => {
    try {
      const res = await driverService.getAll({ availability: 'available', limit: 100 });
      setAvailableDrivers(res.data);
      if (res.data.length > 0) {
        setDispatchForm(prev => ({ ...prev, driver_id: res.data[0].id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isDispatchOpen) {
      loadAvailableDrivers();
    }
  }, [isDispatchOpen]);

  const handleDispatchInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDispatchForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDispatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedDriver = availableDrivers.find(d => d.id === dispatchForm.driver_id);
    const driverName = selectedDriver ? `${selectedDriver.first_name} ${selectedDriver.last_name}` : 'Unknown Driver';
    const details = `Route dispatched: ${dispatchForm.origin} ➔ ${dispatchForm.destination} with Vehicle ${dispatchForm.vehicle_plate} driven by ${driverName}. Odometer: ${dispatchForm.start_odometer} km.`;
    
    try {
      await logActivity('TRIP_DISPATCHED', details);
      setIsDispatchOpen(false);
      alert('Trip dispatched successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  // Format activity details nicely
  const getActivityMessage = (act: any) => {
    return act.details || `${act.action.replace('_', ' ')} action performed`;
  };

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Upper Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Enterprise Operations Control
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            VRL Logistics India — Regional Dispatch Dashboard
          </p>
        </div>

        {/* Quick actions panel */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setIsDispatchOpen(true)}
            className="btn btn-primary text-xs flex items-center gap-1.5"
          >
            <Plus size={14} /> New Dispatch
          </button>
          <button
            onClick={() => alert('Exporting monthly invoice logs...')}
            className="btn btn-outline text-xs flex items-center gap-1.5"
          >
            <FileText size={14} /> Export Logs
          </button>
        </div>
      </div>

      {/* Weather & System Status Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 select-none">
        <div
          className="bg-brand-card border border-brand-border rounded-card p-4 flex items-center gap-3.5"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
        >
          <div className="p-2.5 bg-accent-blue/10 rounded-lg text-accent-blue">
            <CloudRain size={20} className="animate-bounce" />
          </div>
          <div>
            <span className="text-[10px] text-text-muted font-semibold block">
              MUMBAI TERMINAL WEATHER
            </span>
            <span className="text-xs font-semibold text-white">31°C • Monsoon Rains</span>
          </div>
        </div>
        <div
          className="bg-brand-card border border-brand-border rounded-card p-4 flex items-center gap-3.5"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
        >
          <div className="p-2.5 bg-accent-amber/10 rounded-lg text-accent-amber">
            <CloudSun size={20} />
          </div>
          <div>
            <span className="text-[10px] text-text-muted block font-semibold">
              DELHI TRANSIT HUB
            </span>
            <span className="text-xs font-semibold text-white">38°C • Overcast haze</span>
          </div>
        </div>
        <div
          className="bg-brand-card border border-brand-border rounded-card p-4 flex items-center gap-3.5 md:col-span-2"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
        >
          <div className="p-2.5 bg-accent-green/10 rounded-lg text-accent-green">
            <CheckCircle size={20} />
          </div>
          <div>
            <span className="text-[10px] text-text-muted block font-semibold">
              SYSTEM WORKLOAD METRICS
            </span>
            <span className="text-xs font-semibold text-white">
              All gateways fully functional. 0 sync latencies.
            </span>
          </div>
        </div>
      </div>

      {/* Main KPI Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Active Vehicles"
          value={isLoading ? '...' : `${stats?.active_vehicles || 0} / ${stats?.total_vehicles || 0}`}
          change={`${stats?.total_vehicles || 0} registered fleet`}
          changeType="positive"
          icon={Truck}
          iconColor="text-accent-blue"
          sparklineData={[38, 39, 40, 38, 41, 42, 42]}
        />
        <StatCard
          title="Trips Tracked"
          value={isLoading ? '...' : String(stats?.total_trips || 0)}
          change={`${stats?.active_trips || 0} actively driving`}
          changeType="neutral"
          icon={Compass}
          iconColor="text-accent-purple"
          sparklineData={[15, 18, 16, 20, 19, 17, 18]}
        />
        <StatCard
          title="Total Users"
          value={isLoading ? '...' : String(stats?.total_users || 0)}
          change={`${stats?.total_roles || 0} configured roles`}
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-accent-green"
          sparklineData={[80, 81, 83, 82, 83.5, 84, 84.2]}
        />
        <StatCard
          title="Upcoming Service"
          value={isLoading ? '...' : String(stats?.upcoming_maintenance || 0)}
          change="Brakes & Oil inspect"
          changeType="negative"
          icon={AlertTriangle}
          iconColor="text-accent-red"
          sparklineData={[5, 4, 3, 4, 2, 3, 3]}
        />
        <StatCard
          title="Driver availability"
          value={isLoading ? '...' : `${stats?.available_drivers || 0} / ${stats?.total_drivers || 0}`}
          change={`${stats?.drivers_on_leave || 0} on rest cycle`}
          changeType="neutral"
          icon={UserCheck}
          iconColor="text-accent-amber"
          sparklineData={[35, 36, 35, 37, 36, 38, 38]}
        />
      </div>

      {/* SVG Dispatch Map Corridor Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Animated India routes */}
        <div
          className="lg:col-span-2 bg-brand-card border border-brand-border rounded-card p-6 flex flex-col justify-between min-h-[380px]"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
        >
          <div
            className="flex items-center justify-between border-b border-brand-divider pb-4 mb-4 select-none"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <div>
              <h4 className="text-sm font-semibold text-white">Corridor Dispatch Status</h4>
              <p className="text-xs text-text-secondary mt-0.5">
                Real-time connecting routes between primary Indian hub terminals
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-accent-green bg-accent-green/10 px-2.5 py-0.5 rounded-badge font-medium">
              <span className="w-1.5 h-1.5 bg-accent-green rounded-full animate-ping"></span> Live
              Corridors Active
            </span>
          </div>

          {/* SVG Map */}
          <div
            className="flex-grow bg-[#090a0f] border border-brand-border rounded-lg relative overflow-hidden flex items-center justify-center min-h-[240px]"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            {/* Grid Dots */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

            {/* Connecting Paths */}
            <svg
              className="absolute inset-0 w-full h-full text-brand-border"
              viewBox="0 0 500 240"
              fill="none"
            >
              <path
                d="M250,30 L180,130"
                stroke="#3B82F6"
                strokeWidth="2"
                className="route-animate"
              />
              <path
                d="M180,130 L210,190"
                stroke="#10B981"
                strokeWidth="2"
                className="route-animate"
              />
              <path
                d="M210,190 L320,90"
                stroke="#8B5CF6"
                strokeWidth="2"
                className="route-animate"
              />
              <path
                d="M320,90 L250,30"
                stroke="#F59E0B"
                strokeWidth="2"
                className="route-animate"
              />
            </svg>

            {/* Nodes overlay */}
            <div className="absolute top-[20px] left-[250px] flex flex-col items-center">
              <MapPin className="text-accent-amber animate-bounce" size={16} />
              <span
                className="text-[9px] text-text-secondary mt-0.5 bg-brand-panel px-1 py-0.5 rounded border border-brand-border"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                Delhi Hub
              </span>
            </div>
            <div className="absolute top-[120px] left-[170px] flex flex-col items-center">
              <MapPin className="text-accent-blue animate-bounce" size={16} />
              <span
                className="text-[9px] text-text-secondary mt-0.5 bg-brand-panel px-1 py-0.5 rounded border border-brand-border"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                Mumbai Depot
              </span>
            </div>
            <div className="absolute top-[180px] left-[200px] flex flex-col items-center">
              <MapPin className="text-accent-green animate-bounce" size={16} />
              <span
                className="text-[9px] text-text-secondary mt-0.5 bg-brand-panel px-1 py-0.5 rounded border border-brand-border"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                Bengaluru Terminal
              </span>
            </div>
            <div className="absolute top-[80px] left-[320px] flex flex-col items-center">
              <MapPin className="text-accent-purple animate-bounce" size={16} />
              <span
                className="text-[9px] text-text-secondary mt-0.5 bg-brand-panel px-1 py-0.5 rounded border border-brand-border"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                Kolkata Hub
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activities feed widget */}
        <div
          className="bg-brand-card border border-brand-border rounded-card p-6 flex flex-col justify-between"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
        >
          <div className="select-none overflow-hidden">
            <h4 className="text-sm font-semibold text-white mb-4">Operations Timeline</h4>
            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
              {isLoading ? (
                <div className="text-xs text-text-muted py-8 text-center">Loading timeline...</div>
              ) : !stats?.recent_activities || stats.recent_activities.length === 0 ? (
                <div className="text-xs text-text-muted py-8 text-center">No recent activities recorded.</div>
              ) : (
                stats.recent_activities.map((act: any) => (
                  <div
                    key={act.id}
                    className="p-3 bg-brand-panel border border-brand-border rounded-lg flex items-start gap-3"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-subtle)',
                    }}
                  >
                    <div className="p-1.5 rounded-full mt-0.5 bg-accent-purple/10 text-accent-purple">
                      <Activity size={12} />
                    </div>
                    <div>
                      <h5 className="text-[11px] font-semibold text-white capitalize">
                        {act.action.replace('_', ' ').toLowerCase()}
                      </h5>
                      <p className="text-[10px] text-text-secondary mt-0.5">
                        {getActivityMessage(act)}
                      </p>
                      <span className="text-[9px] text-text-muted mt-1 block">
                        {getTimeAgo(act.created_at)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics & Expenses detailed graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Recharts Area Chart: Operations Revenue */}
        <ChartCard
          title="Revenue Operations"
          subtitle="Gross shipping transactions vs expenses (INR)"
        >
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={financialData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6B7280" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6B7280" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#20222B" />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={11} />
              <YAxis
                stroke="#6B7280"
                fontSize={11}
                tickFormatter={(tick) => `₹${tick / 100000}L`}
              />
              <Tooltip contentStyle={{ backgroundColor: '#16171E', borderColor: '#20222B' }} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#8B5CF6"
                fillOpacity={1}
                fill="url(#colorRevenue)"
                name="Gross revenue"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#6B7280"
                fillOpacity={1}
                fill="url(#colorExpenses)"
                name="Operating costs"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Recharts Line Chart: Liters Consumed */}
        <ChartCard
          title="Fuel Consumption Density"
          subtitle="Volumetric liters fuel summary (7-Day)"
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={fuelConsumptionData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#20222B" />
              <XAxis dataKey="day" stroke="#6B7280" fontSize={11} />
              <YAxis stroke="#6B7280" fontSize={11} tickFormatter={(tick) => `${tick}L`} />
              <Tooltip contentStyle={{ backgroundColor: '#16171E', borderColor: '#20222B' }} />
              <Bar dataKey="liters" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Liters Refueled" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Upcoming Maintenance checklist */}
        <div
          className="bg-brand-card border border-brand-border rounded-card p-6 flex flex-col justify-between"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
        >
          <div className="select-none">
            <h4 className="text-sm font-semibold text-white mb-4">Upcoming Service calendar</h4>
            <div className="space-y-4">
              {upcomingServices.map((ser) => (
                <div
                  key={ser.id}
                  className="p-3 bg-brand-panel border border-brand-border rounded-lg flex items-center justify-between"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-subtle)',
                  }}
                >
                  <div>
                    <h5 className="text-[11px] font-semibold text-white">{ser.type}</h5>
                    <p className="text-[10px] text-text-secondary mt-0.5">
                      Vehicle: {ser.vehicle} | Date: {ser.date}
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-accent-green">{ser.cost}</span>
                </div>
              ))}
            </div>
          </div>
          <button className="w-full text-center mt-6 text-xs text-accent-purple hover:underline flex items-center justify-center gap-1 select-none">
            Schedule Maintenance Service <ChevronRight size={14} />
          </button>
        </div>
      </div>
      {/* NEW DISPATCH MODAL */}
      <Modal
        isOpen={isDispatchOpen}
        onClose={() => setIsDispatchOpen(false)}
        title="New Fleet Dispatch"
        description="Assign a driver and vehicle to start a new transport corridor route"
      >
        <form onSubmit={handleDispatchSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label text-xs">Origin Station</label>
              <input
                type="text"
                name="origin"
                value={dispatchForm.origin}
                onChange={handleDispatchInputChange}
                required
                className="input-field text-xs"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs">Destination Hub</label>
              <input
                type="text"
                name="destination"
                value={dispatchForm.destination}
                onChange={handleDispatchInputChange}
                required
                className="input-field text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label text-xs">Available Driver</label>
              <select
                name="driver_id"
                value={dispatchForm.driver_id}
                onChange={handleDispatchInputChange}
                required
                className="input-field text-xs bg-brand-panel text-white"
              >
                {availableDrivers.length === 0 ? (
                  <option value="" disabled>No drivers available</option>
                ) : (
                  availableDrivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.first_name} {d.last_name} ({d.employee_id})
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label text-xs">Vehicle Plate Number</label>
              <input
                type="text"
                name="vehicle_plate"
                value={dispatchForm.vehicle_plate}
                onChange={handleDispatchInputChange}
                required
                className="input-field text-xs"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label text-xs">Starting Odometer (km)</label>
            <input
              type="number"
              name="start_odometer"
              value={dispatchForm.start_odometer}
              onChange={handleDispatchInputChange}
              required
              className="input-field text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-brand-divider">
            <button
              type="button"
              onClick={() => setIsDispatchOpen(false)}
              className="btn btn-outline text-xs"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary text-xs">
              Confirm Dispatch
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
