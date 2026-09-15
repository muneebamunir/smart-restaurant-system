// types/index.ts
export type Category = 'burgers' | 'pizza' | 'asian' | 'desserts' | 'drinks';

export interface FoodItem {
  id: string;
  title: string;
  category: Category;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  badge: string;
  badgeColor: string;
  description: string;
  image: string;
}

export interface CartItem extends FoodItem {
  qty: number;
  note?: string;
}