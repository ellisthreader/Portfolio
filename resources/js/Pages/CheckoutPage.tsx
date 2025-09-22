import React, { useState } from "react";
import { useCart } from "@/Context/CartContext";
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Stripe publishable key from .env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY as string);

const CheckoutForm = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("GB"); // default to United Kingdom
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal * 1.2; // 20% VAT

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (!email) return alert("Please enter your email.");
    if (cart.length === 0) return alert("Your cart is empty.");

    setLoading(true);
    setError(null);

    try {
      // 1️⃣ Call backend to create PaymentIntent
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          amount: Math.round(total * 100), // Stripe expects pence
          items: cart.map(i => ({
            name: i.title,
            quantity: i.quantity,
            unit_price: Math.round(i.price * 100)
          }))
        })
      });

      const data = await res.json();

      if (!data.client_secret) throw new Error(data.error || "No client_secret returned");

      // 2️⃣ Confirm card payment
      const card = elements.getElement(CardElement)!;
      const result = await stripe.confirmCardPayment(data.client_secret, {
        payment_method: {
          card,
          billing_details: {
            email,
            phone,
            address: { country }
          }
        }
      });

      if (result.error) setError(result.error.message || "Payment failed");
      else if (result.paymentIntent?.status === "succeeded") setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Payment failed");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow">
      {/* Cart Summary */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Order</h2>
        {cart.length === 0 ? (
          <p>Cart is empty</p>
        ) : (
          cart.map(item => (
            <div key={item.id} className="flex justify-between mb-2">
              <span>{item.quantity}x {item.title}</span>
              <span>£{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))
        )}
        <div className="flex justify-between font-bold mt-2">
          <span>Total:</span>
          <span>£{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Contact Info */}
      <div className="mb-6 space-y-2">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <select
          value={country}
          onChange={e => setCountry(e.target.value)}
          className="w-full p-2 border rounded"
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
      <div className="mb-4 p-4 border rounded">
        <CardElement options={{ hidePostalCode: true }} />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded hover:opacity-90 transition"
      >
        {loading ? "Processing..." : `Pay £${total.toFixed(2)}`}
      </button>

      {/* Messages */}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">Payment Successful!</p>}
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
