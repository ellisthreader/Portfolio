import React from "react";
import { useDarkMode } from "@/Context/DarkModeContext";
import { useCheckout } from "@/Context/CheckoutContext";

export default function ContactInfo() {
  const { darkMode } = useDarkMode();
  const { email, setEmail } = useCheckout();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("[ContactInfo] Email changed:", e.target.value);
    setEmail(e.target.value);
  };

  return (
    <div
      className={`p-6 rounded-xl shadow transition-colors ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h2 className="text-xl font-semibold mb-4">Contact Information</h2>

      <div className="space-y-4">
        {/* EMAIL */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            className={`w-full rounded-lg border p-3 transition-colors duration-200 focus:ring-2 focus:ring-indigo-500 ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400"
                : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
            }`}
            placeholder="you@example.com"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
      </div>
    </div>
  );
}
