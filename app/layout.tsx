import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import AppProviders from '../components/providers/appproviders';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TasteCraft - Gourmet Meals Delivered to Your Doorstep',
  description:
    'Experience chef-crafted culinary masterpieces prepared with fresh, locally sourced ingredients. Satisfy your cravings in under 30 minutes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} scroll-smooth`}>
      <body className="bg-brand-dark text-gray-100 font-sans antialiased min-h-screen flex flex-col justify-between overflow-x-hidden">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}