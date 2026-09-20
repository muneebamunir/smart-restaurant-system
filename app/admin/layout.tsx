import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
// import { jwtVerify } from 'jose';
import AdminTopbar from '@/components/admin/admintopbar';
import AdminSidebar from '@/components/admin/adminsidebar';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export default async function AdminLayout({ children }: { children: ReactNode }) {
  /* ── Auth gate — only staff with role admin/chef/waiter ── */
  // const token = (await cookies()).get('tc_staff')?.value;
  // if (!token) redirect('/login');

  // let payload: { sub: string; role: string; name: string; email: string };
  // try {
  //   const verified = await jwtVerify(token, secret);
  //   payload = verified.payload as typeof payload;
  // } catch {
  //   redirect('/login');
  // }

  return (
    <div className="bg-brand-dark text-gray-100 font-sans antialiased min-h-screen flex flex-col">
      <AdminTopbar name={"Admin"} email={"admin@example.com"} />
      <div className="pt-16 flex flex-1 min-h-[calc(100vh-4rem)]">
        <AdminSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}