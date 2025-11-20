"use client";

import React, { useState } from "react";
import WomenSidebarContent from "./Menu/WomenSidebar/WomenSidebarContent";
import { womenCategories } from "@/Data/womenCategories";

export default function WomenSidebarWrapper() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const currentTitle = selectedCategory
    ? selectedCategory.toUpperCase()
    : "WOMEN";

  return (
    <div className="flex flex-col h-full text-gray-700 dark:text-gray-200 pt-2">
      {/* --- BIG TITLE AT TOP --- */}
      <h2 className="text-3xl font-bold mb-4 tracking-wide">
        {currentTitle}
      </h2>

      {/* --- Sidebar content --- */}
      <div className="flex-1 overflow-y-auto">
        <WomenSidebarContent
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryData={womenCategories}
        />
      </div>
    </div>
  );
}
