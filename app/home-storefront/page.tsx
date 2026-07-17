"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingCart, Heart, ArrowRight, Zap, Shield, Truck, RotateCcw, ChevronRight, Eye, TrendingUp, Award, Clock } from 'lucide-react';
import { useTranslations } from "next-intl";
import { MOCK_PRODUCTS, CATEGORIES, APP_NAME, APP_CURRENCY_SYMBOL } from "@/lib/data";
import type { Product } from "@/lib/data";
import { fadeInUp, staggerContainer, scaleIn, cardHover } from "@/lib/motion";
import { Reveal } from "@/components/Reveal";
import { useCart } from "@/lib/cart-context";

// ─── Inline mock data ────────────────────────────────────────────────────────

const HERO_SLIDES = [
  {
    id: "h1",
    eyebrow: "New Arrivals",
    headline: "Next-Gen Electronics",
    sub: "Discover the latest gadgets, headphones, and smart devices at unbeatable prices.",
    cta: "Shop Electronics",
    href: "/category/electronics",
    badge: "Up to 30% off",
    bg: "from-[#0f172a] via-[#1e293b] to-[#0f172a]",
    accent: "#f59e0b",
    image: "/images/electronics-hero-banner.jpg",
  },
  {
    id: "h2",
    eyebrow: "Trending Now",
    headline: "Fashion Forward",
    sub: "Curated styles for every season. Premium brands, everyday prices.",
    cta: "Explore Fashion",
    href: "/category/fashion",
    badge: "Free shipping over $50",
    bg: "from-[#1a0533] via-[#2d0a4e] to-[#1a0533]",
    accent: "#f59e0b",
    image: "/images/fashion-hero-banner.jpg",
  },
  {
    id: "h3",
    eyebrow: "Home Refresh",
    headline: "Transform Your Space",
    sub: "Everything you need to make your home beautiful, functional, and cozy.",
    cta: "Shop Home & Kitchen",
    href: "/category/home-kitchen",
    badge: "New arrivals weekly",
    bg: "from-[#0c1a0f] via-[#162a1a] to-[#0c1a0f]",
    accent: "#f59e0b",
    image: "/images/home-kitchen-hero-banner.jpg",
  },
];

const FLASH_DEALS = [
  {
    id: "fd1",
    name: "Apple AirPods Pro (2nd Gen)",
    price: 189.99,
    originalPrice: 249.99,
    image: "https://m.media-amazon.com/images/I/61sRKTAfrhL._AC_UF350,350_QL80_.jpg",
    rating: 4.9,
    reviewCount: 5821,
    endsIn: 7200,
    category: "Electronics",
    href: "/product/p-airpods",
  },
  {
    id: "fd2",
    name: "Nike Air Max 270 Running Shoes",
    price: 89.99,
    originalPrice: 150.0,
    image: "https://static.nike.com/a/images/t_web_pdp_936_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/awjogtdnqxniqqk0wpgf/AIR+MAX+270.png",
    rating: 4.7,
    reviewCount: 3102,
    endsIn: 7200,
    category: "Fashion",
    href: "/product/p-nike",
  },
  {
    id: "fd3",
    name: "Instant Pot Duo 7-in-1 Pressure Cooker",
    price: 59.99,
    originalPrice: 99.99,
    image: "https://m.media-amazon.com/images/I/71Z401LjFFL._AC_UF894,1000_QL80_.jpg",
    rating: 4.8,
    reviewCount: 9234,
    endsIn: 7200,
    category: "Home & Kitchen",
    href: "/product/p-instantpot",
  },
  {
    id: "fd4",
    name: "Atomic Habits by James Clear",
    price: 11.99,
    originalPrice: 27.0,
    image: "https://m.media-amazon.com/images/I/81kg51XRc1L._AC_UF1000,1000_QL80_.jpg",
    rating: 4.9,
    reviewCount: 18450,
    endsIn: 7200,
    category: "Books",
    href: "/product/p-atomichabits",
  },
];

