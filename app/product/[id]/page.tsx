"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingCart, Heart, Zap, Check, ChevronRight, Minus, Plus, Shield, Truck, RotateCcw, Share2, ThumbsUp } from 'lucide-react';
import { useTranslations } from "next-intl";
import {
  MOCK_PRODUCTS,
  APP_CURRENCY_SYMBOL,
  type Product,
  type Review,
} from "@/lib/data";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";
import { Reveal } from "@/components/Reveal";
import { useCart } from "@/lib/cart-context";

// ─── Inline mock reviews ────────────────────────────────────────────────────
const INLINE_REVIEWS: Review[] = [
  {
    id: "r1",
    author: "Marcus T.",
    rating: 5,
    date: "2024-03-12",
    title: "Absolutely worth every penny",
    body: "I have tried many products in this category and this one stands out. Build quality is exceptional, performance is top-notch, and the packaging was pristine. Would recommend to anyone looking for a reliable option.",
    verified: true,
  },
  {
    id: "r2",
    author: "Priya S.",
    rating: 4,
    date: "2024-02-28",
    title: "Great product, minor quibbles",
    body: "Overall very satisfied with my purchase. Setup was straightforward and it works exactly as described. Docking one star because the manual could be clearer, but the product itself is excellent.",
    verified: true,
  },
  {
    id: "r3",
    author: "James L.",
    rating: 5,
    date: "2024-01-15",
    title: "Exceeded my expectations",
    body: "Ordered this after reading dozens of reviews and I am glad I did. Arrived two days early, well-packaged, and performs flawlessly. This is now my go-to recommendation for friends and family.",
    verified: false,
  },
  {
    id: "r4",
    author: "Aisha K.",
    rating: 3,
    date: "2023-12-20",
    title: "Decent but not perfect",
    body: "The product does what it says, but I expected a bit more given the price point. Customer support was helpful when I had questions. Might upgrade to a higher tier next time.",
    verified: true,
  },
];

const RATING_BREAKDOWN = [
  { stars: 5, count: 1420 },
  { stars: 4, count: 580 },
  { stars: 3, count: 210 },
  { stars: 2, count: 80 },
  { stars: 1, count: 51 },
];

