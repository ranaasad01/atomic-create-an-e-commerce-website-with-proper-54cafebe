"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Filter, ChevronDown, Star, Heart, ShoppingCart, SlidersHorizontal, X, Check, ArrowRight } from 'lucide-react';
import { useTranslations } from "next-intl";
import { APP_CURRENCY_SYMBOL } from "@/lib/data";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";
import { Reveal } from "@/components/Reveal";
import { useCart } from "@/lib/cart-context";

// ─── Inline mock data ────────────────────────────────────────────────────────

const FASHION_PRODUCTS = [
  {
    id: "f1",
    name: "Classic Slim-Fit Oxford Shirt",
    brand: "Polo Essentials",
    price: 49.99,
    originalPrice: 79.99,
    image: "/images/slim-fit-oxford-shirt-men.jpg",
    rating: 4.7,
    reviewCount: 1284,
    badge: "Best Seller",
    colors: ["#FFFFFF", "#4A90D9", "#2C3E50"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    category: "Men",
    inStock: true,
    isNew: false,
    isSale: true,
  },
  {
    id: "f2",
    name: "Floral Wrap Midi Dress",
    brand: "Bloom Studio",
    price: 64.99,
    originalPrice: undefined,
    image: "/images/floral-wrap-midi-dress-women.jpg",
    rating: 4.9,
    reviewCount: 876,
    badge: "New Arrival",
    colors: ["#E8A0BF", "#F5CBA7", "#82E0AA"],
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "Women",
    inStock: true,
    isNew: true,
    isSale: false,
  },
  {
    id: "f3",
    name: "Premium Leather Chelsea Boots",
    brand: "Craftsman Co.",
    price: 129.99,
    originalPrice: 179.99,
    image: "/images/leather-chelsea-boots-brown.jpg",
    rating: 4.6,
    reviewCount: 542,
    badge: "Sale",
    colors: ["#5D4037", "#212121", "#8D6E63"],
    sizes: ["7", "8", "9", "10", "11", "12"],
    category: "Shoes",
    inStock: true,
    isNew: false,
    isSale: true,
  },
  {
    id: "f4",
    name: "Oversized Knit Sweater",
    brand: "Cozy Threads",
    price: 54.99,
    originalPrice: undefined,
    image: "/images/oversized-knit-sweater-beige.jpg",
    rating: 4.8,
    reviewCount: 1103,
    badge: "Trending",
    colors: ["#F5F0E8", "#C8A882", "#8B7355"],
    sizes: ["S", "M", "L", "XL"],
    category: "Women",
    inStock: true,
    isNew: false,
    isSale: false,
  },
  {
    id: "f5",
    name: "Slim Tapered Chino Pants",
    brand: "Urban Fit",
    price: 44.99,
    originalPrice: 59.99,
    image: "/images/slim-tapered-chino-pants-navy.jpg",
    rating: 4.5,
    reviewCount: 789,
    badge: undefined,
    colors: ["#1A237E", "#4E342E", "#37474F"],
    sizes: ["28", "30", "32", "34", "36", "38"],
    category: "Men",
    inStock: true,
    isNew: false,
    isSale: true,
  },
  {
    id: "f6",
    name: "Structured Tote Handbag",
    brand: "Luxe Carry",
    price: 89.99,
    originalPrice: undefined,
    image: "/images/structured-tote-handbag-tan.jpg",
    rating: 4.7,
    reviewCount: 431,
    badge: "New Arrival",
    colors: ["#D2B48C", "#212121", "#C0392B"],
    sizes: ["One Size"],
    category: "Accessories",
    inStock: true,
    isNew: true,
    isSale: false,
  },
  {
    id: "f7",
    name: "Athletic Performance Joggers",
    brand: "ActiveZone",
    price: 39.99,
    originalPrice: 54.99,
    image: "/images/athletic-performance-joggers-black.jpg",
    rating: 4.6,
    reviewCount: 2187,
    badge: "Best Seller",
    colors: ["#212121", "#546E7A", "#1B5E20"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    category: "Men",
    inStock: true,
    isNew: false,
    isSale: true,
  },
  {
    id: "f8",
    name: "Linen Wide-Leg Trousers",
    brand: "Bloom Studio",
    price: 59.99,
    originalPrice: undefined,
    image: "/images/linen-wide-leg-trousers-white.jpg",
    rating: 4.8,
    reviewCount: 654,
    badge: "New Arrival",
    colors: ["#FAFAFA", "#F5F0E8", "#B0BEC5"],
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "Women",
    inStock: true,
    isNew: true,
    isSale: false,
  },
  {
    id: "f9",
    name: "Minimalist Leather Watch",
    brand: "Timecraft",
    price: 149.99,
    originalPrice: 199.99,
    image: "/images/minimalist-leather-watch-brown.jpg",
    rating: 4.9,
    reviewCount: 328,
    badge: "Sale",
    colors: ["#8B6914", "#212121"],
    sizes: ["One Size"],
    category: "Accessories",
    inStock: true,
    isNew: false,
    isSale: true,
  },
  {
    id: "f10",
    name: "Kids Graphic Tee Bundle (3-Pack)",
    brand: "Little Stars",
    price: 29.99,
    originalPrice: 44.99,
    image: "/images/kids-graphic-tee-bundle-colorful.jpg",
    rating: 4.7,
    reviewCount: 912,
    badge: "Value Pack",
    colors: ["#E91E63", "#2196F3", "#FF9800"],
    sizes: ["2T", "3T", "4T", "5T", "6", "7"],
    category: "Kids",
    inStock: true,
    isNew: false,
    isSale: true,
  },
  {
    id: "f11",
    name: "Ribbed Turtleneck Top",
    brand: "Cozy Threads",
    price: 34.99,
    originalPrice: undefined,
    image: "/images/ribbed-turtleneck-top-cream.jpg",
    rating: 4.6,
    reviewCount: 567,
    badge: undefined,
    colors: ["#F5F0E8", "#212121", "#C0392B"],
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "Women",
    inStock: true,
    isNew: false,
    isSale: false,
  },
  {
    id: "f12",
    name: "Canvas Slip-On Sneakers",
    brand: "StreetStep",
    price: 42.99,
    originalPrice: 55.99,
    image: "/images/canvas-slip-on-sneakers-white.jpg",
    rating: 4.5,
    reviewCount: 1456,
    badge: "Sale",
    colors: ["#FAFAFA", "#212121", "#E53935"],
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
    category: "Shoes",
    inStock: true,
    isNew: false,
    isSale: true,
  },
];

const CATEGORIES_FILTER = ["All", "Women", "Men", "Shoes", "Accessories", "Kids"];
const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Best Rating", value: "rating" },
  { label: "Most Reviews", value: "reviews" },
  { label: "New Arrivals", value: "new" },
];

const PRICE_RANGES = [
  { label: "Under $30", min: 0, max: 30 },
  { label: "$30 – $60", min: 30, max: 60 },
  { label: "$60 – $100", min: 60, max: 100 },
  { label: "$100 – $150", min: 100, max: 150 },
  { label: "Over $150", min: 150, max: Infinity },
];

const HERO_BANNERS = [
  {
    id: "b1",
    title: "Spring Collection 2025",
    subtitle: "Fresh styles for a new season",
    cta: "Shop Women",
    href: "#women",
    image: "/images/spring-fashion-collection-women.jpg",
    accent: "#E8A0BF",
  },
  {
    id: "b2",
    title: "Men's Essentials",
    subtitle: "Timeless pieces, modern cuts",
    cta: "Shop Men",
    href: "#men",
    image: "/images/mens-fashion-essentials-lookbook.jpg",
    accent: "#4A90D9",
  },
];

// ─── Star Rating Component ────────────────────────────────────────────────────

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={12}
            className={
              star <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200"
            }
          />
        ))}
      </div>
      <span className="text-xs text-gray-500">({count.toLocaleString("en-US")})</span>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: (typeof FASHION_PRODUCTS)[0] }) {
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const discount =
    product.originalPrice != null
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: "Fashion",
        categorySlug: "fashion",
        rating: product.rating,
        reviewCount: product.reviewCount,
        badge: product.badge,
        description: product.name,
        inStock: product.inStock,
      },
      1
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      className="group relative bg-white rounded-2xl overflow-hidden border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.06)] flex flex-col"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/4] bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{
                backgroundColor:
                  product.badge === "Sale" || product.isSale
                    ? "#EF4444"
                    : product.isNew
                    ? "#10B981"
                    : "var(--primary, #F59E0B)",
                color: "#fff",
              }}
            >
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500 text-white">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={() => setWished((w) => !w)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all duration-200 hover:scale-110"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={15}
            className={wished ? "fill-red-500 text-red-500" : "text-gray-400"}
          />
        </button>

        {/* Quick add overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            className="w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors duration-200"
            style={{
              backgroundColor: added ? "#10B981" : "var(--nav, #1a1a2e)",
              color: "#fff",
            }}
          >
            {added ? (
              <>
                <Check size={15} /> Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart size={15} /> Quick Add
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          {product.brand}
        </p>
        <Link
          href={`/product/${product.id}`}
          className="text-sm font-semibold text-gray-900 leading-snug hover:text-[var(--primary)] transition-colors duration-200 line-clamp-2"
        >
          {product.name}
        </Link>

        <StarRating rating={product.rating} count={product.reviewCount} />

        {/* Colors */}
        <div className="flex items-center gap-1 mt-1">
          {product.colors.slice(0, 4).map((color, i) => (
            <span
              key={i}
              className="w-3.5 h-3.5 rounded-full border border-black/10 flex-shrink-0"
              style={{ backgroundColor: color }}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-[10px] text-gray-400">+{product.colors.length - 4}</span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto pt-2">
          <span className="text-base font-bold text-gray-900">
            {APP_CURRENCY_SYMBOL}{product.price.toFixed(2)}
          </span>
          {product.originalPrice != null && (
            <span className="text-sm text-gray-400 line-through">
              {APP_CURRENCY_SYMBOL}{product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FashionCategoryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSort, setSelectedSort] = useState("featured");
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [newOnly, setNewOnly] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...FASHION_PRODUCTS];

    if (selectedCategory !== "All") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (selectedPriceRange !== null) {
      const range = PRICE_RANGES[selectedPriceRange];
      if (range) {
        list = list.filter((p) => p.price >= range.min && p.price < range.max);
      }
    }

    if (onSaleOnly) list = list.filter((p) => p.isSale);
    if (newOnly) list = list.filter((p) => p.isNew);

    switch (selectedSort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        list.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "new":
        list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        break;
    }

    return list;
  }, [selectedCategory, selectedSort, selectedPriceRange, onSaleOnly, newOnly]);

  const activeFiltersCount =
    (selectedCategory !== "All" ? 1 : 0) +
    (selectedPriceRange !== null ? 1 : 0) +
    (onSaleOnly ? 1 : 0) +
    (newOnly ? 1 : 0);

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedPriceRange(null);
    setOnSaleOnly(false);
    setNewOnly(false);
  };

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === selectedSort)?.label ?? "Featured";

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <Reveal>
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] py-16 px-4">
          <div className="mx-auto max-w-[1400px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {HERO_BANNERS.map((banner, i) => (
                <motion.div
                  key={banner.id}
                  variants={i === 0 ? { hidden: { opacity: 0, x: -32 }, visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: "easeOut" } } } : { hidden: { opacity: 0, x: 32 }, visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: "easeOut", delay: 0.1 } } }}
                  initial="hidden"
                  animate="visible"
                  className="relative rounded-2xl overflow-hidden min-h-[260px] flex items-end group cursor-pointer"
                >
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="relative z-10 p-6">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: banner.accent }}>
                      {banner.subtitle}
                    </p>
                    <h2 className="text-2xl font-extrabold text-white mb-3 tracking-tight">
                      {banner.title}
                    </h2>
                    <Link
                      href={banner.href}
                      className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 hover:gap-3"
                      style={{ backgroundColor: banner.accent, color: "#1a1a2e" }}
                    >
                      {banner.cta} <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <Reveal>
        <div className="mx-auto max-w-[1400px] px-4 pt-10 pb-4">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                <Link href="/" className="hover:text-gray-700 transition-colors">Home</Link>
                <span>/</span>
                <span className="text-gray-700 font-medium">Fashion</span>
              </nav>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                Fashion
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                {filtered.length} styles found — free shipping on orders over $50
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ── Category Pills ───────────────────────────────────────────────── */}
      <Reveal>
        <div className="mx-auto max-w-[1400px] px-4 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES_FILTER.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200"
                style={
                  selectedCategory === cat
                    ? { backgroundColor: "var(--primary, #F59E0B)", color: "#1a1a2e", borderColor: "var(--primary, #F59E0B)" }
                    : { backgroundColor: "#fff", color: "#374151", borderColor: "#E5E7EB" }
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── Filter & Sort Bar ────────────────────────────────────────────── */}
      <Reveal>
        <div className="mx-auto max-w-[1400px] px-4 pb-6">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Filter toggle */}
            <button
              onClick={() => setFilterOpen((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:border-gray-400 transition-all duration-200 shadow-sm"
            >
              <SlidersHorizontal size={15} />
              Filters
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white" style={{ backgroundColor: "var(--primary, #F59E0B)", color: "#1a1a2e" }}>
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen((v) => !v)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:border-gray-400 transition-all duration-200 shadow-sm"
              >
                Sort: {currentSortLabel}
                <ChevronDown size={14} className={sortOpen ? "rotate-180" : ""} style={{ transition: "transform 0.2s" }} />
              </button>
              {sortOpen && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl border border-gray-100 shadow-lg z-30 overflow-hidden">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setSelectedSort(opt.value); setSortOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between"
                    >
                      {opt.label}
                      {selectedSort === opt.value && <Check size={13} className="text-green-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Active filter chips */}
            {onSaleOnly && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold border border-red-100">
                On Sale
                <button onClick={() => setOnSaleOnly(false)} className="ml-1 hover:text-red-800"><X size={11} /></button>
              </span>
            )}
            {newOnly && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold border border-green-100">
                New Arrivals
                <button onClick={() => setNewOnly(false)} className="ml-1 hover:text-green-900"><X size={11} /></button>
              </span>
            )}
            {selectedPriceRange !== null && PRICE_RANGES[selectedPriceRange] && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                {PRICE_RANGES[selectedPriceRange]?.label}
                <button onClick={() => setSelectedPriceRange(null)} className="ml-1 hover:text-blue-900"><X size={11} /></button>
              </span>
            )}
            {activeFiltersCount > 0 && (
              <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-gray-700 underline transition-colors">
                Clear all
              </button>
            )}
          </div>

          {/* Expanded filter panel */}
          {filterOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-3 p-5 bg-white rounded-2xl border border-gray-100 shadow-md grid grid-cols-1 sm:grid-cols-3 gap-6"
            >
              {/* Price range */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Price Range</p>
                <div className="flex flex-col gap-2">
                  {PRICE_RANGES.map((range, i) => (
                    <label key={i} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="price"
                        checked={selectedPriceRange === i}
                        onChange={() => setSelectedPriceRange(i)}
                        className="accent-amber-400"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                        {range.label}
                      </span>
                    </label>
                  ))}
                  {selectedPriceRange !== null && (
                    <button onClick={() => setSelectedPriceRange(null)} className="text-xs text-gray-400 hover:text-gray-700 text-left underline mt-1">
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Availability */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Availability</p>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onSaleOnly}
                      onChange={(e) => setOnSaleOnly(e.target.checked)}
                      className="accent-amber-400 w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">On Sale</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newOnly}
                      onChange={(e) => setNewOnly(e.target.checked)}
                      className="accent-amber-400 w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">New Arrivals</span>
                  </label>
                </div>
              </div>

              {/* Category */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Category</p>
                <div className="flex flex-col gap-2">
                  {CATEGORIES_FILTER.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="cat"
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                        className="accent-amber-400"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </Reveal>

      {/* ── Product Grid ─────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1400px] px-4 pb-20">
        {filtered.length === 0 ? (
          <Reveal>
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Filter size={48} className="text-gray-200 mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">No products match your filters</h3>
              <p className="text-gray-400 mb-6">Try adjusting or clearing your filters to see more results.</p>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: "var(--primary, #F59E0B)", color: "#1a1a2e" }}
              >
                Clear All Filters
              </button>
            </div>
          </Reveal>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            {filtered.map((product, i) => (
              <motion.div key={product.id} variants={scaleIn}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* ── Style Guide Banner ───────────────────────────────────────────── */}
      <Reveal>
        <section className="mx-auto max-w-[1400px] px-4 pb-20">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#1a1a2e] to-[#2d2d44] p-10 md:p-16 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--primary, #F59E0B)" }}>
                Style Guide
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
                Build Your Perfect Wardrobe
              </h2>
              <p className="text-white/60 text-sm leading-relaxed max-w-md mb-6">
                From everyday essentials to statement pieces, MarketHub Fashion has everything you need to express your unique style. Free returns on all clothing orders.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Link
                  href="/category/fashion"
                  className="px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 hover:opacity-90"
                  style={{ backgroundColor: "var(--primary, #F59E0B)", color: "#1a1a2e" }}
                >
                  Shop All Fashion
                </Link>
                <Link
                  href="/cart"
                  className="px-6 py-2.5 rounded-full text-sm font-bold border border-white/20 text-white hover:bg-white/10 transition-all duration-200"
                >
                  View Cart
                </Link>
              </div>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              {["👗", "👟", "👜", "🧥"].map((emoji, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
                  className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-2xl border border-white/10"
                >
                  {emoji}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}