const TRENDING_PRODUCTS = [
  {
    id: "t1",
    name: "Samsung 65\" 4K QLED Smart TV",
    price: 799.99,
    originalPrice: 1199.99,
    image: "https://bjs.scene7.com/is/image/bjs/345905?$bjs-Zoom$",
    rating: 4.7,
    reviewCount: 1203,
    badge: "Hot Deal",
    category: "Electronics",
    href: "/product/p-samsung-tv",
  },
  {
    id: "t2",
    name: "Levi's 501 Original Fit Jeans",
    price: 49.99,
    originalPrice: 69.99,
    image: "https://static.wikia.nocookie.net/shingekinokyojin/images/b/b1/Levi_Ackermann_%28Anime%29_character_image.png/revision/latest?cb=20231105181307",
    rating: 4.6,
    reviewCount: 7821,
    badge: "Top Rated",
    category: "Fashion",
    href: "/product/p-levis",
  },
  {
    id: "t3",
    name: "KitchenAid Stand Mixer 5Qt",
    price: 349.99,
    originalPrice: 449.99,
    image: "/images/kitchenaid-stand-mixer-5qt.jpg",
    rating: 4.9,
    reviewCount: 4512,
    badge: "Editor's Pick",
    category: "Home & Kitchen",
    href: "/product/p-kitchenaid",
  },
  {
    id: "t4",
    name: "Garmin Forerunner 255 GPS Watch",
    price: 249.99,
    originalPrice: 349.99,
    image: "/images/garmin-forerunner-255-gps-watch.jpg",
    rating: 4.8,
    reviewCount: 2109,
    badge: "New",
    category: "Sports",
    href: "/product/p-garmin",
  },
  {
    id: "t5",
    name: "The Psychology of Money",
    price: 14.99,
    originalPrice: 22.0,
    image: "/images/psychology-of-money-book.jpg",
    rating: 4.8,
    reviewCount: 12300,
    badge: "Bestseller",
    category: "Books",
    href: "/product/p-psychmoney",
  },
  {
    id: "t6",
    name: "Dyson V15 Detect Cordless Vacuum",
    price: 549.99,
    originalPrice: 749.99,
    image: "/images/dyson-v15-detect-cordless-vacuum.jpg",
    rating: 4.9,
    reviewCount: 3871,
    badge: "Premium",
    category: "Home & Kitchen",
    href: "/product/p-dyson",
  },
];

const PROMO_BANNERS = [
  {
    id: "pb1",
    title: "Free 2-Day Shipping",
    sub: "On orders over $35",
    icon: "🚀",
    bg: "bg-gradient-to-br from-amber-500 to-orange-600",
    href: "/category/electronics",
  },
  {
    id: "pb2",
    title: "30-Day Returns",
    sub: "No questions asked",
    icon: "🔄",
    bg: "bg-gradient-to-br from-blue-600 to-indigo-700",
    href: "/account/orders",
  },
  {
    id: "pb3",
    title: "Secure Checkout",
    sub: "256-bit SSL encryption",
    icon: "🔒",
    bg: "bg-gradient-to-br from-emerald-600 to-teal-700",
    href: "/cart",
  },
];

const TESTIMONIALS = [
  {
    id: "r1",
    name: "Sarah M.",
    avatar: "/images/customer-sarah-avatar.jpg",
    rating: 5,
    text: "MarketHub has completely replaced my Amazon habit. Faster shipping, better prices, and the product quality is consistently excellent.",
    product: "Sony WH-1000XM5",
  },
  {
    id: "r2",
    name: "James T.",
    avatar: "/images/customer-james-avatar.jpg",
    rating: 5,
    text: "The checkout process is seamless and I love how easy it is to track my orders. Got my KitchenAid in two days!",
    product: "KitchenAid Stand Mixer",
  },
  {
    id: "r3",
    name: "Priya K.",
    avatar: "/images/customer-priya-avatar.jpg",
    rating: 5,
    text: "Incredible selection across every category. I found books, running shoes, and a new TV all in one cart. Highly recommend.",
    product: "Garmin Forerunner 255",
  },
];

// ─── Utility ─────────────────────────────────────────────────────────────────

function formatPrice(price: number) {
  return `$${(price ?? 0).toFixed(2)}`;
}

function discountPct(original: number, current: number) {
  if (!original || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
}

function StarRow({ rating, small }: { rating: number; small?: boolean }) {
  const size = small ? 12 : 14;
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-300 fill-gray-200"}
        />
      ))}
    </span>
  );
}

// ─── Sub-components (inline) ──────────────────────────────────────────────────

