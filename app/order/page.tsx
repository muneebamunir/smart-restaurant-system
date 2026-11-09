import { getOrders } from '@/data/orders';
import OrderBoardClient from '@/components/order/orderboardclient';

export const dynamic = 'force-dynamic';

export default function OrderPage() {
  /* Complete menu with categories and variations for the New Order modal */
  const menu = [
    {
      _id: '1',
      name: 'Smokey BBQ Artisan Burger',
      category: 'Burgers',
      variants: [
        { name: 'Single Wagyu', price: 12.99 },
        { name: 'Double Wagyu', price: 14.99 },
        { name: 'Triple Wagyu Deluxe', price: 17.99 },
      ],
    },
    {
      _id: '2',
      name: 'Truffle Mushroom Pizza',
      category: 'Pizza',
      variants: [
        { name: 'Medium 12"', price: 16.0 },
        { name: 'Large 16"', price: 21.0 },
      ],
    },
    {
      _id: '3',
      name: 'Spicy Tonkotsu Ramen',
      category: 'Asian',
      variants: [
        { name: 'Standard Bowl', price: 15.99 },
        { name: 'Extra Pork Chashu', price: 17.99 },
        { name: 'Double Noodle & Egg', price: 19.99 },
      ],
    },
    {
      _id: '4',
      name: 'Avocado Salmon Poke Bowl',
      category: 'Asian',
      variants: [
        { name: 'Regular Bowl', price: 16.5 },
        { name: 'Super Protein', price: 18.5 },
      ],
    },
    {
      _id: '5',
      name: 'Quattro Formaggi Pizza',
      category: 'Pizza',
      variants: [
        { name: 'Medium 12"', price: 17.0 },
        { name: 'Large 16"', price: 22.0 },
      ],
    },
    {
      _id: '6',
      name: 'Double Bacon Crunch Burger',
      category: 'Burgers',
      variants: [
        { name: 'Single Patty', price: 13.49 },
        { name: 'Double Patty', price: 15.49 },
      ],
    },
    {
      _id: '7',
      name: 'Matcha Lava Cake',
      category: 'Desserts',
      variants: [
        { name: 'Single Serve', price: 9.5 },
        { name: 'With Gelato', price: 11.0 },
      ],
    },
    {
      _id: '8',
      name: 'Craft Passionfruit Mocktail',
      category: 'Drinks',
      variants: [
        { name: 'Regular (16oz)', price: 6.5 },
        { name: 'Large (24oz)', price: 8.5 },
      ],
    },
  ];

  const tables = [
    { _id: 'tbl_01', table_id: 'T-01', location: 'Main Hall', capacity: 2 },
    { _id: 'tbl_02', table_id: 'T-02', location: 'Main Hall', capacity: 4 },
    { _id: 'tbl_04', table_id: 'T-04', location: 'Main Hall', capacity: 4 },
    { _id: 'tbl_12', table_id: 'P-12', location: 'Outdoor', capacity: 6 },
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
