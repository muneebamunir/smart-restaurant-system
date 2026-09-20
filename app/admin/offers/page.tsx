import { connectDB } from '@/utils/database';
import Offer from '@/models/offer';
import OffersClient from '@/components/admin/offersclient';

export default async function AdminOffersPage() {
  await connectDB();

  const offers = await Offer.find().sort({ coupon: 1 }).lean();

  return <OffersClient initialOffers={JSON.parse(JSON.stringify(offers))} />;
}