// ─── Star Rating component ───────────────────────────────────────────────────
function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => {
        const filled = rating >= s;
        const half = !filled && rating >= s - 0.5;
        return (
          <span key={s} className="relative inline-block" style={{ width: size, height: size }}>
            <Star
              size={size}
              className="text-gray-200"
              fill="currentColor"
            />
            {(filled || half) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: half ? "50%" : "100%" }}
              >
                <Star
                  size={size}
                  className="text-amber-400"
                  fill="currentColor"
                />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

// ─── Review Card ─────────────────────────────────────────────────────────────
function ReviewCard({ review }: { review: Review }) {
  return (
    <motion.div
      variants={scaleIn}
      className="bg-white rounded-2xl p-6 border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <StarRating rating={review.rating} size={14} />
            {review.verified && (
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <Check size={11} />
                Verified
              </span>
            )}
          </div>
          <p className="font-semibold text-gray-900 text-sm">{review.title}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-gray-500">{review.author}</p>
          <p className="text-xs text-gray-400">{review.date}</p>
        </div>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{review.body}</p>
      <button className="mt-3 flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200">
        <ThumbsUp size={12} />
        Helpful
      </button>
    </motion.div>
  );
}

// ─── Image Gallery ───────────────────────────────────────────────────────────
function ImageGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  const safeImages =
    images && images.length > 0
      ? images
      : ["/images/product-placeholder.jpg"];

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)]">
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={safeImages[active]}
            alt={name}
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "/images/product-placeholder.jpg";
            }}
          />
        </AnimatePresence>
        <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm hover:bg-white transition-colors duration-200">
          <Share2 size={16} className="text-gray-600" />
        </button>
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {safeImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                active === i
                  ? "border-[var(--primary)] shadow-md"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <img
                src={img}
                alt={`${name} view ${i + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "/images/product-placeholder.jpg";
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Related Product Card ────────────────────────────────────────────────────
function RelatedCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex-shrink-0 w-48 bg-white rounded-2xl overflow-hidden border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] group"
    >
      <Link href={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden bg-gray-50">
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
          <p className="text-xs text-gray-500 mb-1">{product.category}</p>
          <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug mb-2">
            {product.name}
          </p>
          <div className="flex items-center gap-1 mb-2">
            <StarRating rating={product.rating} size={11} />
            <span className="text-xs text-gray-400">({product.reviewCount})</span>
          </div>
          <p className="text-sm font-bold" style={{ color: "var(--primary)" }}>
            {APP_CURRENCY_SYMBOL}{(product.price ?? 0).toFixed(2)}
          </p>
        </div>
      </Link>
      <div className="px-3 pb-3">
        <button
          onClick={() => addItem(product)}
          className="w-full text-xs py-1.5 rounded-lg font-semibold transition-all duration-200 border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : (params?.id?.[0] ?? "p1");
  const { addItem } = useCart();

  const product: Product =
    MOCK_PRODUCTS.find((p) => p.id === id) ?? MOCK_PRODUCTS[0];

  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const relatedProducts = MOCK_PRODUCTS.filter(
    (p) => p.id !== product.id
  ).slice(0, 6);

  const totalReviews = RATING_BREAKDOWN.reduce((s, r) => s + r.count, 0);
  const avgRating =
    RATING_BREAKDOWN.reduce((s, r) => s + r.stars * r.count, 0) / totalReviews;

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : 0;

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  function handleBuyNow() {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    window.location.href = "/checkout";
  }

  const safeImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  const specs = product.specs ?? {};

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <Reveal>
        <div className="bg-white border-b border-black/5">
          <div className="mx-auto max-w-[1400px] px-4 py-3">
            <nav className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
              <Link href="/" className="hover:text-gray-900 transition-colors duration-200">
                Home
              </Link>
              <ChevronRight size={14} className="text-gray-300" />
              <Link
                href={`/category/${product.categorySlug}`}
                className="hover:text-gray-900 transition-colors duration-200"
              >
                {product.category}
              </Link>
              <ChevronRight size={14} className="text-gray-300" />
              <span className="text-gray-900 font-medium line-clamp-1 max-w-xs">
                {product.name}
              </span>
            </nav>
          </div>
        </div>
      </Reveal>

      {/* Product hero */}
      <div className="mx-auto max-w-[1400px] px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
          {/* Left: Image gallery */}
          <Reveal>
            <ImageGallery images={safeImages} name={product.name} />
          </Reveal>

          {/* Right: Product info */}
          <Reveal delay={0.1}>
            <div className="flex flex-col gap-5">
              {/* Badge + category */}
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/category/${product.categorySlug}`}
                  className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
                >
                  {product.category}
                </Link>
                {product.badge && (
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight tracking-tight text-balance">
                {product.name}
              </h1>

              {/* Rating row */}
              <div className="flex items-center gap-3 flex-wrap">
                <StarRating rating={product.rating} size={18} />
                <span className="text-sm font-semibold text-gray-800">
                  {(product.rating ?? 0).toFixed(1)}
                </span>
                <span className="text-sm text-gray-500">
                  ({(product.reviewCount ?? 0).toLocaleString("en-US")} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-end gap-3 flex-wrap">
                <span
                  className="text-3xl font-extrabold"
                  style={{ color: "var(--primary)" }}
                >
                  {APP_CURRENCY_SYMBOL}{(product.price ?? 0).toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      {APP_CURRENCY_SYMBOL}{(product.originalPrice).toFixed(2)}
                    </span>
                    <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Save {discount}%
                    </span>
                  </>
                )}
              </div>

              {/* Stock badge */}
              <div>
                {product.inStock ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
                    <Check size={14} />
                    In Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed text-sm">
                {product.description}
              </p>

              {/* Quantity selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-700">Quantity</span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 hover:bg-gray-50 transition-colors duration-200 text-gray-600"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 text-sm font-bold text-gray-900 min-w-[2.5rem] text-center border-x border-gray-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-2 hover:bg-gray-50 transition-colors duration-200 text-gray-600"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
                >
                  <ShoppingCart size={18} />
                  {addedToCart ? "Added!" : "Add to Cart"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(0,0,0,0.2)]"
                  style={{ backgroundColor: "var(--primary)" }}
                >
                  <Zap size={18} />
                  Buy Now
                </motion.button>
              </div>

              {/* Wishlist */}
              <button
                onClick={() => setWishlisted((w) => !w)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors duration-200 self-start"
              >
                <Heart
                  size={18}
                  className={wishlisted ? "fill-red-500 text-red-500" : ""}
                />
                {wishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
              </button>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-100">
                {[
                  { icon: <Truck size={16} />, label: "Free Shipping", sub: "Orders over $50" },
                  { icon: <RotateCcw size={16} />, label: "30-Day Returns", sub: "Hassle-free" },
                  { icon: <Shield size={16} />, label: "Secure Payment", sub: "256-bit SSL" },
                ].map((b) => (
                  <div key={b.label} className="flex flex-col items-center text-center gap-1 p-2 rounded-xl bg-gray-50">
                    <span style={{ color: "var(--primary)" }}>{b.icon}</span>
                    <span className="text-xs font-semibold text-gray-800">{b.label}</span>
                    <span className="text-xs text-gray-400">{b.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Specs table */}
      {Object.keys(specs).length > 0 && (
        <Reveal>
          <section className="mx-auto max-w-[1400px] px-4 py-8">
            <div className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Technical Specifications</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {Object.entries(specs).map(([key, value], i) => (
                  <div
                    key={key}
                    className={`flex items-start gap-4 px-6 py-4 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                  >
                    <span className="w-40 flex-shrink-0 text-sm font-semibold text-gray-500">
                      {key}
                    </span>
                    <span className="text-sm text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>
      )}

      {/* Reviews section */}
      <Reveal>
        <section className="mx-auto max-w-[1400px] px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Rating summary */}
            <div className="bg-white rounded-2xl p-6 border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] h-fit">
              <div className="flex flex-col items-center mb-6">
                <span className="text-6xl font-extrabold text-gray-900">
                  {avgRating.toFixed(1)}
                </span>
                <StarRating rating={avgRating} size={22} />
                <span className="text-sm text-gray-500 mt-2">
                  {totalReviews.toLocaleString("en-US")} reviews
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {RATING_BREAKDOWN.slice()
                  .reverse()
                  .map((row) => {
                    const pct = totalReviews > 0 ? (row.count / totalReviews) * 100 : 0;
                    return (
                      <div key={row.stars} className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-8 text-right flex-shrink-0">
                          {row.stars}★
                        </span>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: "var(--primary)" }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-8 flex-shrink-0">
                          {row.count}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Review cards */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {INLINE_REVIEWS.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </motion.div>
          </div>
        </section>
      </Reveal>

      {/* Customers Also Viewed */}
      <Reveal>
        <section className="mx-auto max-w-[1400px] px-4 py-8 pb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customers Also Viewed</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
            {relatedProducts.map((p, i) => (
              <div key={p.id} className="snap-start">
                <RelatedCard product={p} />
              </div>
            ))}
          </div>
        </section>
      </Reveal>
    </main>
  );
}