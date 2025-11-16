"use client";

import React, { useState, useRef } from "react";
import { useDarkMode } from "@/Context/DarkModeContext";
import { useCart } from "@/Context/CartContext";
import { Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { ShoppingCart, Search, User, Heart } from "lucide-react";

// --- Import Sidebar Content Only ---
import WomenSidebarContent from "@/Components/Menu/WomenSidebar/WomenSidebarContent";
import MenSidebarContent from "@/Components/Menu/MenSidebar/MenSidebarContent";
import KidsSidebarContent from "@/Components/Menu/KidsSidebar/KidsSidebarContent";
import SaleSidebarContent from "@/Components/Menu/SaleSidebar/SaleSidebarContent";

export default function NavMenu() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { cart, toggleCart } = useCart();

  const [activeSidebar, setActiveSidebar] = useState<string | null>(null);
  const [previousSidebar, setPreviousSidebar] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // Prevent rapid tab spam
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const totalItems = cart.reduce(
    (acc: number, item: { quantity: number }) => acc + item.quantity,
    0
  );

  const categories = ["Women", "Men", "Kids", "Sale"];

  // ---------- Hover/category detection (one top-level handler) ----------
  const detectCategory = (event: React.MouseEvent<HTMLDivElement>) => {
    // find nearest ancestor with data-category attribute
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
      setIsHovering(true); // keep this for internal state but we won't render sidebar based on it
    }, 120);
  };

  const handleMouseEnter = () => {
    // entering the nav area
    setIsHovering(true);
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
  };

  const handleMouseLeave = () => {
    // leaving the nav area entirely — schedule close
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }

    hoverTimeout.current = setTimeout(() => {
      setIsHovering(false);
      setActiveSidebar(null); // IMPORTANT: only close when timeout finishes
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

  // --- Sidebar animation variants ---
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
        {/* LEFT: LOGO + NAV LINKS */}
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

          {/* Single top-level handlers only */}
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
                className="relative px-6 py-3 cursor-pointer"
              >
                {/* full hit area behind the text */}
                <div className="absolute inset-0 -mx-4 -my-3 z-0 pointer-events-none" />
                <Link
                  href={`/${category.toLowerCase()}`}
                  className="relative z-10 text-gray-500 
                  hover:text-black dark:hover:text-white hover:font-semibold 
                  transition-all duration-200"
                >
                  {category}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: ICONS */}
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

      {/* OVERLAY + SIDEBAR: only render when we have an activeSidebar */}
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

            {/* Sidebar Panel */}
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
              className="fixed top-[64px] left-0 h-[calc(100%-64px)] w-[35%]  bg-white dark:bg-gray-900 shadow-xl z-30 p-10 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold uppercase text-gray-900 dark:text-white">
                  {activeSidebar}
                </h2>
                <button
                  onClick={closeSidebar}
                  className="text-xl text-gray-500 hover:text-black dark:text-gray-300 dark:hover:text-white transition"
                >
                  ✕
                </button>
              </div>

              {/* Only animate content (use sync so new content can appear smoothly) */}
              <AnimatePresence mode="sync">
                <motion.div
                  key={activeSidebar}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                >
                  {activeSidebar === "Women" && <WomenSidebarContent />}
                  {activeSidebar === "Men" && <MenSidebarContent />}
                  {activeSidebar === "Kids" && <KidsSidebarContent />}
                  {activeSidebar === "Sale" && <SaleSidebarContent />}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
