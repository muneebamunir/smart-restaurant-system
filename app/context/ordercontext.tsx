'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CartItem, Order, OrderCustomer, OrderStatus } from '@/app/types';
import { deriveOrderStatus } from '@/app/types';

const STORAGE_KEY = 'tastecraft.activeOrders';
const DELIVERY_ETA_MS = 30 * 60 * 1000; // 30 minutes

export interface PlaceOrderInput {
  items: CartItem[];
  subtotal: number;
  tax: number;
  delivery: number;
  discountAmount: number;
  total: number;
  promoCode?: string;
  customer: OrderCustomer;
}

interface OrderContextValue {
  orders: Order[];
  activeOrders: Order[];
  pastOrders: Order[];
  placeOrder: (input: PlaceOrderInput) => Order;
  cancelOrder: (id: string) => void;
  clearOrders: () => void;
  getOrder: (id: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

function generateOrderId(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `TC-${stamp}${rand}`;
}

function loadFromStorage(): Order[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Order[]) : [];
  } catch {
    return [];
  }
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // ── Hydrate from localStorage once on mount ─────────────────
  useEffect(() => {
    setOrders(loadFromStorage());
    setHydrated(true);
  }, []);

  // ── Persist on every change ─────────────────────────────────
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {
      /* quota errors are non-fatal */
    }
  }, [orders, hydrated]);

  // ── Tick every 15s so status changes re-render automatically ─
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 15_000);
    return () => clearInterval(id);
  }, []);

  const placeOrder = useCallback((input: PlaceOrderInput): Order => {
    const createdAt = Date.now();
    const order: Order = {
      id: generateOrderId(),
      items: input.items,
      subtotal: input.subtotal,
      tax: input.tax,
      delivery: input.delivery,
      discountAmount: input.discountAmount,
      total: input.total,
      promoCode: input.promoCode,
      customer: input.customer,
      createdAt,
      estimatedArrival: createdAt + DELIVERY_ETA_MS,
    };

    setOrders((prev) => [order, ...prev]);
    return order;
  }, []);

  const cancelOrder = useCallback((id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  }, []);

  const clearOrders = useCallback(() => {
    setOrders([]);
  }, []);

  const getOrder = useCallback(
    (id: string) => orders.find((o) => o.id === id),
    [orders]
  );

  const { activeOrders, pastOrders } = useMemo(() => {
    const active: Order[] = [];
    const past: Order[] = [];
    for (const o of orders) {
      if (deriveOrderStatus(o) === 'delivered') past.push(o);
      else active.push(o);
    }
    return { activeOrders: active, pastOrders: past };
  }, [orders]);

  const value: OrderContextValue = {
    orders,
    activeOrders,
    pastOrders,
    placeOrder,
    cancelOrder,
    clearOrders,
    getOrder,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within an OrderProvider');
  return ctx;
}