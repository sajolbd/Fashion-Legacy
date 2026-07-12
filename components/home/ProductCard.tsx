// components/home/ProductCard.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Eye } from "lucide-react";
import { Product, convertPrice, getCurrencySymbol } from "../../data/products";
import { useLanguage } from "../../context/LanguageContext";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  onOpenDetails?: (product: Product) => void;
}

export default function ProductCard({ product, onOpenDetails }: ProductCardProps) {
  const { language, currency, addToCart } = useLanguage();

  const originalPrice = product.priceUSD;
  const discountedPrice = originalPrice * (1 - product.discountPercent / 100);

  const activeName = language === "en" ? product.nameEn : product.nameBn;
  const currencySymbol = getCurrencySymbol(currency);
  const mainCategory = Array.isArray(product.category) ? product.category[0] : (product.category || "cat_hot");
  
  const displayActivePrice = convertPrice(discountedPrice, currency);
  const displayOriginalPrice = convertPrice(originalPrice, currency);

  // Quick Add handler (adds default first size/color)
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault(); // Stop Link navigation
    addToCart({
      id: `${product.id}-${product.sizes[0] || "one"}-${product.colors[0]?.nameEn || "default"}`,
      nameEn: product.nameEn,
      nameBn: product.nameBn,
      priceUSD: discountedPrice,
      image: product.images[0],
      size: product.sizes[0] || "One Size",
      colorEn: product.colors[0]?.nameEn || "Default",
      colorBn: product.colors[0]?.nameBn || "ডিফল্ট"
    });
  };

  return (
    <Link href={`/product/${product.id}`} className="block h-full">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full"
      >
        {/* Product Image Section */}
        <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden flex-shrink-0">
          <Image
            src={product.images[0]}
            alt={activeName}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Discount Badge */}
          {product.discountPercent > 0 && (
            <span className="absolute top-3 left-3 bg-[#740108] text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-md shadow-sm">
              -{product.discountPercent}%
            </span>
          )}

          {/* Hover Action Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <div 
              className="p-3 bg-white text-[#740108] hover:bg-[#740108] hover:text-white rounded-full transition-colors shadow-md"
              aria-label="View Details"
            >
              <Eye size={18} />
            </div>
            <button 
              onClick={handleQuickAdd}
              className="p-3 bg-[#740108] text-white hover:bg-[#5c0006] rounded-full transition-colors shadow-md"
              aria-label="Add to Cart"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>

        {/* Product Information Section */}
        <div className="p-4 flex flex-col flex-1 justify-between gap-2.5">
          <div className="space-y-1">
            {/* Category Tag */}
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              {language === "en" 
                ? mainCategory.replace("cat_", "").toUpperCase()
                : mainCategory === "cat_women" ? "মহিলাদের ফ্যাশন" : mainCategory === "cat_men" ? "পুরুষদের ফ্যাশন" : "হট সেল"}
            </span>

            {/* Product Title */}
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#740108] transition-colors line-clamp-2 leading-tight">
              {activeName}
            </h3>
          </div>

          <div>
            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={12} 
                    fill={i < Math.floor(product.rating) ? "currentColor" : "none"} 
                    className={i < Math.floor(product.rating) ? "text-amber-400" : "text-gray-200"}
                  />
                ))}
              </div>
              <span className="text-[11px] text-gray-400 font-bold">({product.reviewsCount})</span>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-2">
              <span className="text-base font-extrabold text-[#740108]">
                {currencySymbol}{displayActivePrice}
              </span>
              {product.discountPercent > 0 && (
                <span className="text-xs text-gray-400 line-through">
                  {currencySymbol}{displayOriginalPrice}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
