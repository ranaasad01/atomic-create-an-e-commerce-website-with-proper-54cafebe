"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Star, ShoppingCart, Heart, Share2, Shield, Truck, RotateCcw, ChevronRight, ChevronDown, ChevronUp, Check, Minus, Plus, ArrowLeft, Eye, AlertCircle } from 'lucide-react';
import { useTranslations } from "next-intl";
import { MOCK_PRODUCTS, MOCK_REVIEWS, APP_CURRENCY_SYMBOL, type Product, type Review } from "@/lib/data";
import { fadeInUp, fadeIn, staggerContainer, scaleIn, cardHover } from "@/lib/motion";
import { Reveal } from "@/components/Reveal";

// ─── Inline mock data ────────────────────────────────────────────────────────

const PRODUCT: Product = {
  id: "p1",
  name: "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones",
  price: 279.99,
  originalPrice: 349.99,
  image: "https://graphics.secondipity.com/B2C/5409336_1.jpg",
  images: [
    "https://graphics.secondipity.com/B2C/5409336_1.jpg",
    "/images/sony-headphones-side-view.jpg",
    "/images/sony-headphones-folded.jpg",
    "/images/sony-headphones-case.jpg",
  ],
  category: "Electronics",
  categorySlug: "electronics",
  rating: 4.8,
  reviewCount: 2341,
  badge: "Best Seller",
  description:
    "Industry-leading noise cancellation with the WH-1000XM5. Features 30-hour battery life, multipoint connection, and crystal-clear hands-free calling. The newly developed processor V1 and HD Noise Cancelling Processor QN1 work together to deliver unprecedented noise cancellation performance.",
  inStock: true,
  specs: {
    "Driver Size": "30mm",
    "Frequency Response": "4Hz–40,000Hz",
    "Battery Life": "30 hours",
    "Charging Time": "3.5 hours",
    Weight: "250g",
    Connectivity: "Bluetooth 5.2",
    "Noise Cancellation": "Dual Noise Sensor Technology",
    Microphone: "4 beamforming mics",
  },
};

const REVIEWS: Review[] = [
  {
    id: "r1",
    author: "Alex M.",
    rating: 5,
    date: "2024-03-15",
    title: "Best headphones I have ever owned",
    body: "The noise cancellation is absolutely incredible. I use these on my daily commute and they block out everything. Sound quality is rich and detailed. Battery lasts all week with my usage.",
    verified: true,
  },
  {
    id: "r2",
    author: "Sarah K.",
    rating: 5,
    date: "2024-02-28",
    title: "Worth every penny",
    body: "Upgraded from the XM4 and the improvement is noticeable. The new ear cups are more comfortable for long sessions. Call quality is dramatically better. Highly recommend.",
    verified: true,
  },
  {
    id: "r3",
    author: "James T.",
    rating: 4,
    date: "2024-02-10",
    title: "Great headphones with minor quirks",
    body: "Sound and ANC are top tier. My only gripe is the touch controls take some getting used to. Once you learn them, they are very intuitive. Build quality feels premium.",
    verified: true,
  },
  {
    id: "r4",
    author: "Priya R.",
    rating: 5,
    date: "2024-01-22",
    title: "Perfect for working from home",
    body: "These have transformed my work-from-home setup. I can focus for hours without distraction. The speak-to-chat feature is a game changer for quick conversations.",
    verified: false,
  },
];

const RELATED_PRODUCTS = [
  {
    id: "rp1",
    name: "Apple AirPods Pro (2nd Gen)",
    price: 199.99,
    originalPrice: 249.99,
    image: "https://m.media-amazon.com/images/I/61sRKTAfrhL._AC_UF350,350_QL80_.jpg",
    rating: 4.7,
    reviewCount: 5821,
    badge: "Top Pick",
  },
  {
    id: "rp2",
    name: "Bose QuietComfort 45",
    price: 229.99,
    originalPrice: 329.99,
    image: "/images/bose-quietcomfort-45-headphones.jpg",
    rating: 4.6,
    reviewCount: 1893,
    badge: undefined,
  },
  {
    id: "rp3",
    name: "Jabra Evolve2 85 Wireless",
    price: 319.99,
    originalPrice: undefined,
    image: "/images/jabra-evolve2-85-wireless-headset.jpg",
    rating: 4.5,
    reviewCount: 742,
    badge: "Pro Choice",
  },
  {
    id: "rp4",
    name: "Sennheiser Momentum 4",
    price: 249.99,
    originalPrice: 299.99,
    image: "/images/sennheiser-momentum-4-headphones.jpg",
    rating: 4.6,
    reviewCount: 1104,
    badge: undefined,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        return (
          <Star
            key={star}
            size={size}
            className={filled || half ? "text-amber-400" : "text-gray-300"}
            fill={filled ? "currentColor" : half ? "url(#half)" : "none"}
          />
        );
      })}
    </div>
  );
}

