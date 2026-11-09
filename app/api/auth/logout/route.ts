import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('tc_staff');
    cookieStore.delete('session');

    return NextResponse.json({ success: true, message: 'Logged out successfully.' });
  } catch (e) {
    console.error('[POST /api/auth/logout]', e);
    return NextResponse.json({ success: true, message: 'Logged out.' });
  }
}
