"use client";

import React from "react";
import { motion, MotionProps } from "framer-motion";
import CodingTerminal from "@/Components/CodingTerminal";
import ShapePlayground from "@/Components/ShapePlayground";
import CreativeSkills from "@/Components/CreativeSkills";
import GameDevShowcase from "@/Components/GameDevShowcase";

export default function SkillsSection() {
  const glowAnimation: MotionProps = {
    animate: { scale: [1, 1.05, 1], opacity: [0.4, 0.8, 0.4] },
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  };

  return (
    <section
      id="skills"
      className="relative w-full flex flex-col items-center py-24 px-6
        bg-gradient-to-b from-white via-indigo-50 to-pink-50
        dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-950 dark:to-black
        text-gray-900 dark:text-gray-100 transition-colors duration-500"
    >
      {/* Section Title */}
      <h2
        className="text-5xl font-extrabold mb-20 text-center
          bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
          dark:from-blue-400 dark:via-purple-400 dark:to-pink-400"
      >
        Skills
      </h2>

      {/* Coding */}
      <div className="mb-24 flex flex-col items-center gap-6">
        <h3 className="text-3xl font-semibold">💻 Coding</h3>
        <CodingTerminal />
      </div>

      {/* Design & User Experience */}
      <div className="mb-24 flex flex-col items-center gap-6 w-full max-w-5xl relative">
        <h3 className="text-3xl font-semibold text-center">
          🎨 Design & User Experience
        </h3>
        <div className="relative w-full flex justify-center">
          <ShapePlayground />
        </div>
      </div>

      {/* Content Creation & Editing */}
      <div className="mb-24 flex flex-col items-center gap-6 w-full relative">
        <h3 className="text-3xl font-semibold text-center">
          🤝 Content Creation & Editing
        </h3>

        {/* Animated Background Glows */}
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-0">
          <div className="w-full max-w-5xl flex justify-between relative h-64">
            <motion.div
              className="absolute w-44 h-44 rounded-full"
              style={{
                top: "50%",
                left: "0%",
                background:
                  "radial-gradient(circle, #31A8FF80 0%, transparent 70%)",
                filter: "blur(80px)",
                transform: "translate(-50%, -50%)",
              }}
              {...glowAnimation}
            />
            <motion.div
              className="absolute w-44 h-44 rounded-full"
              style={{
                top: "50%",
                left: "50%",
                background:
                  "radial-gradient(circle, #4B2C9B80 0%, transparent 70%)",
                filter: "blur(80px)",
                transform: "translate(-50%, -50%)",
              }}
              {...glowAnimation}
            />
            <motion.div
              className="absolute w-44 h-44 rounded-full"
              style={{
                top: "50%",
                left: "100%",
                background:
                  "radial-gradient(circle, #991F3680 0%, transparent 70%)",
                filter: "blur(80px)",
                transform: "translate(-50%, -50%)",
              }}
              {...glowAnimation}
            />
          </div>
        </div>

        {/* Skill Cards */}
        <CreativeSkills />
      </div>

      {/* 3D Modeling & Game Development */}
      <GameDevShowcase />

      {/* Bottom Waves */}
      <div className="absolute bottom-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-24"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          {/* Back wave (lighter, transparent) */}
          <path
            d="M0,0 C600,120 600,0 1200,120 L1200,0 L0,0 Z"
            className="fill-current text-pink-100 dark:text-gray-800 opacity-50"
          />
          {/* Middle wave */}
          <path
            d="M0,0 C600,100 600,20 1200,100 L1200,0 L0,0 Z"
            className="fill-current text-indigo-100 dark:text-gray-900 opacity-70"
          />
          {/* Front wave (strongest, covers bottom edge) */}
          <path
            d="M0,0 C600,80 600,40 1200,80 L1200,0 L0,0 Z"
            className="fill-current text-white dark:text-black"
          />
        </svg>
      </div>
    </section>
  );
}
