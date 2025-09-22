// resources/js/Context/CartContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type CartItem = {
  id: number;
  title: string;
  price: number; // stored as a number
  quantity: number;
  image?: string;
};

type AddToCartPayload = {
  id: number;
  title: string;
  price: number | string;
  image?: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: AddToCartPayload) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const normalizePrice = (p: number | string): number => {
    if (typeof p === "number") return p;
    if (typeof p === "string") {
      // remove any non-numeric characters (like £, $) then parse
      const num = parseFloat(p.replace(/[^0-9.]/g, ""));
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  const addToCart = (item: AddToCartPayload) => {
    const price = normalizePrice(item.price);

    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        // increment quantity
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      // add new item with quantity 1
      return [...prev, { id: item.id, title: item.title, price, quantity: 1, image: item.image }];
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter((i) => i.id !== id);
      }
      return prev.map((i) => (i.id === id ? { ...i, quantity } : i));
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setCart([]);

  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};
