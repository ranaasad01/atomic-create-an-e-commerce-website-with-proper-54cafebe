"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Star, Filter, ChevronDown, ShoppingCart, Heart, BookOpen, Award, TrendingUp, Grid, List, X } from 'lucide-react';
import { useTranslations } from "next-intl";
import { APP_CURRENCY_SYMBOL } from "@/lib/data";
import { fadeInUp, staggerContainer, scaleIn, cardHover } from "@/lib/motion";
import { Reveal } from "@/components/Reveal";
import { useCart } from "@/lib/cart-context";

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  genre: string;
  badge?: string;
  description: string;
  pages: number;
  publisher: string;
  year: number;
  isbn: string;
  inStock: boolean;
  bestseller?: boolean;
  newRelease?: boolean;
}

const BOOKS: Book[] = [
  {
    id: "b1",
    title: "Atomic Habits",
    author: "James Clear",
    price: 14.99,
    originalPrice: 27.0,
    image: "https://m.media-amazon.com/images/I/81kg51XRc1L._AC_UF1000,1000_QL80_.jpg",
    rating: 4.9,
    reviewCount: 87432,
    genre: "Self-Help",
    badge: "Best Seller",
    description:
      "An easy and proven way to build good habits and break bad ones. Tiny changes, remarkable results.",
    pages: 320,
    publisher: "Avery",
    year: 2018,
    isbn: "978-0735211292",
    inStock: true,
    bestseller: true,
  },
  {
    id: "b2",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    price: 13.49,
    originalPrice: 22.0,
    image: "/images/psychology-of-money-book.jpg",
    rating: 4.8,
    reviewCount: 54210,
    genre: "Finance",
    badge: "Top Rated",
    description:
      "Timeless lessons on wealth, greed, and happiness. How to think about money in a way that actually works.",
    pages: 256,
    publisher: "Harriman House",
    year: 2020,
    isbn: "978-0857197689",
    inStock: true,
    bestseller: true,
  },
  {
    id: "b3",
    title: "Project Hail Mary",
    author: "Andy Weir",
    price: 16.99,
    originalPrice: 28.99,
    image: "/images/project-hail-mary-andy-weir.jpg",
    rating: 4.9,
    reviewCount: 41890,
    genre: "Science Fiction",
    badge: "Award Winner",
    description:
      "A lone astronaut must save the earth from disaster in this gripping science fiction thriller.",
    pages: 476,
    publisher: "Ballantine Books",
    year: 2021,
    isbn: "978-0593135204",
    inStock: true,
    bestseller: true,
  },
  {
    id: "b4",
    title: "Dune",
    author: "Frank Herbert",
    price: 11.99,
    originalPrice: 19.99,
    image: "/images/dune-frank-herbert-novel.jpg",
    rating: 4.7,
    reviewCount: 112340,
    genre: "Science Fiction",
    description:
      "The epic saga of a desert planet, political intrigue, and the rise of a messiah. A landmark of science fiction.",
    pages: 688,
    publisher: "Ace",
    year: 1965,
    isbn: "978-0441013593",
    inStock: true,
  },
  {
    id: "b5",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    price: 15.99,
    originalPrice: 24.99,
    image: "/images/sapiens-yuval-noah-harari-book.jpg",
    rating: 4.7,
    reviewCount: 98765,
    genre: "History",
    badge: "Best Seller",
    description:
      "A bold, wide-ranging and provocative look at the history of our species from the Stone Age to the present.",
    pages: 464,
    publisher: "Harper",
    year: 2015,
    isbn: "978-0062316097",
    inStock: true,
    bestseller: true,
  },
  {
    id: "b6",
    title: "The Midnight Library",
    author: "Matt Haig",
    price: 12.99,
    originalPrice: 21.99,
    image: "/images/midnight-library-matt-haig.jpg",
    rating: 4.6,
    reviewCount: 67234,
    genre: "Fiction",
    badge: "New Release",
    description:
      "Between life and death there is a library. A novel about all the choices that go into a life well lived.",
    pages: 304,
    publisher: "Viking",
    year: 2020,
    isbn: "978-0525559474",
    inStock: true,
    newRelease: true,
  },
  {
    id: "b7",
    title: "Deep Work",
    author: "Cal Newport",
    price: 13.99,
    originalPrice: 20.0,
    image: "/images/deep-work-cal-newport-book.jpg",
    rating: 4.7,
    reviewCount: 43120,
    genre: "Self-Help",
    description:
      "Rules for focused success in a distracted world. How to produce at an elite level in the modern economy.",
    pages: 296,
    publisher: "Grand Central Publishing",
    year: 2016,
    isbn: "978-1455586691",
    inStock: true,
  },
  {
    id: "b8",
    title: "The Lean Startup",
    author: "Eric Ries",
    price: 14.49,
    originalPrice: 26.0,
    image: "/images/lean-startup-eric-ries-book.jpg",
    rating: 4.5,
    reviewCount: 38900,
    genre: "Business",
    description:
      "How today's entrepreneurs use continuous innovation to create radically successful businesses.",
    pages: 336,
    publisher: "Crown Business",
    year: 2011,
    isbn: "978-0307887894",
    inStock: true,
  },
  {
    id: "b9",
    title: "Educated",
    author: "Tara Westover",
    price: 13.99,
    originalPrice: 22.0,
    image: "/images/educated-tara-westover-memoir.jpg",
    rating: 4.8,
    reviewCount: 72100,
    genre: "Memoir",
    badge: "Award Winner",
    description:
      "A memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.",
    pages: 352,
    publisher: "Random House",
    year: 2018,
    isbn: "978-0399590504",
    inStock: true,
  },
  {
    id: "b10",
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 10.99,
    originalPrice: 17.99,
    image: "/images/the-alchemist-paulo-coelho.jpg",
    rating: 4.6,
    reviewCount: 145670,
    genre: "Fiction",
    description:
      "A magical story about following your dreams. One of the best-selling books in history, translated into 80 languages.",
    pages: 208,
    publisher: "HarperOne",
    year: 1988,
    isbn: "978-0062315007",
    inStock: true,
    bestseller: true,
  },
  {
    id: "b11",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    price: 15.49,
    originalPrice: 30.0,
    image: "/images/thinking-fast-and-slow-kahneman.jpg",
    rating: 4.6,
    reviewCount: 61230,
    genre: "Psychology",
    description:
      "A groundbreaking tour of the mind and explains the two systems that drive the way we think.",
    pages: 499,
    publisher: "Farrar, Straus and Giroux",
    year: 2011,
    isbn: "978-0374533557",
    inStock: true,
  },
  {
    id: "b12",
    title: "Fourth Wing",
    author: "Rebecca Yarros",
    price: 17.99,
    originalPrice: 29.99,
    image: "/images/fourth-wing-rebecca-yarros.jpg",
    rating: 4.7,
    reviewCount: 29870,
    genre: "Fantasy",
    badge: "New Release",
    description:
      "Enter the brutal and elite world of a war college for dragon riders. A fantasy romance that took the world by storm.",
    pages: 528,
    publisher: "Red Tower Books",
    year: 2023,
    isbn: "978-1649374042",
    inStock: true,
    newRelease: true,
  },
];

