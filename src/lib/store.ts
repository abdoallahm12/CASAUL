"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  defaultProducts,
  defaultCollections,
  defaultSiteSettings,
  type Product,
  type Collection,
  type SiteSettings,
} from "./data";

export type ViewType =
  | "home"
  | "shop"
  | "product"
  | "collection"
  | "admin-login"
  | "admin-dashboard";

export interface CartItem {
  productId: string;
  size: string;
  color: string;
  quantity: number;
}

interface StoreState {
  currentView: ViewType;
  selectedProductId: string | null;
  selectedCollectionId: string | null;
  cart: CartItem[];
  wishlist: string[];
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isAdminLoggedIn: boolean;
  products: Product[];
  collections: Collection[];
  siteSettings: SiteSettings;
  shopCategoryFilter: string | null;
  loginAttempts: number;
  loginLockedUntil: number;

  // Actions
  setView: (view: ViewType) => void;
  setSelectedProductId: (id: string | null) => void;
  setSelectedCollectionId: (id: string | null) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateCartQuantity: (
    productId: string,
    size: string,
    color: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  loginAdmin: (email: string, password: string) => boolean;
  logoutAdmin: () => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCollection: (collection: Collection) => void;
  updateCollection: (id: string, collection: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  setShopCategoryFilter: (category: string | null) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      currentView: "home",
      selectedProductId: null,
      selectedCollectionId: null,
      cart: [],
      wishlist: [],
      isCartOpen: false,
      isSearchOpen: false,
      isAdminLoggedIn: false,
      products: defaultProducts,
      collections: defaultCollections,
      siteSettings: defaultSiteSettings,
      shopCategoryFilter: null,
      loginAttempts: 0,
      loginLockedUntil: 0,

      setView: (view) => set({ currentView: view }),
      setSelectedProductId: (id) => set({ selectedProductId: id }),
      setSelectedCollectionId: (id) => set({ selectedCollectionId: id }),

      addToCart: (item) =>
        set((state) => {
          const existing = state.cart.find(
            (c) =>
              c.productId === item.productId &&
              c.size === item.size &&
              c.color === item.color
          );
          if (existing) {
            return {
              cart: state.cart.map((c) =>
                c.productId === item.productId &&
                c.size === item.size &&
                c.color === item.color
                  ? { ...c, quantity: c.quantity + item.quantity }
                  : c
              ),
            };
          }
          return { cart: [...state.cart, item] };
        }),

      removeFromCart: (productId, size, color) =>
        set((state) => ({
          cart: state.cart.filter(
            (c) =>
              !(
                c.productId === productId &&
                c.size === size &&
                c.color === color
              )
          ),
        })),

      updateCartQuantity: (productId, size, color, quantity) =>
        set((state) => ({
          cart: state.cart.map((c) =>
            c.productId === productId && c.size === size && c.color === color
              ? { ...c, quantity: Math.max(1, quantity) }
              : c
          ),
        })),

      clearCart: () => set({ cart: [] }),

      toggleWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.includes(productId)
            ? state.wishlist.filter((id) => id !== productId)
            : [...state.wishlist, productId],
        })),

      setIsCartOpen: (open) => set({ isCartOpen: open }),
      setIsSearchOpen: (open) => set({ isSearchOpen: open }),

      loginAdmin: (email, password) => {
        const state = get();
        if (state.loginLockedUntil > Date.now()) return false;
        if (email === "admin@casual.com" && password === "casual2024") {
          set({ isAdminLoggedIn: true, loginAttempts: 0, loginLockedUntil: 0 });
          return true;
        }
        const newAttempts = state.loginAttempts + 1;
        if (newAttempts >= 5) {
          set({
            loginAttempts: 0,
            loginLockedUntil: Date.now() + 5 * 60 * 1000,
          });
        } else {
          set({ loginAttempts: newAttempts });
        }
        return false;
      },

      logoutAdmin: () => set({ isAdminLoggedIn: false }),

      addProduct: (product) =>
        set((state) => ({ products: [...state.products, product] })),

      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      addCollection: (collection) =>
        set((state) => ({
          collections: [...state.collections, collection],
        })),

      updateCollection: (id, updates) =>
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      deleteCollection: (id) =>
        set((state) => ({
          collections: state.collections.filter((c) => c.id !== id),
        })),

      updateSiteSettings: (settings) =>
        set((state) => ({
          siteSettings: { ...state.siteSettings, ...settings },
        })),

      setShopCategoryFilter: (category) =>
        set({ shopCategoryFilter: category }),

      getCartTotal: () => {
        const state = get();
        return state.cart.reduce((total, item) => {
          const product = state.products.find((p) => p.id === item.productId);
          return total + (product ? product.price * item.quantity : 0);
        }, 0);
      },

      getCartCount: () => {
        const state = get();
        return state.cart.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "casual-store",
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        isAdminLoggedIn: state.isAdminLoggedIn,
        products: state.products,
        collections: state.collections,
        siteSettings: state.siteSettings,
        loginAttempts: state.loginAttempts,
        loginLockedUntil: state.loginLockedUntil,
      }),
    }
  )
);
