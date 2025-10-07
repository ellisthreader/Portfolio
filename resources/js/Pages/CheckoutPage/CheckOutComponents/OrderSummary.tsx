// resources/js/Pages/CheckoutPage/CheckOutComponents/OrderSummary.tsx
import React, { useEffect } from "react";
import { useDarkMode } from "@/Context/DarkModeContext";
import { useCart } from "@/Context/CartContext";
import { useCheckout } from "@/Context/CheckoutContext";

export default function OrderSummary() {
  const { darkMode } = useDarkMode();
  const { cart } = useCart();
  const { appliedDiscount, shippingCost } = useCheckout();

  // --- Calculations ---
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = subtotal * appliedDiscount;
  const discountedSubtotal = subtotal - discountAmount;
  const vat = discountedSubtotal * 0.2;
  const total = discountedSubtotal + vat + shippingCost;

  // --- Debug Logging ---
  useEffect(() => {
    console.group("[OrderSummary] Data Update");
    console.log("Cart Items:", cart);
    console.log("Subtotal:", subtotal);
    console.log("Discount Amount:", discountAmount);
    console.log("VAT:", vat);
    console.log("Shipping Cost:", shippingCost);
    console.log("Total:", total);
    console.groupEnd();
  }, [cart, subtotal, discountAmount, vat, shippingCost, total]);

  return (
    <div
      className={`p-6 rounded-xl shadow transition-colors ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      {/* Cart Items */}
      <ul className="space-y-2 mb-4">
        {cart.map((item) => (
          <li key={item.id || item.title} className="flex justify-between">
            <span>
              {item.title} × {item.quantity}
            </span>
            <span>£{(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>

      {/* Subtotal */}
      <div className="flex justify-between mb-2">
        <span>Subtotal</span>
        <span>£{subtotal.toFixed(2)}</span>
      </div>

      {/* Discount */}
      <div className="flex justify-between mb-2">
        <span>Discount</span>
        <span className={discountAmount > 0 ? "text-green-500" : ""}>
          -£{discountAmount.toFixed(2)}
        </span>
      </div>

      {/* VAT */}
      <div className="flex justify-between mb-2">
        <span>VAT (20%)</span>
        <span>£{vat.toFixed(2)}</span>
      </div>

      {/* Shipping */}
      <div className="flex justify-between mb-2">
        <span>Shipping</span>
        <span>£{shippingCost.toFixed(2)}</span>
      </div>

      {/* Total */}
      <div className="flex justify-between font-bold text-lg mt-4 border-t pt-4">
        <span>Total</span>
        <span>£{total.toFixed(2)}</span>
      </div>
    </div>
  );
}
