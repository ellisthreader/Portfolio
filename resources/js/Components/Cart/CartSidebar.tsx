"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ChevronDown } from "lucide-react";
import { useCart } from "@/Context/CartContext";
import { router } from "@inertiajs/react";

// ✅ Import CartItem type from your CartContext
import type { CartItem } from "@/Context/CartContext";

type SuggestedProduct = {
  id: number;
  title: string;
  price: number;
  image: string;
  slug: string;
};

// ======= Custom Dropdown Component (Flannels-style) =======
const SizeDropdown = ({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (val: string) => void;
  options: string[];
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // CLOSE WHEN CLICKING OUTSIDE
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        e.target instanceof Node &&
        !wrapperRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-32 text-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-3 py-2 border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
      >
        <span>{value}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg">
          <ul className="max-h-48 overflow-y-auto">
            {options.map((opt) => (
              <li
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`px-3 py-2 cursor-pointer hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white ${
                  value === opt ? "bg-gray-100 dark:bg-gray-700" : ""
                }`}
              >
                {opt}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// ======= Cart Sidebar Component =======
const CartSidebar = () => {
  const {
    cart,
    showCart,
    toggleCart,
    updateQuantity,
    removeFromCart,
    updateSize,
    totalPrice,
    openCart,
    addToCart,
  }: {
    cart: CartItem[];
    showCart: boolean;
    toggleCart: () => void;
    updateQuantity: (
      slug: string,
      colour: string,
      size: string,
      quantity: number
    ) => void;
    removeFromCart: (slug: string, colour: string, size: string) => void;
    updateSize: (
      slug: string,
      colour: string,
      oldSize: string,
      newSize: string
    ) => void;
    totalPrice: number;
    openCart: () => void;
    addToCart: (item: CartItem) => void;
  } = useCart();

  const [page, setPage] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    document.body.style.overflow = showCart ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showCart]);

  const goal = 50;
  const progress = Math.min(totalPrice / goal, 1) * 100;

  // ===== Handlers =====
  const handleIncrease = (item: CartItem) => {
    updateQuantity(item.slug, item.colour, item.size, item.quantity + 1);
  };

  const handleDecrease = (item: CartItem) => {
    if (item.quantity <= 1) {
      removeFromCart(item.slug, item.colour, item.size);
    } else {
      updateQuantity(item.slug, item.colour, item.size, item.quantity - 1);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (!showCart) openCart();
    setTimeout(() => router.get("/checkout"), 100);
  };

  // ===== Suggested Products =====
  const suggestedProducts: SuggestedProduct[] = [
    { id: 1, title: "Cloudmonster - Black", price: 160, image: "/images/Trending/cloudtecB1.png", slug: "cloudmonster-black" },
    { id: 2, title: "Cloudmonster - White", price: 160, image: "/images/Trending/cloudtecW1.png", slug: "cloudmonster-white" },
    { id: 3, title: "Another Shoe", price: 120, image: "/images/Trending/shoe2.png", slug: "shoe2" },
    { id: 4, title: "Cool Sneakers", price: 140, image: "/images/Trending/shoe3.png", slug: "shoe3" },
    { id: 5, title: "Running Shoe", price: 130, image: "/images/Trending/shoe4.png", slug: "shoe4" },
  ];

  const totalPages = Math.ceil(suggestedProducts.length / itemsPerPage);
  const visibleProducts = suggestedProducts.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );

  return (
    <AnimatePresence>
      {showCart && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black z-50"
          />

          {/* SIDEBAR */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-[30rem] shadow-xl z-50 bg-white dark:bg-gray-900 text-black dark:text-white flex flex-col"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700">
              <h2 className="text-lg font-semibold">Your Cart</h2>
              <button onClick={toggleCart}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PROGRESS BAR */}
            <div className="p-4 border-b border-gray-300 dark:border-gray-700">
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="mt-2 text-sm text-center">
                {totalPrice >= goal ? (
                  <>
                    You unlocked a <span className="font-bold">mystery gift!</span>
                  </>
                ) : (
                  <>
                    Spend £{(goal - totalPrice).toFixed(2)} more to get a{" "}
                    <span className="font-bold">mystery gift</span>
                  </>
                )}
              </p>
            </div>

            {/* CART ITEMS */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {cart.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
              ) : (
                cart.map((item: CartItem) => (
                  <div
                    key={`${item.slug}-${item.colour}-${item.size}`}
                    className="flex justify-between items-start space-x-3 border-b border-gray-300 dark:border-gray-700 pb-3"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded"
                    />

                    <div className="flex-1 flex flex-col text-sm">
                      <p className="font-bold leading-tight">{item.brand}</p>
                      <p className="font-bold mb-1">{item.title}</p>
                      <p className="mb-1">
                        Colour: <span className="font-normal">{item.colour}</span>
                      </p>

                      <p className="mb-1">Size:</p>

                      <SizeDropdown
                        value={item.size}
                        onChange={(val) =>
                          updateSize(item.slug, item.colour, item.size, val)
                        }
                        options={item.availableSizes}
                      />

                      <p className="mt-2">£{item.price.toFixed(2)}</p>

                      {/* QUANTITY */}
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => handleDecrease(item)}
                          className="p-1 border border-gray-400 dark:border-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          onClick={() => handleIncrease(item)}
                          className="p-1 border border-gray-400 dark:border-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* PRICE & REMOVE */}
                    <div className="flex flex-col items-end">
                      <span className="font-semibold">
                        £{(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() =>
                          removeFromCart(item.slug, item.colour, item.size)
                        }
                        className="mt-2 text-gray-400 hover:text-red-500 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}

              {/* SUGGESTED PRODUCTS */}
              {suggestedProducts.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">You may also like</h3>

                  <div className="relative">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={page}
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex gap-4"
                      >
                        {visibleProducts.map((product: SuggestedProduct) => (
                          <div
                            key={product.id}
                            className="p-3 border border-gray-300 dark:border-gray-700 rounded-lg flex flex-col items-center text-center w-36 flex-shrink-0"
                          >
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-20 h-20 object-cover rounded mb-2"
                            />

                            <p className="font-medium text-sm line-clamp-2">
                              {product.title}
                            </p>

                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              £{product.price}
                            </p>

                            <button
                              onClick={() =>
                                addToCart({
                                  id: product.id,
                                  title: product.title,
                                  brand: "On",
                                  price: product.price,
                                  image: product.image,
                                  colour: "Default",
                                  size: "Default",
                                  availableSizes: ["Default"],
                                  slug: product.slug,
                                  quantity: 1,
                                })
                              }
                              className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                            >
                              Add
                            </button>
                          </div>
                        ))}
                      </motion.div>
                    </AnimatePresence>

                    {/* Pagination dots */}
                    <div className="flex justify-center mt-4 gap-2">
                      {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setPage(idx)}
                          className={`w-3 h-3 rounded-full transition ${
                            page === idx
                              ? "bg-blue-600"
                              : "bg-gray-400 dark:bg-gray-600 hover:bg-blue-400"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* FOOTER TOTAL */}
            <div className="p-4 border-t border-gray-300 dark:border-gray-700 space-y-3">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>£{totalPrice.toFixed(2)}</span>
              </div>

              {/* CHECKOUT */}
              <button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className={`w-full py-3 rounded-lg text-white transition ${
                  cart.length === 0
                    ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Checkout
              </button>

              {/* CLOSE */}
              <button
                onClick={toggleCart}
                className="w-full py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
