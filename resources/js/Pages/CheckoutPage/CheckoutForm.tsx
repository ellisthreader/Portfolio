import React from "react";
import { useCart } from "@/Context/CartContext";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { router } from "@inertiajs/react";
import { useCheckout } from "@/Context/CheckoutContext";

import ContactInfo from "./CheckOutComponents/ContactInfo";
import DeliveryInfo from "./CheckOutComponents/DeliveryInfo";
import ShippingMethod from "./CheckOutComponents/ShippingMethod";
import OrderSummary from "./CheckOutComponents/OrderSummary";
import DiscountCode from "./CheckOutComponents/DiscountCode";
import PaymentSection from "./CheckOutComponents/PaymentSection";

const CheckoutForm = () => {
  const { cart } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const {
    email,
    phone,
    address,
    shippingMethod,
    shippingCost,
    appliedDiscount,
    setLoading,
    setError,
  } = useCheckout();

  // --- Totals ---
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = subtotal * appliedDiscount;
  const discountedSubtotal = subtotal - discountAmount;
  const vat = discountedSubtotal * 0.2;
  const total = discountedSubtotal + vat + shippingCost;

  // --- Stripe submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const { firstName, lastName, phone, country, addressLine1, addressLine2, city, postcode } = address;
    if (!email || !phone || !firstName || !lastName || !addressLine1 || !city || !postcode) {
      return alert("Please fill all required fields.");
    }
    if (!shippingMethod) return alert("Please select a shipping method.");
    if (cart.length === 0) return alert("Your cart is empty.");

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          amount: Math.round(total * 100),
          items: cart.map((i) => ({
            name: i.title,
            quantity: i.quantity,
            unit_price: Math.round(i.price * 100),
          })),
          discount: appliedDiscount,
          shipping: { method: shippingMethod, cost: shippingCost },
          delivery: { firstName, lastName, phone, country, line1: addressLine1, line2: addressLine2, city, postcode },
        }),
      });

      const data = await res.json();
      if (!data.client_secret) throw new Error(data.error || "No client_secret returned");

      const card = elements.getElement(CardElement)!;
      const result = await stripe.confirmCardPayment(data.client_secret, {
        payment_method: {
          card,
          billing_details: {
            email,
            phone,
            name: `${firstName} ${lastName}`,
            address: { country, line1: addressLine1, line2: addressLine2, city, postal_code: postcode },
          },
        },
      });

      if (result.error) setError(result.error.message || "Payment failed");
      else if (result.paymentIntent?.status === "succeeded") {
        router.visit("/order-confirmed", {
          data: {
            email,
            items: cart,
            subtotal,
            vat,
            shipping: shippingCost,
            total,
            appliedDiscount,
            delivery: { firstName, lastName, phone, country, line1: addressLine1, line2: addressLine2, city, postcode },
          },
        });
      }
    } catch (err: any) {
      setError(err.message || "Payment failed");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* LEFT */}
      <div className="space-y-6">
        <ContactInfo />
        <DeliveryInfo />
        <ShippingMethod />
      </div>

      {/* RIGHT */}
      <div className="space-y-6">
        <OrderSummary />
        <DiscountCode />
        <PaymentSection />
      </div>
    </form>
  );
};

export default CheckoutForm;
