// app/product/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import Container from "../../../components/shared/Container";
import { convertPrice, getCurrencySymbol } from "../../../data/products";
import { useLanguage } from "../../../context/LanguageContext";
import ProductCard from "../../../components/home/ProductCard";
import Image from "next/image";
import { Star, Plus, Minus, ShoppingCart, Truck, ShieldCheck, RefreshCw, HelpCircle, ChevronUp, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductDetailPage() {
  const { language, currency, addToCart, products, isLoadingProducts } = useLanguage();
  const params = useParams();
  const id = params.id as string;
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "features">("desc");

  // Find product
  const product = products.find((p) => p.id === id);

  // Reset states on product change
  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setSelectedSize(product.sizes[0] || "");
      setSelectedColorIndex(0);
      setQuantity(1);
      setActiveTab("desc");
    }
  }, [product]);

  if (isLoadingProducts) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#740108] border-t-transparent"></div>
      </div>
    );
  }

  // Fallback if not found
  if (!product) {
    notFound();
  }

  const originalPrice = product.priceUSD;
  const discountedPrice = originalPrice * (1 - product.discountPercent / 100);

  const activeName = language === "en" ? product.nameEn : product.nameBn;
  const activeDesc = language === "en" ? product.descriptionEn : product.descriptionBn;
  const currencySymbol = getCurrencySymbol(currency);

  const displayActivePrice = convertPrice(discountedPrice, currency);
  const displayOriginalPrice = convertPrice(originalPrice, currency);

  const activeColor = product.colors[selectedColorIndex];

  // Add to cart action
  const handleAddToCart = () => {
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
  };

  const toBanglaDigits = (numStr: string) => {
    if (language === "en") return numStr;
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return numStr.replace(/\d/g, (d) => banglaDigits[parseInt(d)]);
  };

  // Get related products (sharing at least one category)
  const relatedProducts = products.filter((p) => {
    if (p.id === product.id) return false;
    const pCats = Array.isArray(p.category) ? p.category : [p.category || "cat_hot"];
    const prodCats = Array.isArray(product.category) ? product.category : [product.category || "cat_hot"];
    return pCats.some(cat => prodCats.includes(cat));
  }).slice(0, 4);

  return (
    <Container className="pt-6">
      {/* 3-COLUMN DETAIL LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
        
        {/* LEFT COLUMN: Vertical Thumbnails (Desktop: 2 columns, Mobile: Row at bottom/none) */}
        <div className="hidden lg:col-span-1 lg:flex lg:flex-col gap-2 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
          {product.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`relative aspect-[3/4] w-full rounded-lg overflow-hidden border-2 bg-gray-50 flex-shrink-0 transition-all ${
                activeImageIndex === idx ? "border-[#740108] shadow-sm" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`thumb-${idx}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {/* MIDDLE COLUMN: Main Large Image */}
        <div className="col-span-1 lg:col-span-6 relative aspect-[3/4] max-h-[600px] rounded-3xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
          <Image
            src={product.images[activeImageIndex]}
            alt={activeName}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          {product.discountPercent > 0 && (
            <span className="absolute top-4 left-4 bg-[#740108] text-white text-xs font-black px-3 py-1.5 rounded-lg shadow-md">
              -{product.discountPercent}% OFF
            </span>
          )}
        </div>

        {/* MOBILE LAYOUT ONLY: Horizontal Thumbnails */}
        <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 scrollbar-none">
          {product.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 bg-gray-50 transition-all ${
                activeImageIndex === idx ? "border-[#740108]" : "border-transparent opacity-75"
              }`}
            >
              <Image
                src={img}
                alt={`thumb-mobile-${idx}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {/* RIGHT COLUMN: Options and Purchase Section */}
        <div className="col-span-1 lg:col-span-5 space-y-6">
          <div className="space-y-2">
            {/* Title & SKU */}
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
              {activeName}
            </h1>
            <div className="flex items-center gap-2 text-xs text-gray-400 font-bold">
              <span>SKU: {product.id.replace("prod-", "399673")}</span>
              <span>•</span>
              <span className="text-gray-500">
                {language === "en" ? "Sold 100+" : "১০০+ বিক্রি হয়েছে"}
              </span>
            </div>

            {/* Ratings */}
            <div className="flex items-center gap-1.5 pt-1">
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
                {toBanglaDigits(product.rating.toFixed(1))} ({toBanglaDigits(product.reviewsCount.toString())})
              </span>
            </div>
          </div>

          {/* Pricing Display */}
          <div className="flex items-baseline gap-3 py-4 border-y border-gray-100">
            <span className="text-2xl font-black text-[#740108]">
              {displayActivePrice} {currencySymbol}
            </span>
            {product.discountPercent > 0 && (
              <span className="text-sm text-gray-400 line-through">
                {displayOriginalPrice} {currencySymbol}
              </span>
            )}
          </div>

          {/* Style selector (thumbnails in style row, matches screenshot) */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              {language === "en" ? "Style" : "স্টাইল"}
            </span>
            <div className="flex flex-wrap gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-12 h-16 rounded-md overflow-hidden border-2 bg-gray-50 transition-all ${
                    activeImageIndex === idx ? "border-[#740108] scale-105 shadow-sm" : "border-gray-200 opacity-80 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`style-${idx}`}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Sizes Selector */}
          {product.sizes.length > 0 && product.sizes[0] !== "One Size" && (
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                {language === "en" ? "Size" : "সাইজ"}
              </span>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-9 px-4 border rounded-lg font-bold text-xs flex items-center justify-center transition-all ${
                      selectedSize === size
                        ? "border-[#740108] bg-red-50 text-[#740108]"
                        : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Size Guide */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 w-28 overflow-hidden h-9">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex-1 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
              >
                <Minus size={12} />
              </button>
              <span className="w-8 text-center font-extrabold text-xs text-gray-800 font-mono">
                {toBanglaDigits(quantity.toString())}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="flex-1 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
              >
                <Plus size={12} />
              </button>
            </div>

            <button className="text-xs text-gray-500 hover:text-gray-900 font-bold flex items-center gap-1">
              <HelpCircle size={14} className="text-gray-400" />
              <span>
                {language === "en" ? "What's My Size?" : "সাইজ গাইড"}
              </span>
            </button>
          </div>

          {/* Yellow Action Button (Matches Screenshot style/color) */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-[#FFE353] hover:bg-[#FDD835] text-gray-900 h-12 rounded-full font-black text-sm tracking-wide shadow-md transition-all uppercase flex items-center justify-center gap-2"
          >
            <ShoppingCart size={16} />
            <span>
              {language === "en" ? "ADD TO CART" : "কার্টে যোগ করুন"}
            </span>
          </button>

          {/* Return Policy banner */}
          <div className="flex items-center justify-between bg-gray-50 border border-gray-100 p-3.5 rounded-xl text-[11px] font-bold text-gray-600 cursor-pointer hover:bg-gray-100/70 transition-colors">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-gray-200 text-gray-700 flex items-center justify-center rounded-full text-[9px] font-black">15</span>
              <span>
                {language === "en" 
                  ? "This item supports free return/exchange within 15days"
                  : "এই পণ্যটি ১৫ দিনের মধ্যে বিনামূল্যে ফেরত/বিনিময়যোগ্য"}
              </span>
            </div>
            <span className="text-gray-400 font-black font-mono text-xs hover:translate-x-0.5 transition-transform">&gt;</span>
          </div>

        </div>
      </div>

      {/* TABS SECTION: Description & Features */}
      <div className="border-t border-gray-100 pt-10 mb-16 space-y-4">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab("desc")}
            className={`pb-3.5 text-sm font-bold border-b-2 px-6 transition-colors ${
              activeTab === "desc"
                ? "border-[#740108] text-[#740108]"
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            {language === "en" ? "Product Description" : "পণ্য বিবরণ"}
          </button>
          <button
            onClick={() => setActiveTab("features")}
            className={`pb-3.5 text-sm font-bold border-b-2 px-6 transition-colors ${
              activeTab === "features"
                ? "border-[#740108] text-[#740108]"
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            {language === "en" ? "Specifications" : "বৈশিষ্ট্যসমূহ"}
          </button>
        </div>

        <div className="text-sm text-gray-600 leading-relaxed max-w-3xl pt-2">
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

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <h2 className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-6 bg-[#740108] rounded" />
              <span>{language === "en" ? "You May Also Like" : "অন্যান্য পছন্দসমূহ"}</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onOpenDetails={() => {}} // clicking navigates anyway due to default card Link wrapper
              />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
