'use client';

import { useState } from 'react';
import { ShoppingBag, X, ArrowRight, Package } from 'lucide-react';
import { useCart } from '@/context/cartcontext';
import { useOrders } from '@/context/ordercontext';
import CheckoutModal from './checkoutmodal';
import OrdersDrawer from './ordersdrawer';
import Image from 'next/image';

export default function CartDrawer() {
  const {
    cart,
    subtotal,
    tax,
    delivery,
    discountAmount,
    total,
    appliedDiscount,
    promoCode,
    setPromoCode,
    applyPromoCode,
    promoStatus,
    updateCartQty,
    isDrawerOpen,
    setDrawerOpen,
  } = useCart();

  const { activeOrders } = useOrders();

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [ordersDrawerOpen, setOrdersDrawerOpen] = useState(false);

  const handleCheckout = () => {
    setDrawerOpen(false);
    setCheckoutOpen(true);
  };

  const handleViewActiveOrders = () => {
    setDrawerOpen(false);
    setOrdersDrawerOpen(true);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          onClick={() => setDrawerOpen(false)}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        <div
          className={`absolute top-0 right-0 bottom-0 w-full max-w-md bg-brand-dark border-l border-gray-800 shadow-2xl flex flex-col justify-between transition-transform duration-300 pointer-events-auto ${
            isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* ── HEADER ─────────────────────────────────────────── */}
          <div className="p-5 border-b border-gray-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <ShoppingBag className="w-5 h-5 text-brand-500 shrink-0" />
              <h3 className="text-lg font-bold text-white truncate">Your Food Order</h3>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Active Orders pill */}
              <button
                onClick={handleViewActiveOrders}
                title="View active orders"
                className="relative flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-1.5 rounded-full border border-gray-700 transition text-xs font-semibold active:scale-95"
              >
                <Package className="w-4 h-4 text-brand-500" />
                <span className="hidden sm:inline">Active Orders</span>
                {activeOrders.length > 0 && (
                  <span className="bg-brand-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-4.5 text-center">
                    {activeOrders.length}
                  </span>
                )}
              </button>

              {/* Close cart */}
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ── ITEMS LIST ─────────────────────────────────────── */}
          <div className="grow overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <ShoppingBag className="w-12 h-12 mx-auto text-gray-600" />
                <p className="text-gray-400 font-medium">Your cart is empty.</p>
                <p className="text-xs text-gray-600">
                  Explore our delicious menu to add dishes!
                </p>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div
                  key={`${item.id}-${item.note ?? ''}-${idx}`}
                  className="flex items-center gap-3 bg-gray-900/80 border border-gray-800 p-3 rounded-2xl"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="grow min-w-0">
                    <h4 className="text-sm font-bold text-white line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-brand-500 font-semibold">
                      ${(item.price * item.qty).toFixed(2)}
                    </p>
                    {item.note && (
                      <p className="text-[10px] text-gray-500 italic truncate">
                        Note: {item.note}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 bg-gray-800 px-2 py-1 rounded-xl border border-gray-700">
                    <button
                      onClick={() => updateCartQty(idx, -1)}
                      className="text-gray-400 hover:text-white font-bold text-xs px-1"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-white">{item.qty}</span>
                    <button
                      onClick={() => updateCartQty(idx, 1)}
                      className="text-gray-400 hover:text-white font-bold text-xs px-1"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ── FOOTER / SUMMARY ──────────────────────────────── */}
          <div className="p-5 border-t border-gray-800 bg-gray-900/50 space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Promo code (e.g. TASTE20)"
                className="grow bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
              />
              <button
                onClick={() => applyPromoCode()}
                className="bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold px-4 py-2 rounded-xl text-xs transition border border-gray-700"
              >
                Apply
              </button>
            </div>
            {promoStatus && (
              <p
                className={`text-xs font-semibold ${
                  promoStatus.ok ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {promoStatus.message}
              </p>
            )}

            <div className="space-y-2 text-xs text-gray-400 pt-2 border-t border-gray-800/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-200">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="font-semibold text-gray-200">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-semibold text-gray-200">${delivery.toFixed(2)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount Promo</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-gray-800">
                <span>Total Price</span>
                <span className="text-brand-500">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold py-3.5 rounded-xl shadow-glow transition duration-200 flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
      <OrdersDrawer
        open={ordersDrawerOpen}
        onClose={() => setOrdersDrawerOpen(false)}
      />
    </>
  );
}