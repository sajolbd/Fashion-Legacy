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
  { code: "USD", symbol: "$", rate: 1, label: "USD ($)" },
  { code: "BDT", symbol: "৳", rate: 120, label: "BDT (৳)" },
  { code: "SAR", symbol: "SR", rate: 3.75, label: "SAR (SR)" }
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

export const PRODUCTS: Product[] = [];
