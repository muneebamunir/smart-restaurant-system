import { connectDB } from '@/utils/database';
import Item from '@/models/item';
import Category from '@/models/category';
import ItemsClient from '@/components/admin/itemsclient';

export default async function AdminItemsPage() {
  await connectDB();

  const [items, categories] = await Promise.all([
    Item.find().populate('category').sort({ name: 1 }).lean(),
    Category.find().sort({ name: 1 }).lean(),
  ]);

  /* Serialize ObjectIds and Dates to plain strings for the client boundary */
  const plainItems = JSON.parse(JSON.stringify(items));
  const plainCategories = JSON.parse(JSON.stringify(categories));

  return <ItemsClient initialItems={plainItems} categories={plainCategories} />;
}