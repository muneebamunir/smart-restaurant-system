'use client';

import Image from 'next/image';
import { Sliders, Plus } from 'lucide-react';
import { useCart } from '@/context/cartcontext';
import type { FoodItem } from '@/types';

interface FoodCardProps {
  item: FoodItem;
  onCustomize: (item: FoodItem) => void;
}

export default function FoodCard({ item, onCustomize }: FoodCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-brand-500/50 transition-all duration-300 hover:-translate-y-1 shadow-lg">
      <div className="relative overflow-hidden aspect-4/3">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span
          className={`absolute top-3 left-3 ${item.badgeColor} text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider`}
        >
          {item.badge}
        </span>
        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 text-xs text-amber-400 font-bold border border-white/10">
          ★ {item.rating} <span className="text-gray-400 font-normal">({item.reviews})</span>
        </div>
      </div>

      <div className="p-5 grow flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-white group-hover:text-brand-500 transition-colors">
            {item.title}
          </h3>
          <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">{item.description}</p>
        </div>

        <div className="pt-3 border-t border-gray-800 flex items-center justify-between">
          <div>
            <span className="text-lg font-extrabold text-white">${item.price.toFixed(2)}</span>
            {item.oldPrice && (
              <span className="text-xs text-gray-500 line-through ml-1.5">
                ${item.oldPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onCustomize(item)}
              className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition"
              title="Customize"
            >
              <Sliders className="w-4 h-4" />
            </button>
            <button
              onClick={() => addToCart(item.id)}
              className="bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-semibold px-3.5 py-2 rounded-xl shadow-glow transition flex items-center gap-1.5 text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}