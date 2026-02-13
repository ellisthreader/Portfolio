import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const isContactValid =
    name.trim().length > 1 && isValidEmail(email);

  const sendQuote = async () => {
    if (!isContactValid) return;

    setIsGenerating(true);

    try {
      const itemsWithQuantity = items.map((item) => ({
        quantity: item.quantity ?? 1,
        productType: item.productType,
        designType: item.designType,
        sizeCategory: item.sizeCategory,
        size: item.size,
      }));

      fetch("http://localhost/api/send-quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          items: itemsWithQuantity,
          total,
        }),
      });

      // Premium sequence timing
      setTimeout(() => {
        setShowSuccess(true);
      }, 900);

      setTimeout(() => {
        setIsGenerating(false);
        setShowSuccess(false);
        setHasProceeded(true);
      }, 1600);

    } catch (err) {
      console.error(err);
      setError("Failed to send email.");
      setIsGenerating(false);
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">

        {/* ================= FORM ================= */}
        {!hasProceeded && !isGenerating && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Contact Information
            </h2>

            <div className="flex flex-col gap-4 mb-8">
              <input
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-200 rounded-2xl px-5 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C9A24D] transition-all"
              />

              <input
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-200 rounded-2xl px-5 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C9A24D] transition-all"
              />

              {email.length > 0 && !isValidEmail(email) && (
                <p className="text-sm text-red-500">
                  Please enter a valid email address
                </p>
              )}

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </div>

            <button
              disabled={!isContactValid}
              onClick={sendQuote}
              className={`
                w-full rounded-2xl py-3 font-semibold transition-all duration-200
                hover:scale-[1.02] active:scale-[0.98]
                ${
                  isContactValid
                    ? "bg-[#C9A24D] text-white hover:brightness-110"
                    : "bg-[#A88B3D] text-white/70 cursor-not-allowed"
                }
              `}
            >
              Proceed
            </button>
          </motion.div>
        )}

        {/* ================= LOADING ================= */}
        {isGenerating && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24"
          >
            {!showSuccess ? (
              <>
                <motion.div
                  className="w-14 h-14 border-4 border-[#C9A24D] border-t-transparent rounded-full mb-6"
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    ease: "linear",
                  }}
                />

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Generating Your Quote...
                </h3>

                <p className="text-gray-500 text-sm">
                  Preparing something premium for you.
                </p>
              </>
            ) : (
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center"
              >
                <div className="bg-[#C9A24D] text-white rounded-full p-4 mb-4 shadow-lg">
                  <Check size={28} />
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  Quote Ready
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ================= FINAL QUOTE ================= */}
        {hasProceeded && (
          <motion.div
            key="quote"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mt-8 bg-white rounded-3xl border border-[#EFE3C3] p-8 shadow-sm relative overflow-hidden">
              
              {/* Gold glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#C9A24D]/5 via-transparent to-transparent pointer-events-none"></div>

              <div className="relative z-10">

                {/* ===== TOTAL HEADER ===== */}
                <div className="flex items-end justify-between">
                  <div>
                    <p className="uppercase tracking-widest text-xs text-gray-500 mb-2">
                      Total Quote
                    </p>

                    <motion.p
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="text-4xl font-extrabold text-gray-900 leading-none"
                    >
                      £{total.toFixed(2)}
                    </motion.p>
                  </div>

                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C9A24D] text-[#C9A24D] text-sm font-medium">
                    Estimation
                  </div>
                </div>

                {/* ===== DESCRIPTION ===== */}
                <div className="mt-6 border-t border-dashed border-[#EFE3C3] pt-4">
                  <p className="text-sm text-gray-500">
                    This quote is based on your selected items and specifications.
                  </p>
                </div>

                {/* ===== ITEMS INSIDE GOLD CARD ===== */}
                <div className="mt-8 space-y-3">
                  {items.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.08 }}
                      className="bg-[#FAF7ED] border border-[#EFE3C3] rounded-2xl p-4"
                    >
                      <p className="font-semibold text-gray-900">
                        {item.quantity ?? 1} × {item.productType}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.designType}, {item.sizeCategory}: {item.size}
                      </p>
                    </motion.div>
                  ))}
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
