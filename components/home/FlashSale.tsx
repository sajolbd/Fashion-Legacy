// components/home/FlashSale.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import { Product, convertPrice, getCurrencySymbol, getProductImageUrl } from "../../data/products";
import { useLanguage } from "../../context/LanguageContext";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface FlashSaleProps {
  products: Product[];
  activeCategory?: string;
  onOpenDetails?: (product: Product) => void;
}

export default function FlashSale({ products, activeCategory = "all", onOpenDetails }: FlashSaleProps) {
  const { language, currency } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Countdown timer logic
  useEffect(() => {
    let targetTime = Date.now() + 4 * 3600 * 1000 + 32 * 60 * 1000; // fallback default: 4h 32m

    const rawUrl = 
      process.env.NEXT_PUBLIC_API_URL || 
      (typeof window !== "undefined"
        ? (window.location.hostname.includes("fashionlegacy.live") || window.location.hostname.includes("vercel.app")
            ? "https://fashion-legacy-backend.vercel.app" 
            : `http://${window.location.hostname}:5000`)
        : "http://localhost:5000");
    const apiBaseUrl = rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;

    // Load flash sale target from API
    fetch(`${apiBaseUrl}/api/flash-sale`)
      .then(res => res.json())
      .then(data => {
        if (data.flashSaleEnd) {
          const parsed = Date.parse(data.flashSaleEnd);
          if (!isNaN(parsed) && parsed > Date.now()) {
            targetTime = parsed;
          }
        }
      })
      .catch(err => {
        console.error("Failed to load flash sale from API", err);
      });

    const updateTimer = () => {
      const diff = targetTime - Date.now();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const hours = Math.floor(diff / 1000 / 60 / 60);
      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => {
    return num.toString().padStart(2, "0");
  };

  // Convert numbers to Bangla if active
  const toBanglaDigits = (numStr: string) => {
    if (language === "en") return numStr;
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return numStr.replace(/\d/g, (d) => banglaDigits[parseInt(d)]);
  };

  // Filter products that belong to the Flash Sale category (cat_flash)
  const flashSaleProducts = products.filter(prod => 
    Array.isArray(prod.category) ? prod.category.includes("cat_flash") : prod.category === "cat_flash"
  );

  // If a category tab is active, filter the flash sale products by that category
  const filteredProducts = activeCategory === "all"
    ? flashSaleProducts
    : flashSaleProducts.filter(prod => Array.isArray(prod.category) ? prod.category.includes(activeCategory) : prod.category === activeCategory);

  // Fallback if no products are in flash sale
  const flashSaleItems = filteredProducts.length > 0 
    ? filteredProducts.slice(0, 4) 
    : (activeCategory === "all" 
        ? products.slice(0, 4) 
        : products.filter(prod => Array.isArray(prod.category) ? prod.category.includes(activeCategory) : prod.category === activeCategory).slice(0, 4)
      );

  return (
    <section className="mb-12 space-y-6">
      {/* Header section with Timer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#D4A017] text-white p-2 rounded-xl flex items-center justify-center animate-pulse">
            <Zap size={20} fill="currentColor" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-black text-gray-900 tracking-tight uppercase flex items-center gap-2">
              <span>{language === "en" ? "Flash Sale" : "ফ্ল্যাশ সেল"}</span>
              <span className="text-xs font-bold bg-[#D4A017]/10 text-[#D4A017] px-2 py-0.5 rounded-full lowercase">
                {language === "en" ? "hot deals" : "হট ডিল"}
              </span>
            </h2>
          </div>
        </div>

        {/* Timer UI */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            {language === "en" ? "Ends In:" : "শেষ হবে:"}
          </span>
          <div className="flex items-center gap-1.5 font-mono text-sm font-extrabold text-white">
            <div className="bg-gray-900 px-3 py-1.5 rounded-lg shadow-sm">
              {toBanglaDigits(formatNumber(timeLeft.hours))}
            </div>
            <span className="text-gray-800 font-bold">:</span>
            <div className="bg-gray-900 px-3 py-1.5 rounded-lg shadow-sm">
              {toBanglaDigits(formatNumber(timeLeft.minutes))}
            </div>
            <span className="text-gray-800 font-bold">:</span>
            <div className="bg-gray-900 px-3 py-1.5 rounded-lg shadow-sm">
              {toBanglaDigits(formatNumber(timeLeft.seconds))}
            </div>
          </div>
        </div>
      </div>

      {/* Items Container Card */}
      <div className="bg-gradient-to-r from-red-50/50 via-amber-50/20 to-red-50/50 rounded-3xl p-6 md:p-8 border border-red-100/50 shadow-sm">
        {/* Flash Sale Items Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {flashSaleItems.map((item, index) => {
          const discountPrice = item.priceUSD * (1 - item.discountPercent / 100);
          const activeName = language === "en" ? item.nameEn : item.nameBn;
          const currencySymbol = getCurrencySymbol(currency);
          
          // Claim percentages
          const claimPercent = [78, 62, 91, 45][index];

          return (
            <Link key={item.id} href={`/product/${item.id}`} className="block">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all p-3 cursor-pointer flex flex-col justify-between h-full"
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden mb-3">
                  <Image
                    src={getProductImageUrl(item.images[0])}
                    alt={activeName}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-[#D4A017] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                    -{item.discountPercent}%
                  </span>
                </div>

                {/* Title & Price */}
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-gray-800 line-clamp-1">
                    {activeName}
                  </h3>

                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-extrabold text-[#D4A017]">
                      {currencySymbol}{convertPrice(discountPrice, currency)}
                    </span>
                    <span className="text-[10px] text-gray-400 line-through">
                      {currencySymbol}{convertPrice(item.priceUSD, currency)}
                    </span>
                  </div>

                  {/* Progress Claim Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] text-gray-400 font-bold">
                      <span>
                        {language === "en" 
                          ? `${claimPercent}% claimed` 
                          : `${toBanglaDigits(claimPercent.toString())}% বিক্রি হয়েছে`}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full"
                        style={{ width: `${claimPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
      </div>
    </section>
  );
}
