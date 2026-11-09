'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  X,
  PlusCircle,
  Search,
  Check,
  Plus,
  Minus,
  Trash2,
  Utensils,
  Armchair,
  FileText,
  Layers,
} from 'lucide-react';
import { useToast } from '@/context/toastcontext';

interface Variant {
  name: string;
  price: number;
}

interface MenuItem {
  _id: string;
  name: string;
  category?: string;
  variants: Variant[];
}

interface Table {
  _id: string;
  table_id: string;
  location?: string;
  capacity?: number;
}

interface Props {
  open: boolean;
  menu: MenuItem[];
  tables: Table[];
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

export default function NewOrderModal({
  open,
  menu,
  tables,
  staff,
  onClose,
  onCreated,
}: Props) {
  const { showToast } = useToast();

  const [tableId, setTableId] = useState('');
  const [items, setItems] = useState<SelectedItem[]>([]);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  // Catalog filtering & variation builder state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedDishId, setSelectedDishId] = useState('');
  const [selectedVariantName, setSelectedVariantName] = useState('');
  const [pickerQty, setPickerQty] = useState(1);

  // Reset and initialize when modal opens
  useEffect(() => {
    if (!open) return;
    setTableId(tables[0]?._id ?? '');
    setItems([]);
    setNote('');
    setSearchQuery('');
    setCategoryFilter('All');
    setPickerQty(1);

    const firstDish = menu[0];
    if (firstDish) {
      setSelectedDishId(firstDish._id);
      setSelectedVariantName(firstDish.variants?.[0]?.name ?? '');
    }
    setSaving(false);
  }, [open, menu, tables]);

  // Extract unique categories from menu
  const categories = useMemo(() => {
    const set = new Set<string>();
    menu.forEach((m) => {
      if (m.category) set.add(m.category);
    });
    return ['All', ...Array.from(set)];
  }, [menu]);

  // Filtered menu items
  const filteredMenu = useMemo(() => {
    return menu.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.variants.some((v) =>
          v.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchCategory =
        categoryFilter === 'All' ||
        (item.category &&
          item.category.toLowerCase() === categoryFilter.toLowerCase());
      return matchSearch && matchCategory;
    });
  }, [menu, searchQuery, categoryFilter]);

  // Current selected dish & variation
  const activeDish = useMemo(() => {
    return menu.find((m) => m._id === selectedDishId) ?? menu[0];
  }, [menu, selectedDishId]);

  const activeVariant = useMemo(() => {
    if (!activeDish) return null;
    return (
      activeDish.variants.find((v) => v.name === selectedVariantName) ??
      activeDish.variants[0] ??
      null
    );
  }, [activeDish, selectedVariantName]);

  const handleSelectDish = (dish: MenuItem) => {
    setSelectedDishId(dish._id);
    setSelectedVariantName(dish.variants[0]?.name ?? '');
    setPickerQty(1);
  };

  // Add configured dish with variation to order
  const handleAddToOrder = () => {
    if (!activeDish || !activeVariant) return;

    setItems((prev) => {
      const existingIdx = prev.findIndex(
        (x) =>
          x.itemId === activeDish._id &&
          x.variantName === activeVariant.name
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].qty += pickerQty;
        return next;
      } else {
        return [
          ...prev,
          {
            itemId: activeDish._id,
            name: activeDish.name,
            variantName: activeVariant.name,
            price: activeVariant.price,
            qty: pickerQty,
          },
        ];
      }
    });

