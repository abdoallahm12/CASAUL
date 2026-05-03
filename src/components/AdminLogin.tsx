"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export default function AdminLogin() {
  const { loginAdmin, loginLockedUntil, setView } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const isLocked = loginLockedUntil > Date.now();
  const lockTimeRemaining = isLocked
    ? Math.ceil((loginLockedUntil - Date.now()) / 60000)
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) {
      toast.error("Account locked", {
        description: `Please try again in ${lockTimeRemaining} minute${lockTimeRemaining > 1 ? "s" : ""}`,
      });
      return;
    }

    const success = loginAdmin(email, password);
    if (success) {
      toast.success("Welcome back", {
        description: "Admin access granted",
      });
      setView("admin-dashboard");
    } else {
      toast.error("Invalid credentials", {
        description: "Please check your email and password",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3EE] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#FDFBF7] p-8 sm:p-10 rounded-sm border border-[#E8E4DB] shadow-lg">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1
              className="text-3xl tracking-[0.3em] text-[#1a2332]"
              style={{
                fontFamily:
                  "var(--font-cormorant), Cormorant Garamond, serif",
              }}
            >
              CASUAL
            </h1>
            <div className="w-8 h-[2px] bg-[#B8956A] mx-auto mt-3" />
            <p
              className="mt-3 text-sm text-[#8B7D6B] uppercase tracking-[0.15em]"
              style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
            >
              Admin Access
            </p>
          </div>

          {/* Lock Warning */}
          {isLocked && (
            <div className="mb-6 p-3 bg-[#6B2C3E]/10 border border-[#6B2C3E]/20 rounded-sm text-center">
              <p
                className="text-sm text-[#6B2C3E]"
                style={{
                  fontFamily:
                    "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                Too many failed attempts. Try again in {lockTimeRemaining}{" "}
                minute{lockTimeRemaining > 1 ? "s" : ""}.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                className="block text-xs uppercase tracking-[0.15em] text-[#1a2332] mb-2 font-medium"
                style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7D6B]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@casual.com"
                  required
                  disabled={isLocked}
                  className="w-full pl-10 pr-4 py-3 bg-[#F5F3EE] border border-[#E8E4DB] rounded-sm text-sm text-[#1a2332] placeholder:text-[#8B7D6B]/50 focus:outline-none focus:border-[#B8956A] transition-colors disabled:opacity-50"
                  style={{
                    fontFamily:
                      "var(--font-montserrat), Montserrat, sans-serif",
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-xs uppercase tracking-[0.15em] text-[#1a2332] mb-2 font-medium"
                style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7D6B]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLocked}
                  className="w-full pl-10 pr-12 py-3 bg-[#F5F3EE] border border-[#E8E4DB] rounded-sm text-sm text-[#1a2332] placeholder:text-[#8B7D6B]/50 focus:outline-none focus:border-[#B8956A] transition-colors disabled:opacity-50"
                  style={{
                    fontFamily:
                      "var(--font-montserrat), Montserrat, sans-serif",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B7D6B] hover:text-[#1a2332] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="filter-checkbox"
              />
              <label
                htmlFor="remember"
                className="text-sm text-[#8B7D6B] cursor-pointer"
                style={{
                  fontFamily:
                    "var(--font-montserrat), Montserrat, sans-serif",
                }}
              >
                Remember me
              </label>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLocked}
              className="w-full btn-gold-shimmer text-[#1a2332] py-3.5 text-xs tracking-[0.2em] uppercase font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
            >
              Sign In
            </motion.button>
          </form>

          {/* Back */}
          <button
            onClick={() => setView("home")}
            className="w-full mt-6 text-xs text-[#8B7D6B] hover:text-[#B8956A] uppercase tracking-wider transition-colors"
            style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
          >
            ← Return to Store
          </button>
        </div>
      </motion.div>
    </div>
  );
}
