import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WomenSidebar({
  isOpen,
  onClose,
  instant = false,
  onMouseEnter,
  onMouseLeave,
}: {
  isOpen: boolean;
  onClose: () => void;
  instant?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* DARK OVERLAY (right half of the screen) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={
              instant ? { duration: 0 } : { type: "tween", duration: 0.25 }
            }
            onClick={onClose}
            className="fixed top-[64px] left-1/2 h-[calc(100%-64px)] w-1/2
                       bg-black/60 backdrop-blur-[1px] z-20 cursor-pointer"
          />

          {/* SIDEBAR (left half) */}
          <motion.div
            initial={instant ? false : { x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={instant ? { opacity: 0 } : { x: "-100%", opacity: 0 }}
            transition={
              instant
                ? { duration: 0 }
                : { type: "tween", duration: 0.25 }
            }
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="fixed top-[64px] left-0 h-[calc(100%-64px)] w-1/2
                       bg-white/90 dark:bg-gray-900/90 backdrop-blur-md
                       shadow-xl z-30 p-10 overflow-y-auto
                       transition-all duration-300"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold uppercase text-gray-900 dark:text-white">
                Women
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-black dark:hover:text-white text-xl transition"
              >
                ✕
              </button>
            </div>

            {/* LINKS */}
            <div className="space-y-4 text-gray-700 dark:text-gray-200">
              <a href="#" className="block hover:underline">
                Dresses
              </a>
              <a href="#" className="block hover:underline">
                Tops
              </a>
              <a href="#" className="block hover:underline">
                Shoes
              </a>
              <a href="#" className="block hover:underline">
                Accessories
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
