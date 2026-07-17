"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Mail, Shield, Truck, RotateCcw, CreditCard } from 'lucide-react';
import { APP_NAME, footerLinks } from "@/lib/data";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export default function Footer() {
  const t = useTranslations();
  const pathname = usePathname();

  const resolveHref = (href: string) => {
    if (href.startsWith("#")) {
      return pathname === "/" ? href : `/${href}`;
    }
    return href;
  };

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#") && pathname === "/") {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const trustBadges = [
    { icon: <Shield size={20} />, label: t("footer.trust.secure") },
    { icon: <Truck size={20} />, label: t("footer.trust.shipping") },
    { icon: <RotateCcw size={20} />, label: t("footer.trust.returns") },
    { icon: <CreditCard size={20} />, label: t("footer.trust.payment") },
  ];

  return (
    <footer style={{ backgroundColor: "var(--nav)" }}>
      {/* Trust badges */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-[1400px] px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustBadges.map((badge, i) => (
              <div key={i} className="flex items-center gap-3 text-white/80">
                <span style={{ color: "var(--primary)" }}>{badge.icon}</span>
                <span className="text-sm font-medium">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="mx-auto max-w-[1400px] px-4 py-12"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <motion.div variants={fadeInUp}>
            <Link href="/" className="inline-flex items-center gap-1 mb-4">
              <span className="text-2xl font-extrabold" style={{ color: "var(--primary)" }}>Market</span>
              <span className="text-2xl font-extrabold text-white">Hub</span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              {t("footer.brand.description")}
            </p>
            <div className="flex items-center gap-2">
              <Mail size={16} style={{ color: "var(--primary)" }} />
              <a
                href="mailto:support@markethub.com"
                className="text-sm text-white/60 hover:text-white transition-colors duration-200"
              >
                support@markethub.com
              </a>
            </div>
          </motion.div>

          {/* Shop links */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t("footer.shop.title")}
            </h3>
            <ul className="flex flex-col gap-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={resolveHref(link.href)}
                    onClick={(e) => handleAnchorClick(e, link.href)}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Account links */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t("footer.account.title")}
            </h3>
            <ul className="flex flex-col gap-2">
              {footerLinks.account.map((link) => (
                <li key={link.href}>
                  <Link
                    href={resolveHref(link.href)}
                    onClick={(e) => handleAnchorClick(e, link.href)}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Help links */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t("footer.help.title")}
            </h3>
            <ul className="flex flex-col gap-2">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link
                    href={resolveHref(link.href)}
                    onClick={(e) => handleAnchorClick(e, link.href)}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1400px] px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/40">
            {t("footer.copyright", { year: "2024", name: APP_NAME })}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/40">{t("footer.paymentMethods")}</span>
            <div className="flex items-center gap-2">
              {["VISA", "MC", "AMEX", "PayPal"].map((method) => (
                <span
                  key={method}
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-white/20 text-white/50"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}