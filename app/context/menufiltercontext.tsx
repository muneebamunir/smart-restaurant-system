'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { foodItems } from '../data/fooditems';
import type { Category, FoodItem } from '../types';

export type CategoryFilter = Category | 'all';

interface MenuFilterValue {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeCategory: CategoryFilter;
  setActiveCategory: (c: CategoryFilter) => void;
  filteredItems: FoodItem[];
}

const MenuFilterContext = createContext<MenuFilterValue | undefined>(undefined);

export function MenuFilterProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  const filteredItems = useMemo(() => {
    const term = searchQuery.toLowerCase().trim();
    return foodItems.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch =
        !term ||
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <MenuFilterContext.Provider
      value={{ searchQuery, setSearchQuery, activeCategory, setActiveCategory, filteredItems }}
    >
      {children}
    </MenuFilterContext.Provider>
  );
}

export function useMenuFilter() {
  const ctx = useContext(MenuFilterContext);
  if (!ctx) throw new Error('useMenuFilter must be used within a MenuFilterProvider');
  return ctx;
}