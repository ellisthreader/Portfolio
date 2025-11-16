import React from "react";
import { Link } from "@inertiajs/react";

interface Product {
  id: number;
  brand: string;
  name: string;
  slug: string;
  price: number;
  original_price?: number;
  images: string[];
}

interface Props {
  type: string;
  products: Product[];
}

export default function ProductsIndex({ type, products }: Props) {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6">{type}</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            href={`/product/${product.slug}`}
            key={product.id}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
          >
            <img
              src={product.images?.[0]}
              alt={product.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <p className="font-bold">{product.brand}</p>
              <p className="text-gray-700">{product.name}</p>
              <p className="mt-2 font-semibold">
                £{product.price.toFixed(2)}{" "}
                {product.original_price && (
                  <span className="text-gray-400 line-through ml-2">
                    £{product.original_price.toFixed(2)}
                  </span>
                )}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