    showToast(`Added ${pickerQty}x ${activeDish.name} (${activeVariant.name})`);
    setPickerQty(1);
  };

  // Quantity stepper in current order cart
  const updateItemQty = (idx: number, delta: number) => {
    setItems((prev) => {
      const next = [...prev];
      const newQty = next[idx].qty + delta;
      if (newQty <= 0) {
        return next.filter((_, i) => i !== idx);
      }
      next[idx].qty = newQty;
      return next;
    });
  };

  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  // Financial summary
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      showToast('Please add at least one dish to the order.');
      return;
    }
    if (!tableId) {
      showToast('Please select a dining table.');
      return;
    }

    setSaving(true);

    const table = tables.find((t) => t._id === tableId);
    const payload = {
      orderType: 'dining',
      table: tableId,
      table_id: table?.table_id ?? 'T-XX',
      location: table?.location,
      customer: { name: `Table ${table?.table_id ?? '—'}` },
      items: items.map((i) => ({
        item: i.itemId,
        name: i.name,
        price: i.price,
        qty: i.qty,
        note: i.variantName ? `Variant: ${i.variantName}` : undefined,
      })),
      paymentMethod: 'cash',
      placedByStaff: true,
      staffNote: note.trim() || undefined,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setSaving(false);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        showToast(data.error ?? 'Failed to create table order.');
        return;
      }

      const created = await res.json();
      onCreated(created);
    } catch {
      setSaving(false);
      showToast('Network error while placing order.');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-modal border border-brand-border rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden relative shadow-2xl">
        {/* ── Modal Header ── */}
        <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between bg-gray-900/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-brand-600 to-amber-400 flex items-center justify-center text-white shadow-glow">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                Create Table Order
                <span className="text-[10px] px-2 py-0.5 rounded bg-brand-500/20 text-brand-400 font-bold uppercase tracking-wider border border-brand-500/30">
                  Dining POS
                </span>
              </h3>
              <p className="text-xs text-gray-400">
                Staff: <span className="text-white font-semibold">{staff.name}</span> ({staff.role})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-gray-800 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Modal Body: 2 Columns ── */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-brand-border">
          {/* ────── LEFT COLUMN: Menu Browser & Variation Selector ────── */}
          <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-brand-500" />
                  Select Dish & Variations
                </span>
                <span className="text-[11px] text-gray-500">
                  {filteredMenu.length} dishes available
                </span>
              </div>

              {/* Search & Category Tabs */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search dishes or variations..."
                    className="w-full bg-gray-900 border border-brand-border rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Category Pills */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition ${
                        categoryFilter === cat
                          ? 'bg-brand-500 text-white shadow-glow'
                          : 'bg-gray-900/80 text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Dish Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 sm:max-h-56 overflow-y-auto pr-1">
              {filteredMenu.map((dish) => {
                const isSelected = activeDish?._id === dish._id;
                const minPrice = Math.min(...dish.variants.map((v) => v.price));
                return (
                  <button
                    key={dish._id}
                    type="button"
                    onClick={() => handleSelectDish(dish)}
                    className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? 'border-brand-500 bg-brand-500/15 shadow-glow'
                        : 'border-brand-border bg-gray-900/60 hover:bg-gray-800/80 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <p className="text-xs font-bold text-white leading-snug line-clamp-1">
                        {dish.name}
                      </p>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-brand-500 text-white flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-brand-border/40 text-[10px]">
                      <span className="text-amber-400 font-bold">
                        From ${minPrice.toFixed(2)}
                      </span>
                      <span className="text-gray-400 font-medium">
                        {dish.variants.length} variation{dish.variants.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ────── VARIATION SELECTOR BOX ────── */}
            {activeDish && (
              <div className="bg-gray-900/80 border border-brand-border rounded-2xl p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-brand-500" />
                    <span className="text-xs font-bold text-white">
                      Variations for &ldquo;{activeDish.name}&rdquo;
                    </span>
                  </div>
                  {activeDish.category && (
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">
                      {activeDish.category}
                    </span>
                  )}
                </div>

                {/* Variation Chips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeDish.variants.map((v) => {
                    const isPicked = activeVariant?.name === v.name;
                    return (
                      <button
                        key={v.name}
                        type="button"
                        onClick={() => setSelectedVariantName(v.name)}
                        className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                          isPicked
                            ? 'border-brand-500 bg-linear-to-r from-brand-500/25 to-amber-500/25 text-white ring-1 ring-brand-500'
                            : 'border-brand-border bg-gray-900 text-gray-300 hover:border-gray-600'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold leading-tight">{v.name}</p>
                          <span className="text-[10px] text-gray-400">Selected Option</span>
                        </div>
                        <span className="text-xs font-extrabold text-amber-400">
                          ${v.price.toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Stepper & Add to Order Button */}
                <div className="flex items-center gap-3 pt-2 border-t border-brand-border/60">
                  <div className="flex items-center bg-gray-950 border border-brand-border rounded-xl p-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setPickerQty((q) => Math.max(1, q - 1))}
                      className="w-7 h-7 rounded-lg hover:bg-gray-800 flex items-center justify-center text-gray-300 hover:text-white"
                      disabled={pickerQty <= 1}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-white">
                      {pickerQty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPickerQty((q) => q + 1)}
                      className="w-7 h-7 rounded-lg hover:bg-gray-800 flex items-center justify-center text-gray-300 hover:text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToOrder}
                    className="flex-1 py-2 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-glow flex items-center justify-center gap-1.5 transition active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>
                      Add {pickerQty}x · $
                      {((activeVariant?.price ?? 0) * pickerQty).toFixed(2)}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ────── RIGHT COLUMN: Table Config & Active Order Cart ────── */}
          <div className="w-full md:w-96 flex flex-col p-4 sm:p-6 bg-gray-950/40 space-y-4 shrink-0">
            {/* Table Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5 items-center gap-1.5">
                <Armchair className="w-3.5 h-3.5 text-brand-500" />
                Assign Table
              </label>
              <select
                value={tableId}
                onChange={(e) => setTableId(e.target.value)}
                required
                className="w-full bg-gray-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500 font-semibold"
              >
                {tables.length === 0 && <option value="">No tables configured</option>}
                {tables.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.table_id} {t.location ? `· ${t.location}` : ''} ({t.capacity ?? 4} Seats)
                  </option>
                ))}
              </select>
            </div>

            {/* Current Order Items List */}
            <div className="flex-1 flex flex-col min-h-48 border border-brand-border rounded-2xl p-3 bg-gray-900/60 overflow-hidden">
              <div className="flex items-center justify-between pb-2 border-b border-brand-border/60">
                <span className="text-xs font-bold text-white">Current Order Items</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 font-bold">
                  {items.reduce((acc, i) => acc + i.qty, 0)} Items
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-1 max-h-52">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <Utensils className="w-8 h-8 text-gray-600 mb-2" />
                    <p className="text-xs text-gray-400 font-medium">Order is currently empty</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Select a dish and variation from the menu to add
                    </p>
                  </div>
                ) : (
                  items.map((i, idx) => (
                    <div
                      key={`${i.itemId}_${i.variantName}_${idx}`}
                      className="p-2 rounded-xl bg-gray-800/90 border border-brand-border flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-white truncate leading-tight">{i.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-400 font-semibold border border-brand-500/30">
                            {i.variantName}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            ${i.price.toFixed(2)} each
                          </span>
                        </div>
                      </div>

                      {/* Stepper & Line Total */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center bg-gray-900 border border-brand-border rounded-lg p-0.5">
                          <button
                            type="button"
                            onClick={() => updateItemQty(idx, -1)}
                            className="w-5 h-5 rounded hover:bg-gray-800 flex items-center justify-center text-gray-300"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-white">
                            {i.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateItemQty(idx, 1)}
                            className="w-5 h-5 rounded hover:bg-gray-800 flex items-center justify-center text-gray-300"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-extrabold text-white text-xs w-12 text-right">
                          ${(i.price * i.qty).toFixed(2)}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Running Totals */}
              {items.length > 0 && (
                <div className="pt-2 border-t border-brand-border/60 space-y-1 text-xs">
                  <div className="flex justify-between text-gray-400 text-[11px]">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-[11px]">
                    <span>Estimated Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-white text-sm pt-1 border-t border-brand-border/40">
                    <span>Total</span>
                    <span className="text-amber-400">${total.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Kitchen Notes */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1 items-center gap-1">
                <FileText className="w-3 h-3 text-amber-400" />
                Kitchen Instructions (Optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Allergies, extra sauce, well done..."
                className="w-full bg-gray-900 border border-brand-border rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-500 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || items.length === 0}
                className="px-5 py-2 rounded-xl bg-linear-to-r from-brand-500 to-amber-500 hover:from-brand-600 hover:to-amber-600 text-white text-xs font-bold shadow-glow flex items-center gap-1.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{saving ? 'Sending…' : 'Send to Kitchen'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
