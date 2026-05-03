"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useStore } from "@/lib/store";

export default function Hero() {
  const { setView, siteSettings } = useStore();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Parallax Background */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-full"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/hero/hero-main.png')",
          }}
        />
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a2332]/70 via-[#1a2332]/40 to-transparent" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full flex items-center"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight"
              style={{
                fontFamily: "var(--font-playfair), Playfair Display, serif",
              }}
            >
              {siteSettings.heroTitle}
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white/90 leading-tight mt-2"
              style={{
                fontFamily: "var(--font-playfair), Playfair Display, serif",
              }}
            >
              {siteSettings.heroSubtitle}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-6 text-white/70 text-sm sm:text-base max-w-lg tracking-wide"
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              Discover our curated collection of premium menswear, where every
              piece tells a story of heritage craftsmanship and timeless
              sophistication.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setView("shop")}
              className="mt-8 sm:mt-10 btn-gold-shimmer text-[#1a2332] px-8 sm:px-10 py-3.5 sm:py-4 text-xs sm:text-sm tracking-[0.2em] uppercase font-medium transition-all duration-300"
              style={{
                fontFamily: "var(--font-lato), Lato, sans-serif",
              }}
            >
              {siteSettings.heroCtaText}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F5F3EE] to-transparent" />
    </section>
  );
}
