import React, { useState } from "react";
import { QuoteItem } from "./GetQuoteInstantly";

type Props = {
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  items: QuoteItem[];
  total: number;
};

export default function ContactStep({
  name,
  setName,
  email,
  setEmail,
  items,
  total,
}: Props) {
  const [hasProceeded, setHasProceeded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const isContactValid = name.trim().length > 1 && isValidEmail(email);

  const sendQuote = async () => {
    if (!isContactValid) return;

    setLoading(true);
    setError("");

    try {
      // Ensure each item has a quantity
      const itemsWithQuantity = items.map((item) => ({
        quantity: item.quantity ?? 1, // default to 1 if missing
        productType: item.productType,
        designType: item.designType,
        sizeCategory: item.sizeCategory,
        size: item.size,
      }));

      const res = await fetch("http://localhost/api/send-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, items: itemsWithQuantity, total }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to send quote");
      }

      setHasProceeded(true);
      alert("Your quote has been sent to your email!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!hasProceeded && (
        <>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Contact Information
          </h2>

          <div className="flex flex-col gap-4 mb-8">
            <input
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-200 rounded-2xl px-5 py-3 text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
            />

            <input
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-200 rounded-2xl px-5 py-3 text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
            />

            {email.length > 0 && !isValidEmail(email) && (
              <p className="text-sm text-red-500">
                Please enter a valid email address
              </p>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          {/* Proceed Button */}
          <button
            disabled={!isContactValid || loading}
            onClick={sendQuote}
            className={`
              w-full rounded-2xl py-3 font-semibold transition-all duration-200
              ${isContactValid
                ? "bg-[#C9A24D] text-white hover:brightness-110 cursor-pointer"
                : "bg-[#A88B3D] text-white/70 cursor-not-allowed"}
            `}
          >
            {loading ? "Sending..." : "Proceed"}
          </button>
        </>
      )}

      {/* FINAL QUOTE VIEW */}
      {hasProceeded && (
        <>
          {/* Total Quote Card */}
          <div className="mt-8 bg-white rounded-3xl border border-[#EFE3C3] p-8 shadow-sm">
            <div className="flex items-end justify-between">
              <div>
                <p className="uppercase tracking-widest text-xs text-gray-500 mb-2">
                  Total Quote
                </p>
                <p className="text-4xl font-extrabold text-gray-900 leading-none">
                  £{total.toFixed(2)}
                </p>
              </div>

              <div className="text-right">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                                border border-[#C9A24D] text-[#C9A24D] text-sm font-medium">
                  Estimation
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-dashed border-[#EFE3C3] pt-4">
              <p className="text-sm text-gray-500">
                This quote is based on your selected items and specifications.
              </p>
            </div>
          </div>

          {/* Items */}
          <h3 className="text-xl font-bold mt-10 mb-4 text-gray-900">Items</h3>

          <div className="space-y-3">
            {items.map((item, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm"
              >
                <p className="font-semibold text-gray-900">
                  {item.quantity ?? 1} × {item.productType}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {item.designType}, {item.sizeCategory}: {item.size}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
