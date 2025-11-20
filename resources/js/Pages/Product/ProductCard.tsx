import React from "react";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";

interface ProductImage {
  url: string;
}

interface ProductCardProps {
  product: {
    id: number;
    brand: string;
    name: string;
    slug: string | { slug: string }; 
    price: number | string;
    original_price?: number | string | null;
    images: (string | ProductImage)[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  console.log("🟦 ProductCard product:", product);

  // -------------------------------------
  // ✅ SAFELY EXTRACT SLUG ONLY ONE WAY
  // -------------------------------------
  const slug: string =
    typeof product.slug === "string"
      ? product.slug
      : product.slug?.slug ?? ""; // NEVER pull random values

  console.log("🟥 FINAL slug used:", slug);

  const href = `/product/${encodeURIComponent(slug)}`;
  console.log("🟩 Link HREF:", href);

  // -------------------------------------
  // MAIN IMAGE
  // -------------------------------------
  const mainImage: string =
    product.images?.length > 0
      ? typeof product.images[0] === "string"
        ? product.images[0]
        : (product.images[0] as ProductImage).url
      : "/images/no-image.png";

  const price = Number(product.price ?? 0);
  const originalPrice =
    product.original_price !== null && product.original_price !== undefined
      ? Number(product.original_price)
      : null;

  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border overflow-hidden"
      >
        <div className="relative w-full h-96 bg-gray-100 overflow-hidden">
          <motion.img
            src={mainImage}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <div className="p-5 space-y-1 bg-white">
          <p className="text-sm uppercase tracking-wide text-gray-500 font-medium">
            {product.brand}
          </p>

          <p className="text-lg font-semibold text-gray-800 leading-tight">
            {product.name}
          </p>

          <div className="pt-2">
            <span className="text-lg font-bold text-gray-900">
              £{price.toFixed(2)}
            </span>

            {originalPrice !== null && (
              <span className="text-gray-400 line-through ml-2 text-sm">
                £{originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
