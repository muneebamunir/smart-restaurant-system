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

// types/index.ts
export type OrderStatus = 'preparing' | 'on-the-way' | 'delivered';

export interface OrderCustomer {
  name: string;
  address: string;
  phone: string;
  paymentMethod: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  delivery: number;
  discountAmount: number;
  total: number;
  promoCode?: string;
  customer: OrderCustomer;
  createdAt: number;       // epoch ms
  estimatedArrival: number; // epoch ms
}

/** Status is always derived from time, never stored — see OrderContext. */
export function deriveOrderStatus(order: Order): OrderStatus {
  const elapsed = Date.now() - order.createdAt;
  const ETA = order.estimatedArrival - order.createdAt;
  if (elapsed >= ETA) return 'delivered';
  if (elapsed >= ETA * 0.2) return 'on-the-way';
  return 'preparing';
}