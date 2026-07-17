"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart, Filter, ChevronDown, Search, Zap, Award, Truck, RotateCcw, X } from 'lucide-react';
import { useTranslations } from "next-intl";
import { APP_CURRENCY_SYMBOL } from "@/lib/data";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/motion";
import { Reveal } from "@/components/Reveal";
import { useCart } from "@/lib/cart-context";

// ─── Inline mock data ────────────────────────────────────────────────────────

const SPORTS_PRODUCTS = [
  {
    id: "sp1",
    name: "Nike Air Zoom Pegasus 40 Running Shoes",
    price: 129.99,
    originalPrice: 159.99,
    image: "/images/nike-air-zoom-pegasus-running-shoes.jpg",
    rating: 4.8,
    reviewCount: 3241,
    badge: "Best Seller",
    category: "Footwear",
    inStock: true,
    description: "Responsive cushioning for everyday training runs with a breathable mesh upper.",
    brand: "Nike",
    colors: ["Black", "White", "Blue"],
  },
  {
    id: "sp2",
    name: "Bowflex SelectTech 552 Adjustable Dumbbells",
    price: 349.99,
    originalPrice: 429.99,
    image: "/images/bowflex-selecttech-552-adjustable-dumbbells.jpg",
    rating: 4.9,
    reviewCount: 1872,
    badge: "Top Rated",
    category: "Fitness Equipment",
    inStock: true,
    description: "Replaces 15 sets of weights. Adjusts from 5 to 52.5 lbs in 2.5 lb increments.",
    brand: "Bowflex",
    colors: [],
  },
  {
    id: "sp3",
    name: "Peloton Cycling Water Bottle 24oz",
    price: 14.99,
    originalPrice: undefined,
    image: "/images/peloton-cycling-water-bottle.jpg",
    rating: 4.5,
    reviewCount: 654,
    badge: undefined,
    category: "Accessories",
    inStock: true,
    description: "Leak-proof, BPA-free water bottle designed for intense workouts.",
    brand: "Peloton",
    colors: ["Black", "White"],
  },
  {
    id: "sp4",
    name: "Wilson Pro Staff RF97 Tennis Racket",
    price: 249.99,
    originalPrice: 299.99,
    image: "/images/wilson-pro-staff-rf97-tennis-racket.jpg",
    rating: 4.7,
    reviewCount: 892,
    badge: "Pro Choice",
    category: "Racket Sports",
    inStock: true,
    description: "Roger Federer's signature racket. 97 sq in head, 340g, 16x19 string pattern.",
    brand: "Wilson",
    colors: ["Black/Red"],
  },
  {
    id: "sp5",
    name: "Adidas Ultraboost 23 Running Shoes",
    price: 189.99,
    originalPrice: 220.0,
    image: "/images/adidas-ultraboost-23-running-shoes.jpg",
    rating: 4.7,
    reviewCount: 2108,
    badge: "New Arrival",
    category: "Footwear",
    inStock: true,
    description: "Energy-returning BOOST midsole with a Primeknit+ upper for a sock-like fit.",
    brand: "Adidas",
    colors: ["Core Black", "Cloud White", "Solar Red"],
  },
  {
    id: "sp6",
    name: "Manduka PRO Yoga Mat 6mm",
    price: 120.0,
    originalPrice: undefined,
    image: "/images/manduka-pro-yoga-mat-6mm.jpg",
    rating: 4.9,
    reviewCount: 1543,
    badge: "Editor's Pick",
    category: "Yoga & Pilates",
    inStock: true,
    description: "Lifetime guarantee. Dense 6mm cushioning, closed-cell surface, non-slip grip.",
    brand: "Manduka",
    colors: ["Black", "Midnight", "Sage"],
  },
  {
    id: "sp7",
    name: "Spalding NBA Official Game Basketball",
    price: 159.99,
    originalPrice: 179.99,
    image: "/images/spalding-nba-official-game-basketball.jpg",
    rating: 4.6,
    reviewCount: 734,
    badge: undefined,
    category: "Team Sports",
    inStock: true,
    description: "Official NBA game ball. Full-grain leather, size 7, indoor use.",
    brand: "Spalding",
    colors: [],
  },
  {
    id: "sp8",
    name: "Garmin Forerunner 955 GPS Running Watch",
    price: 499.99,
    originalPrice: 599.99,
    image: "/images/garmin-forerunner-955-gps-running-watch.jpg",
    rating: 4.8,
    reviewCount: 1201,
    badge: "Premium",
    category: "Wearables",
    inStock: false,
    description: "Advanced GPS running watch with training load focus, race predictor, and 20-day battery.",
    brand: "Garmin",
    colors: ["Black", "Solar"],
  },
  {
    id: "sp9",
    name: "TRX All-in-One Suspension Training System",
    price: 199.95,
    originalPrice: 249.95,
    image: "/images/trx-all-in-one-suspension-training-system.jpg",
    rating: 4.7,
    reviewCount: 2876,
    badge: "Best Value",
    category: "Fitness Equipment",
    inStock: true,
    description: "Full-body workout anywhere. Includes anchor, door anchor, and workout guide.",
    brand: "TRX",
    colors: [],
  },
  {
    id: "sp10",
    name: "Under Armour HOVR Phantom 3 Running Shoes",
    price: 139.99,
    originalPrice: 160.0,
    image: "/images/under-armour-hovr-phantom-3-running-shoes.jpg",
    rating: 4.5,
    reviewCount: 987,
    badge: undefined,
    category: "Footwear",
    inStock: true,
    description: "Zero-gravity feel with energy return. Connected running app tracks your form.",
    brand: "Under Armour",
    colors: ["Black", "White", "Red"],
  },
  {
    id: "sp11",
    name: "Callaway Rogue ST Max Driver",
    price: 329.99,
    originalPrice: 399.99,
    image: "/images/callaway-rogue-st-max-driver-golf.jpg",
    rating: 4.6,
    reviewCount: 543,
    badge: undefined,
    category: "Golf",
    inStock: true,
    description: "Jailbreak AI Speed Frame for maximum ball speed. Adjustable loft 9-12 degrees.",
    brand: "Callaway",
    colors: [],
  },
  {
    id: "sp12",
    name: "Hydro Flask 32oz Wide Mouth Sports Bottle",
    price: 44.95,
    originalPrice: undefined,
    image: "/images/hydro-flask-32oz-wide-mouth-sports-bottle.jpg",
    rating: 4.9,
    reviewCount: 5621,
    badge: "Fan Favorite",
    category: "Accessories",
    inStock: true,
    description: "TempShield double-wall insulation keeps drinks cold 24 hrs, hot 12 hrs.",
    brand: "Hydro Flask",
    colors: ["Black", "Pacific", "Flamingo", "Olive"],
  },
];

