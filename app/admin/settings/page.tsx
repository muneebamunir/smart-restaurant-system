import { connectDB } from '@/utils/database';
import Settings from '@/models/settings';
import SettingsClient from '@/components/admin/settingsclient';

export default async function AdminSettingsPage() {
  await connectDB();

  const settings = await Settings.get();

  return <SettingsClient initialSettings={JSON.parse(JSON.stringify(settings))} />;
}