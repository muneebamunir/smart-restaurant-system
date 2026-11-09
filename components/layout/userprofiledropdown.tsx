'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronDown,
  LayoutDashboard,
  ChefHat,
  Store,
  User,
  LogOut,
  LogIn,
  ShieldCheck,
} from 'lucide-react';
import { useToast } from '@/context/toastcontext';

export interface UserProfile {
  name: string;
  email: string;
  role?: string;
  sub?: string;
}

interface UserProfileDropdownProps {
  user?: UserProfile;
  variant?: 'root' | 'admin' | 'order';
  align?: 'left' | 'right';
  className?: string;
}

export default function UserProfileDropdown({
  user = {
    name: 'Alexander Chef',
    email: 'alex@tastecraft.com',
    role: 'admin',
  },
  variant = 'root',
  align = 'right',
  className = '',
}: UserProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { showToast } = useToast();

  const isRoot = variant === 'root';

  const initials = (user.name || 'User')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Close on outside click or Escape key
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    showToast('Logged out successfully.');
    router.push('/login');
    router.refresh();
  };

  const handleLoginClick = () => {
    setOpen(false);
    router.push('/login');
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* ── Trigger Button ── */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 bg-gray-900/80 hover:bg-gray-800 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-brand-border transition active:scale-95 text-left focus:outline-none focus:ring-1 focus:ring-brand-500"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <div className="relative">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-brand-500/20 text-brand-500 flex items-center justify-center font-bold text-xs border border-brand-500/30 uppercase">
            {initials}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-brand-dark" />
        </div>

        <div className="hidden md:block">
          <p className="text-xs font-bold text-white leading-tight">{user.name}</p>
          <p className="text-[10px] text-gray-400">{user.email}</p>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
            open ? 'rotate-180 text-brand-500' : ''
          }`}
        />
      </button>

      {/* ── Dropdown Menu ── */}
      {open && (
        <div
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } mt-2 w-64 bg-brand-card/95 backdrop-blur-xl border border-brand-border rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150`}
        >
          {/* Header Section */}
          <div className="px-4 py-2.5 border-b border-brand-border/60">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-white">{user.name}</p>
              {user.role && (
                <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20 uppercase tracking-wider">
                  {user.role}
                </span>
              )}
            </div>
            <p className="text-[10px] text-gray-400 truncate mt-0.5">{user.email}</p>
          </div>

          {/* Navigation Links */}
          <div className="py-1">
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-300 hover:text-white hover:bg-gray-800/80 transition"
            >
              <LayoutDashboard className="w-4 h-4 text-brand-500" />
              <span>Admin Dashboard</span>
            </Link>

            <Link
              href="/order"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-300 hover:text-white hover:bg-gray-800/80 transition"
            >
              <ChefHat className="w-4 h-4 text-amber-400" />
              <span>Kitchen & Live Orders</span>
            </Link>

            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-300 hover:text-white hover:bg-gray-800/80 transition"
            >
              <Store className="w-4 h-4 text-emerald-400" />
              <span>Public Store</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                showToast('User profile settings coming soon.');
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-300 hover:text-white hover:bg-gray-800/80 transition text-left"
            >
              <User className="w-4 h-4 text-blue-400" />
              <span>Profile Settings</span>
            </button>
          </div>

          {/* Bottom Action Section: Root page shows Login button; Admin/Order pages show Logout */}
          <div className="pt-1.5 mt-1 border-t border-brand-border/60 px-2">
            {isRoot ? (
              <button
                type="button"
                onClick={handleLoginClick}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-white bg-linear-to-r from-brand-500 to-amber-500 hover:from-brand-600 hover:to-amber-600 shadow-glow transition active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In / Staff Portal</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
