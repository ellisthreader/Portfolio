// resources/js/Pages/CheckoutPage.tsx
import React, { useState } from "react";
import { useCart } from "@/Context/CartContext";
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { router } from "@inertiajs/react";

// Stripe publishable key from .env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY as string);

const CheckoutForm = () => {
  const { cart } = useCart();
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("GB");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Totals calculation
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const vat = subtotal * 0.2; // 20% VAT
  const total = subtotal + vat;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (!email) return alert("Please enter your email.");
    if (cart.length === 0) return alert("Your cart is empty.");

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          amount: Math.round(total * 100), // Stripe expects pence
          items: cart.map(i => ({
            name: i.title,
            quantity: i.quantity,
            unit_price: Math.round(i.price * 100),
          })),
        }),
      });

      const data = await res.json();
      if (!data.client_secret) throw new Error(data.error || "No client_secret returned");

      const card = elements.getElement(CardElement)!;
      const result = await stripe.confirmCardPayment(data.client_secret, {
        payment_method: {
          card,
          billing_details: { email, phone, address: { country } },
        },
      });

      if (result.error) {
        setError(result.error.message || "Payment failed");
      } else if (result.paymentIntent?.status === "succeeded") {
        // ✅ Redirect to confirmation page with Inertia
        router.visit("/order-confirmed", {
          data: {
            email,
            items: cart,
            subtotal,
            vat,
            total,
          },
        });
      }
    } catch (err: any) {
      setError(err.message || "Payment failed");
    }

    setLoading(false);
  };

  return (
    <form
      className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg"
      onSubmit={handleSubmit}
    >
      {/* Cart Summary */}
      <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Your Order</h2>
        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty</p>
        ) : (
          cart.map(item => (
            <div key={item.id} className="flex justify-between py-2 border-b last:border-b-0">
              <span className="font-medium">
                {item.quantity}× {item.title}
              </span>
              <span className="font-medium">£{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))
        )}
        {/* Totals */}
        <div className="mt-4 space-y-1">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal:</span>
            <span>£{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>VAT (20%):</span>
            <span>£{vat.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-2 border-t pt-2">
            <span>Total:</span>
            <span>£{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="mb-6 space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          required
        />
        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <select
          value={country}
          onChange={e => setCountry(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="GB">United Kingdom</option>
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="AU">Australia</option>
          <option value="DE">Germany</option>
          <option value="FR">France</option>
          <option value="IN">India</option>
          <option value="JP">Japan</option>
          <option value="CN">China</option>
          <option value="BR">Brazil</option>
        </select>
      </div>

      {/* Stripe Card Input */}
      <div className="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
        <CardElement options={{ hidePostalCode: true }} />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
      >
        {loading ? "Processing..." : `Pay £${total.toFixed(2)}`}
      </button>

      {/* Messages */}
      {error && <p className="text-red-500 mt-3">{error}</p>}
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
