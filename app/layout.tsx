import type { Metadata } from "next";
import "./globals.css";
import LocaleProvider from "@/components/LocaleProvider";
import LanguageToggle from "@/components/LanguageToggle";

export const metadata: Metadata = {
  formatDetection: { telephone: false, date: false, email: false, address: false },
  title: "Generated Site",
  description: "Built with Atomic Builder",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LocaleProvider>
          {children}
          <LanguageToggle />
        </LocaleProvider>
      </body>
    </html>
  );
}
