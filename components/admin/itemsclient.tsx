'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Search, Edit3, Trash2, X } from 'lucide-react';
import { useToast } from '@/context/toastcontext';

const BLANK_VARIANT = { name: 'Regular', price: 10, inStock: true, isDefault: true };

export default function ItemsClient({ initialItems, categories }: any) {
  const { showToast } = useToast();
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = items.filter(
    (i: any) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      (i.description ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const handleSaved = (saved: any) => {
    setItems((prev: any[]) =>
      prev.some((i) => i._id === saved._id)
        ? prev.map((i) => (i._id === saved._id ? saved : i))
        : [...prev, saved]
    );
    setModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this food item?')) return;
    const res = await fetch(`/api/items/${id}`, { method: 'DELETE' });
    if (!res.ok) return showToast('Failed to delete item.');
    setItems((prev: any[]) => prev.filter((i) => i._id !== id));
    showToast('Item removed.');
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Food Items Management</h1>
          <p className="text-xs text-gray-400">
            Manage dishes, pricing variants, stock, and discounts.
          </p>
        </div>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-4 py-2.5 rounded-xl shadow-glow text-xs flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Item</span>
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search item name or description..."
          className="w-full bg-gray-900 border border-brand-border rounded-xl pl-9 pr-4 py-2 text-xs text-gray-200 focus:outline-none focus:border-brand-500"
        />
      </div>

      {/* ────── TABLE ────── */}
      {filtered.length === 0 ? (
        <div className="glass-card rounded-2xl border border-brand-border p-12 text-center">
          <p className="text-sm text-gray-400">No items found.</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-brand-border overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-gray-900/80 text-gray-400 uppercase tracking-wider text-[10px] border-b border-brand-border">
              <tr>
                <th className="p-4">Dish</th>
                <th className="p-4">Category</th>
                <th className="p-4">Variants</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {filtered.map((item: any) => (
                <tr key={item._id} className="hover:bg-gray-900/40 transition">
                  <td className="p-4 flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-brand-border shrink-0">
                      <Image src={item.image_url} alt={item.name} fill sizes="40px" className="object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-white">{item.name}</p>
                      {item.badge && (
                        <span className={`inline-block ${item.badgeColor} text-[9px] font-bold px-2 py-0.5 rounded text-white mt-0.5`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-gray-300">{item.category?.name ?? '—'}</td>
                  <td className="p-4">
                    <div className="space-y-1">
                      {item.variants.map((v: any, i: number) => (
                        <div key={i} className="text-[11px] flex items-center gap-1.5">
                          <span className="text-gray-400">{v.name}:</span>
                          <span className="font-bold text-white">${v.price.toFixed(2)}</span>
                          {v.isDefault && (
                            <span className="text-[9px] bg-brand-500/20 text-brand-400 px-1 rounded">Default</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-amber-400 font-bold">{item.discountPercent ?? 0}%</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                      item.inStock ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {item.inStock ? 'In Stock' : 'Out'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => { setEditing(item); setModalOpen(true); }}
                      className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item._id)}
                      className="p-1.5 text-red-400 hover:text-red-300 rounded-lg hover:bg-gray-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ────── MODAL ────── */}
      <ItemModal
        open={modalOpen}
        item={editing}
        categories={categories}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   MODAL — local to this file
   ══════════════════════════════════════════════════════════ */

function ItemModal({ open, item, categories, onClose, onSaved }: any) {
  const { showToast } = useToast();
  const [variants, setVariants] = useState<any[]>([BLANK_VARIANT]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setVariants(item?.variants?.length ? item.variants : [BLANK_VARIANT]);
  }, [open, item]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const fd = new FormData(e.currentTarget);
    const body = {
      name: fd.get('name'),
      category: fd.get('category'),
      image_url: fd.get('image_url'),
      description: fd.get('description'),
      discountPercent: Number(fd.get('discountPercent')) || 0,
      badge: fd.get('badge') || '',
      badgeColor: fd.get('badgeColor'),
      inStock: fd.get('inStock') === 'on',
      variants,
    };

    const url = item ? `/api/items/${item._id}` : '/api/items';
    const method = item ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return showToast(data.error ?? 'Failed to save item.');
    }

    const saved = await res.json();
    showToast(item ? 'Item updated.' : 'Item created.');
    onSaved(saved);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-modal border border-brand-border rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white">{item ? 'Edit Food Item' : 'Add Food Item'}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Dish Name</label>
              <input name="name" defaultValue={item?.name ?? ''} required maxLength={120}
                className="w-full bg-gray-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Category</label>
              <select name="category" defaultValue={item?.category?._id ?? item?.category ?? ''} required
                className="w-full bg-gray-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500">
                {categories.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Image URL</label>
            <input name="image_url" type="url" defaultValue={item?.image_url ?? ''} required
              className="w-full bg-gray-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500" />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Description</label>
            <textarea name="description" defaultValue={item?.description ?? ''} rows={2} maxLength={500}
              className="w-full bg-gray-900 border border-brand-border rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-500" />
          </div>

          <div className="border border-brand-border rounded-2xl p-4 bg-gray-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-200">Pricing Variants</label>
              <button type="button"
                onClick={() => setVariants((v) => [...v, { name: '', price: 0, inStock: true, isDefault: false }])}
                className="text-[11px] bg-gray-800 hover:bg-gray-700 text-brand-400 px-2.5 py-1 rounded-lg border border-gray-700 font-semibold flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add Variant
              </button>
            </div>
            {variants.map((v, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-gray-900 p-2 rounded-xl border border-brand-border">
                <input value={v.name}
                  onChange={(e) => setVariants((prev) => prev.map((p, i) => i === idx ? { ...p, name: e.target.value } : p))}
                  placeholder="Name (e.g. Small)" className="col-span-4 bg-gray-800 border border-brand-border rounded-lg px-2.5 py-1.5 text-xs text-white" />
                <input type="number" step="0.01" value={v.price}
                  onChange={(e) => setVariants((prev) => prev.map((p, i) => i === idx ? { ...p, price: Number(e.target.value) } : p))}
                  placeholder="Price" className="col-span-3 bg-gray-800 border border-brand-border rounded-lg px-2.5 py-1.5 text-xs text-white" />
                <label className="col-span-3 flex items-center gap-2 text-[10px] text-gray-400 cursor-pointer">
                  <input type="radio" checked={v.isDefault}
                    onChange={() => setVariants((prev) => prev.map((p, i) => ({ ...p, isDefault: i === idx })))} />
                  Default
                </label>
                <button type="button"
                  onClick={() => setVariants((prev) => prev.filter((_, i) => i !== idx))}
                  disabled={variants.length === 1}
                  className="col-span-2 text-red-400 hover:text-red-300 text-xs font-bold text-right disabled:opacity-30">
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Discount %</label>
              <input name="discountPercent" type="number" min="0" max="100" defaultValue={item?.discountPercent ?? 0}
                className="w-full bg-gray-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Badge Text</label>
              <input name="badge" defaultValue={item?.badge ?? ''} placeholder="e.g. Bestseller"
                className="w-full bg-gray-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Badge Color</label>
              <select name="badgeColor" defaultValue={item?.badgeColor ?? 'bg-amber-500'}
                className="w-full bg-gray-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500">
                <option value="bg-amber-500">Amber</option>
                <option value="bg-brand-500">Brand</option>
                <option value="bg-emerald-500">Emerald</option>
                <option value="bg-red-500">Red</option>
                <option value="bg-purple-500">Purple</option>
                <option value="bg-blue-500">Blue</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="inStock" defaultChecked={item?.inStock ?? true}
              className="w-4 h-4 rounded bg-gray-900 border-brand-border text-brand-500" />
            <span className="text-xs text-gray-300 font-semibold">In stock and available for order</span>
          </label>

          <div className="pt-3 border-t border-brand-border flex justify-end gap-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs font-semibold">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="px-6 py-2 rounded-xl bg-brand-500 text-white text-xs font-bold shadow-glow disabled:opacity-50">
              {saving ? 'Saving…' : 'Save Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}