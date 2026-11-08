import { NextResponse } from 'next/server';
import { getOrderById, type OrderStatus } from '@/data/orders';

/* Which transitions are legal */
const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['preparing', 'cancelled'],
  preparing: ['on-the-way', 'cancelled'],
  'on-the-way': ['delivered'],
  delivered: [],
  cancelled: [],
};

/* ──────────────────────────────────────────────────────────
   PATCH /api/orders/:id
   Body: { status: 'preparing' | 'on-the-way' | 'delivered' | 'cancelled' }
   ────────────────────────────────────────────────────────── */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const nextStatus = body.status as OrderStatus | undefined;
  if (!nextStatus) {
    return NextResponse.json({ error: 'Missing "status" field.' }, { status: 400 });
  }

  const order = getOrderById(id);
  if (!order) {
    return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  }

  const allowed = TRANSITIONS[order.status] ?? [];
  if (!allowed.includes(nextStatus)) {
    return NextResponse.json(
      { error: `Cannot move from "${order.status}" to "${nextStatus}".` },
      { status: 409 }
    );
  }

  order.status = nextStatus;
  return NextResponse.json(order);
}