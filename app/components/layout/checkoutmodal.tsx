'use client';

import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { useCart } from '@/app/context/cartcontext';

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ open, onClose }: CheckoutModalProps) {
  const { total, clearCart } = useCart();
  const [done, setDone] = useState(false);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDone(true);
    clearCart();
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => setDone(false), 300);
  };

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-modal border border-gray-800 rounded-3xl max-w-md w-full p-6 space-y-6 relative text-gray-100">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
          aria-label="Close checkout"
        >
          <X className="w-5 h-5" />
        </button>

        {!done ? (
          <div className="space-y-5">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Delivery Details</h3>
              <p className="text-xs text-gray-400">Complete your order details below</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Delivery Address</label>
                <input
                  type="text"
                  required
                  placeholder="123 Gourmet Ave, Apt 4B"
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Payment Method</label>
                  <select className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500">
                    <option>Credit / Debit Card</option>
                    <option>Cash on Delivery</option>
                    <option>Apple Pay / Google Pay</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-800">
                <div className="flex justify-between font-bold text-sm text-white mb-4">
                  <span>Amount to Pay:</span>
                  <span className="text-brand-500">${total.toFixed(2)}</span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl shadow-glow transition"
                >
                  Place Order Now
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg animate-bounce-subtle">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-white">Order Confirmed!</h3>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">
              Your delicious meal is now being prepared by our master chefs. Expected arrival in{' '}
              <span className="text-brand-500 font-bold">25-30 mins</span>.
            </p>
            <div className="pt-4">
              <button
                onClick={handleClose}
                className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}