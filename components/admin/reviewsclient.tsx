'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import {
  Star,
  Search,
  MessageSquareQuote,
  TrendingUp,
  Package,
  Utensils,
} from 'lucide-react';

/* ──────────────────────────────────────────────────────────
   Small helpers
   ────────────────────────────────────────────────────────── */

function avgRating(ratings: any[]): number {
  if (!ratings?.length) return 0;
  return ratings.reduce((a, r) => a + (r.rating ?? 0), 0) / ratings.length;
}

function fmtDate(d: string | Date | undefined | null): string {
  if (!d) return '';
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return '';
  return dt.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════ */

export default function ReviewsClient({ initialReviews }: any) {
  const [search, setSearch] = useState('');
  const [minRating, setMinRating] = useState<number>(0);

  /* ── Aggregate stats ────────────────────────────────── */
  const stats = useMemo(() => {
    if (!initialReviews.length) {
      return { total: 0, avg: 0, fiveStar: 0, withComments: 0 };
    }

    let sum = 0;
    let count = 0;
    let fiveStar = 0;
    let withComments = 0;

    for (const rev of initialReviews) {
      const a = avgRating(rev.ratings ?? []);
      sum += a;
      count += 1;
      if (a >= 4.5) fiveStar += 1;
      if (rev.comment || rev.ratings?.some((r: any) => r.comment)) {
        withComments += 1;
      }
    }

    return {
      total: count,
      avg: count ? sum / count : 0,
      fiveStar,
      withComments,
    };
  }, [initialReviews]);

  /* ── Filter ─────────────────────────────────────────── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return initialReviews.filter((rev: any) => {
      const a = avgRating(rev.ratings ?? []);
      if (minRating > 0 && a < minRating) return false;

      if (!q) return true;

      const orderNumber = rev.order?.orderNumber ?? '';
      const customerName = rev.order?.customer?.name ?? '';
      const haystack = [
        rev.reviewerName ?? '',
        rev.comment ?? '',
        orderNumber,
        customerName,
        ...(rev.ratings ?? []).map(
          (r: any) => `${r.item?.name ?? ''} ${r.comment ?? ''}`
        ),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [initialReviews, search, minRating]);

  return (
    <section className="space-y-6">
      {/* ── Header ─────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-extrabold text-white">Customer Reviews</h1>
        <p className="text-xs text-gray-400">
          Read-only view of customer ratings and feedback per order.
        </p>
      </div>

      {/* ── Stats cards ────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<MessageSquareQuote className="w-4 h-4 text-brand-500" />}
          label="Total Reviews"
          value={stats.total}
          hint="All customer feedback"
        />
        <StatCard
          icon={<Star className="w-4 h-4 text-amber-400" />}
          label="Average Rating"
          value={stats.avg.toFixed(1)}
          hint={`out of 5.0`}
        />
        <StatCard
          icon={<TrendingUp className="w-4 h-4 text-emerald-400" />}
          label="5-Star Reviews"
          value={stats.fiveStar}
          hint={
            stats.total
              ? `${Math.round((stats.fiveStar / stats.total) * 100)}% of total`
              : '0% of total'
          }
        />
        <StatCard
          icon={<Package className="w-4 h-4 text-blue-400" />}
          label="With Comments"
          value={stats.withComments}
          hint="Have written feedback"
        />
      </div>

      {/* ── Filters ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by reviewer, order, dish, or comment…"
            className="w-full bg-gray-900 border border-brand-border rounded-xl pl-9 pr-4 py-2 text-xs text-gray-200 focus:outline-none focus:border-brand-500"
          />
        </div>

        <select
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
          className="bg-gray-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-brand-500"
        >
          <option value={0}>All ratings</option>
          <option value={3}>3★ and up</option>
          <option value={4}>4★ and up</option>
          <option value={4.5}>5★ only</option>
        </select>
      </div>

      {/* ── List ───────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="glass-card rounded-2xl border border-brand-border p-12 text-center">
          <MessageSquareQuote className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-400">
            {initialReviews.length === 0
              ? 'No reviews yet.'
              : 'No reviews match your filters.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((rev: any) => (
            <ReviewCard key={rev._id} review={rev} />
          ))}
        </div>
      )}
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   Review card
   ══════════════════════════════════════════════════════════ */

function ReviewCard({ review }: { review: any }) {
  const avg = avgRating(review.ratings ?? []);
  const date = review.createdAt ?? review.updatedAt;
  const orderRef = review.order?.orderNumber ?? '—';
  const orderType = review.order?.orderType ?? null;
  const customerName = review.order?.customer?.name;

  return (
    <div className="glass-card p-5 rounded-2xl border border-brand-border space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-brand-border pb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-white text-sm">
              {review.reviewerName}
            </p>
            {orderType && (
              <span
                className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                  orderType === 'dining'
                    ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                    : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                }`}
              >
                {orderType}
              </span>
            )}
          </div>
          <p className="text-[10px] text-gray-500 font-mono mt-0.5">
            Order {orderRef}
            {customerName ? ` • ${customerName}` : ''}
            {date ? ` • ${fmtDate(date)}` : ''}
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 shrink-0">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-amber-400 font-bold text-xs">
            {avg.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Overall comment */}
      {review.comment && (
        <p className="text-xs text-gray-300 italic leading-relaxed">
          &ldquo;{review.comment}&rdquo;
        </p>
      )}

      {/* Per-item breakdown */}
      {review.ratings?.length > 0 && (
        <div className="space-y-2 pt-1">
          <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
            <Utensils className="w-3 h-3" />
            Dish Breakdown
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {review.ratings.map((r: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-gray-900/60 p-2 rounded-xl border border-brand-border"
              >
                {r.item?.image_url ? (
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-brand-border shrink-0">
                    <Image
                      src={r.item.image_url}
                      alt={r.item.name ?? 'Item'}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-gray-800 border border-brand-border flex items-center justify-center shrink-0">
                    <Utensils className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-gray-200 truncate">
                    {r.item?.name ?? 'Deleted item'}
                  </p>
                  {r.comment && (
                    <p className="text-[10px] text-gray-500 italic truncate">
                      {r.comment}
                    </p>
                  )}
                </div>

                <StarRow value={r.rating} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   UI atoms
   ══════════════════════════════════════════════════════════ */

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  hint: string;
}) {
  return (
    <div className="glass-card p-4 rounded-2xl border border-brand-border space-y-2">
      <div className="flex items-center justify-between text-gray-400">
        <span className="text-xs font-semibold">{label}</span>
        {icon}
      </div>
      <p className="text-2xl font-extrabold text-white">{value}</p>
      <p className="text-[10px] text-gray-400">{hint}</p>
    </div>
  );
}

function StarRow({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5 shrink-0">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`w-3 h-3 ${
            n <= value
              ? 'fill-amber-400 text-amber-400'
              : 'text-gray-700'
          }`}
        />
      ))}
    </div>
  );
}