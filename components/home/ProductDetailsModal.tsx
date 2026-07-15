// components/home/ProductDetailsModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { X, Star, Plus, Minus, ShoppingCart, Truck, ShieldCheck, RefreshCw } from "lucide-react";
import { Product, convertPrice, getCurrencySymbol } from "../../data/products";
import { useLanguage } from "../../context/LanguageContext";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailsModal({ product, isOpen, onClose }: ProductDetailsModalProps) {
  const { language, currency, addToCart } = useLanguage();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "features">("desc");

  // Reset variant selections when a new product is loaded
  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setSelectedSize(product.sizes[0] || "");
      setSelectedColorIndex(0);
      setQuantity(1);
      setActiveTab("desc");
    }
  }, [product]);

  if (!product) return null;

  const originalPrice = product.priceUSD;
  const discountedPrice = originalPrice * (1 - product.discountPercent / 100);

  const activeName = language === "en" ? product.nameEn : product.nameBn;
  const activeDesc = language === "en" ? product.descriptionEn : product.descriptionBn;
  const currencySymbol = getCurrencySymbol(currency);

  const displayActivePrice = convertPrice(discountedPrice, currency);
  const displayOriginalPrice = convertPrice(originalPrice, currency);

  const activeColor = product.colors[selectedColorIndex];

  // Add to Cart handler
  const handleAddToCart = () => {
    // Unique ID for variant: productID-size-colorNameEn
    const variantId = `${product.id}-${selectedSize || "one"}-${activeColor?.nameEn || "default"}`;
    
    addToCart({
      id: variantId,
      nameEn: product.nameEn,
      nameBn: product.nameBn,
      priceUSD: discountedPrice,
      image: product.images[activeImageIndex] || product.images[0],
      size: selectedSize || "One Size",
      colorEn: activeColor?.nameEn || "Default",
      colorBn: activeColor?.nameBn || "ডিফল্ট",
    });

    onClose(); // Close details slide-over after adding
  };

  const toBanglaDigits = (numStr: string) => {
    if (language === "en") return numStr;
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return numStr.replace(/\d/g, (d) => banglaDigits[parseInt(d)]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 pointer-events-auto"
          />

          {/* Slide-over Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col pointer-events-auto overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-10">
              <h3 className="font-extrabold text-gray-900 text-lg uppercase tracking-tight">
                {language === "en" ? "Product Details" : "পণ্য বিবরণী"}
              </h3>
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-gray-400 hover:text-gray-800 rounded-full hover:bg-gray-50 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-6 space-y-8">
              {/* Product Gallery Section */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-10 relative aspect-[4/5] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                  <Image
                    src={product.images[activeImageIndex]}
                    alt={activeName}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  {product.discountPercent > 0 && (
                    <span className="absolute top-4 left-4 bg-[#D4A017] text-white text-xs font-black px-2.5 py-1 rounded-md shadow-sm">
                      -{product.discountPercent}% OFF
                    </span>
                  )}
                </div>

                {/* Image Thumbnails Selector */}
                <div className="md:col-span-2 flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-20 md:w-full aspect-[4/5] bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                        activeImageIndex === idx ? "border-[#D4A017] shadow" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`thumbnail-${idx}`}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Core Details */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 leading-tight">
                    {activeName}
                  </h2>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                          className={i < Math.floor(product.rating) ? "text-amber-400" : "text-gray-200"}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 font-bold">
                      {toBanglaDigits(product.rating.toFixed(1))} ({toBanglaDigits(product.reviewsCount.toString())} {language === "en" ? "reviews" : "রিভিউ"})
                    </span>
                  </div>
                </div>

                {/* Pricing section */}
                <div className="flex items-baseline gap-3 py-3 border-y border-gray-100 bg-gray-50/50 px-4 rounded-xl">
                  <span className="text-2xl font-extrabold text-[#D4A017]">
                    {currencySymbol}{displayActivePrice}
                  </span>
                  {product.discountPercent > 0 && (
                    <span className="text-sm text-gray-400 line-through">
                      {currencySymbol}{displayOriginalPrice}
                    </span>
                  )}
                </div>
              </div>

              {/* Variant Selections (Size & Color) */}
              <div className="space-y-6">
                {/* Size Selector */}
                {product.sizes.length > 0 && product.sizes[0] !== "One Size" && (
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {language === "en" ? "Select Size" : "সাইজ নির্বাচন করুন"}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[48px] h-10 px-3 border rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                            selectedSize === size
                              ? "border-[#D4A017] bg-red-50 text-[#D4A017] shadow-sm"
                              : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selector */}
                {product.colors.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        {language === "en" ? "Select Color" : "রঙ নির্বাচন করুন"}
                      </span>
                      <span className="text-xs font-bold text-gray-800">
                        {language === "en" ? activeColor?.nameEn : activeColor?.nameBn}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {product.colors.map((color, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedColorIndex(idx)}
                          className={`relative w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                            selectedColorIndex === idx ? "border-[#D4A017] scale-110 shadow-sm" : "border-transparent hover:scale-105"
                          }`}
                        >
                          <span
                            className="w-full h-full rounded-full border border-black/10 shadow-inner"
                            style={{ backgroundColor: color.hex }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity selector */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {language === "en" ? "Quantity" : "পরিমাণ"}
                  </span>
                  <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 w-32 overflow-hidden h-11">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="flex-1 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center font-extrabold text-sm text-gray-800 font-mono">
                      {toBanglaDigits(quantity.toString())}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="flex-1 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabs Section (Description, Features) */}
              <div className="space-y-4">
                <div className="flex border-b border-gray-100">
                  <button
                    onClick={() => setActiveTab("desc")}
                    className={`pb-3 text-sm font-bold border-b-2 px-4 transition-colors ${
                      activeTab === "desc"
                        ? "border-[#D4A017] text-[#D4A017]"
                        : "border-transparent text-gray-400 hover:text-gray-700"
                    }`}
                  >
                    {language === "en" ? "Description" : "বর্ণনা"}
                  </button>
                  <button
                    onClick={() => setActiveTab("features")}
                    className={`pb-3 text-sm font-bold border-b-2 px-4 transition-colors ${
                      activeTab === "features"
                        ? "border-[#D4A017] text-[#D4A017]"
                        : "border-transparent text-gray-400 hover:text-gray-700"
                    }`}
                  >
                    {language === "en" ? "Key Features" : "প্রধান বৈশিষ্ট্যসমূহ"}
                  </button>
                </div>

                <div className="text-sm text-gray-600 leading-relaxed px-2">
                  {activeTab === "desc" ? (
                    <p>{activeDesc}</p>
                  ) : (
                    <ul className="list-disc list-inside space-y-2 font-medium">
                      {(language === "en" ? product.featuresEn : product.featuresBn).map((feat, i) => (
                        <li key={i}>{feat}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Shipping & Support badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-gray-100 text-xs font-semibold text-gray-500">
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl">
                  <Truck size={16} className="text-[#D4A017]" />
                  <span>
                    {language === "en" ? "Free Global Shipping" : "ফ্রি বৈশ্বিক শিপিং"}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl">
                  <ShieldCheck size={16} className="text-green-600" />
                  <span>
                    {language === "en" ? "100% Quality Secure" : "১০০% মান সুরক্ষিত"}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl">
                  <RefreshCw size={16} className="text-blue-600" />
                  <span>
                    {language === "en" ? "Easy 7-Day Returns" : "৭ দিনে সহজ রিটার্ন"}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Cart Trigger */}
            <div className="p-6 border-t border-gray-100 sticky bottom-0 bg-white/95 backdrop-blur flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#D4A017] hover:bg-[#5c0006] text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2.5 shadow-lg shadow-red-500/10 hover:shadow-red-500/20 transition-all group"
              >
                <ShoppingCart size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                <span>
                  {language === "en" ? "ADD TO CART" : "কার্টে যোগ করুন"}
                </span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
