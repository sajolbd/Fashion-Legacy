// app/auth/page.tsx
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import Container from "../../components/shared/Container";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, User, Phone, MapPin, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#D4A017] border-t-transparent"></div>
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}

function AuthContent() {
  const { user, isAuthenticated, login, signup } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/profile";

  // Tab State
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirect);
    }
  }, [isAuthenticated, router, redirect]);

  // Set Document Title
  useEffect(() => {
    document.title = activeTab === "login" 
      ? (language === "en" ? "Login | Fashion Legacy" : "লগইন | ফ্যাশন লেগাসি")
      : (language === "en" ? "Sign Up | Fashion Legacy" : "নিবন্ধন | ফ্যাশন লেগাসি");
  }, [activeTab, language]);

  // Localized texts
  const t = {
    en: {
      loginTab: "Login",
      signupTab: "Sign Up",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      nameLabel: "Full Name",
      phoneLabel: "Phone Number",
      addressLabel: "Delivery Address",
      loginBtn: "Login",
      signupBtn: "Create Account",
      mockCreds: "Testing Credentials (Password: any):",
      needAccount: "Don't have an account?",
      haveAccount: "Already have an account?",
      validationError: "Please fix form errors.",
      emailErr: "Valid email is required.",
      passErr: "Password must be at least 6 characters.",
      nameErr: "Name is required.",
      phoneErr: "Valid Bangladeshi phone number is required.",
      addressErr: "Address is required."
    },
    bn: {
      loginTab: "লগইন করুন",
      signupTab: "নিবন্ধন করুন",
      emailLabel: "ইমেইল এড্রেস",
      passwordLabel: "পাসওয়ার্ড",
      nameLabel: "পূর্ণ নাম",
      phoneLabel: "মোবাইল নম্বর",
      addressLabel: "ডেলিভারি ঠিকানা",
      loginBtn: "লগইন",
      signupBtn: "অ্যাকাউন্ট তৈরি করুন",
      mockCreds: "টেস্টিং ক্রেডেনশিয়াল (পাসওয়ার্ড: যেকোনো):",
      needAccount: "অ্যাকাউন্ট নেই?",
      haveAccount: "ইতিমধ্যে অ্যাকাউন্ট আছে?",
      validationError: "অনুগ্রহ করে ত্রুটিগুলো সমাধান করুন।",
      emailErr: "সঠিক ইমেইল ঠিকানা দিন।",
      passErr: "পাসওয়ার্ড কমপক্ষে ৬ ডিজিটের হতে হবে।",
      nameErr: "নাম লিখা আবশ্যক।",
      phoneErr: "সঠিক বাংলাদেশী মোবাইল নম্বর দিন।",
      addressErr: "ঠিকানা দেওয়া আবশ্যক।"
    }
  }[language];

  // Validation
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      errs.email = t.emailErr;
    }
    if (!password || password.length < 6) {
      errs.password = t.passErr;
    }

    if (activeTab === "signup") {
      if (!name.trim()) errs.name = t.nameErr;
      if (!phone.trim() || !/^(?:\+88|88)?(01[3-9]\d{8})$/.test(phone)) {
        errs.phone = t.phoneErr;
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      if (activeTab === "login") {
        await login(email, password);
      } else {
        await signup(name, email, phone);
      }
      router.push(redirect);
    } catch (err) {
      console.error("Auth error", err);
    } finally {
      setLoading(false);
    }
  };

  // Autofill mock user helper
  const handleAutofill = () => {
    setEmail("user@fashionlegacy.com");
    setPassword("password123");
  };

  return (
    <Container className="py-12 flex items-center justify-center min-h-[75vh]">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        
        {/* TABS HEADER */}
        <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
          <button
            onClick={() => {
              setActiveTab("login");
              setErrors({});
            }}
            className={`flex-1 text-center py-2.5 rounded-xl text-xs md:text-sm font-black uppercase transition-all select-none ${
              activeTab === "login"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {t.loginTab}
          </button>
          
          <button
            onClick={() => {
              setActiveTab("signup");
              setErrors({});
            }}
            className={`flex-1 text-center py-2.5 rounded-xl text-xs md:text-sm font-black uppercase transition-all select-none ${
              activeTab === "signup"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {t.signupTab}
          </button>
        </div>

        {/* MOCK CREDS AUTOFILL */}
        {activeTab === "login" && (
          <div className="bg-[#D4A017]/5 border border-[#D4A017]/10 rounded-2xl p-4 text-xs font-bold text-gray-700 flex justify-between items-center gap-3">
            <div className="space-y-0.5">
              <span className="block text-[10px] uppercase text-[#D4A017] font-black">{t.mockCreds}</span>
              <span className="block text-gray-500 font-mono">user@fashionlegacy.com</span>
            </div>
            <button
              type="button"
              onClick={handleAutofill}
              className="bg-[#D4A017] hover:bg-[#5c0006] text-white font-extrabold px-3 py-1.5 rounded-lg text-[10px] uppercase transition-colors"
            >
              {language === "en" ? "Autofill" : "অটোফিল"}
            </button>
          </div>
        )}

        {/* AUTH FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* SIGNUP SPECIFIC FIELDS */}
          {activeTab === "signup" && (
            <>
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
                    placeholder={language === "en" ? "e.g. Raihan Chowdhury" : "যেমন: রায়হান চৌধুরী"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full bg-gray-50 border rounded-xl pl-9 pr-4 py-2.5 text-xs md:text-sm font-bold text-gray-700 outline-none transition-all ${
                      errors.name ? "border-red-300 bg-red-50/20" : "border-gray-200 focus:border-[#D4A017] focus:bg-white"
                    }`}
                  />
                </div>
                {errors.name && <p className="text-[10px] text-red-500 font-bold">{errors.name}</p>}
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
                    placeholder="01XXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full bg-gray-50 border rounded-xl pl-9 pr-4 py-2.5 text-xs md:text-sm font-bold text-gray-700 outline-none transition-all ${
                      errors.phone ? "border-red-300 bg-red-50/20" : "border-gray-200 focus:border-[#D4A017] focus:bg-white"
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-[10px] text-red-500 font-bold">{errors.phone}</p>}
              </div>

            </>
          )}

          {/* COMMON FIELDS: Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">
              {t.emailLabel}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                placeholder="user@fashionlegacy.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-gray-50 border rounded-xl pl-9 pr-4 py-2.5 text-xs md:text-sm font-bold text-gray-700 outline-none transition-all ${
                  errors.email ? "border-red-300 bg-red-50/20" : "border-gray-200 focus:border-[#D4A017] focus:bg-white"
                }`}
              />
            </div>
            {errors.email && <p className="text-[10px] text-red-500 font-bold">{errors.email}</p>}
          </div>

          {/* COMMON FIELDS: Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">
              {t.passwordLabel}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-gray-50 border rounded-xl pl-9 pr-10 py-2.5 text-xs md:text-sm font-bold text-gray-700 outline-none transition-all ${
                  errors.password ? "border-red-300 bg-red-50/20" : "border-gray-200 focus:border-[#D4A017] focus:bg-white"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-[10px] text-red-500 font-bold">{errors.password}</p>}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D4A017] hover:bg-[#5c0006] text-white py-3 rounded-xl font-black text-xs md:text-sm tracking-wide shadow-md transition-all uppercase flex items-center justify-center gap-2 select-none"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{activeTab === "login" ? t.loginBtn : t.signupBtn}</span>
            )}
          </button>

        </form>

        {/* BOTTOM REDIRECT TOGGLE */}
        <div className="text-center text-xs font-bold text-gray-500 pt-2 border-t border-gray-100">
          {activeTab === "login" ? (
            <span>
              {t.needAccount}{" "}
              <button
                onClick={() => {
                  setActiveTab("signup");
                  setErrors({});
                }}
                className="text-[#D4A017] hover:underline"
              >
                {t.signupTab}
              </button>
            </span>
          ) : (
            <span>
              {t.haveAccount}{" "}
              <button
                onClick={() => {
                  setActiveTab("login");
                  setErrors({});
                }}
                className="text-[#D4A017] hover:underline"
              >
                {t.loginTab}
              </button>
            </span>
          )}
        </div>

      </div>
    </Container>
  );
}
