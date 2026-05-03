'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowDown, Sparkles, Truck, RotateCcw, ShieldCheck, Tag } from 'lucide-react';

export default function HeroSection() {
  const scrollToProducts = () => {
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const trustBadges = [
    { icon: Truck, label: 'Free Shipping Over $50' },
    { icon: RotateCcw, label: '30-Day Returns' },
    { icon: ShieldCheck, label: 'Secure Checkout' },
  ];

  const floatingProducts = [
    { name: 'Wireless Headphones', price: '$249.99', color: 'bg-amber-100 dark:bg-amber-900/30' },
    { name: 'Smart Watch', price: '$199.99', color: 'bg-orange-100 dark:bg-orange-900/30' },
    { name: 'Leather Bag', price: '$129.99', color: 'bg-rose-100 dark:bg-rose-900/30' },
  ];

  // Generate particle positions for star effect
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    duration: `${3 + Math.random() * 4}s`,
    size: `${2 + Math.random() * 2}px`,
  }));

  return (
    <section className="relative overflow-hidden animated-gradient">
      {/* Pattern overlay */}
      <div className="absolute inset-0 pattern-dots pointer-events-none" />

      {/* Particle/star effect */}
      <div className="particles">
        {particles.map((p) => (
          <span
            key={p.id}
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      {/* Decorative floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] size-40 rounded-full bg-white/10 blur-2xl float" />
        <div className="absolute top-[60%] right-[8%] size-56 rounded-full bg-yellow-200/10 blur-3xl float-delayed" />
        <div className="absolute bottom-[15%] left-[20%] size-32 rounded-full bg-white/8 blur-xl float" />
        <div className="absolute top-[30%] right-[25%] size-24 rounded-full bg-orange-200/10 blur-2xl float-delayed" />
        {/* Geometric shapes */}
        <motion.div
          animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[15%] right-[12%] size-16 rounded-2xl border border-white/10 rotate-12 hidden lg:block"
        />
        <motion.div
          animate={{ y: [10, -10, 10], rotate: [0, -8, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[25%] left-[8%] size-12 rounded-full border border-white/10 hidden lg:block"
        />
        <motion.div
          animate={{ y: [-8, 12, -8], x: [-5, 5, -5] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[50%] left-[45%] size-20 rounded-xl border border-white/5 rotate-45 hidden lg:block"
        />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs sm:text-sm font-medium text-white backdrop-blur-sm"
          >
            <Sparkles className="size-3.5 sm:size-4" />
            New arrivals every week
          </motion.div>

          <h1 className="mb-3 sm:mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Discover Amazing
            <br />
            <span className="text-gradient">Products</span>
          </h1>
          <p className="mx-auto mb-6 sm:mb-8 max-w-xl sm:max-w-2xl text-base sm:text-lg text-white/90 sm:text-xl px-2">
            Shop the latest deals on electronics, fashion, home &amp; more.
            Quality products at unbeatable prices.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center"
          >
            <Button
              size="lg"
              onClick={scrollToProducts}
              className="shine glow-pulse bg-white text-orange-600 hover:bg-white/90 shadow-lg shadow-orange-900/20 rounded-full px-6 sm:px-8 font-semibold text-sm sm:text-base"
            >
              Shop Now
              <ArrowDown className="ml-2 size-4" />
            </Button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
          >
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-1.5 sm:gap-2 text-white/80 text-xs sm:text-sm"
              >
                <badge.icon className="size-3.5 sm:size-4 shrink-0" />
                <span>{badge.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Floating product cards with details */}
        <div className="mt-8 sm:mt-12 flex gap-4 sm:gap-6">
          {floatingProducts.map((product, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: [0, -8, 0] }}
              transition={{
                delay: 0.7 + i * 0.15,
                duration: 0.5,
                y: {
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1.2 + i * 0.3,
                },
              }}
              className="hidden sm:block"
            >
              <div className="glass rounded-xl p-4">
                <div
                  className={`mb-3 size-20 rounded-lg ${product.color} flex items-center justify-center sm:size-24`}
                >
                  <Tag className="size-8 text-orange-500/50" />
                </div>
                <div className="h-3 w-20 rounded bg-white/30 mb-1" />
                <div className="text-sm font-bold text-white">{product.price}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mt-8 sm:mt-10 flex flex-col items-center gap-1 cursor-pointer"
          onClick={scrollToProducts}
        >
          <span className="text-white/60 text-xs font-medium tracking-wider uppercase">Scroll to explore</span>
          <div className="scroll-indicator">
            <ArrowDown className="size-5 text-white/60" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
