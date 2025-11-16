"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import SaleSidebarContent from "./SaleSidebarContent";

interface SaleSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  instant?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function SaleSidebar({
  isOpen,
  onClose,
  instant = false,
  onMouseEnter,
  onMouseLeave,
}: SaleSidebarProps) {
  const sidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0 },
    exit: { x: "-100%" },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            transition={instant ? { duration: 0 } : { duration: 0.2, delay: 0.05 }}
            onClick={onClose}
            className="fixed top-[64px] left-0 w-full h-[calc(100%-64px)] bg-black/60 z-20 cursor-pointer"
          />

          {/* Sidebar Panel */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sidebarVariants}
            transition={instant ? { duration: 0 } : { type: 'tween', duration: 0.35 }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="fixed top-[64px] left-0 h-[calc(100%-64px)] w-[400px] md:w-1/2
                       bg-white dark:bg-gray-900 shadow-xl z-30 p-10 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold uppercase text-gray-900 dark:text-white">
                Sale
              </h2>
              <button
                onClick={onClose}
                className="text-xl text-gray-500 hover:text-black dark:text-gray-300 dark:hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {/* Sidebar Content */}
            <SaleSidebarContent />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
