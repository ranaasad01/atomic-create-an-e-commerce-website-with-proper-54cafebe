"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Star, Heart, ShoppingCart, ChevronDown, X, Check, ArrowUpDown, Filter, Grid, List, ChevronRight } from 'lucide-react';
import { useTranslations } from "next-intl";
import { APP_CURRENCY_SYMBOL, MOCK_PRODUCTS, CATEGORIES, type Product } from "@/lib/data";
import { fadeInUp, staggerContainer, scaleIn, cardHover } from "@/lib/motion";
import { Reveal } from "@/components/Reveal";

// ─── Inline mock data ────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { value: "relevance", label: "Most Relevant" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest Arrivals" },
];

const PRICE_RANGES = [
  { label: "Under $25", min: 0, max: 25 },
  { label: "$25 to $50", min: 25, max: 50 },
  { label: "$50 to $100", min: 50, max: 100 },
  { label: "$100 to $250", min: 100, max: 250 },
  { label: "$250 & Above", min: 250, max: Infinity },
];

const RATING_OPTIONS = [4, 3, 2, 1];

// Extend mock products with extra items for richer results
const ALL_PRODUCTS: Product[] = [
  ...MOCK_PRODUCTS,
  {
    id: "extra1",
    name: "Apple AirPods Pro (2nd Generation)",
    price: 189.99,
    originalPrice: 249.99,
    image: "https://m.media-amazon.com/images/I/61sRKTAfrhL._AC_UF350,350_QL80_.jpg",
    category: "Electronics",
    categorySlug: "electronics",
    rating: 4.7,
    reviewCount: 5821,
    badge: "Top Pick",
    description: "Active noise cancellation, Adaptive Transparency, and Personalized Spatial Audio.",
    inStock: true,
  },
  {
    id: "extra2",
    name: "Levi's 501 Original Fit Jeans",
    price: 59.99,
    originalPrice: 79.99,
    image: "https://static.wikia.nocookie.net/shingekinokyojin/images/b/b1/Levi_Ackermann_%28Anime%29_character_image.png/revision/latest?cb=20231105181307",
    category: "Fashion",
    categorySlug: "fashion",
    rating: 4.5,
    reviewCount: 3102,
    badge: "Classic",
    description: "The original blue jean since 1873. Straight fit, button fly, sits at waist.",
    inStock: true,
  },
  {
    id: "extra3",
    name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
    price: 79.95,
    originalPrice: 99.95,
    image: "https://m.media-amazon.com/images/I/71Z401LjFFL._AC_UF894,1000_QL80_.jpg",
    category: "Home & Kitchen",
    categorySlug: "home-kitchen",
    rating: 4.6,
    reviewCount: 12450,
    badge: "Best Seller",
    description: "Pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker, and warmer.",
    inStock: true,
  },
  {
    id: "extra4",
    name: "Atomic Habits by James Clear",
    price: 14.99,
    originalPrice: 27.00,
    image: "https://m.media-amazon.com/images/I/81kg51XRc1L._AC_UF1000,1000_QL80_.jpg",
    category: "Books",
    categorySlug: "books",
    rating: 4.9,
    reviewCount: 89234,
    badge: "Bestseller",
    description: "An easy and proven way to build good habits and break bad ones.",
    inStock: true,
  },
  {
    id: "extra5",
    name: "Nike Air Zoom Pegasus 40 Running Shoes",
    price: 129.99,
    originalPrice: 150.00,
    image: "/images/nike-air-zoom-pegasus-40-shoes.jpg",
    category: "Sports",
    categorySlug: "sports",
    rating: 4.6,
    reviewCount: 4312,
    badge: "New",
    description: "Responsive cushioning and a breathable upper for everyday training runs.",
    inStock: true,
  },
  {
    id: "extra6",
    name: "Samsung 65-Inch QLED 4K Smart TV",
    price: 897.99,
    originalPrice: 1199.99,
    image: "/images/samsung-65-inch-qled-4k-tv.jpg",
    category: "Electronics",
    categorySlug: "electronics",
    rating: 4.5,
    reviewCount: 2876,
    badge: "Deal",
    description: "Quantum Dot technology delivers brilliant color and contrast in any lighting.",
    inStock: true,
  },
  {
    id: "extra7",
    name: "Adidas Ultraboost 23 Sneakers",
    price: 149.99,
    originalPrice: 190.00,
    image: "/images/adidas-ultraboost-23-sneakers.jpg",
    category: "Fashion",
    categorySlug: "fashion",
    rating: 4.4,
    reviewCount: 2198,
    description: "Responsive BOOST midsole and a Primeknit+ upper for all-day comfort.",
    inStock: true,
  },
  {
    id: "extra8",
    name: "KitchenAid Stand Mixer 5-Quart",
    price: 349.99,
    originalPrice: 449.99,
    image: "/images/kitchenaid-stand-mixer-5-quart.jpg",
    category: "Home & Kitchen",
    categorySlug: "home-kitchen",
    rating: 4.8,
    reviewCount: 7654,
    badge: "Premium",
    description: "Tilt-head design with 10 speeds and 59 touchpoints for thorough ingredient incorporation.",
    inStock: false,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function BadgePill({ text }: { text: string }) {
  const colorMap: Record<string, string> = {
    "Best Seller": "bg-amber-100 text-amber-800",
    "Top Pick": "bg-blue-100 text-blue-800",
    "Classic": "bg-gray-100 text-gray-700",
    "Bestseller": "bg-orange-100 text-orange-800",
    "New": "bg-green-100 text-green-800",
    "Deal": "bg-red-100 text-red-800",
    "Premium": "bg-purple-100 text-purple-800",
  };
  const cls = colorMap[text] ?? "bg-gray-100 text-gray-700";
  return (
    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${cls}`}>
      {text}
    </span>
  );
}

interface ProductCardGridProps {
  product: Product;
  wishlisted: boolean;
  onWishlist: (id: string) => void;
  onAddToCart: (product: Product) => void;
  addedToCart: boolean;
}

function ProductCardGrid({ product, wishlisted, onWishlist, onAddToCart, addedToCart }: ProductCardGridProps) {
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      className="bg-white rounded-2xl border border-black/5 overflow-hidden flex flex-col group cursor-pointer"
      style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -8px rgba(0,0,0,0.10)" }}
    >
      <Link href={`/product/${product.id}`} className="relative block overflow-hidden bg-gray-50 aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/product-placeholder.jpg";
          }}
        />
        {discount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
              Out of Stock
            </span>
          </div>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            onWishlist(product.id);
          }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center transition-transform duration-200 hover:scale-110"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={15}
            className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}
          />
        </button>
      </Link>

      <div className="p-4 flex flex-col flex-1 gap-2">
        {product.badge && <BadgePill text={product.badge} />}
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 hover:text-[var(--primary)] transition-colors duration-200">
            {product.name}
          </h3>
        </Link>
        <StarRating rating={product.rating} count={product.reviewCount} />
        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span className="text-lg font-bold text-gray-900">
            {APP_CURRENCY_SYMBOL}{product.price.toFixed(2)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">
              {APP_CURRENCY_SYMBOL}{product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => onAddToCart(product)}
          disabled={!product.inStock || addedToCart}
          className={`mt-1 w-full py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
            addedToCart
              ? "bg-green-500 text-white"
              : product.inStock
              ? "bg-[var(--primary)] text-[var(--foreground)] hover:opacity-90"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {addedToCart ? (
            <>
              <Check size={15} /> Added
            </>
          ) : (
            <>
              <ShoppingCart size={15} /> Add to Cart
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

interface ProductCardListProps {
  product: Product;
  wishlisted: boolean;
  onWishlist: (id: string) => void;
  onAddToCart: (product: Product) => void;
  addedToCart: boolean;
}

function ProductCardList({ product, wishlisted, onWishlist, onAddToCart, addedToCart }: ProductCardListProps) {
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      className="bg-white rounded-2xl border border-black/5 overflow-hidden flex flex-row gap-0 group"
      style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -8px rgba(0,0,0,0.10)" }}
    >
      <Link
        href={`/product/${product.id}`}
        className="relative flex-shrink-0 w-40 sm:w-52 bg-gray-50 overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/product-placeholder.jpg";
          }}
        />
        {discount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-4 sm:p-5 gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1.5 flex-1">
            {product.badge && <BadgePill text={product.badge} />}
            <Link href={`/product/${product.id}`}>
              <h3 className="text-base font-semibold text-gray-900 leading-snug hover:text-[var(--primary)] transition-colors duration-200 line-clamp-2">
                {product.name}
              </h3>
            </Link>
            <StarRating rating={product.rating} count={product.reviewCount} />
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 hidden sm:block">
              {product.description}
            </p>
          </div>
          <button
            onClick={() => onWishlist(product.id)}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center transition-transform duration-200 hover:scale-110"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              size={15}
              className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}
            />
          </button>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 flex-wrap gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">
              {APP_CURRENCY_SYMBOL}{product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 line-through">
                {APP_CURRENCY_SYMBOL}{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!product.inStock && (
              <span className="text-xs text-red-500 font-medium">Out of Stock</span>
            )}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => onAddToCart(product)}
              disabled={!product.inStock || addedToCart}
              className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-200 ${
                addedToCart
                  ? "bg-green-500 text-white"
                  : product.inStock
                  ? "bg-[var(--primary)] text-[var(--foreground)] hover:opacity-90"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {addedToCart ? (
                <>
                  <Check size={14} /> Added
                </>
              ) : (
                <>
                  <ShoppingCart size={14} /> Add to Cart
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SearchResultsPage() {
  const t = useTranslations();

  // Search & filter state
  const [query, setQuery] = useState("wireless headphones");
  const [inputValue, setInputValue] = useState("wireless headphones");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set());
  const [inStockOnly, setInStockOnly] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(inputValue.trim() || "all products");
  };

  const handleWishlist = useCallback((id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleAddToCart = useCallback((product: Product) => {
    if (!product.inStock) return;
    setAddedToCart((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedToCart((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 2000);
  }, []);

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedPriceRange(null);
    setSelectedRating(null);
    setInStockOnly(false);
    setSortBy("relevance");
  };

  const activeFilterCount = [
    selectedCategory !== "all",
    selectedPriceRange !== null,
    selectedRating !== null,
    inStockOnly,
  ].filter(Boolean).length;

  const filteredAndSorted = useMemo(() => {
    let results = [...ALL_PRODUCTS];

    // Category filter
    if (selectedCategory !== "all") {
      results = results.filter((p) => p.categorySlug === selectedCategory);
    }

    // Price range filter
    if (selectedPriceRange !== null) {
      const range = PRICE_RANGES[selectedPriceRange];
      if (range) {
        results = results.filter(
          (p) => p.price >= range.min && p.price < (range.max === Infinity ? 999999 : range.max)
        );
      }
    }

    // Rating filter
    if (selectedRating !== null) {
      results = results.filter((p) => p.rating >= selectedRating);
    }

    // In stock filter
    if (inStockOnly) {
      results = results.filter((p) => p.inStock);
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        results.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        results.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        results.sort((a, b) => b.id.localeCompare(a.id));
        break;
      default:
        break;
    }

    return results;
  }, [selectedCategory, selectedPriceRange, selectedRating, inStockOnly, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search bar hero */}
      <Reveal>
        <div
          className="py-8 px-4"
          style={{ backgroundColor: "var(--nav)" }}
        >
          <div className="mx-auto max-w-[1400px]">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-white/50 mb-4">
              <Link href="/" className="hover:text-white transition-colors duration-200">
                Home
              </Link>
              <ChevronRight size={12} />
              <span className="text-white/80">Search Results</span>
            </nav>

            <h1 className="text-2xl font-bold text-white mb-4">
              {query
                ? `Results for "${query}"`
                : "All Products"}
            </h1>

            <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
              <div className="flex flex-1 rounded-xl overflow-hidden border-2 border-transparent focus-within:border-[var(--primary)] transition-colors duration-200">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 px-4 py-2.5 text-sm text-gray-900 bg-white outline-none"
                  aria-label="Search products"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 flex items-center gap-2 text-sm font-semibold transition-colors duration-200"
                  style={{ backgroundColor: "var(--primary)", color: "var(--foreground)" }}
                >
                  <Search size={16} />
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </Reveal>

      <div className="mx-auto max-w-[1400px] px-4 py-6">
        {/* Toolbar */}
        <Reveal>
          <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">{filteredAndSorted.length}</span> results
              </span>

              {/* Active filter chips */}
              {activeFilterCount > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedCategory !== "all" && (
                    <span className="inline-flex items-center gap-1 bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-medium px-3 py-1 rounded-full border border-[var(--primary)]/20">
                      {CATEGORIES.find((c) => c.slug === selectedCategory)?.name ?? selectedCategory}
                      <button onClick={() => setSelectedCategory("all")} aria-label="Remove category filter">
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {selectedPriceRange !== null && (
                    <span className="inline-flex items-center gap-1 bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-medium px-3 py-1 rounded-full border border-[var(--primary)]/20">
                      {PRICE_RANGES[selectedPriceRange]?.label ?? ""}
                      <button onClick={() => setSelectedPriceRange(null)} aria-label="Remove price filter">
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {selectedRating !== null && (
                    <span className="inline-flex items-center gap-1 bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-medium px-3 py-1 rounded-full border border-[var(--primary)]/20">
                      {selectedRating}+ Stars
                      <button onClick={() => setSelectedRating(null)} aria-label="Remove rating filter">
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {inStockOnly && (
                    <span className="inline-flex items-center gap-1 bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-medium px-3 py-1 rounded-full border border-[var(--primary)]/20">
                      In Stock Only
                      <button onClick={() => setInStockOnly(false)} aria-label="Remove in-stock filter">
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={clearFilters}
                    className="text-xs text-gray-500 hover:text-gray-800 underline transition-colors duration-200"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors duration-200"
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
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700">
                  <ArrowUpDown size={14} className="text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent outline-none cursor-pointer text-sm font-medium"
                    aria-label="Sort products"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* View mode */}
              <div className="flex items-center rounded-xl border border-gray-200 bg-white overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors duration-200 ${
                    viewMode === "grid"
                      ? "bg-[var(--primary)] text-[var(--foreground)]"
                      : "text-gray-400 hover:text-gray-700"
                  }`}
                  aria-label="Grid view"
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors duration-200 ${
                    viewMode === "list"
                      ? "bg-[var(--primary)] text-[var(--foreground)]"
                      : "text-gray-400 hover:text-gray-700"
                  }`}
                  aria-label="List view"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="flex gap-6">
          {/* ── Sidebar Filters (desktop) ── */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <Reveal>
              <div
                className="bg-white rounded-2xl border border-black/5 p-5 sticky top-20"
                style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -8px rgba(0,0,0,0.10)" }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <SlidersHorizontal size={15} />
                    Filters
                  </h2>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-[var(--primary)] font-medium hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Category */}
                <FilterSection title="Category">
                  <ul className="flex flex-col gap-1">
                    <li>
                      <button
                        onClick={() => setSelectedCategory("all")}
                        className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors duration-200 flex items-center justify-between ${
                          selectedCategory === "all"
                            ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        All Categories
                        {selectedCategory === "all" && <Check size={13} />}
                      </button>
                    </li>
                    {CATEGORIES.map((cat) => (
                      <li key={cat.slug}>
                        <button
                          onClick={() => setSelectedCategory(cat.slug)}
                          className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors duration-200 flex items-center justify-between ${
                            selectedCategory === cat.slug
                              ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{cat.icon}</span>
                            {cat.name}
                          </span>
                          {selectedCategory === cat.slug && <Check size={13} />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </FilterSection>

                {/* Price Range */}
                <FilterSection title="Price Range">
                  <ul className="flex flex-col gap-1">
                    {PRICE_RANGES.map((range, i) => (
                      <li key={i}>
                        <button
                          onClick={() => setSelectedPriceRange(selectedPriceRange === i ? null : i)}
                          className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors duration-200 flex items-center justify-between ${
                            selectedPriceRange === i
                              ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {range.label}
                          {selectedPriceRange === i && <Check size={13} />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </FilterSection>

                {/* Rating */}
                <FilterSection title="Customer Rating">
                  <ul className="flex flex-col gap-1">
                    {RATING_OPTIONS.map((r) => (
                      <li key={r}>
                        <button
                          onClick={() => setSelectedRating(selectedRating === r ? null : r)}
                          className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors duration-200 flex items-center justify-between ${
                            selectedRating === r
                              ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <span className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                size={12}
                                className={s <= r ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
                              />
                            ))}
                            <span className="ml-1 text-xs">& Up</span>
                          </span>
                          {selectedRating === r && <Check size={13} />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </FilterSection>

                {/* In Stock */}
                <FilterSection title="Availability" noBorder>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
                        inStockOnly
                          ? "bg-[var(--primary)] border-[var(--primary)]"
                          : "border-gray-300 group-hover:border-gray-400"
                      }`}
                      onClick={() => setInStockOnly((v) => !v)}
                    >
                      {inStockOnly && <Check size={10} className="text-[var(--foreground)]" />}
                    </div>
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="sr-only"
                    />
                    <span className="text-sm text-gray-600">In Stock Only</span>
                  </label>
                </FilterSection>
              </div>
            </Reveal>
          </aside>

          {/* ── Mobile Sidebar Drawer ── */}
          <AnimatePresence>
            {sidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                />
                <motion.aside
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 28, stiffness: 280 }}
                  className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 overflow-y-auto p-5 lg:hidden"
                >
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <SlidersHorizontal size={16} />
                      Filters
                    </h2>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
                      aria-label="Close filters"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <FilterSection title="Category">
                    <ul className="flex flex-col gap-1">
                      <li>
                        <button
                          onClick={() => setSelectedCategory("all")}
                          className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors duration-200 flex items-center justify-between ${
                            selectedCategory === "all"
                              ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          All Categories
                          {selectedCategory === "all" && <Check size={13} />}
                        </button>
                      </li>
                      {CATEGORIES.map((cat) => (
                        <li key={cat.slug}>
                          <button
                            onClick={() => setSelectedCategory(cat.slug)}
                            className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors duration-200 flex items-center justify-between ${
                              selectedCategory === cat.slug
                                ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span>{cat.icon}</span>
                              {cat.name}
                            </span>
                            {selectedCategory === cat.slug && <Check size={13} />}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </FilterSection>

                  <FilterSection title="Price Range">
                    <ul className="flex flex-col gap-1">
                      {PRICE_RANGES.map((range, i) => (
                        <li key={i}>
                          <button
                            onClick={() => setSelectedPriceRange(selectedPriceRange === i ? null : i)}
                            className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors duration-200 flex items-center justify-between ${
                              selectedPriceRange === i
                                ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {range.label}
                            {selectedPriceRange === i && <Check size={13} />}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </FilterSection>

                  <FilterSection title="Customer Rating">
                    <ul className="flex flex-col gap-1">
                      {RATING_OPTIONS.map((r) => (
                        <li key={r}>
                          <button
                            onClick={() => setSelectedRating(selectedRating === r ? null : r)}
                            className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors duration-200 flex items-center justify-between ${
                              selectedRating === r
                                ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            <span className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  size={12}
                                  className={s <= r ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
                                />
                              ))}
                              <span className="ml-1 text-xs">& Up</span>
                            </span>
                            {selectedRating === r && <Check size={13} />}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </FilterSection>

                  <FilterSection title="Availability" noBorder>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
                          inStockOnly
                            ? "bg-[var(--primary)] border-[var(--primary)]"
                            : "border-gray-300 group-hover:border-gray-400"
                        }`}
                        onClick={() => setInStockOnly((v) => !v)}
                      >
                        {inStockOnly && <Check size={10} className="text-[var(--foreground)]" />}
                      </div>
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="sr-only"
                      />
                      <span className="text-sm text-gray-600">In Stock Only</span>
                    </label>
                  </FilterSection>

                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="mt-6 w-full py-2.5 rounded-xl font-semibold text-sm transition-colors duration-200"
                    style={{ backgroundColor: "var(--primary)", color: "var(--foreground)" }}
                  >
                    Show {filteredAndSorted.length} Results
                  </button>
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* ── Results Grid / List ── */}
          <div className="flex-1 min-w-0">
            {filteredAndSorted.length === 0 ? (
              <Reveal>
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <Search size={48} className="text-gray-300 mb-4" />
                  <h2 className="text-xl font-bold text-gray-800 mb-2">No results found</h2>
                  <p className="text-gray-500 text-sm mb-6 max-w-sm">
                    Try adjusting your filters or searching for something different.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors duration-200"
                    style={{ backgroundColor: "var(--primary)", color: "var(--foreground)" }}
                  >
                    Clear All Filters
                  </button>
                </div>
              </Reveal>
            ) : viewMode === "grid" ? (
              <motion.div
                key="grid"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {filteredAndSorted.map((product, i) => (
                  <motion.div key={product.id} variants={scaleIn}>
                    <ProductCardGrid
                      product={product}
                      wishlisted={wishlist.has(product.id)}
                      onWishlist={handleWishlist}
                      onAddToCart={handleAddToCart}
                      addedToCart={addedToCart.has(product.id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-4"
              >
                {filteredAndSorted.map((product) => (
                  <motion.div key={product.id} variants={fadeInUp}>
                    <ProductCardList
                      product={product}
                      wishlisted={wishlist.has(product.id)}
                      onWishlist={handleWishlist}
                      onAddToCart={handleAddToCart}
                      addedToCart={addedToCart.has(product.id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {filteredAndSorted.length > 0 && (
              <Reveal>
                <div className="flex items-center justify-center gap-2 mt-10">
                  {[1, 2, 3, 4, 5].map((page) => (
                    <button
                      key={page}
                      className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        page === 1
                          ? "text-[var(--foreground)]"
                          : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                      style={page === 1 ? { backgroundColor: "var(--primary)" } : {}}
                    >
                      {page}
                    </button>
                  ))}
                  <button className="w-9 h-9 rounded-xl text-sm font-semibold bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200">
                    <ChevronRight size={16} className="mx-auto" />
                  </button>
                </div>
              </Reveal>
            )}
          </div>
        </div>

        {/* Related searches */}
        <Reveal>
          <div className="mt-12 bg-white rounded-2xl border border-black/5 p-6"
            style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -8px rgba(0,0,0,0.10)" }}>
            <h2 className="text-sm font-bold text-gray-900 mb-4">Related Searches</h2>
            <div className="flex flex-wrap gap-2">
              {[
                "Bluetooth headphones",
                "Noise cancelling earbuds",
                "Over-ear headphones",
                "Gaming headset",
                "Wireless earphones",
                "Sony headphones",
                "Bose QuietComfort",
                "Apple AirPods",
                "Budget headphones under $50",
                "Studio monitor headphones",
              ].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setInputValue(term);
                    setQuery(term);
                  }}
                  className="px-3 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors duration-200 bg-gray-50 hover:bg-[var(--primary)]/5"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

// ─── FilterSection helper ─────────────────────────────────────────────────────

function FilterSection({
  title,
  children,
  noBorder = false,
}: {
  title: string;
  children: React.ReactNode;
  noBorder?: boolean;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className={`py-4 ${noBorder ? "" : "border-b border-gray-100"}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full text-left mb-3 group"
      >
        <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">{title}</span>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}