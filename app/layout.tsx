import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import { LangProvider } from "@/components/LangContext";
import "./globals.css";

const siteUrl = "https://portofolio-eosin-alpha.vercel.app";
const siteTitle = "Riski Wahyu Saputra | Web Developer Portfolio";
const siteDescription =
  "Portfolio Riski Wahyu Saputra, web developer yang membangun aplikasi web modern dengan Laravel, React, dan teknologi frontend interaktif.";
const ogImage = "/sequence/ezgif-frame-001.jpg";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "/",
    siteName: "Riski Wahyu Saputra Portfolio",
    images: [
      {
        url: ogImage,
        width: 1920,
        height: 1080,
        alt: "Riski Wahyu Saputra Web Developer Portfolio",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImage],
  },
};

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
