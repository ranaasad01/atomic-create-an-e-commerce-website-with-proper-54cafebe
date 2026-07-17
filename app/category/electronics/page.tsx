"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingCart, Heart, Filter, ChevronDown, X, Check, Search, SlidersHorizontal, Zap, Shield, Truck } from 'lucide-react';
import { useTranslations } from "next-intl";
import { APP_CURRENCY_SYMBOL, MOCK_PRODUCTS } from "@/lib/data";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";
import { Reveal } from "@/components/Reveal";
import { useCart } from "@/lib/cart-context";

// ─── Inline types ────────────────────────────────────────────────────────────
interface ElectronicsProduct {
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
  brand: string;
  subcategory: string;
  specs: Record<string, string>;
}

// ─── Inline mock data ─────────────────────────────────────────────────────────
const ELECTRONICS_PRODUCTS: ElectronicsProduct[] = [
  {
    id: "e1",
    name: "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones",
    price: 279.99,
    originalPrice: 349.99,
    image: "https://graphics.secondipity.com/B2C/5409336_1.jpg",
    rating: 4.8,
    reviewCount: 2341,
    badge: "Best Seller",
    description: "Industry-leading noise cancellation with 30-hour battery life and multipoint connection.",
    inStock: true,
    brand: "Sony",
    subcategory: "Audio",
    specs: { Battery: "30 hrs", Connectivity: "Bluetooth 5.2", Weight: "250g" },
  },
  {
    id: "e2",
    name: "Apple MacBook Air 15-inch M3 Chip",
    price: 1299.99,
    originalPrice: 1399.99,
    image: "/images/apple-macbook-air-m3.jpg",
    rating: 4.9,
    reviewCount: 1876,
    badge: "New",
    description: "Supercharged by M3 chip with 18-hour battery life and a stunning Liquid Retina display.",
    inStock: true,
    brand: "Apple",
    subcategory: "Laptops",
    specs: { Chip: "Apple M3", RAM: "8GB", Storage: "256GB SSD", Display: "15.3-inch" },
  },
  {
    id: "e3",
    name: "Samsung 65-inch QLED 4K Smart TV",
    price: 897.99,
    originalPrice: 1199.99,
    image: "https://bjs.scene7.com/is/image/bjs/345905?$bjs-Zoom$",
    rating: 4.6,
    reviewCount: 3102,
    badge: "Deal",
    description: "Quantum Dot technology delivers brilliant color and contrast with Tizen smart platform.",
    inStock: true,
    brand: "Samsung",
    subcategory: "TVs",
    specs: { Resolution: "4K UHD", HDR: "Quantum HDR", "Smart OS": "Tizen", Ports: "4x HDMI" },
  },
  {
    id: "e4",
    name: "iPad Pro 12.9-inch M4 with Apple Pencil",
    price: 1099.99,
    originalPrice: 1199.99,
    image: "/images/apple-ipad-pro-m4.jpg",
    rating: 4.8,
    reviewCount: 987,
    badge: "New",
    description: "The ultimate iPad experience with the M4 chip, Ultra Retina XDR display, and Apple Pencil Pro.",
    inStock: true,
    brand: "Apple",
    subcategory: "Tablets",
    specs: { Chip: "Apple M4", Display: "12.9-inch", Storage: "256GB", Connectivity: "Wi-Fi 6E" },
  },
  {
    id: "e5",
    name: "Logitech MX Master 3S Wireless Mouse",
    price: 99.99,
    originalPrice: 119.99,
    image: "https://resource.logitech.com/c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-3s/2025-update/mx-master-3s-bluetooth-edition-top-view-black-new-1.png",
    rating: 4.7,
    reviewCount: 5421,
    badge: "Top Rated",
    description: "Ergonomic wireless mouse with MagSpeed scroll wheel, 8K DPI sensor, and 70-day battery.",
    inStock: true,
    brand: "Logitech",
    subcategory: "Accessories",
    specs: { DPI: "200–8000", Battery: "70 days", Connectivity: "Bluetooth / USB", Buttons: "7" },
  },
  {
    id: "e6",
    name: "Canon EOS R50 Mirrorless Camera Kit",
    price: 679.99,
    originalPrice: 799.99,
    image: "/images/canon-eos-r50-mirrorless-camera.jpg",
    rating: 4.5,
    reviewCount: 643,
    badge: "Deal",
    description: "24.2MP APS-C sensor, 4K video, and Dual Pixel CMOS AF II for stunning photos and video.",
    inStock: true,
    brand: "Canon",
    subcategory: "Cameras",
    specs: { Sensor: "24.2MP APS-C", Video: "4K 30fps", AF: "Dual Pixel CMOS AF II", Weight: "375g" },
  },
  {
    id: "e7",
    name: "Anker 737 Power Bank 24,000mAh",
    price: 89.99,
    originalPrice: 109.99,
    image: "/images/anker-737-power-bank-24000mah.jpg",
    rating: 4.6,
    reviewCount: 2198,
    description: "140W max output, smart digital display, and enough power to charge a MacBook twice.",
    inStock: true,
    brand: "Anker",
    subcategory: "Accessories",
    specs: { Capacity: "24,000mAh", "Max Output": "140W", Ports: "2x USB-C, 1x USB-A", Display: "Smart LED" },
  },
  {
    id: "e8",
    name: "Samsung Galaxy S24 Ultra 512GB",
    price: 1199.99,
    originalPrice: 1299.99,
    image: "/images/samsung-galaxy-s24-ultra.jpg",
    rating: 4.7,
    reviewCount: 4312,
    badge: "Best Seller",
    description: "200MP camera, built-in S Pen, Snapdragon 8 Gen 3, and a 5000mAh battery.",
    inStock: true,
    brand: "Samsung",
    subcategory: "Phones",
    specs: { Camera: "200MP", Processor: "Snapdragon 8 Gen 3", Battery: "5000mAh", Storage: "512GB" },
  },
  {
    id: "e9",
    name: "Bose QuietComfort Ultra Earbuds",
    price: 249.99,
    originalPrice: 299.99,
    image: "/images/bose-quietcomfort-ultra-earbuds.jpg",
    rating: 4.6,
    reviewCount: 1543,
    badge: "Top Rated",
    description: "World-class noise cancellation in a compact earbud with immersive spatial audio.",
    inStock: true,
    brand: "Bose",
    subcategory: "Audio",
    specs: { "ANC": "CustomTune", Battery: "6 hrs + 18 hrs case", Fit: "StayHear Max", Audio: "Spatial" },
  },
  {
    id: "e10",
    name: "LG 27-inch UltraGear 4K Gaming Monitor",
    price: 449.99,
    originalPrice: 599.99,
    image: "/images/lg-27-ultragear-4k-gaming-monitor.jpg",
    rating: 4.7,
    reviewCount: 876,
    badge: "Deal",
    description: "1ms response time, 144Hz refresh rate, VESA DisplayHDR 600, and NVIDIA G-Sync compatible.",
    inStock: true,
    brand: "LG",
    subcategory: "Monitors",
    specs: { Resolution: "4K UHD", "Refresh Rate": "144Hz", "Response Time": "1ms", HDR: "DisplayHDR 600" },
  },
  {
    id: "e11",
    name: "Kindle Paperwhite Signature Edition",
    price: 139.99,
    originalPrice: 159.99,
    image: "/images/kindle-paperwhite-signature-edition.jpg",
    rating: 4.8,
    reviewCount: 6721,
    description: "32GB storage, auto-adjusting front light, wireless charging, and 10-week battery life.",
    inStock: true,
    brand: "Amazon",
    subcategory: "E-Readers",
    specs: { Storage: "32GB", Display: "6.8-inch 300ppi", Battery: "10 weeks", Charging: "Wireless" },
  },
  {
    id: "e12",
    name: "DJI Mini 4 Pro Drone Combo",
    price: 759.99,
    originalPrice: 899.99,
    image: "/images/dji-mini-4-pro-drone.jpg",
    rating: 4.8,
    reviewCount: 432,
    badge: "New",
    description: "4K/60fps omnidirectional obstacle sensing, 34-min flight time, and under 249g.",
    inStock: false,
    brand: "DJI",
    subcategory: "Drones",
    specs: { Video: "4K/60fps", "Flight Time": "34 min", Weight: "249g", "Obstacle Sensing": "Omnidirectional" },
  },
];

