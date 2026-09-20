'use client';

import { useState } from 'react';
import { useToast } from '@/context/toastcontext';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

const SYMBOLS: Record<string, string> = {
  PKR: 'Rs', USD: '$', EUR: '€', GBP: '£', AED: 'د.إ', SAR: '﷼', INR: '₹',
};

export default function SettingsClient({ initialSettings }: any) {
  const { showToast } = useToast();
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);

  const update = (patch: any) => setSettings((s: any) => ({ ...s, ...patch }));

  const updateHours = (day: string, patch: any) =>
    setSettings((s: any) => ({
      ...s,
      hours: { ...s.hours, [day]: { ...s.hours[day], ...patch } },
    }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return showToast(data.error ?? 'Failed to save settings.');
    }

    setSettings(await res.json());
    showToast('Settings saved.');
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Restaurant Settings</h1>
        <p className="text-xs text-gray-400">
          Manage identity, currency, taxation, and daily operating hours.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identity & Contact */}
        <div className="glass-card p-6 rounded-2xl border border-brand-border space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-brand-border pb-3">
            Identity & Contact
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Support Phone</label>
              <input value={settings.supportPhone ?? ''}
                onChange={(e) => update({ supportPhone: e.target.value })}
                className="w-full bg-gray-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Support Email</label>
              <input type="email" value={settings.supportEmail ?? ''}
                onChange={(e) => update({ supportEmail: e.target.value })}
                className="w-full bg-gray-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Address</label>
              <input value={settings.address ?? ''}
                onChange={(e) => update({ address: e.target.value })}
                className="w-full bg-gray-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500" />
            </div>
          </div>
        </div>

        {/* Localisation & Pricing */}
        <div className="glass-card p-6 rounded-2xl border border-brand-border space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-brand-border pb-3">
            Localisation & Pricing Rules
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Currency Code</label>
              <select value={settings.currency?.code ?? 'PKR'}
                onChange={(e) => update({
                  currency: {
                    code: e.target.value,
                    symbol: SYMBOLS[e.target.value] ?? '$',
                  },
                })}
                className="w-full bg-gray-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500">
                {Object.keys(SYMBOLS).map((c) => (
                  <option key={c} value={c}>{c} ({SYMBOLS[c]})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Symbol (read-only)</label>
              <input readOnly value={settings.currency?.symbol ?? 'Rs'}
                className="w-full bg-gray-800 border border-brand-border rounded-xl px-3 py-2 text-xs text-gray-300" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Tax %</label>
              <input type="number" step="0.1" value={settings.taxPercent ?? 0}
                onChange={(e) => update({ taxPercent: Number(e.target.value) })}
                className="w-full bg-gray-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Delivery Fee</label>
              <input type="number" step="0.01" value={settings.deliveryFee ?? 0}
                onChange={(e) => update({ deliveryFee: Number(e.target.value) })}
                className="w-full bg-gray-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500" />
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="glass-card p-6 rounded-2xl border border-brand-border space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-brand-border pb-3">
            Business Operating Hours
          </h3>
          <div className="space-y-3">
            {DAYS.map((day) => {
              const h = settings.hours?.[day] ?? { open: '10:00', close: '23:00', closed: false };
              return (
                <div key={day} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center bg-gray-900/60 p-3 rounded-xl border border-brand-border text-xs">
                  <span className="font-bold text-white capitalize">{day}</span>
                  <div>
                    <span className="text-[10px] text-gray-500 block">Open</span>
                    <input value={h.open} disabled={h.closed}
                      onChange={(e) => updateHours(day, { open: e.target.value })}
                      className="w-full bg-gray-800 border border-brand-border rounded px-2 py-1 text-white disabled:opacity-40" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block">Close</span>
                    <input value={h.close} disabled={h.closed}
                      onChange={(e) => updateHours(day, { close: e.target.value })}
                      className="w-full bg-gray-800 border border-brand-border rounded px-2 py-1 text-white disabled:opacity-40" />
                  </div>
                  <label className="flex items-center gap-2 pt-3 sm:pt-0 cursor-pointer">
                    <input type="checkbox" checked={h.closed}
                      onChange={(e) => updateHours(day, { closed: e.target.checked })}
                      className="w-4 h-4 rounded bg-gray-800 border-brand-border text-brand-500" />
                    <span className="text-[11px] text-gray-400 font-semibold">Closed all day</span>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving}
            className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-8 py-3 rounded-xl shadow-glow text-xs transition disabled:opacity-50">
            {saving ? 'Saving…' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </section>
  );
}