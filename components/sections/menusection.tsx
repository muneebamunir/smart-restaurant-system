'use client';

import { useMenuFilter, type CategoryFilter } from '@/context/menufiltercontext';
import type { FoodItem } from '@/types';
import { useState } from 'react';
import { UtensilsCrossed } from 'lucide-react';
import FoodCard from '@/components/layout/foodcard';
import CustomizeModal from '@/components/layout/customizemodal';

const CATEGORIES: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'All Dishes' },
  { id: 'burgers', label: '🍔 Burgers' },
  { id: 'pizza', label: '🍕 Pizza' },
  { id: 'asian', label: '🍜 Asian & Bowls' },
  { id: 'desserts', label: '🍰 Desserts' },
  { id: 'drinks', label: '🥤 Drinks' },
];

export default function MenuSection() {
  const { filteredItems, activeCategory, setActiveCategory } = useMenuFilter();
  const [customizing, setCustomizing] = useState<FoodItem | null>(null);

  return (
    <section
      id="menu"
      className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20"
    >
      <div className="text-center space-y-3 mb-10">
        <span className="text-brand-500 font-semibold text-sm uppercase tracking-wider">
          Handcrafted Menu
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Explore Delicious Dishes
        </h2>
        <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
          Selected by master chefs with fresh ingredients, prepared with love and passion.
        </p>
      </div>

      <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto pb-4 no-scrollbar mb-8">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={
                isActive
                  ? 'bg-brand-500 text-white font-semibold px-5 py-2.5 rounded-full text-sm whitespace-nowrap transition-all shadow-glow'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white font-semibold px-5 py-2.5 rounded-full text-sm whitespace-nowrap transition-all border border-gray-700/50'
              }
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <FoodCard key={item.id} item={item} onCustomize={setCustomizing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 space-y-4">
          <UtensilsCrossed className="w-16 h-16 mx-auto text-gray-600" />
          <h3 className="text-xl font-bold text-gray-300">No dishes found</h3>
          <p className="text-gray-500 text-sm">
            Try searching for something else or switch category.
          </p>
        </div>
      )}

      <CustomizeModal
        key={customizing?.id ?? 'none'}
        item={customizing}
        onClose={() => setCustomizing(null)}
      />
    </section>
  );
}