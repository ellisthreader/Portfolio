import React, { useState, useEffect, useRef } from "react";
import { useCart } from "@/Context/CartContext";
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { router } from "@inertiajs/react";
import { useDarkMode } from "@/Context/DarkModeContext";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

// ✅ Stripe key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY as string);

// ✅ Google Maps libraries array (outside component to avoid reload warning)
const libraries: ("places")[] = ["places"];

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
  const [availableServices, setAvailableServices] = useState<{ code: string; name: string; cost: number }[]>([]);
  const [shippingMethod, setShippingMethod] = useState("");
  const [shippingCost, setShippingCost] = useState<number>(0);

  // Discount
  const [discount, setDiscount] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);

  // Misc
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Google Maps Autocomplete
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string, // ✅ must match .env
    libraries,
  });

  // Debug logs
  console.log("Google API Key (from env):", import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
  console.log("Google Maps script loaded:", isLoaded);

  const onLoadAutocomplete = (autoC: google.maps.places.Autocomplete) => {
    console.log("Autocomplete loaded:", autoC);
    setAutocomplete(autoC);
  };

  const onPlaceChanged = () => {
    if (!autocomplete) return;
    const place = autocomplete.getPlace();
    console.log("Place selected:", place);

    if (!place.address_components) return;

    const getComponent = (type: string) => {
      const comp = place.address_components?.find(c => c.types.includes(type));
      return comp?.long_name || "";
    };

    setAddressLine1(getComponent("street_number") + " " + getComponent("route"));
    setCity(getComponent("locality") || getComponent("postal_town"));
    setPostcode(getComponent("postal_code"));
    setCountry(getComponent("country"));
  };

  // Totals
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = subtotal * appliedDiscount;
  const discountedSubtotal = subtotal - discountAmount;
  const vat = discountedSubtotal * 0.2;
  const total = discountedSubtotal + vat + shippingCost;

  // Fetch available shipping services
  useEffect(() => {
    const fetchServices = async () => {
      if (!country || !postcode) {
        setAvailableServices([]);
        setShippingMethod("");
        return;
      }
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/shipping-cost`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            country,
            postcode,
            items: cart.map(i => ({ id: i.id, quantity: i.quantity })),
          }),
        });
        const data = await res.json();
        console.log("Shipping services response:", data);
        setAvailableServices(data.services ?? []);
        setShippingMethod("");
        setShippingCost(0);
      } catch (err) {
        console.error("Error fetching services:", err);
        setAvailableServices([]);
      }
    };
    fetchServices();
  }, [country, postcode, cart]);

  // Fetch shipping cost
  useEffect(() => {
    const fetchCost = async () => {
      if (!shippingMethod) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/shipping-cost`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            country,
            postcode,
            items: cart.map(i => ({ id: i.id, quantity: i.quantity })),
            service: shippingMethod,
          }),
        });
        const data = await res.json();
        console.log("Shipping cost response:", data);
        setShippingCost(data.cost ?? 0);
      } catch (err) {
        console.error("Error fetching cost:", err);
        setShippingCost(0);
      }
    };
    fetchCost();
  }, [shippingMethod, country, postcode, cart]);

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
    if (!firstName || !lastName || !addressLine1 || !city || !postcode) return alert("Please complete all required delivery information.");
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
      console.log("Payment intent response:", data);
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

      console.log("Stripe payment result:", result);

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
      console.error("Payment error:", err);
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

  const inputClasses =
    "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition-colors " +
    (darkMode ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500");

  return (
    <form onSubmit={handleSubmit} className={`grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto p-6 transition-colors duration-300 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
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
          <input type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} className={inputClasses + " mb-3"} required />
          <input type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} className={inputClasses + " mb-3"} required />

          {/* Address Line 1 with Autocomplete */}
          {isLoaded ? (
            <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
              <input type="text" placeholder="Address Line 1" value={addressLine1} onChange={e => setAddressLine1(e.target.value)} ref={inputRef} className={inputClasses + " mb-3"} required />
            </Autocomplete>
          ) : (
            <input type="text" placeholder="Address Line 1" value={addressLine1} onChange={e => setAddressLine1(e.target.value)} className={inputClasses + " mb-3"} required />
          )}

          <input type="text" placeholder="Address Line 2" value={addressLine2} onChange={e => setAddressLine2(e.target.value)} className={inputClasses + " mb-3"} />
          <input type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} className={inputClasses + " mb-3"} required />
          <input type="text" placeholder="Postcode" value={postcode} onChange={e => setPostcode(e.target.value)} className={inputClasses + " mb-3"} required />
          <select value={country} onChange={e => setCountry(e.target.value)} className={inputClasses + " mb-3"}>
            <option value="GB">United Kingdom</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
          </select>
        </div>

        {/* Shipping Options */}
        {availableServices.length > 0 && (
          <div className={`p-6 rounded-xl shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>
            <select value={shippingMethod} onChange={e => setShippingMethod(e.target.value)} className={inputClasses} required>
              <option value="">Select shipping method</option>
              {availableServices.map(s => (
                <option key={s.code} value={s.code}>{s.name} (£{s.cost.toFixed(2)})</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="space-y-6">
        {/* Cart Summary */}
        <div className={`p-6 rounded-xl shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <ul className="space-y-2 mb-4">
            {cart.map(item => (
              <li key={item.id} className="flex justify-between">
                <span>{item.title} x {item.quantity}</span>
                <span>£{(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between mb-2"><span>Subtotal</span><span>£{subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between mb-2"><span>Discount</span><span>£{discountAmount.toFixed(2)}</span></div>
          <div className="flex justify-between mb-2"><span>VAT (20%)</span><span>£{vat.toFixed(2)}</span></div>
          <div className="flex justify-between mb-2"><span>Shipping</span><span>£{shippingCost.toFixed(2)}</span></div>
          <div className="flex justify-between font-bold text-lg mt-4"><span>Total</span><span>£{total.toFixed(2)}</span></div>
        </div>

        {/* Discount Code */}
        <div className={`p-6 rounded-xl shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-xl font-semibold mb-4">Discount Code</h2>
          <div className="flex gap-3">
            <input type="text" placeholder="Enter code" value={discount} onChange={e => setDiscount(e.target.value)} className="flex-1 p-3 border rounded-lg" />
            <button type="button" onClick={handleApplyDiscount} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Apply</button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {/* Payment */}
        <div className={`p-6 rounded-xl shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-xl font-semibold mb-4">Payment</h2>
          <CardElement options={cardOptions} />
          <button type="submit" disabled={loading} className="mt-4 w-full py-3 bg-green-500 text-white rounded-lg">
            {loading ? "Processing..." : `Pay £${total.toFixed(2)}`}
          </button>
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
