import type { ReactNode } from 'react';

export default async function OrderLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-brand-dark text-gray-100 font-sans antialiased min-h-screen flex flex-col">
      {children}
    </div>
  );
}