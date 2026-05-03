"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useStore } from "@/lib/store";

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, products, setView, setSelectedProductId } =
    useStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setIsSearchOpen(false);
    setQuery("");
  };

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const results = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setView("product");
    handleClose();
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] bg-[#1a2332]/60 backdrop-blur-sm flex items-start justify-center pt-20 sm:pt-32"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl mx-4 bg-[#FDFBF7] rounded-sm shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-4 p-4 sm:p-6 border-b border-[#E8E4DB]">
              <Search className="w-5 h-5 text-[#B8956A] flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for shirts, trousers, shoes..."
                className="flex-1 bg-transparent text-lg text-[#1a2332] placeholder:text-[#8B7D6B]/50 focus:outline-none"
                style={{
                  fontFamily:
                    "var(--font-cormorant), Cormorant Garamond, serif",
                }}
              />
              <button
                onClick={handleClose}
                className="p-1 text-[#8B7D6B] hover:text-[#1a2332] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {query.trim() && results.length === 0 && (
                <div className="p-8 text-center">
                  <p
                    className="text-[#8B7D6B]"
                    style={{
                      fontFamily:
                        "var(--font-cormorant), Cormorant Garamond, serif",
                    }}
                  >
                    No results found for &ldquo;{query}&rdquo;
                  </p>
                </div>
              )}

              {results.map((product) => (
                <motion.button
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => handleProductClick(product.id)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-[#F5F3EE] transition-colors text-left"
                >
                  <div className="w-14 h-18 bg-[#E8E4DB] rounded-sm overflow-hidden flex-shrink-0">
                    <img
                      src={product.images.front}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className="text-base text-[#1a2332]"
                      style={{
                        fontFamily:
                          "var(--font-cormorant), Cormorant Garamond, serif",
                      }}
                    >
                      {product.name}
                    </h4>
                    <p
                      className="text-xs text-[#8B7D6B] capitalize mt-0.5"
                      style={{
                        fontFamily:
                          "var(--font-montserrat), Montserrat, sans-serif",
                      }}
                    >
                      {product.category}
                    </p>
                  </div>
                  <p
                    className="text-sm font-medium text-[#B8956A]"
                    style={{
                      fontFamily:
                        "var(--font-montserrat), Montserrat, sans-serif",
                    }}
                  >
                    €{product.price}
                  </p>
                </motion.button>
              ))}
            </div>

            {/* Quick Suggestions */}
            {!query.trim() && (
              <div className="p-6">
                <p
                  className="text-xs uppercase tracking-[0.15em] text-[#8B7D6B] mb-3"
                  style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
                >
                  Popular Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Oxford Shirt", "Penny Loafers", "Wool Blazer", "Chinos"].map(
                    (term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-3 py-1.5 text-xs border border-[#E8E4DB] rounded-sm text-[#8B7D6B] hover:border-[#B8956A] hover:text-[#B8956A] transition-colors"
                        style={{
                          fontFamily:
                            "var(--font-montserrat), Montserrat, sans-serif",
                        }}
                      >
                        {term}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
