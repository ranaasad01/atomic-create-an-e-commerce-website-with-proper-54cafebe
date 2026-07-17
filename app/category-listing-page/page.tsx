"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Star, Heart, ShoppingCart, ChevronDown, ChevronRight, X, Check, Grid, List, ArrowUpDown } from 'lucide-react';
import { useTranslations } from "next-intl";
import { MOCK_PRODUCTS, CATEGORIES, APP_CURRENCY_SYMBOL, type Product } from "@/lib/data";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";
import { Reveal } from "@/components/Reveal";

// ─── Inline mock data ────────────────────────────────────────────────────────

const PRICE_RANGES = [
  { label: "Under $25", min: 0, max: 25 },
  { label: "$25 – $50", min: 25, max: 50 },
  { label: "$50 – $100", min: 50, max: 100 },
  { label: "$100 – $250", min: 100, max: 250 },
  { label: "$250 & Above", min: 250, max: Infinity },
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Avg. Customer Review" },
  { value: "newest", label: "Newest Arrivals" },
];

const RATING_OPTIONS = [4, 3, 2, 1];

// ─── Sub-components ──────────────────────────────────────────────────────────

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={12}
          className={
            s <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">({count.toLocaleString("en-US")})</span>
    </div>
  );
}

function ProductCard({
  product,
  view,
  wishlist,
  onToggleWishlist,
  onAddToCart,
}: {
  product: Product;
  view: "grid" | "list";
  wishlist: Set<string>;
  onToggleWishlist: (id: string) => void;
  onAddToCart: (product: Product) => void;
}) {
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  if (view === "list") {
    return (
      <motion.div
        variants={scaleIn}
        whileHover={{ y: -2 }}
        className="flex gap-4 bg-white rounded-2xl border border-black/5 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.10),0_12px_32px_-8px_rgba(0,0,0,0.10)] transition-shadow duration-300"
      >
        <Link href={`/product/${product.id}`} className="flex-shrink-0 relative w-36 h-36 rounded-xl overflow-hidden bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://placehold.co/144x144/f3f4f6/9ca3af?text=Product";
            }}
          />
          {product.badge && (
            <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--primary)] text-[var(--foreground)]">
              {product.badge}
            </span>
          )}
        </Link>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <Link href={`/product/${product.id}`}>
              <h3 className="font-semibold text-gray-900 text-sm leading-snug hover:text-[var(--primary)] transition-colors duration-200 line-clamp-2">
                {product.name}
              </h3>
            </Link>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
            <div className="mt-2">
              <StarRating rating={product.rating} count={product.reviewCount} />
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">
                {APP_CURRENCY_SYMBOL}{product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {APP_CURRENCY_SYMBOL}{product.originalPrice.toFixed(2)}
                </span>
              )}
              {discount && (
                <span className="text-xs font-semibold text-green-600">-{discount}%</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleWishlist(product.id)}
                className="p-2 rounded-full border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-colors duration-200"
                aria-label="Toggle wishlist"
              >
                <Heart
                  size={14}
                  className={wishlist.has(product.id) ? "fill-red-500 text-red-500" : "text-gray-400"}
                />
              </button>
              <button
                onClick={() => onAddToCart(product)}
                disabled={!product.inStock}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "var(--primary)", color: "var(--foreground)" }}
              >
                <ShoppingCart size={13} />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -4 }}
      className="group bg-white rounded-2xl border border-black/5 overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.10),0_12px_32px_-8px_rgba(0,0,0,0.12)] transition-shadow duration-300 flex flex-col"
    >
      <Link href={`/product/${product.id}`} className="relative overflow-hidden bg-gray-50 aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://placehold.co/300x300/f3f4f6/9ca3af?text=Product";
          }}
        />
        {product.badge && (
          <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded-full bg-[var(--primary)] text-[var(--foreground)]">
            {product.badge}
          </span>
        )}
        {discount && (
          <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full bg-green-500 text-white">
            -{discount}%
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleWishlist(product.id);
          }}
          className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm border border-black/5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
          aria-label="Toggle wishlist"
        >
          <Heart
            size={14}
            className={wishlist.has(product.id) ? "fill-red-500 text-red-500" : "text-gray-400"}
          />
        </button>
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--primary)] mb-1">
          {product.category}
        </span>
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm font-semibold text-gray-900 leading-snug hover:text-[var(--primary)] transition-colors duration-200 line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>
        <StarRating rating={product.rating} count={product.reviewCount} />
        <div className="mt-auto pt-3 flex items-center justify-between">
          <div>
            <div className="text-base font-bold text-gray-900">
              {APP_CURRENCY_SYMBOL}{product.price.toFixed(2)}
            </div>
            {product.originalPrice && (
              <div className="text-xs text-gray-400 line-through">
                {APP_CURRENCY_SYMBOL}{product.originalPrice.toFixed(2)}
              </div>
            )}
          </div>
          <button
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
            className="p-2 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            style={{ backgroundColor: "var(--primary)", color: "var(--foreground)" }}
            aria-label="Add to cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full text-sm font-semibold text-gray-800 mb-3 hover:text-[var(--primary)] transition-colors duration-200"
      >
        {title}
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CategoryListingPage() {
  const t = useTranslations();

  // Filter & sort state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set());
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddToCart = (product: Product) => {
    setAddedToCart((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedToCart((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1500);
  };

  const filteredProducts = useMemo(() => {
    let products = [...MOCK_PRODUCTS];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "all") {
      products = products.filter((p) => p.categorySlug === selectedCategory);
    }

    if (selectedPriceRange !== null) {
      const range = PRICE_RANGES[selectedPriceRange];
      if (range) {
        products = products.filter(
          (p) => p.price >= range.min && p.price < (range.max === Infinity ? 999999 : range.max)
        );
      }
    }

    if (selectedRating !== null) {
      products = products.filter((p) => p.rating >= selectedRating);
    }

    if (inStockOnly) {
      products = products.filter((p) => p.inStock);
    }

    switch (sortBy) {
      case "price-asc":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        products.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        products.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        products.sort((a, b) => a.id.localeCompare(b.id));
        break;
      default:
        break;
    }

    return products;
  }, [searchQuery, selectedCategory, selectedPriceRange, selectedRating, inStockOnly, sortBy]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedPriceRange(null);
    setSelectedRating(null);
    setInStockOnly(false);
    setSortBy("featured");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "all" ||
    selectedPriceRange !== null ||
    selectedRating !== null ||
    inStockOnly;

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Featured";

  const FiltersPanel = () => (
    <div className="space-y-0">
      {/* Search within results */}
      <FilterSection title="Search Products">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--primary)] transition-colors duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </FilterSection>

      {/* Category */}
      <FilterSection title="Category">
        <div className="space-y-1.5">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`flex items-center justify-between w-full text-sm px-2 py-1.5 rounded-lg transition-colors duration-200 ${
              selectedCategory === "all"
                ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span>All Categories</span>
            {selectedCategory === "all" && <Check size={13} />}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`flex items-center justify-between w-full text-sm px-2 py-1.5 rounded-lg transition-colors duration-200 ${
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
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-1.5">
          {PRICE_RANGES.map((range, i) => (
            <button
              key={i}
              onClick={() => setSelectedPriceRange(selectedPriceRange === i ? null : i)}
              className={`flex items-center justify-between w-full text-sm px-2 py-1.5 rounded-lg transition-colors duration-200 ${
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
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Customer Rating">
        <div className="space-y-1.5">
          {RATING_OPTIONS.map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRating(selectedRating === r ? null : r)}
              className={`flex items-center gap-2 w-full text-sm px-2 py-1.5 rounded-lg transition-colors duration-200 ${
                selectedRating === r
                  ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={11}
                    className={s <= r ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
                  />
                ))}
              </div>
              <span>& Up</span>
              {selectedRating === r && <Check size={13} className="ml-auto" />}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability" defaultOpen={false}>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            onClick={() => setInStockOnly((v) => !v)}
            className={`w-9 h-5 rounded-full relative transition-colors duration-200 ${
              inStockOnly ? "bg-[var(--primary)]" : "bg-gray-200"
            }`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                inStockOnly ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </div>
          <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
            In Stock Only
          </span>
        </label>
      </FilterSection>

      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-medium transition-colors duration-200 mt-2"
        >
          <X size={14} />
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <Reveal>
        <div
          className="relative overflow-hidden py-10 px-4"
          style={{ backgroundColor: "var(--nav)" }}
        >
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, var(--primary) 0%, transparent 60%), radial-gradient(circle at 80% 20%, var(--accent) 0%, transparent 50%)",
            }}
          />
          <div className="relative mx-auto max-w-[1400px]">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-white/50 mb-4">
              <Link href="/" className="hover:text-white transition-colors duration-200">Home</Link>
              <ChevronRight size={12} />
              <span className="text-white/80">All Products</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
              Browse All Products
            </h1>
            <p className="text-white/60 text-sm">
              Discover top picks across Electronics, Fashion, Home, Books, and Sports.
            </p>
            {/* Category pills */}
            <div className="flex flex-wrap gap-2 mt-5">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  selectedCategory === "all"
                    ? "bg-[var(--primary)] text-[var(--foreground)]"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                All
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    selectedCategory === cat.slug
                      ? "bg-[var(--primary)] text-[var(--foreground)]"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Main Content */}
      <div className="mx-auto max-w-[1400px] px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters — desktop */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <Reveal>
              <div className="bg-white rounded-2xl border border-black/5 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)] sticky top-20">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    <SlidersHorizontal size={15} />
                    Filters
                  </h2>
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-[var(--primary)] font-semibold hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <FiltersPanel />
              </div>
            </Reveal>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <Reveal>
              <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
                <div className="flex items-center gap-3">
                  {/* Mobile filter toggle */}
                  <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:border-[var(--primary)] transition-colors duration-200 bg-white"
                  >
                    <SlidersHorizontal size={15} />
                    Filters
                    {hasActiveFilters && (
                      <span className="w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-[var(--foreground)]"
                        style={{ backgroundColor: "var(--primary)" }}>
                        !
                      </span>
                    )}
                  </button>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-900">{filteredProducts.length}</span>{" "}
                    {filteredProducts.length === 1 ? "result" : "results"}
                    {selectedCategory !== "all" && (
                      <span> in <span className="font-medium text-gray-700">
                        {CATEGORIES.find((c) => c.slug === selectedCategory)?.name ?? selectedCategory}
                      </span></span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Sort dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setSortDropdownOpen((o) => !o)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:border-[var(--primary)] transition-colors duration-200 bg-white"
                    >
                      <ArrowUpDown size={14} />
                      {currentSortLabel}
                      <ChevronDown size={13} className={`transition-transform duration-200 ${sortDropdownOpen ? "rotate-180" : ""}`} />
                    </button>
                    {sortDropdownOpen && (
                      <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl border border-black/5 shadow-[0_4px_16px_rgba(0,0,0,0.12)] z-20 overflow-hidden">
                        {SORT_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              setSortBy(opt.value);
                              setSortDropdownOpen(false);
                            }}
                            className={`flex items-center justify-between w-full px-4 py-2.5 text-sm transition-colors duration-150 ${
                              sortBy === opt.value
                                ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {opt.label}
                            {sortBy === opt.value && <Check size={13} />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* View toggle */}
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                    <button
                      onClick={() => setView("grid")}
                      className={`p-2 transition-colors duration-200 ${
                        view === "grid"
                          ? "bg-[var(--primary)] text-[var(--foreground)]"
                          : "text-gray-400 hover:text-gray-700"
                      }`}
                      aria-label="Grid view"
                    >
                      <Grid size={15} />
                    </button>
                    <button
                      onClick={() => setView("list")}
                      className={`p-2 transition-colors duration-200 ${
                        view === "list"
                          ? "bg-[var(--primary)] text-[var(--foreground)]"
                          : "text-gray-400 hover:text-gray-700"
                      }`}
                      aria-label="List view"
                    >
                      <List size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Active filter chips */}
            {hasActiveFilters && (
              <Reveal>
                <div className="flex flex-wrap gap-2 mb-5">
                  {selectedCategory !== "all" && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                      {CATEGORIES.find((c) => c.slug === selectedCategory)?.name}
                      <button onClick={() => setSelectedCategory("all")} aria-label="Remove category filter">
                        <X size={11} />
                      </button>
                    </span>
                  )}
                  {selectedPriceRange !== null && PRICE_RANGES[selectedPriceRange] && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                      {PRICE_RANGES[selectedPriceRange]?.label}
                      <button onClick={() => setSelectedPriceRange(null)} aria-label="Remove price filter">
                        <X size={11} />
                      </button>
                    </span>
                  )}
                  {selectedRating !== null && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                      {selectedRating}+ Stars
                      <button onClick={() => setSelectedRating(null)} aria-label="Remove rating filter">
                        <X size={11} />
                      </button>
                    </span>
                  )}
                  {inStockOnly && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                      In Stock
                      <button onClick={() => setInStockOnly(false)} aria-label="Remove in-stock filter">
                        <X size={11} />
                      </button>
                    </span>
                  )}
                  {searchQuery.trim() && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                      &ldquo;{searchQuery}&rdquo;
                      <button onClick={() => setSearchQuery("")} aria-label="Remove search filter">
                        <X size={11} />
                      </button>
                    </span>
                  )}
                </div>
              </Reveal>
            )}

            {/* Products */}
            {filteredProducts.length === 0 ? (
              <Reveal>
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No products found</h3>
                  <p className="text-sm text-gray-500 mb-6 max-w-xs">
                    Try adjusting your filters or search query to find what you are looking for.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90"
                    style={{ backgroundColor: "var(--primary)", color: "var(--foreground)" }}
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
                className={
                  view === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5"
                    : "flex flex-col gap-4"
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    view={view}
                    wishlist={wishlist}
                    onToggleWishlist={toggleWishlist}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </motion.div>
            )}

            {/* Added to cart toast */}
            {addedToCart.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.18)] text-sm font-semibold text-[var(--foreground)]"
                style={{ backgroundColor: "var(--primary)" }}
              >
                <Check size={16} />
                Added to cart!
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="absolute left-0 top-0 bottom-0 w-80 max-w-[90vw] bg-white overflow-y-auto"
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <SlidersHorizontal size={16} />
                Filters
              </h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5">
              <FiltersPanel />
            </div>
            <div className="sticky bottom-0 p-4 bg-white border-t border-gray-100">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: "var(--primary)", color: "var(--foreground)" }}
              >
                View {filteredProducts.length} Results
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}