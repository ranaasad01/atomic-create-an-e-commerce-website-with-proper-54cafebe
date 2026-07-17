"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Tag, Shield, Truck, RotateCcw, ChevronRight, Package, Heart } from 'lucide-react';
import { useTranslations } from "next-intl";
import { APP_CURRENCY_SYMBOL, type Product } from "@/lib/data";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";
import { Reveal } from "@/components/Reveal";

interface CartProduct extends Product {
  quantity: number;
}

const INITIAL_CART: CartProduct[] = [
  {
    id: "p1",
    name: "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones",
    price: 279.99,
    originalPrice: 349.99,
    image: "https://graphics.secondipity.com/B2C/5409336_1.jpg",
    category: "Electronics",
    categorySlug: "electronics",
    rating: 4.8,
    reviewCount: 2341,
    badge: "Best Seller",
    description: "Industry-leading noise cancellation with 30-hour battery life.",
    inStock: true,
    quantity: 1,
  },
  {
    id: "p2",
    name: "Nike Air Max 270 Running Shoes",
    price: 129.99,
    originalPrice: 159.99,
    image: "https://static.nike.com/a/images/t_web_pdp_936_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/awjogtdnqxniqqk0wpgf/AIR+MAX+270.png",
    category: "Sports",
    categorySlug: "sports",
    rating: 4.6,
    reviewCount: 1892,
    badge: "Sale",
    description: "Lightweight running shoes with Max Air cushioning.",
    inStock: true,
    quantity: 2,
  },
  {
    id: "p3",
    name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
    price: 89.99,
    originalPrice: 119.99,
    image: "https://m.media-amazon.com/images/I/71Z401LjFFL._AC_UF894,1000_QL80_.jpg",
    category: "Home & Kitchen",
    categorySlug: "home-kitchen",
    rating: 4.7,
    reviewCount: 5621,
    description: "7-in-1 multi-use programmable pressure cooker.",
    inStock: true,
    quantity: 1,
  },
];

const RECOMMENDED: Product[] = [
  {
    id: "r1",
    name: "Apple AirPods Pro (2nd Gen)",
    price: 199.99,
    originalPrice: 249.99,
    image: "https://m.media-amazon.com/images/I/61sRKTAfrhL._AC_UF350,350_QL80_.jpg",
    category: "Electronics",
    categorySlug: "electronics",
    rating: 4.9,
    reviewCount: 4102,
    badge: "Top Pick",
    description: "Active noise cancellation with Adaptive Transparency.",
    inStock: true,
  },
  {
    id: "r2",
    name: "Kindle Paperwhite 11th Gen",
    price: 139.99,
    originalPrice: 159.99,
    image: "https://i.ebayimg.com/images/g/9ecAAOSwQZ1j9qSH/s-l1200.jpg",
    category: "Books",
    categorySlug: "books",
    rating: 4.7,
    reviewCount: 3210,
    description: "Waterproof e-reader with 6.8-inch display.",
    inStock: true,
  },
  {
    id: "r3",
    name: "Levi's 501 Original Fit Jeans",
    price: 59.99,
    originalPrice: 79.99,
    image: "https://static.wikia.nocookie.net/shingekinokyojin/images/b/b1/Levi_Ackermann_%28Anime%29_character_image.png/revision/latest?cb=20231105181307",
    category: "Fashion",
    categorySlug: "fashion",
    rating: 4.5,
    reviewCount: 987,
    description: "Classic straight-leg jeans in premium denim.",
    inStock: true,
  },
  {
    id: "r4",
    name: "Yoga Mat Non-Slip 6mm",
    price: 34.99,
    originalPrice: 49.99,
    image: "/images/yoga-mat-non-slip-6mm.jpg",
    category: "Sports",
    categorySlug: "sports",
    rating: 4.6,
    reviewCount: 1543,
    description: "Eco-friendly non-slip yoga mat with carrying strap.",
    inStock: true,
  },
];

const TRUST_BADGES = [
  { icon: Shield, label: "Secure Checkout", sub: "256-bit SSL encryption" },
  { icon: Truck, label: "Free Shipping", sub: "On orders over $50" },
  { icon: RotateCcw, label: "Easy Returns", sub: "30-day return policy" },
  { icon: Package, label: "Fast Delivery", sub: "2-5 business days" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className="w-3 h-3"
          fill={star <= Math.round(rating) ? "#f59e0b" : "none"}
          stroke="#f59e0b"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
          />
        </svg>
      ))}
    </div>
  );
}

