'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Utensils,
  ArrowLeft,
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/context/toastcontext';

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [portalDestination, setPortalDestination] = useState('/admin');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const showForgotPasswordAlert = () => {
    showToast('Password resets must be issued by a system administrator.');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      showToast('Authentication Successful! Redirecting...');
      // Set session cookie for staff authentication
      document.cookie = `tc_staff=demo_token; path=/; max-age=${
        rememberMe ? 86400 * 30 : 86400
      }`;
      setTimeout(() => {
        router.push(portalDestination);
      }, 800);
    }, 1000);
  };

  return (
    <div className="bg-brand-dark text-gray-100 font-sans antialiased min-h-screen flex flex-col justify-between relative overflow-x-hidden selection:bg-brand-500 selection:text-white">
      {/* Ambient Glowing Background Orbs */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-137.5 h-137.5 bg-brand-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="fixed bottom-10 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* HEADER / BRAND BAR */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-brand-600 to-amber-400 flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform">
            <Utensils className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-white leading-tight">
              Taste<span className="text-brand-500">Craft</span>
            </span>
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
              Restaurant Portal
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white bg-gray-900/80 border border-brand-border px-3.5 py-2 rounded-xl hover:border-brand-500/40 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-brand-500" />
          <span>Back to Public Store</span>
        </Link>
      </header>

      {/* MAIN LOGIN CARD AREA */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="w-full max-w-md glass-card rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative border border-brand-border">
          {/* Header Section */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-brand-500/20 to-amber-500/20 text-brand-500 border border-brand-500/30 flex items-center justify-center mx-auto shadow-glow">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Sign In to TasteCraft</h1>
            <p className="text-xs text-gray-400">
              Access Admin Dashboard, Kitchen Ops, or Floor Management.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  id="emailInput"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tastecraft.com"
                  className="w-full bg-gray-900 border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-300">Password</label>
                <button
                  type="button"
                  onClick={showForgotPasswordAlert}
                  className="text-[11px] text-brand-500 hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="passwordInput"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-900 border border-brand-border rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Destination Selector */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Redirect Portal
              </label>
              <select
                id="portalDestination"
                value={portalDestination}
                onChange={(e) => setPortalDestination(e.target.value)}
                className="w-full bg-gray-900 border border-brand-border rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500 transition cursor-pointer"
              >
                <option value="/admin">Admin Dashboard & Store Settings</option>
                <option value="/order">Kitchen & Floor Operations (Chef/Waiter)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-gray-900 border-brand-border text-brand-500 focus:ring-0 cursor-pointer"
              />
              <label
                htmlFor="rememberMe"
                className="text-xs text-gray-400 select-none cursor-pointer"
              >
                Remember my session
              </label>
            </div>

            <button
              type="submit"
              id="submitBtn"
              disabled={loading}
              className="w-full bg-linear-to-r from-brand-500 to-amber-500 hover:from-brand-600 hover:to-amber-600 text-white font-bold py-3 rounded-xl shadow-glow transition duration-200 text-xs flex items-center justify-center gap-2 active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Admin Notice Banner (No Registration Allowed) */}
          <div className="pt-4 border-t border-brand-border/60 text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Restricted Portal Access</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed max-w-xs mx-auto">
              Account registration is disabled. Staff user credentials (Admins, Chefs, Waiters) are
              provisioned directly by the store administrator.
            </p>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-4 text-center text-[11px] text-gray-500 relative z-10 border-t border-brand-border/40">
        <p>&copy; 2026 TasteCraft System. All rights reserved.</p>
      </footer>
    </div>
  );
}
