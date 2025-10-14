import React, { useEffect, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { useDarkMode } from "@/Context/DarkModeContext";

interface Item {
  name: string;
  quantity: number;
  unit_price: number;
  image?: string;
}

export default function OrderConfirmed() {
  const { props } = usePage();
  const { darkMode } = useDarkMode();

  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    // Generate a random order number
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    setOrderNumber(`#ORD-${randomNum}`);
  }, []);

  // --- Totals (with fallback) ---
  const subtotal = Number(props.subtotal ?? 0);
  const vat = Number(props.vat ?? 0);
  const total = Number(props.total ?? 0);
  const discount = Number(props.discount ?? 0);
  const shipping = Number(props.shipping ?? 0);

  // --- Items list (fallback safe) ---
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
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-5xl mx-auto py-14 px-6">
        {/* ✅ Header with Continue Shopping */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-semibold mb-2">Order Confirmed</h1>
          <Link
            href="/courses"
            className={`font-medium text-base transition-colors duration-200 ${
              darkMode
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-700"
            }`}
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* ✅ Order Confirmation Card */}
        <div
          className={`rounded-2xl shadow-lg p-10 mb-10 transition-colors ${
            darkMode ? "bg-gray-900" : "bg-white"
          }`}
        >
          <div className="text-center mb-10">
            <div
              className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${
                darkMode ? "bg-green-900/30" : "bg-green-100"
              }`}
            >
              <svg
                className={`w-10 h-10 ${
                  darkMode ? "text-green-400" : "text-green-600"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-1">Thank you for your purchase</h2>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Order Number: <span className="font-medium">{orderNumber}</span>
            </p>
          </div>

          {/* ✅ Items List */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700 mb-10">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-4"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-16 h-16 rounded-lg overflow-hidden flex items-center justify-center ${
                      darkMode ? "bg-gray-800" : "bg-gray-100"
                    }`}
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span
                        className={`text-xs ${
                          darkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        No Image
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-base">{item.name}</p>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-medium">
                  £{(item.unit_price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* ✅ Payment Summary */}
          <div
            className={`rounded-xl p-6 ${
              darkMode ? "bg-gray-800" : "bg-gray-50"
            }`}
          >
            <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Discount:</span>
                <span>-£{discount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>VAT (20%):</span>
                <span>£{vat.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>£{shipping.toFixed(2)}</span>
              </div>

              <div
                className={`flex justify-between pt-3 mt-2 border-t ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <span className="font-semibold text-base">Total:</span>
                <span className="font-bold text-base">
                  £{total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Footer */}
        <div className="text-center">
          <p
            className={`text-sm ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            A confirmation email has been sent to your inbox.
          </p>
        </div>
      </div>
    </div>
  );
}
