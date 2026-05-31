import type { Metadata } from "next";
import { Outfit, Roboto_Flex } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import { LangProvider } from "@/components/LangContext";
import "./globals.css";

const siteUrl = "https://portofolio-eosin-alpha.vercel.app";
const siteTitle =
  "Riski Wahyu Saputra | IT Developer/Fullstack Web Developer Portfolio";
const siteDescription =
  "Portfolio Riski Wahyu Saputra, IT developer/Fullstack Web Developer yang membangun aplikasi web modern dengan Laravel, React, Next.js dan teknologi frontend interaktif.";
const ogImage = "/images/og-image.png";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const robotoFlex = Roboto_Flex({
  variable: "--font-roboto-flex",
  subsets: ["latin"],
  weight: "variable",
  axes: ["opsz"],
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
        width: 1906,
        height: 910,
        alt: "Riski Wahyu Saputra IT Developer/Fullstack Web Developer Portfolio",
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
    <html
      lang="en"
      className={`${outfit.variable} ${robotoFlex.variable} antialiased`}
    >
      <body className="min-h-full bg-[#050505] text-[#f5f5f5] font-sans">
        <LangProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </LangProvider>
      </body>
    </html>
  );
}