function ProductCard({
  product,
  onAddToCart,
}: {
  product: (typeof TRENDING_PRODUCTS)[0];
  onAddToCart: (id: string) => void;
}) {
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const pct = discountPct(product.originalPrice ?? 0, product.price);

  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      className="group relative bg-white rounded-2xl border border-black/5 overflow-hidden flex flex-col"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)" }}
    >
      {/* Badge */}
      {product.badge && (
        <span className="absolute top-3 left-3 z-10 text-xs font-bold px-2 py-0.5 rounded-full bg-amber-400 text-gray-900">
          {product.badge}
        </span>
      )}
      {/* Discount */}
      {pct > 0 && (
        <span className="absolute top-3 right-10 z-10 text-xs font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">
          -{pct}%
        </span>
      )}
      {/* Wishlist */}
      <button
        onClick={() => setWished((w) => !w)}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors duration-200"
        aria-label="Add to wishlist"
      >
        <Heart
          size={15}
          className={wished ? "fill-red-500 text-red-500" : "text-gray-400"}
        />
      </button>

      {/* Image */}
      <Link href={product.href} className="block overflow-hidden bg-gray-50 aspect-[4/3]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <span className="text-xs text-amber-600 font-semibold uppercase tracking-wide">
          {product.category}
        </span>
        <Link href={product.href}>
          <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 hover:text-amber-600 transition-colors duration-200">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1.5">
          <StarRow rating={product.rating} small />
          <span className="text-xs text-gray-500">({(product.reviewCount ?? 0).toLocaleString("en-US")})</span>
        </div>
        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
          {(product.originalPrice ?? 0) > product.price && (
            <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice ?? 0)}</span>
          )}
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleAdd}
          className="mt-1 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
          style={{
            backgroundColor: added ? "#16a34a" : "var(--primary, #f59e0b)",
            color: added ? "#fff" : "#1a1a1a",
          }}
        >
          <ShoppingCart size={15} />
          {added ? "Added!" : "Add to Cart"}
        </motion.button>
      </div>
    </motion.div>
  );
}

