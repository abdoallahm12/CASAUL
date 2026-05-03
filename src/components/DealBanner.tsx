'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { X, Clock, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

function getOrSetDealEnd(): number {
  if (typeof window === 'undefined') return Date.now() + 24 * 60 * 60 * 1000;
  const stored = localStorage.getItem('z-shop-deal-end');
  if (stored) {
    const end = parseInt(stored, 10);
    if (end > Date.now()) return end;
  }
  // Set new deal: 24 hours from now
  const newEnd = Date.now() + 24 * 60 * 60 * 1000;
  localStorage.setItem('z-shop-deal-end', String(newEnd));
  return newEnd;
}

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function useCountdown(targetTime: number) {
  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(0, targetTime - Date.now())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.max(0, targetTime - Date.now());
      setTimeLeft(diff);
    }, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return {
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
    isExpired: timeLeft <= 0,
  };
}

export default function DealBanner() {
  const { dealBannerDismissed, setDealBannerDismissed } = useAppStore();
  const mounted = useIsMounted();
  const [targetTime] = useState<number>(() => getOrSetDealEnd());

  const { hours, minutes, seconds, isExpired } = useCountdown(targetTime);

  const handleDismiss = useCallback(() => {
    setDealBannerDismissed(true);
  }, [setDealBannerDismissed]);

  if (!mounted || dealBannerDismissed || isExpired) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"
      >
        {/* Animated background pulse */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_70%)]" />
        <div className="absolute inset-0 animate-pulse opacity-20 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.3),transparent_60%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Flame className="size-5 text-yellow-200 shrink-0" />
            <span className="text-white font-bold text-sm sm:text-base">
              Flash Sale! Up to 30% off
            </span>
            <span className="text-white/80 text-sm">—</span>
            <span className="text-white/90 text-sm">Ends in:</span>
            <div className="flex items-center gap-1">
              <Clock className="size-4 text-yellow-200" />
              <div className="flex items-center gap-0.5 font-mono">
                <span className="inline-flex size-7 items-center justify-center rounded bg-white/20 text-white font-bold text-sm backdrop-blur-sm">
                  {hours}
                </span>
                <span className="text-white font-bold">:</span>
                <span className="inline-flex size-7 items-center justify-center rounded bg-white/20 text-white font-bold text-sm backdrop-blur-sm">
                  {minutes}
                </span>
                <span className="text-white font-bold">:</span>
                <span className="inline-flex size-7 items-center justify-center rounded bg-white/20 text-white font-bold text-sm backdrop-blur-sm">
                  {seconds}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dismiss button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 size-7 text-white/70 hover:text-white hover:bg-white/10"
          onClick={handleDismiss}
        >
          <X className="size-4" />
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}
