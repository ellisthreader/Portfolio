// resources/js/Components/Cart/CartSidebar.tsx
import React from "react";
import { useCart } from "@/Context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { router } from "@inertiajs/react";
import { X, Plus, Minus } from "lucide-react";
import { useDarkMode } from "@/Context/DarkModeContext";

const CartSidebar = () => {
  const { cart, showCart, toggleCart, openCart, updateQuantity, removeFromCart } = useCart();
  const { darkMode } = useDarkMode();

  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleCheckout = () => {
    console.log("Checkout clicked");

    if (!showCart) openCart();

    setTimeout(() => {
      router.get("/checkout");
    }, 100);
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

  return (
    <AnimatePresence>
      {showCart && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`fixed top-0 right-0 h-full w-80 shadow-xl z-50 flex flex-col ${
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

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex justify-between items-center space-x-2">
                  {item.image && (
                    <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded" />
                  )}
                  <div className="flex-1 flex flex-col">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">£{item.price.toFixed(2)}</p>
                    <div className="flex items-center space-x-2 mt-1">
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
                  <span className="font-medium">£{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))
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
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
