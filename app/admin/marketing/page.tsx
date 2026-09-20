import { connectDB } from '@/utils/database';
import Subscriber from '@/models/subscriber';
import MarketingClient from '@/components/admin/marketingclient';

export default async function AdminMarketingPage() {
  await connectDB();

  const subscribers = await Subscriber.find().sort({ subscribedAt: -1 }).lean();

  return <MarketingClient initialSubscribers={JSON.parse(JSON.stringify(subscribers))} />;
}