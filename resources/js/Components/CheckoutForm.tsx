import React, { useState } from "react";
import { useCart } from "@/Context/CartContext";
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderConfirmed from "./OrderConfirmed";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY as string);

const CheckoutForm = () => {
  const { cart, clearCart } = useCart();
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  // Calculate totals
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const vat = subtotal * 0.2;
  const total = subtotal + vat;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!email) {
      alert("Enter your email.");
      return;
    }
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // ✅ Send properly formatted items to backend
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          items: cart.map(i => ({
            id: i.id,
            title: i.title,         // must be 'title'
            price: Number(i.price), // must be 'price' in pounds
            quantity: Number(i.quantity),
            image: i.image || "/images/tiktok.jpeg",
          })),
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Confirm Stripe payment
      const result = await stripe.confirmCardPayment(data.client_secret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: { email },
        },
      });

      if (result.error) {
        setError(result.error.message || "Payment failed");
      } else if (result.paymentIntent?.status === "succeeded") {
        setSuccess(true);
        setOrderData({ email, ...data });
        clearCart();
      }
    } catch (err: any) {
      setError(err.message || "Payment failed");
    }

    setLoading(false);
  };

  if (success && orderData) {
    return <OrderConfirmed {...orderData} />;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Payment & Contact</h2>

      {/* Email */}
      <input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
      />

      {/* Cart Summary */}
      <div className="mb-4 p-4 border rounded dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
        <h3 className="font-semibold mb-2">Your Order</h3>
        {cart.map(item => (
          <div key={item.id} className="flex justify-between mb-1">
            <span>{item.quantity}x {item.title}</span>
            <span>£{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <hr className="my-2 border-gray-300 dark:border-gray-600" />
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>£{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>VAT (20%):</span>
          <span>£{vat.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold mt-2">
          <span>Total:</span>
          <span>£{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Card Element */}
      <div className="mb-4 p-4 border rounded dark:border-gray-600">
        <CardElement options={{ hidePostalCode: true }} />
      </div>

      {/* Submit */}
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

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
