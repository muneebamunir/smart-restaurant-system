'use client';

import { useState } from 'react';
import { Plus, Edit3, Trash2, X } from 'lucide-react';
import { useToast } from '@/context/toastcontext';

function fmtDate(d: string | Date | null | undefined) {
  if (!d) return 'Forever (no expiry)';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function toDateInput(v: any): string {
  if (!v) return '';
  const d = new Date(v);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
}

export default function OffersClient({ initialOffers }: any) {
  const { showToast } = useToast();
  const [offers, setOffers] = useState(initialOffers);
  const [editing, setEditing] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSaved = (saved: any) => {
    setOffers((prev: any[]) =>
      prev.some((o) => o._id === saved._id)
        ? prev.map((o) => (o._id === saved._id ? saved : o))
        : [...prev, saved]
    );
    setModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    const res = await fetch(`/api/offers/${id}`, { method: 'DELETE' });
    if (!res.ok) return showToast('Failed to delete offer.');
    setOffers((prev: any[]) => prev.filter((o) => o._id !== id));
    showToast('Offer removed.');
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Offers & Coupons</h1>
          <p className="text-xs text-gray-400">
            Create promotional coupons with discount fractions and date validity.
          </p>
        </div>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-4 py-2.5 rounded-xl shadow-glow text-xs flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Offer</span>
        </button>
      </div>

      {/* ────── TABLE ────── */}
      {offers.length === 0 ? (
        <div className="glass-card rounded-2xl border border-brand-border p-12 text-center">
          <p className="text-sm text-gray-400">No coupons configured yet.</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-brand-border overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-gray-900/80 text-gray-400 uppercase tracking-wider text-[10px] border-b border-brand-border">
              <tr>
                <th className="p-4">Coupon</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Start</th>
                <th className="p-4">Expiry</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {offers.map((o: any) => (
                <tr key={o._id} className="hover:bg-gray-900/40 transition">
                  <td className="p-4 font-mono font-bold text-amber-400">{o.coupon}</td>
                  <td className="p-4 font-bold text-white">{(o.discount * 100).toFixed(0)}% OFF</td>
                  <td className="p-4 text-gray-400">{fmtDate(o.start_date)}</td>
                  <td className="p-4 text-gray-400">{fmtDate(o.expire_date)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      o.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {o.active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => { setEditing(o); setModalOpen(true); }}
                      className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(o._id)}
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
      <OfferModal
        open={modalOpen}
        offer={editing}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   MODAL
   ══════════════════════════════════════════════════════════ */

function OfferModal({ open, offer, onClose, onSaved }: any) {
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const fd = new FormData(e.currentTarget);
    const body = {
      coupon: String(fd.get('coupon') ?? '').toUpperCase().trim(),
      discount: Number(fd.get('discount')),
      start_date: fd.get('start_date'),
      expire_date: fd.get('expire_date') || null,
      active: fd.get('active') === 'on',
    };

    const url = offer ? `/api/offers/${offer._id}` : '/api/offers';
    const method = offer ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return showToast(data.error ?? 'Failed to save offer.');
    }

    onSaved(await res.json());
    showToast(offer ? 'Offer updated.' : 'Coupon created.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-modal border border-brand-border rounded-3xl max-w-md w-full p-6 space-y-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white">{offer ? 'Edit Coupon' : 'Add Coupon'}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Coupon Code (3–20 chars)</label>
            <input name="coupon" defaultValue={offer?.coupon ?? ''} required
              pattern="[A-Za-z0-9_\-]{3,20}"
              className="w-full bg-gray-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-brand-500" />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Discount Fraction (0.20 = 20% off)</label>
            <input name="discount" type="number" step="0.01" min="0" max="1"
              defaultValue={offer?.discount ?? 0.2} required
              className="w-full bg-gray-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Start Date</label>
              <input name="start_date" type="date" required
                defaultValue={toDateInput(offer?.start_date ?? new Date())}
                className="w-full bg-gray-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Expiry (empty = forever)</label>
              <input name="expire_date" type="date"
                defaultValue={toDateInput(offer?.expire_date)}
                className="w-full bg-gray-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500" />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="active" defaultChecked={offer?.active ?? true}
              className="w-4 h-4 rounded bg-gray-900 border-brand-border text-brand-500" />
            <span className="text-xs text-gray-300 font-semibold">Offer active immediately</span>
          </label>

          <div className="pt-3 border-t border-brand-border flex justify-end gap-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs font-semibold">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="px-6 py-2 rounded-xl bg-brand-500 text-white text-xs font-bold shadow-glow disabled:opacity-50">
              {saving ? 'Saving…' : 'Save Offer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}