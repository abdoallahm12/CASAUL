"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";

export default function Collections() {
  const { collections, products, setView, setSelectedCollectionId } = useStore();

  const handleCollectionClick = (collectionId: string) => {
    setSelectedCollectionId(collectionId);
    setView("collection");
  };

  return (
    <section
      id="collections-section"
      className="py-16 sm:py-24 bg-[#1a2332]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-3xl sm:text-4xl md:text-5xl text-white"
            style={{
              fontFamily:
                "var(--font-cormorant), Cormorant Garamond, serif",
            }}
          >
            Curated Collections
          </h2>
          <div className="w-16 h-[2px] bg-[#B8956A] mx-auto mt-4" />
          <p
            className="mt-4 text-white/50 text-sm max-w-xl mx-auto"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            Each collection tells a story — thoughtfully assembled to create a
            complete wardrobe of effortless distinction.
          </p>
        </motion.div>

        <div className="space-y-8">
          {collections.map((collection, index) => {
            const collectionProducts = collection.products
              .map((pid) => products.find((p) => p.id === pid))
              .filter(Boolean);
            const discountedPrice =
              collection.totalPrice * (1 - collection.discount);

            return (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-sm cursor-pointer"
                onClick={() => handleCollectionClick(collection.id)}
              >
                {/* Background Image */}
                <div className="relative h-72 sm:h-96 md:h-[450px]">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1a2332]/80 via-[#1a2332]/50 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 flex items-center p-8 sm:p-12">
                    <div className="max-w-xl">
                      <h3
                        className="text-2xl sm:text-3xl md:text-4xl text-white mb-3"
                        style={{
                          fontFamily:
                            "var(--font-cormorant), Cormorant Garamond, serif",
                        }}
                      >
                        {collection.name}
                      </h3>
                      <p
                        className="text-white/70 text-sm sm:text-base leading-relaxed mb-6 max-w-md"
                        style={{
                          fontFamily:
                            "var(--font-montserrat), Montserrat, sans-serif",
                        }}
                      >
                        {collection.description}
                      </p>

                      {/* Product Thumbnails */}
                      <div className="flex gap-3 mb-6">
                        {collectionProducts.map(
                          (prod) =>
                            prod && (
                              <div
                                key={prod.id}
                                className="w-14 h-18 sm:w-16 sm:h-20 rounded-sm overflow-hidden border border-white/20"
                              >
                                <img
                                  src={prod.images.front}
                                  alt={prod.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )
                        )}
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-3 mb-4">
                        <span
                          className="text-xl sm:text-2xl text-[#B8956A] font-medium"
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
                          style={{
                            fontFamily: "var(--font-lato), Lato, sans-serif",
                          }}
                        >
                          Save {Math.round(collection.discount * 100)}%
                        </span>
                      </div>

                      <motion.button
                        whileHover={{ x: 4 }}
                        className="inline-flex items-center gap-2 text-xs text-[#B8956A] uppercase tracking-[0.15em]"
                        style={{
                          fontFamily: "var(--font-lato), Lato, sans-serif",
                        }}
                      >
                        Complete the Look
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
