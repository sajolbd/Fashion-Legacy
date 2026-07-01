"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";
import { 
  Search, 
  ShoppingCart, 
  Menu, 
  X, 
  Globe, 
  ChevronDown, 
  Plus, 
  Minus, 
  Trash2, 
  Check, 
  ArrowRight,
  HelpCircle,
  Truck,
  Heart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Mock Cart Item Type
interface CartItem {
  id: string;
  nameEn: string;
  nameBn: string;
  priceUSD: number;
  image: string;
  quantity: number;
  size: string;
  colorEn: string;
  colorBn: string;
}

// SVG Flag Components
function USFlag({ className = "w-5 h-3.5" }: { className?: string }) {
  return (
    <svg className={`${className} rounded-sm object-cover`} viewBox="0 0 74 39" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="74" height="39" rx="1" fill="#3c3b6e" />
      <g fill="#b22234">
        <rect width="74" height="3" y="0" />
        <rect width="74" height="3" y="6" />
        <rect width="74" height="3" y="12" />
        <rect width="74" height="3" y="18" />
        <rect width="74" height="3" y="24" />
        <rect width="74" height="3" y="30" />
        <rect width="74" height="3" y="36" />
      </g>
      <g fill="#ffffff">
        <rect width="74" height="3" y="3" />
        <rect width="74" height="3" y="9" />
        <rect width="74" height="3" y="15" />
        <rect width="74" height="3" y="21" />
        <rect width="74" height="3" y="27" />
        <rect width="74" height="3" y="33" />
      </g>
      <rect width="29.6" height="21" fill="#3c3b6e" />
      <g fill="#ffffff">
        <circle cx="3" cy="3" r="0.7" />
        <circle cx="8.9" cy="3" r="0.7" />
        <circle cx="14.8" cy="3" r="0.7" />
        <circle cx="20.7" cy="3" r="0.7" />
        <circle cx="26.6" cy="3" r="0.7" />
        <circle cx="5.9" cy="6" r="0.7" />
        <circle cx="11.8" cy="6" r="0.7" />
        <circle cx="17.7" cy="6" r="0.7" />
        <circle cx="23.6" cy="6" r="0.7" />
        <circle cx="3" cy="9" r="0.7" />
        <circle cx="8.9" cy="9" r="0.7" />
        <circle cx="14.8" cy="9" r="0.7" />
        <circle cx="20.7" cy="9" r="0.7" />
        <circle cx="26.6" cy="9" r="0.7" />
        <circle cx="5.9" cy="12" r="0.7" />
        <circle cx="11.8" cy="12" r="0.7" />
        <circle cx="17.7" cy="12" r="0.7" />
        <circle cx="23.6" cy="12" r="0.7" />
        <circle cx="3" cy="15" r="0.7" />
        <circle cx="8.9" cy="15" r="0.7" />
        <circle cx="14.8" cy="15" r="0.7" />
        <circle cx="20.7" cy="15" r="0.7" />
        <circle cx="26.6" cy="15" r="0.7" />
        <circle cx="5.9" cy="18" r="0.7" />
        <circle cx="11.8" cy="18" r="0.7" />
        <circle cx="17.7" cy="18" r="0.7" />
        <circle cx="23.6" cy="18" r="0.7" />
      </g>
    </svg>
  );
}

function BDFlag({ className = "w-5 h-3.5" }: { className?: string }) {
  return (
    <svg className={`${className} rounded-sm object-cover`} viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="60" rx="1" fill="#006a4e" />
      <circle cx="45" cy="30" r="20" fill="#f42a41" />
    </svg>
  );
}

// Currency Symbol & Conversion Rates (Base: USD)
const CURRENCIES = [
  { code: "USD", symbol: "$", rate: 1, label: "USD ($)" },
  { code: "BDT", symbol: "৳", rate: 120, label: "BDT (৳)" },
  { code: "SAR", symbol: "SR", rate: 3.75, label: "SAR (SR)" }
] as const;

export default function Header() {
  const { 
    language, 
    setLanguage, 
    currency, 
    setCurrency, 
    t,
    cartItems,
    removeFromCart,
    updateQuantity,
    isCartOpen,
    setIsCartOpen
  } = useLanguage();
  
  // Drawer States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Dropdown States
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isCurrDropdownOpen, setIsCurrDropdownOpen] = useState(false);

  // Hover state for Home submenu
  const [isHomeHovered, setIsHomeHovered] = useState(false);

  // Submenu configuration (Fordeal categories)
  const homeSubmenuItems = [
    { key: "cat_hot", href: "/?category=cat_hot", tagEn: "HOT", tagBn: "হট" },
    { key: "cat_women", href: "/?category=cat_women", tagEn: "TREND", tagBn: "ট্রেন্ড" },
    { key: "cat_men", href: "/?category=cat_men", tagEn: "NEW", tagBn: "নতুন" },
    { key: "cat_shoes", href: "/?category=cat_shoes", tagEn: "50% OFF", tagBn: "৫০% ছাড়" },
    { key: "cat_kids", href: "/?category=cat_kids", tagEn: "KIDS", tagBn: "কিডস" },
    { key: "cat_watches", href: "/?category=cat_watches", tagEn: "LUXE", tagBn: "লাক্স" },
  ];
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Refs for closing dropdowns on click outside
  const langRef = useRef<HTMLDivElement>(null);
  const currRef = useRef<HTMLDivElement>(null);

  // Click outside listener for dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
      if (currRef.current && !currRef.current.contains(event.target as Node)) {
        setIsCurrDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when search bar opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Prevent scroll when drawers are open
  useEffect(() => {
    if (isMobileMenuOpen || isCartOpen || isSearchOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isMobileMenuOpen, isCartOpen, isSearchOpen]);

  // Helper: Currency Converter
  const getCurrencySymbol = () => {
    const currObj = CURRENCIES.find(c => c.code === currency);
    return currObj ? currObj.symbol : "$";
  };

  const convertPrice = (usdAmount: number) => {
    const currObj = CURRENCIES.find(c => c.code === currency);
    const rate = currObj ? currObj.rate : 1;
    return (usdAmount * rate).toFixed(2);
  };

  const totalCartQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.priceUSD * item.quantity), 0);






  return (
    <>
      {/* 2. MAIN NAVIGATION HEADER */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            
            {/* Left Section: Hamburger (Mobile) & Logo */}
            <div className="flex items-center gap-4">
              {/* Mobile Hamburger Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 -ml-2 text-gray-800 hover:text-[#740108] transition-colors"
                aria-label="Toggle Menu"
              >
                <Menu size={24} />
              </button>

              {/* Logo Container */}
              <Link href="/" className="flex items-center gap-2.5 h-full">
                {/* Crest Emblem - Cropped visually using overflow-hidden + object-cover + object-left */}
                <div className="relative h-auto w-36  md:w-64 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <Image
                    src="/images/logo.png"
                    alt="Fashion Legacy Emblem"
                    width={1000}
                    height={800}
                    className="object-contain"
                  />
                </div>
                
              </Link>
            </div>

            {/* Middle Section: Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 font-medium text-gray-800 z-50">
              <div 
                className="relative py-2 group cursor-pointer"
                onMouseEnter={() => setIsHomeHovered(true)}
                onMouseLeave={() => setIsHomeHovered(false)}
              >
                <div className="flex items-center gap-1 hover:text-[#740108] transition-colors">
                  <span>{t("home")}</span>
                  <ChevronDown size={14} className="text-gray-400 group-hover:text-[#740108] transition-transform group-hover:rotate-180 duration-200" />
                </div>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#740108] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
                
                {/* Dropdown Menu Wrapper with Soft Animation */}
                <AnimatePresence>
                  {isHomeHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute left-0 mt-3 w-[400px] bg-white border border-gray-100 rounded-2xl shadow-2xl p-4 z-50 grid grid-cols-2 gap-x-6 gap-y-2.5"
                    >
                      {homeSubmenuItems.map((item) => (
                        <Link 
                          key={item.key}
                          href={item.href}
                          className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-red-50/50 hover:text-[#740108] rounded-xl transition-all font-semibold group/subitem"
                        >
                          <span>{t(item.key)}</span>
                          <span className="text-[9px] text-gray-400 font-bold bg-gray-50 border border-gray-200 group-hover/subitem:bg-red-100 group-hover/subitem:text-[#740108] group-hover/subitem:border-orange-200 px-1.5 py-0.5 rounded transition-colors uppercase">
                            {language === "en" ? item.tagEn : item.tagBn}
                          </span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link href="/orders" className="relative py-2 hover:text-[#740108] transition-colors group">
                {t("orders")}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#740108] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
              </Link>
            </nav>

            {/* Right Section: Utilities (Language, Currency, Search, Cart) */}
            <div className="flex items-center gap-2 md:gap-4">
              
              {/* Language Selector Dropdown */}
              <div className="relative" ref={langRef}>
                <button 
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 md:px-3 md:py-2 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all font-semibold text-xs text-gray-700"
                >
                  <span className="flex-shrink-0 flex items-center justify-center">{language === "en" ? <USFlag /> : <BDFlag />}</span>
                  <span className="hidden sm:inline">{language === "en" ? "English" : "বাংলা"}</span>
                  <ChevronDown size={12} className={`text-gray-400 transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isLangDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 rounded-lg shadow-xl py-1.5 z-50 text-xs"
                    >
                      <button 
                        onClick={() => { setLanguage("en"); setIsLangDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex justify-between items-center text-gray-700 hover:text-gray-900 font-medium"
                      >
                        <div className="flex items-center gap-2">
                          <USFlag className="w-5 h-3.5" />
                          <span>English</span>
                        </div>
                        {language === "en" && <Check size={12} className="text-[#740108]" />}
                      </button>
                      <button 
                        onClick={() => { setLanguage("bn"); setIsLangDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex justify-between items-center text-gray-700 hover:text-gray-900 font-medium"
                      >
                        <div className="flex items-center gap-2">
                          <BDFlag className="w-5 h-3.5" />
                          <span>বাংলা</span>
                        </div>
                        {language === "bn" && <Check size={12} className="text-[#740108]" />}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              
              {/* Search Toggle Button */}
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-2 rounded-full transition-all duration-200 ${isSearchOpen ? 'bg-red-50 text-[#740108]' : 'text-gray-800 hover:bg-gray-50'}`}
                aria-label="Search"
              >
                <Search size={22} />
              </button>

              {/* Cart Button with Count Badge */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-800 hover:bg-gray-50 rounded-full transition-all duration-200"
                aria-label="Shopping Cart"
              >
                <ShoppingCart size={22} />
                <span className="absolute top-0 right-0 w-5 h-5 bg-[#740108] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {totalCartQuantity}
                </span>
              </button>

            </div>
          </div>
        </div>



        {/* 4. EXPANDABLE SEARCH OVERLAY */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute left-0 right-0 bg-white border-t border-gray-200 shadow-xl overflow-hidden z-30"
            >
              <div className="max-w-3xl mx-auto px-6 py-6 md:py-8">
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-red-500/20 focus-within:border-[#740108] transition-all">
                  <Search size={20} className="text-gray-400" />
                  <input 
                    ref={searchInputRef}
                    type="text" 
                    placeholder={t("searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent w-full text-sm text-gray-800 placeholder-gray-400 outline-none"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="p-1 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                  <button className="bg-[#740108] text-white text-xs md:text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-[#5c0006] transition-colors shadow-sm">
                    {t("searchButton")}
                  </button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 5. INTERACTIVE SHOPPING CART DRAWER (Slides from Right) */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black z-50 pointer-events-auto"
            />
            
            {/* Cart Panel */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col pointer-events-auto"
            >
              {/* Cart Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <ShoppingCart size={20} className="text-[#740108]" />
                  <h3 className="font-bold text-lg text-gray-900">{t("cartTitle")}</h3>
                  <span className="text-xs font-semibold bg-red-50 text-[#740108] px-2 py-0.5 rounded-full">
                    {totalCartQuantity} {t("items")}
                  </span>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 -mr-2 text-gray-400 hover:text-gray-800 rounded-full hover:bg-gray-50 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Cart Item List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 rounded-xl border border-gray-100 shadow-sm relative group overflow-hidden bg-white">
                      
                      {/* Product Image */}
                      <Image 
                        src={item.image} 
                        alt={language === "en" ? item.nameEn : item.nameBn} 
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-100 flex-shrink-0"
                      />
                      
                      {/* Product details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 truncate leading-tight">
                            {language === "en" ? item.nameEn : item.nameBn}
                          </h4>
                          <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-2">
                            <span>Size: {item.size}</span>
                            <span>•</span>
                            <span>Color: {language === "en" ? item.colorEn : item.colorBn}</span>
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-bold text-[#740108]">
                            {getCurrencySymbol()}{convertPrice(item.priceUSD)}
                          </span>

                          {/* Quantity Selector */}
                          <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1.5 hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="px-3 text-xs font-semibold text-gray-800 min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1.5 hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="absolute top-2 right-2 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 md:transition-all duration-200"
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))
                ) : (
                  /* Empty State */
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-[#740108]">
                      <ShoppingCart size={28} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{t("emptyCart")}</h4>
                      <p className="text-xs text-gray-400 mt-1 max-w-[200px] mx-auto">
                        {language === "en" ? "Explore our products and select something nice!" : "আমাদের চমৎকার পণ্য সম্ভার দেখুন ও কার্টে যোগ করুন!"}
                      </p>
                    </div>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="bg-[#740108] hover:bg-[#5c0006] text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow-sm transition-colors"
                    >
                      {t("startShopping")}
                    </button>
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{t("subtotal")}</span>
                      <span className="font-semibold text-gray-800">
                        {getCurrencySymbol()}{convertPrice(cartSubtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{language === "en" ? "Shipping" : "শিপিং"}</span>
                      <span className="font-bold text-green-600 uppercase text-xs">
                        {language === "en" ? "Free" : "ফ্রি"}
                      </span>
                    </div>
                    <div className="border-t border-gray-200/60 pt-2 flex justify-between text-base font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-lg text-[#740108]">
                        {getCurrencySymbol()}{convertPrice(cartSubtotal)}
                      </span>
                    </div>
                  </div>

                  <Link 
                    href="/checkout" 
                    onClick={() => setIsCartOpen(false)}
                    className="w-full bg-[#740108] hover:bg-[#5c0006] text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-500/10 hover:shadow-red-500/20 transition-all group justify-center text-center"
                  >
                    <span>{t("checkout")}</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 6. MOBILE SIDEBAR DRAWER (Slides from Left) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-50 pointer-events-auto"
            />
            
            {/* Sidebar Menu Panel */}
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-full max-w-[280px] bg-white shadow-2xl z-50 flex flex-col pointer-events-auto"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="font-bold text-lg text-gray-900 flex items-center gap-1.5">
                  <span className="bg-[#740108] text-white px-1.5 py-0.5 rounded font-extrabold text-sm">FL</span>
                  <span>Menu</span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 -mr-2 text-gray-400 hover:text-gray-800 rounded-full hover:bg-gray-50 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
                <div className="space-y-3">
                  <Link 
                    href="/" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2.5 px-3 rounded-lg text-sm font-semibold text-gray-800 hover:bg-red-50 hover:text-[#740108] transition-all"
                  >
                    {t("home")}
                  </Link>
                  <Link 
                    href="/orders" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2.5 px-3 rounded-lg text-sm font-semibold text-gray-800 hover:bg-red-50 hover:text-[#740108] transition-all"
                  >
                    {t("orders")}
                  </Link>
                </div>

                <hr className="border-gray-100" />

                {/* Settings & Language Selectors */}
                <div className="space-y-4">
                  <div className="px-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      {t("language")}
                    </h4>
                    <div className="grid grid-cols-2 gap-2 bg-gray-50 p-1 rounded-lg border border-gray-100">
                      <button
                        onClick={() => setLanguage("en")}
                        className={`py-1.5 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                          language === "en" 
                            ? "bg-white text-[#740108] shadow-sm" 
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <USFlag />
                        <span>English</span>
                      </button>
                      <button
                        onClick={() => setLanguage("bn")}
                        className={`py-1.5 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                          language === "bn" 
                            ? "bg-white text-[#740108] shadow-sm" 
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <BDFlag />
                        <span>বাংলা</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
