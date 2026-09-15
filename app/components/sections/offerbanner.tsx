// components/sections/OfferBanner.tsx
'use client';

import { useCart } from '@/app/context/cartcontext';

export default function OfferBanner() {
  const { setPromoCode, applyPromoCode, setDrawerOpen } = useCart();

  const handleClaim = () => {
    setPromoCode('TASTE20');
    applyPromoCode('TASTE20');
    setDrawerOpen(true);
  };

  return (
    <section id="offers" className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="relative rounded-3xl bg-linear-to-r from-brand-600 via-amber-600 to-brand-700 p-6 sm:p-10 shadow-glow overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[16px_16px]" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2">
            <span className="inline-block bg-black/30 backdrop-blur-md text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Limited Time Promo
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Get 20% OFF Your First Order!
            </h2>
            <p className="text-amber-100 text-sm max-w-md">
              Use coupon code{' '}
              <span className="font-mono bg-black/40 px-2 py-0.5 rounded text-white font-bold border border-amber-300/30">
                TASTE20
              </span>{' '}
              at checkout to unlock savings.
            </p>
          </div>
          <button
            onClick={handleClaim}
            className="bg-white text-brand-700 hover:bg-amber-50 font-bold px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-all text-sm whitespace-nowrap"
          >
            Claim Offer Now
          </button>
        </div>
      </div>
    </section>
  );
}