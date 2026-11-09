'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ExternalLink,
  Menu,
  X,
  LayoutDashboard,
  UtensilsCrossed,
  Tags,
  TicketPercent,
  Armchair,
  Users,
  Star,
  Send,
  Settings,
} from 'lucide-react';
import BrandLogo from '@/components/layout/brandlogo';
import UserProfileDropdown from '@/components/layout/userprofiledropdown';

interface Props {
  name: string;
  email: string;
}

const ADMIN_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/items', label: 'Food Items', icon: UtensilsCrossed },
  { href: '/admin/categories', label: 'Categories', icon: Tags },
  { href: '/admin/offers', label: 'Offers & Coupons', icon: TicketPercent },
  { href: '/admin/tables', label: 'Tables', icon: Armchair },
  { href: '/admin/users', label: 'Staff Users', icon: Users },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/marketing', label: 'Email Broadcast', icon: Send },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminTopbar({ name, email }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 h-16 glass-nav border-b border-brand-border flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <BrandLogo href="/admin" badge="Admin" />
        </div>

        <div className="flex items-center gap-2.5 sm:gap-4">
          <Link
            href="/"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white bg-gray-900 border border-brand-border px-3 py-1.5 rounded-lg transition"
          >
            <ExternalLink className="w-3.5 h-3.5 text-brand-500" />
            <span>Public Store</span>
          </Link>

          <div className="h-6 w-px bg-brand-border hidden sm:block" />

          {/* User Profile Dropdown */}
          <UserProfileDropdown
            variant="admin"
            user={{
              name,
              email,
              role: 'Admin',
            }}
          />
        </div>
      </header>

      {/* Mobile Navigation Drawer for Admin */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 pt-16 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-brand-sidebar border-b border-brand-border p-4 max-h-[calc(100vh-4rem)] overflow-y-auto space-y-1">
            <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              Admin Navigation
            </p>
            {ADMIN_LINKS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    active ? 'tab-active' : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
            <div className="pt-3 border-t border-brand-border mt-3">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-white"
              >
                <ExternalLink className="w-4 h-4 text-brand-500" />
                <span>Switch to Public Store</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
