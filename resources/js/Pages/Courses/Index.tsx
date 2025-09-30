"use client";

import React from "react";
import HeroSection from "./HeroSection";
import Courses from "./Courses";
import Products from "./Products";
import SuccessStories from "./Testimonials";
import TrustSignals from "./TrustSignals";

export default function HomePage() {
  return (
    <main
      className="overflow-x-hidden"
      style={{
        // Pink at top → Light Blue at bottom
        background: "linear-gradient(to bottom, rgba(236,72,153,0.1), rgba(191,219,254,0.1))",
      }}
    >
      {/* Hero Section */}
      <HeroSection />

      {/* Courses Section */}
      <section id="courses">
        <Courses />
      </section>

      {/* Products Section */}
      <section id="products">
        <Products />
      </section>

      {/* Success Stories */}
      <section id="testimonials">
        <SuccessStories />
      </section>

      {/* Trust Signals */}
      <section>
        <TrustSignals />
      </section>
    </main>
  );
}
