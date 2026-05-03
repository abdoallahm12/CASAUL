"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { toast } from "sonner";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    toast.success("Welcome to the Inner Circle", {
      description: `A confirmation has been sent to ${email}`,
    });
    setEmail("");
  };

  return (
    <section
      id="newsletter-section"
      className="bg-[#1a2332] py-16 sm:py-24"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-3xl sm:text-4xl md:text-5xl text-white"
            style={{
              fontFamily:
                "var(--font-cormorant), Cormorant Garamond, serif",
            }}
          >
            Join the Inner Circle
          </h2>
          <div className="w-16 h-[2px] bg-[#B8956A] mx-auto mt-4" />
          <p
            className="mt-4 text-white/50 text-sm max-w-md mx-auto"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            Be the first to discover new arrivals, exclusive offers, and
            sartorial insights delivered directly to your inbox.
          </p>

          {subscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8"
            >
              <p
                className="text-[#B8956A] text-lg"
                style={{
                  fontFamily:
                    "var(--font-cormorant), Cormorant Garamond, serif",
                }}
              >
                Welcome to the Circle
              </p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-sm text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#B8956A] transition-colors"
                style={{
                  fontFamily:
                    "var(--font-montserrat), Montserrat, sans-serif",
                }}
              />
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="btn-gold-shimmer text-[#1a2332] px-6 py-3 text-xs tracking-[0.2em] uppercase font-medium whitespace-nowrap"
                style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
              >
                Subscribe
              </motion.button>
            </form>
          )}

          {/* Social Icons */}
          <div className="flex items-center justify-center gap-6 mt-10">
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-[#B8956A] hover:border-[#B8956A] transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-[#B8956A] hover:border-[#B8956A] transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-[#B8956A] hover:border-[#B8956A] transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
