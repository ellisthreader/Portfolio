import React from "react";
import { Head, usePage } from "@inertiajs/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useDarkMode } from "@/Context/DarkModeContext";
import { CheckoutProvider } from "@/Context/CheckoutContext"; // ✅ Import the provider

// Stripe public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY as string);

type User = {
  id: number;
  name: string;
  email: string;
};

type PageProps = {
  auth: {
    user?: User;
  };
};

// ✅ Full working CheckoutPage (with CheckoutProvider)
export default function CheckoutPage() {
  const { props } = usePage<PageProps>();
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
          <h1 className="text-3xl font-semibold mb-6 text-center">Checkout</h1>
          <p className="text-center text-gray-500 mb-10">
            Complete your purchase by providing your delivery and payment
            information below.
          </p>

          {/* ✅ Wrap CheckoutForm with both Stripe and Checkout context */}
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
