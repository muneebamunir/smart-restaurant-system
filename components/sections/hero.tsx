import { ArrowRight, Sparkles, Leaf } from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
  return (
    <section id="hero" className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden scroll-mt-20">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 bg-gray-800/80 border border-gray-700/80 rounded-full px-4 py-1.5 text-xs sm:text-sm text-gray-300 backdrop-blur-sm animate-bounce-subtle">
              <span className="text-brand-500">🚀 30 Min Express Delivery</span>
              <span className="text-gray-600">|</span>
              <span className="text-emerald-400">🌿 100% Organic Ingredients</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              Gourmet Meals <br className="hidden sm:inline" />
              Delivered to Your{' '}
              <span className="bg-linear-to-r from-brand-500 via-amber-400 to-brand-600 bg-clip-text text-transparent">
                Doorstep.
              </span>
            </h1>

            <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Experience chef-crafted culinary masterpieces prepared with fresh, locally sourced
              ingredients. Satisfy your cravings in under 30 minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#menu"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold px-8 py-4 rounded-xl shadow-glow hover:shadow-glow-lg transition-all active:scale-95 text-base"
              >
                <span>Explore Menu</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#offers"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-800/80 hover:bg-gray-700/80 text-gray-200 border border-gray-700 font-semibold px-8 py-4 rounded-xl transition-all text-base"
              >
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Special Offers</span>
              </a>
            </div>

            <div className="pt-8 border-t border-gray-800/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">4.9 ★</p>
                <p className="text-xs text-gray-400">12k+ Reviews</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">30m</p>
                <p className="text-xs text-gray-400">Avg Delivery</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">50+</p>
                <p className="text-xs text-gray-400">Gourmet Dishes</p>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center items-center">
            <div className="relative w-full max-w-lg aspect-square rounded-3xl overflow-hidden glass-card p-4 group">
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
                  alt="Delicious Artisan Burger"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 512px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-4 bg-linear-to-t from-black/80 via-transparent to-transparent rounded-2xl pointer-events-none" />

              <div className="absolute top-8 left-8 glass-card p-3 rounded-2xl flex items-center gap-3 shadow-xl animate-bounce-subtle">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Fresh Quality</p>
                  <p className="text-sm font-bold text-white">100% Chef Verified</p>
                </div>
              </div>

              <div className="absolute bottom-8 right-8 glass-card p-4 rounded-2xl flex items-center gap-3 shadow-xl">
                <div className="w-12 h-12 rounded-full bg-brand-500/20 text-brand-500 flex items-center justify-center font-bold">
                  🔥
                </div>
                <div>
                  <p className="text-xs text-gray-400">Top Choice Today</p>
                  <p className="text-base font-bold text-white">Smokey BBQ Artisan</p>
                  <p className="text-xs text-brand-400 font-semibold">$14.99</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}