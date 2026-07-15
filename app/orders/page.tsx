// app/orders/page.tsx
"use client";

import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import Container from "../../components/shared/Container";
import { useRouter } from "next/navigation";
import { 
  ShoppingBag, 
  Calendar, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Package, 
  ArrowLeft 
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { convertPrice, getCurrencySymbol } from "../../data/products";

export default function OrdersPage() {
  const { orders, isAuthenticated } = useAuth();
  const { language, currency } = useLanguage();
  const router = useRouter();

  // Route protection
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth?redirect=/orders");
    }
  }, [isAuthenticated, router]);

  // Document Title
  useEffect(() => {
    document.title = language === "en" ? "My Orders | Fashion Legacy" : "আমার অর্ডার | ফ্যাশন লেগাসি";
  }, [language]);

  // Localized texts
  const t = {
    en: {
      pageTitle: "My Orders",
      orderPlaced: "Order Placed",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      totalPaid: "Total Paid",
      items: "items",
      item: "item",
      noOrders: "You haven't placed any orders yet.",
      goShopping: "Start Shopping",
      backToHome: "Back to Home",
      estDelivery: "Est. Delivery",
      paymentMethod: "Payment Method",
      shippingStatus: "Shipping Status"
    },
    bn: {
      pageTitle: "আমার অর্ডারসমূহ",
      orderPlaced: "অর্ডার করা হয়েছে",
      processing: "প্রক্রিয়াধীন",
      shipped: "শিপড করা হয়েছে",
      delivered: "ডেলিভার্ড হয়েছে",
      totalPaid: "সর্বমোট পেমেন্ট",
      items: "টি পণ্য",
      item: "টি পণ্য",
      noOrders: "আপনি এখনো কোনো অর্ডার করেননি।",
      goShopping: "কেনাকাটা শুরু করুন",
      backToHome: "হোমে ফিরে যান",
      estDelivery: "সম্ভাব্য ডেলিভারি",
      paymentMethod: "পেমেন্ট পদ্ধতি",
      shippingStatus: "ডেলিভারি ট্র্যাকিং"
    }
  }[language];

  // Helper to render tracking steps
  const renderTrackingSteps = (status: "Processing" | "Shipped" | "Delivered") => {
    const steps = [
      { key: "Placed", label: t.orderPlaced, icon: CheckCircle2, active: true },
      { key: "Processing", label: t.processing, icon: Clock, active: true },
      { key: "Shipped", label: t.shipped, icon: Truck, active: status === "Shipped" || status === "Delivered" },
      { key: "Delivered", label: t.delivered, icon: Package, active: status === "Delivered" }
    ];

    return (
      <div className="pt-2">
        <span className="block text-[10px] uppercase tracking-wider text-gray-400 font-extrabold pb-4">{t.shippingStatus}</span>
        
        {/* Mobile vertical tracking list / Desktop horizontal steps */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2 relative">
          
          {/* Connecting line on desktop */}
          <div className="hidden sm:block absolute left-4 right-4 top-4 h-0.5 bg-gray-200 -z-10" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.key} className="flex sm:flex-col items-center gap-3 sm:gap-2 flex-1 w-full relative">
                
                {/* Visual indicator */}
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  step.active 
                    ? "bg-[#D4A017] border-[#D4A017] text-white shadow-sm"
                    : "bg-white border-gray-200 text-gray-400"
                }`}>
                  <Icon size={14} />
                </div>

                {/* Step details */}
                <div className="text-left sm:text-center leading-tight">
                  <span className={`block text-xs font-black uppercase ${
                    step.active ? "text-gray-800" : "text-gray-400"
                  }`}>
                    {step.label}
                  </span>
                  {step.key === "Placed" && (
                    <span className="block text-[9px] text-gray-400 font-bold">Confirmed</span>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (!isAuthenticated) return null;

  return (
    <Container className="py-8 space-y-6">
      
      {/* Back button */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-800 font-bold transition-colors">
        <ArrowLeft size={14} />
        <span>{t.backToHome}</span>
      </Link>

      <h1 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
        <span className="w-2.5 h-6 bg-[#D4A017] rounded" />
        <span>{t.pageTitle}</span>
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center space-y-5 max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto border border-gray-100 shadow-sm">
            <ShoppingBag size={28} />
          </div>
          <p className="text-sm text-gray-500 font-bold">{t.noOrders}</p>
          <Link
            href="/"
            className="inline-block bg-[#D4A017] hover:bg-[#5c0006] text-white font-extrabold text-xs py-3 px-8 rounded-xl shadow-md transition-all uppercase"
          >
            {t.goShopping}
          </Link>
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6 hover:shadow-md transition-shadow"
            >
              
              {/* Order top bar info */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-extrabold uppercase">Order</span>
                    <span className="font-extrabold text-gray-900 font-mono text-sm md:text-base">{order.id}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                    <Calendar size={13} />
                    <span className="font-mono">{order.date}</span>
                  </div>
                </div>

                <div className={`px-3 py-1 rounded-full font-black text-xs uppercase tracking-wider ${
                  order.status === "Delivered" ? "bg-green-50 text-green-700 border border-green-100" :
                  order.status === "Shipped" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                  "bg-amber-50 text-amber-700 border border-amber-100"
                }`}>
                  {order.status}
                </div>
              </div>

              {/* Purchased Products List */}
              <div className="space-y-3.5 border-b border-gray-100 pb-4">
                {order.items && order.items.map((item) => (
                  <div key={item.id} className="flex gap-3 text-xs md:text-sm">
                    <div className="relative w-10 h-14 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.nameEn}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="font-extrabold text-gray-800 line-clamp-1 leading-tight">
                        {language === "en" ? item.nameEn : item.nameBn}
                      </h4>
                      <div className="text-[10px] text-gray-400 font-bold space-x-1.5 flex flex-wrap">
                        <span>{language === "en" ? "Size" : "সাইজ"}: {item.size}</span>
                        <span>•</span>
                        <span>{language === "en" ? "Color" : "কালার"}: {language === "en" ? item.colorEn : item.colorBn}</span>
                        <span>•</span>
                        <span>{language === "en" ? "Qty" : "পরিমাণ"}: {item.quantity}</span>
                      </div>
                    </div>

                    <div className="text-right font-black text-gray-900 font-mono">
                      {convertPrice(item.priceUSD * item.quantity, currency)} {getCurrencySymbol(currency)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order tracking timeline progress */}
              {renderTrackingSteps(order.status)}

              {/* Summary financials details */}
              <div className="bg-gray-50 border border-gray-200/50 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold text-gray-500">
                
                {/* Items and Amount */}
                <div className="space-y-1">
                  <span className="block text-[9px] uppercase tracking-wider text-gray-400">{t.totalPaid}</span>
                  <span className="block text-sm font-black text-[#D4A017]">
                    {convertPrice(order.total, currency)} {getCurrencySymbol(currency)}
                  </span>
                  <span className="block text-[10px] text-gray-400 font-bold">
                    ({order.itemsCount} {order.itemsCount === 1 ? t.item : t.items})
                  </span>
                </div>

                {/* Payment Method */}
                <div className="space-y-1">
                  <span className="block text-[9px] uppercase tracking-wider text-gray-400">{t.paymentMethod}</span>
                  <div className="flex items-center gap-1.5 text-gray-800 pt-0.5">
                    <CreditCard size={14} className="text-[#D4A017]" />
                    <span className="font-extrabold">{order.paymentMethod}</span>
                  </div>
                </div>

                {/* Estimate delivery dates */}
                <div className="space-y-1">
                  <span className="block text-[9px] uppercase tracking-wider text-gray-400">{t.estDelivery}</span>
                  <span className="block text-gray-800 font-extrabold pt-0.5">
                    {order.status === "Delivered" ? (
                      <span className="text-green-600 font-black">Delivered</span>
                    ) : order.status === "Shipped" ? (
                      "1-2 Days Remaining"
                    ) : (
                      "2-4 Days Remaining"
                    )}
                  </span>
                </div>

              </div>

            </motion.div>
          ))}
        </div>
      )}

    </Container>
  );
}
