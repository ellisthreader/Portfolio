// PaymentSection.tsx
import React, { useEffect, useRef } from "react";
import { CardElement } from "@stripe/react-stripe-js";
import { useDarkMode } from "@/Context/DarkModeContext";
import { useCheckout } from "@/Context/CheckoutContext";
import { toast } from "react-toastify";

export default function PaymentSection() {
  const { darkMode } = useDarkMode();
  const {
    discountCode,
    setDiscountCode,
    validateDiscount,
    appliedDiscount,
    discountError,
    loading,
  } = useCheckout();

  // Prevent duplicate toast firing
  const lastDiscountCode = useRef<string | null>(null);

  // Apply discount
  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      toast.error("Please enter a discount code.", {
        position: "top-center",
        autoClose: 3000,
        theme: darkMode ? "dark" : "light",
      });
      return;
    }

    await validateDiscount(discountCode);
  };

  // Toast feedback
  useEffect(() => {
    // Avoid repeat notifications for the same code
    if (appliedDiscount && lastDiscountCode.current !== appliedDiscount.code) {
      toast.success(
        `Discount code '${appliedDiscount.code}' applied successfully!`,
        {
          position: "top-center",
          autoClose: 3000,
          theme: darkMode ? "dark" : "light",
        }
      );
      lastDiscountCode.current = appliedDiscount.code;
    }

    if (discountError && discountCode !== lastDiscountCode.current) {
      toast.error(discountError, {
        position: "top-center",
        autoClose: 3000,
        theme: darkMode ? "dark" : "light",
      });
      lastDiscountCode.current = discountCode;
    }
  }, [discountError, appliedDiscount, discountCode, darkMode]);

  // Stripe card style
  const cardStyle = {
    style: {
      base: {
        color: darkMode ? "#FFFFFF" : "#000000",
        iconColor: darkMode ? "#BBBBBB" : "#666666",
        fontSize: "16px",
        fontFamily: "system-ui, sans-serif",
        "::placeholder": { color: darkMode ? "#888888" : "#999999" },
      },
      invalid: { color: "#f87171" },
    },
  };

  return (
    <div
      className={`p-6 rounded-xl shadow transition-colors ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h2 className="text-xl font-semibold mb-4">Payment</h2>

      {/* Discount Input */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Discount Code</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            placeholder="Enter your code"
            className={`w-full px-3 py-2 rounded-lg border outline-none transition-colors ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                : "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-600"
            }`}
          />
          <button
            type="button"
            disabled={loading}
            onClick={handleApplyDiscount}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Applying..." : "Apply"}
          </button>
        </div>
      </div>

      {/* Stripe Card Input */}
      <div
        className={`p-3 border rounded-lg ${
          darkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-gray-50"
        }`}
      >
        <CardElement options={cardStyle} />
      </div>
    </div>
  );
}
