"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ShoppingCart, Star, ArrowRight, Truck, Shield, RotateCcw, Headphones, ChevronRight, Zap, TrendingUp, Award, Heart, Eye } from 'lucide-react';
import { useTranslations } from "next-intl";
import { APP_NAME, APP_CURRENCY_SYMBOL, CATEGORIES, MOCK_PRODUCTS } from "@/lib/data";
import { fadeInUp, fadeIn, staggerContainer, scaleIn, cardHover } from "@/lib/motion";
import { Reveal } from "@/components/Reveal";
import { useCart } from "@/lib/cart-context";

// ─── Inline data ────────────────────────────────────────────────────────────

const HERO_SLIDES = [
  {
    id: "h1",
    eyebrow: "New Arrivals",
    headline: "Sony WH-1000XM5",
    sub: "Industry-leading noise cancellation. 30-hour battery. Crystal-clear calls.",
    cta: "Shop Now",
    ctaHref: "/product/p1",
    badge: "20% OFF",
    image: "https://graphics.secondipity.com/B2C/5409336_1.jpg",
    accent: "#f59e0b",
  },
  {
    id: "h2",
    eyebrow: "Top Pick in Fashion",
    headline: "Premium Leather Jacket",
    sub: "Genuine leather, tailored fit. Built for every season and every occasion.",
    cta: "Explore Fashion",
    ctaHref: "/category/fashion",
    badge: "Free Shipping",
    image: "https://bobbyjones.com/cdn/shop/files/BJ312110_001_front_a.png?v=1749593908",
    accent: "#f59e0b",
  },
  {
    id: "h3",
    eyebrow: "Home & Kitchen",
    headline: "Instant Pot Duo 7-in-1",
    sub: "Pressure cook, slow cook, sauté, steam, and more — all in one pot.",
    cta: "Shop Kitchen",
    ctaHref: "/category/home-kitchen",
    badge: "Best Seller",
    image: "https://m.media-amazon.com/images/I/71Z401LjFFL._AC_UF894,1000_QL80_.jpg",
    accent: "#f59e0b",
  },
];

const FEATURED_PRODUCTS = [
  {
    id: "p1",
    name: "Sony WH-1000XM5 Headphones",
    price: 279.99,
    originalPrice: 349.99,
    image: "https://graphics.secondipity.com/B2C/5409336_1.jpg",
    rating: 4.8,
    reviewCount: 2341,
    badge: "Best Seller",
    category: "Electronics",
    categorySlug: "electronics",
    description: "Industry-leading noise cancellation with 30-hour battery life.",
    inStock: true,
  },
  {
    id: "p2",
    name: "Apple iPad Air 5th Gen",
    price: 599.99,
    originalPrice: 749.99,
    image: "https://cdsassets.apple.com/live/SZLF0YNV/images/sp/111887_sp866-ipad-air-5gen.png",
    rating: 4.9,
    reviewCount: 1872,
    badge: "Hot Deal",
    category: "Electronics",
    categorySlug: "electronics",
    description: "M1 chip, 10.9-inch Liquid Retina display, 5G capable.",
    inStock: true,
  },
  {
    id: "p3",
    name: "Nike Air Max 270 Sneakers",
    price: 129.99,
    originalPrice: 160.0,
    image: "https://static.nike.com/a/images/t_web_pdp_936_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/awjogtdnqxniqqk0wpgf/AIR+MAX+270.png",
    rating: 4.7,
    reviewCount: 3104,
    badge: "Trending",
    category: "Fashion",
    categorySlug: "fashion",
    description: "Max Air cushioning for all-day comfort and bold style.",
    inStock: true,
  },
  {
    id: "p4",
    name: "Instant Pot Duo 7-in-1",
    price: 79.99,
    originalPrice: 99.99,
    image: "https://m.media-amazon.com/images/I/71Z401LjFFL._AC_UF894,1000_QL80_.jpg",
    rating: 4.8,
    reviewCount: 5621,
    badge: "Top Rated",
    category: "Home & Kitchen",
    categorySlug: "home-kitchen",
    description: "7-in-1 multi-use programmable pressure cooker, 6 quart.",
    inStock: true,
  },
  {
    id: "p5",
    name: "Atomic Habits by James Clear",
    price: 14.99,
    originalPrice: 27.0,
    image: "https://m.media-amazon.com/images/I/81kg51XRc1L._AC_UF1000,1000_QL80_.jpg",
    rating: 4.9,
    reviewCount: 8903,
    badge: "Bestseller",
    category: "Books",
    categorySlug: "books",
    description: "The #1 New York Times bestseller on building good habits.",
    inStock: true,
  },
  {
    id: "p6",
    name: "Bowflex SelectTech 552 Dumbbells",
    price: 349.99,
    originalPrice: 429.99,
    image: "https://www.bowflex.com/on/demandware.static/-/Sites-nautilus-master-catalog/default/dwafb9bc5e/images/bowflex/selecttech/552/100131/bowflex-selecttech-552-dumbbell-set.png",
    rating: 4.7,
    reviewCount: 1456,
    badge: "Sale",
    category: "Sports",
    categorySlug: "sports",
    description: "Adjustable from 5 to 52.5 lbs. Replaces 15 sets of weights.",
    inStock: true,
  },
  {
    id: "p7",
    name: "Samsung 65\" QLED 4K TV",
    price: 897.99,
    originalPrice: 1199.99,
    image: "https://bjs.scene7.com/is/image/bjs/345905?$bjs-Zoom$",
    rating: 4.6,
    reviewCount: 987,
    badge: "Deal",
    category: "Electronics",
    categorySlug: "electronics",
    description: "Quantum HDR, 120Hz refresh rate, built-in Alexa.",
    inStock: true,
  },
  {
    id: "p8",
    name: "Levi's 501 Original Jeans",
    price: 59.99,
    originalPrice: 79.99,
    image: "https://static.wikia.nocookie.net/shingekinokyojin/images/b/b1/Levi_Ackermann_%28Anime%29_character_image.png/revision/latest?cb=20231105181307",
    rating: 4.5,
    reviewCount: 4231,
    badge: "Classic",
    category: "Fashion",
    categorySlug: "fashion",
    description: "The original straight fit jean. Iconic since 1873.",
    inStock: true,
  },
];

