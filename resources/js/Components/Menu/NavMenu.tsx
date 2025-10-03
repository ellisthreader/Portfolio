import { useDarkMode } from "@/Context/DarkModeContext";
import { useCart } from "@/Context/CartContext";
import { Link, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { ShoppingCart } from "lucide-react";
import React from "react";

export default function NavMenu() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { cart, toggleCart } = useCart();
  const { auth, component } = usePage().props;

  const [showNav, setShowNav] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);

  const isProfilePage = component?.startsWith("Profile");
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Scroll hide/show logic
  React.useEffect(() => {
    if (isProfilePage) return;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowNav(currentScrollY < 50 || currentScrollY < lastScrollY);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isProfilePage]);

  return (
    <AnimatePresence>
      {(showNav || isProfilePage) && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="fixed top-0 left-0 right-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md flex items-center justify-between px-6 py-4 shadow-md transition-colors duration-300"
        >
          {/* Center Links */}
          <div className="flex-1 flex justify-center gap-6 text-lg font-semibold text-gray-900 dark:text-gray-100">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
              About
            </Link>
            <Link href="/courses" className="hover:text-blue-600 dark:hover:text-blue-400">
              Courses
            </Link>
            <Link href="/resume" className="hover:text-blue-600 dark:hover:text-blue-400">
              Resume
            </Link>
            <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400">
              Contact
            </Link>
            {auth?.user ? (
              <Link
                href="/profile"
                className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 font-semibold"
              >
                Profile
              </Link>
            ) : (
              <Link
                href="/login"
                className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 font-semibold"
              >
                Login
              </Link>
            )}
          </div>

          {/* Right Side: Dark Mode + Cart */}
          <div className="flex items-center gap-4 relative">
            {/* Dark Mode Toggle */}
            <DarkModeSwitch checked={darkMode} onChange={toggleDarkMode} size={22} />

            {/* Cart Icon */}
            <div className="relative">
              <ShoppingCart
                className="w-6 h-6 text-gray-900 dark:text-gray-100 cursor-pointer"
                onClick={toggleCart} // toggle cart sidebar
              />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
