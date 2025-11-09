import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { useDarkMode } from "@/Context/DarkModeContext";
import { FileText } from "lucide-react";

export default function OrderConfirmed() {
  const { darkMode } = useDarkMode();
  const { props } = usePage();
  const order = props.order;

  if (!order) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center ${
          darkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"
        }`}
      >
        <h1 className="text-2xl font-semibold mb-3">Order not found</h1>
        <Link
          href="/"
          className={`font-medium text-base transition-colors duration-200 ${
            darkMode
              ? "text-blue-400 hover:text-blue-300"
              : "text-blue-600 hover:text-blue-700"
          }`}
        >
          ← Back to Home
        </Link>
      </div>
    );
  }

  const firstName =
    order.first_name &&
    order.first_name.charAt(0).toUpperCase() +
      order.first_name.slice(1).toLowerCase();

  let discountLabel = "Discount";
  if (order.discount_type === "percent" && order.discount_value) {
    discountLabel = `Discount (${order.discount_value}% OFF)`;
  } else if (
    order.discount_code &&
    /\d+/.test(order.discount_code) &&
    order.discount_code.toUpperCase().includes("OFF")
  ) {
    const percent = order.discount_code.match(/\d+/)?.[0];
    if (percent) discountLabel = `Discount (${percent}% OFF)`;
  }

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-5xl mx-auto py-16 px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <h1 className="text-4xl font-bold mb-4 md:mb-0">Order Confirmed</h1>
          <Link
            href="/courses"
            className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 border ${
              darkMode
                ? "border-blue-500 text-blue-400 hover:bg-blue-800/30"
                : "border-blue-600 text-blue-600 hover:bg-blue-100"
            }`}
          >
            Continue Shopping →
          </Link>
        </div>

        {/* Order Card */}
        <div
          className={`rounded-3xl shadow-xl p-10 mb-12 transition-colors ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* Success Icon */}
          <div className="flex flex-col items-center mb-8">
            <div
              className={`w-24 h-24 flex items-center justify-center rounded-full mb-4 ${
                darkMode ? "bg-green-700/30" : "bg-green-100"
              }`}
            >
              <svg
                className={`w-12 h-12 ${
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

            <h2 className="text-2xl font-semibold mb-1 text-center">
              {firstName
                ? `Thank you ${firstName}, for your purchase!`
                : "Thank you for your purchase!"}
            </h2>

            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Order Number: <span className="font-medium">{order.order_number}</span>
            </p>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Email: <span className="font-medium">{order.email}</span>
            </p>
          </div>

          {/* Items */}
          <div className="divide-y divide-gray-300 dark:divide-gray-700 mb-8">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex justify-between py-4">
                <div>
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">£{Number(item.line_total).toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-gray-300 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm md:text-base">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>£{Number(order.subtotal).toFixed(2)}</span>
              </div>

              {Number(order.discount_amount) > 0 && (
                <div
                  className={`flex justify-between font-medium ${
                    darkMode ? "text-green-400" : "text-green-600"
                  }`}
                >
                  <span>{discountLabel}:</span>
                  <span>-£{Number(order.discount_amount).toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>VAT (20%):</span>
                <span>£{Number(order.vat).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>£{Number(order.shipping).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-3 border-t pt-3">
                <span>Total:</span>
                <span>£{Number(order.total).toFixed(2)}</span>
              </div>
            </div>

            {/* 🧾 Polished Invoice + Orders Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              {order.invoice_url && (
                <a
                  href={order.invoice_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 ${
                    darkMode
                      ? "bg-indigo-600 text-white hover:bg-indigo-500"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  View Invoice (PDF)
                </a>
              )}

              {/* ✅ Go to Orders — links to profile/edit with a query param */}
              <Link
                href="/profile/edit?tab=orders"
                className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 ${
                  darkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                }`}
              >
                Go to Orders →
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm md:text-base text-gray-500 dark:text-gray-400">
          A confirmation email has been sent to{" "}
          <span className="font-medium">{order.email}</span>.
        </div>
      </div>
    </div>
  );
}
