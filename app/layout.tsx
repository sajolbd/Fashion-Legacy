// app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";

import { Josefin_Sans } from "next/font/google";
import { Providers } from "./providers";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-josefin-sans",
});

const siteUrl = "https://fashionlegacy.live/";
const ogImageUrl = `${siteUrl}/opengraph-image.jpeg`;

/* ---------------- METADATA ---------------- */

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Fashion Legacy | Premium Fashion Destination",
  description: "Explore the legacy of premium fashion with our curated collection of outfits, footwear, and accessories.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "Fashion Legacy | Premium Fashion Destination",
    description: "Explore the legacy of premium fashion with our curated collection of outfits, footwear, and accessories.",
    url: siteUrl,
    siteName: "Fashion Legacy",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Fashion Legacy Storefront",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fashion Legacy | Premium Fashion Destination",
    description: "Explore the legacy of premium fashion with our curated collection of outfits, footwear, and accessories.",
    images: [ogImageUrl],
  },
};

/* ---------------- ROOT LAYOUT ---------------- */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={josefinSans.variable}>
      <body className="min-h-screen overflow-x-hidden bg-gray-50/10">
        {/* NoScript Fallback */}
        <noscript>
          <style>
            {`
              * {
                opacity: 1 !important;
                transform: none !important;
              }
            `}
          </style>
        </noscript>

        <Providers>
          <Header />
          <main className="min-h-screen pt-16 md:pt-20">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}


