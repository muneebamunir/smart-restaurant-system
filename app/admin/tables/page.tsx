import { connectDB } from '@/utils/database';
import Table from '@/models/table';
import TablesClient from '@/components/admin/tablesclient';

export default async function AdminTablesPage() {
  await connectDB();

  const tables = await Table.find().sort({ table_id: 1 }).lean();

  return <TablesClient initialTables={JSON.parse(JSON.stringify(tables))} />;
}