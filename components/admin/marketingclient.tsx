'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useToast } from '@/context/toastcontext';

export default function MarketingClient({ initialSubscribers }: any) {
  const { showToast } = useToast();
  const [sending, setSending] = useState(false);
  const [audience, setAudience] = useState<'active' | 'all'>('active');

  const subscribers = initialSubscribers;
  const activeCount = subscribers.filter((s: any) => s.status === 'active').length;
  const recipientCount = audience === 'active' ? activeCount : subscribers.length;

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);

    const fd = new FormData(e.currentTarget);
    const body = {
      subject: fd.get('subject'),
      body: fd.get('body'),
      audience,
    };

    const res = await fetch('/api/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setSending(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return showToast(data.error ?? 'Broadcast failed.');
    }

    e.currentTarget.reset();
    showToast(`Broadcast sent to ${recipientCount} subscriber(s).`);
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Email Marketing Broadcast</h1>
        <p className="text-xs text-gray-400">
          Compose and send promotional or menu updates to active subscribers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-brand-border space-y-4">
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Email Subject</label>
              <input name="subject" required placeholder="🔥 Weekend Special: 20% OFF all Gourmet Burgers!"
                className="w-full bg-gray-900 border border-brand-border rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Target Audience</label>
              <select value={audience} onChange={(e) => setAudience(e.target.value as any)}
                className="w-full bg-gray-900 border border-brand-border rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500">
                <option value="active">Active Subscribers Only</option>
                <option value="all">All Subscribers (incl. unsubscribed)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Email Content</label>
              <textarea name="body" required rows={8}
                placeholder="Dear Foodie,&#10;&#10;We are excited to introduce…"
                className="w-full bg-gray-900 border border-brand-border rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-brand-500 font-sans resize-y" />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                Estimated Reach:{' '}
                <strong className="text-brand-500 font-bold">{recipientCount}</strong>{' '}
                subscriber{recipientCount === 1 ? '' : 's'}
              </span>
              <button type="submit" disabled={sending || recipientCount === 0}
                className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-glow text-xs flex items-center gap-2 disabled:opacity-50">
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{sending ? 'Sending…' : 'Send Broadcast'}</span>
              </button>
            </div>
          </form>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-brand-border space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Subscribers</span>
            <span className="bg-brand-500/20 text-brand-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-brand-500/30">
              {subscribers.length}
            </span>
          </h3>
          <div className="space-y-2 max-h-95 overflow-y-auto pr-1">
            {subscribers.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-6">No subscribers yet.</p>
            )}
            {subscribers.map((s: any) => (
              <div key={s._id} className="flex items-center justify-between p-2.5 bg-gray-900/60 rounded-xl border border-brand-border text-xs">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-200 truncate">{s.email}</p>
                  <p className="text-[9px] text-gray-500">Source: {s.source ?? 'web'}</p>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded shrink-0 ${
                  s.status === 'active'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}