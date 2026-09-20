'use client';

import Link from 'next/link';
import { Utensils, ExternalLink } from 'lucide-react';

interface Props {
  name: string;
  email: string;
}

export default function AdminTopbar({ name, email }: Props) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 glass-nav border-b border-brand-border flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg">
          <svg className="w-6 h-6" /* menu icon */ />
        </button>
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-brand-600 to-amber-400 flex items-center justify-center text-white shadow-glow">
            <Utensils className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            Taste<span className="text-brand-500">Craft</span>
            <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-amber-400 font-semibold border border-amber-500/30 ml-1">
              Admin
            </span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white bg-gray-900 border border-brand-border px-3 py-1.5 rounded-lg transition"
        >
          <ExternalLink className="w-3.5 h-3.5 text-brand-500" />
          <span>Public Store</span>
        </Link>

        <div className="h-6 w-px bg-brand-border hidden sm:block" />

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-500 flex items-center justify-center font-bold text-xs border border-brand-500/30">
            {initials}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-white leading-tight">{name}</p>
            <p className="text-[10px] text-gray-400">{email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}