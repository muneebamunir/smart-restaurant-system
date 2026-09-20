'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, UtensilsCrossed, Tags, TicketPercent,
  Armchair, Users, Star, Send, Settings,
} from 'lucide-react';

const SECTIONS = [
  {
    label: 'Main Management',
    items: [
      { href: '/admin',            label: 'Dashboard',         Icon: LayoutDashboard },
      { href: '/admin/items',      label: 'Food Items',        Icon: UtensilsCrossed },
      { href: '/admin/categories', label: 'Categories',        Icon: Tags },
      { href: '/admin/offers',     label: 'Offers & Coupons',  Icon: TicketPercent },
      { href: '/admin/tables',     label: 'Restaurant Tables', Icon: Armchair },
    ],
  },
  {
    label: 'People & Engagement',
    items: [
      { href: '/admin/users',     label: 'Staff Users',     Icon: Users },
      { href: '/admin/reviews',   label: 'Order Reviews',   Icon: Star },
      { href: '/admin/marketing', label: 'Email Broadcast', Icon: Send },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/admin/settings', label: 'Store Settings', Icon: Settings },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 bg-brand-sidebar border-r border-brand-border pt-4 pb-6 px-3 flex-col justify-between">
      <div className="space-y-1">
        {SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-4 mb-2">
              {section.label}
            </p>
            {section.items.map(({ href, label, Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    active
                      ? 'tab-active'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      <div className="p-3 bg-gray-900/60 rounded-xl border border-brand-border text-xs space-y-1">
        <p className="text-gray-400 text-[10px]">Mongoose Connected</p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-bold text-gray-200">Database Active</span>
        </div>
      </div>
    </aside>
  );
}