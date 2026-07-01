// components/layout/Footer.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  CreditCard
} from "lucide-react";
import Container from "../shared/Container";

export default function Footer() {
  const { language } = useLanguage();

  // Localized texts
  const t = {
    en: {
      aboutBrand: "Explore the legacy of premium fashion with our curated collections of outfits, footwear, and luxury accessories.",
      contactUs: "Contact Us",
      phoneLabel: "Phone",
      emailLabel: "Email",
      addressLabel: "Address",
      addressVal: "House 12, Road 4, Sector 7, Uttara, Dhaka, Bangladesh",
      categories: "Categories",
      women: "Women's Fashion",
      men: "Men's Fashion",
      shoes: "Premium Footwear",
      watches: "Luxury Watches",
      kids: "Kids & Toys",
      customerService: "Customer Service",
      helpCenter: "Help Center",
      howToBuy: "How to Buy",
      returnsRefunds: "Returns & Refunds",
      shippingInfo: "Shipping Info & Rates",
      faqs: "FAQs",
      guarantees: "Our Guarantees",
      secureCheckout: "100% Secure Checkout",
      cashOnDelivery: "Cash on Delivery Available",
      genuineGuarantee: "100% Genuine Products",
      copyright: "© 2026 Fashion Legacy. All rights reserved.",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service"
    },
    bn: {
      aboutBrand: "আমাদের আধুনিক ডিজাইনের পোশাক, জুতো এবং লাক্সারি ফ্যাশন এক্সেসরিজের কিউরেটেড কালেকশন নিয়ে সাজানো ফ্যাশন লেগাসি।",
      contactUs: "যোগাযোগ করুন",
      phoneLabel: "ফোন",
      emailLabel: "ইমেইল",
      addressLabel: "ঠিকানা",
      addressVal: "বাসা ১২, রোড ৪, সেক্টর ৭, উত্তরা, ঢাকা, বাংলাদেশ",
      categories: "ক্যাটাগরি",
      women: "মহিলাদের ফ্যাশন",
      men: "পুরুষদের ফ্যাশন",
      shoes: "প্রিমিয়াম জুতো",
      watches: "লাক্সারি ঘড়ি",
      kids: "শিশু এবং খেলনা",
      customerService: "গ্রাহক সেবা",
      helpCenter: "হেল্প সেন্টার",
      howToBuy: "কীভাবে কিনবেন",
      returnsRefunds: "রিটার্ন এবং রিফান্ড",
      shippingInfo: "শিপিং পলিসি ও চার্জ",
      faqs: "সাধারণ জিজ্ঞাসা",
      guarantees: "আমাদের প্রতিশ্রুতি",
      secureCheckout: "১০০% নিরাপদ পেমেন্ট",
      cashOnDelivery: "ক্যাশ অন ডেলিভারি সুবিধা",
      genuineGuarantee: "১০০% আসল পণ্যের নিশ্চয়তা",
      copyright: "© ২০২৬ ফ্যাশন লেগাসি। সর্বস্বত্ব সংরক্ষিত।",
      privacyPolicy: "গোপনীয়তা নীতি",
      termsOfService: "ব্যবহারের শর্তাবলী"
    }
  }[language];

  return (
    <footer className="bg-[#121212] text-[#b3b3b3] border-t border-gray-800 pt-16 pb-8 transition-colors duration-300">
      <Container className="space-y-12">
        
        {/* UPPER FOOTER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* COLUMN 1: BRAND PROFILE & CONTACT */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-block">
              <span className="text-xl md:text-2xl font-black tracking-wider text-white uppercase flex items-center gap-1.5">
                <span className="w-3.5 h-6 bg-[#740108] rounded-sm transform skew-x-12 inline-block" />
                <span>Fashion <span className="text-[#740108]">Legacy</span></span>
              </span>
            </Link>
            <p className="text-xs md:text-sm leading-relaxed text-gray-400">
              {t.aboutBrand}
            </p>
            
            {/* Contact Details */}
            <div className="space-y-3 pt-2 text-xs md:text-sm">
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-[#740108] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-[10px] font-bold text-gray-500 uppercase">{t.phoneLabel}</span>
                  <a href="tel:01307102810" className="font-extrabold text-white hover:text-[#740108] transition-colors">
                    {language === "en" ? "+880 1307-102810" : "+৮৮০ ১৩০৭১-০২৮১০"}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail size={16} className="text-[#740108] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-[10px] font-bold text-gray-500 uppercase">{t.emailLabel}</span>
                  <a href="mailto:support@fashionlegacy.com" className="font-bold text-gray-300 hover:text-white transition-colors">
                    support@fashionlegacy.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-[#740108] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-[10px] font-bold text-gray-500 uppercase">{t.addressLabel}</span>
                  <span className="text-gray-400">{t.addressVal}</span>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2: QUICK SHOP CATEGORIES */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-black uppercase text-white tracking-widest border-b border-gray-800 pb-2">
              {t.categories}
            </h3>
            <ul className="space-y-2 text-xs md:text-sm font-bold">
              <li>
                <Link href="/?category=cat_women" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  {t.women}
                </Link>
              </li>
              <li>
                <Link href="/?category=cat_men" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  {t.men}
                </Link>
              </li>
              <li>
                <Link href="/?category=cat_shoes" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  {t.shoes}
                </Link>
              </li>
              <li>
                <Link href="/?category=cat_watches" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  {t.watches}
                </Link>
              </li>
              <li>
                <Link href="/?category=cat_kids" className="hover:text-white hover:translate-x-1 transition-all inline-block">
                  {t.kids}
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: CUSTOMER SERVICES */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-black uppercase text-white tracking-widest border-b border-gray-800 pb-2">
              {t.customerService}
            </h3>
            <ul className="space-y-2 text-xs md:text-sm font-bold">
              <li>
                <a href="#help" className="hover:text-white transition-colors">
                  {t.helpCenter}
                </a>
              </li>
              <li>
                <a href="#buy" className="hover:text-white transition-colors">
                  {t.howToBuy}
                </a>
              </li>
              <li>
                <a href="#returns" className="hover:text-white transition-colors">
                  {t.returnsRefunds}
                </a>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-white transition-colors">
                  {t.shippingInfo}
                </Link>
              </li>
              <li>
                <a href="#faqs" className="hover:text-white transition-colors">
                  {t.faqs}
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: TRUST SEALS & PAYMENT SUPPORT */}
          <div className="lg:col-span-3 space-y-5">
            <h3 className="text-xs font-black uppercase text-white tracking-widest border-b border-gray-800 pb-2">
              {t.guarantees}
            </h3>
            
            <div className="space-y-3.5">
              <div className="flex items-center gap-2.5 text-xs">
                <ShieldCheck size={18} className="text-green-500 flex-shrink-0" />
                <span className="font-bold text-gray-300">{t.secureCheckout}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs">
                <Truck size={18} className="text-blue-400 flex-shrink-0" />
                <span className="font-bold text-gray-300">{t.cashOnDelivery}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs">
                <RotateCcw size={18} className="text-amber-400 flex-shrink-0" />
                <span className="font-bold text-gray-300">{t.genuineGuarantee}</span>
              </div>
            </div>

            {/* Payment gateway logos mockup */}
            <div className="pt-2">
              <div className="flex gap-2 flex-wrap">
                <div className="bg-gray-800 hover:bg-gray-700/80 px-2.5 py-1.5 rounded-lg border border-gray-700 flex items-center justify-center font-black text-[9px] text-[#D12053] tracking-wide transition-colors select-none">
                  bKash
                </div>
                <div className="bg-gray-800 hover:bg-gray-700/80 px-2.5 py-1.5 rounded-lg border border-gray-700 flex items-center justify-center font-black text-[9px] text-[#F15A22] tracking-wide transition-colors select-none">
                  Nagad
                </div>
                <div className="bg-gray-800 hover:bg-gray-700/80 px-2.5 py-1.5 rounded-lg border border-gray-700 flex items-center justify-center font-black text-[9px] text-[#8C3494] tracking-wide transition-colors select-none">
                  Rocket
                </div>
                <div className="bg-gray-800 hover:bg-gray-700/80 px-2.5 py-1.5 rounded-lg border border-gray-700 flex items-center justify-center font-black text-[9px] text-gray-300 tracking-wide transition-colors select-none uppercase">
                  COD
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* LOWER FOOTER */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          
          <div className="font-medium text-gray-500">
            {t.copyright}
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors bg-gray-800/60 p-2 rounded-full hover:bg-[#740108]">
              <Facebook size={16} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors bg-gray-800/60 p-2 rounded-full hover:bg-[#740108]">
              <Instagram size={16} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors bg-gray-800/60 p-2 rounded-full hover:bg-[#740108]">
              <Twitter size={16} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors bg-gray-800/60 p-2 rounded-full hover:bg-[#740108]">
              <Youtube size={16} />
            </a>
          </div>

          {/* Terms & Policies */}
          <div className="flex items-center gap-4 font-bold text-gray-500">
            <a href="#privacy" className="hover:text-gray-300 transition-colors">
              {t.privacyPolicy}
            </a>
            <a href="#terms" className="hover:text-gray-300 transition-colors">
              {t.termsOfService}
            </a>
          </div>

        </div>

      </Container>
    </footer>
  );
}
