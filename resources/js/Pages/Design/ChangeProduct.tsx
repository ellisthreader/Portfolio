"use client";

import React, { useState, useMemo } from "react";
import { usePage, router } from "@inertiajs/react";
import ChangeProductCard from "@/Pages/Product/ChangeProductCard";
import SearchBar from "@/Pages/Design/SearchBar";

interface Product {
  id: number;
  brand?: string;
  name: string;
  slug: string;
  price?: number | string;
  original_price?: number | string | null;
  images?: any[];
  image?: string;
}

interface Category {
  id: number | string;
  name: string;
  slug: string;
  section: string;
  subsection?: string | null;
  age_group?: string | null;
  products?: Product[];
}

export default function ChangeProductModal({ onClose }: { onClose: () => void }) {
  const { props } = usePage<{
    adultCategories: Category[];
    kidsCategories: Record<string, Category[]>;
  }>();

  const adult = props.adultCategories ?? [];
  const kids = props.kidsCategories ?? {};

  // Build a flattened list of ALL categories available (adult + kids)
  const allCategories: Category[] = useMemo(() => {
    const kidsFlattened = Object.values(kids).flat();
    return [...adult, ...kidsFlattened].filter(Boolean);
  }, [adult, kids]);

  // Initial selected category (first available)
  const firstCategory = adult[0] || Object.values(kids)[0]?.[0] || null;
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(firstCategory);

  const baseCategory = selectedCategory?.name ?? "Category";

  // Called when user selects a category from the SearchBar
  const handleCategoryFromSearch = (category: Category) => {
    setSelectedCategory(category);
    const productArea = document.getElementById("product-grid");
    if (productArea) productArea.scrollTop = 0;
  };

  // Called when user clicks a category in the left sidebar
  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
  };

  // Navigate to product design page
  const navigateToProduct = (slug: string) => {
    router.visit(`/design/${encodeURIComponent(slug)}`, {
      method: "get",
      preserveScroll: true,
      onSuccess: () => onClose(),
    });
  };

  const handleProductSelect = (product: Product) => {
    navigateToProduct(product.slug);
  };

  // Normalize product images array
  const filteredProducts = (selectedCategory?.products ?? []).map((p: any) => ({
    ...p,
    images: Array.isArray(p.images) ? p.images : p.image ? [p.image] : [],
  }));

  // -----------------------
  // Sidebar logic: show all categories (adult + kids grouped) that match the selected category name
  // -----------------------
  const highlightedAdultCategories = useMemo(() => {
    if (!selectedCategory) {
      // if nothing selected, show all adult categories
      return adult.map(c => ({ ...c, isSelected: false }));
    }

    const selName = (selectedCategory.name ?? "").toString().trim().toLowerCase();

    // find all adult categories (age_group null/undefined) whose name equals selected name
    const adultsMatching = allCategories
      .filter(c => !c.age_group) // adults only
      .filter(c => (c.name ?? "").toString().trim().toLowerCase() === selName)
      .map(c => ({ ...c, isSelected: selectedCategory.id === c.id }));

    // If selected category is an adult category but somehow missing from adult list (rare),
    // ensure it's present and marked selected.
    if (!selectedCategory.age_group && !adultsMatching.some(c => c.id === selectedCategory.id)) {
      adultsMatching.push({ ...selectedCategory, isSelected: true });
    }

    // Keep stable order: try to preserve original adult ordering (men/women)
    const ordered = adult
      .filter(a => adultsMatching.some(m => m.id === a.id))
      .map(a => adultsMatching.find(m => m.id === a.id)!)
      // add any extras (selectedCategory fallback) at end
      .concat(adultsMatching.filter(m => !adult.some(a => a.id === m.id)));

    console.log("🔎 highlightedAdultCategories:", ordered);
    return ordered;
  }, [allCategories, adult, selectedCategory]);

  const highlightedKidsCategories = useMemo(() => {
    if (!selectedCategory) {
      // show all kids grouped if nothing selected
      const grouped: Record<string, Category[]> = {};
      Object.entries(kids).forEach(([ageGroup, cats]) => {
        grouped[ageGroup] = cats.map(c => ({ ...c, isSelected: false }));
      });
      return grouped;
    }

    const selName = (selectedCategory.name ?? "").toString().trim().toLowerCase();

    // collect kids categories that match name, grouped by age_group
    const grouped: Record<string, Category[]> = {};
    Object.entries(kids).forEach(([ageGroup, cats]) => {
      const matched = cats
        .filter(c => (c.name ?? "").toString().trim().toLowerCase() === selName)
        .map(c => ({ ...c, isSelected: selectedCategory.id === c.id }));

      if (matched.length > 0) grouped[ageGroup] = matched;
    });

    // If the selected category is a kids category, ensure its age_group entry exists and contains it
    if (selectedCategory.age_group) {
      const ag = selectedCategory.age_group;
      if (!grouped[ag]) grouped[ag] = [];
      if (!grouped[ag].some(x => x.id === selectedCategory.id)) {
        grouped[ag].push({ ...selectedCategory, isSelected: true });
      }
    }

    console.log("🔎 highlightedKidsCategories:", grouped);
    return grouped;
  }, [kids, selectedCategory, allCategories]);

  // Debug logs (useful while you test)
  console.log("🔔 selectedCategory:", selectedCategory);
  console.log("🔔 allCategories count:", allCategories.length);
  console.log("🔔 adult length:", adult.length, "kids groups:", Object.keys(kids).length);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm pt-12 animate-fadeIn">
      <div className="relative w-[88%] h-[88%] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 overflow-hidden border border-gray-200 dark:border-gray-700">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {baseCategory}
          </h2>

          <div className="flex items-center gap-4">
            <SearchBar
              allAdultCategories={adult}
              allKidsCategories={kids}
              onSelectCategory={handleCategoryFromSearch}
            />
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-4xl font-bold transition-all"
            >
              ×
            </button>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="flex flex-row gap-12 h-[calc(100%-90px)]">

          {/* LEFT SIDEBAR */}
          <div className="w-[270px] min-w-[270px] h-full border-r border-gray-200 dark:border-gray-700 pr-6 py-2 overflow-y-auto">

            {/* Adult */}
            <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">
              Adult Sections
            </h3>
            <div className="space-y-2">
              {highlightedAdultCategories.length > 0 ? (
                highlightedAdultCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat)}
                    className={`block w-full px-4 py-3 rounded-xl text-left font-medium 
                      transition shadow-sm
                      ${cat.isSelected
                        ? "bg-gray-900 text-white dark:bg-gray-700 shadow-md"
                        : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800"
                      }`}
                  >
                    {cat.section} — {cat.name}
                  </button>
                ))
              ) : (
                <div className="text-sm text-gray-500">No adult sections for this category.</div>
              )}
            </div>

            {/* Kids */}
            <h3 className="text-lg font-semibold mt-8 mb-3 text-gray-700 dark:text-gray-200">
              Kids Sections
            </h3>

            {Object.keys(highlightedKidsCategories).length > 0 ? (
              Object.entries(highlightedKidsCategories).map(([ageGroup, cats]) => (
                <div key={ageGroup} className="mb-6">
                  <p className="font-semibold mb-2 text-gray-600 dark:text-gray-400">
                    {ageGroup}
                  </p>
                  <div className="space-y-2">
                    {cats.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat)}
                        className={`block w-full px-4 py-3 rounded-xl text-left font-medium transition shadow-sm
                          ${cat.isSelected
                            ? "bg-gray-900 text-white dark:bg-gray-700 shadow-md"
                            : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800"
                          }`}
                      >
                        {cat.age_group ? `${cat.age_group} - ${cat.section}` : cat.section} — {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No kids sections for this category.</div>
            )}
          </div>

          {/* PRODUCT GRID */}
          <div
            id="product-grid"
            className="flex-grow h-full overflow-y-auto pb-6 pr-2"
          >
            {filteredProducts.length > 0 ? (
              <div
                className="
                  grid 
                  grid-cols-1 
                  sm:grid-cols-2 
                  md:grid-cols-3 
                  lg:grid-cols-4 
                  gap-8
                  justify-items-center
                "
              >
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="w-full max-w-[230px] h-[360px] flex flex-col"
                  >
                    <ChangeProductCard
                      product={{
                        ...product,
                        images: Array.isArray(product.images) ? product.images : product.image ? [product.image] : [],
                      }}
                      onSelect={() => handleProductSelect(product)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full border-2 border-dashed rounded-2xl flex items-center justify-center bg-gray-50 dark:bg-gray-800/30">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No products found for this section.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
