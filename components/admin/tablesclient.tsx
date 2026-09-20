'use client';

import { useState } from 'react';
import { Plus, Edit3, Trash2, X } from 'lucide-react';
import { useToast } from '@/context/toastcontext';

const STATUS_STYLES: Record<string, string> = {
  available: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  occupied:  'bg-red-500/20 text-red-400 border-red-500/30',
  reserved:  'bg-amber-500/20 text-amber-400 border-amber-500/30',
  inactive:  'bg-gray-800 text-gray-500 border-gray-700',
};

export default function TablesClient({ initialTables }: any) {
  const { showToast } = useToast();
  const [tables, setTables] = useState(initialTables);
  const [editing, setEditing] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSaved = (saved: any) => {
    setTables((prev: any[]) =>
      prev.some((t) => t._id === saved._id)
        ? prev.map((t) => (t._id === saved._id ? saved : t))
        : [...prev, saved]
    );
    setModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this table?')) return;
    const res = await fetch(`/api/tables/${id}`, { method: 'DELETE' });
    if (!res.ok) return showToast('Failed to delete table.');
    setTables((prev: any[]) => prev.filter((t) => t._id !== id));
    showToast('Table removed.');
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Table Management</h1>
          <p className="text-xs text-gray-400">
            Configure dining tables, capacity, locations, and live status.
          </p>
        </div>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-4 py-2.5 rounded-xl shadow-glow text-xs flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Table</span>
        </button>
      </div>

      {/* ────── GRID ────── */}
      {tables.length === 0 ? (
        <div className="glass-card rounded-2xl border border-brand-border p-12 text-center">
          <p className="text-sm text-gray-400">No tables configured yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map((t: any) => (
            <div key={t._id} className="glass-card p-5 rounded-2xl border border-brand-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-lg font-extrabold text-white">{t.table_id}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                  STATUS_STYLES[t.status] ?? STATUS_STYLES.inactive
                }`}>
                  {t.status}
                </span>
              </div>
              <div className="text-xs text-gray-400 space-y-1">
                <p>🪑 Capacity: <strong className="text-gray-200">{t.capacity} Seats</strong></p>
                <p>📍 {t.location || 'Main Floor'}</p>
              </div>
              <div className="pt-2 border-t border-brand-border flex justify-end gap-2">
                <button onClick={() => { setEditing(t); setModalOpen(true); }}
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg bg-gray-900 border border-brand-border">
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(t._id)}
                  className="p-1.5 text-red-400 hover:text-red-300 rounded-lg bg-gray-900 border border-brand-border">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ────── MODAL ────── */}
      <TableModal
        open={modalOpen}
        table={editing}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   MODAL
   ══════════════════════════════════════════════════════════ */

function TableModal({ open, table, onClose, onSaved }: any) {
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const fd = new FormData(e.currentTarget);
    const body = {
      table_id: String(fd.get('table_id') ?? '').toUpperCase().trim(),
      capacity: Number(fd.get('capacity')),
      location: fd.get('location') || '',
      status: fd.get('status'),
    };

    const url = table ? `/api/tables/${table._id}` : '/api/tables';
    const method = table ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return showToast(data.error ?? 'Failed to save table.');
    }

    onSaved(await res.json());
    showToast(table ? 'Table updated.' : 'Table created.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-modal border border-brand-border rounded-3xl max-w-md w-full p-6 space-y-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white">{table ? 'Edit Table' : 'Add Table'}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Table ID (e.g. T01)</label>
              <input name="table_id" defaultValue={table?.table_id ?? ''} required maxLength={10}
                className="w-full bg-gray-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Capacity</label>
              <input name="capacity" type="number" min="1" max="30" defaultValue={table?.capacity ?? 4} required
                className="w-full bg-gray-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Location</label>
            <input name="location" defaultValue={table?.location ?? ''} placeholder="Main Hall, Patio, VIP…"
              className="w-full bg-gray-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500" />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Status</label>
            <select name="status" defaultValue={table?.status ?? 'available'}
              className="w-full bg-gray-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500">
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="reserved">Reserved</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="pt-3 border-t border-brand-border flex justify-end gap-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs font-semibold">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="px-6 py-2 rounded-xl bg-brand-500 text-white text-xs font-bold shadow-glow disabled:opacity-50">
              {saving ? 'Saving…' : 'Save Table'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}