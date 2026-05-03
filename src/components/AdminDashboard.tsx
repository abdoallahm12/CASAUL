"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Settings,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  ArrowLeft,
} from "lucide-react";
import { useStore } from "@/lib/store";
import type { Product, Collection, SiteSettings } from "@/lib/data";
import { toast } from "sonner";

type TabType = "overview" | "products" | "collections" | "settings";

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: "products", label: "Products", icon: <Package className="w-4 h-4" /> },
  { id: "collections", label: "Collections", icon: <FolderOpen className="w-4 h-4" /> },
  { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
];

export default function AdminDashboard() {
  const {
    products,
    collections,
    siteSettings,
    addProduct,
    updateProduct,
    deleteProduct,
    addCollection,
    updateCollection,
    deleteCollection,
    updateSiteSettings,
    logoutAdmin,
    setView,
  } = useStore();

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [isAddingCollection, setIsAddingCollection] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logoutAdmin();
    setView("home");
    toast.success("Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-[#F5F3EE] flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-[#1a2332] text-white flex flex-col transition-all duration-300 flex-shrink-0`}
      >
        <div className="p-4 border-b border-white/10">
          <h1
            className={`tracking-[0.2em] ${sidebarOpen ? "text-xl" : "text-xs text-center"}`}
            style={{
              fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
            }}
          >
            {sidebarOpen ? "CASUAL" : "C"}
          </h1>
          {sidebarOpen && (
            <p
              className="text-[10px] text-white/40 uppercase tracking-widest mt-1"
              style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
            >
              Admin Panel
            </p>
          )}
        </div>

        <nav className="flex-1 py-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                activeTab === tab.id
                  ? "bg-[#B8956A]/20 text-[#B8956A]"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
              style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
            >
              {tab.icon}
              {sidebarOpen && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => setView("home")}
            className="w-full flex items-center gap-3 text-white/60 hover:text-white text-sm transition-colors"
            style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
          >
            <ArrowLeft className="w-4 h-4" />
            {sidebarOpen && <span>View Store</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 text-[#6B2C3E] hover:text-[#B8956A] text-sm transition-colors"
            style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "overview" && (
            <OverviewTab
              products={products}
              collections={collections}
            />
          )}
          {activeTab === "products" && (
            <ProductsTab
              products={products}
              editingProduct={editingProduct}
              setEditingProduct={setEditingProduct}
              isAddingProduct={isAddingProduct}
              setIsAddingProduct={setIsAddingProduct}
              addProduct={addProduct}
              updateProduct={updateProduct}
              deleteProduct={deleteProduct}
            />
          )}
          {activeTab === "collections" && (
            <CollectionsTab
              collections={collections}
              products={products}
              editingCollection={editingCollection}
              setEditingCollection={setEditingCollection}
              isAddingCollection={isAddingCollection}
              setIsAddingCollection={setIsAddingCollection}
              addCollection={addCollection}
              updateCollection={updateCollection}
              deleteCollection={deleteCollection}
            />
          )}
          {activeTab === "settings" && (
            <SettingsTab
              siteSettings={siteSettings}
              updateSiteSettings={updateSiteSettings}
            />
          )}
        </motion.div>
      </main>
    </div>
  );
}

/* ============= OVERVIEW TAB ============= */
function OverviewTab({
  products,
  collections,
}: {
  products: Product[];
  collections: Collection[];
}) {
  const stats = [
    { label: "Total Products", value: products.length, accent: "#B8956A" },
    { label: "Collections", value: collections.length, accent: "#2C4A3E" },
    {
      label: "Avg. Price",
      value: `€${Math.round(products.reduce((a, p) => a + p.price, 0) / products.length)}`,
      accent: "#1a2332",
    },
    {
      label: "Price Range",
      value: `€${Math.min(...products.map((p) => p.price))} — €${Math.max(...products.map((p) => p.price))}`,
      accent: "#6B2C3E",
    },
  ];

  return (
    <div>
      <h2
        className="text-2xl text-[#1a2332] mb-6"
        style={{
          fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
        }}
      >
        Dashboard Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-[#FDFBF7] p-6 rounded-sm border border-[#E8E4DB]"
          >
            <p
              className="text-xs uppercase tracking-wider text-[#8B7D6B] mb-1"
              style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
            >
              {stat.label}
            </p>
            <p
              className="text-2xl font-medium"
              style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                color: stat.accent,
              }}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Category breakdown */}
      <div className="bg-[#FDFBF7] p-6 rounded-sm border border-[#E8E4DB]">
        <h3
          className="text-lg text-[#1a2332] mb-4"
          style={{
            fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
          }}
        >
          Products by Category
        </h3>
        <div className="space-y-3">
          {["shirts", "trousers", "shoes", "accessories"].map((cat) => {
            const count = products.filter((p) => p.category === cat).length;
            const pct = (count / products.length) * 100;
            return (
              <div key={cat}>
                <div className="flex justify-between text-sm mb-1">
                  <span
                    className="capitalize text-[#1a2332]"
                    style={{
                      fontFamily:
                        "var(--font-montserrat), Montserrat, sans-serif",
                    }}
                  >
                    {cat}
                  </span>
                  <span
                    className="text-[#8B7D6B]"
                    style={{
                      fontFamily:
                        "var(--font-montserrat), Montserrat, sans-serif",
                    }}
                  >
                    {count}
                  </span>
                </div>
                <div className="w-full h-2 bg-[#E8E4DB] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#B8956A] rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============= PRODUCTS TAB ============= */
function ProductsTab({
  products,
  editingProduct,
  setEditingProduct,
  isAddingProduct,
  setIsAddingProduct,
  addProduct,
  updateProduct,
  deleteProduct,
}: {
  products: Product[];
  editingProduct: Product | null;
  setEditingProduct: (p: Product | null) => void;
  isAddingProduct: boolean;
  setIsAddingProduct: (v: boolean) => void;
  addProduct: (p: Product) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}) {
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#000000");

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setIsAddingProduct(false);
    setFormData({ ...product });
  };

  const startAdd = () => {
    setIsAddingProduct(true);
    setEditingProduct(null);
    setFormData({
      id: `product_${Date.now()}`,
      name: "",
      category: "shirts",
      price: 0,
      currency: "EUR",
      description: "",
      images: { front: "/images/products/shirt-oxford-white.png" },
      sizes: ["S", "M", "L", "XL"],
      colors: [{ name: "White", hex: "#FDFBF7" }],
      materials: [],
      care: [],
      madeIn: "",
    });
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setIsAddingProduct(false);
    setFormData({});
  };

  const handleSave = () => {
    if (!formData.name || !formData.id) return;

    if (isAddingProduct) {
      addProduct(formData as Product);
      toast.success("Product added", { description: formData.name });
    } else if (editingProduct) {
      updateProduct(editingProduct.id, formData);
      toast.success("Product updated", { description: formData.name });
    }
    cancelEdit();
  };

  const handleDelete = (id: string, name: string) => {
    deleteProduct(id);
    toast.success("Product deleted", { description: name });
  };

  const addColorToForm = () => {
    if (!newColorName || !newColorHex) return;
    const colors = [...(formData.colors || []), { name: newColorName, hex: newColorHex }];
    setFormData({ ...formData, colors });
    setNewColorName("");
    setNewColorHex("#000000");
  };

  const removeColorFromForm = (idx: number) => {
    const colors = (formData.colors || []).filter((_, i) => i !== idx);
    setFormData({ ...formData, colors });
  };

  const toggleSizeInForm = (size: string) => {
    const sizes = formData.sizes || [];
    const newSizes = sizes.includes(size)
      ? sizes.filter((s) => s !== size)
      : [...sizes, size];
    setFormData({ ...formData, sizes: newSizes });
  };

  const isEditing = isAddingProduct || editingProduct !== null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-2xl text-[#1a2332]"
          style={{
            fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
          }}
        >
          Products
        </h2>
        {!isEditing && (
          <button
            onClick={startAdd}
            className="flex items-center gap-2 bg-[#B8956A] text-white px-4 py-2 text-xs tracking-wider uppercase hover:bg-[#9A7B55] transition-colors"
            style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        )}
      </div>

      {/* Product Form */}
      {isEditing && (
        <div className="bg-[#FDFBF7] p-6 rounded-sm border border-[#E8E4DB] mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-lg text-[#1a2332]"
              style={{
                fontFamily: "var(--font-cormorant), Cormorant Garamond, serif",
              }}
            >
              {isAddingProduct ? "Add New Product" : "Edit Product"}
            </h3>
            <button onClick={cancelEdit} className="p-1 text-[#8B7D6B] hover:text-[#1a2332]">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#8B7D6B] mb-1.5 font-medium" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>Product Name</label>
              <input value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 bg-[#F5F3EE] border border-[#E8E4DB] rounded-sm text-sm focus:outline-none focus:border-[#B8956A]" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#8B7D6B] mb-1.5 font-medium" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>Category</label>
              <select value={formData.category || "shirts"} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 bg-[#F5F3EE] border border-[#E8E4DB] rounded-sm text-sm focus:outline-none focus:border-[#B8956A]">
                <option value="shirts">Shirts</option>
                <option value="trousers">Trousers</option>
                <option value="shoes">Shoes</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#8B7D6B] mb-1.5 font-medium" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>Price (EUR)</label>
              <input type="number" value={formData.price || 0} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 bg-[#F5F3EE] border border-[#E8E4DB] rounded-sm text-sm focus:outline-none focus:border-[#B8956A]" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#8B7D6B] mb-1.5 font-medium" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>Image URL</label>
              <input value={formData.images?.front || ""} onChange={(e) => setFormData({ ...formData, images: { front: e.target.value } })} className="w-full px-3 py-2 bg-[#F5F3EE] border border-[#E8E4DB] rounded-sm text-sm focus:outline-none focus:border-[#B8956A]" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-[#8B7D6B] mb-1.5 font-medium" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>Description</label>
              <textarea value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-3 py-2 bg-[#F5F3EE] border border-[#E8E4DB] rounded-sm text-sm focus:outline-none focus:border-[#B8956A] resize-none" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#8B7D6B] mb-1.5 font-medium" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>Made In</label>
              <input value={formData.madeIn || ""} onChange={(e) => setFormData({ ...formData, madeIn: e.target.value })} className="w-full px-3 py-2 bg-[#F5F3EE] border border-[#E8E4DB] rounded-sm text-sm focus:outline-none focus:border-[#B8956A]" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#8B7D6B] mb-2 font-medium" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>Sizes</label>
              <div className="flex flex-wrap gap-2">
                {["S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSizeInForm(size)}
                    className={`px-3 py-1.5 text-xs border rounded-sm transition-all ${
                      (formData.sizes || []).includes(size)
                        ? "bg-[#1a2332] text-white border-[#1a2332]"
                        : "border-[#E8E4DB] text-[#8B7D6B]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-[#8B7D6B] mb-2 font-medium" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>Colors</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(formData.colors || []).map((c, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#F5F3EE] border border-[#E8E4DB] rounded-sm text-xs">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.hex }} />
                    {c.name}
                    <button type="button" onClick={() => removeColorFromForm(i)} className="text-[#8B7D6B] hover:text-[#6B2C3E]">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 items-end">
                <input value={newColorName} onChange={(e) => setNewColorName(e.target.value)} placeholder="Color name" className="flex-1 px-3 py-2 bg-[#F5F3EE] border border-[#E8E4DB] rounded-sm text-sm focus:outline-none focus:border-[#B8956A]" />
                <input type="color" value={newColorHex} onChange={(e) => setNewColorHex(e.target.value)} className="w-10 h-9 rounded border border-[#E8E4DB] cursor-pointer" />
                <button type="button" onClick={addColorToForm} className="px-3 py-2 bg-[#1a2332] text-white text-xs rounded-sm hover:bg-[#B8956A] transition-colors">
                  Add
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#8B7D6B] mb-1.5 font-medium" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>Materials (comma separated)</label>
              <input value={(formData.materials || []).join(", ")} onChange={(e) => setFormData({ ...formData, materials: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} className="w-full px-3 py-2 bg-[#F5F3EE] border border-[#E8E4DB] rounded-sm text-sm focus:outline-none focus:border-[#B8956A]" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#8B7D6B] mb-1.5 font-medium" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>Care (comma separated)</label>
              <input value={(formData.care || []).join(", ")} onChange={(e) => setFormData({ ...formData, care: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} className="w-full px-3 py-2 bg-[#F5F3EE] border border-[#E8E4DB] rounded-sm text-sm focus:outline-none focus:border-[#B8956A]" />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={handleSave} className="flex items-center gap-2 bg-[#B8956A] text-white px-5 py-2.5 text-xs tracking-wider uppercase hover:bg-[#9A7B55] transition-colors" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>
              <Save className="w-4 h-4" />
              Save
            </button>
            <button onClick={cancelEdit} className="flex items-center gap-2 border border-[#3D3D3D] px-5 py-2.5 text-xs tracking-wider uppercase text-[#8B7D6B] hover:text-[#1a2332]" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-[#FDFBF7] rounded-sm border border-[#E8E4DB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8E4DB]">
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#8B7D6B] font-medium" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>Product</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#8B7D6B] font-medium" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>Category</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#8B7D6B] font-medium" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>Price</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#8B7D6B] font-medium" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>Made In</th>
                <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-[#8B7D6B] font-medium" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-[#E8E4DB]/60 hover:bg-[#F5F3EE]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 bg-[#E8E4DB] rounded-sm overflow-hidden flex-shrink-0">
                        <img src={product.images.front} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm text-[#1a2332]" style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#8B7D6B] capitalize" style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>{product.category}</td>
                  <td className="px-4 py-3 text-sm text-[#B8956A] font-medium" style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>€{product.price}</td>
                  <td className="px-4 py-3 text-sm text-[#8B7D6B]" style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>{product.madeIn}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => startEdit(product)} className="p-1.5 text-[#8B7D6B] hover:text-[#B8956A] transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(product.id, product.name)} className="p-1.5 text-[#8B7D6B] hover:text-[#6B2C3E] transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ============= COLLECTIONS TAB ============= */
function CollectionsTab({
  collections,
  products,
  editingCollection,
  setEditingCollection,
  isAddingCollection,
  setIsAddingCollection,
  addCollection,
  updateCollection,
  deleteCollection,
}: {
  collections: Collection[];
  products: Product[];
  editingCollection: Collection | null;
  setEditingCollection: (c: Collection | null) => void;
  isAddingCollection: boolean;
  setIsAddingCollection: (v: boolean) => void;
  addCollection: (c: Collection) => void;
  updateCollection: (id: string, c: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
}) {
  const [formData, setFormData] = useState<Partial<Collection>>({});

  const startEdit = (collection: Collection) => {
    setEditingCollection(collection);
    setIsAddingCollection(false);
    setFormData({ ...collection });
  };

  const startAdd = () => {
    setIsAddingCollection(true);
    setEditingCollection(null);
    setFormData({
      id: `collection_${Date.now()}`,
      name: "",
      description: "",
      products: [],
      totalPrice: 0,
      discount: 0,
      image: "/images/collections/weekend-gentleman.png",
    });
  };

  const cancelEdit = () => {
    setEditingCollection(null);
    setIsAddingCollection(false);
    setFormData({});
  };

  const handleSave = () => {
    if (!formData.name || !formData.id) return;
    if (isAddingCollection) {
      addCollection(formData as Collection);
      toast.success("Collection added", { description: formData.name });
    } else if (editingCollection) {
      updateCollection(editingCollection.id, formData);
      toast.success("Collection updated", { description: formData.name });
    }
    cancelEdit();
  };

  const handleDelete = (id: string, name: string) => {
    deleteCollection(id);
    toast.success("Collection deleted", { description: name });
  };

  const toggleProductInCollection = (productId: string) => {
    const prods = formData.products || [];
    const newProds = prods.includes(productId)
      ? prods.filter((p) => p !== productId)
      : [...prods, productId];
    // Recalculate total
    const total = newProds.reduce((sum, pid) => {
      const p = products.find((pr) => pr.id === pid);
      return sum + (p ? p.price : 0);
    }, 0);
    setFormData({ ...formData, products: newProds, totalPrice: total });
  };

  const isEditing = isAddingCollection || editingCollection !== null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl text-[#1a2332]" style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}>Collections</h2>
        {!isEditing && (
          <button onClick={startAdd} className="flex items-center gap-2 bg-[#B8956A] text-white px-4 py-2 text-xs tracking-wider uppercase hover:bg-[#9A7B55] transition-colors" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>
            <Plus className="w-4 h-4" />
            Add Collection
          </button>
        )}
      </div>

      {/* Collection Form */}
      {isEditing && (
        <div className="bg-[#FDFBF7] p-6 rounded-sm border border-[#E8E4DB] mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-[#1a2332]" style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}>
              {isAddingCollection ? "Add New Collection" : "Edit Collection"}
            </h3>
            <button onClick={cancelEdit} className="p-1 text-[#8B7D6B] hover:text-[#1a2332]">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#8B7D6B] mb-1.5 font-medium" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>Name</label>
              <input value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 bg-[#F5F3EE] border border-[#E8E4DB] rounded-sm text-sm focus:outline-none focus:border-[#B8956A]" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#8B7D6B] mb-1.5 font-medium" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>Discount (0-1)</label>
              <input type="number" step={0.01} min={0} max={1} value={formData.discount || 0} onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 bg-[#F5F3EE] border border-[#E8E4DB] rounded-sm text-sm focus:outline-none focus:border-[#B8956A]" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#8B7D6B] mb-1.5 font-medium" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>Image URL</label>
              <input value={formData.image || ""} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full px-3 py-2 bg-[#F5F3EE] border border-[#E8E4DB] rounded-sm text-sm focus:outline-none focus:border-[#B8956A]" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#8B7D6B] mb-1.5 font-medium" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>Total Price (auto)</label>
              <input value={`€${formData.totalPrice || 0}`} disabled className="w-full px-3 py-2 bg-[#F5F3EE] border border-[#E8E4DB] rounded-sm text-sm text-[#8B7D6B]" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-[#8B7D6B] mb-1.5 font-medium" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>Description</label>
              <textarea value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-3 py-2 bg-[#F5F3EE] border border-[#E8E4DB] rounded-sm text-sm focus:outline-none focus:border-[#B8956A] resize-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-[#8B7D6B] mb-2 font-medium" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>Products</label>
              <div className="flex flex-wrap gap-2">
                {products.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleProductInCollection(p.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-sm transition-all ${
                      (formData.products || []).includes(p.id)
                        ? "bg-[#B8956A] text-white border-[#B8956A]"
                        : "border-[#E8E4DB] text-[#8B7D6B]"
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={handleSave} className="flex items-center gap-2 bg-[#B8956A] text-white px-5 py-2.5 text-xs tracking-wider uppercase hover:bg-[#9A7B55] transition-colors" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>
              <Save className="w-4 h-4" />
              Save
            </button>
            <button onClick={cancelEdit} className="flex items-center gap-2 border border-[#3D3D3D] px-5 py-2.5 text-xs tracking-wider uppercase text-[#8B7D6B] hover:text-[#1a2332]" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Collections List */}
      <div className="space-y-4">
        {collections.map((collection) => (
          <div key={collection.id} className="bg-[#FDFBF7] p-4 rounded-sm border border-[#E8E4DB] flex items-center gap-4">
            <div className="w-20 h-14 bg-[#E8E4DB] rounded-sm overflow-hidden flex-shrink-0">
              <img src={collection.image} alt={collection.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base text-[#1a2332]" style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}>{collection.name}</h4>
              <p className="text-xs text-[#8B7D6B] mt-0.5" style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
                {collection.products.length} products — €{collection.totalPrice} — {Math.round(collection.discount * 100)}% off
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => startEdit(collection)} className="p-1.5 text-[#8B7D6B] hover:text-[#B8956A] transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(collection.id, collection.name)} className="p-1.5 text-[#8B7D6B] hover:text-[#6B2C3E] transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============= SETTINGS TAB ============= */
function SettingsTab({
  siteSettings,
  updateSiteSettings,
}: {
  siteSettings: SiteSettings;
  updateSiteSettings: (s: Partial<SiteSettings>) => void;
}) {
  const [form, setForm] = useState<SiteSettings>({ ...siteSettings });

  const handleSave = () => {
    updateSiteSettings(form);
    toast.success("Settings saved", { description: "Site settings updated successfully" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl text-[#1a2332]" style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}>Site Settings</h2>
        <button onClick={handleSave} className="flex items-center gap-2 bg-[#B8956A] text-white px-5 py-2.5 text-xs tracking-wider uppercase hover:bg-[#9A7B55] transition-colors" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>
          <Save className="w-4 h-4" />
          Save All
        </button>
      </div>

      <div className="space-y-6">
        {/* Contact Info */}
        <div className="bg-[#FDFBF7] p-6 rounded-sm border border-[#E8E4DB]">
          <h3 className="text-lg text-[#1a2332] mb-4" style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}>Contact Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#8B7D6B] mb-1.5 font-medium" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 bg-[#F5F3EE] border border-[#E8E4DB] rounded-sm text-sm focus:outline-none focus:border-[#B8956A]" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#8B7D6B] mb-1.5 font-medium" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>Email</label>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 bg-[#F5F3EE] border border-[#E8E4DB] rounded-sm text-sm focus:outline-none focus:border-[#B8956A]" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-[#8B7D6B] mb-1.5 font-medium" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>Address</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2 bg-[#F5F3EE] border border-[#E8E4DB] rounded-sm text-sm focus:outline-none focus:border-[#B8956A]" />
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="bg-[#FDFBF7] p-6 rounded-sm border border-[#E8E4DB]">
          <h3 className="text-lg text-[#1a2332] mb-4" style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}>Branding</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#8B7D6B] mb-1.5 font-medium" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>Logo Text</label>
              <input value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} className="w-full px-3 py-2 bg-[#F5F3EE] border border-[#E8E4DB] rounded-sm text-sm focus:outline-none focus:border-[#B8956A]" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#8B7D6B] mb-1.5 font-medium" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>Primary Color</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} className="w-10 h-9 rounded border border-[#E8E4DB] cursor-pointer" />
                <input value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} className="flex-1 px-3 py-2 bg-[#F5F3EE] border border-[#E8E4DB] rounded-sm text-sm focus:outline-none focus:border-[#B8956A]" />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#8B7D6B] mb-1.5 font-medium" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>Secondary Color</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={form.secondaryColor} onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })} className="w-10 h-9 rounded border border-[#E8E4DB] cursor-pointer" />
                <input value={form.secondaryColor} onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })} className="flex-1 px-3 py-2 bg-[#F5F3EE] border border-[#E8E4DB] rounded-sm text-sm focus:outline-none focus:border-[#B8956A]" />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#8B7D6B] mb-1.5 font-medium" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>Accent Color</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={form.accentColor} onChange={(e) => setForm({ ...form, accentColor: e.target.value })} className="w-10 h-9 rounded border border-[#E8E4DB] cursor-pointer" />
                <input value={form.accentColor} onChange={(e) => setForm({ ...form, accentColor: e.target.value })} className="flex-1 px-3 py-2 bg-[#F5F3EE] border border-[#E8E4DB] rounded-sm text-sm focus:outline-none focus:border-[#B8956A]" />
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-[#FDFBF7] p-6 rounded-sm border border-[#E8E4DB]">
          <h3 className="text-lg text-[#1a2332] mb-4" style={{ fontFamily: "var(--font-cormorant), Cormorant Garamond, serif" }}>Hero Section</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#8B7D6B] mb-1.5 font-medium" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>Hero Title</label>
              <input value={form.heroTitle} onChange={(e) => setForm({ ...form, heroTitle: e.target.value })} className="w-full px-3 py-2 bg-[#F5F3EE] border border-[#E8E4DB] rounded-sm text-sm focus:outline-none focus:border-[#B8956A]" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#8B7D6B] mb-1.5 font-medium" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>Hero Subtitle</label>
              <input value={form.heroSubtitle} onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })} className="w-full px-3 py-2 bg-[#F5F3EE] border border-[#E8E4DB] rounded-sm text-sm focus:outline-none focus:border-[#B8956A]" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#8B7D6B] mb-1.5 font-medium" style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}>CTA Button Text</label>
              <input value={form.heroCtaText} onChange={(e) => setForm({ ...form, heroCtaText: e.target.value })} className="w-full px-3 py-2 bg-[#F5F3EE] border border-[#E8E4DB] rounded-sm text-sm focus:outline-none focus:border-[#B8956A]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
