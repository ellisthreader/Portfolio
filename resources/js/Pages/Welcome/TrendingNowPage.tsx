"use client";

import React, { useState } from "react";
import { Link } from "@inertiajs/react";

type Category = "Shoes" | "Coats & Jackets" | "Hoodies";

interface Product {
  slug: string;
  brand: string;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  hoverImage?: string;
}

const trendingItems: Record<Category, Product[]> = {
  Shoes: [
    {
      slug: "cloudmonster",
      brand: "ON",
      name: "Cloudmonster",
      price: "£160",
      image: "/images/Trending/cloudtecW1.png",
      hoverImage: "/images/Trending/cloudtecW2.png",
    },
    {
      slug: "low-vulcanized",
      brand: "Off White",
      name: "Low Vulcanized Leather Trainers",
      price: "£149.99",
      originalPrice: "£300",
      image: "/images/Trending/offwhiteV1.avif",
      hoverImage: "/images/Trending/offwhiteV2.avif",
    },
    {
      slug: "yeezy-boost-350-v2",
      brand: "Yeezy",
      name: "Boost 350 V2 Sneakers with Boost Technology",
      price: "£90",
      originalPrice: "£250",
      image: "/images/Trending/yeezyW1.avif",
      hoverImage: "/images/Trending/YeezyW2.avif",
    },
    {
      slug: "uggtasman",
      brand: "Ugg",
      name: "Womens Tasman II",
      price: "£115",
      image: "/images/Trending/UGG1.avif",
      hoverImage: "/images/Trending/UGG2.avif",
    },
    {
      slug: "balenciaga-x-adidas",
      brand: "BALENCIAGA",
      name: "X Adidas Speed Trainers",
      price: "£150",
      originalPrice: "£700",
      image: "/images/Trending/BalenciagaX1.avif",
      hoverImage: "/images/Trending/BalenciagaX2.avif",
    },
  ],
  "Coats & Jackets": [
    {
      slug: "moncler-maya-puffer",
      brand: "MONCLER",
      name: "Men's Nylon Maya Down Puffer Jacket",
      price: "£1,300",
      image: "/images/Trending/MonclerM1.avif",
      hoverImage: "/images/Trending/MonclerM2.avif",
    },
    {
      slug: "polo-ralph-lauren-elcap",
      brand: "Polo Ralph Lauren",
      name: "El Cap Puffer Down Jacket",
      price: "£445",
      image: "/images/Trending/PoloM1.avif",
      hoverImage: "/images/Trending/PoloM2.avif",
    },
    {
      slug: "tnf-retro-nuptse",
      brand: "THE NORTH FACE",
      name: "TNF 1996 Retro Nuptse Jacket Womens",
      price: "£315",
      image: "/images/Trending/TNFW1.avif",
      hoverImage: "/images/Trending/TNFW2.avif",
    },
    {
      slug: "polo-womens-bomber",
      brand: "POLO RALPH LAUREN",
      name: "Women's Bomber Jacket",
      price: "£459",
      originalPrice: "£645",
      image: "/images/Trending/PoloBW1.avif",
      hoverImage: "/images/Trending/PoloBW2.avif",
    },
    {
      slug: "prada-trench",
      brand: "PRADA",
      name: "Single-Breasted Cotton Twill Trench Coat",
      price: "£3,500",
      image: "/images/Trending/PradaW1.avif",
      hoverImage: "/images/Trending/PradaW2.avif",
    },
  ],
  Hoodies: [
    {
      slug: "polo-tech-hoodie",
      brand: "POLO RALPH LAUREN",
      name: "Men's Full-Zip Tech Hoodie",
      price: "£145",
      originalPrice: "£179",
      image: "/images/Trending/PoloZip1.avif",
      hoverImage: "/images/Trending/PoloZip2.avif",
    },
    {
      slug: "palm-angels-gothic",
      brand: "PALM ANGELS",
      name: "Gothic Logo Hoodie",
      price: "£175",
      originalPrice: "£349",
      image: "/images/Trending/PalmAngels1.avif",
      hoverImage: "/images/Trending/PalmAngels2.avif",
    },
    {
      slug: "stone-island-jumper",
      brand: "STONE ISLAND",
      name: "Men's Logo Lightweight Cotton Fleece Jumper",
      price: "£219",
      originalPrice: "£275",
      image: "/images/Trending/StoneIsland1.avif",
      hoverImage: "/images/Trending/StoneIsland2.avif",
    },
    {
      slug: "essentials-back-logo",
      brand: "FEAR OF GOD ESSENTIALS",
      name: "Back Logo Over The Head Hoodie",
      price: "£115",
      originalPrice: "£140",
      image: "/images/Trending/EssentialsW1.avif",
      hoverImage: "/images/Trending/EssentialsW2.avif",
    },
    {
      slug: "polo-womens-flag",
      brand: "POLO RALPH LAUREN",
      name: "Women's Flag Crew Sweatshirt",
      price: "£95",
      originalPrice: "£189",
      image: "/images/Trending/RalphLaurenW1.avif",
      hoverImage: "/images/Trending/RalphLaurenW2.avif",
    },
  ],
};

const categories: Category[] = ["Shoes", "Coats & Jackets", "Hoodies"];

export default function TrendingNowPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("Shoes");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 w-full pt-6 pb-12 px-4 md:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-12">
        <h2 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-gray-100 mb-6 md:mb-0">
          Trending Now
        </h2>

        <div className="flex gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-4 rounded-2xl shadow-md transition-all duration-300 font-semibold ${
                activeCategory === cat
                  ? "bg-gray-800 text-white dark:bg-white dark:text-gray-900"
                  : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:shadow-xl"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between gap-4 flex-wrap">
        {trendingItems[activeCategory].map((product, idx) => (
          <Link
            key={idx}
            href={`/product/${product.slug}`}
            className="flex-shrink-0 w-[calc(20%-0.8rem)]"
          >
            <div
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
            >
              <img
                src={
                  hoveredIndex === idx && product.hoverImage
                    ? product.hoverImage
                    : product.image
                }
                alt={`${product.brand} ${product.name}`}
                className="w-full h-80 md:h-96 lg:h-[28rem] object-cover"
                draggable={false}
              />
              <div className="p-4 flex flex-col justify-between flex-1">
                <p className="font-bold text-gray-800 dark:text-gray-100">
                  {product.brand}
                </p>
                {product.name && (
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
                    {product.name}
                  </p>
                )}
                <p className="mt-2 font-semibold">
                  <span
                    className={
                      product.originalPrice
                        ? "text-red-600"
                        : "text-gray-900 dark:text-gray-100"
                    }
                  >
                    {product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-gray-400 line-through ml-2">
                      {product.originalPrice}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
