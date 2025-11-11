"use client";

import React from "react";

const categories = [
  { name: "New In", image: "/categories/new-in.jpg" },
  { name: "Winter", image: "/categories/winter.jpg" },
  { name: "Sale", image: "/categories/sale.jpg" },
  { name: "Shoes", image: "/categories/shoes.jpg" },
  { name: "Bags", image: "/categories/bags.jpg" },
  { name: "Teddies", image: "/categories/teddies.jpg" },
  { name: "Shirts", image: "/categories/shirts.jpg" },
  { name: "Jumpers", image: "/categories/jumpers.jpg" },
  { name: "Trousers", image: "/categories/trousers.jpg" },
  { name: "Accessories", image: "/categories/accessories.jpg" },
];

export default function CategorySection() {
  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-900 w-full">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800 dark:text-gray-100">
        Shop by Category
      </h2>

      {/* Full width horizontal row */}
      <div className="flex gap-8 overflow-x-auto w-full px-6 no-scrollbar justify-between">
        {categories.map((category) => (
          <div
            key={category.name}
            className="flex flex-col items-center min-w-[96px] cursor-pointer group"
          >
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-blue-500 transition transform group-hover:scale-105">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
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
