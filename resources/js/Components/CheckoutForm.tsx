import React, { useState } from "react";
import { useCart } from "@/Context/CartContext";
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY as string);

const CheckoutForm = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal * 1.2; // + VAT 20%

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    if (!email) {
      alert("Enter your email.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call your backend to create a PaymentIntent
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          amount: Math.round(total * 100), // in pence
          items: cart.map(i => ({
            name: i.title,
            quantity: i.quantity,
            unit_price: Math.round(i.price * 100),
          })),
        }),
      });

      const data = await res.json();
      const clientSecret = data.client_secret;
      if (!clientSecret) throw new Error("No client secret returned");

      // Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: { email },
        },
      });

      if (result.error) {
        setError(result.error.message || "Payment failed");
      } else if (result.paymentIntent?.status === "succeeded") {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || "Payment failed");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Payment & Contact</h2>
      <input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
      />
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
      {success && <p className="mt-2 text-green-500">Payment Successful!</p>}
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
