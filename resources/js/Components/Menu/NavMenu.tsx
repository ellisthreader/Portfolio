"use client";

import React, { useState, useRef } from "react";
import { useDarkMode } from "@/Context/DarkModeContext";
import { useCart } from "@/Context/CartContext";
import { Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { ShoppingCart, Search, User, Heart } from "lucide-react";

// SIDEBAR COMPONENTS
import WomenSidebar from "@/Components/Menu/WomenSidebar/WomenSidebar";
import MenSidebar from "@/Components/Menu/MenSidebar/MenSidebar";
import KidsSidebar from "@/Components/Menu/KidsSidebar/KidsSidebar";
import SaleSidebar from "@/Components/Menu/SaleSidebar/SaleSidebar";

export default function NavMenu() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { toggleCart } = useCart();

  const [activeSidebar, setActiveSidebar] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const categories = ["Women", "Men", "Kids", "Sale"];

  const detectCategory = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = (event.target as HTMLElement).closest("[data-category]");
    return el ? el.getAttribute("data-category") : null;
  };

  const handleNavMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const category = detectCategory(event);
    if (!category || isAnimating || category === activeSidebar) return;

    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);

    hoverTimeout.current = setTimeout(() => {
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
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);

    hoverTimeout.current = setTimeout(() => {
      setIsHovering(false);
      setActiveSidebar(null);
    }, 180);
  };

  const closeSidebar = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setIsHovering(false);
    setActiveSidebar(null);
  };

  const sidebarVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  };

  const renderSidebar = () => {
    switch (activeSidebar?.toLowerCase()) {
      case "women":
        return <WomenSidebar closeSidebar={closeSidebar} />;
      case "men":
        return <MenSidebar closeSidebar={closeSidebar} />;
      case "kids":
        return <KidsSidebar closeSidebar={closeSidebar} />;
      case "sale":
        return <SaleSidebar closeSidebar={closeSidebar} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <motion.nav
        className="
          fixed top-0 left-0 right-0 z-20
          bg-white/70 dark:bg-gray-900/70 
          backdrop-blur-xl 
          flex items-center justify-between 
          px-10 py-4 
          shadow-sm 
          border-b border-white/20 dark:border-gray-700/30
        "
      >
        <div className="flex items-center gap-16">
          {/* LOGO */}
          <Link href="/">
            <img src="/images/vaire-logo.png" className="h-11" />
          </Link>

          {/* NAV LINKS */}
          <div
            className="flex items-center gap-12 text-[17px] uppercase tracking-wide text-black dark:text-gray-200"
            onMouseMove={handleNavMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {categories.map((cat) => (
              <div
                key={cat}
                data-category={cat}
                onClick={() => setActiveSidebar(cat)}
                className="cursor-pointer px-4 py-2 transition-colors hover:text-gray-400 dark:hover:text-gray-300"
              >
                {cat}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-6 text-black dark:text-gray-200">
          <Search className="w-5 h-5 cursor-pointer hover:text-gray-400 dark:hover:text-gray-300 transition-colors" />
          <Heart className="w-5 h-5 cursor-pointer hover:text-gray-400 dark:hover:text-gray-300 transition-colors" />

          <Link href="/profile">
            <User className="w-5 h-5 cursor-pointer hover:text-gray-400 dark:hover:text-gray-300 transition-colors" />
          </Link>

          <div className="cursor-pointer" onClick={toggleCart}>
            <ShoppingCart className="w-5 h-5 hover:text-gray-400 dark:hover:text-gray-300 transition-colors" />
          </div>

          <DarkModeSwitch checked={darkMode} onChange={toggleDarkMode} size={20} />
        </div>
      </motion.nav>

      {/* SIDEBAR */}
      <AnimatePresence>
        {activeSidebar && (
          <>
            {/* OVERLAY */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: darkMode ? 0.6 : 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeSidebar}
              className="fixed top-[72px] left-0 w-full h-[calc(100%-72px)] bg-black z-20"
            />

            {/* SIDEBAR PANEL */}
            <motion.div
              key="sidebar"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.27 }}
              onAnimationStart={() => setIsAnimating(true)}
              onAnimationComplete={() => setIsAnimating(false)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="
                fixed top-[72px] left-0 
                h-[calc(100%-72px)] w-[35%] 
                bg-white dark:bg-gray-900 
                shadow-2xl 
                z-30 
                p-7 
                overflow-y-auto 
                flex flex-col
              "
            >
              {renderSidebar()}

              {/* BOTTOM NAV LINKS */}
              <div className="mt-10 pt-6  space-y-4 uppercase tracking-wide text-[15px]">
                <Link href="/help" className="block hover:text-gray-400 dark:hover:text-gray-300 transition-colors">
                  HELP
                </Link>

                <Link href="/faq" className="block hover:text-gray-400 dark:hover:text-gray-300 transition-colors">
                  FAQS
                </Link>

                <Link href="/support" className="block hover:text-gray-400 dark:hover:text-gray-300 transition-colors">
                  CONTACT US
                </Link>

                <Link href="/help/privacy" className="block hover:text-gray-400 dark:hover:text-gray-300 transition-colors">
                  PRIVACY & SECURITY
                </Link>

                <Link href="/company" className="block hover:text-gray-400 dark:hover:text-gray-300 transition-colors">
                  COMPANY
                </Link>

                <button className="block text-left hover:text-gray-400 dark:hover:text-gray-300 transition-colors">
                  CHANGE REGION
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
