"use client";

import React, { useState, useRef } from "react";
import { useDarkMode } from "@/Context/DarkModeContext";
import { useCart } from "@/Context/CartContext";
import { Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { ShoppingCart, Search, User, Heart } from "lucide-react";

// WRAPPERS


export default function NavMenu() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { cart, toggleCart } = useCart();

  const [activeSidebar, setActiveSidebar] = useState<string | null>(null);
  const [previousSidebar, setPreviousSidebar] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const totalItems = cart.reduce(
    (acc: number, item: { quantity: number }) => acc + item.quantity,
    0
  );

  const categories = ["Women", "Men", "Kids", "Sale"];

  const detectCategory = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = (event.target as HTMLElement).closest("[data-category]");
    return el ? el.getAttribute("data-category") : null;
  };

  const handleNavMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const category = detectCategory(event);
    if (!category) return;
    if (isAnimating) return;
    if (category === activeSidebar) return;

    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);

    hoverTimeout.current = setTimeout(() => {
      setPreviousSidebar(activeSidebar);
      setActiveSidebar(category);
      setIsHovering(true);
    }, 120);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }

    hoverTimeout.current = setTimeout(() => {
      setIsHovering(false);
      setActiveSidebar(null);
      setPreviousSidebar(null);
    }, 180);
  };

  const closeSidebar = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
    setIsHovering(false);
    setActiveSidebar(null);
    setPreviousSidebar(null);
  };

  const sidebarVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  };

  return (
    <>
      {/* NAVBAR */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-20 bg-white/90 dark:bg-gray-900/90 
        backdrop-blur-md flex items-center justify-between px-8 py-3 shadow-sm 
        transition-colors duration-300"
      >
        <div className="flex items-center gap-14">
          <Link href="/" className="flex items-center">
            <div className="h-11 min-h-[44px] flex items-center">
              <img
                src={darkMode ? "/images/DarkModeLogo.png" : "/images/vaire-logo.png"}
                alt="Vairé Logo"
                className="h-11 w-auto object-contain transition-all duration-300"
              />
            </div>
          </Link>

          <div
            className="flex items-center gap-10 font-medium tracking-wide text-[17px] uppercase relative"
            onMouseMove={handleNavMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {categories.map((category) => (
              <div
                key={category}
                data-category={category}
                className="relative px-6 py-3 cursor-pointer z-10"
                onClick={() => setActiveSidebar(category)} // ✅ Only opens sidebar
              >
                <div className="text-gray-500 hover:text-black dark:hover:text-white hover:font-semibold transition-all duration-200">
                  {category}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6 text-gray-900 dark:text-gray-100">
          <button aria-label="Search" className="hover:text-gray-500 dark:hover:text-white transition">
            <Search className="w-5 h-5" />
          </button>
          <button aria-label="Wishlist" className="hover:text-gray-500 dark:hover:text-white transition">
            <Heart className="w-5 h-5" />
          </button>
          <Link href="/profile" aria-label="Profile" className="hover:text-gray-500 dark:hover:text-white transition">
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

          <DarkModeSwitch checked={darkMode} onChange={toggleDarkMode} size={18} />
        </div>
      </motion.nav>

      {/* SIDEBAR */}
      <AnimatePresence>
        {activeSidebar && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={closeSidebar}
              className="fixed top-[64px] left-0 w-full h-[calc(100%-64px)] bg-black z-20 cursor-pointer"
            />

            {/* Sidebar */}
            <motion.div
              key="sidebar-wrapper"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "tween", duration: 0.28 }}
              onAnimationStart={() => setIsAnimating(true)}
              onAnimationComplete={() => setIsAnimating(false)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="fixed top-[64px] left-0 h-[calc(100%-64px)] w-[35%] bg-white dark:bg-gray-900 shadow-xl z-30 p-6 overflow-y-auto"
            >
              <AnimatePresence mode="sync">
                <motion.div
                  key={activeSidebar}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                >
                  {activeSidebar === "Women" && <WomenSidebarWrapper />}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
