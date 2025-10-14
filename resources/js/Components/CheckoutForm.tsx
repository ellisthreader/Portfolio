import React, { useState } from "react";
import { useCart } from "@/Context/CartContext";
import { useCheckout } from "@/Context/CheckoutContext";
import {
  CardElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderConfirmed from "@/Pages/OrderConfirmed";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY as string);

const CheckoutForm: React.FC = () => {
  const { cart, clearCart } = useCart();
  const {
    email,
    address,
    shippingMethod,
    shippingCost,
    discount,
  } = useCheckout();

  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const vat = subtotal * 0.2;
  const total = subtotal + vat + (shippingCost || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formattedItems = cart.map((i) => ({
        name: i.title,
        quantity: Number(i.quantity),
        unit_price: Math.round(i.price * 100),
        image: i.image || "/images/default.jpg",
      }));

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/create-payment-intent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            items: formattedItems,
            discount,
            shipping: {
              method: shippingMethod || "standard",
              cost: Math.round((shippingCost || 0) * 100),
            },
            delivery: {
              firstName: address.firstName,
              lastName: address.lastName,
              phone: address.phone,
              country: address.country,
              line1: address.addressLine1,
              line2: address.addressLine2,
              city: address.city,
              postcode: address.postcode,
            },
          }),
        }
      );

      const data = await res.json();
      console.log("💳 Backend response:", data);

      if (data.error) throw new Error(data.error);

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card details not found.");

      // ✅ Confirm the payment
      const result = await stripe.confirmCardPayment(data.client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email,
            name: `${address.firstName} ${address.lastName}`,
          },
        },
      });

      console.log("[Stripe result]", result);

      if (result.error) {
        setError(result.error.message || "Payment failed");
      } else if (result.paymentIntent?.status === "succeeded") {
        setSuccess(true);
        setOrderData({ email, ...data });
        clearCart();
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (success && orderData) return <OrderConfirmed {...orderData} />;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow"
    >
      <h2 className="text-xl font-semibold mb-4">Payment</h2>

      <div className="mb-4 p-4 border rounded dark:border-gray-600">
        <CardElement options={{ hidePostalCode: true }} />
      </div>

      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded hover:opacity-90 transition"
      >
        {loading ? "Processing..." : `Pay £${total.toFixed(2)}`}
      </button>

      {error && <p className="mt-2 text-red-500">{error}</p>}
    </form>
  );
};

export const CheckoutPage: React.FC = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default CheckoutPage;
