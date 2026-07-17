"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart, Filter, ChevronDown, X, Check, Search, Truck, RotateCcw, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { useTranslations } from "next-intl";
import { APP_CURRENCY_SYMBOL } from "@/lib/data";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";
import { Reveal } from "@/components/Reveal";
import { useCart } from "@/lib/cart-context";

// ─── Inline mock data ────────────────────────────────────────────────────────

interface HomeProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  description: string;
  inStock: boolean;
  subcategory: string;
  brand: string;
  color?: string;
}

const HOME_PRODUCTS: HomeProduct[] = [
  {
    id: "hk1",
    name: "KitchenAid Artisan Stand Mixer 5-Qt",
    price: 379.99,
    originalPrice: 449.99,
    image: "/images/kitchenaid-stand-mixer-red.jpg",
    rating: 4.9,
    reviewCount: 5821,
    badge: "Best Seller",
    description: "Iconic tilt-head stand mixer with 10 speeds and a 5-quart stainless steel bowl. Includes flat beater, dough hook, and wire whip.",
    inStock: true,
    subcategory: "Kitchen Appliances",
    brand: "KitchenAid",
    color: "Empire Red",
  },
  {
    id: "hk2",
    name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
    price: 89.99,
    originalPrice: 119.99,
    image: "https://m.media-amazon.com/images/I/71Z401LjFFL._AC_UF894,1000_QL80_.jpg",
    rating: 4.7,
    reviewCount: 12430,
    badge: "Top Rated",
    description: "7-in-1 multi-use programmable pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer.",
    inStock: true,
    subcategory: "Kitchen Appliances",
    brand: "Instant Pot",
  },
  {
    id: "hk3",
    name: "Dyson V15 Detect Cordless Vacuum",
    price: 649.99,
    originalPrice: 749.99,
    image: "/images/dyson-v15-detect-vacuum.jpg",
    rating: 4.8,
    reviewCount: 3102,
    badge: "Premium",
    description: "Laser detects invisible dust. Automatically adapts suction power. Up to 60 minutes of fade-free power.",
    inStock: true,
    subcategory: "Cleaning",
    brand: "Dyson",
  },
  {
    id: "hk4",
    name: "Nespresso Vertuo Next Coffee Machine",
    price: 149.99,
    originalPrice: 199.99,
    image: "/images/nespresso-vertuo-next-coffee-machine.jpg",
    rating: 4.6,
    reviewCount: 4567,
    badge: "Deal",
    description: "Brew 5 cup sizes from espresso to alto. One-touch brewing with Centrifusion technology for rich, smooth coffee every time.",
    inStock: true,
    subcategory: "Kitchen Appliances",
    brand: "Nespresso",
  },
  {
    id: "hk5",
    name: "Cuisinart 12-Piece Stainless Steel Cookware Set",
    price: 229.99,
    originalPrice: 299.99,
    image: "/images/cuisinart-stainless-cookware-set.jpg",
    rating: 4.7,
    reviewCount: 2891,
    description: "Professional-grade stainless steel with aluminum encapsulated base for even heat distribution. Dishwasher safe.",
    inStock: true,
    subcategory: "Cookware",
    brand: "Cuisinart",
  },
  {
    id: "hk6",
    name: "Casper Sleep Original Foam Mattress Queen",
    price: 895.00,
    originalPrice: 1095.00,
    image: "/images/casper-foam-mattress-queen.jpg",
    rating: 4.5,
    reviewCount: 7234,
    badge: "Editor's Pick",
    description: "Ergonomic zoning with 3 layers of foam for pressure relief and support. 100-night trial, 10-year warranty.",
    inStock: true,
    subcategory: "Bedroom",
    brand: "Casper",
  },
  {
    id: "hk7",
    name: "Philips Hue White & Color Ambiance Starter Kit",
    price: 179.99,
    originalPrice: 219.99,
    image: "/images/philips-hue-smart-lights-starter-kit.jpg",
    rating: 4.6,
    reviewCount: 3456,
    description: "4 smart bulbs + bridge. 16 million colors, voice control with Alexa and Google Home, app-controlled scenes.",
    inStock: true,
    subcategory: "Smart Home",
    brand: "Philips Hue",
  },
  {
    id: "hk8",
    name: "Le Creuset Signature Enameled Cast Iron Dutch Oven 5.5 Qt",
    price: 399.95,
    originalPrice: 459.95,
    image: "/images/le-creuset-dutch-oven-blue.jpg",
    rating: 4.9,
    reviewCount: 6102,
    badge: "Premium",
    description: "Iconic French cookware with superior heat retention. Tight-fitting lid, ergonomic handles, oven safe to 500°F.",
    inStock: true,
    subcategory: "Cookware",
    brand: "Le Creuset",
    color: "Marseille Blue",
  },
  {
    id: "hk9",
    name: "Roomba j7+ Self-Emptying Robot Vacuum",
    price: 599.99,
    originalPrice: 799.99,
    image: "/images/roomba-j7-robot-vacuum.jpg",
    rating: 4.5,
    reviewCount: 2103,
    badge: "Smart Home",
    description: "Avoids pet waste and cords. Empties itself for 60 days. Smart mapping learns your home layout.",
    inStock: true,
    subcategory: "Cleaning",
    brand: "iRobot",
  },
  {
    id: "hk10",
    name: "Breville Barista Express Espresso Machine",
    price: 699.95,
    originalPrice: 799.95,
    image: "/images/breville-barista-express-espresso.jpg",
    rating: 4.8,
    reviewCount: 4890,
    badge: "Top Rated",
    description: "Integrated conical burr grinder, precise espresso extraction, steam wand for microfoam milk texturing.",
    inStock: true,
    subcategory: "Kitchen Appliances",
    brand: "Breville",
  },
  {
    id: "hk11",
    name: "West Elm Mid-Century Modern Sofa 3-Seat",
    price: 1299.00,
    originalPrice: 1599.00,
    image: "/images/west-elm-mid-century-sofa-gray.jpg",
    rating: 4.4,
    reviewCount: 1234,
    description: "Solid wood legs, kiln-dried hardwood frame, high-resiliency foam cushions. Available in 15 fabric options.",
    inStock: true,
    subcategory: "Living Room",
    brand: "West Elm",
    color: "Heathered Tweed Platinum",
  },
  {
    id: "hk12",
    name: "Vitamix 5200 Professional Blender",
    price: 449.95,
    originalPrice: 549.95,
    image: "/images/vitamix-5200-blender-black.jpg",
    rating: 4.9,
    reviewCount: 8901,
    badge: "Best Seller",
    description: "Variable speed control, aircraft-grade stainless steel blades, self-cleaning in 60 seconds. 7-year warranty.",
    inStock: true,
    subcategory: "Kitchen Appliances",
    brand: "Vitamix",
  },
];

