import { useDarkMode } from "@/Context/DarkModeContext";
import { Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";

export default function NavMenu() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowNav(currentScrollY < 50 || currentScrollY < lastScrollY);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      {showNav && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md flex items-center justify-center gap-4 px-6 py-4 shadow-md transition-colors duration-300"
        >
          <div className="flex gap-6 text-lg font-semibold text-gray-900 dark:text-gray-100">
            <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400">About</Link>
            <Link href="/work" className="hover:text-blue-600 dark:hover:text-blue-400">Work</Link>
            <Link href="/resume" className="hover:text-blue-600 dark:hover:text-blue-400">Resume</Link>
            <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400">Contact</Link>
            <Link href="/login" className="hover:text-blue-600 dark:hover:text-blue-400">Login</Link>
          </div>

          <DarkModeSwitch
            checked={darkMode}
            onChange={toggleDarkMode}
            size={24}
            className="ml-4"
          />
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
