"use client";

import { useState, useEffect } from "react";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";

const navItems = [
  { label: "Shirts", category: "shirts" },
  { label: "Trousers", category: "trousers" },
  { label: "Shoes", category: "shoes" },
  { label: "Accessories", category: "accessories" },
  { label: "Collections", category: "collections" },
  { label: "About", category: null },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    setIsSearchOpen,
    setIsCartOpen,
    setView,
    setShopCategoryFilter,
    getCartCount,
    siteSettings,
  } = useStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (category: string | null) => {
    setMobileMenuOpen(false);
    if (category === "collections") {
      setView("home");
      setTimeout(() => {
        const el = document.getElementById("collections-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else if (category === null) {
      setView("home");
      setTimeout(() => {
        const el = document.getElementById("newsletter-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      setShopCategoryFilter(category);
      setView("shop");
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#F5F3EE]/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <button
              onClick={() => {
                setView("home");
                setShopCategoryFilter(null);
              }}
              className="flex-shrink-0"
            >
              <h1
                className="text-2xl sm:text-3xl tracking-[0.3em] font-light"
                style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}
              >
                {siteSettings.logo}
              </h1>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.category)}
                  className="underline-anim text-sm tracking-[0.15em] uppercase text-[#1a2332] hover:text-[#B8956A] transition-colors"
                  style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:text-[#B8956A] transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  const store = useStore.getState();
                  if (store.isAdminLoggedIn) {
                    setView("admin-dashboard");
                  } else {
                    setView("admin-login");
                  }
                }}
                className="p-2 hover:text-[#B8956A] transition-colors hidden sm:block"
                aria-label="User"
              >
                <User className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 hover:text-[#B8956A] transition-colors relative"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#B8956A] text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                    {getCartCount()}
                  </span>
                )}
              </button>
              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 lg:hidden hover:text-[#B8956A] transition-colors"
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-72 bg-[#FDFBF7] shadow-2xl"
            >
              <div className="pt-24 px-6">
                <nav className="flex flex-col space-y-6">
                  {navItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleNavClick(item.category)}
                      className="text-left text-lg tracking-[0.1em] uppercase text-[#1a2332] hover:text-[#B8956A] transition-colors"
                      style={{
                        fontFamily:
                          "var(--font-lato), Lato, sans-serif",
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      const store = useStore.getState();
                      if (store.isAdminLoggedIn) {
                        setView("admin-dashboard");
                      } else {
                        setView("admin-login");
                      }
                    }}
                    className="text-left text-lg tracking-[0.1em] uppercase text-[#1a2332] hover:text-[#B8956A] transition-colors"
                    style={{
                      fontFamily: "var(--font-lato), Lato, sans-serif",
                    }}
                  >
                    Admin
                  </button>
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