const SUBCATEGORIES = ["All", "Audio", "Laptops", "TVs", "Tablets", "Phones", "Cameras", "Monitors", "Accessories", "E-Readers", "Drones"];
const BRANDS = ["All Brands", "Sony", "Apple", "Samsung", "Logitech", "Canon", "Anker", "Bose", "LG", "Amazon", "DJI"];
const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "reviews", label: "Most Reviewed" },
];

const PRICE_RANGES = [
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50 – $200", min: 50, max: 200 },
  { label: "$200 – $500", min: 200, max: 500 },
  { label: "$500 – $1,000", min: 500, max: 1000 },
  { label: "Over $1,000", min: 1000, max: Infinity },
];

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={12}
            className={star <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500">({count.toLocaleString()})</span>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, index }: { product: ElectronicsProduct; index: number }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: "Electronics",
      categorySlug: "electronics",
      rating: product.rating,
      reviewCount: product.reviewCount,
      badge: product.badge,
      description: product.description,
      inStock: product.inStock,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)" }}
    >
      {/* Wishlist */}
      <button
        onClick={() => setWishlisted((w) => !w)}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm border border-gray-100 transition-all duration-200 hover:scale-110"
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          size={15}
          className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}
        />
      </button>

      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.badge && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--primary)] text-[var(--foreground)] uppercase tracking-wide">
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white uppercase tracking-wide">
            -{discount}%
          </span>
        )}
        {!product.inStock && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-400 text-white uppercase tracking-wide">
            Out of Stock
          </span>
        )}
      </div>

      {/* Image */}
      <Link href={`/product/${product.id}`} className="block overflow-hidden bg-gray-50 aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/electronics-placeholder.jpg";
          }}
        />
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <p className="text-[11px] font-semibold text-[var(--primary)] uppercase tracking-wider">{product.brand}</p>
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 hover:text-[var(--primary)] transition-colors duration-200">
            {product.name}
          </h3>
        </Link>
        <StarRating rating={product.rating} count={product.reviewCount} />
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{product.description}</p>

        <div className="mt-auto pt-2 flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-gray-900">
                {APP_CURRENCY_SYMBOL}{product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  {APP_CURRENCY_SYMBOL}{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-green-600 font-medium">Free shipping</p>
          </div>

          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              addedToCart
                ? "bg-green-500 text-white"
                : product.inStock
                ? "bg-[var(--primary)] text-[var(--foreground)] hover:opacity-90"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {addedToCart ? (
              <>
                <Check size={13} />
                Added
              </>
            ) : (
              <>
                <ShoppingCart size={13} />
                Add
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ElectronicsPage() {
  const t = useTranslations();

  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...ELECTRONICS_PRODUCTS];

    if (selectedSubcategory !== "All") {
      result = result.filter((p) => p.subcategory === selectedSubcategory);
    }
    if (selectedBrand !== "All Brands") {
      result = result.filter((p) => p.brand === selectedBrand);
    }
    if (selectedPriceRange !== null) {
      const range = PRICE_RANGES[selectedPriceRange];
      if (range) {
        result = result.filter((p) => p.price >= range.min && p.price < range.max);
      }
    }
    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        break;
    }

    return result;
  }, [selectedSubcategory, selectedBrand, selectedPriceRange, sortBy, searchQuery, inStockOnly]);

  const activeFilterCount = [
    selectedSubcategory !== "All",
    selectedBrand !== "All Brands",
    selectedPriceRange !== null,
    inStockOnly,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedSubcategory("All");
    setSelectedBrand("All Brands");
    setSelectedPriceRange(null);
    setInStockOnly(false);
    setSearchQuery("");
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ── Hero Banner ─────────────────────────────────────────────────────── */}
      <Reveal>
        <section
          className="relative overflow-hidden py-14 md:py-20"
          style={{
            background: "linear-gradient(135deg, var(--nav) 0%, #1a2a4a 60%, #0f1f3d 100%)",
          }}
        >
          {/* Decorative glow */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 60% 60% at 70% 50%, var(--primary) 0%, transparent 70%)",
            }}
          />
          <div className="relative mx-auto max-w-[1400px] px-4 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: "var(--primary)" }}
              >
                MarketHub Electronics
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-5xl font-extrabold text-white tracking-tight text-balance mb-4"
              >
                Top Tech, Unbeatable Prices
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base text-white/70 leading-relaxed max-w-lg mb-6"
              >
                Shop the latest laptops, phones, audio gear, cameras, and more. All with free shipping and easy returns.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-3 justify-center md:justify-start"
              >
                {[
                  { icon: <Zap size={14} />, label: "Same-day dispatch" },
                  { icon: <Shield size={14} />, label: "2-year warranty" },
                  { icon: <Truck size={14} />, label: "Free returns" },
                ].map((badge) => (
                  <span
                    key={badge.label}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 text-white border border-white/20"
                  >
                    <span style={{ color: "var(--primary)" }}>{badge.icon}</span>
                    {badge.label}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-3 flex-shrink-0"
            >
              {[
                { value: "12K+", label: "Products" },
                { value: "4.8★", label: "Avg Rating" },
                { value: "50K+", label: "Reviews" },
                { value: "Free", label: "Shipping" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-5 py-4 text-center"
                >
                  <p className="text-2xl font-extrabold text-white">{stat.value}</p>
                  <p className="text-xs text-white/60 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      </Reveal>

      {/* ── Subcategory Pills ────────────────────────────────────────────────── */}
      <Reveal>
        <div className="bg-white border-b border-gray-100 sticky top-14 z-30">
          <div className="mx-auto max-w-[1400px] px-4 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {SUBCATEGORIES.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(sub)}
                className={`flex-shrink-0 text-xs font-semibold px-4 py-1.5 rounded-full border transition-all duration-200 ${
                  selectedSubcategory === sub
                    ? "bg-[var(--primary)] text-[var(--foreground)] border-[var(--primary)]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[var(--primary)] hover:text-[var(--primary)]"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1400px] px-4 py-8">
        <div className="flex gap-8">
          {/* ── Sidebar Filters (desktop) ──────────────────────────────────── */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <Reveal>
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-32" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <SlidersHorizontal size={15} />
                    Filters
                  </h2>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-[var(--primary)] font-semibold hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Brand */}
                <div className="mb-5">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Brand</h3>
                  <div className="flex flex-col gap-1.5">
                    {BRANDS.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => setSelectedBrand(brand)}
                        className={`text-left text-sm px-2 py-1 rounded-lg transition-all duration-150 ${
                          selectedBrand === brand
                            ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-5">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Price Range</h3>
                  <div className="flex flex-col gap-1.5">
                    {PRICE_RANGES.map((range, i) => (
                      <button
                        key={range.label}
                        onClick={() => setSelectedPriceRange(selectedPriceRange === i ? null : i)}
                        className={`text-left text-sm px-2 py-1 rounded-lg transition-all duration-150 flex items-center justify-between ${
                          selectedPriceRange === i
                            ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {range.label}
                        {selectedPriceRange === i && <Check size={13} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* In Stock */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Availability</h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => setInStockOnly((v) => !v)}
                      className={`w-9 h-5 rounded-full transition-colors duration-200 relative flex-shrink-0 ${
                        inStockOnly ? "bg-[var(--primary)]" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                          inStockOnly ? "translate-x-4" : "translate-x-0.5"
                        }`}
                      />
                    </div>
                    <span className="text-sm text-gray-700">In stock only</span>
                  </label>
                </div>
              </div>
            </Reveal>
          </aside>

          {/* ── Product Grid ───────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <Reveal>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {/* Search */}
                <div className="flex-1 min-w-[200px] relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search electronics..."
                    className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-[var(--primary)] transition-colors duration-200"
                  />
                </div>

                {/* Mobile filter toggle */}
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-[var(--primary)] transition-colors duration-200"
                >
                  <Filter size={15} />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[var(--primary)] text-[var(--foreground)] text-[10px] font-bold flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 outline-none focus:border-[var(--primary)] transition-colors duration-200 cursor-pointer"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                <p className="text-sm text-gray-500 ml-auto">
                  <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
                </p>
              </div>
            </Reveal>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <Reveal>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedSubcategory !== "All" && (
                    <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                      {selectedSubcategory}
                      <button onClick={() => setSelectedSubcategory("All")} className="ml-1 hover:opacity-70">
                        <X size={11} />
                      </button>
                    </span>
                  )}
                  {selectedBrand !== "All Brands" && (
                    <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                      {selectedBrand}
                      <button onClick={() => setSelectedBrand("All Brands")} className="ml-1 hover:opacity-70">
                        <X size={11} />
                      </button>
                    </span>
                  )}
                  {selectedPriceRange !== null && PRICE_RANGES[selectedPriceRange] && (
                    <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                      {PRICE_RANGES[selectedPriceRange]?.label}
                      <button onClick={() => setSelectedPriceRange(null)} className="ml-1 hover:opacity-70">
                        <X size={11} />
                      </button>
                    </span>
                  )}
                  {inStockOnly && (
                    <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                      In Stock
                      <button onClick={() => setInStockOnly(false)} className="ml-1 hover:opacity-70">
                        <X size={11} />
                      </button>
                    </span>
                  )}
                </div>
              </Reveal>
            )}

            {/* Grid */}
            {filteredProducts.length > 0 ? (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
              >
                {filteredProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </motion.div>
            ) : (
              <Reveal>
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Search size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No products found</h3>
                  <p className="text-sm text-gray-500 mb-4">Try adjusting your filters or search query.</p>
                  <button
                    onClick={clearFilters}
                    className="px-5 py-2 rounded-xl bg-[var(--primary)] text-[var(--foreground)] text-sm font-semibold hover:opacity-90 transition-opacity duration-200"
                  >
                    Clear all filters
                  </button>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setShowFilters(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 overflow-y-auto p-5 lg:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-bold text-gray-900">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Brand */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Brand</h3>
                <div className="flex flex-col gap-1.5">
                  {BRANDS.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`text-left text-sm px-3 py-2 rounded-xl transition-all duration-150 ${
                        selectedBrand === brand
                          ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Price Range</h3>
                <div className="flex flex-col gap-1.5">
                  {PRICE_RANGES.map((range, i) => (
                    <button
                      key={range.label}
                      onClick={() => setSelectedPriceRange(selectedPriceRange === i ? null : i)}
                      className={`text-left text-sm px-3 py-2 rounded-xl transition-all duration-150 flex items-center justify-between ${
                        selectedPriceRange === i
                          ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {range.label}
                      {selectedPriceRange === i && <Check size={13} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* In Stock */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Availability</h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setInStockOnly((v) => !v)}
                    className={`w-10 h-6 rounded-full transition-colors duration-200 relative flex-shrink-0 ${
                      inStockOnly ? "bg-[var(--primary)]" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                        inStockOnly ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </div>
                  <span className="text-sm text-gray-700">In stock only</span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Clear all
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--foreground)] text-sm font-semibold hover:opacity-90 transition-opacity duration-200"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}