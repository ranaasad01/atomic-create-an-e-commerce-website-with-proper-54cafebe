"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Heart } from 'lucide-react';
import { useTranslations } from "next-intl";
import { APP_NAME, CATEGORIES } from "@/lib/data";
import { useCart } from "@/lib/cart-context";

export default function Navbar() {
  const t = useTranslations();
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      {/* Top bar */}
      <header
        className="sticky top-0 z-50 transition-shadow duration-300"
        style={{
          backgroundColor: "var(--nav)",
          boxShadow: scrolled ? "0 2px 12px rgba(0,0,0,0.25)" : "none",
        }}
      >
        {/* Main nav row */}
        <div className="mx-auto max-w-[1400px] px-4 flex items-center gap-3 h-14">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center gap-1 group"
            aria-label={t("nav.logoAlt")}
          >
            <span
              className="text-xl font-extrabold tracking-tight transition-colors duration-200"
              style={{ color: "var(--primary)" }}
            >
              Market
            </span>
            <span className="text-xl font-extrabold tracking-tight text-white">Hub</span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 flex items-center max-w-2xl mx-2">
            <div className="flex w-full rounded-lg overflow-hidden border-2 border-transparent focus-within:border-[var(--primary)] transition-colors duration-200">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("nav.searchPlaceholder")}
                className="flex-1 px-4 py-2 text-sm text-[var(--foreground)] bg-white outline-none"
                aria-label={t("nav.searchPlaceholder")}
              />
              <button
                type="submit"
                className="px-4 py-2 flex items-center justify-center transition-colors duration-200"
                style={{ backgroundColor: "var(--primary)" }}
                aria-label={t("nav.searchButton")}
              >
                <Search size={18} className="text-[var(--foreground)]" />
              </button>
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Link
              href="/account"
              className="flex flex-col items-center px-2 py-1 rounded text-white hover:text-[var(--accent)] transition-colors duration-200 text-xs"
              aria-label={t("nav.account")}
            >
              <User size={20} />
              <span className="hidden sm:block leading-none mt-0.5">{t("nav.account")}</span>
            </Link>
            <Link
              href="/account"
              className="flex flex-col items-center px-2 py-1 rounded text-white hover:text-[var(--accent)] transition-colors duration-200 text-xs"
              aria-label={t("nav.wishlist")}
            >
              <Heart size={20} />
              <span className="hidden sm:block leading-none mt-0.5">{t("nav.wishlist")}</span>
            </Link>
            <Link
              href="/cart"
              className="relative flex flex-col items-center px-2 py-1 rounded text-white hover:text-[var(--accent)] transition-colors duration-200 text-xs"
              aria-label={t("nav.cart")}
            >
              <div className="relative">
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center px-1"
                    style={{ backgroundColor: "var(--primary)", color: "var(--foreground)" }}
                  >
                    {totalItems > 99 ? "99+" : totalItems}
                  </motion.span>
                )}
              </div>
              <span className="hidden sm:block leading-none mt-0.5">{t("nav.cart")}</span>
            </Link>
            <button
              className="sm:hidden flex items-center justify-center p-2 text-white"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={t("nav.menu")}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Category bar */}
        <div
          className="hidden sm:block border-t"
          style={{ borderColor: "rgba(255,255,255,0.1)", backgroundColor: "var(--nav)" }}
        >
          <div className="mx-auto max-w-[1400px] px-4 flex items-center gap-1 h-10">
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium text-white hover:text-[var(--accent)] transition-colors duration-200"
              onClick={() => setCategoryOpen((v) => !v)}
              aria-expanded={categoryOpen}
            >
              <Menu size={16} />
              {t("nav.allCategories")}
              <ChevronDown size={14} className={`transition-transform duration-200 ${categoryOpen ? "rotate-180" : ""}`} />
            </button>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="px-3 py-1.5 rounded text-sm text-white hover:text-[var(--accent)] transition-colors duration-200 whitespace-nowrap"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="sm:hidden fixed top-14 left-0 right-0 z-40 overflow-hidden"
            style={{ backgroundColor: "var(--nav)" }}
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              <form onSubmit={handleSearch} className="flex mb-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("nav.searchPlaceholder")}
                  className="flex-1 px-3 py-2 text-sm rounded-l-lg outline-none text-[var(--foreground)]"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-r-lg"
                  style={{ backgroundColor: "var(--primary)" }}
                >
                  <Search size={16} className="text-[var(--foreground)]" />
                </button>
              </form>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="flex items-center gap-2 px-3 py-2 rounded text-white hover:bg-white/10 transition-colors duration-200 text-sm"
                >
                  <span>{cat.icon}</span>
                  {cat.name}
                </Link>
              ))}
              <div className="border-t border-white/10 mt-2 pt-2 flex flex-col gap-1">
                <Link href="/account" className="px-3 py-2 text-white hover:bg-white/10 rounded text-sm transition-colors">
                  {t("nav.account")}
                </Link>
                <Link href="/account/orders" className="px-3 py-2 text-white hover:bg-white/10 rounded text-sm transition-colors">
                  {t("nav.orders")}
                </Link>
                <Link href="/auth" className="px-3 py-2 text-white hover:bg-white/10 rounded text-sm transition-colors">
                  {t("nav.signIn")}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}