export default function CartPage() {
  const t = useTranslations();
  const [cartItems, setCartItems] = useState<CartProduct[]>(INITIAL_CART);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");
  const [savedItems, setSavedItems] = useState<string[]>([]);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const saveForLater = useCallback((id: string) => {
    setSavedItems((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }, []);

  const applyCoupon = useCallback(() => {
    const valid: Record<string, number> = {
      SAVE10: 10,
      MARKETHUB20: 20,
      WELCOME15: 15,
    };
    const upper = couponCode.trim().toUpperCase();
    if (valid[upper] !== undefined) {
      setAppliedCoupon(upper);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code. Try SAVE10 or WELCOME15.");
      setAppliedCoupon(null);
    }
  }, [couponCode]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const originalTotal = cartItems.reduce(
    (sum, item) => sum + (item.originalPrice ?? item.price) * item.quantity,
    0
  );
  const savings = originalTotal - subtotal;

  const couponDiscounts: Record<string, number> = {
    SAVE10: 0.1,
    MARKETHUB20: 0.2,
    WELCOME15: 0.15,
  };
  const couponDiscount = appliedCoupon
    ? subtotal * (couponDiscounts[appliedCoupon] ?? 0)
    : 0;

  const shipping = subtotal >= 50 ? 0 : 5.99;
  const tax = (subtotal - couponDiscount) * 0.08;
  const total = subtotal - couponDiscount + shipping + tax;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const isEmpty = cartItems.length === 0;

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Page Header */}
      <Reveal>
        <div
          className="py-8 border-b border-black/5"
          style={{ backgroundColor: "var(--surface)" }}
        >
          <div className="mx-auto max-w-[1400px] px-4">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm text-[var(--muted)] mb-3">
              <Link href="/" className="hover:text-[var(--primary)] transition-colors">
                Home
              </Link>
              <ChevronRight size={14} />
              <span className="text-[var(--foreground)] font-medium">Shopping Cart</span>
            </nav>
            <div className="flex items-center gap-3">
              <ShoppingCart size={28} style={{ color: "var(--primary)" }} />
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] tracking-tight">
                Shopping Cart
              </h1>
              {!isEmpty && (
                <span
                  className="px-2.5 py-0.5 rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: "var(--primary)" }}
                >
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
              )}
            </div>
          </div>
        </div>
      </Reveal>

      <div className="mx-auto max-w-[1400px] px-4 py-8">
        {isEmpty ? (
          /* Empty State */
          <Reveal>
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-32 h-32 rounded-full flex items-center justify-center mb-6"
                style={{ backgroundColor: "var(--surface)" }}
              >
                <ShoppingCart size={56} className="text-[var(--muted)]" />
              </motion.div>
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                Your cart is empty
              </h2>
              <p className="text-[var(--muted)] mb-8 max-w-sm">
                Looks like you haven't added anything yet. Browse our categories to find something you'll love.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-105"
                style={{ backgroundColor: "var(--primary)" }}
              >
                Continue Shopping
                <ArrowRight size={18} />
              </Link>
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Column */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Trust bar */}
              <Reveal>
                <div
                  className="rounded-xl p-3 flex items-center gap-2 text-sm"
                  style={{ backgroundColor: "var(--surface)" }}
                >
                  <Truck size={16} style={{ color: "var(--primary)" }} />
                  <span className="text-[var(--foreground)] font-medium">
                    {subtotal >= 50
                      ? "You qualify for FREE shipping!"
                      : `Add ${APP_CURRENCY_SYMBOL}${(50 - subtotal).toFixed(2)} more for FREE shipping`}
                  </span>
                  {subtotal < 50 && (
                    <div className="flex-1 ml-2 h-1.5 rounded-full bg-black/10 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((subtotal / 50) * 100, 100)}%`,
                          backgroundColor: "var(--primary)",
                        }}
                      />
                    </div>
                  )}
                </div>
              </Reveal>

              {/* Items */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-3"
              >
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={fadeInUp}
                      exit={{ opacity: 0, x: -40, transition: { duration: 0.25 } }}
                      layout
                      className="rounded-2xl border border-black/5 overflow-hidden"
                      style={{
                        backgroundColor: "var(--surface)",
                        boxShadow:
                          "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)",
                      }}
                    >
                      <div className="p-4 flex gap-4">
                        {/* Product Image */}
                        <Link
                          href={`/product/${item.id}`}
                          className="flex-shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden bg-gray-100 block"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                "/images/product-placeholder.jpg";
                            }}
                          />
                        </Link>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              {item.badge && (
                                <span
                                  className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold text-white mb-1"
                                  style={{ backgroundColor: "var(--primary)" }}
                                >
                                  {item.badge}
                                </span>
                              )}
                              <Link href={`/product/${item.id}`}>
                                <h3 className="font-semibold text-[var(--foreground)] text-sm md:text-base leading-snug hover:text-[var(--primary)] transition-colors line-clamp-2">
                                  {item.name}
                                </h3>
                              </Link>
                              <p className="text-xs text-[var(--muted)] mt-0.5">
                                {item.category}
                              </p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <StarRating rating={item.rating} />
                                <span className="text-xs text-[var(--muted)]">
                                  ({(item.reviewCount ?? 0).toLocaleString()})
                                </span>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="text-right flex-shrink-0">
                              <p className="font-bold text-[var(--foreground)] text-base md:text-lg">
                                {APP_CURRENCY_SYMBOL}
                                {(item.price * item.quantity).toFixed(2)}
                              </p>
                              {item.originalPrice && (
                                <p className="text-xs text-[var(--muted)] line-through">
                                  {APP_CURRENCY_SYMBOL}
                                  {(item.originalPrice * item.quantity).toFixed(2)}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Actions Row */}
                          <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                            {/* Quantity */}
                            <div className="flex items-center gap-1 rounded-lg border border-black/10 overflow-hidden">
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-8 h-8 flex items-center justify-center text-[var(--foreground)] hover:bg-black/5 transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={14} />
                              </motion.button>
                              <span className="w-8 text-center text-sm font-semibold text-[var(--foreground)]">
                                {item.quantity}
                              </span>
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-8 h-8 flex items-center justify-center text-[var(--foreground)] hover:bg-black/5 transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus size={14} />
                              </motion.button>
                            </div>

                            {/* Item actions */}
                            <div className="flex items-center gap-2">
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => saveForLater(item.id)}
                                className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-black/10 hover:bg-black/5 transition-colors"
                                style={{
                                  color: savedItems.includes(item.id)
                                    ? "var(--primary)"
                                    : "var(--muted)",
                                }}
                              >
                                <Heart
                                  size={13}
                                  fill={
                                    savedItems.includes(item.id)
                                      ? "currentColor"
                                      : "none"
                                  }
                                />
                                <span className="hidden sm:inline">
                                  {savedItems.includes(item.id)
                                    ? "Saved"
                                    : "Save"}
                                </span>
                              </motion.button>
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeItem(item.id)}
                                className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 size={13} />
                                <span className="hidden sm:inline">Remove</span>
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* In stock indicator */}
                      <div className="px-4 pb-3">
                        <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                          In Stock
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Continue Shopping */}
              <Reveal>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:underline"
                  style={{ color: "var(--primary)" }}
                >
                  <ArrowRight size={16} className="rotate-180" />
                  Continue Shopping
                </Link>
              </Reveal>

              {/* Trust Badges */}
              <Reveal>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                  {TRUST_BADGES.map((badge) => (
                    <div
                      key={badge.label}
                      className="flex flex-col items-center text-center p-3 rounded-xl border border-black/5"
                      style={{ backgroundColor: "var(--surface)" }}
                    >
                      <badge.icon
                        size={22}
                        className="mb-1.5"
                        style={{ color: "var(--primary)" }}
                      />
                      <p className="text-xs font-semibold text-[var(--foreground)]">
                        {badge.label}
                      </p>
                      <p className="text-xs text-[var(--muted)] mt-0.5">{badge.sub}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Order Summary Column */}
            <div className="lg:col-span-1">
              <Reveal className="sticky top-20">
                <div
                  className="rounded-2xl border border-black/5 overflow-hidden"
                  style={{
                    backgroundColor: "var(--surface)",
                    boxShadow:
                      "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08)",
                  }}
                >
                  <div className="p-5 border-b border-black/5">
                    <h2 className="text-lg font-bold text-[var(--foreground)]">
                      Order Summary
                    </h2>
                  </div>

                  <div className="p-5 flex flex-col gap-4">
                    {/* Price breakdown */}
                    <div className="flex flex-col gap-2.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[var(--muted)]">
                          Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
                        </span>
                        <span className="font-medium text-[var(--foreground)]">
                          {APP_CURRENCY_SYMBOL}{subtotal.toFixed(2)}
                        </span>
                      </div>

                      {savings > 0 && (
                        <div className="flex justify-between text-emerald-600">
                          <span>You save</span>
                          <span className="font-semibold">
                            -{APP_CURRENCY_SYMBOL}{savings.toFixed(2)}
                          </span>
                        </div>
                      )}

                      {couponDiscount > 0 && (
                        <div className="flex justify-between text-emerald-600">
                          <span>Coupon ({appliedCoupon})</span>
                          <span className="font-semibold">
                            -{APP_CURRENCY_SYMBOL}{couponDiscount.toFixed(2)}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span className="text-[var(--muted)]">Shipping</span>
                        <span
                          className={
                            shipping === 0
                              ? "font-semibold text-emerald-600"
                              : "font-medium text-[var(--foreground)]"
                          }
                        >
                          {shipping === 0
                            ? "FREE"
                            : `${APP_CURRENCY_SYMBOL}${shipping.toFixed(2)}`}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-[var(--muted)]">
                          Estimated Tax (8%)
                        </span>
                        <span className="font-medium text-[var(--foreground)]">
                          {APP_CURRENCY_SYMBOL}{tax.toFixed(2)}
                        </span>
                      </div>

                      <div className="border-t border-black/5 pt-2.5 flex justify-between">
                        <span className="font-bold text-[var(--foreground)] text-base">
                          Order Total
                        </span>
                        <span
                          className="font-bold text-lg"
                          style={{ color: "var(--primary)" }}
                        >
                          {APP_CURRENCY_SYMBOL}{total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Coupon Code */}
                    <div className="border-t border-black/5 pt-4">
                      <p className="text-sm font-semibold text-[var(--foreground)] mb-2 flex items-center gap-1.5">
                        <Tag size={14} style={{ color: "var(--primary)" }} />
                        Promo Code
                      </p>
                      {appliedCoupon ? (
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                          <span className="text-sm font-semibold text-emerald-700">
                            {appliedCoupon} applied!
                          </span>
                          <button
                            onClick={removeCoupon}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => {
                              setCouponCode(e.target.value);
                              setCouponError("");
                            }}
                            placeholder="Enter code"
                            className="flex-1 px-3 py-2 text-sm rounded-lg border border-black/10 bg-white text-[var(--foreground)] outline-none focus:border-[var(--primary)] transition-colors"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") applyCoupon();
                            }}
                          />
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={applyCoupon}
                            className="px-3 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                            style={{ backgroundColor: "var(--primary)" }}
                          >
                            Apply
                          </motion.button>
                        </div>
                      )}
                      {couponError && (
                        <p className="text-xs text-red-500 mt-1.5">{couponError}</p>
                      )}
                      {!appliedCoupon && !couponError && (
                        <p className="text-xs text-[var(--muted)] mt-1.5">
                          Try: SAVE10, WELCOME15, MARKETHUB20
                        </p>
                      )}
                    </div>

                    {/* Checkout Button */}
                    <motion.div whileTap={{ scale: 0.98 }}>
                      <Link
                        href="/checkout"
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white text-base transition-all duration-200 hover:opacity-90 hover:shadow-lg"
                        style={{ backgroundColor: "var(--primary)" }}
                      >
                        Proceed to Checkout
                        <ArrowRight size={18} />
                      </Link>
                    </motion.div>

                    {/* Payment icons */}
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-xs text-[var(--muted)]">
                        Secure payment powered by
                      </p>
                      <div className="flex items-center gap-2 flex-wrap justify-center">
                        {["Visa", "MC", "Amex", "PayPal", "Apple Pay"].map(
                          (method) => (
                            <span
                              key={method}
                              className="px-2 py-1 rounded border border-black/10 text-xs font-semibold text-[var(--muted)] bg-white"
                            >
                              {method}
                            </span>
                          )
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[var(--muted)]">
                        <Shield size={12} />
                        <span>256-bit SSL encrypted checkout</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        )}

        {/* Recommended Products */}
        <Reveal className="mt-16">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-[var(--foreground)] tracking-tight">
                Frequently Bought Together
              </h2>
              <Link
                href="/"
                className="text-sm font-medium flex items-center gap-1 hover:underline"
                style={{ color: "var(--primary)" }}
              >
                View all
                <ChevronRight size={16} />
              </Link>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {RECOMMENDED.map((product, i) => (
                <motion.div
                  key={product.id}
                  variants={scaleIn}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="rounded-2xl border border-black/5 overflow-hidden cursor-pointer group"
                  style={{
                    backgroundColor: "var(--surface)",
                    boxShadow:
                      "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)",
                  }}
                >
                  <Link href={`/product/${product.id}`} className="block">
                    <div className="aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "/images/product-placeholder.jpg";
                        }}
                      />
                    </div>
                    <div className="p-3">
                      {product.badge && (
                        <span
                          className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold text-white mb-1"
                          style={{ backgroundColor: "var(--primary)" }}
                        >
                          {product.badge}
                        </span>
                      )}
                      <h3 className="text-sm font-semibold text-[var(--foreground)] line-clamp-2 leading-snug mb-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 mb-2">
                        <StarRating rating={product.rating} />
                        <span className="text-xs text-[var(--muted)]">
                          ({(product.reviewCount ?? 0).toLocaleString()})
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-[var(--foreground)]">
                          {APP_CURRENCY_SYMBOL}{product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-[var(--muted)] line-through">
                            {APP_CURRENCY_SYMBOL}{product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                  <div className="px-3 pb-3">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: "var(--primary)" }}
                      onClick={() => {
                        setCartItems((prev) => {
                          const exists = prev.find((c) => c.id === product.id);
                          if (exists) {
                            return prev.map((c) =>
                              c.id === product.id
                                ? { ...c, quantity: c.quantity + 1 }
                                : c
                            );
                          }
                          return [...prev, { ...product, quantity: 1 }];
                        });
                      }}
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}