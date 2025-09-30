"use client";

import React from "react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[80vh] flex items-center justify-center px-6"
      style={{
        background: "linear-gradient(to bottom right, rgba(59, 130, 246, 0.6), rgba(139, 92, 246, 0.6), rgba(236, 72, 153, 0.6))",
        backdropFilter: "blur(4px)"
      }}
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Animated Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-white"
        >
          Learn. Build. Grow.
          <span className="block text-blue-200">Level up your career & content.</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg md:text-xl mb-10 text-gray-100 max-w-2xl mx-auto"
        >
          Professional courses, creator tools, and bundles designed to help you master digital marketing, grow your brand, and monetize your skills.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <a
            href="#courses"
            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold shadow hover:opacity-90 transition"
          >
            Browse Courses
          </a>

          <a
            href="#products"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold shadow hover:opacity-90 transition"
          >
            Shop Products
          </a>
        </motion.div>
      </div>
    </section>
  );
}
