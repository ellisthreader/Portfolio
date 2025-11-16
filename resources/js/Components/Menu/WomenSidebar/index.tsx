"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import WomenSidebarContent from "./WomenSidebarContent";

interface Props {
  isOpen: boolean;
  instant?: boolean;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function WomenSidebar({
  isOpen,
  instant,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: instant ? 0 : 0.15 }}
            onClick={onClose}
            className="fixed top-[64px] left-0 w-full h-[calc(100%-64px)] bg-black z-20 cursor-pointer"
          />

          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ type: "tween", duration: instant ? 0 : 0.25 }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="fixed top-[64px] left-0 h-[calc(100%-64px)] w-1/2 bg-white dark:bg-gray-900 shadow-xl z-30 p-10 overflow-y-auto"
          >
            <WomenSidebarContent />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
