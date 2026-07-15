// app/profile/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import Container from "../../components/shared/Container";
import { useRouter } from "next/navigation";
import { User, Phone, Mail, MapPin, Save, LogOut, ShoppingBag, CheckCircle, Clock, Truck, ShieldCheck, UserCheck } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { convertPrice, getCurrencySymbol } from "../../data/products";

export default function ProfilePage() {
  const { user, isAuthenticated, logout, updateProfile, orders } = useAuth();
  const { language, currency } = useLanguage();
  const router = useRouter();

  // Profile Form States
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("avatar_men");

  // UX Feedback states
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Auth Protection redirect
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth?redirect=/profile");
    } else if (user) {
      setName(user.name);
      setPhone(user.phone);
      setEmail(user.email);
      setAddress(user.address);
      setAvatar(user.avatar || "avatar_men");
    }
  }, [isAuthenticated, user, router]);

  // Set Document Title
  useEffect(() => {
    document.title = language === "en" ? "My Profile | Fashion Legacy" : "আমার প্রোফাইল | ফ্যাশন লেগাসি";
  }, [language]);

  // Localized texts
  const t = {
    en: {
      profileTitle: "My Account Dashboard",
      editProfile: "Edit Profile Details",
      nameLabel: "Full Name",
      phoneLabel: "Phone Number",
      emailLabel: "Email Address",
      addressLabel: "Default Delivery Address",
      saveBtn: "Save Profile Changes",
      logoutBtn: "Log Out",
      ordersTitle: "Order History",
      noOrders: "You haven't placed any orders yet.",
      saveOk: "Profile updated successfully!",
      orderId: "Order ID",
      orderDate: "Date",
      orderTotal: "Total Bill",
      orderPayment: "Payment",
      orderStatus: "Status",
      avatarTitle: "Select Profile Icon",
      nameErr: "Name cannot be empty",
      phoneErr: "Enter a valid phone number",
      addressErr: "Address cannot be empty"
    },
    bn: {
      profileTitle: "আমার অ্যাকাউন্ট ড্যাশবোর্ড",
      editProfile: "প্রোফাইল পরিবর্তন করুন",
      nameLabel: "পূর্ণ নাম",
      phoneLabel: "মোবাইল নম্বর",
      emailLabel: "ইমেইল এড্রেস",
      addressLabel: "ডিফল্ট ডেলিভারি ঠিকানা",
      saveBtn: "পরিবর্তনগুলো সংরক্ষণ করুন",
      logoutBtn: "লগআউট করুন",
      ordersTitle: "অর্ডারের ইতিহাস",
      noOrders: "আপনি এখনো কোনো অর্ডার করেননি।",
      saveOk: "প্রোফাইল সফলভাবে আপডেট করা হয়েছে!",
      orderId: "অর্ডার আইডি",
      orderDate: "তারিখ",
      orderTotal: "মোট বিল",
      orderPayment: "পেমেন্ট পদ্ধতি",
      orderStatus: "অবস্থা",
      avatarTitle: "প্রোফাইল ছবি নির্বাচন করুন",
      nameErr: "নাম ফাঁকা রাখা যাবে না",
      phoneErr: "সঠিক মোবাইল নম্বর দিন",
      addressErr: "ঠিকানা ফাঁকা রাখা যাবে না"
    }
  }[language];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = t.nameErr;
    if (!phone.trim() || phone.trim().length < 11) errs.phone = t.phoneErr;
    if (!address.trim()) errs.address = t.addressErr;

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    setFormErrors({});
    setIsSaving(true);

    // Simulate saving delay
    setTimeout(() => {
      updateProfile({ name, phone, email, address, avatar });
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Avatar Icons list
  const avatars = [
    { id: "avatar_men", color: "bg-blue-100 border-blue-400", label: "Men" },
    { id: "avatar_women", color: "bg-pink-100 border-pink-400", label: "Women" },
    { id: "avatar_kids", color: "bg-yellow-100 border-yellow-400", label: "Kids" },
    { id: "avatar_watch", color: "bg-purple-100 border-purple-400", label: "Watch" }
  ];

  if (!user) return null;

  return (
    <Container className="py-10 space-y-8">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl uppercase border-2 ${
            avatar === "avatar_men" ? "bg-blue-50 text-blue-600 border-blue-200" :
            avatar === "avatar_women" ? "bg-pink-50 text-pink-600 border-pink-200" :
            avatar === "avatar_kids" ? "bg-yellow-50 text-yellow-600 border-yellow-200" :
            "bg-purple-50 text-purple-600 border-purple-200"
          }`}>
            {name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-900 leading-tight flex items-center gap-1.5">
              <span>{name}</span>
              <UserCheck size={18} className="text-green-500" />
            </h1>
            <p className="text-xs text-gray-400 font-bold font-mono">{email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex bg-gray-50 hover:bg-[#D4A017] text-gray-500 hover:text-white font-extrabold text-xs md:text-sm py-2.5 px-5 rounded-xl border border-gray-200 hover:border-transparent transition-all items-center gap-1.5 uppercase select-none"
        >
          <LogOut size={15} />
          <span>{t.logoutBtn}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: EDIT PROFILE DETAILS */}
        <form onSubmit={handleSave} className="col-span-1 lg:col-span-7 bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <h2 className="text-sm font-extrabold text-gray-800 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3">
            <User size={16} className="text-[#D4A017]" />
            <span>{t.editProfile}</span>
          </h2>

          <div className="space-y-4">
            {/* Avatar chooser */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">
                {t.avatarTitle}
              </label>
              <div className="flex gap-3">
                {avatars.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setAvatar(av.id)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-xs border-2 uppercase transition-all select-none ${
                      avatar === av.id
                        ? `${av.color} scale-110 shadow-sm`
                        : "bg-gray-50 border-gray-200 text-gray-400 hover:border-gray-300"
                    }`}
                  >
                    {av.label.charAt(0)}
                  </button>
                ))}
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">
                {t.nameLabel}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full bg-gray-50 border rounded-xl pl-9 pr-4 py-2.5 text-xs md:text-sm font-bold text-gray-700 outline-none transition-all ${
                    formErrors.name ? "border-red-300 bg-red-50/20" : "border-gray-200 focus:border-[#D4A017] focus:bg-white"
                  }`}
                />
              </div>
              {formErrors.name && <p className="text-[10px] text-red-500 font-bold">{formErrors.name}</p>}
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">
                {t.phoneLabel}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Phone size={16} />
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full bg-gray-50 border rounded-xl pl-9 pr-4 py-2.5 text-xs md:text-sm font-bold text-gray-700 outline-none transition-all ${
                    formErrors.phone ? "border-red-300 bg-red-50/20" : "border-gray-200 focus:border-[#D4A017] focus:bg-white"
                  }`}
                />
              </div>
              {formErrors.phone && <p className="text-[10px] text-red-500 font-bold">{formErrors.phone}</p>}
            </div>

            {/* Email (Readonly for mock security) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block">
                {t.emailLabel}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-300">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-gray-100/70 border border-gray-200/60 rounded-xl pl-9 pr-4 py-2.5 text-xs md:text-sm font-bold text-gray-400 cursor-not-allowed outline-none"
                />
              </div>
            </div>

            {/* Delivery Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">
                {t.addressLabel}
              </label>
              <div className="relative">
                <span className="absolute top-3 left-3 text-gray-400">
                  <MapPin size={16} />
                </span>
                <textarea
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`w-full bg-gray-50 border rounded-xl pl-9 pr-4 py-2 text-xs md:text-sm font-bold text-gray-700 outline-none transition-all resize-none ${
                    formErrors.address ? "border-red-300 bg-red-50/20" : "border-gray-200 focus:border-[#D4A017] focus:bg-white"
                  }`}
                />
              </div>
              {formErrors.address && <p className="text-[10px] text-red-500 font-bold">{formErrors.address}</p>}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-[#D4A017] hover:bg-[#5c0006] text-white h-11 rounded-xl font-black text-xs md:text-sm tracking-wide shadow-md transition-all uppercase flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Save size={15} />
              <span>{isSaving ? "Saving..." : t.saveBtn}</span>
            </button>
          </div>

          {saveSuccess && (
            <div className="bg-green-50 border border-green-200/60 rounded-xl p-3.5 text-xs font-bold text-green-700 flex items-center gap-2">
              <CheckCircle size={15} />
              <span>{t.saveOk}</span>
            </div>
          )}
        </form>

        {/* RIGHT COLUMN: ORDER HISTORY LIST */}
        <div className="col-span-1 lg:col-span-5 bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <h2 className="text-sm font-extrabold text-gray-800 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3">
            <ShoppingBag size={16} className="text-[#D4A017]" />
            <span>{t.ordersTitle}</span>
          </h2>

          {orders.length === 0 ? (
            <p className="text-xs text-gray-400 font-bold text-center py-6">{t.noOrders}</p>
          ) : (
            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
              {orders.map((ord) => (
                <div key={ord.id} className="bg-gray-50 border border-gray-200/50 rounded-2xl p-4 space-y-3 text-xs">
                  
                  <div className="flex justify-between items-center border-b border-gray-200/40 pb-2">
                    <span className="font-extrabold text-gray-900 font-mono">{ord.id}</span>
                    <span className={`px-2 py-0.5 rounded-full font-black text-[9px] uppercase tracking-wider ${
                      ord.status === "Delivered" ? "bg-green-100 text-green-700" :
                      ord.status === "Shipped" ? "bg-blue-100 text-blue-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {ord.status}
                    </span>
                  </div>

                  {/* Items Names list */}
                  <div className="text-[10px] text-gray-500 font-bold border-b border-gray-200/30 pb-2 space-y-1">
                    {ord.items && ord.items.map((it) => (
                      <div key={it.id} className="flex justify-between items-center text-gray-600">
                        <span className="truncate max-w-[80%]">• {language === "en" ? it.nameEn : it.nameBn}</span>
                        <span className="text-gray-400 font-mono">x{it.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-gray-500 font-bold">
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-gray-400">{t.orderDate}</span>
                      <span className="text-gray-700 font-mono">{ord.date}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-gray-400">{t.orderPayment}</span>
                      <span className="text-gray-700">{ord.paymentMethod}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-1.5 border-t border-gray-200/40 text-gray-900">
                    <span className="font-bold text-gray-400 uppercase text-[9px]">{t.orderTotal} ({ord.itemsCount} {language === "en" ? "items" : "টি"})</span>
                    <span className="font-black text-[#D4A017] text-sm">{convertPrice(ord.total, currency)} {getCurrencySymbol(currency)}</span>
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* Guarantee stamp */}
          <div className="pt-2 text-center text-[10px] text-gray-400 font-bold flex items-center justify-center gap-1 border-t border-gray-100">
            <ShieldCheck size={14} className="text-green-500" />
            <span>{language === "en" ? "Fashion Legacy Secured Account" : "ফ্যাশন লেগাসি সুরক্ষিত অ্যাকাউন্ট"}</span>
          </div>
        </div>

      </div>
    </Container>
  );
}
