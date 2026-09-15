'use client';

import type { ReactNode } from 'react';
import { ToastProvider } from '@/app/context/toastcontext';
import { CartProvider } from '@/app/context/cartcontext';
import { MenuFilterProvider } from '@/app/context/menufiltercontext';

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <CartProvider>
        <MenuFilterProvider>{children}</MenuFilterProvider>
      </CartProvider>
    </ToastProvider>
  );
}