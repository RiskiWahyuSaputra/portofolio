import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Riski Wahyu Saputra | Web Developer",
  description:
    "Portfolio of Riski Wahyu Saputra — Web Developer specializing in Laravel, React, and modern web technologies.",
};

import SmoothScroll from "@/components/SmoothScroll";
import { LangProvider } from "@/components/LangContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} antialiased`}>
      <body className="min-h-full bg-[#050505] text-[#f5f5f5] font-sans">
        <LangProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </LangProvider>
      </body>
    </html>
  );
}
