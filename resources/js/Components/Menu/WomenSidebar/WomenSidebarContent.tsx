"use client";

import React from "react";
import { WomenCategoryData } from "@/Data/womenCategories";
import { ArrowLeft } from "lucide-react";
import { Inertia } from "@inertiajs/inertia";

interface WomenSidebarProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  categoryData: WomenCategoryData;
}

export default function WomenSidebarContent({
  selectedCategory,
  onSelectCategory,
  categoryData,
}: WomenSidebarProps) {
  const { topLevel, links, subcategories } = categoryData;

  const isSubcategoryView = selectedCategory !== null;

  return (
    <div className="flex flex-col h-full text-gray-700 dark:text-gray-200">
      {/* BACK BUTTON ONLY */}
      <div className="flex items-center gap-3 mb-4">
        {isSubcategoryView && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white transition"
          >
            <ArrowLeft size={28} />
          </button>
        )}
      </div>

      <div className="flex flex-col flex-1">
        {/* MAIN WOMEN MENU */}
        {!isSubcategoryView && (
          <div className="space-y-6">
            <div className="space-y-2">
              {topLevel.map((item, i) => (
                <h2
                  key={i}
                  className="text-2xl font-bold uppercase hover:underline cursor-pointer"
                >
                  {item.title}
                </h2>
              ))}
            </div>

            <div className="space-y-1 mt-4">
              {links.map((link, i) => (
                <button
                  key={i}
                  onClick={() => onSelectCategory(link.key)}
                  className="block text-left uppercase text-sm hover:underline"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SUBCATEGORY VIEW */}
        {isSubcategoryView && (
          <div className="mt-4 space-y-1">
            {subcategories[selectedCategory]?.map((name, i) => (
              <button
                key={i}
                onClick={() =>
                  Inertia.visit(`/category/${name.toLowerCase()}`)
                }
                className="block text-left uppercase text-sm hover:underline"
              >
                {name}
              </button>
            ))}
          </div>
        )}

        {/* FOOTER LINKS */}
        <div className="space-y-1 mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
          <a href="#" className="block uppercase text-sm hover:underline">
            CUSTOMER SERVICE
          </a>
          <a href="#" className="block uppercase text-sm hover:underline">
            Privacy & Legal
          </a>
          <a href="#" className="block uppercase text-sm hover:underline">
            NEWSLETTER
          </a>
          <a href="#" className="block uppercase text-sm hover:underline">
            CHANGE REGION
          </a>
        </div>
      </div>
    </div>
  );
}
