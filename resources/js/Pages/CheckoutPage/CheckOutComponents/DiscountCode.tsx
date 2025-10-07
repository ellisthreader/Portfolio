// resources/js/Pages/CheckoutPage/CheckOutComponents/DiscountCode.tsx
import React, { useEffect, useState } from "react";
import { useDarkMode } from "@/Context/DarkModeContext";

export default function DiscountCode() {
  const { darkMode } = useDarkMode();

  // Local state for discount input and errors
  const [discount, setDiscount] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Available discount codes
  const discountCodes: Record<string, number> = {
    DISCOUNT10: 0.1,
    DISCOUNT20: 0.2,
  };

  // Log discount changes for debugging
  useEffect(() => {
    console.log("[DiscountCode] Current discount input:", discount);
  }, [discount]);

  // Log errors if any occur
  useEffect(() => {
    if (error) console.error("[DiscountCode] Error:", error);
  }, [error]);

  // Handle applying discount
  const handleApply = () => {
    const code = discount.trim().toUpperCase();
    console.log("[DiscountCode] Applying code:", code);

    if (discountCodes[code]) {
      console.log("[DiscountCode] ✅ Discount applied:", discountCodes[code]);
      setError(null);
      alert(`Discount applied: ${discountCodes[code] * 100}% off`);
    } else {
      console.warn("[DiscountCode] ❌ Invalid discount code");
      setError("Invalid discount code");
    }
  };

  return (
    <div
      className={`p-6 rounded-xl shadow transition-colors ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h2 className="text-xl font-semibold mb-4">Discount Code</h2>

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Enter code"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          className={`flex-1 p-3 border rounded-lg outline-none transition-colors ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-gray-500"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-400"
          }`}
        />
        <button
          type="button"
          onClick={handleApply}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          Apply
        </button>
      </div>

      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
}