function RatingBar({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-8 text-right text-gray-600 font-medium">{label}</span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-amber-400"
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>
      <span className="w-8 text-gray-500">{pct}%</span>
    </div>
  );
}

const accordionVariants: Variants = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: "auto", opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
};

function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-4 text-left font-semibold text-gray-800 hover:text-[var(--primary)] transition-colors duration-200"
        aria-expanded={open}
      >
        <span>{title}</span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            variants={accordionVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="overflow-hidden"
          >
            <div className="pb-4 text-gray-600 text-sm leading-relaxed">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const t = useTranslations();

  const product = PRODUCT;
  const images = product.images ?? [product.image];

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const ratingDistribution = [
    { label: "5", value: 1680 },
    { label: "4", value: 421 },
    { label: "3", value: 156 },
    { label: "2", value: 52 },
    { label: "1", value: 32 },
  ];
  const totalReviews = ratingDistribution.reduce((s, r) => s + r.value, 0);

  function handleAddToCart() {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2200);
  }

  function handleQuantityChange(delta: number) {
    setQuantity((q) => Math.max(1, Math.min(99, q + delta)));
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <Reveal>
        <nav className="bg-white border-b border-gray-200">
          <div className="mx-auto max-w-[1400px] px-4 py-3 flex items-center gap-2 text-sm text-gray-500 flex-wrap">
            <Link href="/" className="hover:text-[var(--primary)] transition-colors duration-200">
              Home
            </Link>
            <ChevronRight size={14} />
            <Link
              href={`/category/${product.categorySlug}`}
              className="hover:text-[var(--primary)] transition-colors duration-200"
            >
              {product.category}
            </Link>
            <ChevronRight size={14} />
            <span className="text-gray-800 font-medium truncate max-w-[200px] sm:max-w-xs">
              {product.name}
            </span>
          </div>
        </nav>
      </Reveal>

      <div className="mx-auto max-w-[1400px] px-4 py-8">
        {/* Back link */}
        <Reveal>
          <Link
            href={`/category/${product.categorySlug}`}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[var(--primary)] transition-colors duration-200 mb-6"
          >
            <ArrowLeft size={15} />
            Back to {product.category}
          </Link>
        </Reveal>

        {/* ── Product hero ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Image gallery */}
          <Reveal className="flex flex-col gap-4">
            {/* Main image */}
            <motion.div
              className="relative bg-white rounded-2xl overflow-hidden border border-gray-200 aspect-square flex items-center justify-center"
              style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -8px rgba(0,0,0,0.12)" }}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={images[selectedImage] ?? product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-8"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "https://graphics.secondipity.com/B2C/5409336_1.jpg";
                  }}
                />
              </AnimatePresence>
              {product.badge && (
                <span
                  className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full text-white"
                  style={{ backgroundColor: "var(--primary)" }}
                >
                  {product.badge}
                </span>
              )}
              {discount > 0 && (
                <span className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full bg-red-500 text-white">
                  -{discount}%
                </span>
              )}
            </motion.div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {images.map((img, i) => (
                <motion.button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0 bg-white ${
                    selectedImage === i
                      ? "border-[var(--primary)] shadow-md"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  aria-label={`View image ${i + 1}`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    className="w-full h-full object-contain p-2"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "https://graphics.secondipity.com/B2C/5409336_1.jpg";
                    }}
                  />
                </motion.button>
              ))}
            </div>
          </Reveal>

          {/* Product info */}
          <Reveal delay={0.1} className="flex flex-col gap-5">
            {/* Title & rating */}
            <div>
              <p className="text-sm font-medium text-[var(--primary)] mb-1">{product.category}</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight tracking-tight text-balance mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <StarRating rating={product.rating} size={18} />
                <span className="text-sm font-semibold text-amber-600">{product.rating}</span>
                <span className="text-sm text-gray-500">
                  ({product.reviewCount.toLocaleString("en-US")} reviews)
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Eye size={14} />
                  <span>1,284 viewed today</span>
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 flex-wrap">
              <span className="text-4xl font-extrabold text-gray-900">
                {APP_CURRENCY_SYMBOL}{product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">
                  {APP_CURRENCY_SYMBOL}{product.originalPrice.toFixed(2)}
                </span>
              )}
              {discount > 0 && (
                <span className="text-sm font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                  Save {APP_CURRENCY_SYMBOL}{((product.originalPrice ?? 0) - product.price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-2">
              {product.inStock ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                  <span className="text-sm font-medium text-green-700">In Stock</span>
                  <span className="text-sm text-gray-500">— Ships within 1-2 business days</span>
                </>
              ) : (
                <>
                  <AlertCircle size={14} className="text-red-500" />
                  <span className="text-sm font-medium text-red-600">Out of Stock</span>
                </>
              )}
            </div>

            {/* Short description */}
            <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>

            {/* Quantity selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors duration-150"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="px-5 py-2 font-semibold text-gray-900 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 99}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors duration-150"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: addedToCart ? "#16a34a" : "var(--primary)",
                  color: "var(--foreground)",
                }}
                whileHover={{ scale: product.inStock ? 1.02 : 1 }}
                whileTap={{ scale: product.inStock ? 0.97 : 1 }}
              >
                <AnimatePresence mode="wait">
                  {addedToCart ? (
                    <motion.span
                      key="added"
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                    >
                      <Check size={18} /> Added to Cart!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                    >
                      <ShoppingCart size={18} /> Add to Cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <motion.button
                onClick={() => setWishlisted((v) => !v)}
                className={`flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-semibold text-sm border-2 transition-all duration-200 ${
                  wishlisted
                    ? "border-red-400 bg-red-50 text-red-600"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
                <span className="hidden sm:inline">{wishlisted ? "Wishlisted" : "Wishlist"}</span>
              </motion.button>

              <motion.button
                className="flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-semibold text-sm border-2 border-gray-300 bg-white text-gray-700 hover:border-gray-400 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                aria-label="Share product"
              >
                <Share2 size={18} />
              </motion.button>
            </div>

            {/* Buy now */}
            <motion.button
              disabled={!product.inStock}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: product.inStock ? 1.01 : 1 }}
              whileTap={{ scale: product.inStock ? 0.98 : 1 }}
            >
              Buy Now
            </motion.button>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: <Truck size={18} />, label: "Free Shipping", sub: "Orders over $50" },
                { icon: <RotateCcw size={18} />, label: "30-Day Returns", sub: "Hassle-free" },
                { icon: <Shield size={18} />, label: "2-Year Warranty", sub: "Manufacturer" },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex flex-col items-center text-center gap-1 p-3 bg-white rounded-xl border border-gray-200"
                >
                  <span style={{ color: "var(--primary)" }}>{badge.icon}</span>
                  <span className="text-xs font-semibold text-gray-800">{badge.label}</span>
                  <span className="text-xs text-gray-500">{badge.sub}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* ── Tabs: Description / Specs / Reviews ── */}
        <Reveal className="mb-16">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden" style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -8px rgba(0,0,0,0.10)" }}>
            {/* Tab bar */}
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {(["description", "specs", "reviews"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-6 py-4 text-sm font-semibold capitalize whitespace-nowrap transition-colors duration-200 ${
                    activeTab === tab ? "text-[var(--primary)]" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {tab === "reviews" ? `Reviews (${product.reviewCount.toLocaleString("en-US")})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ backgroundColor: "var(--primary)" }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {activeTab === "description" && (
                  <motion.div
                    key="description"
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                  >
                    <p className="text-base leading-relaxed mb-4">{product.description}</p>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Key Features</h3>
                    <ul className="space-y-2">
                      {[
                        "Industry-leading noise cancellation powered by two processors and eight microphones",
                        "30-hour battery life with quick charging (3 min charge = 3 hours playback)",
                        "Multipoint connection — seamlessly switch between two Bluetooth devices",
                        "Crystal-clear hands-free calling with precise voice pickup",
                        "Speak-to-Chat technology automatically reduces volume during conversations",
                        "Adaptive Sound Control adjusts ambient sound settings based on your activity",
                        "Premium soft-fit leather ear pads for all-day comfort",
                        "Foldable design with carrying case for easy travel",
                      ].map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { label: "30h", sub: "Battery Life" },
                        { label: "8", sub: "Microphones" },
                        { label: "5.2", sub: "Bluetooth" },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100"
                        >
                          <p className="text-3xl font-extrabold" style={{ color: "var(--primary)" }}>
                            {stat.label}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">{stat.sub}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "specs" && (
                  <motion.div
                    key="specs"
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Technical Specifications</h3>
                    <div className="divide-y divide-gray-100">
                      {Object.entries(product.specs ?? {}).map(([key, value]) => (
                        <div key={key} className="flex py-3 gap-4">
                          <span className="w-44 flex-shrink-0 text-sm font-semibold text-gray-600">
                            {key}
                          </span>
                          <span className="text-sm text-gray-800">{value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <AccordionItem title="In the Box">
                        <ul className="space-y-1">
                          {[
                            "WH-1000XM5 Headphones",
                            "USB-C Charging Cable",
                            "3.5mm Audio Cable",
                            "Carrying Case",
                            "Quick Start Guide",
                          ].map((item) => (
                            <li key={item} className="flex items-center gap-2">
                              <Check size={14} className="text-green-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </AccordionItem>
                      <AccordionItem title="Compatibility">
                        Compatible with iOS, Android, Windows, and macOS. Works with Google Assistant and Amazon Alexa. Supports LDAC, AAC, and SBC codecs.
                      </AccordionItem>
                      <AccordionItem title="Warranty Information">
                        Covered by a 2-year limited manufacturer warranty. Extended warranty plans available at checkout. Contact Sony support for warranty claims.
                      </AccordionItem>
                    </div>
                  </motion.div>
                )}

                {activeTab === "reviews" && (
                  <motion.div
                    key="reviews"
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {/* Rating summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-200">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <span className="text-7xl font-extrabold text-gray-900">{product.rating}</span>
                        <StarRating rating={product.rating} size={24} />
                        <span className="text-sm text-gray-500">
                          Based on {product.reviewCount.toLocaleString("en-US")} reviews
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 justify-center">
                        {ratingDistribution.map((r) => (
                          <RatingBar key={r.label} label={r.label} value={r.value} total={totalReviews} />
                        ))}
                      </div>
                    </div>

                    {/* Review list */}
                    <div className="space-y-6">
                      {REVIEWS.map((review, i) => (
                        <Reveal key={review.id} delay={i * 0.07}>
                          <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-gray-900 text-sm">{review.author}</span>
                                  {review.verified && (
                                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                                      <Check size={10} /> Verified Purchase
                                    </span>
                                  )}
                                </div>
                                <StarRating rating={review.rating} size={14} />
                              </div>
                              <span className="text-xs text-gray-400 flex-shrink-0">{review.date}</span>
                            </div>
                            <p className="font-semibold text-gray-800 text-sm mb-1">{review.title}</p>
                            <p className="text-sm text-gray-600 leading-relaxed">{review.body}</p>
                          </div>
                        </Reveal>
                      ))}
                    </div>

                    <div className="mt-6 text-center">
                      <button className="px-6 py-2.5 rounded-xl border-2 border-gray-300 text-sm font-semibold text-gray-700 hover:border-gray-400 transition-colors duration-200">
                        Load More Reviews
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>

        {/* ── Related Products ── */}
        <Reveal className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {RELATED_PRODUCTS.map((rp, i) => (
              <motion.div
                key={rp.id}
                variants={scaleIn}
                whileHover="hover"
                initial="rest"
                animate="rest"
                custom={i}
              >
                <motion.div
                  variants={cardHover}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer group"
                >
                  <div className="relative aspect-square bg-gray-50 flex items-center justify-center p-4">
                    <img
                      src={rp.image}
                      alt={rp.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "https://graphics.secondipity.com/B2C/5409336_1.jpg";
                      }}
                    />
                    {rp.badge && (
                      <span
                        className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: "var(--primary)" }}
                      >
                        {rp.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 mb-2">
                      {rp.name}
                    </p>
                    <div className="flex items-center gap-1.5 mb-2">
                      <StarRating rating={rp.rating} size={12} />
                      <span className="text-xs text-gray-500">({rp.reviewCount.toLocaleString("en-US")})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">
                        {APP_CURRENCY_SYMBOL}{rp.price.toFixed(2)}
                      </span>
                      {rp.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          {APP_CURRENCY_SYMBOL}{rp.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <motion.button
                      className="mt-3 w-full py-2 rounded-lg text-xs font-bold transition-colors duration-200"
                      style={{ backgroundColor: "var(--primary)", color: "var(--foreground)" }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </Reveal>

        {/* ── Delivery & Returns info strip ── */}
        <Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              {
                icon: <Truck size={24} />,
                title: "Free Standard Shipping",
                body: "On all orders over $50. Estimated delivery 3-5 business days.",
              },
              {
                icon: <RotateCcw size={24} />,
                title: "Easy 30-Day Returns",
                body: "Not satisfied? Return it within 30 days for a full refund, no questions asked.",
              },
              {
                icon: <Shield size={24} />,
                title: "Secure Checkout",
                body: "Your payment information is encrypted and never stored on our servers.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-200"
                style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px -4px rgba(0,0,0,0.08)" }}
              >
                <span style={{ color: "var(--primary)" }} className="flex-shrink-0 mt-0.5">
                  {item.icon}
                </span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">{item.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </main>
  );
}