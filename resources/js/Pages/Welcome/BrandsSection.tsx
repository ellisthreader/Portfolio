"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const brands = [
  "/images/Brands/gucci.jpeg",
  "/images/Brands/LV.png",
  "/images/Brands/burberry.jpeg",
  "/images/Brands/dior.jpeg",
  "/images/Brands/yeezy.jpeg",
  "/images/Brands/balenciaga.jpeg",
  "/images/Brands/candagoose.jpeg",
  "/images/Brands/moncler.jpeg",
  "/images/Brands/offwhite.jpeg",
  "/images/Brands/palmangels.jpeg",
  "/images/Brands/stoneisland.jpeg",
  "/images/Brands/essentials.jpeg",
];

const smallBrands = [
  "/images/Brands/nike.png",
  "/images/Brands/chanel.png",
  "/images/Brands/adidas.png",
  "/images/Brands/underarmour.png",
  "/images/Brands/levis.png",
  "/images/Brands/newbalance.png",
  "/images/Brands/prada.png",
  "/images/Brands/fendi.png",
  "/images/Brands/versace.png",
  "/images/Brands/valentino.png",
  "/images/Brands/ralphlauren.png",
  "/images/Brands/thenorthface.png",
  "/images/Brands/tommyhilfiger.png",
  "/images/Brands/dolcegabbana.png",
  "/images/Brands/columbia.png",
  "/images/Brands/kenzo.png",
  "/images/Brands/givenchy.png",
];

export default function BrandsSection() {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 5;
  const [isHovered, setIsHovered] = useState(false);

  const handlePrev = () => setStartIndex((prev) => Math.max(prev - 1, 0));
  const handleNext = () =>
    setStartIndex((prev) => Math.min(prev + 1, brands.length - visibleCount));

  const offset = -(startIndex * (100 / visibleCount));

  return (
    <div className="bg-gray-50 dark:bg-gray-900 w-full pt-4 md:pt-6 pb-4 md:pb-6"> {/* Reduced bottom padding */}
      <h2 className="text-4xl md:text-6xl font-bold text-center mb-20 text-gray-800 dark:text-gray-100">
        Brands we sell
      </h2>

      {/* Main brand slider */}
      <div className="relative w-full  mb-20">
        <button
          onClick={handlePrev}
          disabled={startIndex === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-4 bg-white/80 dark:bg-gray-700 rounded-full shadow hover:bg-white dark:hover:bg-gray-600 transition disabled:opacity-30 z-20"
        >
          <FaChevronLeft size={24} />
        </button>

        <button
          onClick={handleNext}
          disabled={startIndex >= brands.length - visibleCount}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-4 bg-white/80 dark:bg-gray-700 rounded-full shadow hover:bg-white dark:hover:bg-gray-600 transition disabled:opacity-30 z-20"
        >
          <FaChevronRight size={24} />
        </button>

        <motion.div
          className="flex"
          animate={{ x: `${offset}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        >
          {brands.map((brand, idx) => (
            <div key={idx} className="flex-shrink-0 w-[20%] px-3">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1">
                <img
                  src={brand}
                  alt={`Brand ${idx + 1}`}
                  className="w-full h-80 md:h-96 lg:h-[28rem] object-cover"
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Continuous scrolling small brand logos */}
      <div className="-mt-8 "> {/* moved up */}
        <div
          className={`flex gap-10 items-center animate-scroll ${
            isHovered ? "animation-paused" : ""
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {[...smallBrands, ...smallBrands].map((brand, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.15, filter: "brightness(1.1)" }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="flex-shrink-0 cursor-pointer"
            >
              <img
                src={brand}
                alt={`Small brand ${idx + 1}`}
                className="w-24 h-24 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                draggable="false"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Inline CSS for animation */}
      <style jsx>{`
        @keyframes scroll {
          from {
            transform: translateX(0%);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animation-paused {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