const SUBCATEGORIES = [
  "All",
  "Kitchen Appliances",
  "Cookware",
  "Cleaning",
  "Bedroom",
  "Living Room",
  "Smart Home",
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "reviews", label: "Most Reviewed" },
];

const PRICE_RANGES = [
  { label: "Under $100", min: 0, max: 100 },
  { label: "$100 – $300", min: 100, max: 300 },
  { label: "$300 – $700", min: 300, max: 700 },
  { label: "$700+", min: 700, max: Infinity },
];

const FEATURED_COLLECTIONS = [
  {
    title: "Kitchen Essentials",
    subtitle: "Equip your kitchen like a pro",
    image: "/images/kitchen-essentials-collection.jpg",
    href: "#",
    accent: "#f97316",
  },
  {
    title: "Smart Home",
    subtitle: "Automate your living space",
    image: "/images/smart-home-devices-collection.jpg",
    href: "#",
    accent: "#6366f1",
  },
  {
    title: "Bedroom Comfort",
    subtitle: "Sleep better, live better",
    image: "/images/bedroom-comfort-collection.jpg",
    href: "#",
    accent: "#14b8a6",
  },
];

// ─── Star Rating ─────────────────────────────────────────────────────────────

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={13}
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

function ProductCard({ product, delay = 0 }: { product: HomeProduct; delay?: number }) {
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
      images: [product.image],
      category: "Home & Kitchen",
      categorySlug: "home-kitchen",
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
    <Reveal delay={delay}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="group relative bg-white rounded-2xl border border-black/5 overflow-hidden flex flex-col"
        style={{
          boxShadow:
            "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -8px rgba(0,0,0,0.10)",
        }}
      >
        {/* Image */}
        <div className="relative overflow-hidden bg-gray-50 aspect-[4/3]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.badge && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--primary)] text-[var(--foreground)]">
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
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--primary)]">
            {product.brand}
          </p>
          <Link
            href={`/product/${product.id}`}
            className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 hover:text-[var(--primary)] transition-colors duration-200"
          >
            {product.name}
          </Link>
          <StarRating rating={product.rating} count={product.reviewCount} />
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Price row */}
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

          {/* Add to cart */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              added
                ? "bg-green-500 text-white"
                : product.inStock
                ? "bg-[var(--primary)] text-[var(--foreground)] hover:opacity-90"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {added ? (
              <>
                <Check size={15} />
                Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart size={15} />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </Reveal>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomeKitchenPage() {
  const [selectedSub, setSelectedSub] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let list = [...HOME_PRODUCTS];

    if (selectedSub !== "All") {
      list = list.filter((p) => p.subcategory === selectedSub);
    }
    if (priceRange) {
      list = list.filter(
        (p) => p.price >= priceRange.min && p.price <= priceRange.max
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

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
  }, [selectedSub, sortBy, priceRange, searchQuery]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <Reveal>
        <section
          className="relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          }}
        >
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, #f97316 0%, transparent 50%), radial-gradient(circle at 80% 20%, #6366f1 0%, transparent 40%)",
            }}
          />
          <div className="relative mx-auto max-w-[1400px] px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-white/80 mb-5">
                <Sparkles size={13} className="text-amber-400" />
                New Arrivals Every Week
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight text-balance mb-4">
                Home &amp; Kitchen
              </h1>
              <p className="text-lg text-white/70 leading-relaxed max-w-lg mb-8">
                From professional-grade cookware to smart home devices. Everything you need to make your home a better place to live.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Truck size={16} className="text-[var(--primary)]" />
                  Free shipping over $50
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <RotateCcw size={16} className="text-[var(--primary)]" />
                  30-day returns
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Shield size={16} className="text-[var(--primary)]" />
                  2-year warranty
                </div>
              </div>
            </div>
            {/* Hero image grid */}
            <div className="flex-shrink-0 grid grid-cols-2 gap-3 w-full max-w-xs md:max-w-sm">
              {HOME_PRODUCTS.slice(0, 4).map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                  className="rounded-xl overflow-hidden aspect-square border border-white/10"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Featured Collections ─────────────────────────────────────────── */}
      <Reveal>
        <section className="mx-auto max-w-[1400px] px-4 py-10">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Shop by Collection</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {FEATURED_COLLECTIONS.map((col, i) => (
              <Reveal key={col.title} delay={i * 0.08}>
                <motion.a
                  href={col.href}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="relative rounded-2xl overflow-hidden aspect-[16/7] flex items-end cursor-pointer"
                >
                  <img
                    src={col.image}
                    alt={col.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, ${col.accent}cc 0%, transparent 60%)`,
                    }}
                  />
                  <div className="relative p-4">
                    <p className="text-white font-bold text-lg leading-tight">{col.title}</p>
                    <p className="text-white/80 text-sm">{col.subtitle}</p>
                  </div>
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <ArrowRight size={14} className="text-white" />
                  </div>
                </motion.a>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ── Filters + Products ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-4 pb-20">
        {/* Toolbar */}
        <Reveal>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">All Products</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 bg-white outline-none focus:border-[var(--primary)] transition-colors duration-200 w-48"
                />
              </div>
              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-9 py-2 text-sm rounded-xl border border-gray-200 bg-white outline-none focus:border-[var(--primary)] transition-colors duration-200 cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {/* Filter toggle */}
              <button
                onClick={() => setFilterOpen((o) => !o)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 bg-white hover:border-[var(--primary)] transition-colors duration-200"
              >
                <Filter size={14} />
                Filters
                {(priceRange || selectedSub !== "All") && (
                  <span className="w-4 h-4 rounded-full bg-[var(--primary)] text-[var(--foreground)] text-[10px] font-bold flex items-center justify-center">
                    {(priceRange ? 1 : 0) + (selectedSub !== "All" ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </Reveal>

        {/* Filter panel */}
        {filterOpen && (
          <Reveal>
            <div className="bg-white rounded-2xl border border-black/5 p-6 mb-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-gray-900">Filter Products</h3>
                <button
                  onClick={() => {
                    setSelectedSub("All");
                    setPriceRange(null);
                    setFilterOpen(false);
                  }}
                  className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
                >
                  <X size={12} />
                  Clear all
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Subcategory */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                    Category
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUBCATEGORIES.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => setSelectedSub(sub)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                          selectedSub === sub
                            ? "bg-[var(--primary)] text-[var(--foreground)] border-[var(--primary)]"
                            : "bg-white text-gray-600 border-gray-200 hover:border-[var(--primary)]"
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Price range */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                    Price Range
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {PRICE_RANGES.map((range) => {
                      const active =
                        priceRange?.min === range.min &&
                        priceRange?.max === range.max;
                      return (
                        <button
                          key={range.label}
                          onClick={() =>
                            setPriceRange(active ? null : { min: range.min, max: range.max })
                          }
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                            active
                              ? "bg-[var(--primary)] text-[var(--foreground)] border-[var(--primary)]"
                              : "bg-white text-gray-600 border-gray-200 hover:border-[var(--primary)]"
                          }`}
                        >
                          {range.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        {/* Subcategory pills (always visible) */}
        <Reveal>
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            {SUBCATEGORIES.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSub(sub)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                  selectedSub === sub
                    ? "bg-[var(--primary)] text-[var(--foreground)] border-[var(--primary)]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[var(--primary)]"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Product grid */}
        {filtered.length === 0 ? (
          <Reveal>
            <div className="text-center py-24">
              <p className="text-4xl mb-4">🏠</p>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 text-sm mb-6">
                Try adjusting your filters or search query.
              </p>
              <button
                onClick={() => {
                  setSelectedSub("All");
                  setPriceRange(null);
                  setSearchQuery("");
                }}
                className="px-6 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--foreground)] text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Clear Filters
              </button>
            </div>
          </Reveal>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} delay={i * 0.04} />
            ))}
          </motion.div>
        )}
      </section>

      {/* ── Trust Strip ─────────────────────────────────────────────────── */}
      <Reveal>
        <section className="bg-white border-t border-gray-100">
          <div className="mx-auto max-w-[1400px] px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Truck size={22} />, title: "Free Shipping", desc: "On orders over $50" },
              { icon: <RotateCcw size={22} />, title: "30-Day Returns", desc: "Hassle-free returns" },
              { icon: <Shield size={22} />, title: "2-Year Warranty", desc: "On all appliances" },
              { icon: <Sparkles size={22} />, title: "Expert Curation", desc: "Only the best brands" },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "var(--primary)", color: "var(--foreground)" }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>
    </main>
  );
}