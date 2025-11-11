"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const brands = [
  "/brands/brand1.jpg",
  "/brands/brand2.jpg",
  "/brands/brand3.jpg",
  "/brands/brand4.jpg",
  "/brands/brand5.jpg",
  "/brands/brand6.jpg",
  "/brands/brand7.jpg",
  "/brands/brand8.jpg",
  "/brands/brand9.jpg",
  "/brands/brand10.jpg",
];

export default function BrandsSection() {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 5;

  // Move one image at a time
  const handlePrev = () => setStartIndex((prev) => Math.max(prev - 1, 0));
  const handleNext = () =>
    setStartIndex((prev) => Math.min(prev + 1, brands.length - visibleCount));

  const visibleBrands = brands.slice(startIndex, startIndex + visibleCount);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 w-screen py-40 md:py-48">
      {/* Heading */}
      <h2 className="text-4xl md:text-6xl font-bold text-center mb-24 text-gray-800 dark:text-gray-100">
        Brands we sell
      </h2>

      <div className="relative w-full">
        {/* Left arrow */}
        <button
          onClick={handlePrev}
          disabled={startIndex === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-4 bg-white/80 dark:bg-gray-700 rounded-full shadow hover:bg-white dark:hover:bg-gray-600 transition disabled:opacity-30 z-20"
        >
          <FaChevronLeft size={24} />
        </button>

        {/* Right arrow */}
        <button
          onClick={handleNext}
          disabled={startIndex >= brands.length - visibleCount}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-4 bg-white/80 dark:bg-gray-700 rounded-full shadow hover:bg-white dark:hover:bg-gray-600 transition disabled:opacity-30 z-20"
        >
          <FaChevronRight size={24} />
        </button>

        {/* Brand images row */}
        <div className="flex w-full overflow-hidden">
          <AnimatePresence initial={false}>
            {visibleBrands.map((brand, idx) => (
              <motion.div
                key={brand}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="flex-shrink-0 w-[20%]" // each image takes 20% of viewport width
              >
                <img
                  src={brand}
                  alt={`Brand ${startIndex + idx + 1}`}
                  className="w-full h-80 md:h-96 lg:h-[28rem] object-cover rounded-md shadow-sm"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
