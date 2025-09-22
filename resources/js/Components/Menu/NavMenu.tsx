import { useDarkMode } from "@/Context/DarkModeContext";
import { useCart } from "@/Context/CartContext";
import { Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { ShoppingCart, X } from "lucide-react";
import React from "react";
import { usePage } from "@inertiajs/react";

export default function NavMenu() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { auth } = usePage().props;

  const [showNav, setShowNav] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);
  const [showCart, setShowCart] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowNav(currentScrollY < 50 || currentScrollY < lastScrollY);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  React.useEffect(() => {
    if (cart.length > 0) {
      setShowCart(true);
      const timer = setTimeout(() => setShowCart(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [cart]);

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <AnimatePresence>
      {showNav && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md flex items-center justify-between px-6 py-4 shadow-md transition-colors duration-300"
        >
          {/* Center Links */}
          <div className="flex-1 flex justify-center gap-6 text-lg font-semibold text-gray-900 dark:text-gray-100">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">About</Link>
            <Link href="/courses" className="hover:text-blue-600 dark:hover:text-blue-400">Courses</Link>
            <Link href="/resume" className="hover:text-blue-600 dark:hover:text-blue-400">Resume</Link>
            <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400">Contact</Link>
            {auth?.user ? (
              <Link href="/profile" className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 font-semibold">
                Profile
              </Link>
            ) : (
              <Link href="/login" className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 font-semibold">
                Login
              </Link>
            )}
          </div>

          {/* Right Side: Dark Mode + Cart */}
          <div className="flex items-center gap-4 relative">
            <DarkModeSwitch
              checked={darkMode}
              onChange={toggleDarkMode}
              size={22}
            />

            <div className="relative">
              <ShoppingCart
                className="w-6 h-6 text-gray-900 dark:text-gray-100 cursor-pointer"
                onClick={() => setShowCart((prev) => !prev)}
              />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}

              {/* Cart Dropdown */}
              <AnimatePresence>
                {showCart && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 10 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute right-0 top-10 w-80 bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 z-50"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Your Cart</h2>
                      <X
                        className="w-5 h-5 cursor-pointer text-gray-600 dark:text-gray-300"
                        onClick={() => setShowCart(false)}
                      />
                    </div>

                    {cart.length === 0 ? (
                      <p className="text-gray-600 dark:text-gray-300">Your cart is empty.</p>
                    ) : (
                      <>
                        <div className="space-y-4 max-h-64 overflow-y-auto">
                          {cart.map((item) => (
                            <div key={item.id} className="flex justify-between items-center border-b pb-2">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">{item.title}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <button
                                    onClick={() => updateQuantity(item.id, Math.max(item.quantity - 1, 1))}
                                    className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                                  >-</button>
                                  <span>{item.quantity}x</span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                                  >+</button>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="font-semibold">£{(item.price * item.quantity).toFixed(2)}</span>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="block text-xs text-red-500 mt-1"
                                >Remove</button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                          <span className="font-bold text-gray-900 dark:text-gray-100">Total:</span>
                          <span className="font-bold text-lg">£{totalPrice.toFixed(2)}</span>
                        </div>

                        <Link
                          href="/checkout"
                          className="mt-4 block w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-center text-white font-semibold hover:opacity-90 transition"
                        >
                          Checkout
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
