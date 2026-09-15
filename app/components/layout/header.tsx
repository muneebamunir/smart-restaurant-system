'use client';

import { useState } from 'react';
import { Utensils, Search, Camera, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/app/context/cartcontext';
import { useMenuFilter } from '@/app/context/menufiltercontext';
import CameraModal from '@/app/components/layout/cameramodal';

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'Menu', href: '#menu' },
  { label: 'Offers', href: '#offers' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);

  const { count, subtotal, setDrawerOpen } = useCart();
  const { searchQuery, setSearchQuery } = useMenuFilter();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 glass-nav border-b border-gray-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-brand-600 to-amber-400 flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform">
              <Utensils className="w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white">
              Taste<span className="text-brand-500">Craft</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center space-x-8 font-medium text-sm text-gray-300">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-brand-500 transition-colors py-1 border-b-2 border-transparent hover:border-brand-500"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative hidden sm:block w-48 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search burgers, sushi..."
                className="w-full bg-gray-900/80 border border-gray-700/80 rounded-full pl-9 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition"
              />
            </div>

            <button
              onClick={() => setCameraOpen(true)}
              title="Turn on Camera / Visual Search"
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white p-2.5 sm:px-3 sm:py-2 rounded-full border border-gray-700/80 transition active:scale-95 group"
            >
              <Camera className="w-5 h-5 text-brand-500 group-hover:scale-110 transition-transform" />
              <span className="hidden xl:inline text-xs font-semibold">Camera Search</span>
            </button>

            <button
              onClick={() => setDrawerOpen(true)}
              className="relative flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-4 py-2.5 rounded-full shadow-glow hover:shadow-glow-lg transition-all active:scale-95"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden lg:inline text-sm">View Order</span>
              <span className="bg-white text-brand-600 text-xs font-bold px-2 py-0.5 rounded-full ml-1 min-w-5 text-center">
                {count}
              </span>
              <span className="text-xs opacity-90 hidden sm:inline border-l border-brand-400 pl-2">
                ${subtotal.toFixed(2)}
              </span>
            </button>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 text-gray-400 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-gray-900 border-b border-gray-800 px-4 pt-2 pb-6 space-y-3">
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-brand-500"
              />
            </div>
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-gray-200 hover:text-brand-500 font-medium py-1"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </header>

      <CameraModal open={cameraOpen} onClose={() => setCameraOpen(false)} />
    </>
  );
}