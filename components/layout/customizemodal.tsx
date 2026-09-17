'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useCart } from '@/context/cartcontext';
import type { FoodItem } from '@/types';
import Image from 'next/image';

const SPICE_LEVELS = ['Mild', 'Medium', 'Hot 🔥'] as const;

interface CustomizeModalProps {
  item: FoodItem | null;
  onClose: () => void;
}

export default function CustomizeModal({ item, onClose }: CustomizeModalProps) {
  const { addToCart } = useCart();
  const [note, setNote] = useState('');
  const [spice, setSpice] = useState<(typeof SPICE_LEVELS)[number]>('Mild');

  if (!item) return null;

  const handleAdd = () => {
    const fullNote = [spice, note.trim()].filter(Boolean).join(' · ');
    addToCart(item.id, fullNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-modal border border-gray-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          <div className="relative w-full h-48 rounded-2xl overflow-hidden">
            <Image src={item.image} alt={item.title} fill sizes="512px" className="object-cover" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">{item.title}</h3>
            <p className="text-xs text-gray-400 mt-1">{item.description}</p>
          </div>

          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
              Spice Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SPICE_LEVELS.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSpice(level)}
                  className={
                    spice === level
                      ? 'border border-brand-500 bg-brand-500/20 text-white rounded-xl py-2 text-xs font-semibold'
                      : 'border border-gray-700 bg-gray-800 text-gray-400 rounded-xl py-2 text-xs font-semibold'
                  }
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
              Special Instructions
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="E.g., No onions, extra sauce..."
              className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-500 h-20 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-gray-800 flex items-center justify-between">
            <span className="text-lg font-bold text-white">${item.price.toFixed(2)}</span>
            <button
              onClick={handleAdd}
              className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-glow text-xs transition"
            >
              Add Custom Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}