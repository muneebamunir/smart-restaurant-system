'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, X, Loader2, CameraOff, Scan } from 'lucide-react';
import { useMenuFilter } from '@/context/menufiltercontext';
import { useToast } from '@/context/toastcontext';

type Status = 'loading' | 'ready' | 'error';

interface CameraModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CameraModal({ open, onClose }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<Status>('loading');

  const { setSearchQuery } = useMenuFilter();
  const { showToast } = useToast();

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setStatus('loading');

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
        });

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setStatus('ready');
      } catch (err) {
        console.error('Camera access error:', err);
        if (!cancelled) setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [open]);

  if (!open) return null;

  const handleCapture = () => {
    showToast('Analyzing image... Found Artisan Burger!');
    setSearchQuery('Burger');
    onClose();
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-modal border border-gray-800 rounded-3xl max-w-md w-full p-6 space-y-5 relative text-gray-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 z-10"
          aria-label="Close camera"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-brand-500" />
            <h3 className="text-xl font-bold text-white">Visual Food Search</h3>
          </div>
          <p className="text-xs text-gray-400">
            Point your camera at a dish or QR code to find menu items instantly.
          </p>
        </div>

        <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-gray-800 flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${status === 'ready' ? '' : 'hidden'}`}
          />

          {status === 'loading' && (
            <div className="p-6 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-brand-500 animate-spin mx-auto" />
              <p className="text-xs text-gray-300 font-medium">Starting camera...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="p-6 text-center space-y-3">
              <CameraOff className="w-8 h-8 text-red-400 mx-auto" />
              <p className="text-xs text-red-300 font-semibold">
                Camera Access Denied or Unavailable
              </p>
              <p className="text-[11px] text-gray-500">
                Please allow camera permissions in your browser settings to use visual search.
              </p>
            </div>
          )}

          {status === 'ready' && (
            <div className="absolute inset-6 border-2 border-dashed border-brand-500/70 rounded-xl pointer-events-none flex items-center justify-center">
              <span className="bg-black/60 text-brand-400 text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm">
                Align Food / QR in frame
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-1/2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2.5 rounded-xl text-xs transition border border-gray-700"
          >
            Turn Off Camera
          </button>
          <button
            onClick={handleCapture}
            disabled={status !== 'ready'}
            className="w-1/2 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-xl shadow-glow text-xs transition flex items-center justify-center gap-1.5"
          >
            <Scan className="w-4 h-4" />
            <span>Scan Dish</span>
          </button>
        </div>
      </div>
    </div>
  );
}