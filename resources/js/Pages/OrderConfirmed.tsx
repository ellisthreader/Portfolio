import React, { useEffect } from "react";
import { usePage } from "@inertiajs/react";

interface Item {
  name: string;
  quantity: number;
  unit_price: number;
  image?: string;
}

export default function OrderConfirmed() {
  const { props } = usePage();

  useEffect(() => {
    console.log("Page props:", props);
  }, [props]);

  const subtotal = Number(props.subtotal ?? 0);
  const vat = Number(props.vat ?? 0);
  const total = Number(props.total ?? 0);

  // Repair the flat array into grouped items
  const rawItems = (props.items as any[]) ?? [];
  const items: Item[] = [];
  for (let i = 0; i < rawItems.length; i += 5) {
    items.push({
      name: rawItems[i + 1]?.title ?? "Unknown",
      quantity: Number(rawItems[i + 3]?.quantity ?? 0),
      unit_price: Number(rawItems[i + 2]?.price ?? 0),
      image: rawItems[i + 4]?.image,
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-2xl p-8 sm:p-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Order Confirmed!</h1>
          <p className="mt-2 text-gray-600">
            Thank you for your purchase. Your order has been successfully processed.
          </p>
        </div>

        {/* Items */}
        <div className="space-y-4 mb-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              {/* Picture */}
              <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-xs">No Image</span>
                )}
              </div>

              {/* Name & Quantity */}
              <div className="flex-1 px-6">
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>

              {/* Price */}
              <div className="text-right font-semibold text-gray-900">
                £{(item.unit_price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="bg-gray-50 rounded-lg p-6 flex flex-col sm:flex-row sm:justify-between items-center">
          <div className="mb-4 sm:mb-0">
            <p className="text-gray-600">Subtotal</p>
            <p className="font-medium text-gray-900">£{subtotal.toFixed(2)}</p>
          </div>
          <div className="mb-4 sm:mb-0">
            <p className="text-gray-600">VAT</p>
            <p className="font-medium text-gray-900">£{vat.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-600">Total</p>
            <p className="text-xl font-bold text-gray-900">£{total.toFixed(2)}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-gray-500">A confirmation email has been sent to your inbox.</p>
        </div>
      </div>
    </div>
  );
}
