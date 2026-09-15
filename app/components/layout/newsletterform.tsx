'use client';

import { useToast } from '@/app/context/toastcontext';

export default function NewsletterForm() {
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showToast('Subscribed! Check your inbox for 10% off.');
    e.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="email"
        required
        placeholder="Enter your email"
        className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
      />
      <button
        type="submit"
        className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-2 rounded-lg text-xs transition"
      >
        Subscribe
      </button>
    </form>
  );
}