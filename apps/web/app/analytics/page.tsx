'use client';

import React, { useState } from 'react';
import { Download, BarChart2, TrendingUp, TrendingDown, Clock, Map, PieChart as PieChartIcon } from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

import StatCard from '../../components/StatCard';
import ChartCard from '../../components/ChartCard';

// Mock Data
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
  { name: 'Completed', value: 450, color: '#10B981' },
  { name: 'In Transit', value: 85, color: '#3B82F6' },
  { name: 'Delayed', value: 25, color: '#EF4444' },
  { name: 'Cancelled', value: 12, color: '#6B7280' },
];

const regionalPerformanceData = [
  { region: 'Mumbai Hub', trips: 145, efficiency: 92 },
  { region: 'Delhi Hub', trips: 180, efficiency: 88 },
  { region: 'Bengaluru Hub', trips: 120, efficiency: 95 },
  { region: 'Chennai Hub', trips: 90, efficiency: 85 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6m');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Enterprise Analytics</h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Comprehensive business intelligence and operational efficiency metrics
          </p>
        </div>
        
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center bg-brand-panel border border-brand-border rounded-lg p-1 mr-2">
            {['1m', '3m', '6m', '1y'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-[11px] font-medium rounded-md transition-all ${
                  timeRange === range
                    ? 'bg-brand-card text-white shadow-sm border border-brand-border'
                    : 'text-text-secondary hover:text-white'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            onClick={() => alert('Exporting Analytics Dashboard...')}
            className="btn btn-outline text-xs flex items-center gap-2"
          >
            <Download size={14} /> Export Data
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue (YTD)"
          value="₹3.58 Cr"
          change="+18.4% vs last year"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-accent-green"
          sparklineData={[30, 35, 45, 40, 50, 60, 65]}
        />
        <StatCard
          title="Avg Profit Margin"
          value="34.2%"
          change="+2.1% this quarter"
          changeType="positive"
          icon={PieChartIcon}
          iconColor="text-accent-purple"
          sparklineData={[30, 31, 32, 33, 33.5, 34, 34.2]}
        />
        <StatCard
          title="Cost per Km"
          value="₹32.4"
          change="-₹1.2 this month"
          changeType="positive"
          icon={TrendingDown}
          iconColor="text-accent-blue"
          sparklineData={[35, 34.5, 34, 33.8, 33.5, 32.8, 32.4]}
        />
        <StatCard
          title="Avg Turnaround"
          value="4.2 Hrs"
          change="Delayed by 15 mins"
          changeType="negative"
          icon={Clock}
          iconColor="text-accent-amber"
          sparklineData={[3.8, 3.9, 4.0, 3.9, 4.1, 4.1, 4.2]}
        />
      </div>

      {/* Charts Grid Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard
            title="Revenue & Profit Margins"
            subtitle="Gross shipping transactions vs net profit (INR)"
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#20222B" vertical={false} />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#6B7280"
                  fontSize={11}
                  tickFormatter={(tick) => `₹${tick / 100000}L`}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip contentStyle={{ backgroundColor: '#16171E', borderColor: '#20222B', borderRadius: '8px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                  name="Gross Revenue"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorProfit)"
                  name="Net Profit"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        
        <div className="lg:col-span-1">
          <ChartCard
            title="Trip Status Distribution"
            subtitle="YTD breakdown of all dispatched routes"
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tripStatusData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {tripStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#16171E', borderColor: '#20222B', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend 
                  layout="vertical" 
                  verticalAlign="bottom" 
                  align="center"
                  iconType="circle"
                  wrapperStyle={{ fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Charts Grid Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Maintenance Expenditure"
          subtitle="Monthly breakdown of repair and service costs"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={maintenanceCostData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#20222B" vertical={false} />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis 
                stroke="#6B7280" 
                fontSize={11} 
                tickFormatter={(tick) => `₹${tick / 1000}k`} 
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip cursor={{ fill: '#20222B' }} contentStyle={{ backgroundColor: '#16171E', borderColor: '#20222B', borderRadius: '8px' }} />
              <Bar dataKey="cost" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Cost (INR)" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Regional Hub Performance"
          subtitle="Trips dispatched vs Efficiency Score"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={regionalPerformanceData}
              layout="vertical"
              margin={{ top: 10, right: 10, left: 20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#20222B" horizontal={false} />
              <XAxis type="number" stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis 
                type="category" 
                dataKey="region" 
                stroke="#9CA3AF" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                width={90}
              />
              <Tooltip cursor={{ fill: '#20222B' }} contentStyle={{ backgroundColor: '#16171E', borderColor: '#20222B', borderRadius: '8px' }} />
              <Bar dataKey="efficiency" fill="#10B981" radius={[0, 4, 4, 0]} name="Efficiency %" barSize={16} />
              <Bar dataKey="trips" fill="#3B82F6" radius={[0, 4, 4, 0]} name="Total Trips" barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
