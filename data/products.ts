// data/products.ts

export interface ProductColor {
  nameEn: string;
  nameBn: string;
  hex: string;
}

export interface Product {
  id: string;
  nameEn: string;
  nameBn: string;
  descriptionEn: string;
  descriptionBn: string;
  category: string | string[];
  priceUSD: number;
  discountPercent: number; // e.g. 40 for 40% discount
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  rating: number;
  reviewsCount: number;
  featuresEn: string[];
  featuresBn: string[];
}

export const CURRENCIES = [
  { code: "BDT", symbol: "৳", rate: 1, label: "BDT (৳)" },
  { code: "USD", symbol: "$", rate: 1 / 120, label: "USD ($)" },
  { code: "SAR", symbol: "SR", rate: 3.75 / 120, label: "SAR (SR)" }
] as const;

export function convertPrice(priceUSD: number, currency: string) {
  const currObj = CURRENCIES.find(c => c.code === currency);
  const rate = currObj ? currObj.rate : 1;
  return (priceUSD * rate).toFixed(2);
}

export function getCurrencySymbol(currency: string) {
  const currObj = CURRENCIES.find(c => c.code === currency);
  return currObj ? currObj.symbol : "$";
}

export function getProductImageUrl(src: string) {
  if (!src) return "/images/logo.png";
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
    return src;
  }
  
  // Resolve backend uploaded files to absolute URLs
  if (src.startsWith("/uploads/")) {
    const rawApiUrl = 
      process.env.NEXT_PUBLIC_API_URL || 
      (typeof window !== "undefined"
        ? (window.location.hostname.includes("fashionlegacy.live") || window.location.hostname.includes("vercel.app")
            ? "https://fashion-legacy-backend.vercel.app" 
            : `http://${window.location.hostname}:5000`)
        : "http://localhost:5000");
    const apiBaseUrl = rawApiUrl.endsWith("/") ? rawApiUrl.slice(0, -1) : rawApiUrl;
    return `${apiBaseUrl}${src}`;
  }
  
  return src;
}

