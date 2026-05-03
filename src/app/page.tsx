"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/lib/store";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedCategories from "@/components/FeaturedCategories";
import ProductGrid from "@/components/ProductGrid";
import Collections from "@/components/Collections";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import ProductDetail from "@/components/ProductDetail";
import CollectionDetail from "@/components/CollectionDetail";
import CartDrawer from "@/components/CartDrawer";
import SearchModal from "@/components/SearchModal";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard from "@/components/AdminDashboard";

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="scroll-progress" style={{ width: `${progress}%` }} />
  );
}

export default function Home() {
  const { currentView, setView, setShopCategoryFilter } = useStore();

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentView]);

  const renderContent = () => {
    switch (currentView) {
      case "home":
        return (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Hero />
            <FeaturedCategories />
            <ProductGrid limit={4} />
            <Collections />
            <Newsletter />
            <Footer />
          </motion.div>
        );

      case "shop":
        return (
          <motion.div
            key="shop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="pt-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                <h1
                  className="text-3xl sm:text-4xl text-[#1a2332]"
                  style={{
                    fontFamily:
                      "var(--font-cormorant), Cormorant Garamond, serif",
                  }}
                >
                  Our Collection
                </h1>
                <div className="w-12 h-[2px] bg-[#B8956A] mt-3" />
              </div>
            </div>
            <ProductGrid />
            <Footer />
          </motion.div>
        );

      case "product":
        return (
          <motion.div
            key="product"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ProductDetail />
            <Footer />
          </motion.div>
        );

      case "collection":
        return (
          <motion.div
            key="collection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <CollectionDetail />
            <Footer />
          </motion.div>
        );

      case "admin-login":
        return (
          <motion.div
            key="admin-login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <AdminLogin />
          </motion.div>
        );

      case "admin-dashboard":
        return (
          <motion.div
            key="admin-dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <AdminDashboard />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3EE]">
      <ScrollProgress />

      {/* Header is always visible except on admin pages */}
      {currentView !== "admin-login" && currentView !== "admin-dashboard" && (
        <Header />
      )}

      <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>

      {/* Always mounted overlays */}
      <CartDrawer />
      <SearchModal />
    </div>
  );
}
