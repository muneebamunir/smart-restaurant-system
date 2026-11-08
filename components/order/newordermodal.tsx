'use client';

import { useEffect, useState } from 'react';
import { X, PlusCircle } from 'lucide-react';
import { useToast } from '@/context/toastcontext';

interface Props {
  open: boolean;
  menu: any[];
  tables: any[];
  staff: { sub: string; role: string; name: string; email: string };
  onClose: () => void;
  onCreated: (order: any) => void;
}

interface SelectedItem {
  itemId: string;
  name: string;
  variantName: string;
  price: number;
  qty: number;
}

export default function NewOrderModal({ open, menu, tables, staff, onClose, onCreated }: Props) {
  const { showToast } = useToast();
  const [tableId, setTableId] = useState('');
  const [items, setItems] = useState<SelectedItem[]>([]);
  const [note, setNote] = useState('');
  const [pickerItem, setPickerItem] = useState('');
  const [pickerVariant, setPickerVariant] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTableId(tables[0]?._id ?? '');
    setItems([]);
    setNote('');
    setPickerItem(menu[0]?._id ?? '');
    setPickerVariant(menu[0]?.variants?.[0]?.name ?? '');
    setSaving(false);
  }, [open, menu, tables]);

  if (!open) return null;

  const currentItem = menu.find((m) => m._id === pickerItem);

  const handlePickerItem = (id: string) => {
    setPickerItem(id);
    const it = menu.find((m) => m._id === id);
    setPickerVariant(it?.variants?.[0]?.name ?? '');
  };

  const addToOrder = () => {
    const it = menu.find((m) => m._id === pickerItem);
    if (!it) return;
    const variant = it.variants.find((v: any) => v.name === pickerVariant);
    if (!variant) return;

    const existing = items.findIndex(
      (x) => x.itemId === it._id && x.variantName === variant.name
    );

    if (existing > -1) {
      const next = [...items];
      next[existing].qty += 1;
      setItems(next);
    } else {
      setItems([
        ...items,
        {
          itemId: it._id,
          name: it.name,
          variantName: variant.name,
          price: variant.price,
          qty: 1,
        },
      ]);
    }
  };

  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      showToast('Add at least one dish.');
      return;
    }
    if (!tableId) {
      showToast('Choose a table.');
      return;
    }

    setSaving(true);

    const table = tables.find((t) => t._id === tableId);
    const payload = {
      orderType: 'dining',
      table: tableId,
      customer: { name: `Table ${table?.table_id ?? '—'}` },
      items: items.map((i) => ({
        item: i.itemId,
        name: i.name,
        price: i.price,
        qty: i.qty,
        note: i.variantName ? `Variant: ${i.variantName}` : undefined,
      })),
      paymentMethod: 'cash',
      placedByStaff: true,          // signal staff-created
      staffNote: note.trim() || undefined,
    };

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      showToast(data.error ?? 'Failed to create order.');
      return;
    }

    const created = await res.json();
    onCreated(created);
  };

  const total = items.reduce((a, i) => a + i.price * i.qty, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-modal border border-brand-border rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-brand-500" />
            <span>Create Table Order</span>
          </h3>
          <p className="text-xs text-gray-400">
            Placed by {staff.name} ({staff.role})
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Table</label>
            <select
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
              required
              className="w-full bg-gray-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
            >
              {tables.length === 0 && <option value="">No tables configured</option>}
              {tables.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.table_id} {t.location ? `(${t.location})` : ''} — {t.capacity} seats
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 border border-brand-border rounded-2xl p-3.5 bg-gray-900/50">
            <label className="block text-xs font-bold text-gray-200">Add Dishes</label>
            <div className="flex gap-2">
              <select
                value={pickerItem}
                onChange={(e) => handlePickerItem(e.target.value)}
                className="grow bg-gray-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white"
              >
                {menu.map((m) => (
                  <option key={m._id} value={m._id}>{m.name}</option>
                ))}
              </select>
              <select
                value={pickerVariant}
                onChange={(e) => setPickerVariant(e.target.value)}
                className="bg-gray-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white"
              >
                {currentItem?.variants?.map((v: any) => (
                  <option key={v.name} value={v.name}>
                    {v.name} — ${v.price.toFixed(2)}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={addToOrder}
                className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-3 py-2 rounded-xl text-xs"
              >
                Add
              </button>
            </div>

            <div className="space-y-1.5 pt-2 max-h-36 overflow-y-auto">
              {items.length === 0 ? (
                <p className="text-[11px] text-gray-500 italic">No dishes yet.</p>
              ) : (
                items.map((i, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs bg-gray-800 p-2 rounded-xl border border-brand-border"
                  >
                    <div>
                      <span className="font-bold text-white">{i.name}</span>
                      <span className="text-[10px] text-gray-400 block">
                        {i.variantName} · ${i.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-brand-500">{i.qty}x</span>
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="text-red-400 hover:text-red-300 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <p className="text-[11px] text-gray-400 text-right">
                Subtotal: <strong className="text-white">${total.toFixed(2)}</strong>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">
              Kitchen Notes (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Allergies, extra spicy, dressing on the side…"
              className="w-full bg-gray-900 border border-brand-border rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-500 resize-none"
            />
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
              className="px-6 py-2 rounded-xl bg-linear-to-r from-brand-500 to-amber-500 text-white text-xs font-bold shadow-glow disabled:opacity-50"
            >
              {saving ? 'Sending…' : 'Send to Kitchen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}