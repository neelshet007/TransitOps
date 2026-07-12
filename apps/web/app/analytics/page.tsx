'use client';

import React, { useState } from 'react';
import { Download, TrendingUp, TrendingDown, Clock, PieChart as PieChartIcon } from 'lucide-react';
import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

import StatCard   from '../../components/StatCard';
import ChartCard  from '../../components/ChartCard';
import PageHeader from '../../components/ui/PageHeader';

const CHART_STYLE = {
  tooltip:    { backgroundColor: '#181C28', borderColor: '#212636', borderRadius: 8 },
  grid:       '#1A1E2C',
  axis:       '#525B72',
  axisFontSz: 11,
};

const revenueData = [
  { month: 'Jan', revenue: 4500000, profit: 1400000 },
  { month: 'Feb', revenue: 5200000, profit: 1800000 },
  { month: 'Mar', revenue: 6100000, profit: 2300000 },
  { month: 'Apr', revenue: 5800000, profit: 2200000 },
  { month: 'May', revenue: 6700000, profit: 2600000 },
  { month: 'Jun', revenue: 7500000, profit: 3000000 },
];

const maintenanceCostData = [
  { month: 'Jan', cost: 350000 },
  { month: 'Feb', cost: 420000 },
  { month: 'Mar', cost: 380000 },
  { month: 'Apr', cost: 510000 },
  { month: 'May', cost: 460000 },
  { month: 'Jun', cost: 490000 },
];

const tripStatusData = [
  { name: 'Completed', value: 450, color: '#34D399' },
  { name: 'In Transit', value: 85,  color: '#60A5FA' },
  { name: 'Delayed',    value: 25,  color: '#F87171' },
  { name: 'Cancelled',  value: 12,  color: '#525B72' },
];

const regionalData = [
  { region: 'Mumbai',    trips: 145, efficiency: 92 },
  { region: 'Delhi',     trips: 180, efficiency: 88 },
  { region: 'Bengaluru', trips: 120, efficiency: 95 },
  { region: 'Chennai',   trips: 90,  efficiency: 85 },
];

const TIME_RANGES = ['1m', '3m', '6m', '1y'];

export default function AnalyticsPage() {
  const [range, setRange] = useState('6m');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enterprise Analytics"
        description="Business intelligence and operational efficiency metrics"
        actions={
          <div className="flex items-center gap-2">
            {/* Time range selector */}
            <div className="flex items-center bg-brand-panel border border-brand-border rounded-lg p-0.5">
              {TIME_RANGES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    range === r
                      ? 'bg-brand-elevated text-text-primary border border-brand-border shadow-sm'
                      : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              onClick={() => alert('Exporting analytics…')}
              className="btn btn-secondary btn-sm"
            >
              <Download size={13} /> Export
            </button>
          </div>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Revenue YTD"
          value="₹3.58 Cr"
          change="+18.4% vs last year"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-accent-green-soft"
          iconBg="bg-green-500/10"
          sparklineData={[30, 35, 45, 40, 50, 60, 65]}
        />
        <StatCard
          title="Avg Profit Margin"
          value="34.2%"
          change="+2.1% this quarter"
          changeType="positive"
          icon={PieChartIcon}
          iconColor="text-accent-purple-soft"
          iconBg="bg-purple-500/10"
          sparklineData={[30, 31, 32, 33, 33.5, 34, 34.2]}
        />
        <StatCard
          title="Cost per km"
          value="₹32.4"
          change="−₹1.2 this month"
          changeType="positive"
          icon={TrendingDown}
          iconColor="text-accent-blue-soft"
          iconBg="bg-blue-500/10"
          sparklineData={[35, 34.5, 34, 33.8, 33.5, 32.8, 32.4]}
        />
        <StatCard
          title="Avg Turnaround"
          value="4.2 Hrs"
          change="+15m delay vs target"
          changeType="negative"
          icon={Clock}
          iconColor="text-accent-amber-soft"
          iconBg="bg-amber-500/10"
          sparklineData={[3.8, 3.9, 4.0, 3.9, 4.1, 4.1, 4.2]}
        />
      </div>

      {/* Row 1: Revenue (2/3) + Trip Distribution (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ChartCard title="Revenue & Profit" subtitle="Gross revenue vs net profit (₹ INR)" minHeight={300}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#60A5FA" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#34D399" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_STYLE.grid} vertical={false} />
                <XAxis dataKey="month" stroke={CHART_STYLE.axis} fontSize={CHART_STYLE.axisFontSz} tickLine={false} axisLine={false} />
                <YAxis stroke={CHART_STYLE.axis} fontSize={CHART_STYLE.axisFontSz} tickFormatter={(v) => `₹${v/100000}L`} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={CHART_STYLE.tooltip} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="#60A5FA" strokeWidth={2} fill="url(#gRev)" name="Gross Revenue" />
                <Area type="monotone" dataKey="profit"  stroke="#34D399" strokeWidth={2} fill="url(#gProfit)" name="Net Profit" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="lg:col-span-1">
          <ChartCard title="Trip Distribution" subtitle="YTD breakdown of all routes" minHeight={300}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={tripStatusData} cx="50%" cy="42%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                  {tripStatusData.map((e, i) => (
                    <Cell key={i} fill={e.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip contentStyle={CHART_STYLE.tooltip} itemStyle={{ color: '#F1F3F9' }} />
                <Legend layout="vertical" verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Row 2: Maintenance costs + Regional Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="Maintenance Expenditure" subtitle="Monthly repair and service costs" minHeight={260}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={maintenanceCostData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_STYLE.grid} vertical={false} />
              <XAxis dataKey="month" stroke={CHART_STYLE.axis} fontSize={CHART_STYLE.axisFontSz} tickLine={false} axisLine={false} />
              <YAxis stroke={CHART_STYLE.axis} fontSize={CHART_STYLE.axisFontSz} tickFormatter={(v) => `₹${v/1000}k`} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={CHART_STYLE.tooltip} />
              <Bar dataKey="cost" fill="#A78BFA" radius={[4, 4, 0, 0]} name="Cost (₹)" barSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Regional Hub Performance" subtitle="Trips dispatched vs efficiency score" minHeight={260}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={regionalData} layout="vertical" margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_STYLE.grid} horizontal={false} />
              <XAxis type="number" stroke={CHART_STYLE.axis} fontSize={CHART_STYLE.axisFontSz} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="region" stroke={CHART_STYLE.axis} fontSize={CHART_STYLE.axisFontSz} tickLine={false} axisLine={false} width={70} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={CHART_STYLE.tooltip} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="efficiency" fill="#34D399" radius={[0, 4, 4, 0]} name="Efficiency %" barSize={14} />
              <Bar dataKey="trips"      fill="#60A5FA" radius={[0, 4, 4, 0]} name="Total Trips"  barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
