// app/page.tsx
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Container from "../components/shared/Container";
import { Product } from "../data/products";
import { useLanguage } from "../context/LanguageContext";
import ProductCard from "../components/home/ProductCard";
import FlashSale from "../components/home/FlashSale";
import { AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowUpDown } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#D4A017] border-t-transparent"></div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const { language, t, products, isLoadingProducts, categories: apiCategories } = useLanguage();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  // Navigation states
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popular");

  // Sync category state with query parameter
  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    } else {
      setActiveCategory("all");
    }
  }, [categoryParam]);

  if (isLoadingProducts) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#D4A017] border-t-transparent"></div>
      </div>
    );
  }

  const rawApiUrl = 
    process.env.NEXT_PUBLIC_API_URL || 
    (typeof window !== "undefined"
      ? (window.location.hostname.includes("fashionlegacy.live") || window.location.hostname.includes("vercel.app")
          ? "https://fashion-legacy-backend.vercel.app" 
          : `http://${window.location.hostname}:5000`)
      : "http://localhost:5000");
  const apiBaseUrl = rawApiUrl.endsWith("/") ? rawApiUrl.slice(0, -1) : rawApiUrl;

  // Fordeal circular category quick selectors mapped dynamically
  const categories = [
    { key: "all", labelEn: "All Items", labelBn: "সব পণ্য", image: "/images/categories/all.png" },
    ...apiCategories.map(cat => ({
      key: cat.id,
      labelEn: cat.nameEn,
      labelBn: cat.nameBn,
      image: cat.image && cat.image.startsWith("/") && !cat.image.startsWith("/images/")
        ? `${apiBaseUrl}${cat.image}`
        : (cat.image || "/images/categories/all.png")
    }))
  ];

  // Filter & Sort Products
  const filteredProducts = products.filter((prod) => {
    if (activeCategory === "all") return true;
    return Array.isArray(prod.category) ? prod.category.includes(activeCategory) : prod.category === activeCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aPriceDiscounted = a.priceUSD * (1 - a.discountPercent / 100);
    const bPriceDiscounted = b.priceUSD * (1 - b.discountPercent / 100);

    if (sortBy === "price_low") {
      return aPriceDiscounted - bPriceDiscounted;
    } else if (sortBy === "price_high") {
      return bPriceDiscounted - aPriceDiscounted;
    } else if (sortBy === "rating") {
      return b.rating - a.rating;
    } else {
      return b.reviewsCount - a.reviewsCount; // popular based on review counts
    }
  });

  return (
    <>
      <Container className="pt-2 md:pt-4">
        {/* 2. CIRCULAR CATEGORY QUICK SELECTORS */}
        <section className="mt-8 md:mt-12 mb-12">
          <div className="flex items-center justify-center gap-4 md:gap-8 overflow-x-auto py-4 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className="flex flex-col items-center gap-2 group flex-shrink-0 cursor-pointer"
              >
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center overflow-hidden transition-all shadow-sm ${
                  activeCategory === cat.key
                    ? "border-2 border-[#D4A017] scale-110 shadow-md ring-4 ring-red-50/80 bg-white"
                    : "bg-white border border-gray-100 hover:border-gray-300 hover:shadow-md group-hover:scale-105"
                }`}>
                  <img
                    src={cat.image}
                    alt={cat.labelEn}
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                      activeCategory === cat.key ? "scale-100" : "scale-95 group-hover:scale-100"
                    }`}
                  />
                </div>
                <span className={`text-[10px] md:text-xs font-bold transition-colors tracking-tight ${
                  activeCategory === cat.key ? "text-[#D4A017] font-black" : "text-gray-600 group-hover:text-gray-900"
                }`}>
                  {language === "en" ? cat.labelEn : cat.labelBn}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* 3. FLASH SALE Countdown Section */}
        <FlashSale products={products} activeCategory={activeCategory} />

        {/* 4. FILTERED PRODUCT SHOWCASE & SORTING */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <h2 className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-6 bg-[#D4A017] rounded" />
              <span>{language === "en" ? "Our Collections" : "আমাদের কালেকশন"}</span>
            </h2>

            {/* Sorting controls */}
            <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
              <span className="text-gray-400 font-bold flex items-center gap-1.5">
                <ArrowUpDown size={12} />
                {language === "en" ? "Sort By:" : "সর্ট করুন:"}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 font-bold text-gray-700 outline-none hover:border-gray-300 cursor-pointer shadow-sm"
              >
                <option value="popular">{language === "en" ? "Popularity" : "জনপ্রিয়তা"}</option>
                <option value="price_low">{language === "en" ? "Price: Low to High" : "মূল্য: কম থেকে বেশি"}</option>
                <option value="price_high">{language === "en" ? "Price: High to Low" : "মূল্য: বেশি থেকে কম"}</option>
                <option value="rating">{language === "en" ? "Customer Rating" : "গ্রাহক রেটিং"}</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <AnimatePresence>
              {sortedProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Empty state if no products */}
          {sortedProducts.length === 0 && (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag size={28} />
              </div>
              <h3 className="font-bold text-gray-800">
                {language === "en" ? "No products found" : "কোনো পণ্য পাওয়া যায়নি"}
              </h3>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                {language === "en" 
                  ? "We couldn't find any products in this category at the moment. Try selecting another one."
                  : "এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য নেই। অনুগ্রহ করে অন্য ক্যাটাগরি বেছে নিন।"}
              </p>
            </div>
          )}
        </section>
      </Container>

    </>
  );
}
