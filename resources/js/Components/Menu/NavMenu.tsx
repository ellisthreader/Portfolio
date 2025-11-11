import React, { useState } from "react";
import { useDarkMode } from "@/Context/DarkModeContext";
import { useCart } from "@/Context/CartContext";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { ShoppingCart, Search, User, Heart } from "lucide-react";

// Import sidebars
import WomenSidebar from "./WomenSidebar";
import MenSidebar from "./MenSidebar";
import KidsSidebar from "./KidsSidebar";
import SaleSidebar from "./SaleSidebar";

export default function NavMenu() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { cart, toggleCart } = useCart();

  const [activeSidebar, setActiveSidebar] = useState<string | null>(null);
  const [previousSidebar, setPreviousSidebar] = useState<string | null>(null);
  const [isHoveringNav, setIsHoveringNav] = useState(false);
  const [isHoveringSidebar, setIsHoveringSidebar] = useState(false);

  const totalItems = cart.reduce(
    (acc: number, item: { quantity: number }) => acc + item.quantity,
    0
  );

  // When hovering a nav link
  const handleHoverNav = (category: string) => {
    setPreviousSidebar(activeSidebar);
    setActiveSidebar(category);
    setIsHoveringNav(true);
  };

  // When leaving nav links
  const handleLeaveNav = () => {
    setIsHoveringNav(false);
    setTimeout(() => {
      if (!isHoveringNav && !isHoveringSidebar) {
        setActiveSidebar(null);
      }
    }, 50); // slight delay prevents flicker when moving to sidebar
  };

  // When hovering sidebar
  const handleHoverSidebar = () => {
    setIsHoveringSidebar(true);
  };

  // When leaving sidebar
  const handleLeaveSidebar = () => {
    setIsHoveringSidebar(false);
    setTimeout(() => {
      if (!isHoveringNav && !isHoveringSidebar) {
        setActiveSidebar(null);
      }
    }, 50);
  };

  const isSwitching =
    !!(activeSidebar && previousSidebar && activeSidebar !== previousSidebar);

  return (
    <>
      {/* NAVBAR */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md flex items-center justify-between px-8 py-3 shadow-sm transition-colors duration-300"
      >
        {/* LEFT: LOGO + NAV LINKS */}
        <div className="flex items-center gap-14">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="h-11 min-h-[44px] flex items-center">
              <img
                src={
                  darkMode
                    ? "/images/DarkModeLogo.png"
                    : "/images/vaire-logo.png"
                }
                alt="Vairé Logo"
                className="h-11 w-auto object-contain transition-all duration-300"
              />
            </div>
          </Link>

          {/* NAV LINKS with bigger hover zones */}
          <div
            className="flex items-center gap-10 font-medium tracking-wide text-[17px] uppercase relative"
            onMouseLeave={handleLeaveNav}
          >
            {["Women", "Men", "Kids", "Sale"].map((category) => (
              <div
                key={category}
                onMouseEnter={() => handleHoverNav(category)}
                className="relative"
              >
                <div className="absolute inset-x-[-25px] top-[-20px] bottom-[-20px]" />
                <Link
                  href={`/${category.toLowerCase()}`}
                  className="relative z-10 px-3 py-2 text-gray-500 hover:text-black dark:hover:text-white hover:font-semibold transition-all duration-200"
                >
                  {category}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: ICONS */}
        <div className="flex items-center gap-6 text-gray-900 dark:text-gray-100">
          <button
            aria-label="Search"
            className="hover:text-gray-500 dark:hover:text-white transition"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            aria-label="Wishlist"
            className="hover:text-gray-500 dark:hover:text-white transition"
          >
            <Heart className="w-5 h-5" />
          </button>

          <Link
            href="/profile"
            aria-label="Profile"
            className="hover:text-gray-500 dark:hover:text-white transition"
          >
            <User className="w-5 h-5" />
          </Link>

          <div className="relative cursor-pointer" onClick={toggleCart}>
            <ShoppingCart className="w-5 h-5 hover:text-gray-500 dark:hover:text-white transition" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 text-[10px] bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>

          <DarkModeSwitch
            checked={darkMode}
            onChange={toggleDarkMode}
            size={18}
          />
        </div>
      </motion.nav>

      {/* SIDEBARS */}
      <WomenSidebar
        isOpen={activeSidebar === "Women"}
        instant={isSwitching}
        onClose={() => setActiveSidebar(null)}
        onMouseEnter={handleHoverSidebar}
        onMouseLeave={handleLeaveSidebar}
      />
      <MenSidebar
        isOpen={activeSidebar === "Men"}
        instant={isSwitching}
        onClose={() => setActiveSidebar(null)}
        onMouseEnter={handleHoverSidebar}
        onMouseLeave={handleLeaveSidebar}
      />
      <KidsSidebar
        isOpen={activeSidebar === "Kids"}
        instant={isSwitching}
        onClose={() => setActiveSidebar(null)}
        onMouseEnter={handleHoverSidebar}
        onMouseLeave={handleLeaveSidebar}
      />
      <SaleSidebar
        isOpen={activeSidebar === "Sale"}
        instant={isSwitching}
        onClose={() => setActiveSidebar(null)}
        onMouseEnter={handleHoverSidebar}
        onMouseLeave={handleLeaveSidebar}
      />
    </>
  );
}
