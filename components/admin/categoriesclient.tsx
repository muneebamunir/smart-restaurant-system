'use client';

import { useState } from 'react';
import { Plus, Edit3, Trash2, X, AlertTriangle, Tags } from 'lucide-react';
import { useToast } from '@/context/toastcontext';

/* ──────────────────────────────────────────────────────────
   Slug helper — mirrors the server-side version
   ────────────────────────────────────────────────────────── */
function toSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════ */

export default function CategoriesClient({ initialCategories }: any) {
  const { showToast } = useToast();
  const [categories, setCategories] = useState(initialCategories);
  const [editing, setEditing] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  /* Cascade-delete prompt state */
  const [confirmDelete, setConfirmDelete] = useState<{
    id: string;
    name: string;
    itemCount: number;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  /* ── Save (create or update) ───────────────────────── */
  const handleSaved = (saved: any) => {
    setCategories((prev: any[]) =>
      prev.some((c) => c._id === saved._id)
        ? prev.map((c) => (c._id === saved._id ? { ...c, ...saved } : c))
        : [...prev, { ...saved, itemCount: 0 }].sort((a, b) =>
            a.name.localeCompare(b.name)
          )
    );
    setModalOpen(false);
  };

  /* ── Delete step 1: ask the server if it's safe ───── */
  const handleDeleteClick = async (cat: any) => {
    /* Fast path: client already knows there are no items */
    if (cat.itemCount === 0) {
      if (!confirm(`Delete category "${cat.name}"?`)) return;
      await performDelete(cat._id, cat.name, true);
      return;
    }

    /* Server is the source of truth — check for items first */
    const res = await fetch(`/api/categories/${cat._id}?cascade=false`, {
      method: 'DELETE',
    });

    if (res.status === 409) {
      const data = await res.json();
      /* Items exist → prompt the user */
      setConfirmDelete({
        id: cat._id,
        name: cat.name,
        itemCount: data.itemCount ?? cat.itemCount ?? 0,
      });
      return;
    }

    if (res.ok) {
      /* Server said it was empty after all — remove locally */
      setCategories((prev: any[]) => prev.filter((c) => c._id !== cat._id));
      showToast('Category deleted.');
      return;
    }

    const data = await res.json().catch(() => ({}));
    showToast(data.error ?? 'Failed to delete category.');
  };

  /* ── Delete step 2: actually perform with cascade flag ─ */
  const performDelete = async (
    id: string,
    name: string,
    cascade: boolean
  ) => {
    setDeleting(true);

    const res = await fetch(
      `/api/categories/${id}?cascade=${cascade ? 'true' : 'false'}`,
      { method: 'DELETE' }
    );

    setDeleting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return showToast(data.error ?? 'Failed to delete category.');
    }

    const result = await res.json();
    setCategories((prev: any[]) => prev.filter((c) => c._id !== id));
    setConfirmDelete(null);

    if (cascade && result.deletedItems > 0) {
      showToast(`Deleted "${name}" and ${result.deletedItems} item(s).`);
    } else {
      showToast(`Category "${name}" deleted.`);
    }
  };

  return (
    <section className="space-y-6">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">
            Categories Management
          </h1>
          <p className="text-xs text-gray-400">
            Organize food dishes into structured categories and slugs.
          </p>
        </div>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-4 py-2.5 rounded-xl shadow-glow text-xs flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* ── Table ──────────────────────────────────────── */}
      {categories.length === 0 ? (
        <div className="glass-card rounded-2xl border border-brand-border p-12 text-center max-w-3xl">
          <Tags className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-400">No categories yet.</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-brand-border overflow-x-auto max-w-3xl">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-gray-900/80 text-gray-400 uppercase tracking-wider text-[10px] border-b border-brand-border">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Items</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {categories.map((cat: any) => (
                <tr key={cat._id} className="hover:bg-gray-900/40 transition">
                  <td className="p-4 font-bold text-white">{cat.name}</td>
                  <td className="p-4 font-mono text-gray-400">{cat.slug}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        cat.itemCount > 0
                          ? 'bg-brand-500/15 text-brand-400 border border-brand-500/25'
                          : 'bg-gray-800 text-gray-500 border border-gray-700'
                      }`}
                    >
                      {cat.itemCount} {cat.itemCount === 1 ? 'item' : 'items'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => { setEditing(cat); setModalOpen(true); }}
                      className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(cat)}
                      className="p-1.5 text-red-400 hover:text-red-300 rounded-lg hover:bg-gray-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Add/Edit modal ─────────────────────────────── */}
      <CategoryModal
        open={modalOpen}
        category={editing}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />

      {/* ── Cascade-delete confirmation modal ──────────── */}
      <CascadeDeleteModal
        data={confirmDelete}
        deleting={deleting}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() =>
          confirmDelete &&
          performDelete(confirmDelete.id, confirmDelete.name, true)
        }
      />
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   ADD / EDIT MODAL
   ══════════════════════════════════════════════════════════ */

function CategoryModal({ open, category, onClose, onSaved }: any) {
  const { showToast } = useToast();
  const [name, setName] = useState(category?.name ?? '');
  const [slug, setSlug] = useState(category?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);

  /* Reset local form state every time the modal opens */
  useState(() => {
    if (open) {
      setName(category?.name ?? '');
      setSlug(category?.slug ?? '');
      setSlugTouched(!!category?.slug);
    }
  });

  /* Re-sync when `category` changes while open */
  if (open && category && name !== category.name && !slugTouched) {
    setName(category.name);
    setSlug(category.slug);
  }

  if (!open) return null;

  const handleNameChange = (v: string) => {
    setName(v);
    if (!slugTouched) setSlug(toSlug(v));
  };

  const handleSlugChange = (v: string) => {
    setSlugTouched(true);
    setSlug(toSlug(v));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const body = { name: name.trim(), slug: slug.trim() };
    const url = category ? `/api/categories/${category._id}` : '/api/categories';
    const method = category ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return showToast(data.error ?? 'Failed to save category.');
    }

    onSaved(await res.json());
    showToast(category ? 'Category updated.' : 'Category created.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-modal border border-brand-border rounded-3xl max-w-md w-full p-6 space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white">
          {category ? 'Edit Category' : 'Add Category'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Category Name
            </label>
            <input
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              maxLength={60}
              placeholder="e.g. Burgers"
              className="w-full bg-gray-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Slug (URL-safe)
            </label>
            <input
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              required
              placeholder="e.g. burgers"
              className="w-full bg-gray-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-brand-500"
            />
            <p className="text-[10px] text-gray-500 mt-1">
              Used in URLs. Auto-generated from the name unless you edit it.
            </p>
          </div>

          <div className="pt-3 border-t border-brand-border flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-xl bg-brand-500 text-white text-xs font-bold shadow-glow disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CASCADE-DELETE CONFIRMATION MODAL
   ══════════════════════════════════════════════════════════ */

function CascadeDeleteModal({
  data,
  deleting,
  onCancel,
  onConfirm,
}: {
  data: { id: string; name: string; itemCount: number } | null;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-modal border border-brand-border rounded-3xl max-w-sm w-full p-6 space-y-4 relative">
        <div className="w-12 h-12 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-white">
            Delete &ldquo;{data.name}&rdquo;?
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            This category contains{' '}
            <strong className="text-red-400 font-bold">
              {data.itemCount} item{data.itemCount === 1 ? '' : 's'}
            </strong>
            . Deleting the category will also permanently delete{' '}
            {data.itemCount === 1 ? 'that item' : 'those items'} from the menu.
          </p>
          <p className="text-[11px] text-gray-500 pt-1">
            This action cannot be undone.
          </p>
        </div>

        <div className="pt-3 border-t border-brand-border flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs font-semibold disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold disabled:opacity-50"
          >
            {deleting
              ? 'Deleting…'
              : `Delete Category + ${data.itemCount} Item${
                  data.itemCount === 1 ? '' : 's'
                }`}
          </button>
        </div>
      </div>
    </div>
  );
}