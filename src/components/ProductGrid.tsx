"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import { useStore } from "@/lib/store";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/data";

interface ProductGridProps {
  limit?: number;
}

type SortOption = "price-asc" | "price-desc" | "name-asc";

const allCategories = ["shirts", "trousers", "shoes", "accessories"];
const allSizes = ["S", "M", "L", "XL", "XXL"];
const allMaterials = ["Cotton", "Linen", "Wool", "Silk", "Leather"];

interface FilterSidebarProps {
  selectedCategories: string[];
  toggleCategory: (cat: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedSizes: string[];
  toggleSize: (size: string) => void;
  selectedMaterials: string[];
  toggleMaterial: (mat: string) => void;
  hasActiveFilters: boolean;
  clearFilters: () => void;
  expandedSections: Record<string, boolean>;
  toggleSection: (section: string) => void;
  onApply?: () => void;
}

function FilterSidebar({
  selectedCategories,
  toggleCategory,
  priceRange,
  setPriceRange,
  selectedSizes,
  toggleSize,
  selectedMaterials,
  toggleMaterial,
  hasActiveFilters,
  clearFilters,
  expandedSections,
  toggleSection,
  onApply,
}: FilterSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3
          className="text-xl text-[#1a2332]"
          style={{
            fontFamily:
              "var(--font-cormorant), Cormorant Garamond, serif",
          }}
        >
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-[#B8956A] hover:underline uppercase tracking-wider"
            style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <button
          onClick={() => toggleSection("category")}
          className="flex items-center justify-between w-full text-sm font-medium text-[#1a2332] mb-3 uppercase tracking-wider"
          style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
        >
          Category
          {expandedSections.category ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.category && (
          <div className="space-y-2.5">
            {allCategories.map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-2.5 cursor-pointer text-sm text-[#8B7D6B] hover:text-[#1a2332] capitalize"
                style={{
                  fontFamily:
                    "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                  className="filter-checkbox"
                />
                {cat}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div>
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full text-sm font-medium text-[#1a2332] mb-3 uppercase tracking-wider"
          style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
        >
          Price Range
          {expandedSections.price ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.price && (
          <div>
            <div className="flex justify-between text-xs text-[#8B7D6B] mb-2">
              <span>€{priceRange[0]}</span>
              <span>€{priceRange[1]}</span>
            </div>
            <input
              type="range"
              min={50}
              max={600}
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], parseInt(e.target.value)])
              }
              className="w-full h-1 bg-[#E8E4DB] rounded-lg appearance-none cursor-pointer accent-[#B8956A]"
            />
          </div>
        )}
      </div>

      {/* Size */}
      <div>
        <button
          onClick={() => toggleSection("size")}
          className="flex items-center justify-between w-full text-sm font-medium text-[#1a2332] mb-3 uppercase tracking-wider"
          style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
        >
          Size
          {expandedSections.size ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.size && (
          <div className="flex flex-wrap gap-2">
            {allSizes.map((size) => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`px-3 py-1.5 text-xs border rounded-sm transition-all ${
                  selectedSizes.includes(size)
                    ? "bg-[#1a2332] text-white border-[#1a2332]"
                    : "border-[#3D3D3D] text-[#8B7D6B] hover:border-[#B8956A]"
                }`}
                style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Material */}
      <div>
        <button
          onClick={() => toggleSection("material")}
          className="flex items-center justify-between w-full text-sm font-medium text-[#1a2332] mb-3 uppercase tracking-wider"
          style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
        >
          Material
          {expandedSections.material ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.material && (
          <div className="space-y-2.5">
            {allMaterials.map((mat) => (
              <label
                key={mat}
                className="flex items-center gap-2.5 cursor-pointer text-sm text-[#8B7D6B] hover:text-[#1a2332]"
                style={{
                  fontFamily:
                    "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedMaterials.includes(mat)}
                  onChange={() => toggleMaterial(mat)}
                  className="filter-checkbox"
                />
                {mat}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Apply Button */}
      {onApply && (
        <button
          onClick={onApply}
          className="w-full bg-[#1a2332] text-white py-3 text-xs tracking-[0.15em] uppercase hover:bg-[#B8956A] transition-colors"
          style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
        >
          Apply Filters
        </button>
      )}
    </div>
  );
}

export default function ProductGrid({ limit }: ProductGridProps) {
  const { products, shopCategoryFilter, setShopCategoryFilter } = useStore();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    shopCategoryFilter ? [shopCategoryFilter] : []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 600]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("price-asc");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    size: true,
    color: true,
    material: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleMaterial = (mat: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(mat) ? prev.filter((m) => m !== mat) : [...prev, mat]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([50, 600]);
    setSelectedSizes([]);
    setSelectedMaterials([]);
    setShopCategoryFilter(null);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    if (selectedSizes.length > 0) {
      result = result.filter((p) =>
        p.sizes.some((s) => selectedSizes.includes(s))
      );
    }

    if (selectedMaterials.length > 0) {
      result = result.filter((p) =>
        p.materials.some((m) =>
          selectedMaterials.some((sm) =>
            m.toLowerCase().includes(sm.toLowerCase())
          )
        )
      );
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [
    products,
    selectedCategories,
    priceRange,
    selectedSizes,
    selectedMaterials,
    sortBy,
  ]);

  const displayProducts = limit ? filteredProducts.slice(0, limit) : filteredProducts;

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    priceRange[0] > 50 ||
    priceRange[1] < 600 ||
    selectedSizes.length > 0 ||
    selectedMaterials.length > 0;

  return (
    <section
      id={limit ? "featured-products" : "shop-section"}
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {limit && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2
            className="text-3xl sm:text-4xl md:text-5xl text-[#1a2332]"
            style={{
              fontFamily:
                "var(--font-cormorant), Cormorant Garamond, serif",
            }}
          >
            Featured Pieces
          </h2>
          <div className="w-16 h-[2px] bg-[#B8956A] mx-auto mt-4" />
        </motion.div>
      )}

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        {!limit && (
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-[#FDFBF7] p-6 rounded-sm border border-[#E8E4DB]">
              <FilterSidebar
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedSizes={selectedSizes}
                toggleSize={toggleSize}
                selectedMaterials={selectedMaterials}
                toggleMaterial={toggleMaterial}
                hasActiveFilters={hasActiveFilters}
                clearFilters={clearFilters}
                expandedSections={expandedSections}
                toggleSection={toggleSection}
              />
            </div>
          </aside>
        )}

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          {!limit && (
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 text-sm text-[#8B7D6B] hover:text-[#1a2332]"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>
                <span
                  className="text-sm text-[#8B7D6B]"
                  style={{
                    fontFamily:
                      "var(--font-montserrat), Montserrat, sans-serif",
                  }}
                >
                  {displayProducts.length} product
                  {displayProducts.length !== 1 ? "s" : ""}
                </span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-sm border border-[#E8E4DB] bg-transparent px-3 py-2 text-[#1a2332] rounded-sm focus:outline-none focus:border-[#B8956A]"
                style={{
                  fontFamily:
                    "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>
          )}

          {/* Product Grid */}
          <div
            className={`grid gap-6 ${
              limit
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {displayProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          {displayProducts.length === 0 && (
            <div className="text-center py-16">
              <p
                className="text-lg text-[#8B7D6B]"
                style={{
                  fontFamily:
                    "var(--font-cormorant), Cormorant Garamond, serif",
                }}
              >
                No products match your criteria
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-[#B8956A] hover:underline uppercase tracking-wider"
                style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 h-full w-80 bg-[#FDFBF7] p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3
                  className="text-xl text-[#1a2332]"
                  style={{
                    fontFamily:
                      "var(--font-cormorant), Cormorant Garamond, serif",
                  }}
                >
                  Filters
                </h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterSidebar
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedSizes={selectedSizes}
                toggleSize={toggleSize}
                selectedMaterials={selectedMaterials}
                toggleMaterial={toggleMaterial}
                hasActiveFilters={hasActiveFilters}
                clearFilters={clearFilters}
                expandedSections={expandedSections}
                toggleSection={toggleSection}
                onApply={() => setMobileFiltersOpen(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
