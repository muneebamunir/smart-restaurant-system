'use client';

import { useState } from 'react';
import { Plus, Edit3, Trash2, X } from 'lucide-react';
import { useToast } from '@/context/toastcontext';

export default function UsersClient({ initialUsers }: any) {
  const { showToast } = useToast();
  const [users, setUsers] = useState(initialUsers);
  const [editing, setEditing] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSaved = (saved: any) => {
    setUsers((prev: any[]) =>
      prev.some((u) => u._id === saved._id)
        ? prev.map((u) => (u._id === saved._id ? saved : u))
        : [...prev, saved]
    );
    setModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this staff user?')) return;
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
    if (!res.ok) return showToast('Failed to remove user.');
    setUsers((prev: any[]) => prev.filter((u) => u._id !== id));
    showToast('Staff user removed.');
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Staff Users</h1>
          <p className="text-xs text-gray-400">
            Manage admins, chefs, and waiters with password reset rules.
          </p>
        </div>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-4 py-2.5 rounded-xl shadow-glow text-xs flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff User</span>
        </button>
      </div>

      {/* ────── TABLE ────── */}
      {users.length === 0 ? (
        <div className="glass-card rounded-2xl border border-brand-border p-12 text-center">
          <p className="text-sm text-gray-400">No staff users yet.</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-brand-border overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-gray-900/80 text-gray-400 uppercase tracking-wider text-[10px] border-b border-brand-border">
              <tr>
                <th className="p-4">Staff Member</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Reset Pending</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {users.map((u: any) => (
                <tr key={u._id} className="hover:bg-gray-900/40 transition">
                  <td className="p-4 flex items-center gap-2 font-bold text-white">
                    <div className="w-7 h-7 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center text-xs font-extrabold uppercase">
                      {u.name?.charAt(0) ?? '?'}
                    </div>
                    <span>{u.name}</span>
                  </td>
                  <td className="p-4 font-mono text-gray-400">{u.email}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-500/10 text-brand-400 border border-brand-500/20">
                      {u.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      u.password?.reset_required
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-gray-800 text-gray-500'
                    }`}>
                      {u.password?.reset_required ? 'YES' : 'No'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => { setEditing(u); setModalOpen(true); }}
                      className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(u._id)}
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
      <UserModal
        open={modalOpen}
        user={editing}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   MODAL
   ══════════════════════════════════════════════════════════ */

function UserModal({ open, user, onClose, onSaved }: any) {
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const isEdit = !!user;

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const fd = new FormData(e.currentTarget);
    const body: any = {
      name: fd.get('name'),
      email: fd.get('email'),
      type: fd.get('type'),
      reset_required: fd.get('reset_required') === 'on',
    };

    const password = String(fd.get('password') ?? '');
    if (!isEdit || password) body.password = password;

    const url = isEdit ? `/api/users/${user._id}` : '/api/users';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return showToast(data.error ?? 'Failed to save user.');
    }

    onSaved(await res.json());
    showToast(isEdit ? 'User updated.' : 'Staff user created.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-modal border border-brand-border rounded-3xl max-w-md w-full p-6 space-y-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white">
          {isEdit ? 'Edit Staff Member' : 'Add Staff Member'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Full Name</label>
            <input name="name" defaultValue={user?.name ?? ''} required maxLength={80}
              className="w-full bg-gray-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500" />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Email</label>
            <input name="email" type="email" defaultValue={user?.email ?? ''} required
              className="w-full bg-gray-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500" />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Password {isEdit && <span className="text-gray-600">(leave empty to keep current)</span>}
            </label>
            <input name="password" type="password" minLength={8} required={!isEdit}
              placeholder={isEdit ? '••••••••' : 'At least 8 characters'}
              className="w-full bg-gray-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500" />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Role</label>
            <select name="type" defaultValue={user?.type ?? 'waiter'}
              className="w-full bg-gray-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500">
              <option value="admin">Admin</option>
              <option value="chef">Chef</option>
              <option value="waiter">Waiter</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="reset_required"
              defaultChecked={user?.password?.reset_required ?? !isEdit}
              className="w-4 h-4 rounded bg-gray-900 border-brand-border text-brand-500" />
            <span className="text-xs text-gray-300 font-semibold">Force password reset on next login</span>
          </label>

          <div className="pt-3 border-t border-brand-border flex justify-end gap-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs font-semibold">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="px-6 py-2 rounded-xl bg-brand-500 text-white text-xs font-bold shadow-glow disabled:opacity-50">
              {saving ? 'Saving…' : 'Save User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}