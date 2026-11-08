import { NextResponse } from 'next/server';
import {
  getOrders,
  addOrder,
  generateOrderId,
  generateOrderNumber,
  type DemoOrder,
} from '@/data/orders';

/* ──────────────────────────────────────────────────────────
   GET /api/orders
   Query: ?activeOnly=1  → only pending / preparing / on-the-way
   ────────────────────────────────────────────────────────── */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const activeOnly = url.searchParams.get('activeOnly') === '1';

  const list = getOrders();
  const filtered = activeOnly
    ? list.filter((o) => ['pending', 'preparing', 'on-the-way'].includes(o.status))
    : list;

  return NextResponse.json(filtered);
}

/* ──────────────────────────────────────────────────────────
   POST /api/orders
   Body (from NewOrderModal or customer checkout):
   {
     orderType: 'dining' | 'online',
     table?: string,
     customer?: { name, phone?, address? },
     items: [{ item, name, price, qty, note? }],
     staffNote?: string
   }
   ────────────────────────────────────────────────────────── */
export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json(
      { error: 'An order must contain at least one item.' },
      { status: 400 }
    );
  }

  const orderType: DemoOrder['orderType'] =
    body.orderType === 'online' ? 'online' : 'dining';

  const newOrder: DemoOrder = {
    _id: generateOrderId(),
    orderNumber: generateOrderNumber(),
    orderType,
    table:
      orderType === 'dining' && body.table
        ? {
            _id: String(body.table),
            table_id: body.table_id ?? 'T-XX',
            location: body.location,
          }
        : undefined,
    customer: body.customer ?? {
      name: orderType === 'dining' ? 'Table Guest' : 'Guest',
    },
    items: body.items,
    status: 'pending',
    createdAt: new Date().toISOString(),
    staffNote: typeof body.staffNote === 'string' ? body.staffNote : undefined,
  };

  addOrder(newOrder);
  return NextResponse.json(newOrder, { status: 201 });
}