'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Shield, Zap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('admin@transitops.com');
  const [password, setPassword] = useState('Password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login({ email, password });
      router.replace('/dashboard');
    } catch {
      // error is handled in the store
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#090A0F]">
      {/* ── Left Panel: Branding ────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-16 overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#090A0F] via-[#0D0F1A] to-[#090A0F]" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent-purple/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent-blue/8 rounded-full blur-[100px]" />

        {/* Grid lines decoration */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent-purple/20 border border-accent-purple/30 flex items-center justify-center">
              <Zap size={18} className="text-accent-purple" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">TransitOps</span>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 space-y-8 max-w-[500px]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-purple/10 border border-accent-purple/20 rounded-full">
              <div className="w-1.5 h-1.5 bg-accent-purple rounded-full animate-pulse" />
              <span className="text-[11px] font-semibold text-accent-purple tracking-wider uppercase">
                Enterprise Fleet ERP
              </span>
            </div>

            <h1 className="text-5xl font-bold text-white leading-[1.15] tracking-tight">
              Orchestrate your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-accent-blue">
                entire fleet
              </span>{' '}
              from one platform.
            </h1>

            <p className="text-text-secondary text-base leading-relaxed">
              Real-time dispatch, driver management, fuel analytics, maintenance planning — purpose-built for Indian commercial transport operations.
            </p>
          </div>

          {/* Feature bullets */}
          <div className="grid grid-cols-2 gap-3">
            {[
              'Live Dispatch Tracking',
              'Driver Management',
              'RBAC & Permissions',
              'Fuel Analytics',
              'Maintenance Alerts',
              'Financial Reports',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <div className="w-1 h-1 bg-accent-purple rounded-full shrink-0" />
                <span className="text-xs text-text-secondary">{feature}</span>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-4 pt-4 border-t border-white/5">
            <div className="flex -space-x-2">
              {['RK', 'GS', 'AP', 'SY'].map((initials) => (
                <div
                  key={initials}
                  className="w-8 h-8 rounded-full border-2 border-[#090A0F] bg-brand-card flex items-center justify-center text-[10px] font-bold text-text-secondary"
                >
                  {initials}
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs text-white font-medium">250+ fleet managers</p>
              <p className="text-[11px] text-text-muted">across 12 Indian states</p>
            </div>
          </div>
        </div>

        {/* Bottom trust indicator */}
        <div className="relative z-10 flex items-center gap-2 text-[11px] text-text-muted">
          <Shield size={13} />
          <span>SOC2 Ready · AES-256 Encryption · JWT Auth · Role-Based Access</span>
        </div>
      </div>

      {/* ── Right Panel: Login Form ──────────────────────────────────────────── */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-[400px] space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <Zap size={20} className="text-accent-purple" />
            <span className="text-white font-bold">TransitOps</span>
          </div>

          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Welcome back</h2>
            <p className="text-sm text-text-secondary mt-1">
              Sign in to your operations workspace.
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
              <Shield size={14} className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-group">
              <label className="form-label text-xs font-medium">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field text-sm"
                placeholder="you@company.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <div className="flex items-center justify-between mb-1.5">
                <label className="form-label text-xs font-medium mb-0">Password</label>
                <button
                  type="button"
                  className="text-[11px] text-accent-purple hover:underline"
                  onClick={() => alert('Contact your system administrator to reset your password.')}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field text-sm pr-10"
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-brand-border accent-accent-purple cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-xs text-text-secondary cursor-pointer">
                Remember me for 7 days
              </label>
            </div>

            <button
              type="submit"
              id="login-btn"
              disabled={isLoading}
              className="btn btn-primary w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold relative overflow-hidden group"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                'Sign In to TransitOps'
              )}
            </button>
          </form>

          {/* Default credentials hint (dev only) */}
          <div className="p-3 bg-accent-purple/5 border border-accent-purple/15 rounded-lg">
            <p className="text-[11px] text-text-muted text-center">
              <span className="font-medium text-text-secondary">Dev credentials: </span>
              admin@transitops.com · Password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