const DEALS_OF_DAY = [
  {
    id: "d1",
    name: "Logitech MX Master 3S Mouse",
    price: 69.99,
    originalPrice: 99.99,
    image: "https://resource.logitech.com/c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-3s/2025-update/mx-master-3s-bluetooth-edition-top-view-black-new-1.png",
    rating: 4.8,
    reviewCount: 2109,
    discount: 30,
    endsIn: "08:24:11",
    category: "Electronics",
    categorySlug: "electronics",
    inStock: true,
    description: "Ultra-fast scrolling, ergonomic design, 70-day battery.",
  },
  {
    id: "d2",
    name: "KitchenAid Stand Mixer",
    price: 279.99,
    originalPrice: 449.99,
    image: "https://assets.wsimgs.com/wsimgs/rk/images/dp/wcm/202611/0159/kitchenaid-artisan-stand-mixer-5-qt-o.jpg",
    rating: 4.9,
    reviewCount: 3872,
    discount: 38,
    endsIn: "08:24:11",
    category: "Home & Kitchen",
    categorySlug: "home-kitchen",
    inStock: true,
    description: "5-quart bowl, 10 speeds, tilt-head design.",
  },
  {
    id: "d3",
    name: "Adidas Ultraboost 22 Running Shoes",
    price: 119.99,
    originalPrice: 189.99,
    image: "https://www.kratzsports.biz/cdn/shop/products/GX3062.jpg?v=1645049766",
    rating: 4.7,
    reviewCount: 1654,
    discount: 37,
    endsIn: "08:24:11",
    category: "Sports",
    categorySlug: "sports",
    inStock: true,
    description: "Responsive Boost midsole, Primeknit upper, Continental rubber.",
  },
];

const TESTIMONIALS = [
  {
    id: "t1",
    name: "Sarah M.",
    location: "New York, NY",
    rating: 5,
    text: "MarketHub has completely replaced my Amazon habit. The prices are unbeatable and my orders always arrive ahead of schedule. The return process was painless when I needed it.",
    product: "Sony WH-1000XM5",
    avatar: "https://i.guim.co.uk/img/media/07501c52d82cda65e32e9d77f11027cedd17da6d/0_277_978_587/master/978.jpg?width=1200&quality=85&auto=format&fit=max&s=5f962721a70a37bc6a441ae94a5ad279",
  },
  {
    id: "t2",
    name: "James R.",
    location: "Austin, TX",
    rating: 5,
    text: "I ordered the Instant Pot and it arrived in two days. The packaging was perfect and the product was exactly as described. Will definitely be shopping here again.",
    product: "Instant Pot Duo 7-in-1",
    avatar: "https://static.wikia.nocookie.net/love-hip-hop/images/4/40/James-r_full.jpg/revision/latest?cb=20171113215458",
  },
  {
    id: "t3",
    name: "Priya K.",
    location: "San Francisco, CA",
    rating: 5,
    text: "The deals section is incredible. I saved over $150 on my last order. Customer support was responsive and helpful when I had a question about sizing.",
    product: "Nike Air Max 270",
    avatar: "https://media.licdn.com/dms/image/v2/D4D03AQFjb0oGgSOYPA/profile-displayphoto-shrink_200_200/B4DZZCoiL8G8AY-/0/1744874647031?e=2147483647&v=beta&t=iz-x6HzQIMtn31vtR_7FQLb0f3k09LJMyTJzm42hHDI",
  },
];

