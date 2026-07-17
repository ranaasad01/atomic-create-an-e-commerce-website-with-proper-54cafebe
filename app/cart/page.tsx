"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Heart, ShoppingCart, Tag, ChevronRight, Plus, Minus, ArrowRight, Shield, Truck, RotateCcw } from 'lucide-react';
import { useTranslations } from "next-intl";
import { APP_CURRENCY_SYMBOL, type Product } from "@/lib/data";
import { Reveal } from "@/components/Reveal";
import { cardHover } from "@/lib/motion";

// ─── Inline mock data ────────────────────────────────────────────────────────

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
    name: "Apple AirPods Pro (2nd Generation)",
    price: 189.99,
    originalPrice: 249.99,
    image: "https://m.media-amazon.com/images/I/61sRKTAfrhL._AC_UF350,350_QL80_.jpg",
    category: "Electronics",
    categorySlug: "electronics",
    rating: 4.7,
    reviewCount: 5812,
    badge: "Sale",
    description: "Active noise cancellation, Adaptive Transparency, and Personalized Spatial Audio.",
    inStock: true,
    quantity: 2,
  },
  {
    id: "p3",
    name: "Nike Air Max 270 Running Shoes",
    price: 119.99,
    originalPrice: 150.0,
    image: "https://static.nike.com/a/images/t_web_pdp_936_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/awjogtdnqxniqqk0wpgf/AIR+MAX+270.png",
    category: "Sports",
    categorySlug: "sports",
    rating: 4.5,
    reviewCount: 987,
    description: "Max Air cushioning for all-day comfort and style.",
    inStock: true,
    quantity: 1,
  },
];

const VALID_COUPONS: Record<string, number> = {
  SAVE10: 10,
  MARKETHUB20: 20,
  WELCOME15: 15,
};

const SHIPPING_THRESHOLD = 50;
const TAX_RATE = 0.08;

// ─── CartItemRow ─────────────────────────────────────────────────────────────

interface CartItemRowProps {
  item: CartProduct;
  onQuantityChange: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onSaveForLater: (id: string) => void;
}

