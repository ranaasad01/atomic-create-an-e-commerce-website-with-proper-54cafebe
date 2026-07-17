"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Star, SlidersHorizontal, X, ShoppingCart, Heart, Filter } from 'lucide-react';
import { useTranslations } from "next-intl";
import { MOCK_PRODUCTS, CATEGORIES, APP_CURRENCY_SYMBOL, type Product } from "@/lib/data";
import { fadeInUp, staggerContainer, scaleIn, cardHover } from "@/lib/motion";
import { Reveal } from "@/components/Reveal";
import { useParams } from "next/navigation";
import { useCart } from "@/lib/cart-context";

// ─── Breadcrumb ───────────────────────────────────────────────────────────────
function Breadcrumb({ categoryName }: { categoryName: string }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
      <Link href="/" className="hover:text-[var(--primary)] transition-colors duration-200">
        Home
      </Link>
      <ChevronRight size={14} className="text-gray-400" />
      <Link href="/#categories" className="hover:text-[var(--primary)] transition-colors duration-200">
        Categories
      </Link>
      <ChevronRight size={14} className="text-gray-400" />
      <span className="text-[var(--foreground)] font-medium">{categoryName}</span>
    </nav>
  );
}

// ─── Star Rating Display ──────────────────────────────────────────────────────
function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
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
function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleAddToCart = () => {
    addItem(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1800);
  };

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.05 }}
      whileHover="hover"
      className="group relative bg-white rounded-2xl border border-black/5 overflow-hidden flex flex-col"
      style={{
        boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px -4px rgba(0,0,0,0.08)",
      }}
    >
      {/* Wishlist */}
      <button
        onClick={() => setWishlisted((v) => !v)}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-black/5 shadow-sm hover:scale-110 transition-transform duration-200"
      >
        <Heart
          size={15}
          className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}
        />
      </button>

      {/* Badge */}
      {product.badge && (
        <span className="absolute top-3 left-3 z-10 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--primary)] text-[var(--foreground)]">
          {product.badge}
        </span>
      )}

      {/* Image */}
      <Link href={`/product/${product.id}`} className="block overflow-hidden bg-gray-50 aspect-square">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://placehold.co/400x400/f3f4f6/9ca3af?text=No+Image";
          }}
        />
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm font-semibold text-[var(--foreground)] leading-snug line-clamp-2 hover:text-[var(--primary)] transition-colors duration-200">
            {product.name}
          </h3>
        </Link>

        <StarRating rating={product.rating} count={product.reviewCount} />

        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span className="text-base font-bold text-[var(--foreground)]">
            {APP_CURRENCY_SYMBOL}{product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              {APP_CURRENCY_SYMBOL}{product.originalPrice.toFixed(2)}
            </span>
          )}
          {discount && (
            <span className="text-xs font-semibold text-emerald-600">-{discount}%</span>
          )}
        </div>

        {!product.inStock && (
          <span className="text-xs text-red-500 font-medium">Out of stock</span>
        )}

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`mt-2 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
            addedToCart
              ? "bg-emerald-500 text-white"
              : product.inStock
              ? "bg-[var(--primary)] text-[var(--foreground)] hover:opacity-90"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          <ShoppingCart size={15} />
          {addedToCart ? "Added!" : product.inStock ? "Add to Cart" : "Unavailable"}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-black/5 overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-8 bg-gray-200 rounded-xl mt-4" />
      </div>
    </div>
  );
}

// ─── Filters Sidebar ──────────────────────────────────────────────────────────
interface FiltersState {
  priceMin: number;
  priceMax: number;
  ratings: number[];
  inStockOnly: boolean;
}

const BRANDS_BY_CATEGORY: Record<string, string[]> = {
  electronics: ["Sony", "Apple", "Samsung", "Bose", "LG", "Dell"],
  fashion: ["Nike", "Adidas", "Levi's", "Zara", "H&M", "Gucci"],
  "home-kitchen": ["KitchenAid", "Cuisinart", "Dyson", "Instant Pot", "Ninja", "Breville"],
  books: ["Penguin", "HarperCollins", "Random House", "Simon & Schuster", "Macmillan"],
  sports: ["Nike", "Adidas", "Under Armour", "Wilson", "Callaway", "Yeti"],
};

function FiltersSidebar({
  filters,
  setFilters,
  selectedBrands,
  setSelectedBrands,
  slug,
  onClose,
}: {
  filters: FiltersState;
  setFilters: (f: FiltersState) => void;
  selectedBrands: string[];
  setSelectedBrands: (b: string[]) => void;
  slug: string;
  onClose?: () => void;
}) {
  const brands = BRANDS_BY_CATEGORY[slug] ?? [];

  const toggleRating = (r: number) => {
    setFilters({
      ...filters,
      ratings: filters.ratings.includes(r)
        ? filters.ratings.filter((x) => x !== r)
        : [...filters.ratings, r],
    });
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(
      selectedBrands.includes(brand)
        ? selectedBrands.filter((b) => b !== brand)
        : [...selectedBrands, brand]
    );
  };

  const resetAll = () => {
    setFilters({ priceMin: 0, priceMax: 2000, ratings: [], inStockOnly: false });
    setSelectedBrands([]);
  };

  return (
    <aside className="w-full bg-white rounded-2xl border border-black/5 p-5 space-y-6 sticky top-20"
      style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px -4px rgba(0,0,0,0.08)" }}
    >
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-[var(--foreground)] text-base flex items-center gap-2">
          <Filter size={16} style={{ color: "var(--primary)" }} />
          Filters
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={resetAll}
            className="text-xs text-gray-400 hover:text-[var(--primary)] transition-colors duration-200"
          >
            Reset all
          </button>
          {onClose && (
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
              <X size={16} className="text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Price Range</h3>
        <div className="space-y-3">
          <input
            type="range"
            min={0}
            max={2000}
            step={10}
            value={filters.priceMax}
            onChange={(e) => setFilters({ ...filters, priceMax: Number(e.target.value) })}
            className="w-full accent-[var(--primary)]"
            aria-label="Maximum price"
          />
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">$</span>
              <input
                type="number"
                min={0}
                max={filters.priceMax}
                value={filters.priceMin}
                onChange={(e) =>
                  setFilters({ ...filters, priceMin: Math.max(0, Number(e.target.value)) })
                }
                className="w-full pl-5 pr-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--primary)]"
                aria-label="Minimum price"
              />
            </div>
            <span className="text-gray-400 text-xs">to</span>
            <div className="flex-1 relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">$</span>
              <input
                type="number"
                min={filters.priceMin}
                max={2000}
                value={filters.priceMax}
                onChange={(e) =>
                  setFilters({ ...filters, priceMax: Math.min(2000, Number(e.target.value)) })
                }
                className="w-full pl-5 pr-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--primary)]"
                aria-label="Maximum price"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Star Rating */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Customer Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((r) => (
            <label key={r} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.ratings.includes(r)}
                onChange={() => toggleRating(r)}
                className="rounded accent-[var(--primary)]"
              />
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={13}
                    className={s <= r ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
                  />
                ))}
                <span className="text-xs text-gray-500 ml-1">& up</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Brand</h3>
          <div className="space-y-2">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="rounded accent-[var(--primary)]"
                />
                <span className="text-sm text-gray-600">{brand}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* In Stock */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => setFilters({ ...filters, inStockOnly: e.target.checked })}
            className="rounded accent-[var(--primary)]"
          />
          <span className="text-sm font-medium text-[var(--foreground)]">In Stock Only</span>
        </label>
      </div>
    </aside>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
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
        className="px-3 py-2 rounded-xl text-sm font-medium border border-black/8 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
      >
        Previous
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`w-9 h-9 rounded-xl text-sm font-medium transition-all duration-200 ${
              currentPage === p
                ? "bg-[var(--primary)] text-[var(--foreground)] shadow-sm"
                : "border border-black/8 bg-white hover:bg-gray-50 text-gray-700"
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-xl text-sm font-medium border border-black/8 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
      >
        Next
      </button>
    </div>
  );
}

