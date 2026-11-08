import { getOrders } from '@/data/orders';
import OrderBoardClient from '@/components/order/orderboardclient';

export const dynamic = 'force-dynamic';

export default function OrderPage() {
  /* Dummy menu + tables for the New Order modal */
  const menu = [
    { _id: '1', name: 'Smokey BBQ Artisan Burger', variants: [{ name: 'Single Wagyu', price: 12.99 }, { name: 'Double Wagyu', price: 14.99 }] },
    { _id: '2', name: 'Truffle Mushroom Pizza',    variants: [{ name: 'Medium 12"', price: 16 },   { name: 'Large 16"', price: 21 }] },
    { _id: '3', name: 'Spicy Tonkotsu Ramen',      variants: [{ name: 'Standard Bowl', price: 15.99 }, { name: 'Extra Pork Chashu', price: 17.99 }] },
    { _id: '4', name: 'Avocado Salmon Poke Bowl',  variants: [{ name: 'Regular Bowl', price: 16.5 }, { name: 'Super Protein', price: 18.5 }] },
    { _id: '5', name: 'Quattro Formaggi Pizza',    variants: [{ name: 'Medium 12"', price: 17 },   { name: 'Large 16"', price: 22 }] },
    { _id: '6', name: 'Matcha Lava Cake',          variants: [{ name: 'Single Serve', price: 9.5 }, { name: 'With Gelato', price: 11 }] },
  ];

  const tables = [
    { _id: 'tbl_01', table_id: 'T-01', location: 'Main Hall', capacity: 2 },
    { _id: 'tbl_02', table_id: 'T-02', location: 'Main Hall', capacity: 4 },
    { _id: 'tbl_04', table_id: 'T-04', location: 'Main Hall', capacity: 4 },
    { _id: 'tbl_12', table_id: 'P-12', location: 'Outdoor',   capacity: 6 },
    { _id: 'tbl_vip1', table_id: 'VIP-1', location: 'VIP Suite', capacity: 8 },
  ];

  const staff = {
    sub: 'demo_staff',
    role: 'admin' as const,
    name: 'Alexander Chef',
    email: 'alex@tastecraft.com',
  };

  return (
    <OrderBoardClient
      initialOrders={getOrders()}
      menu={menu}
      tables={tables}
      staff={staff}
    />
  );
}