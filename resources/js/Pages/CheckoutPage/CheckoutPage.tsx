import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useDarkMode } from "@/Context/DarkModeContext";
import { CheckoutProvider } from "@/Context/CheckoutContext";

// ✅ Stripe public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY as string);

export default function CheckoutPage() {
  const { darkMode } = useDarkMode();

  return (
    <>
      <Head title="Checkout" />

      <div
        className={`min-h-screen transition-colors duration-300 ${
          darkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="max-w-7xl mx-auto py-10 px-6">
          {/* ✅ Header */}
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-semibold">Checkout</h1>
            <Link
              href="/courses"
              className={`font-medium transition-colors duration-200 ${
                darkMode
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-700"
              }`}
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* ✅ Subtitle under header */}
          <p
            className={`text-gray-500 mb-10 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Complete your purchase by entering your delivery details and payment information below.
          </p>

          {/* ✅ Stripe + Context Providers */}
          <Elements stripe={stripePromise}>
            <CheckoutProvider>
              <CheckoutForm />
            </CheckoutProvider>
          </Elements>
        </div>
      </div>
    </>
  );
}
