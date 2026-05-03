"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useStore } from "@/lib/store";
import ProductCard from "./ProductCard";
import { toast } from "sonner";

export default function CollectionDetail() {
  const {
    collections,
    products,
    selectedCollectionId,
    setView,
    addToCart,
  } = useStore();

  const collection = collections.find((c) => c.id === selectedCollectionId);

  if (!collection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#8B7D6B]">Collection not found</p>
      </div>
    );
  }

  const collectionProducts = collection.products
    .map((pid) => products.find((p) => p.id === pid))
    .filter(Boolean);

  const discountedPrice = collection.totalPrice * (1 - collection.discount);

  const handleAddAllToCart = () => {
    collectionProducts.forEach((product) => {
      if (product) {
        addToCart({
          productId: product.id,
          size: product.sizes[0],
          color: product.colors[0].name,
          quantity: 1,
        });
      }
    });
    toast.success("Collection added to bag", {
      description: `${collection.name} — ${collectionProducts.length} items`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Back Button */}
      <button
        onClick={() => setView("home")}
        className="flex items-center gap-2 text-sm text-[#8B7D6B] hover:text-[#1a2332] mb-8 uppercase tracking-wider"
        style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </button>

      {/* Collection Header */}
      <div className="relative h-64 sm:h-80 md:h-96 rounded-sm overflow-hidden mb-10">
        <img
          src={collection.image}
          alt={collection.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a2332]/70 via-[#1a2332]/40 to-transparent" />
        <div className="absolute inset-0 flex items-center p-8 sm:p-12">
          <div>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl text-white"
              style={{
                fontFamily:
                  "var(--font-cormorant), Cormorant Garamond, serif",
              }}
            >
              {collection.name}
            </h1>
            <p
              className="mt-3 text-white/70 text-sm sm:text-base max-w-md leading-relaxed"
              style={{
                fontFamily:
                  "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              {collection.description}
            </p>
            <div className="flex items-baseline gap-3 mt-4">
              <span
                className="text-2xl text-[#B8956A] font-medium"
                style={{
                  fontFamily:
                    "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                €{Math.round(discountedPrice)}
              </span>
              <span
                className="text-sm text-white/40 line-through"
                style={{
                  fontFamily:
                    "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                €{collection.totalPrice}
              </span>
              <span
                className="text-xs text-[#B8956A] uppercase tracking-wider"
                style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
              >
                Save {Math.round(collection.discount * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add All Button */}
      <div className="flex justify-center mb-10">
        <motion.button
          whileHover={{ y: -2, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddAllToCart}
          className="btn-gold-shimmer text-[#1a2332] px-8 py-3.5 flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-medium"
          style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
        >
          <ShoppingBag className="w-4 h-4" />
          Add Entire Collection to Bag
        </motion.button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collectionProducts.map((product, i) =>
          product ? (
            <ProductCard key={product.id} product={product} index={i} />
          ) : null
        )}
      </div>
    </motion.div>
  );
}