export const PRODUCTS: Product[] = [
  /* ================== CAT_HOT (HOT SALE) ================== */
  // {
  //   id: "prod-hot-1",
  //   nameEn: "Chic Woolen Knitted Cardigan",
  //   nameBn: "চটকদার উলের বোনা কার্ডিগান",
  //   descriptionEn: "Wrap yourself in cozy luxury. Expertly knitted from extra-fine merino wool blend, this cardigan offers unmatched warmth with a sophisticated front drop silhouette.",
  //   descriptionBn: "আরাম ও বিলাসিতার চমৎকার সংমিশ্রণ। অতিরিক্ত মিহি মেরিনো উলের মিশ্রণে নিখুঁতভাবে তৈরি এই কার্ডিগানটি অসাধারণ উষ্ণতা এবং অত্যন্ত আধুনিক লুক প্রদান করবে।",
  //   category: "cat_hot",
  //   priceUSD: 69.99,
  //   discountPercent: 50,
  //   images: [
  //     "/images/products/cardigan_1.png"
  //   ],
  //   sizes: ["S", "M", "L"],
  //   colors: [
  //     { nameEn: "Creamy Beige", nameBn: "ক্রিম বেইজ", hex: "#F5F5DC" },
  //     { nameEn: "Dusty Rose", nameBn: "হালকা গোলাপী", hex: "#D8BFD8" }
  //   ],
  //   rating: 4.8,
  //   reviewsCount: 110,
  //   featuresEn: ["Merino wool extra soft blend", "Elegant drop-front structure", "Side pockets and ribbed sleeve cuffs"],
  //   featuresBn: ["মেরিনো উলের অতিরিক্ত নরম সুতো", "চমৎকার ড্রপ-ফ্রন্ট শেপ ডিজাইন", "পার্শ্ববর্তী পকেট ও বিশেষ হাতার বর্ডার"]
  // },
  // {
  //   id: "prod-hot-2",
  //   nameEn: "Casual Linen Shirt Long Sleeve",
  //   nameBn: "ক্যাজুয়াল লিনেন শার্ট ফুল হাতা",
  //   descriptionEn: "Stay fresh and fashionable in warmer weather. This premium pure linen shirt offers a loose, casual drape with a structured spread collar. Double stitched for high durability.",
  //   descriptionBn: "গরমের আবহাওয়ায় থাকুন সতেজ ও স্টাইলিশ। এই প্রিমিয়াম পিওর লিনেন শার্টটি ঢিলেঢালা আরামদায়ক ফিট এবং চমৎকার কলার ডিজাইন প্রদান করে। দীর্ঘস্থায়িত্বের জন্য ডাবল স্টিচ করা।",
  //   category: "cat_hot",
  //   priceUSD: 39.99,
  //   discountPercent: 45,
  //   images: [
  //     "/images/products/linen_shirt_1.png"
  //   ],
  //   sizes: ["S", "M", "L", "XL"],
  //   colors: [
  //     { nameEn: "Ocean Blue", nameBn: "সাগর নীল", hex: "#4682B4" },
  //     { nameEn: "Desert Khaki", nameBn: "মরু খাকি", hex: "#F0E68C" }
  //   ],
  //   rating: 4.5,
  //   reviewsCount: 72,
  //   featuresEn: ["100% organic pure linen", "Relaxed fit structure", "Spread collar detailing"],
  //   featuresBn: ["১০০% অরগানিক পিওর লিনেন কাপড়", "আরামদায়ক রিলাক্সড ফিট গঠন", "সুন্দর স্প্রেড কলার ডিজাইন"]
  // },
  // {
  //   id: "prod-hot-3",
  //   nameEn: "Retro Leather Street Sneaker",
  //   nameBn: "রেট্রো লেদার স্ট্রিট স্নিকার",
  //   descriptionEn: "Classic street style meets modern leather cushioning. Features wear-resistant vulcanized rubber sole and vintage color block overlays for absolute styling.",
  //   descriptionBn: "ক্লাসিক স্ট্রিট স্টাইল ও আধুনিক কুশনিংয়ের চমৎকার মেলবন্ধন। এতে রয়েছে ক্ষয়-প্রতিরোধী রাবার সোল এবং চমৎকার ভিন্টেজ কালার ব্লক ডিজাইন।",
  //   category: "cat_hot",
  //   priceUSD: 89.99,
  //   discountPercent: 30,
  //   images: [
  //     "/images/products/leather_sneaker_1.png"
  //   ],
  //   sizes: ["40", "41", "42", "43"],
  //   colors: [
  //     { nameEn: "Retro Red", nameBn: "রেট্রো লাল", hex: "#8B0000" },
  //     { nameEn: "Stealth Black", nameBn: "কালো", hex: "#111111" }
  //   ],
  //   rating: 4.7,
  //   reviewsCount: 95,
  //   featuresEn: ["Premium cowhide leather panels", "Vulcanized slip-resistant sole", "Vintage color-blocked details"],
  //   featuresBn: ["উন্নত চামড়ার প্যানেল কারুকাজ", "অ্যান্টি-স্লিপ রাবার সোল", "চমৎকার ভিন্টেজ কালার ব্লক"]
  // },
  // {
  //   id: "prod-hot-4",
  //   nameEn: "Minimalist Gold Edition Watch",
  //   nameBn: "মিনিমালিস্ট গোল্ড এডিশন ঘড়ি",
  //   descriptionEn: "Timeless simplicity meets modern gold premium look. Slim dial with high-grade quartz movement and a beautiful adjustable gold mesh bracelet.",
  //   descriptionBn: "সরলতা এবং রাজকীয় গোল্ডেন লুকের চমৎকার মেলবন্ধন। স্লিম ডায়াল, উন্নত কোয়ার্টজ মেকানিজম এবং সুন্দর গোল্ডেন বেল্ট আপনার হাতের সৌন্দর্য বাড়িয়ে তুলবে বহুগুণ।",
  //   category: "cat_hot",
  //   priceUSD: 119.99,
  //   discountPercent: 20,
  //   images: [
  //     "/images/products/gold_watch_1.png"
  //   ],
  //   sizes: ["One Size"],
  //   colors: [
  //     { nameEn: "Pure Gold", nameBn: "খাঁটি সোনা", hex: "#FFD700" },
  //     { nameEn: "Rose Gold", nameBn: "রোজ গোল্ড", hex: "#B76E79" }
  //   ],
  //   rating: 4.8,
  //   reviewsCount: 64,
  //   featuresEn: ["Sleek ultra-thin dial casing", "Adjustable stainless steel mesh strap", "Premium quartz precision mechanism"],
  //   featuresBn: ["অত্যন্ত স্লিম ও মসৃণ ডায়াল কেসিং", "অ্যাডজাস্টেবল স্টেইনলেস স্টিল গোল্ডেন বেল্ট", "প্রিমিয়াম কোয়ার্টজ নিখুঁত মেকানিজম"]
  // },
  // {
  //   id: "prod-hot-5",
  //   nameEn: "Slim Fit Stretch Chino Pants",
  //   nameBn: "স্লিম ফিট স্ট্রেচ চিনো প্যান্ট",
  //   descriptionEn: "Perfect smart-casual bottoms. Made from high-grade cotton-spandex blend for lightweight flexibility and structured silhouette.",
  //   descriptionBn: "স্মার্ট-ক্যাজুয়াল লুকের জন্য একদম উপযুক্ত। উন্নত মানের কটন ও স্প্যানডেক্স কাপড়ে তৈরি যা একই সাথে আরামদায়ক ও চমৎকার ফিট দেয়।",
  //   category: "cat_hot",
  //   priceUSD: 45.00,
  //   discountPercent: 15,
  //   images: [
  //     "/images/products/chino_pants_1.png"
  //   ],
  //   sizes: ["30", "32", "34", "36"],
  //   colors: [
  //     { nameEn: "Navy Blue", nameBn: "নেভি ব্লু", hex: "#000080" },
  //     { nameEn: "Olive Green", nameBn: "অলিভ সবুজ", hex: "#556B2F" }
  //   ],
  //   rating: 4.6,
  //   reviewsCount: 48,
  //   featuresEn: ["Premium cotton stretch twill", "Deep side and back pockets", "Durable button zipper fly closure"],
  //   featuresBn: ["প্রিমিয়াম কটন স্ট্রেচ কাপড়", "গভীর সাইড ও ব্যাক পকেট", "দীর্ঘস্থায়ী জিপার ও বোতাম সিস্টেম"]
  // },

  // /* ================== CAT_WOMEN (WOMEN'S FASHION) ================== */
  // {
  //   id: "prod-women-1",
  //   nameEn: "Vintage Floral Summer Maxi Dress",
  //   nameBn: "ভিন্টেজ ফ্লোরাল সামার ম্যাক্সি ড্রেস",
  //   descriptionEn: "Experience supreme comfort and breezy elegance in our floral maxi dress. Perfect for sunny day outings, garden parties, or beach retreats.",
  //   descriptionBn: "আমাদের ভিন্টেজ ফ্লোরাল ম্যাক্সি ড্রেসে পাবেন অসাধারণ আরাম এবং স্নিগ্ধতা। রৌদ্রোজ্জ্বল দিনে বাইরে ঘুরতে যাওয়া বা সমুদ্র সৈকতে পরার জন্য এটি একদম উপযুক্ত।",
  //   category: "cat_women",
  //   priceUSD: 49.99,
  //   discountPercent: 30,
  //   images: [
  //     "/images/products/maxi_dress_1.png"
  //   ],
  //   sizes: ["S", "M", "L", "XL"],
  //   colors: [
  //     { nameEn: "Peach Puff", nameBn: "পিচ", hex: "#FFDAB9" },
  //     { nameEn: "Emerald", nameBn: "পান্না সবুজ", hex: "#50C878" }
  //   ],
  //   rating: 4.8,
  //   reviewsCount: 124,
  //   featuresEn: ["Breathable linen blend fabric", "Delicate floral print detailing", "Flowing split hem design"],
  //   featuresBn: ["উন্নত মানের সুতি ও লিনেন মিশ্রিত কাপড়", "মনোমুগ্ধকর ফ্লোরাল প্রিন্ট কারুকাজ", "সহজে চলাচলের জন্য স্প্লিট হেম ডিজাইন"]
  // },
  // {
  //   id: "prod-women-2",
  //   nameEn: "Modern Silk Evening Gown",
  //   nameBn: "মডার্ন সিল্ক ইভনিং গাউন",
  //   descriptionEn: "Command attention in any party. Made from luxurious pure mulberry silk with a sophisticated drop-waist wrap-around design and glowing sheer finish.",
  //   descriptionBn: "যে কোনো পার্টিতে সবার নজর কাড়ুন। প্রিমিয়াম খাঁটি তুঁত সিল্ক সুতোয় তৈরি চমৎকার রেশমি গাউন যা আপনাকে দেবে অত্যন্ত আকর্ষণীয় ও জমকালো ফ্যাশন লুক।",
  //   category: "cat_women",
  //   priceUSD: 129.99,
  //   discountPercent: 20,
  //   images: [
  //     "/images/products/evening_gown_1.png"
  //   ],
  //   sizes: ["XS", "S", "M", "L"],
  //   colors: [
  //     { nameEn: "Ruby Red", nameBn: "রুবি লাল", hex: "#E0115F" },
  //     { nameEn: "Midnight Black", nameBn: "কালো", hex: "#0B0C10" }
  //   ],
  //   rating: 4.9,
  //   reviewsCount: 42,
  //   featuresEn: ["100% pure mulberry silk texture", "Elegant pleated wrap silhouette", "Invisible side zipper entry"],
  //   featuresBn: ["১০০% খাঁটি মালবেরি সিল্ক কাপড়", "চমৎকার কুঁচি করা ড্র্যাপ লুক", "সাইডের লুকানো প্রিমিয়াম জিপার"]
  // },
  // {
  //   id: "prod-women-3",
  //   nameEn: "Casual Cotton T-Shirt Dress",
  //   nameBn: "ক্যাজুয়াল কটন টি-শার্ট ড্রেস",
  //   descriptionEn: "The ultimate easygoing day dress. Features clean round crew neck, short sleeves, and relaxed straight drape. Made of premium hypoallergenic combed cotton.",
  //   descriptionBn: "সবচেয়ে সহজ ও ক্যাজুয়াল আউটফিট। এতে রয়েছে আরামদায়ক গোল গলা, ছোট হাতা এবং সোজা ঢিলেঢালা ফিটিং। উন্নত মানের আরামদায়ক কম্বড সুতি কাপড়ে তৈরি।",
  //   category: "cat_women",
  //   priceUSD: 24.99,
  //   discountPercent: 10,
  //   images: [
  //     "/images/products/tshirt_dress_1.png"
  //   ],
  //   sizes: ["S", "M", "L", "XL"],
  //   colors: [
  //     { nameEn: "Heather Grey", nameBn: "ছাই রঙ", hex: "#808080" },
  //     { nameEn: "Soft Lavender", nameBn: "হালকা বেগুনি", hex: "#E6E6FA" }
  //   ],
  //   rating: 4.4,
  //   reviewsCount: 88,
  //   featuresEn: ["Premium lightweight combed cotton", "Reinforced crew neck seam", "Double stitched bottom hemline"],
  //   featuresBn: ["উন্নত ও হালকা কম্বড সুতি কাপড়", "দীর্ঘস্থায়ী গোল গলা সেলাই", "নিচের ডাবল স্টিচ বর্ডার লাইনিং"]
  // },
  // {
  //   id: "prod-women-4",
  //   nameEn: "Elegant Trench Coat Long",
  //   nameBn: "এলিগেন্ট লং ট্রেঞ্চ কোট",
  //   descriptionEn: "Classic style for chilly months. Heavyweight windproof cotton gabardine weave, dynamic notched collar line, and adjustable utility waist belt.",
  //   descriptionBn: "হালকা শীতের মাসগুলোর জন্য ক্লাসিক পোশাক। উন্নত মানের বায়ুরোধী কটন গ্যাবার্ডিন কাপড়, আকর্ষণীয় কলার ডিজাইন এবং মানানসই কোমরের বেল্টযুক্ত।",
  //   category: "cat_women",
  //   priceUSD: 99.99,
  //   discountPercent: 25,
  //   images: [
  //     "/images/products/trench_coat_1.png"
  //   ],
  //   sizes: ["M", "L", "XL"],
  //   colors: [
  //     { nameEn: "Desert Tan", nameBn: "মরু তামাটে", hex: "#D2B48C" },
  //     { nameEn: "Forest Green", nameBn: "গাঢ় সবুজ", hex: "#228B22" }
  //   ],
  //   rating: 4.7,
  //   reviewsCount: 57,
  //   featuresEn: ["Windproof cotton gabardine fabric", "Detailed notched lapels", "Traditional double-breasted closure"],
  //   featuresBn: ["বায়ুরোধী প্রিমিয়াম গ্যাবার্ডিন কটন", "আকর্ষণীয় ডাবল কলার ডিজাইন", "ক্ল্যাসিক ডাবল ব্রেস্টেড বোতাম"]
  // },
  // {
  //   id: "prod-women-5",
  //   nameEn: "Retro Denim Button-Up Skirt",
  //   nameBn: "রেট্রো ডেনিম বোতাম স্কার্ট",
  //   descriptionEn: "Bring vintage vibes back. A-line denim skirt featuring full-length front metallic buttons and deep functional front hand pockets.",
  //   descriptionBn: "ফিরে পান ভিন্টেজ ফ্যাশন লুক। এ-লাইন শেপের ডেনিম স্কার্ট যাতে রয়েছে সামনের সম্পূর্ণ ধাতব বোতাম এবং গভীর ও চমৎকার পকেট ডিজাইন।",
  //   category: "cat_women",
  //   priceUSD: 34.99,
  //   discountPercent: 15,
  //   images: [
  //     "/images/products/denim_skirt_1.png"
  //   ],
  //   sizes: ["26", "28", "30", "32"],
  //   colors: [
  //     { nameEn: "Light Wash Blue", nameBn: "হালকা নীল ডেনিম", hex: "#ADD8E6" },
  //     { nameEn: "Raw Denim Navy", nameBn: "গাঢ় নীল ডেনিম", hex: "#000080" }
  //   ],
  //   rating: 4.5,
  //   reviewsCount: 63,
  //   featuresEn: ["Sturdy raw cotton denim twill", "Classic metallic hardware snaps", "Utility front hand pockets"],
  //   featuresBn: ["শক্তিশালী প্রিমিয়াম কটন ডেনিম কাপড়", "ক্ল্যাসিক ধাতব বোতামের স্ন্যাপস", "কার্যকরী ও বড় সাইড পকেট"]
  // },

  // /* ================== CAT_MEN (MEN'S FASHION) ================== */
  // {
  //   id: "prod-men-1",
  //   nameEn: "Premium Urban Denim Jacket",
  //   nameBn: "প্রিমিয়াম আরবান ডেনিম জ্যাকেট",
  //   descriptionEn: "A timeless wardrobe staple. Crafted from premium organic cotton denim with distressed details. Designed for a structured fit.",
  //   descriptionBn: "সব ঋতুর জন্য মানানসই ও চমৎকার পোশাক। হালকা স্ক্র্যাচ ডিজাইনের প্রিমিয়াম অর্গানিক কটন ডেনিম কাপড়ে তৈরি যা আপনাকে দেবে আকর্ষণীয় স্টাইলিশ ফিট।",
  //   category: "cat_men",
  //   priceUSD: 59.99,
  //   discountPercent: 25,
  //   images: [
  //     "/images/products/denim_jacket_1.png"
  //   ],
  //   sizes: ["M", "L", "XL", "XXL"],
  //   colors: [
  //     { nameEn: "Classic Blue", nameBn: "ক্ল্যাসিক নীল", hex: "#3B5998" },
  //     { nameEn: "Charcoal Black", nameBn: "কয়লা কালো", hex: "#2B2B2B" }
  //   ],
  //   rating: 4.7,
  //   reviewsCount: 98,
  //   featuresEn: ["100% premium organic cotton", "Distressed vintage accents", "Double chest pockets with metal snaps"],
  //   featuresBn: ["১০০% খাঁটি প্রিমিয়াম অর্গানিক কটন", "আকর্ষণীয় ভিন্টেজ স্ক্র্যাচ লুক", "ধাতব বোতামসহ দুটি বুকের পকেট"]
  // },
  // {
  //   id: "prod-men-2",
  //   nameEn: "Classic Crewneck Sweatshirt",
  //   nameBn: "ক্ল্যাসিক ক্রু-নেক সোয়েটশার্ট",
  //   descriptionEn: "Cozy utility at its best. Mid-weight French terry fleece fabric with ribbed collar, hem and cuffs. Pre-shrunk for a long-lasting perfect fit.",
  //   descriptionBn: "সবচেয়ে আরামদায়ক ও ক্যাজুয়াল উইন্টার পোশাক। উন্নত মানের ফ্রেঞ্চ টেরি ফ্লিস কাপড়, এবং কলার ও হাতায় বিশেষ বর্ডার দিয়ে চমৎকারভাবে ডিজাইনকৃত।",
  //   category: "cat_men",
  //   priceUSD: 34.99,
  //   discountPercent: 20,
  //   images: [
  //     "/images/products/sweatshirt_1.png"
  //   ],
  //   sizes: ["S", "M", "L", "XL"],
  //   colors: [
  //     { nameEn: "Slate Grey", nameBn: "ধূসর", hex: "#708090" },
  //     { nameEn: "Burgundy Red", nameBn: "মেরুন লাল", hex: "#800020" }
  //   ],
  //   rating: 4.6,
  //   reviewsCount: 76,
  //   featuresEn: ["Soft knit French terry interior", "Double-needle cover stitched seams", "Anti-shrinkage pre-washed fabric"],
  //   featuresBn: ["নরম আরামদায়ক ফ্রেঞ্চ টেরি সুতি কাপড়", "মজবুত ডাবল নিডেল কভার সেলাই", "কুঁচকে যাওয়া প্রতিরোধী ওয়াশড ফেব্রিক"]
  // },
  // {
  //   id: "prod-men-3",
  //   nameEn: "Fitted Oxford Cotton Shirt",
  //   nameBn: "ফিটেড অক্সফোর্ড কটন শার্ট",
  //   descriptionEn: "Essential smart dress shirt. Heavy Oxford weave cotton fabric, button-down collar structure, and curved tails for clean tuck-in silhouette.",
  //   descriptionBn: "অফিস বা ফর্মাল ক্যাজুয়াল পরার জন্য অপরিহার্য শার্ট। ভারী প্রিমিয়াম অক্সফোর্ড ওভেন কটন কাপড় এবং সুন্দর বাটন-ডাউন কলার সিস্টেমে তৈরি।",
  //   category: "cat_men",
  //   priceUSD: 44.99,
  //   discountPercent: 15,
  //   images: [
  //     "/images/products/oxford_shirt_1.png"
  //   ],
  //   sizes: ["S", "M", "L", "XL", "XXL"],
  //   colors: [
  //     { nameEn: "Sky Blue", nameBn: "আকাশী নীল", hex: "#87CEEB" },
  //     { nameEn: "Clean White", nameBn: "সাদা", hex: "#FFFFFF" }
  //   ],
  //   rating: 4.5,
  //   reviewsCount: 112,
  //   featuresEn: ["Premium heavyweight Oxford weave", "Button-down collar structure", "Chest patch storage pocket"],
  //   featuresBn: ["উন্নত মানের ভারী অক্সফোর্ড বুনন", "স্মার্ট বোতাম সিস্টেম বাটন-ডাউন কলার", "বুকের বামপাশে একটি ছোট পকেট"]
  // },
  // {
  //   id: "prod-men-4",
  //   nameEn: "Smart Casual Slim Blazer",
  //   nameBn: "স্মার্ট ক্যাজুয়াল স্লিম ব্লেজার",
  //   descriptionEn: "Elevate your look instantly. Lightweight unlined structure, dual back vents, notched lapel lines, and detailed horn-button closures.",
  //   descriptionBn: "মুহূর্তেই আপনার লুককে আকর্ষণীয় করে তুলুন। লাইটওয়েট স্ট্রাকচারাল ফেব্রিক, পেছনে দুটি ভেন্ট এবং আকর্ষণীয় হর্ন বাটনের বোতাম দিয়ে তৈরি।",
  //   category: "cat_men",
  //   priceUSD: 109.99,
  //   discountPercent: 30,
  //   images: [
  //     "/images/products/slim_blazer_1.png"
  //   ],
  //   sizes: ["38", "40", "42", "44"],
  //   colors: [
  //     { nameEn: "Stone Beige", nameBn: "তামাটে ধূসর", hex: "#C5B358" },
  //     { nameEn: "Navy Blue", nameBn: "নেভি ব্লু", hex: "#000080" }
  //   ],
  //   rating: 4.8,
  //   reviewsCount: 39,
  //   featuresEn: ["Breathable stretch poly-viscose", "Sophisticated notched lapel collar", "Dual functional front flap pockets"],
  //   featuresBn: ["স্মার্ট স্ট্রেচ পলিয়েস্টার বডি বুনন", "অত্যন্ত স্টাইলিশ কলার ডিজাইন", "সামনে ঢাকনাযুক্ত দুটি পকেট"]
  // },
  // {
  //   id: "prod-men-5",
  //   nameEn: "Slim Fit Tech Cargo Pants",
  //   nameBn: "স্লিম ফিট টেক কার্গো প্যান্ট",
  //   descriptionEn: "Modern utilitarian style. Water-resistant nylon tech fabric, elasticated waist belt loops, and zipped side multi-pocket storage setup.",
  //   descriptionBn: "আধুনিক ও ট্রেন্ডি কার্গো প্যান্ট। উন্নত ওয়াটার-রেজিস্ট্যান্ট নাইলন ফ্যাব্রিক, ইলাস্টিক লুপ এবং জিপারযুক্ত একাধিক সুবিধাজনক পকেটের সমন্বয়।",
  //   category: "cat_men",
  //   priceUSD: 49.99,
  //   discountPercent: 20,
  //   images: [
  //     "/images/products/cargo_pants_1.png"
  //   ],
  //   sizes: ["30", "32", "34", "36"],
  //   colors: [
  //     { nameEn: "Military Olive", nameBn: "জলপাই সবুজ", hex: "#3B5323" },
  //     { nameEn: "Midnight Black", nameBn: "কুচকুচে কালো", hex: "#0A0A0A" }
  //   ],
  //   rating: 4.6,
  //   reviewsCount: 54,
  //   featuresEn: ["Water-repellent nylon stretch blend", "Secure zip-closed cargo side pockets", "Articulated knees for extra movement"],
  //   featuresBn: ["ওয়াটার-রেপেলেন্ট নাইলন স্ট্রেচ সুতো", "জিপারসহ সুরক্ষিত কার্গো পকেট", "হাঁটু সহজে ভাঁজ করার আরামদায়ক ডিজাইন"]
  // },

  // /* ================== CAT_SHOES (SHOES) ================== */
  // {
  //   id: "prod-shoes-1",
  //   nameEn: "Ultra-Lightweight Athletic Sneakers",
  //   nameBn: "আল্ট্রা-লাইটওয়েট অ্যাথলেটিক স্নিকার্স",
  //   descriptionEn: "Engineered for maximum speed and endurance. Featuring high-grade responsive foam cushions, lightweight breathable mesh upper.",
  //   descriptionBn: "দৌড়ানো ও হাঁটার সময় সর্বোচ্চ গতি ও স্থায়িত্বের জন্য ডিজাইনকৃত। উন্নত কুশনিং ফোম, হালকা বাতাস চলাচলের উপযোগী নেট কাপড়ের উপরের অংশ রয়েছে এতে।",
  //   category: "cat_shoes",
  //   priceUSD: 79.99,
  //   discountPercent: 40,
  //   images: [
  //     "/images/products/shoes_sneakers_1.png"
  //   ],
  //   sizes: ["39", "40", "41", "42", "43"],
  //   colors: [
  //     { nameEn: "Crimson Gold", nameBn: "লাল সোনালী", hex: "#B22234" },
  //     { nameEn: "Stealth Black", nameBn: "কালো", hex: "#111111" }
  //   ],
  //   rating: 4.9,
  //   reviewsCount: 156,
  //   featuresEn: ["Responsive cushion sole padding", "Breathable mesh dynamic fit", "Non-slip high performance rubber grip"],
  //   featuresBn: ["নরম আরামদায়ক সোল প্যাডিং", "বাতাস চলাচলের উপযোগী ডায়নামিক ফিট নেট", "উন্নত গ্রিপসমৃদ্ধ অ্যান্টি-স্লিপ রাবার সোল"]
  // },
  // {
  //   id: "prod-shoes-2",
  //   nameEn: "Urban Streetwear High-Tops",
  //   nameBn: "আরবান স্ট্রিটওয়্যার হাই-টপ জুতো",
  //   descriptionEn: "Step up your street style. Heavy canvas fabric build, protective round vulcanized toe-cap design, and high ankle strap support.",
  //   descriptionBn: "আপনার ক্যাজুয়াল জুতো কালেকশনে নিয়ে আসুন পরিবর্তন। শক্ত ক্যানভাস কাপড়, সামনের অংশে ধাতব ও রাবার প্রটেক্টর এবং অ্যাঙ্কেল সাপোর্ট দিয়ে তৈরি।",
  //   category: "cat_shoes",
  //   priceUSD: 69.99,
  //   discountPercent: 30,
  //   images: [
  //     "/images/products/shoes_hightops_1.png"
  //   ],
  //   sizes: ["40", "41", "42", "43", "44"],
  //   colors: [
  //     { nameEn: "Monochrome Black", nameBn: "সলিড কালো", hex: "#1C1C1C" },
  //     { nameEn: "Classic Ivory", nameBn: "আইভরি সাদা", hex: "#FFFFF0" }
  //   ],
  //   rating: 4.7,
  //   reviewsCount: 114,
  //   featuresEn: ["Durable 12oz cotton canvas", "Padded high ankle supportive collar", "Anti-skid waffle-patterned sole"],
  //   featuresBn: ["টেকসই কটন ক্যানভাস ফেব্রিক", "নরম প্যাডেড হাই অ্যাঙ্কেল সাপোর্ট", "পিছলে যাওয়া প্রতিরোধী বিশেষ সোল ডিজাইন"]
  // },
  // {
  //   id: "prod-shoes-3",
  //   nameEn: "Classic Suede Loafers",
  //   nameBn: "ক্ল্যাসিক সুয়েড লোফার্স",
  //   descriptionEn: "Timeless slip-on style. Hand-stitched premium calfskin suede leather, leather lined insoles, and low stacked heel details for premium comfort.",
  //   descriptionBn: "সহজে পা গলানো আরামদায়ক ফর্মাল জুতো। প্রিমিয়াম বাছুরের নরম চামড়া, উন্নত ইনসোল এবং অল্প হিল দেওয়া ক্লাসিক সোল আপনার আরাম নিশ্চিত করবে।",
  //   category: "cat_shoes",
  //   priceUSD: 89.99,
  //   discountPercent: 20,
  //   images: [
  //     "/images/shoes_sneakers_3.png"
  //   ],
  //   sizes: ["39", "40", "41", "42", "43"],
  //   colors: [
  //     { nameEn: "Rich Tan", nameBn: "তামাটে বাদামী", hex: "#B8860B" },
  //     { nameEn: "Navy Blue", nameBn: "নেভি ব্লু", hex: "#000080" }
  //   ],
  //   rating: 4.6,
  //   reviewsCount: 73,
  //   featuresEn: ["Extra soft Italian calfskin suede", "Moisture-wicking leather lining", "Traditional moc-toe hand stitching"],
  //   featuresBn: ["অতিরিক্ত নরম ইতালীয় সুয়েড লেদার", "ঘাম শোষক প্রিমিয়াম চামড়ার লাইনিং", "ঐতিহ্যবাহী হাতের নিখুঁত নকশা সেলাই"]
  // },
  // {
  //   id: "prod-shoes-4",
  //   nameEn: "Premium Leather Chelsea Boots",
  //   nameBn: "প্রিমিয়াম চামড়ার চেলসি বুট",
  //   descriptionEn: "Sleek look for semi-formal styling. Full-grain water-resistant leather build, flexible side elastic gussets, and pull-up tabs for easy wearing.",
  //   descriptionBn: "সেমি-ফর্মাল গেটআপের জন্য সেরা চেলসি বুট। সম্পূর্ণ খাঁটি ওয়াটার-রেজিস্ট্যান্ট লেদার, দুই পাশের নমনীয় ইলাস্টিক প্যানেল এবং পরার জন্য পুল-আপ লুপের সুবিধা।",
  //   category: "cat_shoes",
  //   priceUSD: 119.99,
  //   discountPercent: 25,
  //   images: [
  //     "/images/shoes_boots.png"
  //   ],
  //   sizes: ["40", "41", "42", "43", "44"],
  //   colors: [
  //     { nameEn: "Cognac Brown", nameBn: "কগনাক বাদামী", hex: "#8B4513" },
  //     { nameEn: "Pitch Black", nameBn: "কুচকুচে কালো", hex: "#050505" }
  //   ],
  //   rating: 4.8,
  //   reviewsCount: 62,
  //   featuresEn: ["Premium full-grain leather outer", "Flexible elastic side panels", "Durable welt-stitched synthetic outsole"],
  //   featuresBn: ["খাঁটি প্রিমিয়াম লেদার বডি", "নমনীয় ও মজবুত ইলাস্টিক সাইড প্যানেল", "মজবুত ও দীর্ঘস্থায়ী চেলসি সোল"]
  // },
  // {
  //   id: "prod-shoes-5",
  //   nameEn: "Comfort Slip-On Walking Shoes",
  //   nameBn: "কমফোর্ট স্লিপ-অন ওয়াকিং শু",
  //   descriptionEn: "Your everyday walking companion. Breathable stretch-knit upper mesh, Memory Foam responsive insoles, and shock-absorbing lightweight outsole.",
  //   descriptionBn: "প্রতিদিনের হাঁটার জন্য সেরা সঙ্গী। বাতাস চলাচলের উপযোগী স্ট্রেচ-নিট নেট কাপড়, মেমোরি ফোম ইনসোল এবং শক-অ্যাবজরবিং সোল দিয়ে তৈরি অত্যন্ত আরামদায়ক জুতো।",
  //   category: "cat_shoes",
  //   priceUSD: 49.99,
  //   discountPercent: 15,
  //   images: [
  //     "/images/shoes_sneakers_5.png"
  //   ],
  //   sizes: ["39", "40", "41", "42", "43"],
  //   colors: [
  //     { nameEn: "Dark Heather Grey", nameBn: "ধূসর কালো", hex: "#3C3C3C" },
  //     { nameEn: "Pure White", nameBn: "শুভ্র সাদা", hex: "#FAFAFA" }
  //   ],
  //   rating: 4.5,
  //   reviewsCount: 142,
  //   featuresEn: ["Breathable engineered knit mesh", "Memory Foam cushioned insoles", "Extremely lightweight flexible frame"],
  //   featuresBn: ["বাতাস চলাচলের উপযোগী বিশেষ নিট ফেব্রিক", "অতিরিক্ত নরম মেমোরি ফোম ইনসোল", "সহজে বাঁকানো যায় এমন নমনীয় বডি গঠন"]
  // },

  // /* ================== CAT_WATCHES (WATCHES & ACC.) ================== */
  // {
  //   id: "prod-watch-1",
  //   nameEn: "Aero-Luxury Chronograph Watch",
  //   nameBn: "অ্যারো-লাক্সারি ক্রোনোগ্রাফ ঘড়ি",
  //   descriptionEn: "Make a powerful statement of style and precision. Featuring scratch-resistant sapphire crystal glass, detailed sub-dials, automatic kinetic movement.",
  //   descriptionBn: "আপনার ব্যক্তিত্ব ও সময়ানুবর্তিতার বহিঃপ্রকাশ। এতে রয়েছে স্ক্র্যাচ-প্রতিরোধী স্যাফায়ার ক্রিস্টাল গ্লাস, ডায়নামিক সাব-ডায়াল এবং প্রিমিয়াম খাঁটি চামড়ার বেল্ট।",
  //   category: "cat_watches",
  //   priceUSD: 149.99,
  //   discountPercent: 35,
  //   images: [
  //     "/images/luxury_watch_1.png"
  //   ],
  //   sizes: ["One Size"],
  //   colors: [
  //     { nameEn: "Sapphire Gold", nameBn: "স্যাফায়ার গোল্ড", hex: "#D4AF37" },
  //     { nameEn: "Classic Silver", nameBn: "ক্ল্যাসিক সিলভার", hex: "#C0C0C0" }
  //   ],
  //   rating: 4.6,
  //   reviewsCount: 84,
  //   featuresEn: ["Genuine leather hand-crafted strap", "Premium sub-dial display detailing", "30m water-resistant casing"],
  //   featuresBn: ["খাঁটি চামড়ায় তৈরি হাতের বেল্ট", "প্রিমিয়াম সাব-ডায়াল প্রদর্শন সুবিধা", "৩০ মিটার পর্যন্ত ওয়াটার-রেজিস্ট্যান্ট বডি"]
  // },
  // {
  //   id: "prod-watch-2",
  //   nameEn: "Minimalist Classic Silver Watch",
  //   nameBn: "মিনিমালিস্ট ক্লাসিক সিলভার ঘড়ি",
  //   descriptionEn: "Elegant daily wear time-piece. Ultra-slim polished steel bezel, white minimalist analog dial face, and sleek durable mesh band.",
  //   descriptionBn: "প্রতিদিন ব্যবহারের জন্য মার্জিত ডিজাইনের ঘড়ি। আল্ট্রা-স্লিম স্টিল কেসিং, সাদা গোল ডায়াল এবং মজবুত সিলভার রঙের চেইন দিয়ে আকর্ষণীয় ডিজাইনে তৈরি।",
  //   category: "cat_watches",
  //   priceUSD: 79.99,
  //   discountPercent: 20,
  //   images: [
  //     "/images/luxury_watch_2.png"
  //   ],
  //   sizes: ["One Size"],
  //   colors: [
  //     { nameEn: "Metallic Silver", nameBn: "সিলভার", hex: "#E6E6E6" },
  //     { nameEn: "Sleek Gunmetal", nameBn: "ধূসর মেটালিক", hex: "#555555" }
  //   ],
  //   rating: 4.7,
  //   reviewsCount: 92,
  //   featuresEn: ["316L surgical stainless steel casing", "Precision quartz analog movement", "Quick-release mesh metal band"],
  //   featuresBn: ["স্টেইনলেস স্টিল মরিচারোধী কেসিং", "নিখুঁত কোয়ার্টজ সুই সিস্টেম", "সহজে খোলা ও লাগানোর চেইন লক"]
  // },
  // {
  //   id: "prod-watch-3",
  //   nameEn: "Smart Sports Active Watch",
  //   nameBn: "স্মার্ট স্পোর্টস অ্যাক্টিভ ঘড়ি",
  //   descriptionEn: "Stay fit, connected and updated. Features colorful AMOLED screen, real-time heart rate sensor, sports tracking, and water-resistance.",
  //   descriptionBn: "ফিটনেস ট্র্যাকিং ও স্মার্ট যোগাযোগের সেরা ঘড়ি। এতে রয়েছে রঙিন অ্যামোলেড ডিসপ্লে, রিয়েল-টাইম হার্ট রেট সেন্সর, বিভিন্ন স্পোর্টস মোড এবং ওয়াটারপ্রুফ বডি।",
  //   category: "cat_watches",
  //   priceUSD: 99.99,
  //   discountPercent: 15,
  //   images: [
  //     "/images/luxury_watch_3.png"
  //   ],
  //   sizes: ["One Size"],
  //   colors: [
  //     { nameEn: "Charcoal Black", nameBn: "কালো", hex: "#1C1C1C" },
  //     { nameEn: "Navy Blue", nameBn: "নেভি ব্লু", hex: "#000080" }
  //   ],
  //   rating: 4.5,
  //   reviewsCount: 134,
  //   featuresEn: ["Vibrant HD AMOLED display", "Integrated wellness tracking sensors", "IP68 dust and water resistance"],
  //   featuresBn: ["উজ্জ্বল এইচডি অ্যামোলেড স্ক্রিন", "উন্নত ফিটনেস ও স্বাস্থ্য ট্র্যাকিং সেন্সর", "আইপি৬৮ ধুলো ও পানি প্রতিরোধক বডি"]
  // },
  // {
  //   id: "prod-watch-4",
  //   nameEn: "Vintage Rose Gold Mechanical Watch",
  //   nameBn: "ভিন্টেজ রোজ গোল্ড মেকানিক্যাল ঘড়ি",
  //   descriptionEn: "A masterpiece of classical engineering. Visible internal gear movement (skeleton design), premium rose gold plated case, and dark brown leather strap.",
  //   descriptionBn: "মেকানিক্যাল ও কারিগরি ঘড়ির মাস্টারপিস। ঘড়ির ভেতরের গিয়ার ঘূর্ণন বাইরে থেকে দেখা যায় (স্কেলিটন ডিজাইন), প্রিমিয়াম রোজ গোল্ড কালার কেসিং ও চামড়ার বেল্ট।",
  //   category: "cat_watches",
  //   priceUSD: 199.99,
  //   discountPercent: 30,
  //   images: [
  //     "/images/luxury_watch_4.png"
  //   ],
  //   sizes: ["One Size"],
  //   colors: [
  //     { nameEn: "Rose Gold Brown", nameBn: "রোজ গোল্ড বাদামী", hex: "#B76E79" },
  //     { nameEn: "Royal Gold Black", nameBn: "গোল্ডেন কালো", hex: "#D4AF37" }
  //   ],
  //   rating: 4.9,
  //   reviewsCount: 45,
  //   featuresEn: ["Intricate skeleton dials display", "Automatic self-winding movement", "Premium rose-gold electroplating"],
  //   featuresBn: ["ঘূর্ণনশীল ভেতরের জটিল গিয়ার ডায়াল", "ব্যাটারি ছাড়া সেলফ-উইন্ডিং মেকানিজম", "উচ্চ মানের রোজ গোল্ড কালার কোটিং"]
  // },
  // {
  //   id: "prod-watch-5",
  //   nameEn: "Sleek Carbon Dial Tactical Watch",
  //   nameBn: "Sleek Carbon Dial Tactical Watch",
  //   descriptionEn: "Built like a tank for all conditions. Carbon fiber patterned dial frame, highly scratch-resistant mineral glass, and anti-sweat silicone rubber strap.",
  //   descriptionBn: "যে কোনো রুক্ষ পরিবেশে ব্যবহারের উপযোগী শক্তিশালী ঘড়ি। কার্বন ফাইবার ডায়াল ডিজাইন, স্ক্র্যাচ-প্রতিরোধী শক্ত গ্লাস এবং ঘাম-প্রতিরোধী সিলিকন বেল্ট রয়েছে এতে।",
  //   category: "cat_watches",
  //   priceUSD: 89.99,
  //   discountPercent: 25,
  //   images: [
  //     "/images/luxury_watch_5.png"
  //   ],
  //   sizes: ["One Size"],
  //   colors: [
  //     { nameEn: "Tactical Grey", nameBn: "আর্মি ধূসর", hex: "#4A4A4A" },
  //     { nameEn: "Matte Black", nameBn: "ম্যাট কালো", hex: "#222222" }
  //   ],
  //   rating: 4.6,
  //   reviewsCount: 78,
  //   featuresEn: ["Shockproof carbon fiber build", "Luminous hands for dark visibility", "50m waterproof diving casing"],
  //   featuresBn: ["শকপ্রুফ কার্বন ফাইবার ফ্রেম বডি", "অন্ধকারে সময় দেখার জন্য নিয়ন সুই", "৫০ মিটার গভীরতায় ওয়াটারপ্রুফ কেসিং"]
  // },

  // /* ================== CAT_KIDS (KIDS & TOYS) ================== */
  // {
  //   id: "prod-kids-1",
  //   nameEn: "Kids Playtime Cotton Set",
  //   nameBn: "কিডস প্লে-টাইম কটন সেট",
  //   descriptionEn: "Cute and playful clothing set for kids, made from 100% hypoallergenic organic cotton. Features elasticated waist and prints to keep them happy.",
  //   descriptionBn: "শিশুদের জন্য সুন্দর ও আরামদায়ক সুতি কাপড়ের সেট, যা ১০০% হাইপোঅ্যালার্জেনিক অর্গানিক কটন দ্বারা তৈরি। সোনামণিদের রাখবে হাসিখুশি।",
  //   category: "cat_kids",
  //   priceUSD: 29.99,
  //   discountPercent: 30,
  //   images: [
  //     "/images/kids_clothing_set_1.png"
  //   ],
  //   sizes: ["2-3Y", "3-4Y", "4-5Y"],
  //   colors: [
  //     { nameEn: "Sunshine Yellow", nameBn: "রোদেলা হলুদ", hex: "#FFD700" },
  //     { nameEn: "Sky Blue", nameBn: "আকাশী নীল", hex: "#87CEEB" }
  //   ],
  //   rating: 4.7,
  //   reviewsCount: 52,
  //   featuresEn: ["100% hypoallergenic organic cotton", "Comfort stretch elastic waist", "Playful hand-printed design prints"],
  //   featuresBn: ["১০০% এলার্জি-মুক্ত নরম অর্গানিক কটন", "আরামদায়ক ইলাস্টিক কোমর বন্ধনী", "হাতে প্রিন্ট করা আকর্ষণীয় শিশুতোষ নকশা"]
  // },
  // {
  //   id: "prod-kids-2",
  //   nameEn: "Toddler Fleece Hooded Romper",
  //   nameBn: "টডলার ফ্লিস হুডেড রম্পার",
  //   descriptionEn: "Keep your little ones warm and cozy. Made from premium ultra-soft fleece, featuring cute animal ears on the hood and full-length zipper closure.",
  //   descriptionBn: "আপনার সোনামণিকে রাখুন গরম ও আরামদায়ক। প্রিমিয়াম নরম ফ্লিস কাপড়, কান ডিজাইনসহ হুডি এবং পা পর্যন্ত সম্পূর্ণ জিপার সিস্টেমের সমন্বয়ে তৈরি।",
  //   category: "cat_kids",
  //   priceUSD: 39.99,
  //   discountPercent: 20,
  //   images: [
  //     "/images/kids_clothing_set_2.png"
  //   ],
  //   sizes: ["6-12M", "12-18M", "18-24M"],
  //   colors: [
  //     { nameEn: "Teddy Brown", nameBn: "বাদামী", hex: "#8B5A2B" },
  //     { nameEn: "Blush Pink", nameBn: "হালকা গোলাপী", hex: "#FFB6C1" }
  //   ],
  //   rating: 4.8,
  //   reviewsCount: 67,
  //   featuresEn: ["Ultra-soft warmth keeping fleece", "Cute animal ears design on hood", "Safe zipper chin guard lock"],
  //   featuresBn: ["অতিরিক্ত নরম ও উষ্ণ ফ্লিস ফেব্রিক", "হুডিতে কিউট খরগোশ বা ভাল্লুকের কান", "শিশুর থুতনির সুরক্ষার জন্য জিপার গার্ড"]
  // },
  // {
  //   id: "prod-kids-3",
  //   nameEn: "Cartoon Printed Soft Pajamas Set",
  //   nameBn: "কার্টুন প্রিন্ট নরম পাজামা সেট",
  //   descriptionEn: "Perfect sleeping wear for children. Loose fit cotton knit pajama set featuring clean colorful animal prints and elasticated ankle cuffs.",
  //   descriptionBn: "শিশুদের আরামদায়ক ঘুমের জন্য চমৎকার পাজামা সেট। ঢিলেঢালা কটন ফেব্রিক, বিভিন্ন রঙের আকর্ষণীয় কার্টুন প্রিন্ট এবং গোড়ালির নরম ইলাস্টিক বর্ডার।",
  //   category: "cat_kids",
  //   priceUSD: 19.99,
  //   discountPercent: 15,
  //   images: [
  //     "/images/kids_clothing_set_3.png"
  //   ],
  //   sizes: ["3-4Y", "4-5Y", "5-6Y", "6-7Y"],
  //   colors: [
  //     { nameEn: "Mint Green", nameBn: "মিন্ট সবুজ", hex: "#98FF98" },
  //     { nameEn: "Soft Pink", nameBn: "হালকা গোলাপী", hex: "#FFC0CB" }
  //   ],
  //   rating: 4.6,
  //   reviewsCount: 43,
  //   featuresEn: ["100% natural breathable knit cotton", "Charming non-toxic screen prints", "Soft stretch ribbed cuffs"],
  //   featuresBn: ["১০০% খাঁটি ও বাতাস চলাচলের উপযোগী কটন", "শিশুর ত্বকের জন্য নিরাপদ স্ক্রিন প্রিন্ট", "নরম স্ট্রেচ ইলাস্টিক বর্ডার হাতা ও পা"]
  // },
  // {
  //   id: "prod-kids-4",
  //   nameEn: "Cute Denim Dungarees Set",
  //   nameBn: "কিউট ডেনিম ডাঙ্গারি সেট",
  //   descriptionEn: "Trendy classic style for kids. Made of soft-wash stretch denim dungarees with an inner striped cotton t-shirt. Adjustable metal shoulder buckles.",
  //   descriptionBn: "শিশুদের জন্য আধুনিক ও ক্ল্যাসিক ডাঙ্গারি সেট। সফট ওয়াশড ডেনিম কাপড়ের বেল্ট প্যান্ট এবং সাথে রয়েছে নরম সুতি টি-শার্ট। কাঁধের ধাতব লক সামঞ্জস্যযোগ্য।",
  //   category: "cat_kids",
  //   priceUSD: 44.99,
  //   discountPercent: 25,
  //   images: [
  //     "/images/kids_clothing_set_4.png"
  //   ],
  //   sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y"],
  //   colors: [
  //     { nameEn: "Medium Denim Wash", nameBn: "নীল ডেনিম", hex: "#4682B4" },
  //     { nameEn: "Black Denim Wash", nameBn: "কালো ডেনিম", hex: "#1C1C1C" }
  //   ],
  //   rating: 4.8,
  //   reviewsCount: 38,
  //   featuresEn: ["Soft-washed skin-friendly stretch denim", "Adjustable suspender straps with metal loops", "Includes inner striped cotton tee"],
  //   featuresBn: ["নরম স্কিন-ফ্রেন্ডলি ওয়াশড ডেনিম প্যান্ট", "সামঞ্জস্যযোগ্য ধাতব স্ট্র্যাপ লক বেল্ট", "সাথে থাকছে আরামদায়ক সুতি স্ট্রাইপ টি-শার্ট"]
  // },
  // {
  //   id: "prod-kids-5",
  //   nameEn: "Kids Anti-Slip Play Sneakers",
  //   nameBn: "কিডস অ্যান্টি-স্লিপ প্লে স্নিকার্স",
  //   descriptionEn: "Designed for active outdoor playtime. Features highly slip-resistant textured soles, easy velcro double straps, and supportive heel base.",
  //   descriptionBn: "বাইরে খেলার সময় বা দৌড়াদৌড়ির জন্য উপযুক্ত জুতো। এতে রয়েছে পিছলে যাওয়া প্রতিরোধী রাবার সোল, সহজে লাগানোর বেল্ট লক (ভেলক্রো) এবং গোড়ালির কুশন।",
  //   category: "cat_kids",
  //   priceUSD: 34.99,
  //   discountPercent: 30,
  //   images: [
  //     "/images/shoes_sneakers_2.png"
  //   ],
  //   sizes: ["24", "26", "28", "30"],
  //   colors: [
  //     { nameEn: "Bright Red Blue", nameBn: "লাল নীল", hex: "#FF0000" },
  //     { nameEn: "Neon Orange Grey", nameBn: "কমলা ধূসর", hex: "#FF4500" }
  //   ],
  //   rating: 4.7,
  //   reviewsCount: 59,
  //   featuresEn: ["Double secure Velcro strap closures", "Durable anti-collision rubber toe caps", "Ultra-grip textured safety outsole"],
  //   featuresBn: ["সহজে খোলার জন্য ভেলক্রো ডাবল বেল্ট লক", "সামনের সুরক্ষার জন্য মজবুত রাবার টো-ক্যাপ", "পিছলে যাওয়া প্রতিরোধী গ্রিপ নিরাপত্তা সোল"]
  // }
];
