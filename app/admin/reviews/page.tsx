import { connectDB } from '@/utils/database';
import Review from '@/models/review';
import ReviewsClient from '@/components/admin/reviewsclient';

export default async function AdminReviewsPage() {
  await connectDB();

  const reviews = await Review.find()
    .populate({
      path: 'order',
      select: 'orderNumber orderType customer.name table',
    })
    .populate({
      path: 'ratings.item',
      select: 'name image_url',
    })
    .sort({ _id: -1 })
    .lean();

  return (
    <ReviewsClient initialReviews={JSON.parse(JSON.stringify(reviews))} />
  );
}