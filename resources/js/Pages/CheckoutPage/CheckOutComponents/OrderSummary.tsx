// OrderSummary.tsx
import React, { useMemo, useEffect } from "react";
import { useCart } from "@/Context/CartContext";
import { useCheckout } from "@/Context/CheckoutContext";

const OrderSummary: React.FC = () => {
  const { cart } = useCart();
  const { shippingCost = 0, appliedDiscount } = useCheckout();

  // --- Ensure numeric values ---
  const normalizedShipping = Number(shippingCost) || 0;

  // --- Compute discount amount from appliedDiscount object ---
  let discountAmount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.type === "percent") {
      const subtotal = cart.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0
      );
      discountAmount = subtotal * (appliedDiscount.value / 100);
    } else if (appliedDiscount.type === "fixed") {
      discountAmount = appliedDiscount.value;
    }
  }

  // --- Compute subtotal, VAT, total ---
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  }, [cart]);

  const discountedSubtotal = Math.max(subtotal - discountAmount, 0);
  const vat = discountedSubtotal * 0.2;
  const total = discountedSubtotal + vat + normalizedShipping;

  // --- Debug logs ---
  useEffect(() => {
    console.group("[OrderSummary]");
    console.log("Cart Items:", cart);
    console.log("Subtotal:", subtotal);
    console.log("Applied Discount:", appliedDiscount);
    console.log("Discount Amount:", discountAmount);
    console.log("Discounted Subtotal:", discountedSubtotal);
    console.log("VAT:", vat);
    console.log("Shipping Cost:", normalizedShipping);
    console.log("Total:", total);
    console.groupEnd();
  }, [cart, subtotal, appliedDiscount, discountAmount, discountedSubtotal, vat, normalizedShipping, total]);

  return (
    <aside className="p-4 border rounded bg-white dark:bg-gray-800">
      <h3 className="font-semibold mb-3">Payment Summary</h3>

      <div className="flex justify-between mb-1">
        <span>Subtotal:</span>
        <span>£{subtotal.toFixed(2)}</span>
      </div>

      {discountAmount > 0 && (
        <div className="flex justify-between mb-1 text-green-600">
          <span>Discount:</span>
          <span>-£{discountAmount.toFixed(2)}</span>
        </div>
      )}

      <div className="flex justify-between mb-1">
        <span>VAT (20%):</span>
        <span>£{vat.toFixed(2)}</span>
      </div>

      <div className="flex justify-between mb-2">
        <span>Shipping:</span>
        <span>£{normalizedShipping.toFixed(2)}</span>
      </div>

      <hr className="my-2" />

      <div className="flex justify-between font-bold text-lg">
        <span>Total:</span>
        <span>£{total.toFixed(2)}</span>
      </div>
    </aside>
  );
};

export default OrderSummary;
