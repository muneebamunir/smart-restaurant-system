import { NextResponse } from 'next/server';
import { connectDB } from '@/utils/database';
import Category from '@/models/category';
import Item from '@/models/item';

type RouteContext = { params: Promise<{ id: string }> };

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
   GET /api/categories/:id
   ────────────────────────────────────────────────────── */

export async function GET(_req: Request, { params }: RouteContext) {
  try {
    await connectDB();
    const { id } = await params;

    const category = await Category.findById(id).lean();
    if (!category) {
      return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
    }

    const itemCount = await Item.countDocuments({ category: id });

    return NextResponse.json({ ...category, itemCount });
  } catch (e) {
    console.error('[GET /api/categories/:id]', e);
    return NextResponse.json({ error: 'Failed to fetch category.' }, { status: 500 });
  }
}

/* ──────────────────────────────────────────────────────
   PUT /api/categories/:id
   body: { name?: string, slug?: string }
   ────────────────────────────────────────────────────── */

export async function PUT(req: Request, { params }: RouteContext) {
  try {
    await connectDB();
    const { id } = await params;

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    const patch: { name?: string; slug?: string } = {};

    if (typeof body.name === 'string') {
      const name = body.name.trim();
      if (!name) return NextResponse.json({ error: 'Name cannot be empty.' }, { status: 400 });
      if (name.length > 60) {
        return NextResponse.json({ error: 'Name must be 60 characters or fewer.' }, { status: 400 });
      }
      patch.name = name;
    }

    if (typeof body.slug === 'string') {
      const slug = toSlug(body.slug);
      if (!slug) return NextResponse.json({ error: 'Invalid slug.' }, { status: 400 });
      patch.slug = slug;
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 });
    }

    const category = await Category.findByIdAndUpdate(id, patch, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (e) {
    if (isDuplicateKeyError(e)) {
      const field = Object.keys(e.keyPattern ?? {})[0] ?? 'field';
      return NextResponse.json(
        { error: `A category with that ${field} already exists.` },
        { status: 409 }
      );
    }
    console.error('[PUT /api/categories/:id]', e);
    return NextResponse.json({ error: 'Failed to update category.' }, { status: 500 });
  }
}

/* ──────────────────────────────────────────────────────
   DELETE /api/categories/:id?cascade=true|false

   - `cascade` is REQUIRED. Omitting it → 400.
   - cascade=false + items exist → 409 Conflict with itemCount
     so the frontend can prompt the user.
   - cascade=true → items are deleted, then the category.
   ────────────────────────────────────────────────────── */

export async function DELETE(req: Request, { params }: RouteContext) {
  try {
    await connectDB();
    const { id } = await params;

    /* 1. Require the cascade flag */
    const url = new URL(req.url);
    const cascadeRaw = url.searchParams.get('cascade');

    if (cascadeRaw === null) {
      return NextResponse.json(
        {
          error: 'The `cascade` query parameter is required.',
          hint: 'Pass ?cascade=true to delete all items in this category, or ?cascade=false to abort when items exist.',
        },
        { status: 400 }
      );
    }

    if (cascadeRaw !== 'true' && cascadeRaw !== 'false') {
      return NextResponse.json(
        { error: '`cascade` must be either "true" or "false".' },
        { status: 400 }
      );
    }

    const cascade = cascadeRaw === 'true';

    /* 2. Ensure the category exists */
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
    }

    /* 3. Count items */
    const itemCount = await Item.countDocuments({ category: id });

    /* 4. If items exist and cascade is false → 409 with count */
    if (itemCount > 0 && !cascade) {
      return NextResponse.json(
        {
          error: 'Category contains items.',
          itemCount,
          message: `This category has ${itemCount} item(s). Re-send with ?cascade=true to delete them, or move them to another category first.`,
        },
        { status: 409 }
      );
    }

    /* 5. Delete items if cascading */
    let deletedItems = 0;
    if (cascade && itemCount > 0) {
      const result = await Item.deleteMany({ category: id });
      deletedItems = result.deletedCount ?? 0;
    }

    /* 6. Delete the category */
    await Category.findByIdAndDelete(id);

    return NextResponse.json({
      ok: true,
      deletedCategory: { id: category._id, name: category.name },
      deletedItems,
    });
  } catch (e) {
    console.error('[DELETE /api/categories/:id]', e);
    return NextResponse.json({ error: 'Failed to delete category.' }, { status: 500 });
  }
}