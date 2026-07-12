'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import {
  Zap,
  TrendingUp,
  Shield,
  Clock,
  Compass,
  ArrowRight,
  Activity,
  Layers,
  Map,
  Users,
  AlertTriangle,
  ChevronRight,
  Database
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  // If loading or authenticated (which redirects), show a minimal black screen
  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#090A0F] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F1F3F9] font-sans selection:bg-accent-purple selection:text-white overflow-y-auto">
      
      {/* ─── Navigation Header ────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#090A0F]/80 backdrop-blur-md border-b border-[#1A1E2C] transition-all">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent-purple/20 border border-accent-purple/30 flex items-center justify-center">
              <Zap size={18} className="text-accent-purple animate-pulse" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">TransitOps</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#preview" className="hover:text-white transition-colors">Dashboard Preview</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-text-secondary hover:text-white transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link href="/login" className="btn btn-primary btn-sm flex items-center gap-1.5 px-4 py-2">
              Get Started <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Hero Section ────────────────────────────────────────────────── */}
      <section className="relative pt-[180px] pb-[100px] overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-[10%] left-[50%] -translate-x-[50%] w-[600px] h-[300px] bg-accent-purple/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-[5%] left-[20%] w-[350px] h-[350px] bg-accent-blue/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-accent-purple/10 border border-accent-purple/20 rounded-full">
            <span className="w-1.5 h-1.5 bg-accent-purple rounded-full animate-ping" />
            <span className="text-[11px] font-semibold text-accent-purple-soft uppercase tracking-widest">
              Next-Gen Fleet Management & Analytics
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Transform Fleet Operations into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-purple via-accent-purple-soft to-accent-blue-soft">
              Real-Time Intelligence
            </span>
          </h1>

          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto font-normal leading-relaxed">
            TransitOps coordinates dispatch, drivers, preventative maintenance, expenses, and enterprise intelligence in one high-performance command centre.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/login" className="btn btn-primary btn-lg px-8 py-3.5 text-sm font-semibold flex items-center gap-2 group shadow-lg shadow-accent-purple/15">
              Get Started Free <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#preview" className="btn btn-secondary btn-lg px-8 py-3.5 text-sm font-semibold hover:bg-brand-elevated/40">
              View Live Demo
            </a>
          </div>
        </div>
      </section>

      {/* ─── Dashboard Preview Mockup ────────────────────────────────────── */}
      <section id="preview" className="py-[60px] relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative rounded-2xl border border-brand-border bg-brand-card p-4 md:p-6 shadow-2xl shadow-black/80 overflow-hidden group">
            {/* Glossy overlay reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none" />
            
            {/* Header / OS window controls */}
            <div className="flex items-center justify-between border-b border-brand-border pb-4 mb-5">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-accent-red-soft/20 border border-accent-red-soft/30" />
                <span className="w-3 h-3 rounded-full bg-accent-amber-soft/20 border border-accent-amber-soft/30" />
                <span className="w-3 h-3 rounded-full bg-accent-green-soft/20 border border-accent-green-soft/30" />
              </div>
              <div className="px-4 py-1 rounded bg-[#090A0F] border border-brand-border text-[11px] font-mono text-text-muted">
                app.transitops.com/dashboard
              </div>
              <div className="w-12 h-2" />
            </div>

            {/* Dashboard Mockup Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 opacity-90">
              {/* Sidebar simulation */}
              <div className="hidden md:flex flex-col gap-3 pr-4 border-r border-brand-border/60">
                <div className="h-8 bg-brand-elevated/40 rounded border border-brand-border/30 flex items-center px-3 gap-2">
                  <Activity size={13} className="text-accent-purple" />
                  <div className="h-2 w-16 bg-text-disabled rounded" />
                </div>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-7 bg-brand-elevated/20 rounded flex items-center px-3 gap-2">
                    <div className="h-1.5 w-1.5 bg-text-muted rounded-full" />
                    <div className="h-1.5 w-20 bg-text-disabled/60 rounded" />
                  </div>
                ))}
              </div>

              {/* Main Content simulation */}
              <div className="md:col-span-3 space-y-4">
                {/* 3 Metric Cards */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Active Fleet Today', value: '42 / 45', color: 'text-accent-purple-soft' },
                    { label: 'Fuel Cost (MTD)', value: '₹1,48,500', color: 'text-accent-green-soft' },
                    { label: 'Critical Alerts', value: '02 Pending', color: 'text-accent-red-soft' }
                  ].map((metric, i) => (
                    <div key={i} className="p-4 bg-brand-elevated/30 rounded-xl border border-brand-border/40">
                      <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider">{metric.label}</div>
                      <div className={`text-base md:text-xl font-bold mt-1 ${metric.color}`}>{metric.value}</div>
                    </div>
                  ))}
                </div>

                {/* Big Chart Simulation */}
                <div className="p-4 bg-brand-elevated/20 rounded-xl border border-brand-border/40 h-48 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="h-2 w-28 bg-text-muted rounded" />
                    <div className="h-4 w-12 bg-brand-elevated rounded border border-brand-border/40" />
                  </div>
                  {/* Fake bars/graph */}
                  <div className="flex items-end justify-between h-28 pt-4">
                    {[35, 60, 45, 90, 75, 40, 85, 55, 70, 95, 65, 80].map((h, i) => (
                      <div key={i} className="w-[6%] bg-gradient-to-t from-accent-purple/20 to-accent-purple rounded-t" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── About TransitOps Section ────────────────────────────────────── */}
      <section id="about" className="py-[100px] border-t border-[#1A1E2C] relative">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              An Enterprise Platform Built for Complex Transport Ecosystems
            </h2>
            <p className="text-text-secondary text-base leading-relaxed">
              TransitOps was designed to replace fragmented tools, spreadsheets, and legacy systems with a single operating framework. From planning delivery routes to analyzing vehicle lifecycle costs and ensuring compliance, TransitOps handles the complexities of heavy logistics seamlessly.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 shrink-0 bg-accent-purple/10 border border-accent-purple/20 rounded-xl flex items-center justify-center">
                  <Shield size={18} className="text-accent-purple" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Full Compliance</h4>
                  <p className="text-xs text-text-muted mt-1">Automatic checking of driver licenses and vehicle PUC certificates.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 shrink-0 bg-accent-blue/10 border border-accent-blue/20 rounded-xl flex items-center justify-center">
                  <Compass size={18} className="text-accent-blue-soft" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Smart Dispatch</h4>
                  <p className="text-xs text-text-muted mt-1">Preventing conflicts by checking vehicle availability before assignment.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-accent-purple/10 to-accent-blue/10 rounded-2xl blur-xl" />
            <div className="relative bg-brand-card border border-brand-border rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock size={16} className="text-accent-purple" /> Active Fleet Statistics
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Available Vehicles', percent: 84 },
                  { label: 'Operational Dispatch Rate', percent: 92 },
                  { label: 'Scheduled Maintenance Compliance', percent: 98 }
                ].map((stat, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-text-secondary">{stat.label}</span>
                      <span className="text-white">{stat.percent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#090A0F] rounded-full overflow-hidden">
                      <div className="h-full bg-accent-purple rounded-full" style={{ width: `${stat.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Grid Section ───────────────────────────────────────── */}
      <section id="features" className="py-[100px] border-t border-[#1A1E2C] bg-brand-sidebar/20 relative">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-white tracking-tight">Core Competencies</h2>
            <p className="text-text-secondary text-sm">
              TransitOps offers modules engineered for modern logistics workflows with no compromises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Map,
                title: 'Operational Dispatch',
                desc: 'Schedule trips, assign drivers, and check license/fitness validity instantly before dispatching vehicles.'
              },
              {
                icon: TrendingUp,
                title: 'Fuel Analytics & Integrations',
                desc: 'Log consumption, fuel costs, and odometer intervals. Get real-time mileage stats and automatically update vehicle metrics.'
              },
              {
                icon: AlertTriangle,
                title: 'Maintenance Cascade',
                desc: 'Track scheduled, preventive, and emergency repairs. Block unavailable vehicles and log technicians automatically.'
              },
              {
                icon: Layers,
                title: 'Expense Management',
                desc: 'Categorize tolls, tyres, maintenance, salary, and miscellaneous costs. Connects directly to operations for invoice uploads.'
              },
              {
                icon: Database,
                title: 'Operational Reports',
                desc: 'Generate fleet, driver performance, availability, and financial reports based on real-time database queries.'
              },
              {
                icon: Users,
                title: 'Robust RBAC Security',
                desc: 'Control workspace permissions dynamically. Enable administrators, operators, and maintenance teams safely.'
              }
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl border border-brand-border bg-brand-card hover:bg-brand-elevated/30 transition-all duration-300 group">
                <div className="w-10 h-10 bg-brand-elevated rounded-xl flex items-center justify-center border border-brand-border/60 group-hover:border-accent-purple/40 group-hover:bg-accent-purple/5 transition-all">
                  <feature.icon size={18} className="text-text-secondary group-hover:text-accent-purple-soft transition-colors" />
                </div>
                <h3 className="text-base font-bold text-white mt-4">{feature.title}</h3>
                <p className="text-xs text-text-muted mt-2 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer Section ──────────────────────────────────────────────── */}
      <footer className="border-t border-[#1A1E2C] py-12 bg-[#090A0F] relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-purple/20 border border-accent-purple/30 flex items-center justify-center">
              <Zap size={15} className="text-accent-purple" />
            </div>
            <span className="text-white font-bold text-base tracking-tight">TransitOps</span>
          </div>

          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} TransitOps Technologies. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-xs text-text-secondary">
            <a href="#about" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#features" className="hover:text-white transition-colors">Terms of Service</a>
            <Link href="/login" className="hover:text-white transition-colors">Workspace Login</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