// ─── Sort Dropdown ────────────────────────────────────────────────────────────
type SortOption = "featured" | "price-asc" | "price-desc" | "rating" | "newest";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Avg. Customer Rating" },
  { value: "newest", label: "Newest Arrivals" },
];

function SortDropdown({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (v: SortOption) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = SORT_OPTIONS.find((o) => o.value === value) ?? SORT_OPTIONS[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-black/8 bg-white text-sm font-medium text-[var(--foreground)] hover:bg-gray-50 transition-colors duration-200"
      >
        <span>Sort: {current.label}</span>
        <ChevronDown size={15} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl border border-black/8 shadow-lg z-30 overflow-hidden"
          >
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 ${
                  opt.value === value
                    ? "bg-[var(--primary)]/10 text-[var(--foreground)] font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 12;

export default function CategoryPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : "";

  const category = CATEGORIES.find((c) => c.slug === slug);
  const categoryName = category?.name ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const [filters, setFilters] = useState<FiltersState>({
    priceMin: 0,
    priceMax: 2000,
    ratings: [],
    inStockOnly: false,
  });
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isLoading] = useState(false);

  // Filter products by category slug
  const categoryProducts = useMemo(
    () => MOCK_PRODUCTS.filter((p) => p.categorySlug === slug),
    [slug]
  );

  // Apply filters
  const filtered = useMemo(() => {
    let result = [...categoryProducts];

    result = result.filter(
      (p) => p.price >= filters.priceMin && p.price <= filters.priceMax
    );

    if (filters.ratings.length > 0) {
      result = result.filter((p) =>
        filters.ratings.some((r) => p.rating >= r)
      );
    }

    if (filters.inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    // Sort
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
      case "newest":
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      default:
        break;
    }

    return result;
  }, [categoryProducts, filters, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const handlePageChange = useCallback(
    (p: number) => {
      setCurrentPage(Math.max(1, Math.min(p, totalPages)));
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [totalPages]
  );

  const handleSortChange = (v: SortOption) => {
    setSortBy(v);
    setCurrentPage(1);
  };

  const handleFiltersChange = (f: FiltersState) => {
    setFilters(f);
    setCurrentPage(1);
  };

  const handleBrandsChange = (b: string[]) => {
    setSelectedBrands(b);
    setCurrentPage(1);
  };

  const activeFilterCount =
    (filters.ratings.length > 0 ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.priceMax < 2000 || filters.priceMin > 0 ? 1 : 0) +
    selectedBrands.length;

  return (
    <main className="min-h-screen bg-[var(--background)] pb-20">
      <div className="mx-auto max-w-[1400px] px-4 pt-6">
        {/* Breadcrumb */}
        <Reveal>
          <Breadcrumb categoryName={categoryName} />
        </Reveal>

        {/* Category Header */}
        <Reveal delay={0.05}>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-3 mb-1">
                {category?.icon && (
                  <span className="text-3xl" role="img" aria-label={categoryName}>
                    {category.icon}
                  </span>
                )}
                <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
                  {categoryName}
                </h1>
              </div>
              {category?.description && (
                <p className="text-sm text-gray-500 mt-1">{category.description}</p>
              )}
              <p className="text-sm text-gray-400 mt-1">
                {filtered.length === 0
                  ? "No products found"
                  : `Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(
                      currentPage * PAGE_SIZE,
                      filtered.length
                    )} of ${filtered.length} product${filtered.length !== 1 ? "s" : ""}`}
              </p>
            </div>

            {/* Sort + Mobile Filter Toggle */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-black/8 bg-white text-sm font-medium hover:bg-gray-50 transition-colors duration-200 relative"
              >
                <SlidersHorizontal size={15} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[var(--primary)] text-[var(--foreground)] text-[10px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <SortDropdown value={sortBy} onChange={handleSortChange} />
            </div>
          </div>
        </Reveal>

        <div className="flex gap-6 items-start">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <Reveal delay={0.08}>
              <FiltersSidebar
                filters={filters}
                setFilters={handleFiltersChange}
                selectedBrands={selectedBrands}
                setSelectedBrands={handleBrandsChange}
                slug={slug}
              />
            </Reveal>
          </div>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : paginated.length === 0 ? (
              <Reveal>
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <span className="text-5xl mb-4" role="img" aria-label="No results">
                    🔍
                  </span>
                  <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">
                    No products found
                  </h2>
                  <p className="text-gray-500 text-sm mb-6 max-w-xs">
                    Try adjusting your filters or browse a different category.
                  </p>
                  <button
                    onClick={() => {
                      setFilters({ priceMin: 0, priceMax: 2000, ratings: [], inStockOnly: false });
                      setSelectedBrands([]);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--foreground)] text-sm font-semibold hover:opacity-90 transition-opacity duration-200"
                  >
                    Clear Filters
                  </button>
                </div>
              </Reveal>
            ) : (
              <>
                <motion.div
                  key={`${slug}-${currentPage}-${sortBy}`}
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
                >
                  {paginated.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </motion.div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed left-0 top-0 bottom-0 w-80 max-w-[90vw] z-50 overflow-y-auto bg-[var(--background)] p-4 lg:hidden"
            >
              <FiltersSidebar
                filters={filters}
                setFilters={handleFiltersChange}
                selectedBrands={selectedBrands}
                setSelectedBrands={handleBrandsChange}
                slug={slug}
                onClose={() => setMobileFiltersOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}