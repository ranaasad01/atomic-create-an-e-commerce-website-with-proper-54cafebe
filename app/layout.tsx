import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LocaleProvider from "@/components/LocaleProvider";
import LanguageToggle from "@/components/LanguageToggle";
import { CartProvider } from "@/lib/cart-context";
import { ToastProvider } from "@/lib/toast-context";

export const metadata: Metadata = {
  formatDetection: { telephone: false, date: false, email: false, address: false },
  title: "MarketHub — Shop Everything, Delivered Fast",
  description:
    "MarketHub is your one-stop marketplace for Electronics, Fashion, Home & Kitchen, Books, and Sports. Great prices, fast shipping, and a seamless shopping experience.",
  keywords: "marketplace, electronics, fashion, home, books, sports, online shopping",
  openGraph: {
    title: "MarketHub — Shop Everything, Delivered Fast",
    description:
      "Your one-stop marketplace for Electronics, Fashion, Home & Kitchen, Books, and Sports.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LocaleProvider>
          <CartProvider>
            <ToastProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
              <LanguageToggle />
            </ToastProvider>
          </CartProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}