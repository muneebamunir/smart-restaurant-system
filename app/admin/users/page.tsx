import { connectDB } from '@/utils/database';
import User from '@/models/user';
import UsersClient from '@/components/admin/usersclient';

export default async function AdminUsersPage() {
  await connectDB();

  /* Exclude the password hash */
  const users = await User.find().select('-password.secret').sort({ name: 1 }).lean();

  return <UsersClient initialUsers={JSON.parse(JSON.stringify(users))} />;
}