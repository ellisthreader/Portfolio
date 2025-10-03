// resources/js/Pages/CheckoutPage.tsx
import React, { useState, useEffect } from "react";
import { useCart } from "@/Context/CartContext";
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { router } from "@inertiajs/react";
import { useDarkMode } from "@/Context/DarkModeContext";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY as string);

const discountCodes: Record<string, number> = {
  DISCOUNT10: 0.1,
  DISCOUNT20: 0.2,
};

const CheckoutForm = () => {
  const { cart } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const { darkMode } = useDarkMode();

  // Contact info
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Delivery info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("GB");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");

  // Shipping
  const [shippingMethod, setShippingMethod] = useState<"RM_1ST" | "RM_2ND" | "">("");
  const [shippingCost, setShippingCost] = useState<number>(0);

  const [discount, setDiscount] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Totals
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = subtotal * appliedDiscount;
  const discountedSubtotal = subtotal - discountAmount;
  const vat = discountedSubtotal * 0.2;
  const total = discountedSubtotal + vat + shippingCost;

  // Fetch shipping cost
  useEffect(() => {
    const fetchShipping = async () => {
      if (!shippingMethod || !postcode || !country) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/shipping-cost`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ method: shippingMethod, country, postcode }),
        });
        const data = await res.json();
        if (data.cost) setShippingCost(data.cost);
        else setShippingCost(0);
      } catch {
        setShippingCost(0);
      }
    };
    fetchShipping();
  }, [shippingMethod, postcode, country]);

  const handleApplyDiscount = () => {
    const code = discount.trim().toUpperCase();
    if (discountCodes[code]) {
      setAppliedDiscount(discountCodes[code]);
      setError(null);
    } else {
      setAppliedDiscount(0);
      setError("Invalid discount code");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!email || !phone) return alert("Please enter your contact information.");
    if (!firstName || !lastName || !addressLine1 || !city || !postcode) {
      return alert("Please complete all required delivery information.");
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
          items: cart.map(i => ({
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

  const cardOptions = {
    hidePostalCode: true,
    style: {
      base: {
        color: darkMode ? "#f9fafb" : "#111827",
        fontSize: "16px",
        "::placeholder": { color: darkMode ? "#9ca3af" : "#6b7280" },
      },
      invalid: { color: "#f87171" },
    },
  };

  // common input classes for light + dark
  const inputClasses =
    "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-colors " +
    (darkMode ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500");

  return (
    <form
      onSubmit={handleSubmit}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto p-6 transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* LEFT SIDE */}
      <div className="space-y-6">
        {/* Contact Info */}
        <div className={`p-6 rounded-xl shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className={inputClasses + " mb-3"} required />
          <input type="tel" placeholder="Phone number" value={phone} onChange={e => setPhone(e.target.value)} className={inputClasses} required />
        </div>

        {/* Delivery Info */}
        <div className={`p-6 rounded-xl shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} className={inputClasses} required />
            <input type="text" placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} className={inputClasses} required />
          </div>
          <select value={country} onChange={e => setCountry(e.target.value)} className={inputClasses + " mt-3"} required>
            <option value="GB">United Kingdom</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
          </select>
          <input type="text" placeholder="Address line 1" value={addressLine1} onChange={e => setAddressLine1(e.target.value)} className={inputClasses + " mt-3"} required />
          <input type="text" placeholder="Address line 2 (optional)" value={addressLine2} onChange={e => setAddressLine2(e.target.value)} className={inputClasses + " mt-3"} />
          <input type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} className={inputClasses + " mt-3"} required />
          <input type="text" placeholder="Postcode" value={postcode} onChange={e => setPostcode(e.target.value)} className={inputClasses + " mt-3"} required />
        </div>

        {/* Shipping */}
        <div className={`p-6 rounded-xl shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>
          <select value={shippingMethod} onChange={e => setShippingMethod(e.target.value as "RM_1ST" | "RM_2ND")} className={inputClasses} required>
            <option value="">Select shipping method</option>
            <option value="RM_1ST">Royal Mail 1st Class</option>
            <option value="RM_2ND">Royal Mail 2nd Class</option>
          </select>
          {shippingCost > 0 && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Shipping cost: £{shippingCost.toFixed(2)}</p>
          )}
        </div>

        {/* Payment */}
        <div className={`p-6 rounded-xl shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-xl font-semibold mb-4">Payment</h2>
          <div className={`p-4 border rounded-lg ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"}`}>
            <CardElement options={cardOptions} />
          </div>
        </div>

        <button type="submit" disabled={!stripe || loading} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
          {loading ? "Processing..." : `Pay £${total.toFixed(2)}`}
        </button>

        {error && <p className="text-red-500 mt-3">{error}</p>}
      </div>

      {/* RIGHT SIDE - Order Summary */}
      <div className={`p-6 rounded-xl shadow space-y-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <h2 className="text-xl font-semibold border-b pb-2">Your Order</h2>
        <div className="space-y-2">
          {cart.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.quantity}× {item.title}</span>
                <span>£{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))
          )}
        </div>

        {/* Discount */}
        <div className="flex space-x-2">
          <input type="text" placeholder="Discount code or gift card" value={discount} onChange={e => setDiscount(e.target.value)} className={inputClasses} />
          <button type="button" onClick={handleApplyDiscount} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Apply</button>
        </div>

        {/* Totals */}
        <div className="space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>£{subtotal.toFixed(2)}</span></div>
          {appliedDiscount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({(appliedDiscount * 100).toFixed(0)}%)</span>
              <span>-£{discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between"><span>VAT (20%)</span><span>£{vat.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>£{shippingCost.toFixed(2)}</span></div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total</span>
            <span>£{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
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