const SUBCATEGORIES = [
  { label: "All", value: "all" },
  { label: "Footwear", value: "Footwear" },
  { label: "Fitness Equipment", value: "Fitness Equipment" },
  { label: "Accessories", value: "Accessories" },
  { label: "Racket Sports", value: "Racket Sports" },
  { label: "Yoga & Pilates", value: "Yoga & Pilates" },
  { label: "Team Sports", value: "Team Sports" },
  { label: "Wearables", value: "Wearables" },
  { label: "Golf", value: "Golf" },
];

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Best Rated", value: "rating" },
  { label: "Most Reviews", value: "reviews" },
];

const FEATURED_BRANDS = ["Nike", "Adidas", "Under Armour", "Wilson", "Garmin", "Bowflex", "Manduka", "TRX"];

const HERO_STATS = [
  { value: "500+", label: "Sports Products" },
  { value: "50+", label: "Top Brands" },
  { value: "4.8", label: "Avg. Rating" },
  { value: "Free", label: "Returns" },
];

// ─── Star Rating ─────────────────────────────────────────────────────────────

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

function ProductCard({ product }: { product: (typeof SPORTS_PRODUCTS)[0] }) {
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const discount =
    product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: "Sports",
      categorySlug: "sports",
      rating: product.rating,
      reviewCount: product.reviewCount,
      badge: product.badge,
      description: product.description,
      inStock: product.inStock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      className="group bg-white rounded-2xl overflow-hidden border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)] flex flex-col"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80";
          }}
        />
        {/* Badge */}
        {product.badge && (
          <span
            className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full text-white"
            style={{ backgroundColor: "var(--primary)" }}
          >
            {product.badge}
          </span>
        )}
        {/* Discount */}
        {discount > 0 && (
          <span className="absolute top-3 right-10 text-xs font-bold px-2 py-1 rounded-full bg-red-500 text-white">
            -{discount}%
          </span>
        )}
        {/* Wishlist */}
        <button
          onClick={() => setWished((w) => !w)}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-transform duration-200 hover:scale-110"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={14}
            className={wished ? "fill-red-500 text-red-500" : "text-gray-400"}
          />
        </button>
        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
          {product.brand}
        </span>
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 hover:text-[var(--primary)] transition-colors duration-200">
            {product.name}
          </h3>
        </Link>
        <StarRating rating={product.rating} count={product.reviewCount} />
        <div className="flex items-baseline gap-2 mt-auto pt-2">
          <span className="text-lg font-bold text-gray-900">
            {APP_CURRENCY_SYMBOL}{product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              {APP_CURRENCY_SYMBOL}{product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`mt-1 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            product.inStock
              ? added
                ? "bg-green-500 text-white"
                : "text-white hover:opacity-90"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
          style={
            product.inStock && !added
              ? { backgroundColor: "var(--primary)" }
              : {}
          }
        >
          {added ? (
            <>Added!</>
          ) : (
            <>
              <ShoppingCart size={15} />
              {product.inStock ? "Add to Cart" : "Unavailable"}
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SportsCategoryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceMax, setPriceMax] = useState(600);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...SPORTS_PRODUCTS];

    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    list = list.filter((p) => p.price <= priceMax);

    switch (sortBy) {
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
      default:
        break;
    }

    return list;
  }, [selectedCategory, sortBy, searchQuery, priceMax]);

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Featured";

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ── Hero Banner ── */}
      <Reveal>
        <section
          className="relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, var(--nav) 0%, #1a2a4a 60%, #0f1e38 100%)",
          }}
        >
          {/* Background texture */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, var(--primary) 0%, transparent 50%), radial-gradient(circle at 80% 20%, #60a5fa 0%, transparent 40%)",
            }}
          />
          <div className="relative mx-auto max-w-[1400px] px-4 py-16 md:py-24">
            <div className="flex flex-col md:flex-row items-center gap-10">
              {/* Left copy */}
              <div className="flex-1 text-center md:text-left">
                <motion.span
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4"
                  style={{
                    backgroundColor: "rgba(var(--primary-rgb, 255,153,0), 0.15)",
                    color: "var(--primary)",
                    border: "1px solid rgba(var(--primary-rgb, 255,153,0), 0.3)",
                  }}
                >
                  <Zap size={12} />
                  Sports &amp; Outdoors
                </motion.span>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight text-balance leading-tight mb-4"
                >
                  Gear Up for
                  <br />
                  <span style={{ color: "var(--primary)" }}>Greatness</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-white/70 text-lg leading-relaxed max-w-md mb-8"
                >
                  From elite running shoes to pro-grade fitness equipment. Everything you need to train harder, recover faster, and perform better.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="flex flex-wrap gap-3 justify-center md:justify-start"
                >
                  <a
                    href="#products"
                    className="px-6 py-3 rounded-xl font-semibold text-sm text-[var(--foreground)] transition-all duration-200 hover:opacity-90 hover:scale-105"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    Shop Now
                  </a>
                  <a
                    href="#brands"
                    className="px-6 py-3 rounded-xl font-semibold text-sm text-white border border-white/20 hover:bg-white/10 transition-all duration-200"
                  >
                    Top Brands
                  </a>
                </motion.div>
              </div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-2 gap-4 flex-shrink-0"
              >
                {HERO_STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-5 text-center"
                  >
                    <div
                      className="text-3xl font-extrabold mb-1"
                      style={{ color: "var(--primary)" }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-xs text-white/60 font-medium">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Trust Bar ── */}
      <Reveal>
        <div className="bg-white border-b border-gray-100">
          <div className="mx-auto max-w-[1400px] px-4 py-3 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
            {[
              { icon: <Truck size={15} />, text: "Free shipping over $50" },
              { icon: <RotateCcw size={15} />, text: "30-day free returns" },
              { icon: <Award size={15} />, text: "Authentic gear guaranteed" },
              { icon: <Zap size={15} />, text: "Same-day dispatch" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2">
                <span style={{ color: "var(--primary)" }}>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── Subcategory Pills ── */}
      <Reveal>
        <div className="bg-white border-b border-gray-100 sticky top-14 z-30">
          <div className="mx-auto max-w-[1400px] px-4 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {SUBCATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat.value
                    ? "text-[var(--foreground)]"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                style={
                  selectedCategory === cat.value
                    ? { backgroundColor: "var(--primary)" }
                    : {}
                }
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── Main Content ── */}
      <div id="products" className="mx-auto max-w-[1400px] px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Sidebar Filters ── */}
          <aside className="lg:w-60 flex-shrink-0">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setFilterOpen((o) => !o)}
              className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 mb-4"
            >
              <span className="flex items-center gap-2">
                <Filter size={16} />
                Filters
              </span>
              {filterOpen ? <X size={16} /> : <ChevronDown size={16} />}
            </button>

            <div
              className={`${
                filterOpen ? "block" : "hidden"
              } lg:block space-y-6`}
            >
              {/* Search within category */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Search Sports</h3>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[var(--primary)] transition-colors duration-200"
                  />
                </div>
              </div>

              {/* Price range */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Max Price</h3>
                <input
                  type="range"
                  min={10}
                  max={600}
                  step={10}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-[var(--primary)]"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{APP_CURRENCY_SYMBOL}10</span>
                  <span className="font-semibold text-gray-800">
                    {APP_CURRENCY_SYMBOL}{priceMax}
                  </span>
                  <span>{APP_CURRENCY_SYMBOL}600</span>
                </div>
              </div>

              {/* Category filter */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Category</h3>
                <ul className="space-y-1">
                  {SUBCATEGORIES.map((cat) => (
                    <li key={cat.value}>
                      <button
                        onClick={() => setSelectedCategory(cat.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                          selectedCategory === cat.value
                            ? "font-semibold text-[var(--foreground)]"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                        style={
                          selectedCategory === cat.value
                            ? { backgroundColor: "rgba(var(--primary-rgb,255,153,0),0.12)", color: "var(--primary)" }
                            : {}
                        }
                      >
                        {cat.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Availability */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Availability</h3>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" className="accent-[var(--primary)]" defaultChecked={false} />
                  In Stock Only
                </label>
              </div>
            </div>
          </aside>

          {/* ── Product Grid ── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-800">{filtered.length}</span>{" "}
                results
                {selectedCategory !== "all" && (
                  <span>
                    {" "}in{" "}
                    <span className="font-semibold text-gray-800">{selectedCategory}</span>
                  </span>
                )}
              </p>

              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSortOpen((o) => !o)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors duration-200"
                >
                  Sort: {currentSortLabel}
                  <ChevronDown size={14} />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-100 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.12)] z-20 overflow-hidden">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSortBy(opt.value);
                          setSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 ${
                          sortBy === opt.value
                            ? "font-semibold"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                        style={
                          sortBy === opt.value
                            ? { color: "var(--primary)", backgroundColor: "rgba(var(--primary-rgb,255,153,0),0.08)" }
                            : {}
                        }
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <span className="text-5xl mb-4">⚽</span>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No products found</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Try adjusting your filters or search query.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                    setPriceMax(600);
                  }}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "var(--primary)" }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {filtered.map((product, i) => (
                  <motion.div key={product.id} variants={fadeInUp}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ── Featured Brands ── */}
      <Reveal>
        <section id="brands" className="bg-white border-t border-gray-100 py-12">
          <div className="mx-auto max-w-[1400px] px-4">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Top Sports Brands
            </h2>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              {FEATURED_BRANDS.map((brand, i) => (
                <motion.div
                  key={brand}
                  variants={scaleIn}
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors duration-200 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                >
                  {brand}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </Reveal>

      {/* ── Promo Banner ── */}
      <Reveal>
        <section className="mx-auto max-w-[1400px] px-4 py-10">
          <div
            className="relative overflow-hidden rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6"
            style={{
              background:
                "linear-gradient(135deg, var(--nav) 0%, #1a3a6a 100%)",
            }}
          >
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 80% 50%, var(--primary) 0%, transparent 60%)",
              }}
            />
            <div className="relative text-center md:text-left">
              <p
                className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: "var(--primary)" }}
              >
                Limited Time Offer
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                Up to 30% Off
              </h2>
              <p className="text-white/70 text-base">
                On select fitness equipment and running gear. Ends Sunday.
              </p>
            </div>
            <div className="relative flex-shrink-0">
              <Link
                href="/cart"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base text-[var(--foreground)] transition-all duration-200 hover:opacity-90 hover:scale-105"
                style={{ backgroundColor: "var(--primary)" }}
              >
                <ShoppingCart size={18} />
                Shop the Sale
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── FAQ / Info ── */}
      <Reveal>
        <section className="bg-white border-t border-gray-100 py-12">
          <div className="mx-auto max-w-[1400px] px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Why Shop Sports at MarketHub?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: "🏆",
                  title: "Authentic Gear Only",
                  body: "Every product is sourced directly from authorized brand distributors. No counterfeits, ever.",
                },
                {
                  icon: "🚚",
                  title: "Fast, Free Delivery",
                  body: "Orders over $50 ship free. Most in-stock items arrive within 2 business days.",
                },
                {
                  icon: "🔄",
                  title: "Hassle-Free Returns",
                  body: "Not the right fit? Return any unused item within 30 days for a full refund, no questions asked.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl border border-gray-100"
                >
                  <span className="text-4xl mb-4">{item.icon}</span>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}