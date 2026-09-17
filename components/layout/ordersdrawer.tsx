'use client';

import {
  Package,
  X,
  Clock,
  MapPin,
  Phone,
  ChefHat,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import Image from 'next/image';
import { useOrders } from '@/context/ordercontext';
import { deriveOrderStatus, type Order, type OrderStatus } from '@/types';

const STATUS_META: Record<
  OrderStatus,
  { label: string; Icon: typeof ChefHat; color: string; step: number }
> = {
  preparing: { label: 'Preparing', Icon: ChefHat, color: 'text-amber-400', step: 1 },
  'on-the-way': { label: 'On the way', Icon: Truck, color: 'text-brand-500', step: 2 },
  delivered: { label: 'Delivered', Icon: CheckCircle2, color: 'text-emerald-400', step: 3 },
};

function minutesLeft(order: Order): number {
  return Math.max(0, Math.round((order.estimatedArrival - Date.now()) / 60000));
}

interface OrdersDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function OrdersDrawer({ open, onClose }: OrdersDrawerProps) {
  const { activeOrders, cancelOrder } = useOrders();

  return (
    <div
      className={`fixed inset-0 z-60 transition-opacity duration-300 ${
        open ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className={`absolute top-0 right-0 bottom-0 w-full max-w-md bg-brand-dark border-l border-gray-800 shadow-2xl flex flex-col transition-transform duration-300 pointer-events-auto ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-500" />
            <h3 className="text-lg font-bold text-white">Active Orders</h3>
            {activeOrders.length > 0 && (
              <span className="bg-brand-500/20 text-brand-500 text-xs font-bold px-2 py-0.5 rounded-full">
                {activeOrders.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
            aria-label="Close active orders"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="grow overflow-y-auto p-5 space-y-4">
          {activeOrders.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Package className="w-12 h-12 mx-auto text-gray-600" />
              <p className="text-gray-400 font-medium">No active orders</p>
              <p className="text-xs text-gray-600">
                Place an order to track it here in real time.
              </p>
            </div>
          ) : (
            activeOrders.map((order) => {
              const status = deriveOrderStatus(order);
              const meta = STATUS_META[status];
              const StatusIcon = meta.Icon;
              const mins = minutesLeft(order);
              const totalQty = order.items.reduce((a, c) => a + c.qty, 0);

              return (
                <div
                  key={order.id}
                  className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 space-y-4"
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-500 font-mono">{order.id}</p>
                      <p className="text-lg font-bold text-white">
                        ${order.total.toFixed(2)}
                        <span className="text-xs text-gray-400 font-normal ml-2">
                          · {totalQty} item{totalQty > 1 ? 's' : ''}
                        </span>
                      </p>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 ${meta.color} font-semibold text-xs shrink-0`}
                    >
                      <StatusIcon className="w-4 h-4" />
                      <span>{meta.label}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="flex items-center gap-2">
                    {[1, 2, 3].map((n) => (
                      <div
                        key={n}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          meta.step >= n ? 'bg-brand-500' : 'bg-gray-800'
                        }`}
                      />
                    ))}
                  </div>

                  {/* ETA */}
                  {status !== 'delivered' && (
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        {mins > 0 ? `Arriving in ~${mins} min` : 'Arriving any moment'}
                      </span>
                    </div>
                  )}

                  {/* Item thumbnails */}
                  <div className="flex -space-x-3 pt-1">
                    {order.items.slice(0, 4).map((item, i) => (
                      <div
                        key={`${item.id}-${i}`}
                        className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-brand-dark"
                      >
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="w-10 h-10 rounded-full bg-gray-800 border-2 border-brand-dark flex items-center justify-center text-xs font-bold text-gray-300">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>

                  {/* Delivery info */}
                  <div className="pt-3 border-t border-gray-800 space-y-1.5 text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <span className="truncate">{order.customer.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <span>{order.customer.phone}</span>
                    </div>
                  </div>

                  {/* Cancel (only while preparing) */}
                  {status === 'preparing' && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="w-full bg-gray-800 hover:bg-red-500/10 hover:text-red-400 text-gray-400 font-semibold py-2 rounded-xl text-xs transition border border-gray-700"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}