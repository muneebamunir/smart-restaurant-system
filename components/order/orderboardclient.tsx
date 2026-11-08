'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import {
  ChefHat, Search, PlusCircle, Volume2, VolumeX, ChevronDown,
  Clock, Flame, CheckCircle2, Utensils, Eye, AlertCircle,
  Inbox, LayoutDashboard, User, LogOut, X,
} from 'lucide-react';
import { useToast } from '@/context/toastcontext';
import { useRouter } from 'next/navigation';
import NewOrderModal from './newordermodal';

/* ──────────────────────────────────────────────────────────
   Types
   ────────────────────────────────────────────────────────── */
type OrderStatus = 'pending' | 'preparing' | 'on-the-way' | 'delivered' | 'cancelled';

interface Order {
  _id: string;
  orderNumber: string;
  orderType: 'online' | 'dining';
  table?: { _id: string; table_id: string; location?: string };
  customer: { name: string; phone?: string; address?: string };
  items: { item: string; name: string; price: number; qty: number; note?: string }[];
  status: OrderStatus;
  estimatedArrival?: string;
  createdAt?: string;
}

interface Staff {
  sub: string;
  role: 'admin' | 'chef' | 'waiter';
  name: string;
  email: string;
}

interface Props {
  initialOrders: Order[];
  menu: any[];
  tables: any[];
  staff: Staff;
}

/* ──────────────────────────────────────────────────────────
   Main client
   ────────────────────────────────────────────────────────── */
