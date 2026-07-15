// app/checkout/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Container from "../../components/shared/Container";
import { useLanguage } from "../../context/LanguageContext";
import { convertPrice, getCurrencySymbol, getProductImageUrl } from "../../data/products";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck, CreditCard, Truck, Phone, MapPin, User, ChevronRight, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "../../context/AuthContext";

export default function CheckoutPage() {
  const { language, currency, cartItems, clearCart } = useLanguage();
  const { user, isAuthenticated, addSimulatedOrder } = useAuth();

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [shippingArea, setShippingArea] = useState<"inside" | "outside">("inside");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "mobile">("cod");
  
  // Mobile banking specific states
  const [selectedGateway, setSelectedGateway] = useState<"bkash" | "nagad" | "rocket">("bkash");
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");

  // Pre-fill fields from Auth profile if logged in (Disabled to show placeholders instead)
  /*
  useEffect(() => {
    if (isAuthenticated && user) {
      setName(user.name);
      setPhone(user.phone);
      setAddress(user.address);
    }
  }, [isAuthenticated, user]);
  */

  const toBanglaDigits = (numStr: string) => {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return numStr.replace(/\d/g, (d) => banglaDigits[parseInt(d)]);
  };

  const formatShippingOption = (amountUSD: number) => {
    const converted = parseFloat(convertPrice(amountUSD, currency));
    const formattedVal = (currency === "BDT" || currency === "SAR") ? converted.toFixed(0) : converted.toFixed(2);
    const valStr = language === "en" ? formattedVal : toBanglaDigits(formattedVal);
    return `${currencySymbol}${valStr}`;
  };

  // Loading & order placement state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState("");
  const [finalTotal, setFinalTotal] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  // Reset page title/header
  useEffect(() => {
    document.title = language === "en" ? "Checkout | Fashion Legacy" : "চেকআউট | ফ্যাশন লেগাসি";
  }, [language]);

  // Calculations
  const subtotalUSD = cartItems.reduce((sum, item) => sum + item.priceUSD * item.quantity, 0);
  const currencySymbol = getCurrencySymbol(currency);

  // Dynamic Shipping Costs (Inside Dhaka: ৳80 / $0.67 USD; Outside Dhaka: ৳150 / $1.25 USD)
  const shippingCostUSD = shippingArea === "inside" ? 80 / 120 : 150 / 120;
  
  const displaySubtotal = parseFloat(convertPrice(subtotalUSD, currency));
  const displayShipping = parseFloat(convertPrice(shippingCostUSD, currency));
  const displayTotal = (displaySubtotal + displayShipping).toFixed(2);

  // Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!name.trim()) {
      errors.name = language === "en" ? "Full Name is required" : "পূর্ণ নাম আবশ্যক";
    }
    if (!phone.trim()) {
      errors.phone = language === "en" ? "Phone Number is required" : "মোবাইল নম্বর আবশ্যক";
    } else if (!/^(?:\+88|88)?(01[3-9]\d{8})$/.test(phone.trim())) {
      errors.phone = language === "en" ? "Enter a valid Bangladeshi phone number" : "সঠিক বাংলাদেশী মোবাইল নম্বর দিন";
    }
    if (!address.trim()) {
      errors.address = language === "en" ? "Delivery address is required" : "ডেলিভারি ঠিকানা আবশ্যক";
    }

    if (paymentMethod === "mobile") {
      if (!senderNumber.trim()) {
        errors.senderNumber = language === "en" ? "Sender account number is required" : "প্রেরক অ্যাকাউন্ট নম্বর আবশ্যক";
      } else if (!/^(?:\+88|88)?(01[3-9]\d{8})$/.test(senderNumber.trim())) {
        errors.senderNumber = language === "en" ? "Enter a valid account number" : "সঠিক মোবাইল ব্যাংকিং নম্বর দিন";
      }
      if (!transactionId.trim()) {
        errors.transactionId = language === "en" ? "Transaction ID is required" : "ট্রানজেকশন আইডি (TxnID) আবশ্যক";
      } else if (transactionId.trim().length < 6) {
        errors.transactionId = language === "en" ? "Transaction ID is too short" : "ট্রানজেকশন আইডি অত্যন্ত ছোট";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Copy handler
  const handleCopyNumber = () => {
    navigator.clipboard.writeText("01307102810");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Place Order Action
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Capture final total before clearing cart
    const finalAmountString = `${displayTotal} ${currencySymbol}`;

    const pMethod = paymentMethod === "cod"
      ? (language === "en" ? "Cash on Delivery" : "ক্যাশ অন ডেলিভারি")
      : `${language === "en" ? "Mobile Banking" : "মোবাইল ব্যাংকিং"} (${selectedGateway.toUpperCase()})`;

    try {
      const orderId = await addSimulatedOrder(
        cartItems,
        subtotalUSD + shippingCostUSD,
        pMethod,
        { name, email: user?.email || (phone + "@customer.com"), address, shippingArea }
      );

      setGeneratedOrderId(orderId);
      setFinalTotal(finalAmountString);
      setIsSubmitting(false);
      setOrderSuccess(true);
      clearCart(); // Empty the cart upon success
    } catch (err) {
      console.error("Checkout order submit failed", err);
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <Container className="py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto border border-gray-100 shadow-sm">
          <Truck size={36} />
        </div>
        <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase">
          {language === "en" ? "Your Cart is Empty" : "আপনার কার্টটি খালি আছে"}
        </h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          {language === "en" 
            ? "You cannot checkout without adding items to your shopping cart."
            : "শপিং কার্টে কোনো পণ্য যোগ না করে চেকআউট সম্পন্ন করতে পারবেন না।"}
        </p>
        <Link 
          href="/" 
          className="inline-flex bg-[#D4A017] hover:bg-[#5c0006] text-white font-extrabold text-sm py-3 px-8 rounded-xl shadow-md transition-all uppercase"
        >
          {language === "en" ? "Go Shopping" : "কেনাকাটা শুরু করুন"}
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      {orderSuccess ? (
        /* ORDER SUCCESS SCREEN */
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl mx-auto bg-white border border-green-100 rounded-3xl p-8 md:p-10 shadow-xl space-y-6 text-center"
        >
          <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto animate-bounce border border-green-100">
            <CheckCircle2 size={36} fill="currentColor" className="text-white fill-green-500" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">
              {language === "en" ? "Order Confirmed!" : "অর্ডার সফল হয়েছে!"}
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              {language === "en" 
                ? "Thank you for shopping with us. Your invoice details are listed below."
                : "ফ্যাশন লেগাসি থেকে কেনাকাটা করার জন্য ধন্যবাদ। আপনার অর্ডারের তথ্য নিচে দেওয়া হলো।"}
            </p>
          </div>

          {/* Details Card */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-left space-y-3.5 text-xs md:text-sm">
            <div className="flex justify-between border-b border-gray-200/50 pb-2">
              <span className="text-gray-400 font-bold uppercase">{language === "en" ? "Order ID" : "অর্ডার আইডি"}</span>
              <span className="font-extrabold text-gray-900 font-mono text-sm">{generatedOrderId}</span>
            </div>
            
            <div className="flex justify-between border-b border-gray-200/50 pb-2">
              <span className="text-gray-400 font-bold uppercase">{language === "en" ? "Recipient" : "গ্রহীতা"}</span>
              <span className="font-bold text-gray-800">{name}</span>
            </div>

            <div className="flex justify-between border-b border-gray-200/50 pb-2">
              <span className="text-gray-400 font-bold uppercase">{language === "en" ? "Phone" : "মোবাইল"}</span>
              <span className="font-bold text-gray-800">{phone}</span>
            </div>

            <div className="flex justify-between border-b border-gray-200/50 pb-2">
              <span className="text-gray-400 font-bold uppercase">{language === "en" ? "Shipping Area" : "শিপিং এলাকা"}</span>
              <span className="font-extrabold text-gray-800">
                {shippingArea === "inside" 
                  ? (language === "en" ? "Inside Dhaka (2-3 days)" : "ঢাকা সিটি (২-৩ দিন)")
                  : (language === "en" ? "Outside Dhaka (3-5 days)" : "ঢাকার বাইরে (৩-৫ দিন)")}
              </span>
            </div>

            <div className="flex justify-between border-b border-gray-200/50 pb-2">
              <span className="text-gray-400 font-bold uppercase">{language === "en" ? "Payment Method" : "পেমেন্ট পদ্ধতি"}</span>
              <span className="font-extrabold text-gray-800">
                {paymentMethod === "cod" 
                  ? (language === "en" ? "Cash on Delivery" : "ক্যাশ অন ডেলিভারি")
                  : `${language === "en" ? "Mobile Banking" : "মোবাইল ব্যাংকিং"} (${selectedGateway.toUpperCase()})`}
              </span>
            </div>

            <div className="flex justify-between pt-1 text-base font-black text-gray-900">
              <span className="uppercase">{language === "en" ? "Total Paid" : "সর্বমোট বিল"}</span>
              <span className="text-[#D4A017]">{language === "en" ? finalTotal : toBanglaDigits(finalTotal)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link 
              href="/" 
              className="flex-1 bg-[#D4A017] hover:bg-[#5c0006] text-white font-extrabold text-xs md:text-sm py-3.5 rounded-xl shadow-md transition-all uppercase flex items-center justify-center gap-1.5"
            >
              <span>{language === "en" ? "Continue Shopping" : "আরও কেনাকাটা করুন"}</span>
            </Link>
          </div>
        </motion.div>
      ) : (
        /* CHECKOUT MAIN FORM */
        <div className="space-y-6">
          {/* Back button */}
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-800 font-bold transition-colors">
            <ArrowLeft size={14} />
            <span>{language === "en" ? "Back to Shop" : "হোমে ফিরে যান"}</span>
          </Link>

          <h1 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-6 bg-[#D4A017] rounded" />
            <span>{language === "en" ? "Secure Checkout" : "নিরাপদ চেকআউট"}</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Shipping & Payment Forms */}
            <form onSubmit={handlePlaceOrder} className="col-span-1 lg:col-span-7 space-y-6">
              
              {/* 1. SHIPPING ADDRESS SECTION */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
                <h2 className="text-sm font-extrabold text-gray-800 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3">
                  <User size={16} className="text-[#D4A017]" />
                  <span>{language === "en" ? "1. Shipping Information" : "১. শিপিংয়ের তথ্য প্রদান"}</span>
                </h2>

                <div className="space-y-4">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">
                      {language === "en" ? "Full Name" : "পূর্ণ নাম"} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={language === "en" ? "e.g. Shamim Ahsan" : "যেমন: শামীম আহসান"}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full bg-gray-50 border rounded-xl px-4 py-2.5 text-xs md:text-sm font-bold text-gray-700 outline-none transition-all ${
                          formErrors.name ? "border-red-300 bg-red-50/20" : "border-gray-200 hover:border-gray-300 focus:border-[#D4A017] focus:bg-white"
                        }`}
                      />
                    </div>
                    {formErrors.name && (
                      <p className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                        <AlertCircle size={10} />
                        <span>{formErrors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">
                      {language === "en" ? "Phone Number" : "মোবাইল নম্বর"} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        placeholder={language === "en" ? "e.g. 01712345678" : "যেমন: ০১৭১২৩৪৫৬৭৮"}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`w-full bg-gray-50 border rounded-xl px-4 py-2.5 text-xs md:text-sm font-bold text-gray-700 outline-none transition-all ${
                          formErrors.phone ? "border-red-300 bg-red-50/20" : "border-gray-200 hover:border-gray-300 focus:border-[#D4A017] focus:bg-white"
                        }`}
                      />
                    </div>
                    {formErrors.phone && (
                      <p className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                        <AlertCircle size={10} />
                        <span>{formErrors.phone}</span>
                      </p>
                    )}
                  </div>

                  {/* Address field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">
                      {language === "en" ? "Full Delivery Address" : "সম্পূর্ণ ঠিকানা"} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder={language === "en" ? "e.g. House 14, Road 5, Uttara Sector 4, Dhaka" : "যেমন: বাসা ১৪, রোড ৫, উত্তরা সেক্টর ৪, ঢাকা"}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={`w-full bg-gray-50 border rounded-xl px-4 py-2.5 text-xs md:text-sm font-bold text-gray-700 outline-none transition-all resize-none ${
                        formErrors.address ? "border-red-300 bg-red-50/20" : "border-gray-200 hover:border-gray-300 focus:border-[#D4A017] focus:bg-white"
                      }`}
                    />
                    {formErrors.address && (
                      <p className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                        <AlertCircle size={10} />
                        <span>{formErrors.address}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. SHIPPING AREA SELECTION */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
                <h2 className="text-sm font-extrabold text-gray-800 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3">
                  <Truck size={16} className="text-[#D4A017]" />
                  <span>{language === "en" ? "2. Delivery Location" : "২. ডেলিভারি এলাকা নির্বাচন"}</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Inside Dhaka */}
                  <button
                    type="button"
                    onClick={() => setShippingArea("inside")}
                    className={`p-4 border rounded-2xl flex items-center gap-3.5 transition-all text-left ${
                      shippingArea === "inside"
                        ? "border-[#D4A017] bg-red-50/30"
                        : "border-gray-100 bg-gray-50 hover:bg-gray-100/50"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      shippingArea === "inside" ? "border-[#D4A017]" : "border-gray-300"
                    }`}>
                      {shippingArea === "inside" && (
                        <div className="w-2 h-2 rounded-full bg-[#D4A017]" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <span className="block text-xs md:text-sm font-black uppercase text-gray-900">
                        {language === "en" ? "Inside Dhaka" : "ঢাকা সিটি"}
                      </span>
                      <span className="block text-[10px] md:text-xs text-gray-400 font-bold">
                        {language === "en" ? "Delivery: 2-3 Days" : "ডেলিভারি সময়: ২-৩ দিন"}
                      </span>
                    </div>
                    <span className="text-xs md:text-sm font-black text-[#D4A017] flex-shrink-0">
                      {formatShippingOption(80 / 120)}
                    </span>
                  </button>

                  {/* Outside Dhaka */}
                  <button
                    type="button"
                    onClick={() => setShippingArea("outside")}
                    className={`p-4 border rounded-2xl flex items-center gap-3.5 transition-all text-left ${
                      shippingArea === "outside"
                        ? "border-[#D4A017] bg-red-50/30"
                        : "border-gray-100 bg-gray-50 hover:bg-gray-100/50"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      shippingArea === "outside" ? "border-[#D4A017]" : "border-gray-300"
                    }`}>
                      {shippingArea === "outside" && (
                        <div className="w-2 h-2 rounded-full bg-[#D4A017]" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <span className="block text-xs md:text-sm font-black uppercase text-gray-900">
                        {language === "en" ? "Outside Dhaka" : "ঢাকার বাইরে"}
                      </span>
                      <span className="block text-[10px] md:text-xs text-gray-400 font-bold">
                        {language === "en" ? "Delivery: 3-5 Days" : "ডেলিভারি সময়: ৩-৫ দিন"}
                      </span>
                    </div>
                    <span className="text-xs md:text-sm font-black text-[#D4A017] flex-shrink-0">
                      {formatShippingOption(150 / 120)}
                    </span>
                  </button>
                </div>
              </div>

              {/* 3. PAYMENT METHOD SECTION */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
                <h2 className="text-sm font-extrabold text-gray-800 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3">
                  <CreditCard size={16} className="text-[#D4A017]" />
                  <span>{language === "en" ? "3. Payment System" : "৩. পেমেন্ট পদ্ধতি"}</span>
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Cash on Delivery */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cod")}
                      className={`p-4 border rounded-2xl flex items-start gap-3 transition-all text-left ${
                        paymentMethod === "cod"
                          ? "border-[#D4A017] bg-red-50/30"
                          : "border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100/50"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={paymentMethod === "cod"}
                        onChange={() => {}}
                        className="mt-1 accent-[#D4A017]"
                      />
                      <div className="space-y-1 leading-tight">
                        <span className="block text-xs md:text-sm font-black uppercase text-gray-900">
                          {language === "en" ? "Cash On Delivery" : "ক্যাশ অন ডেলিভারি"}
                        </span>
                        <span className="block text-[10px] text-gray-400 font-bold">
                          {language === "en" ? "Pay with cash on arrival" : "কুরিয়ার থেকে পণ্য পেয়ে বিল দিন"}
                        </span>
                      </div>
                    </button>

                    {/* Mobile Banking */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("mobile")}
                      className={`p-4 border rounded-2xl flex items-start gap-3 transition-all text-left ${
                        paymentMethod === "mobile"
                          ? "border-[#D4A017] bg-red-50/30"
                          : "border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100/50"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={paymentMethod === "mobile"}
                        onChange={() => {}}
                        className="mt-1 accent-[#D4A017]"
                      />
                      <div className="space-y-1 leading-tight">
                        <span className="block text-xs md:text-sm font-black uppercase text-gray-900">
                          {language === "en" ? "Mobile Banking" : "মোবাইল ব্যাংকিং"}
                        </span>
                        <span className="block text-[10px] text-gray-400 font-bold">
                          {language === "en" ? "bKash, Nagad or Rocket" : "বিকাশ, নগদ বা রকেটে পেমেন্ট"}
                        </span>
                      </div>
                    </button>
                  </div>

                  {/* Interactive simulated mobile banking sub-form */}
                  <AnimatePresence>
                    {paymentMethod === "mobile" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden bg-gray-50 border border-gray-200/60 rounded-2xl p-5 space-y-4"
                      >
                        {/* Gateway select buttons */}
                        <div className="flex gap-2">
                          {/* bKash */}
                          <button
                            type="button"
                            onClick={() => setSelectedGateway("bkash")}
                            className={`flex-1 h-11 rounded-xl border-2 transition-all flex items-center justify-center p-2 ${
                              selectedGateway === "bkash"
                                ? "border-[#D12053] bg-[#D12053]/5 shadow-sm"
                                : "border-gray-200 bg-white hover:bg-gray-50"
                            }`}
                          >
                            <Image
                              src="/images/bkash.png"
                              alt="bKash"
                              width={120}
                              height={40}
                              className="h-8 w-auto object-contain select-none"
                            />
                          </button>
                          
                          {/* Nagad */}
                          <button
                            type="button"
                            onClick={() => setSelectedGateway("nagad")}
                            className={`flex-1 h-11 rounded-xl border-2 transition-all flex items-center justify-center p-2 ${
                              selectedGateway === "nagad"
                                ? "border-[#F15A22] bg-[#F15A22]/5 shadow-sm"
                                : "border-gray-200 bg-white hover:bg-gray-50"
                            }`}
                          >
                            <Image
                              src="/images/nagad.png"
                              alt="Nagad"
                              width={120}
                              height={40}
                              className="h-8 w-auto object-contain select-none"
                            />
                          </button>

                          {/* Rocket */}
                          <button
                            type="button"
                            onClick={() => setSelectedGateway("rocket")}
                            className={`flex-1 h-11 rounded-xl border-2 transition-all flex items-center justify-center p-2 ${
                              selectedGateway === "rocket"
                                ? "border-[#8C3494] bg-[#8C3494]/5 shadow-sm"
                                : "border-gray-200 bg-white hover:bg-gray-50"
                            }`}
                          >
                            <Image
                              src="/images/rocket.png"
                              alt="Rocket"
                              width={120}
                              height={40}
                              className="h-8 w-auto object-contain select-none"
                            />
                          </button>
                        </div>

                        {/* Visual guidelines */}
                        <div className="bg-amber-50/70 border border-amber-100/60 rounded-xl p-4 text-[11px] md:text-xs font-bold text-amber-800 leading-relaxed space-y-3">
                          <div>
                            <span className="block font-black text-xs pb-1 uppercase">
                              {language === "en" ? "Instructions:" : "পেমেন্ট নির্দেশিকা:"}
                            </span>
                            {language === "en" ? (
                              <span>
                                Please send money <strong>{displayTotal} {currencySymbol}</strong> to our personal account number. Enter your sender number and transaction ID (TxnID) below.
                              </span>
                            ) : (
                              <span>
                                অনুগ্রহ করে আপনার নির্বাচিত ওয়ালেটে <strong>{displayTotal} {currencySymbol}</strong> নিচের পার্সোনাল নম্বরে সেন্ডমানি করুন। পেমেন্ট শেষে প্রেরক নম্বর এবং ট্রানজেকশন আইডি নিচে দিন।
                              </span>
                            )}
                          </div>

                          <div className="bg-white border border-[#D4A017]/20 rounded-xl p-3 flex items-center justify-between gap-4 shadow-sm">
                            <div className="space-y-0.5">
                              <span className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold">
                                {language === "en" ? "Personal Account Number" : "পার্সোনাল অ্যাকাউন্ট নম্বর"}
                              </span>
                              <span className="block text-sm md:text-base font-black tracking-wider text-[#D4A017] font-mono">
                                01307102810
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={handleCopyNumber}
                              className={`h-8 px-3 rounded-lg font-bold text-[10px] uppercase flex items-center gap-1.5 transition-all select-none border ${
                                copied
                                  ? "border-green-200 bg-green-50 text-green-600"
                                  : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {copied ? (
                                <>
                                  <CheckCircle2 size={12} className="text-green-500" />
                                  <span>{language === "en" ? "Copied" : "কপি হয়েছে"}</span>
                                </>
                              ) : (
                                <>
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                                  </svg>
                                  <span>{language === "en" ? "Copy" : "কপি করুন"}</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Mobile Form fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {/* Sender Account */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                              {language === "en" ? "Your Account No." : "প্রেরক অ্যাকাউন্ট নম্বর"}
                            </label>
                            <input
                              type="tel"
                              placeholder="01XXXXXXXXX"
                              value={senderNumber}
                              onChange={(e) => setSenderNumber(e.target.value)}
                              className={`w-full bg-white border rounded-lg px-3 py-2 text-xs font-bold text-gray-700 outline-none transition-all ${
                                formErrors.senderNumber ? "border-red-300 bg-red-50/10" : "border-gray-200 hover:border-gray-300 focus:border-[#D4A017]"
                              }`}
                            />
                            {formErrors.senderNumber && (
                              <p className="text-[9px] text-red-500 font-bold">{formErrors.senderNumber}</p>
                            )}
                          </div>

                          {/* Transaction ID */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                              {language === "en" ? "Transaction ID (TxnID)" : "ট্রানজেকশন আইডি (TxnID)"}
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. A9B8C7D6"
                              value={transactionId}
                              onChange={(e) => setTransactionId(e.target.value)}
                              className={`w-full bg-white border rounded-lg px-3 py-2 text-xs font-bold text-gray-700 outline-none transition-all ${
                                formErrors.transactionId ? "border-red-300 bg-red-50/10" : "border-gray-200 hover:border-gray-300 focus:border-[#D4A017]"
                              }`}
                            />
                            {formErrors.transactionId && (
                              <p className="text-[9px] text-red-500 font-bold">{formErrors.transactionId}</p>
                            )}
                          </div>
                        </div>

                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </div>

            </form>

            {/* RIGHT COLUMN: Order Summary & Placement Details */}
            <div className="col-span-1 lg:col-span-5 space-y-6">
              
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
                <h2 className="text-sm font-extrabold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 block">
                  {language === "en" ? "Order Summary" : "অর্ডার সারাংশ"}
                </h2>

                {/* Items loop */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 text-xs md:text-sm">
                      <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                        <Image
                          src={getProductImageUrl(item.image)}
                          alt={item.nameEn}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="font-extrabold text-gray-800 line-clamp-1 leading-tight">
                          {language === "en" ? item.nameEn : item.nameBn}
                        </h4>
                        <div className="text-[10px] text-gray-400 font-bold space-x-1.5">
                          <span>{language === "en" ? "Size" : "সাইজ"}: {item.size}</span>
                          <span>•</span>
                          <span>{language === "en" ? "Qty" : "পরিমাণ"}: {item.quantity}</span>
                        </div>
                      </div>

                      <div className="text-right font-black text-gray-900">
                        {language === "en" ? convertPrice(item.priceUSD * item.quantity, currency) : toBanglaDigits(convertPrice(item.priceUSD * item.quantity, currency))} {currencySymbol}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Financial Summary */}
                <div className="border-t border-gray-100 pt-4 space-y-3.5 text-xs md:text-sm">
                  <div className="flex justify-between font-bold text-gray-500">
                    <span>{language === "en" ? "Subtotal" : "সাবটোটাল"}</span>
                    <span className="text-gray-800 font-black">{language === "en" ? displaySubtotal.toFixed(2) : toBanglaDigits(displaySubtotal.toFixed(2))} {currencySymbol}</span>
                  </div>

                  <div className="flex justify-between font-bold text-gray-500">
                    <span>{language === "en" ? "Shipping Cost" : "শিপিং চার্জ"}</span>
                    <span className="text-gray-800 font-black">+{language === "en" ? displayShipping.toFixed(2) : toBanglaDigits(displayShipping.toFixed(2))} {currencySymbol}</span>
                  </div>

                  <div className="border-t border-gray-100 pt-3.5 flex justify-between font-black text-base text-gray-900">
                    <span>{language === "en" ? "Total Due" : "সর্বমোট বিল"}</span>
                    <span className="text-[#D4A017] text-lg font-black">{language === "en" ? displayTotal : toBanglaDigits(displayTotal)} {currencySymbol}</span>
                  </div>
                </div>

                {/* Place Order CTA */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="w-full bg-[#D4A017] hover:bg-[#5c0006] text-white h-12 rounded-xl font-black text-xs md:text-sm tracking-wide shadow-md transition-all uppercase flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      <span>{language === "en" ? "PLACE ORDER" : "অর্ডার নিশ্চিত করুন"}</span>
                    </>
                  )}
                </button>

                {/* Security Guarantee banner */}
                <div className="text-center text-[10px] text-gray-400 font-bold flex items-center justify-center gap-1">
                  <ShieldCheck size={14} className="text-green-500" />
                  <span>{language === "en" ? "Safe & Secured Checkout Guarantee" : "১০০% নিরাপদ এবং সুরক্ষিত লেনদেনের নিশ্চয়তা"}</span>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}
    </Container>
  );
}
