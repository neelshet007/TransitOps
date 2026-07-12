'use client';

import React from 'react';
import {
  Truck,
  Compass,
  TrendingUp,
  AlertTriangle,
  UserCheck,
  ChevronRight,
  MapPin,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import StatCard from '../../components/StatCard';
import ChartCard from '../../components/ChartCard';

// Dummy static chart values (realistic operational scales)
const revenueData = [
  { month: 'Jan', revenue: 450000, cost: 310000 },
  { month: 'Feb', revenue: 520000, cost: 340000 },
  { month: 'Mar', revenue: 610000, cost: 380000 },
  { month: 'Apr', revenue: 580000, cost: 360000 },
  { month: 'May', revenue: 670000, cost: 410000 },
  { month: 'Jun', revenue: 750000, cost: 450000 },
];

const fuelConsumptionData = [
  { day: 'Mon', liters: 1520 },
  { day: 'Tue', liters: 1680 },
  { day: 'Wed', liters: 1810 },
  { day: 'Thu', liters: 1660 },
  { day: 'Fri', liters: 1920 },
  { day: 'Sat', liters: 1210 },
  { day: 'Sun', liters: 940 },
];

const healthData = [
  { name: 'Active Fleet', value: 42, color: '#10B981' },
  { name: 'In Repair', value: 3, color: '#EF4444' },
  { name: 'Scheduled Maintenance', value: 5, color: '#F59E0B' },
];

const activeTripsList = [
  {
    route: 'Delhi, DL -> Mumbai, MH',
    driver: 'Rajesh K.',
    vehicle: 'MH-12-Q-1000',
    status: 'On Time',
  },
  {
    route: 'Mumbai, MH -> Bengaluru, KA',
    driver: 'Amit P.',
    vehicle: 'KA-03-Q-1034',
    status: 'On Time',
  },
  {
    route: 'Kolkata, WB -> Delhi, DL',
    driver: 'Gurpreet S.',
    vehicle: 'DL-01-Q-1017',
    status: 'Delayed',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Fleet Operations Dashboard
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            VRL Logistics India — Executive Operations Control Console
          </p>
        </div>
        <div className="text-xs text-text-secondary text-right select-none">
          Data status: <span className="font-semibold text-accent-green">Online (Kolkata)</span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Active Vehicles"
          value="42 / 50"
          change="+3 this week"
          changeType="positive"
          icon={Truck}
          iconColor="text-accent-blue"
          sparklineData={[38, 39, 40, 38, 41, 42, 42]}
        />
        <StatCard
          title="Trips Scheduled"
          value="18"
          change="8 in transit"
          changeType="neutral"
          icon={Compass}
          iconColor="text-accent-purple"
          sparklineData={[15, 18, 16, 20, 19, 17, 18]}
        />
        <StatCard
          title="Fleet Utilization"
          value="84.2%"
          change="+2.4% vs last mo"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-accent-green"
          sparklineData={[80, 81, 83, 82, 83.5, 84, 84.2]}
        />
        <StatCard
          title="Service Overdue"
          value="3"
          change="Urgent attention required"
          changeType="negative"
          icon={AlertTriangle}
          iconColor="text-accent-red"
          sparklineData={[5, 4, 3, 4, 2, 3, 3]}
        />
        <StatCard
          title="Drivers Active"
          value="38 / 50"
          change="4 on rest cycle"
          changeType="neutral"
          icon={UserCheck}
          iconColor="text-accent-amber"
          sparklineData={[35, 36, 35, 37, 36, 38, 38]}
        />
      </div>

      {/* Maps & Operational Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mock Operations Map placeholder */}
        <div className="lg:col-span-2 bg-brand-card border border-brand-border rounded-card p-6 flex flex-col justify-between min-h-[380px]">
          <div className="flex items-center justify-between border-b border-brand-divider pb-4 mb-4">
            <div>
              <h4 className="text-sm font-semibold text-white">Interactive Dispatch Map</h4>
              <p className="text-xs text-text-secondary mt-0.5">
                Real-time status of scheduled routes
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-accent-green bg-accent-green/10 px-2 py-0.5 rounded-badge font-medium">
              <span className="w-1.5 h-1.5 bg-accent-green rounded-full animate-ping"></span> Live
              Tracking Active
            </span>
          </div>

          {/* Visual Map graphic representation */}
          <div className="flex-grow bg-[#13161c] border border-brand-border rounded-lg relative overflow-hidden flex items-center justify-center min-h-[240px]">
            {/* Grid dot pattern background representing a minimalist map */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

            {/* Custom SVG Connecting paths representing India's Golden Quadrilateral corridors */}
            <svg
              className="absolute inset-0 w-full h-full text-brand-border"
              viewBox="0 0 500 240"
              fill="none"
            >
              {/* Delhi to Mumbai route line */}
              <path
                d="M250,40 L180,140"
                stroke="#3B82F6"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="animate-[dash_10s_linear_infinite]"
              />
              {/* Mumbai to Bengaluru route line */}
              <path
                d="M180,140 L210,200"
                stroke="#10B981"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="animate-[dash_8s_linear_infinite]"
              />
              {/* Bengaluru to Kolkata route line */}
              <path
                d="M210,200 L320,100"
                stroke="#8B5CF6"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="animate-[dash_12s_linear_infinite]"
              />
              {/* Kolkata to Delhi route line */}
              <path
                d="M320,100 L250,40"
                stroke="#F59E0B"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="animate-[dash_15s_linear_infinite]"
              />
            </svg>

            {/* Nodes */}
            <div className="absolute top-[30px] left-[250px] flex flex-col items-center select-none">
              <MapPin className="text-accent-amber" size={16} />
              <span className="text-[9px] text-text-secondary mt-0.5 bg-brand-panel px-1 py-0.5 rounded border border-brand-border">
                Delhi
              </span>
            </div>
            <div className="absolute top-[130px] left-[170px] flex flex-col items-center select-none">
              <MapPin className="text-accent-blue" size={16} />
              <span className="text-[9px] text-text-secondary mt-0.5 bg-brand-panel px-1 py-0.5 rounded border border-brand-border">
                Mumbai
              </span>
            </div>
            <div className="absolute top-[190px] left-[200px] flex flex-col items-center select-none">
              <MapPin className="text-accent-green" size={16} />
              <span className="text-[9px] text-text-secondary mt-0.5 bg-brand-panel px-1 py-0.5 rounded border border-brand-border">
                Bengaluru
              </span>
            </div>
            <div className="absolute top-[90px] left-[320px] flex flex-col items-center select-none">
              <MapPin className="text-accent-purple" size={16} />
              <span className="text-[9px] text-text-secondary mt-0.5 bg-brand-panel px-1 py-0.5 rounded border border-brand-border">
                Kolkata
              </span>
            </div>

            <div className="absolute bottom-4 left-4 z-10 select-none">
              <span className="text-[10px] text-text-muted font-mono block">
                {' '}
                Golden Quadrilateral Corridors Active
              </span>
            </div>
          </div>
        </div>

        {/* Active Trips Dispatch list */}
        <div className="bg-brand-card border border-brand-border rounded-card p-6 flex flex-col">
          <h4 className="text-sm font-semibold text-white mb-4">Active Route Dispatch</h4>
          <div className="space-y-4 flex-grow">
            {activeTripsList.map((trip, idx) => (
              <div
                key={idx}
                className="p-3 bg-brand-panel border border-brand-border rounded-lg flex items-center justify-between"
              >
                <div>
                  <h5 className="text-xs font-semibold text-white">{trip.route}</h5>
                  <p className="text-[10px] text-text-secondary mt-0.5">
                    Driver: {trip.driver} | Truck: {trip.vehicle}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-badge ${
                    trip.status === 'On Time'
                      ? 'bg-accent-green/10 text-accent-green'
                      : 'bg-accent-amber/10 text-accent-amber'
                  }`}
                >
                  {trip.status}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full text-center mt-6 text-xs text-accent-purple hover:underline flex items-center justify-center gap-1">
            Open Dispatch Panel <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Analytics Trend Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Bar chart: Revenue vs Operating Costs */}
        <ChartCard title="Revenue & Operating Costs" subtitle="Monthly financial breakdown (INR)">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262A34" />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={11} />
              <YAxis stroke="#6B7280" fontSize={11} tickFormatter={(tick) => `₹${tick / 1000}k`} />
              <Tooltip contentStyle={{ backgroundColor: '#1C2028', borderColor: '#262A34' }} />
              <Bar dataKey="revenue" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Gross Revenue" />
              <Bar dataKey="cost" fill="#6B7280" radius={[4, 4, 0, 0]} name="Operating Cost" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Line Chart: Daily Fuel Consumption */}
        <ChartCard
          title="Fuel Consumption Trend"
          subtitle="Daily liters used across fleet operations"
        >
          <ResponsiveContainer width="100%" height={240}>
            <LineChart
              data={fuelConsumptionData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#262A34" />
              <XAxis dataKey="day" stroke="#6B7280" fontSize={11} />
              <YAxis stroke="#6B7280" fontSize={11} tickFormatter={(tick) => `${tick}L`} />
              <Tooltip contentStyle={{ backgroundColor: '#1C2028', borderColor: '#262A34' }} />
              <Line
                type="monotone"
                dataKey="liters"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Liters Consumed"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Pie Chart: Fleet Status distribution */}
        <ChartCard title="Fleet Status Breakdown" subtitle="Current vehicle distribution">
          <div className="flex flex-col items-center justify-center h-[240px]">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={healthData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {healthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1C2028', borderColor: '#262A34' }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="flex gap-4 text-[10px] text-text-secondary mt-4 select-none">
              {healthData.map((entry, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  ></span>
                  <span>
                    {entry.name}: {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
