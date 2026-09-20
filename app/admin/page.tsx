import { connectDB } from '@/utils/database';
import Item from '@/models/item';
import Offer from '@/models/offer';
import Subscriber from '@/models/subscriber';
import Table from '@/models/table';
import Review from '@/models/review';
import StatCard from '@/components/admin/statcard';

export default async function AdminOverviewPage() {
  await connectDB();

  const [itemCount, offerCount, subscriberCount, occupiedTables, totalTables, recentReviews] =
    await Promise.all([
      Item.countDocuments(),
      Offer.countDocuments({ active: true }),
      Subscriber.countDocuments({ status: 'active' }),
      Table.countDocuments({ status: 'occupied' }),
      Table.countDocuments({ status: { $ne: 'inactive' } }),
      Review.find().sort({ _id: -1 }).limit(3).populate('order').lean(),
    ]);

  const occupancy = totalTables > 0 ? Math.round((occupiedTables / totalTables) * 100) : 0;

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Dashboard Overview</h1>
        <p className="text-xs text-gray-400">
          Real-time stats and metrics across TasteCraft system.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Menu Items"  value={itemCount}        hint="Active in store catalog" tone="brand"   />
        <StatCard label="Active Coupons"    value={offerCount}       hint="Promotions running"      tone="amber"   />
        <StatCard label="Subscribers"       value={subscriberCount}  hint="Ready for newsletter"    tone="blue"    />
        <StatCard
          label="Table Occupancy"
          value={`${occupiedTables} / ${totalTables}`}
          hint={`${occupancy}% Occupied`}
          tone="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5 rounded-2xl border border-brand-border space-y-4">
          <h3 className="text-sm font-bold text-white">Recent Reviews</h3>
          <div className="space-y-3">
            {recentReviews.map((r) => (
              <div key={String(r._id)} className="p-3 bg-gray-900/60 rounded-xl border border-brand-border text-xs">
                <p className="font-bold text-white">{r.reviewerName}</p>
                <p className="text-gray-400 text-[11px] line-clamp-1">
                  {r.comment ?? 'Great service!'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}