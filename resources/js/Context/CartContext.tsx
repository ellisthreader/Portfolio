"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type CartItem = {
  id: number;
  title: string;
  price: number;
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
  showCart: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    console.log("CartProvider mounted");
  }, []);

  const normalizePrice = (p: number | string): number => {
    if (typeof p === "number") return p;
    if (typeof p === "string") return parseFloat(p.replace(/[^0-9.]/g, "")) || 0;
    return 0;
  };

  const addToCart = (item: AddToCartPayload) => {
    console.log("addToCart called with:", item);
    const price = normalizePrice(item.price);
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        console.log("Item exists, incrementing quantity:", item.id);
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      console.log("Adding new item:", item.id);
      return [...prev, { id: item.id, title: item.title, price, quantity: 1, image: item.image }];
    });
    openCart();
  };

  const updateQuantity = (id: number, quantity: number) => {
    console.log("updateQuantity called for:", id, "quantity:", quantity);
    setCart((prev) =>
      quantity <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const removeFromCart = (id: number) => {
    console.log("removeFromCart called for:", id);
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    console.log("clearCart called");
    setCart([]);
  };

  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const openCart = () => {
    console.log("openCart called");
    setShowCart(true);
  };
  const closeCart = () => {
    console.log("closeCart called");
    setShowCart(false);
  };
  const toggleCart = () => {
    console.log("toggleCart called. Previous state:", showCart);
    setShowCart((prev) => !prev);
  };

  useEffect(() => {
    console.log("showCart changed:", showCart);
  }, [showCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalPrice,
        showCart,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ✅ Make sure this export exists
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};
