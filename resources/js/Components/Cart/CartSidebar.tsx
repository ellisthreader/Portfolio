// resources/js/Components/Cart/CartSidebar.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "@/Context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { router } from "@inertiajs/react";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useDarkMode } from "@/Context/DarkModeContext";

// ---- 👇 your actual site data
const courses = [
  { id: 1, title: "TikTok Creator Rewards Programme", price: 299, image: "/images/tiktok.jpeg" },
  { id: 2, title: "Digital Marketing Mastery", price: 249, image: "/images/marketing.jpeg" },
  { id: 3, title: "Web Development Fundamentals", price: 199, image: "/images/webdev.jpeg" },
];

const products = [
  { id: 201, title: "Web Dev Fundamentals (Paperback)", price: 15, image: "/images/webdev-book.jpeg" },
  { id: 202, title: "TikTok Creator Starter Pack", price: 39.99, image: "/images/tiktok-starter-pack.jpeg" },
  { id: 203, title: "Marketing Productivity Pack", price: 9.99, image: "/images/marketing-pack.jpeg" },
];

const allSuggestions = [...courses, ...products];

const CartSidebar = () => {
  const { cart, showCart, toggleCart, openCart, updateQuantity, removeFromCart, addToCart } = useCart();
  const { darkMode } = useDarkMode();

  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const goal = 50;
  const progress = Math.min(totalPrice / goal, 1) * 100;

  const [page, setPage] = useState(0);
  const itemsPerPage = 3; // 👈 3 products per dot

  // Disable scrolling when cart is open
  useEffect(() => {
    document.body.style.overflow = showCart ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showCart]);

  const handleCheckout = () => {
    if (cart.length === 0) return; // prevent checkout if empty
    if (!showCart) openCart();
    setTimeout(() => router.get("/checkout"), 100);
  };

  const handleIncrease = (id: number) => {
    const item = cart.find(i => i.id === id);
    if (item) updateQuantity(id, item.quantity + 1);
  };

  const handleDecrease = (id: number) => {
    const item = cart.find(i => i.id === id);
    if (item) {
      if (item.quantity <= 1) removeFromCart(id);
      else updateQuantity(id, item.quantity - 1);
    }
  };

  // filter suggestions to exclude already added cart items
  const suggestedProducts = allSuggestions.filter(
    p => !cart.some(c => c.id === p.id)
  ).slice(0, 6); // max 6 suggestions for better pagination

  const totalPages = Math.ceil(suggestedProducts.length / itemsPerPage);
  const visibleProducts = suggestedProducts.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage);

  return (
    <AnimatePresence>
      {showCart && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed top-0 right-0 h-full w-[30rem] shadow-xl z-50 flex flex-col ${
              darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
            }`}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Your Cart</h2>
              <button onClick={toggleCart}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mystery Gift Progress */}
            <div className="p-4 border-b">
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-center">
                {totalPrice >= goal ? (
                  <>You unlocked a <span className="font-bold">mystery gift</span>!</>
                ) : (
                  <>Spend £{(goal - totalPrice).toFixed(2)} more to get a <span className="font-bold">mystery gift</span></>
                )}
              </p>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {cart.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-start space-x-3 border-b pb-3">
                        {item.image && (
                          <img src={item.image} alt={item.title} className="w-14 h-14 object-cover rounded" />
                        )}
                        <div className="flex-1 flex flex-col">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">£{item.price.toFixed(2)}</p>

                          <div className="flex items-center space-x-2 mt-2">
                            <button
                              onClick={() => handleDecrease(item.id)}
                              className="p-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2">{item.quantity}</span>
                            <button
                              onClick={() => handleIncrease(item.id)}
                              className="p-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col items-end">
                          <span className="font-medium">£{(item.price * item.quantity).toFixed(2)}</span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="mt-2 text-gray-400 hover:text-red-500 transition"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Before You Go Section */}
                  {suggestedProducts.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-3">Before you go...</h3>

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
                            {visibleProducts.map(product => (
                              <div
                                key={product.id}
                                className={`p-3 border rounded-lg flex flex-col items-center text-center w-36 flex-shrink-0 ${
                                  darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
                                }`}
                              >
                                <img src={product.image} alt={product.title} className="w-20 h-20 object-cover rounded mb-2" />
                                <p className="font-medium text-sm line-clamp-2">{product.title}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">£{product.price.toFixed(2)}</p>
                                <button
                                  onClick={() =>
                                    addToCart({
                                      id: product.id,
                                      title: product.title,
                                      price: product.price,
                                      image: product.image,
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

                        {/* Dots */}
                        <div className="flex justify-center mt-4 gap-2">
                          {Array.from({ length: totalPages }).map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setPage(idx)}
                              className={`w-3 h-3 rounded-full transition ${
                                page === idx ? "bg-blue-600" : "bg-gray-400 hover:bg-blue-400"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t space-y-3">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>£{totalPrice.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className={`w-full py-3 rounded-lg text-white transition ${
                  cart.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Checkout
              </button>

              <button
                onClick={toggleCart}
                className="w-full py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition"
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
