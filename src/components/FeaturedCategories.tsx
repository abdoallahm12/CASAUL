"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";

const categories = [
  {
    name: "Shirts",
    image: "/images/categories/shirts.png",
    category: "shirts",
  },
  {
    name: "Trousers",
    image: "/images/categories/trousers.png",
    category: "trousers",
  },
  {
    name: "Shoes",
    image: "/images/categories/shoes.png",
    category: "shoes",
  },
  {
    name: "Accessories",
    image: "/images/categories/accessories.png",
    category: "accessories",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function FeaturedCategories() {
  const { setView, setShopCategoryFilter } = useStore();

  const handleCategoryClick = (category: string) => {
    setShopCategoryFilter(category);
    setView("shop");
  };

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2
          className="text-3xl sm:text-4xl md:text-5xl text-[#1a2332]"
          style={{
            fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
          }}
        >
          Curated Categories
        </h2>
        <div className="w-16 h-[2px] bg-[#B8956A] mx-auto mt-4" />
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {categories.map((cat) => (
          <motion.div
            key={cat.name}
            variants={itemVariants}
            whileHover={{ y: -4 }}
            onClick={() => handleCategoryClick(cat.category)}
            className="group relative cursor-pointer overflow-hidden rounded-sm border border-transparent hover:border-[#B8956A] transition-all duration-300"
          >
            <div className="aspect-[3/4] overflow-hidden bg-[#E8E4DB]">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a2332]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3
                className="text-xl text-white mb-2"
                style={{
                  fontFamily:
                    "var(--font-cormorant), Cormorant Garamond, serif",
                }}
              >
                {cat.name}
              </h3>
              <span className="inline-flex items-center text-xs text-white/80 uppercase tracking-[0.15em] group-hover:text-[#B8956A] transition-colors"
                style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
              >
                Shop Now
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
