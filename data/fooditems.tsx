// data/foodItems.ts
import type { FoodItem } from '@/types';

export const foodItems: FoodItem[] = [
  {
    id: '1',
    title: 'Smokey BBQ Artisan Burger',
    category: 'burgers',
    price: 14.99,
    oldPrice: 17.99,
    rating: 4.9,
    reviews: 240,
    badge: 'Bestseller',
    badgeColor: 'bg-amber-500',
    description:
      'Double Wagyu beef patty, aged cheddar, crispy onion rings, and signature smokey BBQ sauce on a toasted brioche bun.',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '2',
    title: 'Truffle Mushroom Pizza',
    category: 'pizza',
    price: 18.5,
    oldPrice: 21.0,
    rating: 4.8,
    reviews: 185,
    badge: 'Chef Choice',
    badgeColor: 'bg-brand-500',
    description:
      'Wood-fired sourdough pizza topped with black truffle cream, wild mushrooms, fresh mozzarella, and micro basil.',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '3',
    title: 'Spicy Tonkotsu Ramen',
    category: 'asian',
    price: 15.99,
    rating: 4.9,
    reviews: 310,
    badge: 'Spicy 🔥',
    badgeColor: 'bg-red-500',
    description:
      'Rich pork bone broth, tender chashu pork belly, ajitama ramen egg, bamboo shoots, and house chilli oil.',
    image:
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '4',
    title: 'Avocado Salmon Poke Bowl',
    category: 'asian',
    price: 16.5,
    rating: 4.7,
    reviews: 142,
    badge: 'Healthy',
    badgeColor: 'bg-emerald-500',
    description:
      'Fresh sashimi grade salmon, ripe avocado, edamame, pickled ginger, cucumber, and spicy mayo over sushi rice.',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '5',
    title: 'Quattro Formaggi Pizza',
    category: 'pizza',
    price: 17.0,
    rating: 4.6,
    reviews: 98,
    badge: 'Vegetarian',
    badgeColor: 'bg-emerald-600',
    description:
      'Blend of Gorgonzola, Mozzarella, Parmesan, and Fontina cheese with a touch of wildflower honey drizzle.',
    image:
      'https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '6',
    title: 'Double Bacon Crunch Burger',
    category: 'burgers',
    price: 15.49,
    oldPrice: 18.0,
    rating: 4.8,
    reviews: 215,
    badge: 'Popular',
    badgeColor: 'bg-amber-500',
    description:
      'Crispy maple bacon, double smashed beef patties, pickles, special secret sauce, and melted American cheese.',
    image:
      'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '7',
    title: 'Matcha Lava Cake & Gelato',
    category: 'desserts',
    price: 9.5,
    rating: 4.9,
    reviews: 178,
    badge: 'Sweet Hit',
    badgeColor: 'bg-purple-500',
    description:
      'Warm ceremonial matcha chocolate cake with molten center, served alongside vanilla bean artisan gelato.',
    image:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '8',
    title: 'Craft Passionfruit Mocktail',
    category: 'drinks',
    price: 6.5,
    rating: 4.8,
    reviews: 88,
    badge: 'Refreshing',
    badgeColor: 'bg-blue-500',
    description:
      'Fresh passionfruit pulp, lime juice, mint leaves, sparkling soda, and a hint of agave nectar.',
    image:
      'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
  },
];