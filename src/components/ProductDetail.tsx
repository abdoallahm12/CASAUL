"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  RotateCw,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export default function ProductDetail() {
  const {
    products,
    selectedProductId,
    setView,
    addToCart,
    toggleWishlist,
    wishlist,
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId);

  const [selectedSize, setSelectedSize] = useState<string>(
    product?.sizes[0] || "M"
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product?.colors[0].name || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [isRotating, setIsRotating] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#8B7D6B]">Product not found</p>
      </div>
    );
  }

  const isWished = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
    toast.success("Added to bag", {
      description: `${product.name} - ${selectedSize}, ${selectedColor}`,
    });
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product.id);
    toast.success(
      isWished ? "Removed from wishlist" : "Added to wishlist",
      {
        description: product.name,
      }
    );
  };

  const handle3DRotation = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 2000);
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
        onClick={() => setView("shop")}
        className="flex items-center gap-2 text-sm text-[#8B7D6B] hover:text-[#1a2332] mb-8 uppercase tracking-wider"
        style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Shop
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Left: Image */}
        <div>
          <div className="relative bg-[#E8E4DB] rounded-sm overflow-hidden">
            <img
              src={product.images.front}
              alt={product.name}
              className={`w-full aspect-[3/4] object-cover transition-transform duration-700 ${
                isRotating ? "rotate-3d" : ""
              }`}
            />
            <button
              onClick={handle3DRotation}
              className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-[#B8956A] hover:text-white transition-colors"
              aria-label="3D view"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnail Gallery */}
          <div className="flex gap-3 mt-4">
            <div className="w-20 h-24 bg-[#E8E4DB] rounded-sm overflow-hidden border-2 border-[#B8956A]">
              <img
                src={product.images.front}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.colors.slice(1, 4).map((color) => (
              <div
                key={color.name}
                className="w-20 h-24 rounded-sm overflow-hidden border border-[#E8E4DB] flex items-center justify-center"
                style={{ backgroundColor: color.hex + "30" }}
              >
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: color.hex }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="lg:py-4">
          <h1
            className="text-3xl sm:text-4xl text-[#1a2332]"
            style={{
              fontFamily:
                "var(--font-cormorant), Cormorant Garamond, serif",
            }}
          >
            {product.name}
          </h1>

          <p
            className="text-sm text-[#8B7D6B] mt-2 uppercase tracking-wider"
            style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
          >
            {product.category} — Made in {product.madeIn}
          </p>

          <p
            className="text-2xl font-medium text-[#B8956A] mt-4"
            style={{
              fontFamily:
                "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            €{product.price}
          </p>

          <p
            className="text-sm text-[#8B7D6B] mt-6 leading-relaxed"
            style={{
              fontFamily:
                "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            {product.description}
          </p>

          {/* Size Selector */}
          <div className="mt-8">
            <h4
              className="text-xs uppercase tracking-[0.15em] text-[#1a2332] mb-3 font-medium"
              style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
            >
              Size
            </h4>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`size-btn ${
                    selectedSize === size ? "active" : ""
                  }`}
                  style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div className="mt-6">
            <h4
              className="text-xs uppercase tracking-[0.15em] text-[#1a2332] mb-3 font-medium"
              style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
            >
              Color — {selectedColor}
            </h4>
            <div className="flex gap-3">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`color-dot ${
                    selectedColor === color.name ? "active" : ""
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <h4
              className="text-xs uppercase tracking-[0.15em] text-[#1a2332] mb-3 font-medium"
              style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
            >
              Quantity
            </h4>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-[#3D3D3D] rounded-sm flex items-center justify-center hover:bg-[#1a2332] hover:text-white transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span
                className="text-lg min-w-[2rem] text-center"
                style={{
                  fontFamily:
                    "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border border-[#3D3D3D] rounded-sm flex items-center justify-center hover:bg-[#1a2332] hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <motion.button
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="flex-1 btn-gold-shimmer text-[#1a2332] py-3.5 flex items-center justify-center gap-2 text-xs tracking-[0.2em] uppercase font-medium"
              style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Bag
            </motion.button>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleToggleWishlist}
              className={`px-6 py-3.5 border text-xs tracking-[0.2em] uppercase font-medium flex items-center gap-2 transition-colors ${
                isWished
                  ? "border-[#6B2C3E] bg-[#6B2C3E] text-white"
                  : "border-[#3D3D3D] text-[#1a2332] hover:border-[#B8956A] hover:text-[#B8956A]"
              }`}
              style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
            >
              <Heart
                className={`w-4 h-4 ${isWished ? "fill-current" : ""}`}
              />
              {isWished ? "Saved" : "Wishlist"}
            </motion.button>
          </div>

          {/* Details Section */}
          <div className="mt-10 border-t border-[#E8E4DB] pt-8 space-y-6">
            <div>
              <h4
                className="text-xs uppercase tracking-[0.15em] text-[#1a2332] mb-2 font-medium"
                style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
              >
                Materials
              </h4>
              <p
                className="text-sm text-[#8B7D6B]"
                style={{
                  fontFamily:
                    "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                {product.materials.join(", ")}
              </p>
            </div>
            <div>
              <h4
                className="text-xs uppercase tracking-[0.15em] text-[#1a2332] mb-2 font-medium"
                style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
              >
                Care Instructions
              </h4>
              <ul className="space-y-1">
                {product.care.map((c) => (
                  <li
                    key={c}
                    className="text-sm text-[#8B7D6B]"
                    style={{
                      fontFamily:
                        "var(--font-montserrat), Montserrat, sans-serif",
                    }}
                  >
                    • {c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4
                className="text-xs uppercase tracking-[0.15em] text-[#1a2332] mb-2 font-medium"
                style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
              >
                Made In
              </h4>
              <p
                className="text-sm text-[#8B7D6B]"
                style={{
                  fontFamily:
                    "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                {product.madeIn}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
