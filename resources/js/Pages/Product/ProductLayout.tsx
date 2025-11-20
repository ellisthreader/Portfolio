"use client";

import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useCart } from "@/Context/CartContext";

interface ColourProduct {
  colour: string;
  slug: string;
  sizes: string[];
  images: string[];
}

interface Product {
  brand: string;
  name: string;
  slug: string;
  price: number | string;
  original_price?: number | string | null;
  description?: string;
  images: string[];
  sizes: string[];
  colourProducts: ColourProduct[];
  specifications?: string;
}

interface Props {
  product: Product;
}

export default function ProductLayout({ product }: Props) {
  const Layout = AuthenticatedLayout;
  const { addToCart } = useCart();

  const colours = product.colourProducts.map((p) => p.colour);

  const initialVariant =
    product.colourProducts.find((p) => p.slug === product.slug) ??
    product.colourProducts[0];

  const [selectedColour, setSelectedColour] = useState<string>(
    initialVariant.colour
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizeError, setShowSizeError] = useState<boolean>(false);

  const currentVariant =
    product.colourProducts.find((p) => p.colour === selectedColour) ??
    product.colourProducts[0];

  const images = currentVariant?.images ?? product.images;
  const sizes = currentVariant?.sizes ?? product.sizes;

  const [openTab, setOpenTab] = useState<number | null>(null);

  const price = Number(product.price);
  const originalPrice =
    product.original_price !== undefined && product.original_price !== null
      ? Number(product.original_price)
      : undefined;

  // ✅ FIXED — brand is now passed to cart
  const handleAddToBag = () => {
    if (!selectedSize) {
      setShowSizeError(true);
      return;
    }

    addToCart({
      id: product.slug,
      title: product.name,
      brand: product.brand,          // <-- BRAND NOW INCLUDED
      price: price,
      image: images[0],
      colour: selectedColour,
      size: selectedSize,
      availableSizes: sizes,
      slug: product.slug,
    });

    setShowSizeError(false);
  };

  return (
    <Layout>
      <Head title={product.name} />

      <div className="pt-[80px] flex flex-col md:flex-row gap-10 p-8">
        {/* LEFT — IMAGES */}
        <div className="flex-[3]">
          <div className="grid grid-cols-2 gap-1">
            {images.length > 0 ? (
              images.map((img, i) => (
                <div key={i} className="w-full h-[600px] relative bg-gray-100">
                  <img
                    src={img}
                    alt={`${product.name}-${i}`}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                </div>
              ))
            ) : (
              <p>No images available</p>
            )}
          </div>
        </div>

        {/* RIGHT — DETAILS */}
        <div className="flex-[1] pr-4">
          <p className="uppercase text-gray-500">{product.brand}</p>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <p className="text-2xl font-semibold">
            £{isNaN(price) ? "0.00" : price.toFixed(2)}
            {originalPrice !== undefined && !isNaN(originalPrice) && (
              <span className="text-gray-400 line-through ml-2">
                £{originalPrice.toFixed(2)}
              </span>
            )}
          </p>

          {/* COLOUR SECTION */}
          {colours.length > 0 && (
            <div className="mt-6">
              <p className="font-semibold mb-2 text-lg">
                Colour:{" "}
                <span className="font-bold text-gray-900">{selectedColour}</span>
              </p>

              <div className="flex gap-3 mt-3">
                {product.colourProducts.map((cp) => {
                  const preview = cp.images?.[0] ?? product.images?.[0] ?? "";
                  return (
                    <div
                      key={cp.colour}
                      onClick={() => {
                        setSelectedColour(cp.colour);
                        setSelectedSize(null);
                        setShowSizeError(false);
                      }}
                      className={`w-16 h-16 border cursor-pointer flex items-center justify-center overflow-hidden rounded-lg
                        ${
                          selectedColour === cp.colour
                            ? "border-black scale-105 shadow-md"
                            : "border-gray-300 hover:scale-105 hover:shadow-sm"
                        } transition-transform`}
                    >
                      <img
                        src={preview}
                        alt={cp.colour}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SIZES */}
          {sizes.length > 0 && (
            <div className="mt-6">
              <p className="font-semibold mb-3 text-lg">Size</p>
              <div className="flex flex-wrap gap-3">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSelectedSize(s);
                      setShowSizeError(false);
                    }}
                    className={`px-5 py-3 rounded-lg font-medium border transition-all duration-200
                      ${
                        selectedSize === s
                          ? "bg-black text-white border-black shadow-lg scale-105"
                          : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100 hover:scale-105"
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {showSizeError && (
                <p className="mt-2 text-red-500 font-medium">
                  Please select a size
                </p>
              )}
            </div>
          )}

          <button
            onClick={handleAddToBag}
            className="bg-black text-white px-6 py-3 rounded-full mt-6 hover:bg-gray-900 transition-colors"
          >
            Add to Bag
          </button>

          <p className="mt-8 text-gray-700 leading-relaxed">
            {product.description}
          </p>

          {/* ACCORDION */}
          <div className="mt-8 pt-4">
            {[
              {
                title: "Product Specifications",
                content: product.specifications || "No specifications added.",
              },
              {
                title: "Delivery",
                content:
                  "Standard delivery: 3–5 working days. Next-day delivery available.",
              },
              {
                title: "Returns",
                content:
                  "30-day free returns. Item must be unworn with tags attached.",
              },
            ].map((tab, i) => (
              <div key={i} className="mb-4">
                <button
                  className="w-full text-left font-semibold flex justify-between items-center pb-2"
                  onClick={() => setOpenTab(openTab === i ? null : i)}
                >
                  {tab.title}
                  <span>{openTab === i ? "-" : "+"}</span>
                </button>

                {openTab === i && (
                  <p className="mt-2 text-gray-600 whitespace-pre-line">
                    {tab.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
