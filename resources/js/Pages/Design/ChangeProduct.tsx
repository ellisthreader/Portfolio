"use client";

import React from "react";
import { usePage, router } from "@inertiajs/react";

interface Category {
  id: number | string;
  name: string;
  slug: string;
  products?: { id: number; slug: string }[]; // Optional: first product in category
}

export default function ChangeProduct() {
  // Props passed from Laravel
  const { props } = usePage<{ categories: Category[] }>();
  const categories = props.categories ?? [];

  const handleCategoryClick = (category: Category) => {
    // Navigate to the first product in the category, fallback to category slug page
    const firstProduct = category.products?.[0];
    if (firstProduct) {
      router.get(`/design/${firstProduct.slug}`);
    } else {
      router.get(`/categories/${category.slug}`);
    }
  };

  return (
    <div className="p-6 w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Choose a Category
      </h2>

      {categories.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          No categories available.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat)}
              className="w-full py-4 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-semibold text-center transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
