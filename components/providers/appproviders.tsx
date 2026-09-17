'use client';

import type { ReactNode } from 'react';
import { ToastProvider } from '@/context/toastcontext';
import { CartProvider } from '@/context/cartcontext';
import { MenuFilterProvider } from '@/context/menufiltercontext';
import { OrderProvider } from '@/context/ordercontext';

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <OrderProvider>
        <CartProvider>
          <MenuFilterProvider>{children}</MenuFilterProvider>
        </CartProvider>
      </OrderProvider>
    </ToastProvider>
  );
}