"use client";

import { useStore } from "@/lib/store";

export default function Footer() {
  const { siteSettings, setView, setShopCategoryFilter } = useStore();

  const handleCategoryClick = (category: string) => {
    setShopCategoryFilter(category);
    setView("shop");
  };

  return (
    <footer className="bg-[#1a2332] border-t border-[#B8956A]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3
              className="text-2xl tracking-[0.3em] text-white"
              style={{
                fontFamily:
                  "var(--font-cormorant), Cormorant Garamond, serif",
              }}
            >
              {siteSettings.logo}
            </h3>
            <p
              className="mt-3 text-white/40 text-sm leading-relaxed max-w-xs"
              style={{
                fontFamily:
                  "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              Timeless elegance, crafted for the discerning gentleman who
              values heritage, quality, and understated luxury.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-xs uppercase tracking-[0.15em] text-[#B8956A] mb-4"
              style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
            >
              Collections
            </h4>
            <ul className="space-y-2.5">
              {["shirts", "trousers", "shoes", "accessories"].map(
                (cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => handleCategoryClick(cat)}
                      className="text-sm text-white/50 hover:text-white transition-colors capitalize"
                      style={{
                        fontFamily:
                          "var(--font-montserrat), Montserrat, sans-serif",
                      }}
                    >
                      {cat}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4
              className="text-xs uppercase tracking-[0.15em] text-[#B8956A] mb-4"
              style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
            >
              Company
            </h4>
            <ul className="space-y-2.5">
              {["About Us", "Our Heritage", "Sustainability", "Careers"].map(
                (link) => (
                  <li key={link}>
                    <button
                      className="text-sm text-white/50 hover:text-white transition-colors"
                      style={{
                        fontFamily:
                          "var(--font-montserrat), Montserrat, sans-serif",
                      }}
                    >
                      {link}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-xs uppercase tracking-[0.15em] text-[#B8956A] mb-4"
              style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
            >
              Contact
            </h4>
            <ul className="space-y-2.5">
              <li
                className="text-sm text-white/50"
                style={{
                  fontFamily:
                    "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                {siteSettings.phone}
              </li>
              <li
                className="text-sm text-white/50"
                style={{
                  fontFamily:
                    "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                {siteSettings.email}
              </li>
              <li
                className="text-sm text-white/50"
                style={{
                  fontFamily:
                    "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                {siteSettings.address}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-xs text-white/30"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            © {new Date().getFullYear()} {siteSettings.logo}. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Cookies"].map((link) => (
              <button
                key={link}
                className="text-xs text-white/30 hover:text-white/60 transition-colors"
                style={{
                  fontFamily:
                    "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