const VALUE_PROPS = [
  {
    icon: <Truck size={28} />,
    title: "Free 2-Day Shipping",
    desc: "On all orders over $35. Prime-speed delivery to your door, guaranteed.",
  },
  {
    icon: <Shield size={28} />,
    title: "Buyer Protection",
    desc: "Every purchase is covered. Shop with confidence knowing we have your back.",
  },
  {
    icon: <RotateCcw size={28} />,
    title: "30-Day Free Returns",
    desc: "Not satisfied? Return anything within 30 days, no questions asked.",
  },
  {
    icon: <Headphones size={28} />,
    title: "24/7 Support",
    desc: "Real humans, real help. Reach our team any time via chat, email, or phone.",
  },
];

const STATS = [
  { value: "2M+", label: "Happy Customers" },
  { value: "500K+", label: "Products Listed" },
  { value: "99.4%", label: "On-Time Delivery" },
  { value: "4.8", label: "Average Rating" },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={12}
            className={s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500">({count.toLocaleString("en-US")})</span>
    </div>
  );
}

function BadgePill({ label }: { label: string }) {
  return (
    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-400 text-gray-900">
      {label}
    </span>
  );
}

function ProductCard({
  product,
  delay = 0,
}: {
  product: (typeof FEATURED_PRODUCTS)[0];
  delay?: number;
}) {
  const { addItem } = useCart();
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const discount =
    product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const handleAdd = () => {
    addItem({
      product: {
        ...product,
        specs: undefined,
        images: undefined,
      },
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <Reveal delay={delay}>
      <motion.div
        variants={cardHover}
        initial="rest"
        whileHover="hover"
        className="group relative bg-white rounded-2xl border border-black/5 overflow-hidden flex flex-col"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)" }}
      >
        {/* Image */}
        <div className="relative overflow-hidden bg-gray-50 aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop";
            }}
          />
          {product.badge && (
            <div className="absolute top-3 left-3">
              <BadgePill label={product.badge} />
            </div>
          )}
          {discount > 0 && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              -{discount}%
            </div>
          )}
          <button
            onClick={() => setWished((w) => !w)}
            className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow transition-transform duration-200 hover:scale-110"
            aria-label="Add to wishlist"
          >
            <Heart
              size={15}
              className={wished ? "fill-red-500 text-red-500" : "text-gray-400"}
            />
          </button>
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 p-4 gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-500">
            {product.category}
          </p>
          <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
            {product.name}
          </h3>
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
            onClick={handleAdd}
            className="mt-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
            style={{
              backgroundColor: added ? "#22c55e" : "var(--primary, #f59e0b)",
              color: "#1a1a1a",
            }}
          >
            <ShoppingCart size={15} />
            {added ? "Added!" : "Add to Cart"}
          </motion.button>
        </div>
      </motion.div>
    </Reveal>
  );
}

