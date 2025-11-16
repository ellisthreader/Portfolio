"use client";

import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import GuestLayout from "@/Layouts/GuestLayout";

interface Product {
  brand: string;
  name: string;
  slug: string;
  price: number | string;
  original_price?: number | string | null;
  description?: string;
  images: Record<string, string[]> | string[];
  sizes?: Record<string, string[]> | string[];
  colour?: string[] | string;
  specifications?: string;
}

interface Props {
  product: Product;
}

export default function ProductLayout({ product }: Props) {
  const Layout = product ? AuthenticatedLayout : GuestLayout;

  // Convert JSON strings to objects if necessary
  const imagesByColour: Record<string, string[]> =
    typeof product.images === "string" ? JSON.parse(product.images) : product.images as Record<string, string[]>;

  const sizesByColour: Record<string, string[]> =
    typeof product.sizes === "string" ? JSON.parse(product.sizes) : product.sizes as Record<string, string[]>;

  const colours: string[] =
    typeof product.colour === "string" ? JSON.parse(product.colour) : (product.colour || []);

  const price = Number(product.price);
  const originalPrice =
    product.original_price !== undefined && product.original_price !== null
      ? Number(product.original_price)
      : undefined;

  const [selectedColour, setSelectedColour] = useState<string>(colours[0] || "");
  const [images, setImages] = useState<string[]>(imagesByColour[selectedColour] || []);
  const [sizes, setSizes] = useState<string[]>(sizesByColour[selectedColour] || []);
  const [openTab, setOpenTab] = useState<number | null>(null);

  useEffect(() => {
    console.log("Product received:", product);
    console.log("Available colours:", colours);
  }, [product]);

  useEffect(() => {
    setImages(imagesByColour[selectedColour] || []);
    setSizes(sizesByColour[selectedColour] || []);
  }, [selectedColour]);

  return (
    <Layout>
      <Head title={product.name} />

      <div className="pt-[80px] flex flex-col md:flex-row gap-10 p-8">
        {/* LEFT — images */}
        <div className="flex-[3]">
          <div className="grid grid-cols-2 gap-1">
            {images.map((img, i) => (
              <div key={i} className="w-full h-[600px] relative">
                <img
                  src={img}
                  alt={`${product.name}-${selectedColour}-${i}`}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — product details */}
        <div className="flex-[1] pr-4">
          <p className="uppercase text-gray-500">{product.brand}</p>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <p className="text-2xl font-semibold">
            £{isNaN(price) ? "0.00" : price.toFixed(2)}{" "}
            {originalPrice !== undefined && !isNaN(originalPrice) && (
              <span className="text-gray-400 line-through ml-2">
                £{originalPrice.toFixed(2)}
              </span>
            )}
          </p>

          {/* Colours */}
          {colours.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold mb-2">Colour</p>
              <div className="flex gap-3">
                {colours.map((colour) => {
                  const isActive = selectedColour === colour;
                  const firstImage = imagesByColour[colour][0];
                  return (
                    <img
                      key={colour}
                      src={firstImage}
                      alt={colour}
                      className={`w-12 h-12 object-cover rounded cursor-pointer border-2 ${
                        isActive
                          ? "border-black scale-110"
                          : "border-gray-300"
                      } transition-transform`}
                      onClick={() => setSelectedColour(colour)}
                      title={colour}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Sizes */}
          {sizes.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold mb-2">Size</p>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((s) => (
                  <div
                    key={s}
                    className="px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-100"
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button className="bg-black text-white px-6 py-3 rounded-full mt-6">
            Add to Bag
          </button>

          <p className="mt-8 text-gray-700 leading-relaxed">
            {product.description}
          </p>

          {/* Accordion */}
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
