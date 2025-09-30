"use client";

import React from "react";
import { ShieldCheck, Lock, Users } from "lucide-react";

export default function TrustSignals() {
  return (
    <section
      className="py-16 px-6 backdrop-blur-sm"
      style={{
        background:
          "linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(219,234,254,0.05), rgba(236,72,153,0.05))",
      }}
    >
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
        <div>
          <ShieldCheck className="w-10 h-10 mx-auto text-blue-500 mb-4" />
          <h3 className="font-semibold text-lg">30-Day Guarantee</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">Full refund if you’re not satisfied.</p>
        </div>
        <div>
          <Lock className="w-10 h-10 mx-auto text-purple-500 mb-4" />
          <h3 className="font-semibold text-lg">Secure Checkout</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">Pay safely with Stripe & PayPal.</p>
        </div>
        <div>
          <Users className="w-10 h-10 mx-auto text-pink-500 mb-4" />
          <h3 className="font-semibold text-lg">1000+ Students</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">Trusted by learners worldwide.</p>
        </div>
      </div>
    </section>
  );
}