function DealCard({ deal, delay = 0 }: { deal: (typeof DEALS_OF_DAY)[0]; delay?: number }) {
  const { addItem } = useCart();
  const [timeLeft, setTimeLeft] = useState("08:24:11");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleAdd = () => {
    addItem({
      product: {
        ...deal,
        specs: undefined,
        images: undefined,
      },
      quantity: 1,
    });
  };

  return (
    <Reveal delay={delay}>
      <motion.div
        variants={cardHover}
        initial="rest"
        whileHover="hover"
        className="bg-white rounded-2xl border border-black/5 overflow-hidden flex flex-col"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)" }}
      >
        <div className="relative bg-gray-50 aspect-video overflow-hidden">
          <img
            src={deal.image}
            alt={deal.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Zap size={11} />
            {deal.discount}% OFF
          </div>
        </div>
        <div className="p-4 flex flex-col gap-2 flex-1">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{deal.name}</h3>
          <p className="text-xs text-gray-500 line-clamp-1">{deal.description}</p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {APP_CURRENCY_SYMBOL}{deal.price.toFixed(2)}
            </span>
            <span className="text-sm text-gray-400 line-through">
              {APP_CURRENCY_SYMBOL}{deal.originalPrice.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="font-medium text-red-500">Ends in:</span>
            <span className="font-mono font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
              {timeLeft}
            </span>
          </div>
          <button
            onClick={handleAdd}
            className="mt-auto w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
            style={{ backgroundColor: "var(--primary, #f59e0b)", color: "#1a1a1a" }}
          >
            <ShoppingCart size={15} />
            Grab This Deal
          </button>
        </div>
      </motion.div>
    </Reveal>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function HomePage() {
  const t = useTranslations();
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");

  // Auto-advance hero
  useEffect(() => {
    const id = setInterval(() => {
      setActiveSlide((s) => (s + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const filteredProducts =
    activeCategory === "all"
      ? FEATURED_PRODUCTS
      : FEATURED_PRODUCTS.filter(
          (p) => p.categorySlug === activeCategory
        );

  const slide = HERO_SLIDES[activeSlide] ?? HERO_SLIDES[0];

  return (
    <main className="min-h-screen bg-[#f8f8f6]">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ backgroundColor: "#1a1a2e" }}>
        {/* Background image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <img
              src={slide.image}
              alt={slide.headline}
              className="w-full h-full object-cover opacity-20"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e] via-[#1a1a2e]/80 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="relative mx-auto max-w-[1400px] px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10">
          {/* Text */}
          <div className="flex-1 max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id + "-text"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-4"
              >
                <span
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full w-fit"
                  style={{ backgroundColor: "var(--primary, #f59e0b)", color: "#1a1a1a" }}
                >
                  <TrendingUp size={12} />
                  {slide.eyebrow}
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight text-balance">
                  {slide.headline}
                </h1>
                <p className="text-base md:text-lg text-white/70 leading-relaxed text-pretty max-w-md">
                  {slide.sub}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <Link
                    href={slide.ctaHref}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-90 hover:scale-105"
                    style={{ backgroundColor: "var(--primary, #f59e0b)", color: "#1a1a1a" }}
                  >
                    {slide.cta}
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/category/electronics"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border border-white/20 text-white hover:bg-white/10 transition-all duration-200"
                  >
                    Browse All
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Hero image panel */}
          <div className="flex-1 flex justify-center items-center max-w-sm md:max-w-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id + "-img"}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="relative w-72 h-72 md:w-96 md:h-96 rounded-3xl overflow-hidden border border-white/10"
                style={{ boxShadow: "0 8px 48px rgba(0,0,0,0.5)" }}
              >
                <img
                  src={slide.image}
                  alt={slide.headline}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop";
                  }}
                />
                <div className="absolute top-4 right-4 bg-amber-400 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full">
                  {slide.badge}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="relative flex justify-center gap-2 pb-6">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === activeSlide ? 28 : 8,
                height: 8,
                backgroundColor:
                  i === activeSlide ? "var(--primary, #f59e0b)" : "rgba(255,255,255,0.3)",
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────────────────── */}
      <Reveal>
        <section className="py-10 bg-white border-b border-gray-100">
          <div className="mx-auto max-w-[1400px] px-4">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {CATEGORIES.map((cat, i) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="flex-shrink-0 flex flex-col items-center gap-2 px-5 py-3 rounded-2xl border transition-all duration-200 hover:border-amber-400 hover:bg-amber-50 group"
                  style={{ borderColor: "#e5e7eb" }}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-amber-600 whitespace-nowrap">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── DEALS OF THE DAY ─────────────────────────────────────────────── */}
      <section id="deals" className="py-14 bg-[#f8f8f6]">
        <div className="mx-auto max-w-[1400px] px-4">
          <Reveal>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div
                  className="w-1 h-8 rounded-full"
                  style={{ backgroundColor: "var(--primary, #f59e0b)" }}
                />
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                    Deals of the Day
                  </h2>
                  <p className="text-sm text-gray-500">Limited-time offers. Don't miss out.</p>
                </div>
              </div>
              <Link
                href="/category/electronics"
                className="hidden sm:flex items-center gap-1 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
              >
                View All Deals <ChevronRight size={16} />
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEALS_OF_DAY.map((deal, i) => (
              <DealCard key={deal.id} deal={deal} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────────────────────── */}
      <section id="featured" className="py-14 bg-white">
        <div className="mx-auto max-w-[1400px] px-4">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div
                  className="w-1 h-8 rounded-full"
                  style={{ backgroundColor: "var(--primary, #f59e0b)" }}
                />
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                    Featured Products
                  </h2>
                  <p className="text-sm text-gray-500">Handpicked for quality and value</p>
                </div>
              </div>
              {/* Category filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  { label: "All", value: "all" },
                  { label: "Electronics", value: "electronics" },
                  { label: "Fashion", value: "fashion" },
                  { label: "Home & Kitchen", value: "home-kitchen" },
                  { label: "Books", value: "books" },
                  { label: "Sports", value: "sports" },
                ].map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveCategory(tab.value)}
                    className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                    style={{
                      backgroundColor:
                        activeCategory === tab.value ? "var(--primary, #f59e0b)" : "#f3f4f6",
                      color: activeCategory === tab.value ? "#1a1a1a" : "#6b7280",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} delay={i * 0.06} />
              ))}
            </AnimatePresence>
          </motion.div>

          <Reveal>
            <div className="flex justify-center mt-10">
              <Link
                href="/category/electronics"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm border-2 transition-all duration-200 hover:scale-105"
                style={{
                  borderColor: "var(--primary, #f59e0b)",
                  color: "var(--primary, #f59e0b)",
                }}
              >
                View All Products
                <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── VALUE PROPS ──────────────────────────────────────────────────── */}
      <section id="about" className="py-14 bg-[#f8f8f6]">
        <div className="mx-auto max-w-[1400px] px-4">
          <Reveal>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
                Why Shop at MarketHub?
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
                We built MarketHub to make online shopping faster, safer, and more rewarding than anywhere else.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUE_PROPS.map((vp, i) => (
              <Reveal key={vp.title} delay={i * 0.1}>
                <motion.div
                  variants={cardHover}
                  initial="rest"
                  whileHover="hover"
                  className="bg-white rounded-2xl p-6 flex flex-col gap-4 border border-black/5"
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)" }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "#fef3c7", color: "#d97706" }}
                  >
                    {vp.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{vp.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{vp.desc}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BANNER ─────────────────────────────────────────────────── */}
      <Reveal>
        <section
          className="py-14"
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          }}
        >
          <div className="mx-auto max-w-[1400px] px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex flex-col gap-1"
                >
                  <span
                    className="text-4xl md:text-5xl font-extrabold tracking-tight"
                    style={{ color: "var(--primary, #f59e0b)" }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-sm text-white/60 font-medium">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section id="reviews" className="py-14 bg-white">
        <div className="mx-auto max-w-[1400px] px-4">
          <Reveal>
            <div className="text-center mb-10">
              <span
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4"
                style={{ backgroundColor: "#fef3c7", color: "#d97706" }}
              >
                <Award size={12} />
                Verified Reviews
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
                Shoppers Love MarketHub
              </h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                Over 2 million customers trust us for their everyday shopping needs.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.id} delay={i * 0.12}>
                <motion.div
                  variants={cardHover}
                  initial="rest"
                  whileHover="hover"
                  className="bg-[#f8f8f6] rounded-2xl p-6 flex flex-col gap-4 border border-black/5"
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)" }}
                >
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed italic">"{t.text}"</p>
                  <div className="flex items-center gap-3 mt-auto pt-2 border-t border-gray-100">
                    <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm flex-shrink-0">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.location}</p>
                    </div>
                    <div className="ml-auto">
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        Bought: {t.product}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER / CTA ─────────────────────────────────────────────── */}
      <section id="contact" className="py-14 bg-[#f8f8f6]">
        <div className="mx-auto max-w-[1400px] px-4">
          <Reveal>
            <div
              className="rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)",
              }}
            >
              {/* Decorative glow */}
              <div
                className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-20 pointer-events-none"
                style={{
                  background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)",
                }}
              />

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight mb-3 text-balance">
                  Get Exclusive Deals in Your Inbox
                </h2>
                <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-md">
                  Subscribe to MarketHub and be the first to know about flash sales, new arrivals, and members-only discounts.
                </p>
              </div>

              <NewsletterForm />
            </div>
          </Reveal>
        </div>
      </section>
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
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-2 text-center"
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-2"
          style={{ backgroundColor: "var(--primary, #f59e0b)" }}
        >
          <Eye size={24} className="text-gray-900" />
        </div>
        <p className="text-white font-bold text-lg">You're on the list!</p>
        <p className="text-white/60 text-sm">Watch your inbox for exclusive deals.</p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 w-full md:w-auto md:min-w-[360px]"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        required
        className="flex-1 px-4 py-3 rounded-xl text-sm text-gray-900 bg-white outline-none focus:ring-2 focus:ring-amber-400 transition-all"
        aria-label="Email address"
      />
      <motion.button
        whileTap={{ scale: 0.97 }}
        type="submit"
        className="px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-90 whitespace-nowrap"
        style={{ backgroundColor: "var(--primary, #f59e0b)", color: "#1a1a1a" }}
      >
        Subscribe
      </motion.button>
    </form>
  );
}