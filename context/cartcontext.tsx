'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CartItem } from '@/types';
import { foodItems } from '../data/fooditems';
import { useToast } from './toastcontext';

const TAX_RATE = 0.08;
const DELIVERY_FEE = 2.99;
const PROMO_CODE = 'TASTE20';
const PROMO_DISCOUNT = 0.2;

type PromoStatus = { message: string; ok: boolean } | null;

interface CartContextValue {
  cart: CartItem[];
  count: number;
  subtotal: number;
  tax: number;
  delivery: number;
  discountAmount: number;
  total: number;
  appliedDiscount: number;
  promoCode: string;
  promoStatus: PromoStatus;
  isDrawerOpen: boolean;
  setPromoCode: (code: string) => void;
  applyPromoCode: (codeOverride?: string) => void;
  addToCart: (itemId: string, note?: string) => void;
  updateCartQty: (index: number, change: number) => void;
  setDrawerOpen: (open: boolean) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToast();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [promoStatus, setPromoStatus] = useState<PromoStatus>(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const addToCart = useCallback(
    (itemId: string, note = '') => {
      const item = foodItems.find((i) => i.id === itemId);
      if (!item) return;

      setCart((prev) => {
        const idx = prev.findIndex((c) => c.id === itemId && c.note === note);
        if (idx > -1) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
          return next;
        }
        return [...prev, { ...item, qty: 1, note }];
      });

      showToast(`Added "${item.title}" to order!`);
    },
    [showToast]
  );

  const updateCartQty = useCallback((index: number, change: number) => {
    setCart((prev) => {
      const next = [...prev];
      if (!next[index]) return prev;
      next[index] = { ...next[index], qty: next[index].qty + change };
      if (next[index].qty <= 0) next.splice(index, 1);
      return next;
    });
  }, []);

  const applyPromoCode = useCallback(
    (codeOverride?: string) => {
      const code = (codeOverride ?? promoCode).trim().toUpperCase();
      if (code === PROMO_CODE) {
        setAppliedDiscount(PROMO_DISCOUNT);
        setPromoStatus({ message: 'Promo code TASTE20 applied! (20% Off)', ok: true });
        showToast('20% Discount Code Applied!');
      } else {
        setAppliedDiscount(0);
        setPromoStatus({ message: 'Invalid promo code.', ok: false });
      }
    },
    [promoCode, showToast]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setAppliedDiscount(0);
    setPromoStatus(null);
    setPromoCode('');
  }, []);

  const totals = useMemo(() => {
    const subtotal = cart.reduce((acc, c) => acc + c.price * c.qty, 0);
    const tax = subtotal * TAX_RATE;
    const delivery = subtotal > 0 ? DELIVERY_FEE : 0;
    const discountAmount = subtotal * appliedDiscount;
    const total = Math.max(0, subtotal + tax + delivery - discountAmount);
    const count = cart.reduce((acc, c) => acc + c.qty, 0);
    return { subtotal, tax, delivery, discountAmount, total, count };
  }, [cart, appliedDiscount]);

  return (
    <CartContext.Provider
      value={{
        cart,
        ...totals,
        appliedDiscount,
        promoCode,
        promoStatus,
        isDrawerOpen,
        setPromoCode,
        applyPromoCode,
        addToCart,
        updateCartQty,
        setDrawerOpen,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}