const GENRES = [
  "All",
  "Fiction",
  "Science Fiction",
  "Fantasy",
  "Self-Help",
  "Business",
  "Finance",
  "History",
  "Psychology",
  "Memoir",
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "reviews", label: "Most Reviews" },
];

const FEATURED_COLLECTIONS = [
  {
    title: "Staff Picks",
    description: "Curated by our book lovers",
    icon: <Award size={24} />,
    color: "from-amber-500/20 to-orange-500/10",
    accent: "#f59e0b",
    count: 24,
  },
  {
    title: "Trending Now",
    description: "What readers are buying this week",
    icon: <TrendingUp size={24} />,
    color: "from-emerald-500/20 to-teal-500/10",
    accent: "#10b981",
    count: 18,
  },
  {
    title: "Award Winners",
    description: "Pulitzer, Booker, and more",
    icon: <BookOpen size={24} />,
    color: "from-violet-500/20 to-purple-500/10",
    accent: "#8b5cf6",
    count: 31,
  },
];

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
      <span className="text-xs text-gray-500">
        {rating.toFixed(1)} ({count.toLocaleString("en-US")})
      </span>
    </div>
  );
}

function BookCard({
  book,
  view,
  onAddToCart,
}: {
  book: Book;
  view: "grid" | "list";
  onAddToCart: (book: Book) => void;
}) {
  const [wished, setWished] = useState(false);
  const discount =
    book.originalPrice
      ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
      : 0;

  if (view === "list") {
    return (
      <motion.div
        variants={cardHover}
        initial="rest"
        whileHover="hover"
        className="bg-white rounded-xl border border-black/5 overflow-hidden flex gap-4 p-4"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)" }}
      >
        <Link href={`/product/${book.id}`} className="flex-shrink-0">
          <img
            src={book.image}
            alt={book.title}
            className="w-24 h-32 object-cover rounded-lg"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              {book.badge && (
                <span
                  className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1"
                  style={{ backgroundColor: "var(--primary)", color: "var(--foreground)" }}
                >
                  {book.badge}
                </span>
              )}
              <Link href={`/product/${book.id}`}>
                <h3 className="font-semibold text-gray-900 hover:text-[var(--primary)] transition-colors line-clamp-2 leading-snug">
                  {book.title}
                </h3>
              </Link>
              <p className="text-sm text-gray-500 mt-0.5">{book.author}</p>
            </div>
            <button
              onClick={() => setWished((w) => !w)}
              className="flex-shrink-0 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart
                size={18}
                className={wished ? "fill-red-500 text-red-500" : "text-gray-400"}
              />
            </button>
          </div>
          <StarRating rating={book.rating} count={book.reviewCount} />
          <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
            {book.description}
          </p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">
                {APP_CURRENCY_SYMBOL}{book.price.toFixed(2)}
              </span>
              {book.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {APP_CURRENCY_SYMBOL}{book.originalPrice.toFixed(2)}
                </span>
              )}
              {discount > 0 && (
                <span className="text-xs font-semibold text-emerald-600">
                  -{discount}%
                </span>
              )}
            </div>
            <button
              onClick={() => onAddToCart(book)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "var(--primary)", color: "var(--foreground)" }}
            >
              <ShoppingCart size={15} />
              Add to Cart
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      className="bg-white rounded-xl border border-black/5 overflow-hidden flex flex-col group"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)" }}
    >
      <div className="relative overflow-hidden bg-gray-50">
        <Link href={`/product/${book.id}`}>
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        {book.badge && (
          <span
            className="absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-full"
            style={{ backgroundColor: "var(--primary)", color: "var(--foreground)" }}
          >
            {book.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full bg-red-500 text-white">
            -{discount}%
          </span>
        )}
        <button
          onClick={() => setWished((w) => !w)}
          className="absolute bottom-2 right-2 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-colors"
          aria-label="Add to wishlist"
        >
          <Heart
            size={16}
            className={wished ? "fill-red-500 text-red-500" : "text-gray-400"}
          />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">
          {book.genre}
        </span>
        <Link href={`/product/${book.id}`}>
          <h3 className="font-semibold text-gray-900 hover:text-[var(--primary)] transition-colors line-clamp-2 leading-snug text-sm mb-0.5">
            {book.title}
          </h3>
        </Link>
        <p className="text-xs text-gray-500 mb-2">{book.author}</p>
        <StarRating rating={book.rating} count={book.reviewCount} />
        <div className="mt-auto pt-3 flex items-center justify-between">
          <div>
            <span className="text-base font-bold text-gray-900">
              {APP_CURRENCY_SYMBOL}{book.price.toFixed(2)}
            </span>
            {book.originalPrice && (
              <span className="text-xs text-gray-400 line-through ml-1.5">
                {APP_CURRENCY_SYMBOL}{book.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={() => onAddToCart(book)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "var(--primary)", color: "var(--foreground)" }}
          >
            <ShoppingCart size={13} />
            Add
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function BooksPage() {
  const t = useTranslations();
  const { addItem } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAddToCart = (book: Book) => {
    addItem({
      id: book.id,
      name: book.title,
      price: book.price,
      originalPrice: book.originalPrice,
      image: book.image,
      images: [book.image],
      category: "Books",
      categorySlug: "books",
      rating: book.rating,
      reviewCount: book.reviewCount,
      badge: book.badge,
      description: book.description,
      inStock: book.inStock,
    });
    setAddedId(book.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const filtered = useMemo(() => {
    let result = [...BOOKS];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.genre.toLowerCase().includes(q)
      );
    }

    if (selectedGenre !== "All") {
      result = result.filter((b) => b.genre === selectedGenre);
    }

    result = result.filter(
      (b) => b.price >= priceRange[0] && b.price <= priceRange[1]
    );

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
        result.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
    }

    return result;
  }, [searchQuery, selectedGenre, sortBy, priceRange]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <Reveal>
        <section
          className="relative overflow-hidden py-14 px-4"
          style={{
            background:
              "linear-gradient(135deg, var(--nav) 0%, #1a2a4a 60%, #0f1e38 100%)",
          }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, #f59e0b 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 40%)",
            }}
          />
          <div className="relative mx-auto max-w-[1400px]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={20} style={{ color: "var(--primary)" }} />
                  <span
                    className="text-sm font-semibold uppercase tracking-widest"
                    style={{ color: "var(--primary)" }}
                  >
                    Books
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight text-balance mb-3">
                  Discover Your Next
                  <br />
                  <span style={{ color: "var(--primary)" }}>Great Read</span>
                </h1>
                <p className="text-white/70 text-lg leading-relaxed max-w-md">
                  Bestsellers, award winners, and hidden gems across every genre. Free shipping on orders over $25.
                </p>
              </div>
              <div className="flex gap-4">
                {[
                  { value: "50K+", label: "Titles" },
                  { value: "4.7", label: "Avg Rating" },
                  { value: "Free", label: "Shipping $25+" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="text-center px-5 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10"
                  >
                    <div
                      className="text-2xl font-extrabold"
                      style={{ color: "var(--primary)" }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-xs text-white/60 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Featured Collections */}
      <Reveal>
        <section className="mx-auto max-w-[1400px] px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {FEATURED_COLLECTIONS.map((col, i) => (
              <motion.div
                key={col.title}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className={`relative overflow-hidden rounded-xl p-5 bg-gradient-to-br ${col.color} border border-black/5 cursor-pointer`}
                style={{
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)",
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div style={{ color: col.accent }} className="mb-2">
                      {col.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 text-base">{col.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{col.description}</p>
                  </div>
                  <span
                    className="text-xs font-bold px-2 py-1 rounded-full text-white"
                    style={{ backgroundColor: col.accent }}
                  >
                    {col.count}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Main Content */}
      <section className="mx-auto max-w-[1400px] px-4 pb-16">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside
            className={`lg:w-56 flex-shrink-0 ${filterOpen ? "block" : "hidden lg:block"}`}
          >
            <div
              className="bg-white rounded-xl border border-black/5 p-5 sticky top-20"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wide">
                  Filters
                </h2>
                <button
                  onClick={() => {
                    setSelectedGenre("All");
                    setPriceRange([0, 50]);
                    setSearchQuery("");
                  }}
                  className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
                >
                  Clear all
                </button>
              </div>

              {/* Genre Filter */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Genre
                </h3>
                <div className="flex flex-col gap-1">
                  {GENRES.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => setSelectedGenre(genre)}
                      className={`text-left text-sm px-3 py-1.5 rounded-lg transition-all duration-150 font-medium ${
                        selectedGenre === genre
                          ? "text-[var(--foreground)]"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                      style={
                        selectedGenre === genre
                          ? { backgroundColor: "var(--primary)" }
                          : {}
                      }
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Max Price
                </h3>
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={1}
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className="w-full accent-[var(--primary)]"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$0</span>
                  <span className="font-semibold text-gray-800">
                    Up to ${priceRange[1]}
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              {/* Search */}
              <div className="flex-1 min-w-[200px] relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books, authors..."
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white outline-none focus:border-[var(--primary)] transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2.5 text-sm rounded-xl border border-gray-200 bg-white outline-none focus:border-[var(--primary)] transition-colors cursor-pointer font-medium text-gray-700"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>

              {/* View toggle */}
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
                <button
                  onClick={() => setView("grid")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    view === "grid"
                      ? "text-[var(--foreground)]"
                      : "text-gray-400 hover:text-gray-700"
                  }`}
                  style={view === "grid" ? { backgroundColor: "var(--primary)" } : {}}
                  aria-label="Grid view"
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    view === "list"
                      ? "text-[var(--foreground)]"
                      : "text-gray-400 hover:text-gray-700"
                  }`}
                  style={view === "list" ? { backgroundColor: "var(--primary)" } : {}}
                  aria-label="List view"
                >
                  <List size={16} />
                </button>
              </div>

              {/* Mobile filter toggle */}
              <button
                onClick={() => setFilterOpen((o) => !o)}
                className="lg:hidden flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-xl border border-gray-200 bg-white text-gray-700"
              >
                <Filter size={15} />
                Filters
              </button>

              <span className="text-sm text-gray-500 ml-auto">
                {filtered.length} {filtered.length === 1 ? "book" : "books"}
              </span>
            </div>

            {/* Active filters */}
            {(selectedGenre !== "All" || priceRange[1] < 50 || searchQuery) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedGenre !== "All" && (
                  <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[var(--primary)]/10 text-gray-800 border border-[var(--primary)]/20">
                    {selectedGenre}
                    <button onClick={() => setSelectedGenre("All")}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {priceRange[1] < 50 && (
                  <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[var(--primary)]/10 text-gray-800 border border-[var(--primary)]/20">
                    Up to ${priceRange[1]}
                    <button onClick={() => setPriceRange([0, 50])}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[var(--primary)]/10 text-gray-800 border border-[var(--primary)]/20">
                    &ldquo;{searchQuery}&rdquo;
                    <button onClick={() => setSearchQuery("")}>
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Added to cart toast */}
            {addedId && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-white"
                style={{ backgroundColor: "#16a34a" }}
              >
                <ShoppingCart size={16} />
                Added to cart successfully!
              </motion.div>
            )}

            {/* Books grid/list */}
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-1">
                  No books found
                </h3>
                <p className="text-gray-400 text-sm">
                  Try adjusting your filters or search query.
                </p>
              </div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className={
                  view === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4"
                    : "flex flex-col gap-4"
                }
              >
                {filtered.map((book, i) => (
                  <motion.div key={book.id} variants={scaleIn}>
                    <BookCard
                      book={book}
                      view={view}
                      onAddToCart={handleAddToCart}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Reading Perks Banner */}
      <Reveal>
        <section
          className="py-12 px-4"
          style={{ backgroundColor: "var(--nav)" }}
        >
          <div className="mx-auto max-w-[1400px]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {[
                {
                  icon: "📦",
                  title: "Free Shipping",
                  desc: "On all book orders over $25",
                },
                {
                  icon: "🔄",
                  title: "Easy Returns",
                  desc: "30-day hassle-free returns",
                },
                {
                  icon: "⭐",
                  title: "Curated Selection",
                  desc: "Hand-picked by our editors",
                },
              ].map((perk) => (
                <div key={perk.title} className="flex flex-col items-center gap-2">
                  <span className="text-3xl">{perk.icon}</span>
                  <h3 className="font-bold text-white text-base">{perk.title}</h3>
                  <p className="text-sm text-white/60">{perk.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}