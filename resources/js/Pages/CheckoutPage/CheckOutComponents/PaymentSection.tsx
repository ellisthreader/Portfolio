import React, { useEffect } from "react";
import { CardElement } from "@stripe/react-stripe-js";
import { Link } from "@inertiajs/react";
import { useDarkMode } from "@/Context/DarkModeContext";
import { useCheckout } from "@/Context/CheckoutContext";

export default function PaymentSection() {
  const { darkMode } = useDarkMode();
  const { cart, shippingCost, appliedDiscount, discount, address } = useCheckout();

  // --- Totals ---
  const subtotal = cart?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
  const discountAmount = subtotal * appliedDiscount;
  const discountedSubtotal = subtotal - discountAmount;
  const vat = discountedSubtotal * 0.2;
  const total = discountedSubtotal + vat + shippingCost;

  useEffect(() => {
    console.group("[PaymentSection]");
    console.log("Subtotal:", subtotal);
    console.log("Discount Amount:", discountAmount);
    console.log("VAT:", vat);
    console.log("Shipping Cost:", shippingCost);
    console.log("Total:", total);
    console.groupEnd();
  }, [subtotal, discountAmount, vat, shippingCost, total]);

  const cardStyle = {
    style: {
      base: {
        color: darkMode ? "#FFFFFF" : "#000000",
        iconColor: darkMode ? "#BBBBBB" : "#666666",
        fontSize: "16px",
        fontFamily: "system-ui, sans-serif",
        "::placeholder": { color: darkMode ? "#888888" : "#999999" },
      },
      invalid: {
        color: "#f87171",
      },
    },
  };

  return (
    <div
      className={`p-6 rounded-xl shadow transition-colors ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h2 className="text-xl font-semibold mb-4">Payment</h2>

      <div
        className={`p-3 border rounded-lg ${
          darkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-gray-50"
        }`}
      >
        <CardElement options={cardStyle} />
      </div>

      <button
        type="submit"
        className={`mt-4 w-full py-3 rounded-lg font-medium transition-colors bg-green-500 hover:bg-green-600 text-white`}
      >
        Pay £{total.toFixed(2)}
      </button>

      <div className="text-center mt-6">
        <Link
          href="/courses"
          className={`font-medium transition-colors duration-200 ${
            darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
          }`}
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
