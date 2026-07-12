'use client';

import React from 'react';
import { BarChart3, LineChart } from 'lucide-react';
import ChartCard from '../../components/ChartCard';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Advanced Analytics</h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Aggregate logs analytics, fleet utilization charts, and fuel efficiency reports
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard title="Carbon Footprint & Emissions" subtitle="CO2 output metrics (Metric Tons)">
          <div className="flex items-center justify-center h-[200px] text-text-muted text-xs select-none">
            <LineChart size={32} className="mr-2" /> Line chart visualization container
          </div>
        </ChartCard>
        <ChartCard title="Fleet Route Density" subtitle="Dispatches per active shipping terminal">
          <div className="flex items-center justify-center h-[200px] text-text-muted text-xs select-none">
            <BarChart3 size={32} className="mr-2" /> Bar chart visualization container
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
