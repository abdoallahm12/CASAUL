"use client";

import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useStore } from "@/lib/store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    products,
    removeFromCart,
    updateCartQuantity,
    getCartTotal,
    clearCart,
  } = useStore();

  const cartTotal = getCartTotal();
  const shipping = cartTotal >= 500 ? 0 : 25;
  const total = cartTotal + shipping;

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-[#FDFBF7] border-l border-[#E8E4DB]"
      >
        <SheetHeader className="border-b border-[#E8E4DB] pb-4">
          <SheetTitle
            className="text-xl text-[#1a2332]"
            style={{
              fontFamily:
                "var(--font-cormorant), Cormorant Garamond, serif",
            }}
          >
            Shopping Bag
          </SheetTitle>
          <SheetDescription
            className="text-sm text-[#8B7D6B]"
            style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            }}
          >
            {cart.length} item{cart.length !== 1 ? "s" : ""} in your bag
          </SheetDescription>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16">
            <ShoppingBag className="w-16 h-16 text-[#E8E4DB] mb-4" />
            <p
              className="text-lg text-[#8B7D6B] mb-2"
              style={{
                fontFamily:
                  "var(--font-cormorant), Cormorant Garamond, serif",
              }}
            >
              Your bag is empty
            </p>
            <p
              className="text-sm text-[#8B7D6B]/60"
              style={{
                fontFamily:
                  "var(--font-montserrat), Montserrat, sans-serif",
              }}
            >
              Discover our collections and find something you love
            </p>
            <button
              onClick={() => {
                setIsCartOpen(false);
                useStore.getState().setView("shop");
              }}
              className="mt-6 btn-gold-shimmer text-[#1a2332] px-6 py-2.5 text-xs tracking-[0.15em] uppercase"
              style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
            >
              Browse Collection
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4 max-h-[calc(100vh-280px)]">
              <div className="space-y-4 px-4">
                {cart.map((item) => {
                  const product = products.find(
                    (p) => p.id === item.productId
                  );
                  if (!product) return null;
                  const colorObj = product.colors.find(
                    (c) => c.name === item.color
                  );

                  return (
                    <div
                      key={`${item.productId}-${item.size}-${item.color}`}
                      className="flex gap-4 p-3 bg-[#F5F3EE] rounded-sm"
                    >
                      <div className="w-20 h-24 rounded-sm overflow-hidden flex-shrink-0 bg-[#E8E4DB]">
                        <img
                          src={product.images.front}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className="text-sm text-[#1a2332] font-medium truncate"
                          style={{
                            fontFamily:
                              "var(--font-cormorant), Cormorant Garamond, serif",
                          }}
                        >
                          {product.name}
                        </h4>
                        <div
                          className="flex items-center gap-2 mt-1 text-xs text-[#8B7D6B]"
                          style={{
                            fontFamily:
                              "var(--font-montserrat), Montserrat, sans-serif",
                          }}
                        >
                          <span>Size: {item.size}</span>
                          <span className="flex items-center gap-1">
                            Color:
                            {colorObj && (
                              <span
                                className="inline-block w-3 h-3 rounded-full border border-[#3D3D3D]/30"
                                style={{
                                  backgroundColor: colorObj.hex,
                                }}
                              />
                            )}
                            {item.color}
                          </span>
                        </div>
                        <p
                          className="text-sm text-[#B8956A] font-medium mt-1.5"
                          style={{
                            fontFamily:
                              "var(--font-montserrat), Montserrat, sans-serif",
                          }}
                        >
                          €{product.price * item.quantity}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateCartQuantity(
                                  item.productId,
                                  item.size,
                                  item.color,
                                  item.quantity - 1
                                )
                              }
                              disabled={item.quantity <= 1}
                              className="w-7 h-7 border border-[#3D3D3D]/30 rounded-sm flex items-center justify-center hover:bg-[#1a2332] hover:text-white transition-colors disabled:opacity-30"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span
                              className="text-sm min-w-[1.5rem] text-center"
                              style={{
                                fontFamily:
                                  "var(--font-montserrat), Montserrat, sans-serif",
                              }}
                            >
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateCartQuantity(
                                  item.productId,
                                  item.size,
                                  item.color,
                                  item.quantity + 1
                                )
                              }
                              className="w-7 h-7 border border-[#3D3D3D]/30 rounded-sm flex items-center justify-center hover:bg-[#1a2332] hover:text-white transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() =>
                              removeFromCart(
                                item.productId,
                                item.size,
                                item.color
                              )
                            }
                            className="p-1 text-[#8B7D6B] hover:text-[#6B2C3E] transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[#E8E4DB] pt-4 px-4 space-y-3">
              <div className="flex justify-between text-sm text-[#8B7D6B]">
                <span style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
                  Subtotal
                </span>
                <span style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
                  €{cartTotal}
                </span>
              </div>
              <div className="flex justify-between text-sm text-[#8B7D6B]">
                <span style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
                  Shipping
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    color: shipping === 0 ? "#2C4A3E" : undefined,
                  }}
                >
                  {shipping === 0 ? "Complimentary" : `€${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p
                  className="text-xs text-[#B8956A]"
                  style={{
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  }}
                >
                  Free shipping on orders over €500
                </p>
              )}
              <div className="flex justify-between text-base font-medium text-[#1a2332] pt-2 border-t border-[#E8E4DB]">
                <span style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
                  Total
                </span>
                <span
                  className="text-[#B8956A]"
                  style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
                >
                  €{total}
                </span>
              </div>

              <button
                className="w-full btn-gold-shimmer text-[#1a2332] py-3.5 text-xs tracking-[0.2em] uppercase font-medium mt-2"
                style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
              >
                Proceed to Checkout
              </button>

              <button
                onClick={clearCart}
                className="w-full text-xs text-[#8B7D6B] hover:text-[#6B2C3E] uppercase tracking-wider py-2 transition-colors"
                style={{ fontFamily: "var(--font-lato), Lato, sans-serif" }}
              >
                Clear Bag
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
