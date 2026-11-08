/* ──────────────────────────────────────────────────────────
   Demo order data — in-memory only, no DB.
   Mutations persist for the life of the dev-server process.
   ────────────────────────────────────────────────────────── */

export type OrderStatus = 'pending' | 'preparing' | 'on-the-way' | 'delivered' | 'cancelled';
export type OrderType = 'online' | 'dining';

export interface DemoOrder {
  _id: string;
  orderNumber: string;
  orderType: OrderType;
  table?: { _id: string; table_id: string; location?: string };
  customer: { name: string; phone?: string; address?: string };
  items: { item: string; name: string; price: number; qty: number; note?: string }[];
  status: OrderStatus;
  createdAt: string;
  estimatedArrival?: string;
  staffNote?: string;
}

const SEED: DemoOrder[] = [
  {
    _id: 'ord_101',
    orderNumber: '#ORD-1081',
    orderType: 'dining',
    table: { _id: 'tbl_04', table_id: 'T-04', location: 'Main Hall' },
    customer: { name: 'Table T-04' },
    items: [
      { item: '1', name: 'Smokey BBQ Artisan Burger', price: 14.99, qty: 2, note: 'Double Wagyu' },
      { item: '2', name: 'Truffle Mushroom Pizza', price: 21.0, qty: 1, note: 'Large 16"' },
    ],
    status: 'pending',
    createdAt: new Date(Date.now() - 12 * 60_000).toISOString(),
    staffNote: 'Allergies: No nuts. Please make medium rare.',
  },
  {
    _id: 'ord_102',
    orderNumber: '#ORD-1082',
    orderType: 'dining',
    table: { _id: 'tbl_12', table_id: 'P-12', location: 'Outdoor' },
    customer: { name: 'Table P-12' },
    items: [
      { item: '3', name: 'Spicy Tonkotsu Ramen', price: 15.99, qty: 2, note: 'Extra Pork Chashu' },
    ],
    status: 'preparing',
    createdAt: new Date(Date.now() - 22 * 60_000).toISOString(),
    staffNote: 'Extra spicy chili oil on the side.',
  },
  {
    _id: 'ord_103',
    orderNumber: '#ORD-1083',
    orderType: 'dining',
    table: { _id: 'tbl_vip1', table_id: 'VIP-1', location: 'VIP Suite' },
    customer: { name: 'Table VIP-1' },
    items: [
      { item: '4', name: 'Avocado Salmon Poke Bowl', price: 16.5, qty: 1, note: 'Super Protein' },
      { item: '6', name: 'Matcha Lava Cake', price: 9.5, qty: 2, note: 'With Gelato' },
    ],
    status: 'on-the-way',
    createdAt: new Date(Date.now() - 35 * 60_000).toISOString(),
    staffNote: 'Serve dessert together with drinks.',
  },
  {
    _id: 'ord_104',
    orderNumber: '#ORD-1084',
    orderType: 'online',
    customer: {
      name: 'Imran Khan',
      phone: '+92 300 1234567',
      address: 'House 42, Street 8, DHA Phase 5',
    },
    items: [
      { item: '1', name: 'Smokey BBQ Artisan Burger', price: 14.99, qty: 1, note: 'Single Wagyu' },
      { item: '5', name: 'Quattro Formaggi Pizza', price: 17.0, qty: 1, note: 'Medium 12"' },
    ],
    status: 'pending',
    createdAt: new Date(Date.now() - 5 * 60_000).toISOString(),
  },
];

/* ──────────────────────────────────────────────────────────
   globalThis-backed singleton so every route handler
   (app/api/orders/route.ts and app/api/orders/[id]/route.ts)
   sees the same array. Also survives Next.js hot reloads.
   ────────────────────────────────────────────────────────── */

const g = globalThis as unknown as { __demoOrders?: DemoOrder[] };
g.__demoOrders ??= [...SEED];

export const demoOrders: DemoOrder[] = g.__demoOrders;

/* ── Helpers ───────────────────────────────────────────── */

export function getOrders(): DemoOrder[] {
  return demoOrders;
}

export function getOrderById(id: string): DemoOrder | undefined {
  return demoOrders.find((o) => o._id === id);
}

export function addOrder(order: DemoOrder): DemoOrder {
  demoOrders.unshift(order);
  return order;
}

export function generateOrderNumber(): string {
  return `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function generateOrderId(): string {
  return `ord_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}