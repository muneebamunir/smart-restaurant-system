import { NextResponse } from 'next/server';
import type { PipelineStage } from 'mongoose';
import { connectDB } from '@/utils/database';
import Category from '@/models/category';
import Item from '@/models/item';

/* ──────────────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────────────── */

function toSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function isDuplicateKeyError(e: unknown): e is { code: number; keyPattern?: Record<string, 1> } {
  return typeof e === 'object' && e !== null && 'code' in e && (e as { code: number }).code === 11000;
}

/* ──────────────────────────────────────────────────────
   GET /api/categories
   Query params (all optional):
     ?page=1          → page number (1-based)
     ?pageSize=50     → items per page (max 200)
     ?withCounts=1    → include itemCount per category (default: true)
     ?q=burg          → case-insensitive name search

   With no params: returns the complete list sorted by name.
   ────────────────────────────────────────────────────── */

export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);

    const q = (url.searchParams.get('q') ?? '').trim();
    const withCounts = url.searchParams.get('withCounts') !== '0';

    /* Build the base filter (search) */
    const filter: Record<string, unknown> = {};
    if (q) {
      // Escape regex metacharacters so "Burgers (spicy)" doesn't blow up
      const safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.name = { $regex: safe, $options: 'i' };
    }

    /* Optional pagination */
    const pageRaw = url.searchParams.get('page');
    const pageSizeRaw = url.searchParams.get('pageSize');

    const isPaginated = pageRaw !== null || pageSizeRaw !== null;
    const page = Math.max(1, Number(pageRaw ?? 1) || 1);
    const pageSize = Math.min(200, Math.max(1, Number(pageSizeRaw ?? 50) || 50));

    /* Build the aggregation so we can attach itemCount in one shot */
    const pipeline: PipelineStage[] = [
      { $match: filter },
      { $sort: { name: 1 } },
    ];

    if (withCounts) {
      pipeline.push(
        {
          $lookup: {
            from: Item.collection.name,   // "items" — resolves automatically
            localField: '_id',
            foreignField: 'category',
            as: 'items',
          },
        },
        {
          $addFields: {
            itemCount: { $size: '$items' },
          },
        },
        { $project: { items: 0 } }        // drop the joined array, keep only count
      );
    }

    /* Total count BEFORE pagination — needed for pagination metadata */
    const totalPipeline: PipelineStage[] = [
      { $match: filter },
      { $count: 'total' },
    ];
    const totalResult = await Category.aggregate(totalPipeline);
    const total = totalResult[0]?.total ?? 0;

    if (isPaginated) {
      pipeline.push(
        { $skip: (page - 1) * pageSize },
        { $limit: pageSize }
      );
    }

    const categories = await Category.aggregate(pipeline);

    return NextResponse.json({
      count: categories.length,
      total,
      ...(isPaginated && {
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      }),
      data: categories,
    });
  } catch (e) {
    console.error('[GET /api/categories]', e);
    return NextResponse.json({ error: 'Failed to fetch categories.' }, { status: 500 });
  }
}