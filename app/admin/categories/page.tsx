import { connectDB } from '@/utils/database';
import Category from '@/models/category';
import Item from '@/models/item';
import CategoriesClient from '@/components/admin/categoriesclient';

export default async function AdminCategoriesPage() {
  await connectDB();

  /* Attach itemCount to each category in one aggregation pass */
  const categories = await Category.aggregate([
    { $sort: { name: 1 } },
    {
      $lookup: {
        from: Item.collection.name,
        localField: '_id',
        foreignField: 'category',
        as: 'items',
      },
    },
    {
      $addFields: {
        itemCount: { $size: '$items' },
      },
    },
    { $project: { items: 0 } },
  ]);

  return (
    <CategoriesClient initialCategories={JSON.parse(JSON.stringify(categories))} />
  );
}