function FlashDealCard({ deal }: { deal: (typeof FLASH_DEALS)[0] }) {
  const [timeLeft, setTimeLeft] = useState(deal.endsIn);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const mins = Math.floor((timeLeft % 3600) / 60);
  const secs = timeLeft % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  const pct = discountPct(deal.originalPrice, deal.price);

  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      className="bg-white rounded-2xl border border-black/5 overflow-hidden flex flex-col"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)" }}
    >
      <div className="relative bg-gray-50 aspect-[4/3] overflow-hidden">
        <img src={deal.image} alt={deal.name} className="w-full h-full object-cover" />
        {pct > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{pct}%
          </span>
        )}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-1 bg-gray-900/80 backdrop-blur-sm rounded-lg py-1.5">
          <Clock size={12} className="text-amber-400" />
          <span className="text-xs font-mono font-bold text-white">
            {pad(hours)}:{pad(mins)}:{pad(secs)}
          </span>
          <span className="text-xs text-white/60">left</span>
        </div>
      </div>
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <span className="text-xs text-amber-600 font-semibold">{deal.category}</span>
        <Link href={deal.href}>
          <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug hover:text-amber-600 transition-colors">
            {deal.name}
          </p>
        </Link>
        <div className="flex items-center gap-1">
          <StarRow rating={deal.rating} small />
          <span className="text-xs text-gray-400">({(deal.reviewCount ?? 0).toLocaleString("en-US")})</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-gray-900">{formatPrice(deal.price)}</span>
          <span className="text-xs text-gray-400 line-through">{formatPrice(deal.originalPrice)}</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => { setAdded(true); setTimeout(() => setAdded(false), 1800); }}
          className="mt-auto w-full py-2 rounded-xl text-xs font-bold transition-all duration-200"
          style={{ backgroundColor: added ? "#16a34a" : "#f59e0b", color: added ? "#fff" : "#1a1a1a" }}
        >
          {added ? "Added!" : "Grab Deal"}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HomeStorefrontPage() {
  const [heroIdx, setHeroIdx] = useState(0);
  const [cartNotice, setCartNotice] = useState<string | null>(null);

  // Auto-advance hero
  useEffect(() => {
    const t = setInterval(() => setHeroIdx((i) => (i + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const handleAddToCart = (id: string) => {
    const product = TRENDING_PRODUCTS.find((p) => p.id === id);
    if (product) {
      setCartNotice(`"${product.name}" added to cart`);
      setTimeout(() => setCartNotice(null), 2500);
    }
  };

  const slide = HERO_SLIDES[heroIdx];

  return (
    <main className="min-h-screen bg-gray-50">

      {/* ── Cart toast ── */}
      <AnimatePresence>
        {cartNotice && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-full shadow-xl flex items-center gap-2"
          >
            <ShoppingCart size={15} className="text-amber-400" />
            {cartNotice}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ minHeight: 480 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className={`absolute inset-0 bg-gradient-to-r ${slide.bg}`}
          />
        </AnimatePresence>

        {/* Hero image (right side) */}
        <div className="absolute inset-y-0 right-0 w-1/2 hidden lg:block overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={slide.id + "-img"}
              src={slide.image}
              alt={slide.headline}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 0.35, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/60 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-[1400px] px-4 py-20 md:py-28 flex flex-col justify-center" style={{ minHeight: 480 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id + "-text"}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="max-w-xl"
            >
              <span
                className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
                style={{ backgroundColor: slide.accent + "22", color: slide.accent }}
              >
                {slide.eyebrow}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight text-balance mb-4">
                {slide.headline}
              </h1>
              <p className="text-base md:text-lg text-white/70 leading-relaxed mb-6 text-pretty max-w-md">
                {slide.sub}
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  href={slide.href}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{ backgroundColor: slide.accent, color: "#1a1a1a" }}
                >
                  {slide.cta}
                  <ArrowRight size={16} />
                </Link>
                <span className="text-xs font-semibold text-white/60 border border-white/20 px-3 py-1.5 rounded-full">
                  {slide.badge}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slide dots */}
          <div className="flex items-center gap-2 mt-10">
            {HERO_SLIDES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setHeroIdx(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === heroIdx ? 28 : 8,
                  height: 8,
                  backgroundColor: i === heroIdx ? slide.accent : "rgba(255,255,255,0.3)",
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <Reveal>
        <div className="bg-white border-b border-gray-100">
          <div className="mx-auto max-w-[1400px] px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Truck size={18} />, label: "Free 2-Day Shipping", sub: "Orders over $35" },
              { icon: <RotateCcw size={18} />, label: "30-Day Returns", sub: "Hassle-free policy" },
              { icon: <Shield size={18} />, label: "Secure Payments", sub: "256-bit SSL" },
              { icon: <Award size={18} />, label: "Quality Guarantee", sub: "Verified products" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-amber-500">{item.icon}</span>
                <div>
                  <p className="text-xs font-bold text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── Category Grid ── */}
      <Reveal>
        <section className="mx-auto max-w-[1400px] px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Shop by Category</h2>
            <Link href="/category/electronics" className="text-sm font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors">
              All categories <ChevronRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((cat, i) => (
              <Reveal key={cat.slug} delay={i * 0.07}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="group flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-black/5 hover:border-amber-300 hover:shadow-md transition-all duration-250 text-center"
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                >
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-200">
                    {cat.icon}
                  </span>
                  <span className="text-sm font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-xs text-gray-500 leading-snug">{cat.description}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ── Flash Deals ── */}
      <Reveal>
        <section className="bg-gradient-to-r from-red-600 to-orange-500 py-10">
          <div className="mx-auto max-w-[1400px] px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Zap size={22} className="text-white" />
                <h2 className="text-2xl font-extrabold text-white tracking-tight">Flash Deals</h2>
                <span className="text-xs font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">
                  Limited time
                </span>
              </div>
              <Link href="/category/electronics" className="text-sm font-semibold text-white/80 hover:text-white flex items-center gap-1 transition-colors">
                View all <ChevronRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {FLASH_DEALS.map((deal, i) => (
                <Reveal key={deal.id} delay={i * 0.08}>
                  <FlashDealCard deal={deal} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Trending Products ── */}
      <Reveal>
        <section className="mx-auto max-w-[1400px] px-4 py-14">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-amber-500" />
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Trending Now</h2>
            </div>
            <Link href="/category/electronics" className="text-sm font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors">
              See all <ChevronRight size={15} />
            </Link>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {TRENDING_PRODUCTS.map((product, i) => (
              <motion.div key={product.id} variants={scaleIn}>
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      </Reveal>

      {/* ── Promo Banners ── */}
      <Reveal>
        <section className="mx-auto max-w-[1400px] px-4 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PROMO_BANNERS.map((banner, i) => (
              <Reveal key={banner.id} delay={i * 0.1}>
                <Link
                  href={banner.href}
                  className={`${banner.bg} rounded-2xl p-6 flex items-center gap-4 group hover:scale-[1.02] transition-transform duration-200`}
                >
                  <span className="text-4xl">{banner.icon}</span>
                  <div>
                    <p className="text-lg font-extrabold text-white">{banner.title}</p>
                    <p className="text-sm text-white/80">{banner.sub}</p>
                  </div>
                  <ArrowRight size={18} className="ml-auto text-white/60 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ── Featured from MOCK_PRODUCTS ── */}
      <Reveal>
        <section className="bg-white py-14">
          <div className="mx-auto max-w-[1400px] px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Featured Products</h2>
              <Link href="/category/electronics" className="text-sm font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors">
                Browse all <ChevronRight size={15} />
              </Link>
            </div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {(MOCK_PRODUCTS ?? []).slice(0, 4).map((product, i) => {
                const pct = discountPct(product.originalPrice ?? 0, product.price);
                return (
                  <motion.div
                    key={product.id}
                    variants={cardHover}
                    initial="rest"
                    whileHover="hover"
                    className="bg-gray-50 rounded-2xl border border-black/5 overflow-hidden flex flex-col"
                    style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)" }}
                  >
                    {product.badge && (
                      <div className="relative">
                        <span className="absolute top-3 left-3 z-10 text-xs font-bold px-2 py-0.5 rounded-full bg-amber-400 text-gray-900">
                          {product.badge}
                        </span>
                      </div>
                    )}
                    <Link href={`/product/${product.id}`} className="block overflow-hidden aspect-[4/3] bg-white">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                    <div className="p-4 flex flex-col gap-2 flex-1">
                      <span className="text-xs text-amber-600 font-semibold uppercase tracking-wide">
                        {product.category}
                      </span>
                      <Link href={`/product/${product.id}`}>
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug hover:text-amber-600 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-1.5">
                        <StarRow rating={product.rating} small />
                        <span className="text-xs text-gray-500">({(product.reviewCount ?? 0).toLocaleString("en-US")})</span>
                      </div>
                      <div className="flex items-baseline gap-2 mt-auto pt-1">
                        <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
                        {(product.originalPrice ?? 0) > product.price && (
                          <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice ?? 0)}</span>
                        )}
                        {pct > 0 && (
                          <span className="text-xs font-bold text-red-500">-{pct}%</span>
                        )}
                      </div>
                      <Link
                        href={`/product/${product.id}`}
                        className="mt-1 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold bg-amber-400 hover:bg-amber-500 text-gray-900 transition-colors duration-200"
                      >
                        <Eye size={14} />
                        View Product
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      </Reveal>

      {/* ── Testimonials ── */}
      <Reveal>
        <section className="mx-auto max-w-[1400px] px-4 py-14">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">
              What Our Customers Say
            </h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Thousands of happy shoppers trust MarketHub every day.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.id} delay={i * 0.1}>
                <div
                  className="bg-white rounded-2xl border border-black/5 p-6 flex flex-col gap-4"
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)" }}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-200"
                    />
                    <div>
                      <p className="text-sm font-bold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-400">Verified buyer</p>
                    </div>
                    <div className="ml-auto">
                      <StarRow rating={5} small />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">"{t.text}"</p>
                  <p className="text-xs text-amber-600 font-semibold">Purchased: {t.product}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ── Newsletter CTA ── */}
      <Reveal>
        <section className="bg-gradient-to-r from-gray-900 to-gray-800 py-16">
          <div className="mx-auto max-w-[1400px] px-4 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">
                Get exclusive deals in your inbox
              </h2>
              <p className="text-gray-400 text-sm max-w-sm">
                Subscribe and be the first to know about flash sales, new arrivals, and member-only discounts.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </section>
      </Reveal>

    </main>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-3 bg-green-500/20 border border-green-500/30 rounded-2xl px-6 py-4">
        <span className="text-2xl">🎉</span>
        <div>
          <p className="text-white font-bold text-sm">You're subscribed!</p>
          <p className="text-green-300 text-xs">Check your inbox for a welcome offer.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full max-w-md">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        required
        className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm outline-none focus:border-amber-400 transition-colors duration-200"
      />
      <motion.button
        whileTap={{ scale: 0.97 }}
        type="submit"
        className="px-5 py-3 rounded-xl font-bold text-sm text-gray-900 transition-colors duration-200 hover:bg-amber-500 flex-shrink-0"
        style={{ backgroundColor: "#f59e0b" }}
      >
        Subscribe
      </motion.button>
    </form>
  );
}