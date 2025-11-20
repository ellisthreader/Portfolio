"use client";

import React from "react";

const categories = [
  { name: "New In", image: "/images/Category/new-in.jpg" },
  { name: "Winter", image: "/images/Category/winter.jpg" },
  { name: "Sale", image: "/images/Category/sale.jpeg" },
  { name: "Shoes", image: "/images/Category/shoes.jpg" },
  { name: "Bags", image: "/images/Category/bags.jpg" },
  { name: "Teddies", image: "/images/Category/teddies.jpg" },
  { name: "T-Shirts", image: "/images/Category/tshirts.jpeg" },
  { name: "Jumpers", image: "/images/Category/jumpers.jpg" },
  { name: "Trousers", image: "/images/Category/trousers.jpg" },
  { name: "Accessories", image: "/images/Category/accessories.jpg" },
];

export default function CategorySection() {
  return (
    <div className="pt-16 pb-8 bg-gray-50 dark:bg-gray-900 w-full">
      {/* Full width horizontal row */}
      <div className="flex gap-10 overflow-x-auto w-full px-6 no-scrollbar justify-between">
        {categories.map((category) => (
          <div
            key={category.name}
            className="flex flex-col items-center min-w-[128px] cursor-pointer group"
          >
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-black/25 transition">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <span className="mt-3 text-center text-sm md:text-base font-medium text-gray-700 dark:text-gray-200">
              {category.name}
            </span>
          </div>
        ))}
      </div>

      {/* Hide scrollbar */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
