import { NextResponse } from 'next/server';
import { connectDB } from '@/utils/database';
import Subscriber from '@/models/subscriber';

export async function POST(req: Request) {
  await connectDB();
  const { email, source } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
  }

  const normalized = String(email).trim();

  const subscriber = await Subscriber.findOneAndUpdate(
    { email: normalized },
    {
      $set: { status: 'active', unsubscribedAt: null },
      $setOnInsert: {
        email: normalized,
        source,
        subscribedAt: new Date(),
      },
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );

  return NextResponse.json(
    { ok: true, email: subscriber.email },
    { status: 201 }
  );
}