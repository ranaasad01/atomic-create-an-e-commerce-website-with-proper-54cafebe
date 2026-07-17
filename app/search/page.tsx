"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Search, SlidersHorizontal, X, Star, ChevronDown, ChevronLeft, ChevronRight, ShoppingCart, Heart, Filter, ArrowUpDown } from 'lucide-react';
import { useTranslations } from "next-intl";
import { MOCK_PRODUCTS, CATEGORIES, APP_CURRENCY_SYMBOL, type Product } from "@/lib/data";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";
import { Reveal } from "@/components/Reveal";

// ─── Types ────────────────────────────────────────────────────────────────────

type SortOption = "relevance" | "price-asc" | "price-desc" | "rating" | "newest";

interface Filters {
  categories: string[];
  minPrice: string;
  maxPrice: string;
  minRating: number;
  inStockOnly: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Most Relevant" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest First" },
];

const ITEMS_PER_PAGE = 12;

const RATING_OPTIONS = [4, 3, 2, 1];

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1">
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
      {count !== undefined && (
        <span className="text-xs text-gray-500 ml-1">({count.toLocaleString("en-US")})</span>
      )}
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function ProductCard({ product }: { product: Product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <motion.div
      variants={cardVariant}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative bg-white rounded-2xl border border-black/5 overflow-hidden flex flex-col"
      style={{
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px -4px rgba(0,0,0,0.08)",
      }}
    >
      {/* Image */}
      <Link href={`/product/${product.id}`} className="relative block overflow-hidden bg-gray-50 aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop";
          }}
        />
        {product.badge && (
          <span className="absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--primary)] text-[var(--foreground)]">
            {product.badge}
          </span>
        )}
        {discount && (
          <span className="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">
            -{discount}%
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            setWishlisted((w) => !w);
          }}
          className="absolute bottom-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
          aria-label="Add to wishlist"
        >
          <Heart
            size={14}
            className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}
          />
        </button>
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3 gap-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--primary)]">
          {product.category}
        </span>
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm font-medium text-gray-900 leading-snug line-clamp-2 hover:text-[var(--primary)] transition-colors duration-200">
            {product.name}
          </h3>
        </Link>
        <StarRating rating={product.rating} count={product.reviewCount} />
        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span className="text-base font-bold text-gray-900">
            {APP_CURRENCY_SYMBOL}{product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              {APP_CURRENCY_SYMBOL}{product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        {!product.inStock && (
          <span className="text-xs text-red-500 font-medium">Out of stock</span>
        )}
        <motion.button
          whileTap={{ scale: 0.96 }}
          disabled={!product.inStock}
          className="mt-1 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--foreground)",
          }}
        >
          <ShoppingCart size={13} />
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-black/5 overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-100" />
      <div className="p-3 flex flex-col gap-2">
        <div className="h-3 w-16 bg-gray-100 rounded" />
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="h-3 w-24 bg-gray-100 rounded" />
        <div className="h-5 w-20 bg-gray-100 rounded mt-1" />
        <div className="h-8 w-full bg-gray-100 rounded-xl mt-1" />
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ query }: { query: string }) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center py-24 px-6 text-center"
    >
      {/* SVG Illustration */}
      <svg
        width="160"
        height="160"
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-8 opacity-80"
        aria-hidden="true"
      >
        <circle cx="80" cy="80" r="72" fill="#F3F4F6" />
        <circle cx="72" cy="68" r="28" stroke="#D1D5DB" strokeWidth="5" fill="none" />
        <line x1="92" y1="90" x2="116" y2="116" stroke="#D1D5DB" strokeWidth="5" strokeLinecap="round" />
        <circle cx="72" cy="68" r="14" fill="#E5E7EB" />
        <path d="M66 68 Q72 58 78 68" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <circle cx="67" cy="64" r="2" fill="#9CA3AF" />
        <circle cx="77" cy="64" r="2" fill="#9CA3AF" />
        <path d="M50 110 Q80 100 110 110" stroke="#E5E7EB" strokeWidth="3" strokeLinecap="round" fill="none" />
      </svg>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">No results found</h2>
      <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-2">
        We could not find any products matching
      </p>
      {query && (
        <p className="text-gray-700 font-semibold text-sm mb-6">
          &ldquo;{query}&rdquo;
        </p>
      )}
      <p className="text-gray-400 text-xs mb-8">
        Try different keywords, check your spelling, or browse our categories below.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90"
          style={{ backgroundColor: "var(--primary)", color: "var(--foreground)" }}
        >
          Browse All Products
        </Link>
        {CATEGORIES.slice(0, 3).map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all duration-200"
          >
            {cat.icon} {cat.name}
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Filters Sidebar ──────────────────────────────────────────────────────────

interface FiltersSidebarProps {
  filters: Filters;
  onChange: (f: Filters) => void;
  onReset: () => void;
}

function FiltersSidebar({ filters, onChange, onReset }: FiltersSidebarProps) {
  const toggleCategory = (slug: string) => {
    const next = filters.categories.includes(slug)
      ? filters.categories.filter((c) => c !== slug)
      : [...filters.categories, slug];
    onChange({ ...filters, categories: next });
  };

  return (
    <aside className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <Filter size={14} />
          Filters
        </h2>
        <button
          onClick={onReset}
          className="text-xs text-[var(--primary)] font-semibold hover:underline"
        >
          Reset all
        </button>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Category
        </h3>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map((cat) => (
            <label key={cat.slug} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat.slug)}
                onChange={() => toggleCategory(cat.slug)}
                className="w-4 h-4 rounded border-gray-300 accent-[var(--primary)] cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                {cat.icon} {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Price Range
        </h3>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
            <input
              type="number"
              min="0"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
              className="w-full pl-6 pr-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--primary)] transition-colors"
            />
          </div>
          <span className="text-gray-400 text-xs">to</span>
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
            <input
              type="number"
              min="0"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
              className="w-full pl-6 pr-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--primary)] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Minimum Rating
        </h3>
        <div className="flex flex-col gap-2">
          {RATING_OPTIONS.map((r) => (
            <label key={r} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="minRating"
                checked={filters.minRating === r}
                onChange={() => onChange({ ...filters, minRating: r })}
                className="w-4 h-4 accent-[var(--primary)] cursor-pointer"
              />
              <span className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={12}
                    className={s <= r ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
                  />
                ))}
                <span className="text-xs text-gray-500 ml-1">& up</span>
              </span>
            </label>
          ))}
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="radio"
              name="minRating"
              checked={filters.minRating === 0}
              onChange={() => onChange({ ...filters, minRating: 0 })}
              className="w-4 h-4 accent-[var(--primary)] cursor-pointer"
            />
            <span className="text-sm text-gray-600">Any rating</span>
          </label>
        </div>
      </div>

      {/* In Stock */}
      <div>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 accent-[var(--primary)] cursor-pointer"
          />
          <span className="text-sm text-gray-700 font-medium">In Stock Only</span>
        </label>
      </div>
    </aside>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>
      {pages.map((page, idx) =>
        page === "..." ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-sm">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentPage === page
                ? "text-[var(--foreground)] shadow-sm"
                : "border border-gray-200 text-gray-600 hover:border-[var(--primary)] hover:text-[var(--primary)]"
            }`}
            style={
              currentPage === page
                ? { backgroundColor: "var(--primary)" }
                : {}
            }
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ─── Default Filters ──────────────────────────────────────────────────────────

const DEFAULT_FILTERS: Filters = {
  categories: [],
  minPrice: "",
  maxPrice: "",
  minRating: 0,
  inStockOnly: false,
};

// ─── Inner Search Page (uses useSearchParams) ─────────────────────────────────

function SearchPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations();

  const initialQuery = searchParams.get("q") ?? "";

  const [inputValue, setInputValue] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<SortOption>("relevance");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // Simulate loading on query change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [query, filters, sort]);

  // Reset page on filter/sort/query change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, filters, sort]);

  // Sync query from URL
  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    setQuery(q);
    setInputValue(q);
  }, [searchParams]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = inputValue.trim();
      setQuery(trimmed);
      if (trimmed) {
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      } else {
        router.push("/search");
      }
    },
    [inputValue, router]
  );

  const filteredProducts = useMemo(() => {
    let results = [...MOCK_PRODUCTS];

    // Text search
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      results = results.filter((p) => filters.categories.includes(p.categorySlug));
    }

    // Price filter
    const minP = parseFloat(filters.minPrice);
    const maxP = parseFloat(filters.maxPrice);
    if (!isNaN(minP)) results = results.filter((p) => p.price >= minP);
    if (!isNaN(maxP)) results = results.filter((p) => p.price <= maxP);

    // Rating filter
    if (filters.minRating > 0) {
      results = results.filter((p) => p.rating >= filters.minRating);
    }

    // In stock filter
    if (filters.inStockOnly) {
      results = results.filter((p) => p.inStock);
    }

    // Sort
    switch (sort) {
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
        results.sort((a, b) => a.id.localeCompare(b.id));
        break;
      default:
        break;
    }

    return results;
  }, [query, filters, sort]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const activeFilterCount =
    filters.categories.length +
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0);

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Most Relevant";

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <Reveal>
        <div
          className="py-8 px-4"
          style={{ backgroundColor: "var(--nav)" }}
        >
          <div className="mx-auto max-w-[1400px]">
            <form onSubmit={handleSearch} className="flex items-center gap-3 max-w-2xl mx-auto">
              <div className="flex flex-1 rounded-xl overflow-hidden border-2 border-transparent focus-within:border-[var(--primary)] transition-colors duration-200 bg-white">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Search products, brands, categories..."
                  className="flex-1 px-4 py-3 text-sm text-gray-900 outline-none bg-transparent"
                  aria-label="Search products"
                />
                {inputValue && (
                  <button
                    type="button"
                    onClick={() => setInputValue("")}
                    className="px-3 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <motion.button
                type="submit"
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 flex-shrink-0"
                style={{ backgroundColor: "var(--primary)", color: "var(--foreground)" }}
              >
                <Search size={16} />
                Search
              </motion.button>
            </form>
          </div>
        </div>
      </Reveal>

      <div className="mx-auto max-w-[1400px] px-4 py-8">
        {/* Results header */}
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {query ? (
                  <>
                    Showing{" "}
                    <span style={{ color: "var(--primary)" }}>
                      {filteredProducts.length}
                    </span>{" "}
                    result{filteredProducts.length !== 1 ? "s" : ""} for{" "}
                    <span className="italic">&ldquo;{query}&rdquo;</span>
                  </>
                ) : (
                  <>
                    All Products{" "}
                    <span className="text-gray-400 font-normal text-base">
                      ({filteredProducts.length} items)
                    </span>
                  </>
                )}
              </h1>
              {activeFilterCount > 0 && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} applied
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setSidebarOpen((o) => !o)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all duration-200"
              >
                <SlidersHorizontal size={15} />
                Filters
                {activeFilterCount > 0 && (
                  <span
                    className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                    style={{ backgroundColor: "var(--primary)", color: "var(--foreground)" }}
                  >
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSortOpen((o) => !o)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all duration-200 bg-white"
                >
                  <ArrowUpDown size={14} />
                  {currentSortLabel}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {sortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl border border-black/5 shadow-lg z-30 overflow-hidden"
                      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setSort(opt.value);
                            setSortOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 flex items-center justify-between ${
                            sort === opt.value
                              ? "font-semibold"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                          style={
                            sort === opt.value
                              ? { color: "var(--primary)", backgroundColor: "var(--primary)10" }
                              : {}
                          }
                        >
                          {opt.label}
                          {sort === opt.value && (
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: "var(--primary)" }}
                            />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <Reveal className="hidden lg:block w-56 flex-shrink-0">
            <div
              className="bg-white rounded-2xl border border-black/5 p-5 sticky top-20"
              style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px -4px rgba(0,0,0,0.06)" }}
            >
              <FiltersSidebar
                filters={filters}
                onChange={setFilters}
                onReset={() => setFilters(DEFAULT_FILTERS)}
              />
            </div>
          </Reveal>

          {/* Mobile Sidebar Drawer */}
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
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 28, stiffness: 280 }}
                  className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 p-6 overflow-y-auto lg:hidden"
                  style={{ boxShadow: "4px 0 24px rgba(0,0,0,0.12)" }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-gray-900">Filters</h2>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      aria-label="Close filters"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <FiltersSidebar
                    filters={filters}
                    onChange={setFilters}
                    onReset={() => {
                      setFilters(DEFAULT_FILTERS);
                      setSidebarOpen(false);
                    }}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <EmptyState query={query} />
            ) : (
              <>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4"
                >
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>

                {/* Pagination */}
                <Reveal>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(p) => {
                      setCurrentPage(p);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                </Reveal>

                {/* Results summary */}
                <Reveal>
                  <p className="text-center text-xs text-gray-400 mt-4">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                    {" "}to{" "}
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}
                    {" "}of {filteredProducts.length} products
                  </p>
                </Reveal>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Click-outside handler for sort dropdown */}
      {sortOpen && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setSortOpen(false)}
        />
      )}
    </main>
  );
}

// ─── Page Export (wrapped in Suspense for useSearchParams) ────────────────────

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50">
          <div className="py-8 px-4" style={{ backgroundColor: "var(--nav)" }}>
            <div className="mx-auto max-w-[1400px]">
              <div className="h-12 bg-white/20 rounded-xl animate-pulse max-w-2xl mx-auto" />
            </div>
          </div>
          <div className="mx-auto max-w-[1400px] px-4 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        </main>
      }
    >
      <SearchPageInner />
    </Suspense>
  );
}