"use client";

import { motion } from "framer-motion";
import { Heart, Eye, Plus } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/data";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { setView, setSelectedProductId, toggleWishlist, wishlist, addToCart } =
    useStore();
  const isWished = wishlist.includes(product.id);

  const handleCardClick = () => {
    setSelectedProductId(product.id);
    setView("product");
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProductId(product.id);
    setView("product");
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      productId: product.id,
      size: product.sizes[0],
      color: product.colors[0].name,
      quantity: 1,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="product-card group cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden rounded-sm bg-[#E8E4DB]">
        {/* Product Image */}
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={product.images.front}
            alt={product.name}
            className="product-image w-full h-full object-cover"
          />
        </div>

        {/* Hover Overlay */}
        <div className="product-overlay absolute inset-0 bg-[#1a2332]/20 flex items-center justify-center gap-3">
          <button
            onClick={handleQuickView}
            className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-[#B8956A] hover:text-white transition-colors"
            aria-label="Quick view"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={handleWishlist}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              isWished
                ? "bg-[#6B2C3E] text-white"
                : "bg-white/90 hover:bg-[#6B2C3E] hover:text-white"
            }`}
            aria-label="Toggle wishlist"
          >
            <Heart className={`w-4 h-4 ${isWished ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={handleAddToCart}
            className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-[#B8956A] hover:text-white transition-colors"
            aria-label="Add to cart"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Color Dots on Hover */}
        <div className="product-overlay absolute bottom-3 left-3 flex gap-1.5">
          {product.colors.map((color) => (
            <span
              key={color.name}
              className="w-4 h-4 rounded-full border border-white/60 shadow-sm"
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-3.5 pb-2">
        <h3
          className="text-lg text-[#1a2332] group-hover:text-[#B8956A] transition-colors"
          style={{
            fontFamily:
              "var(--font-cormorant), Cormorant Garamond, serif",
          }}
        >
          {product.name}
        </h3>
        <p
          className="text-xs text-[#8B7D6B] mt-1 line-clamp-1"
          style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
          }}
        >
          {product.description}
        </p>
        <p
          className="text-base font-medium text-[#B8956A] mt-2"
          style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
          }}
        >
          €{product.price}
        </p>
      </div>
    </motion.div>
  );
}