export default function OrderBoardClient({ initialOrders, menu, tables, staff }: Props) {
  const { showToast } = useToast();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [newOrderOpen, setNewOrderOpen] = useState(false);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  const knownIdsRef = useRef(new Set(initialOrders.map((o) => o._id)));

  /* ── Polling for new orders (every 10s) ─────────────── */
  useEffect(() => {
    const tick = async () => {
      try {
        const res = await fetch('/api/orders?activeOnly=1', { cache: 'no-store' });
        if (!res.ok) return;
        const data: Order[] = await res.json();

        /* Alert on genuinely new orders */
        const newOnes = data.filter((o) => !knownIdsRef.current.has(o._id));
        if (newOnes.length > 0 && audioEnabled) playOrderSound();
        newOnes.forEach((o) => knownIdsRef.current.add(o._id));

        setOrders(data);
      } catch {
        /* silent — polling shouldn't spam errors */
      }
    };

    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, [audioEnabled]);

  /* ── Derived columns ───────────────────────────────── */
  const filtered = useMemo(() => {
    if (!searchQuery) return orders;
    const q = searchQuery.toLowerCase();
    return orders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        (o.table?.table_id ?? '').toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q)
    );
  }, [orders, searchQuery]);

  const pending = filtered.filter((o) => o.status === 'pending');
  const preparing = filtered.filter((o) => o.status === 'preparing');
  const ready = filtered.filter((o) => o.status === 'on-the-way');

  /* ── Status transition ─────────────────────────────── */
  const advanceStatus = async (order: Order, next: OrderStatus) => {
    /* Optimistic update */
    const previous = orders;
    if (next === 'delivered' || next === 'cancelled') {
      setOrders((prev) => prev.filter((o) => o._id !== order._id));
    } else {
      setOrders((prev) => prev.map((o) => (o._id === order._id ? { ...o, status: next } : o)));
    }

    const res = await fetch(`/api/orders/${order._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    });

    if (!res.ok) {
      setOrders(previous);   // revert
      const data = await res.json().catch(() => ({}));
      showToast(data.error ?? 'Could not update order.');
      return;
    }

    if (next === 'delivered') {
      showToast(`Order ${order.orderNumber} served.`);
    } else if (next === 'on-the-way') {
      showToast(`Order ${order.orderNumber} ready for service.`);
      if (audioEnabled) playOrderSound();
    } else {
      showToast(`Order ${order.orderNumber} moved to ${next}.`);
    }
  };

  /* ── Logout ─────────────────────────────────────────── */
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  /* ── Role permissions ───────────────────────────────── */
  const roleAllows = (action: 'accept' | 'ready' | 'serve') => {
    if (staff.role === 'admin') return true;
    if (action === 'serve') return staff.role === 'waiter';
    return staff.role === 'chef';
  };

  /* ── Render ─────────────────────────────────────────── */
  return (
    <>
      {/* ─── HEADER ─── */}
      <header className="fixed top-0 left-0 right-0 z-40 h-16 glass-nav border-b border-brand-border flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-6">
          <a href="/order" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-brand-600 to-amber-400 flex items-center justify-center text-white shadow-glow">
              <ChefHat className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-white leading-tight">
                Taste<span className="text-brand-500">Craft</span>
              </span>
              <span className="text-[10px] text-amber-400 font-bold tracking-wide uppercase">
                Kitchen & Floor Live
              </span>
            </div>
          </a>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative hidden lg:block w-44 xl:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Table or #ORD…"
              className="w-full bg-gray-900 border border-brand-border rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-brand-500"
            />
          </div>

          <button
            onClick={() => setNewOrderOpen(true)}
            className="bg-linear-to-r from-brand-500 to-amber-500 hover:from-brand-600 hover:to-amber-600 text-white font-bold px-3.5 py-2 rounded-xl shadow-glow text-xs flex items-center gap-1.5 transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">+ Create Table Order</span>
            <span className="sm:hidden">New</span>
          </button>

          <button
            onClick={() => setAudioEnabled((v) => !v)}
            className={`p-2 rounded-xl bg-gray-900 border border-brand-border hover:bg-gray-800 transition ${
              audioEnabled ? 'text-emerald-400' : 'text-gray-500'
            }`}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <div className="h-6 w-px bg-brand-border hidden sm:block" />

          <div className="relative">
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 bg-gray-900/80 hover:bg-gray-800 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-brand-border transition"
            >
              <div className="relative">
                <div className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-500 flex items-center justify-center font-bold text-xs border border-brand-500/30 uppercase">
                  {staff.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-brand-dark" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-white leading-tight">{staff.name}</p>
                <p className="text-[10px] text-gray-400">{staff.email}</p>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                  profileOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-brand-card border border-brand-border rounded-2xl shadow-2xl py-2 z-50">
                <div className="px-4 py-2.5 border-b border-brand-border/60">
                  <p className="text-xs font-bold text-white">{staff.name}</p>
                  <p className="text-[10px] text-gray-400 truncate">{staff.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20 uppercase tracking-wider">
                    {staff.role}
                  </span>
                </div>
                <div className="py-1">
                  <a
                    href="/admin"
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-300 hover:text-white hover:bg-gray-800/80"
                  >
                    <LayoutDashboard className="w-4 h-4 text-brand-500" />
                    <span>Admin Dashboard</span>
                  </a>
                  <button
                    onClick={() => { setProfileOpen(false); showToast('Profile page coming soon.'); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-300 hover:text-white hover:bg-gray-800/80"
                  >
                    <User className="w-4 h-4 text-amber-400" />
                    <span>Profile</span>
                  </button>
                </div>
                <div className="pt-1 border-t border-brand-border/60">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── STATS BAR ─── */}
      <div className="pt-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <StatBadge label="Pending Orders" count={pending.length} tone="amber" icon={Clock} />
          <StatBadge label="In Preparation" count={preparing.length} tone="brand" icon={Flame} />
          <StatBadge label="Ready for Service" count={ready.length} tone="emerald" icon={CheckCircle2} />
        </div>
      </div>

      {/* ─── MOBILE TABS ─── */}
      <div className="md:hidden px-4 mt-4 sticky top-16 z-20 bg-brand-dark/95 backdrop-blur-md py-2 border-b border-brand-border">
        <div className="grid grid-cols-3 gap-2 bg-gray-900 p-1 rounded-xl border border-brand-border text-xs font-bold text-center">
          <a href="#col-pending" className="py-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            Pending ({pending.length})
          </a>
          <a href="#col-preparing" className="py-2 rounded-lg text-gray-400">
            Preparing ({preparing.length})
          </a>
          <a href="#col-ready" className="py-2 rounded-lg text-gray-400">
            Ready ({ready.length})
          </a>
        </div>
      </div>

      {/* ─── KANBAN BOARD ─── */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
        <div className="flex md:grid md:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-6 h-[calc(100vh-16rem)]">
          <KanbanColumn
            id="col-pending"
            title="Pending Orders"
            tone="amber"
            dotClass="bg-amber-500 animate-pulse"
            orders={pending}
            staff={staff}
            onView={setDetailOrder}
            onAdvance={advanceStatus}
            roleAllows={roleAllows}
            emptyLabel="pending"
          />
          <KanbanColumn
            id="col-preparing"
            title="In Preparation"
            tone="brand"
            dotClass="bg-brand-500"
            orders={preparing}
            staff={staff}
            onView={setDetailOrder}
            onAdvance={advanceStatus}
            roleAllows={roleAllows}
            emptyLabel="preparing"
          />
          <KanbanColumn
            id="col-ready"
            title="Ready for Service"
            tone="emerald"
            dotClass="bg-emerald-500"
            orders={ready}
            staff={staff}
            onView={setDetailOrder}
            onAdvance={advanceStatus}
            roleAllows={roleAllows}
            emptyLabel="ready"
          />
        </div>
      </main>

      {/* ─── MODALS ─── */}
      <NewOrderModal
        open={newOrderOpen}
        menu={menu}
        tables={tables}
        staff={staff}
        onClose={() => setNewOrderOpen(false)}
        onCreated={(newOrder: Order) => {
          setOrders((prev) => [newOrder, ...prev]);
          knownIdsRef.current.add(newOrder._id);
          setNewOrderOpen(false);
          if (audioEnabled) playOrderSound();
          showToast(`Order ${newOrder.orderNumber} placed.`);
        }}
      />

      {detailOrder && (
        <OrderDetailModal order={detailOrder} onClose={() => setDetailOrder(null)} />
      )}
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   Stat badge
   ══════════════════════════════════════════════════════════ */
function StatBadge({
  label, count, tone, icon: Icon,
}: {
  label: string;
  count: number;
  tone: 'amber' | 'brand' | 'emerald';
  icon: typeof Clock;
}) {
  const map = {
    amber: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-l-amber-500' },
    brand: { text: 'text-brand-500', bg: 'bg-brand-500/10', border: 'border-l-brand-500' },
    emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-l-emerald-500' },
  };
  const t = map[tone];

  return (
    <div className={`glass-card p-3 sm:p-4 rounded-2xl border-l-4 ${t.border} flex items-center justify-between`}>
      <div>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className={`text-xl sm:text-2xl font-extrabold ${t.text}`}>{count}</p>
      </div>
      <div className={`w-10 h-10 rounded-xl ${t.bg} ${t.text} flex items-center justify-center`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Kanban column
   ══════════════════════════════════════════════════════════ */
function KanbanColumn({
  id, title, tone, dotClass, orders, staff, onView, onAdvance, roleAllows, emptyLabel,
}: any) {
  const toneMap = {
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    brand: 'bg-brand-500/20 text-brand-400 border-brand-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  } as const;
  const badgeClass = toneMap[tone as keyof typeof toneMap];

  return (
    <div
      id={id}
      className="snap-center min-w-[85vw] sm:min-w-[320px] md:min-w-0 flex-1 flex flex-col bg-gray-900/40 rounded-2xl border border-brand-border p-4 h-full"
    >
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-brand-border">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${dotClass}`} />
          <h2 className="font-bold text-sm text-white uppercase tracking-wider">{title}</h2>
        </div>
        <span className={`border text-xs font-bold px-2.5 py-0.5 rounded-full ${badgeClass}`}>
          {orders.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {orders.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center text-center p-4 border border-dashed border-brand-border rounded-xl">
            <Inbox className="w-8 h-8 text-gray-600 mb-2" />
            <p className="text-xs font-semibold text-gray-500">No {emptyLabel} orders</p>
          </div>
        ) : (
          orders.map((order: Order) => (
            <OrderCard
              key={order._id}
              order={order}
              staff={staff}
              onView={() => onView(order)}
              onAdvance={onAdvance}
              roleAllows={roleAllows}
            />
          ))
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Order card
   ══════════════════════════════════════════════════════════ */
function OrderCard({ order, staff, onView, onAdvance, roleAllows }: any) {
  const elapsed = getTimeElapsed(order.createdAt);
  const isLate = elapsed.minutes >= 20;

  const totalQty = order.items.reduce((a: number, i: any) => a + i.qty, 0);

  const next =
    order.status === 'pending'
      ? { status: 'preparing' as const, label: 'Accept & Start Cooking', action: 'accept' as const, icon: Flame, tone: 'brand' }
      : order.status === 'preparing'
      ? { status: 'on-the-way' as const, label: 'Mark Ready for Pickup', action: 'ready' as const, icon: CheckCircle2, tone: 'emerald' }
      : { status: 'delivered' as const, label: 'Mark Order Served', action: 'serve' as const, icon: Utensils, tone: 'blue' };

  const canAdvance = roleAllows(next.action);
  const NextIcon = next.icon;

  const toneBtn: Record<string, string> = {
    brand: 'from-brand-500 to-amber-500 hover:from-brand-600 hover:to-amber-600',
    emerald: 'from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600',
    blue: 'from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600',
  };

  return (
    <div
      className={`glass-card p-4 rounded-2xl border transition-all space-y-3 ${
        isLate ? 'border-red-500/80 shadow-glow' : 'border-brand-border hover:border-brand-500/50'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-brand-border pb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-black text-sm text-white">
              {order.table?.table_id ?? 'Delivery'}
            </span>
            <span className="text-[11px] font-mono font-bold text-gray-400">
              {order.orderNumber}
            </span>
          </div>
          <p className="text-[10px] text-gray-400">
            {order.orderType === 'dining' ? 'Dine-in' : 'Online'} · {order.customer.name}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
            isLate
              ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
              : 'bg-gray-800 text-amber-400 border border-brand-border'
          }`}
        >
          <Clock className="w-3 h-3" />
          {elapsed.text}
        </span>
      </div>

      {/* Items */}
      <button onClick={onView} className="w-full text-left space-y-1.5">
        {order.items.slice(0, 3).map((i: any, idx: number) => (
          <div
            key={idx}
            className="flex items-center justify-between text-xs bg-gray-900/60 p-2 rounded-xl border border-brand-border/60"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-5 h-5 rounded-lg bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center text-[11px] shrink-0">
                {i.qty}x
              </span>
              <p className="font-bold text-gray-100 text-xs leading-tight truncate">
                {i.name}
              </p>
            </div>
          </div>
        ))}
        {order.items.length > 3 && (
          <p className="text-[10px] text-gray-500 italic pl-1">
            +{order.items.length - 3} more item{order.items.length - 3 === 1 ? '' : 's'} (total {totalQty})
          </p>
        )}
      </button>

      {/* Actions */}
      <div className="pt-1 flex items-center justify-between gap-2 border-t border-brand-border/60">
        <button
          onClick={onView}
          className="p-2 text-gray-400 hover:text-white rounded-xl bg-gray-900 hover:bg-gray-800 border border-brand-border"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>

        {canAdvance ? (
          <button
            onClick={() => onAdvance(order, next.status)}
            className={`flex-1 bg-linear-to-r ${toneBtn[next.tone]} text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-glow transition active:scale-95`}
          >
            <NextIcon className="w-3.5 h-3.5" />
            <span>{next.label}</span>
          </button>
        ) : (
          <div className="flex-1 text-center text-[10px] text-gray-500 italic py-2">
            {staff.role === 'waiter' ? 'Chef action required' : 'Waiter action required'}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Order detail modal
   ══════════════════════════════════════════════════════════ */
function OrderDetailModal({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-modal border border-brand-border rounded-3xl max-w-md w-full p-6 space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800">
          <X className="w-5 h-5" />
        </button>

        <div className="border-b border-brand-border pb-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-white">
              {order.table?.table_id ?? 'Delivery'}
            </h3>
            <span className="font-mono text-xs font-bold text-brand-500">
              {order.orderNumber}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {order.orderType === 'dining' ? 'Dine-in' : 'Online'} · {order.customer.name}
          </p>
          {order.customer.address && (
            <p className="text-xs text-gray-400 mt-1">📍 {order.customer.address}</p>
          )}
          {order.customer.phone && (
            <p className="text-xs text-gray-400">📞 {order.customer.phone}</p>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">
            Ordered Items
          </p>
          {order.items.map((i, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 bg-gray-900 rounded-xl border border-brand-border text-xs">
              <div>
                <p className="font-bold text-white">{i.name}</p>
                {i.note && <p className="text-[10px] text-gray-500 italic">{i.note}</p>}
              </div>
              <span className="font-extrabold text-brand-500 bg-brand-500/10 px-2 py-1 rounded-lg border border-brand-500/20">
                {i.qty}x
              </span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-brand-border flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs font-semibold">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Utilities
   ══════════════════════════════════════════════════════════ */
function getTimeElapsed(dateIso?: string) {
  if (!dateIso) return { text: 'just now', minutes: 0 };
  const mins = Math.floor((Date.now() - new Date(dateIso).getTime()) / 60000);
  if (mins < 1) return { text: 'just now', minutes: 0 };
  return {
    text: `${mins} min${mins > 1 ? 's' : ''} ago`,
    minutes: mins,
  };
}

function playOrderSound() {
  try {
    const Ctor = (window as any).AudioContext ?? (window as any).webkitAudioContext;
    const ctx = new Ctor();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch {
    /* audio may be blocked — silent fail */
  }
}