// context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem } from "./LanguageContext";

export interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string; // url or keyword
}

export interface OrderHistoryItem {
  id: string;
  date: string;
  items: CartItem[];
  itemsCount: number;
  total: number;
  paymentMethod: string;
  status: "Processing" | "Shipped" | "Delivered";
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, phone: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => void;
  orders: OrderHistoryItem[];
  addSimulatedOrder: (
    items: CartItem[], 
    total: number, 
    paymentMethod: string, 
    customerInfo?: { name: string; email: string; address: string; shippingArea: "inside" | "outside" }
  ) => Promise<string>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [mounted, setMounted] = useState(false);
  
  const rawApiUrl = 
    process.env.NEXT_PUBLIC_API_URL || 
    (typeof window !== "undefined"
      ? (window.location.hostname.includes("fashionlegacy.live") || window.location.hostname.includes("vercel.app")
          ? "https://fashion-legacy-backend.vercel.app" 
          : `http://${window.location.hostname}:5000`)
      : "http://localhost:5000");
  const apiBaseUrl = rawApiUrl.endsWith("/") ? rawApiUrl.slice(0, -1) : rawApiUrl;

  // Sync state with localStorage on load
  useEffect(() => {
    const storedUser = localStorage.getItem("fl_user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Fetch order history from API on mount
        fetch(`${apiBaseUrl}/api/orders/user/${parsedUser.email}`)
          .then((res) => res.json())
          .then((ordData) => {
            const ordersArray = Array.isArray(ordData) ? ordData : [];
            setOrders(ordersArray.map((o: any) => ({
              id: o.id,
              date: o.createdAt ? o.createdAt.split("T")[0] : (o.date || new Date().toISOString().split("T")[0]),
              items: (o.items || []).map((it: any) => ({
                id: it.productId,
                nameEn: it.nameEn,
                nameBn: it.nameBn || it.nameEn,
                priceUSD: it.priceUSD,
                image: "/images/logo.png",
                quantity: it.quantity,
                size: it.size || "M",
                colorEn: it.colorEn || "Default",
                colorBn: it.colorEn || "ডিফল্ট"
              })),
              itemsCount: (o.items || []).reduce((sum: number, it: any) => sum + it.quantity, 0),
              total: o.totalUSD || o.total || 0,
              paymentMethod: o.paymentMethod || "Cash on Delivery",
              status: o.status === "Pending" ? "Processing" : (o.status || "Processing")
            })));
          })
          .catch((e) => console.error("Failed to load user orders on mount", e));
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
    setMounted(true);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (mounted) {
      if (user) {
        localStorage.setItem("fl_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("fl_user");
      }
    }
  }, [user, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("fl_orders", JSON.stringify(orders));
    }
  }, [orders, mounted]);

  // Login simulated
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        
        // Fetch order history from API on mount
        const ordRes = await fetch(`${apiBaseUrl}/api/orders/user/${data.user.email}`);
        if (ordRes.ok) {
          const ordData = await ordRes.json();
          const ordersArray = Array.isArray(ordData) ? ordData : [];
          setOrders(ordersArray.map((o: any) => ({
            id: o.id,
            date: o.createdAt ? o.createdAt.split("T")[0] : (o.date || new Date().toISOString().split("T")[0]),
            items: (o.items || []).map((it: any) => ({
              id: it.productId,
              nameEn: it.nameEn,
              nameBn: it.nameBn || it.nameEn,
              priceUSD: it.priceUSD,
              image: "/images/logo.png",
              quantity: it.quantity,
              size: it.size || "M",
              colorEn: it.colorEn || "Default",
              colorBn: it.colorEn || "ডিফল্ট"
            })),
            itemsCount: (o.items || []).reduce((sum: number, it: any) => sum + it.quantity, 0),
            total: o.totalUSD || o.total || 0,
            paymentMethod: o.paymentMethod || "Cash on Delivery",
            status: o.status === "Pending" ? "Processing" : (o.status || "Processing")
          })));
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login API failed", err);
      return false;
    }
  };

  // Signup simulated
  const signup = async (name: string, email: string, phone: string): Promise<boolean> => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone })
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setOrders([]);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Signup API failed", err);
      return false;
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("fl_user");
    setOrders([]);
  };

  // Update Profile
  const updateProfile = async (updatedData: Partial<User>) => {
    if (!user) return;
    try {
      const res = await fetch(`${apiBaseUrl}/api/auth/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, ...updatedData })
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      }
    } catch (err) {
      console.error("Update profile API failed", err);
    }
  };

  // Add simulated checkout order to profile orders list
  const addSimulatedOrder = async (
    items: CartItem[], 
    total: number, 
    paymentMethod: string,
    customerInfo?: { name: string; email: string; address: string; shippingArea: "inside" | "outside" }
  ): Promise<string> => {
    const payload = {
      customerName: customerInfo?.name || user?.name || "Raihan Chowdhury",
      customerEmail: customerInfo?.email || user?.email || "raihan@fashionlegacy.live",
      customerAddress: customerInfo?.address || user?.address || "House 14, Road 5, Uttara Sector 4, Dhaka",
      shippingArea: customerInfo?.shippingArea || "inside",
      paymentMethod,
      items: items.map(item => ({
        productId: item.id.split("-")[0],
        nameEn: item.nameEn,
        nameBn: item.nameBn,
        priceUSD: item.priceUSD,
        quantity: item.quantity,
        size: item.size,
        colorEn: item.colorEn
      }))
    };

    try {
      const res = await fetch(`${apiBaseUrl}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      // Reload order list
      if (user) {
        const ordRes = await fetch(`${apiBaseUrl}/api/orders/user/${user.email}`);
        if (ordRes.ok) {
          const ordData = await ordRes.json();
          const ordersArray = Array.isArray(ordData) ? ordData : [];
          setOrders(ordersArray.map((o: any) => ({
            id: o.id,
            date: o.createdAt ? o.createdAt.split("T")[0] : (o.date || new Date().toISOString().split("T")[0]),
            items: (o.items || []).map((it: any) => ({
              id: it.productId,
              nameEn: it.nameEn,
              nameBn: it.nameBn || it.nameEn,
              priceUSD: it.priceUSD,
              image: "/images/logo.png",
              quantity: it.quantity,
              size: it.size || "M",
              colorEn: it.colorEn || "Default",
              colorBn: it.colorEn || "ডিফল্ট"
            })),
            itemsCount: (o.items || []).reduce((sum: number, it: any) => sum + it.quantity, 0),
            total: o.totalUSD || o.total || 0,
            paymentMethod: o.paymentMethod || "Cash on Delivery",
            status: o.status === "Pending" ? "Processing" : (o.status || "Processing")
          })));
        }
      }
      return data.order?.id || `FL-${Math.floor(100000 + Math.random() * 900000)}-BD`;
    } catch (err) {
      console.error("Post order API failed", err);
      return `FL-${Math.floor(100000 + Math.random() * 900000)}-BD`;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateProfile,
        orders,
        addSimulatedOrder
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