function CartItemRow({ item, onQuantityChange, onRemove, onSaveForLater }: CartItemRowProps) {
  const t = useTranslations();
  const savings =
    item.originalPrice != null ? (item.originalPrice - item.price) * item.quantity : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40, transition: { duration: 0.25 } }}
      className="flex gap-4 p-4 bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]"
    >
      {/* Product image */}
      <Link href={`/product/${item.id}`} className="flex-shrink-0">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-50 border border-black/5">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://i.etsystatic.com/41380516/r/il/bb539f/8148209382/il_1080xN.8148209382_5vv2.jpg";
            }}
          />
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {item.badge && (
              <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] mb-1">
                {item.badge}
              </span>
            )}
            <Link
              href={`/product/${item.id}`}
              className="block text-sm sm:text-base font-semibold text-gray-900 hover:text-[var(--primary)] transition-colors duration-200 leading-snug line-clamp-2"
            >
              {item.name}
            </Link>
            <p className="text-xs text-gray-500 mt-0.5">{item.category}</p>
          </div>

          {/* Remove */}
          <button
            onClick={() => onRemove(item.id)}
            aria-label={t("cart.removeItem")}
            className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Price row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-base font-bold text-gray-900">
            {APP_CURRENCY_SYMBOL}{(item.price * item.quantity).toFixed(2)}
          </span>
          <span className="text-sm text-gray-400">
            ({APP_CURRENCY_SYMBOL}{item.price.toFixed(2)} {t("cart.each")})
          </span>
          {item.originalPrice != null && savings > 0 && (
            <span className="text-xs font-medium text-emerald-600">
              {t("cart.saving")} {APP_CURRENCY_SYMBOL}{savings.toFixed(2)}
            </span>
          )}
        </div>

        {/* Quantity + actions */}
        <div className="flex items-center justify-between flex-wrap gap-2 mt-auto">
          {/* Quantity stepper */}
          <div className="flex items-center gap-1 border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => onQuantityChange(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              aria-label={t("cart.decreaseQty")}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-sm font-semibold text-gray-900 select-none">
              {item.quantity}
            </span>
            <button
              onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              disabled={item.quantity >= 10}
              aria-label={t("cart.increaseQty")}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Save for later */}
          <button
            onClick={() => onSaveForLater(item.id)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-[var(--primary)] transition-colors duration-200"
          >
            <Heart size={13} />
            <span>{t("cart.saveForLater")}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── OrderSummary ─────────────────────────────────────────────────────────────

interface OrderSummaryProps {
  subtotal: number;
  discount: number;
  couponCode: string;
  couponInput: string;
  couponError: string;
  onCouponInputChange: (val: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
}

function OrderSummary({
  subtotal,
  discount,
  couponCode,
  couponInput,
  couponError,
  onCouponInputChange,
  onApplyCoupon,
  onRemoveCoupon,
}: OrderSummaryProps) {
  const t = useTranslations();
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : 9.99;
  const taxable = subtotal - discount;
  const tax = taxable * TAX_RATE;
  const total = taxable + shipping + tax;

  const trustItems = [
    { icon: <Shield size={14} />, label: t("cart.trust.secure") },
    { icon: <Truck size={14} />, label: t("cart.trust.shipping") },
    { icon: <RotateCcw size={14} />, label: t("cart.trust.returns") },
  ];

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] p-6 flex flex-col gap-5 sticky top-20">
      <h2 className="text-lg font-bold text-gray-900">{t("cart.summary.title")}</h2>

      {/* Line items */}
      <div className="flex flex-col gap-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>{t("cart.summary.subtotal")}</span>
          <span className="font-medium text-gray-900">{APP_CURRENCY_SYMBOL}{subtotal.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>{t("cart.summary.couponDiscount")} ({couponCode})</span>
            <span className="font-medium">-{APP_CURRENCY_SYMBOL}{discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-gray-600">
          <span>{t("cart.summary.shipping")}</span>
          {shipping === 0 ? (
            <span className="font-medium text-emerald-600">{t("cart.summary.free")}</span>
          ) : (
            <span className="font-medium text-gray-900">{APP_CURRENCY_SYMBOL}{shipping.toFixed(2)}</span>
          )}
        </div>

        {shipping > 0 && (
          <p className="text-xs text-gray-400">
            {t("cart.summary.freeShippingHint", { amount: `${APP_CURRENCY_SYMBOL}${SHIPPING_THRESHOLD}` })}
          </p>
        )}

        <div className="flex justify-between text-gray-600">
          <span>{t("cart.summary.tax")}</span>
          <span className="font-medium text-gray-900">{APP_CURRENCY_SYMBOL}{tax.toFixed(2)}</span>
        </div>

        <div className="border-t border-gray-100 pt-3 flex justify-between">
          <span className="text-base font-bold text-gray-900">{t("cart.summary.total")}</span>
          <span className="text-base font-bold text-gray-900">{APP_CURRENCY_SYMBOL}{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Coupon */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
          {t("cart.coupon.label")}
        </label>
        {couponCode ? (
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
            <div className="flex items-center gap-2 text-emerald-700 text-sm font-medium">
              <Tag size={14} />
              <span>{couponCode}</span>
            </div>
            <button
              onClick={onRemoveCoupon}
              className="text-xs text-emerald-600 hover:text-red-500 transition-colors duration-200 font-medium"
            >
              {t("cart.coupon.remove")}
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => onCouponInputChange(e.target.value.toUpperCase())}
              placeholder={t("cart.coupon.placeholder")}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-[var(--primary)] transition-colors duration-200 bg-gray-50"
              onKeyDown={(e) => e.key === "Enter" && onApplyCoupon()}
            />
            <button
              onClick={onApplyCoupon}
              className="px-4 py-2 text-sm font-semibold rounded-xl bg-gray-900 text-white hover:bg-gray-700 transition-colors duration-200"
            >
              {t("cart.coupon.apply")}
            </button>
          </div>
        )}
        {couponError && (
          <p className="text-xs text-red-500">{couponError}</p>
        )}
        <p className="text-xs text-gray-400">{t("cart.coupon.hint")}</p>
      </div>

      {/* CTA */}
      <Link
        href="/checkout"
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm text-[var(--foreground)] transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
        style={{ backgroundColor: "var(--primary)" }}
      >
        {t("cart.summary.cta")}
        <ArrowRight size={16} />
      </Link>

      {/* Trust badges */}
      <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
        {trustItems.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
            <span className="text-[var(--primary)]">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── EmptyCart ────────────────────────────────────────────────────────────────

function EmptyCart() {
  const t = useTranslations();
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center"
      >
        <ShoppingCart size={40} className="text-gray-400" />
      </motion.div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("cart.empty.title")}</h2>
        <p className="text-gray-500 max-w-xs mx-auto leading-relaxed">{t("cart.empty.description")}</p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-[var(--foreground)] transition-all duration-200 hover:opacity-90"
        style={{ backgroundColor: "var(--primary)" }}
      >
        {t("cart.empty.cta")}
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CartPage() {
  const t = useTranslations();
  const [cartItems, setCartItems] = useState<CartProduct[]>(INITIAL_CART);
  const [savedItems, setSavedItems] = useState<CartProduct[]>([]);
  const [couponInput, setCouponInput] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (id: string, qty: number) => {
    if (qty < 1 || qty > 10) return;
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const handleRemove = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveForLater = (id: string) => {
    const found = cartItems.find((item) => item.id === id);
    if (!found) return;
    setSavedItems((prev) => [...prev, { ...found, quantity: 1 }]);
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMoveToCart = (id: string) => {
    const found = savedItems.find((item) => item.id === id);
    if (!found) return;
    setCartItems((prev) => [...prev, { ...found, quantity: 1 }]);
    setSavedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleApplyCoupon = () => {
    const trimmed = couponInput.trim().toUpperCase();
    if (!trimmed) {
      setCouponError(t("cart.coupon.errorEmpty"));
      return;
    }
    const pct = VALID_COUPONS[trimmed];
    if (pct == null) {
      setCouponError(t("cart.coupon.errorInvalid"));
      return;
    }
    const discountAmt = (subtotal * pct) / 100;
    setCouponCode(trimmed);
    setCouponDiscount(discountAmt);
    setCouponError("");
    setCouponInput("");
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponDiscount(0);
    setCouponInput("");
    setCouponError("");
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Breadcrumb */}
      <Reveal>
        <div className="mx-auto max-w-[1400px] px-4 pt-6 pb-2">
          <nav className="flex items-center gap-1.5 text-xs text-gray-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[var(--primary)] transition-colors duration-200">
              {t("breadcrumb.home")}
            </Link>
            <ChevronRight size={12} />
            <span className="text-gray-900 font-medium">{t("breadcrumb.cart")}</span>
          </nav>
        </div>
      </Reveal>

      {/* Page heading */}
      <Reveal delay={0.05}>
        <div className="mx-auto max-w-[1400px] px-4 pt-2 pb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {t("cart.title")}
            {cartItems.length > 0 && (
              <span className="ml-2 text-lg font-semibold text-gray-400">
                ({cartItems.length} {cartItems.length === 1 ? t("cart.item") : t("cart.items")})
              </span>
            )}
          </h1>
        </div>
      </Reveal>

      <div className="mx-auto max-w-[1400px] px-4">
        {cartItems.length === 0 && savedItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
            {/* Left: Cart items */}
            <div className="flex flex-col gap-6">
              {/* Items list */}
              <Reveal>
                <div className="flex flex-col gap-3">
                  <AnimatePresence mode="popLayout">
                    {cartItems.map((item) => (
                      <CartItemRow
                        key={item.id}
                        item={item}
                        onQuantityChange={handleQuantityChange}
                        onRemove={handleRemove}
                        onSaveForLater={handleSaveForLater}
                      />
                    ))}
                  </AnimatePresence>

                  {cartItems.length === 0 && savedItems.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8 text-gray-500 text-sm"
                    >
                      {t("cart.allSaved")}
                    </motion.div>
                  )}
                </div>
              </Reveal>

              {/* Continue shopping */}
              {cartItems.length > 0 && (
                <Reveal delay={0.1}>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[var(--primary)] hover:underline transition-colors duration-200"
                  >
                    <ChevronRight size={14} className="rotate-180" />
                    {t("cart.continueShopping")}
                  </Link>
                </Reveal>
              )}

              {/* Saved for later */}
              {savedItems.length > 0 && (
                <Reveal delay={0.15}>
                  <div className="mt-4">
                    <h2 className="text-base font-bold text-gray-900 mb-3">
                      {t("cart.savedForLater")} ({savedItems.length})
                    </h2>
                    <div className="flex flex-col gap-3">
                      {savedItems.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -30 }}
                          className="flex gap-4 p-4 bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.06)]"
                        >
                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-black/5 flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  "https://sc04.alicdn.com/kf/H3decf0947e8a4276b75355bd510871f4N.jpg";
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col gap-1">
                            <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
                              {item.name}
                            </p>
                            <p className="text-sm font-bold text-gray-900">
                              {APP_CURRENCY_SYMBOL}{item.price.toFixed(2)}
                            </p>
                            <button
                              onClick={() => handleMoveToCart(item.id)}
                              className="mt-auto self-start text-xs font-semibold text-[var(--primary)] hover:underline transition-colors duration-200"
                            >
                              {t("cart.moveToCart")}
                            </button>
                          </div>
                          <button
                            onClick={() =>
                              setSavedItems((prev) => prev.filter((s) => s.id !== item.id))
                            }
                            aria-label={t("cart.removeItem")}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200 self-start"
                          >
                            <Trash2 size={15} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}
            </div>

            {/* Right: Order summary */}
            {cartItems.length > 0 && (
              <Reveal delay={0.12}>
                <OrderSummary
                  subtotal={subtotal}
                  discount={couponDiscount}
                  couponCode={couponCode}
                  couponInput={couponInput}
                  couponError={couponError}
                  onCouponInputChange={setCouponInput}
                  onApplyCoupon={handleApplyCoupon}
                  onRemoveCoupon={handleRemoveCoupon}
                />
              </Reveal>
            )}
          </div>
        )}
      </div>
    </main>
  );
}