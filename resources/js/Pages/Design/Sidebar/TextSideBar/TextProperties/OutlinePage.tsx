"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import ColorPicker from "./ColorPicker";

type Props = {
  borderColor: string;
  onBorderColorChange: (v: string) => void;

  borderWidth: number;
  onBorderWidthChange: (v: number) => void;

  onBack: () => void;
};

// Subtle outline steps
const steps = [0, 0.5, 1, 1.5, 2, 2.5];

export default function OutlinePage({
  borderColor,
  onBorderColorChange,
  borderWidth,
  onBorderWidthChange,
  onBack,
}: Props) {
  const stepIndex = steps.findIndex((s) => s === borderWidth);

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm font-semibold">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <div className="ml-auto text-base font-bold text-gray-700 dark:text-gray-200">
          Outline
        </div>
      </div>

      {/* Live Preview */}
      <div className="flex justify-center items-center h-20 bg-gray-100 dark:bg-gray-800 rounded-md mb-4">
        <span
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "#111827",
            WebkitTextStrokeWidth: `${borderWidth}px`,
            WebkitTextStrokeColor: borderColor,
            WebkitTextFillColor: "#111827",
            textShadow:
              borderWidth > 0
                ? `-${borderWidth / 2}px -${borderWidth / 2}px 0 ${borderColor}, ${borderWidth / 2}px -${borderWidth / 2}px 0 ${borderColor}, -${borderWidth / 2}px ${borderWidth / 2}px 0 ${borderColor}, ${borderWidth / 2}px ${borderWidth / 2}px 0 ${borderColor}`
                : "none",
          }}
        >
          Preview
        </span>
      </div>

      {/* Width Slider */}
      <div className="space-y-1">
        <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Width
        </div>

        {/* Labels */}
        <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
          <span>No outline</span>
          <span>Thickest</span>
        </div>

        {/* Slider track with dots */}
        <div className="relative h-6 flex items-center">
          {/* Track */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />

          {/* Dots */}
          <div className="absolute left-0 right-0 flex justify-between pointer-events-none top-1/2 -translate-y-1/2">
            {steps.map((s, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full border-2 ${
                  i === stepIndex
                    ? "bg-gray-800 dark:bg-white border-gray-800 dark:border-white"
                    : "bg-white dark:bg-gray-600 border-gray-400 dark:border-gray-500"
                }`}
              />
            ))}
          </div>

          {/* Slider input */}
          <input
            type="range"
            min={0}
            max={steps.length - 1}
            step={1}
            value={stepIndex}
            onChange={(e) =>
              onBorderWidthChange(steps[Number(e.target.value)])
            }
            className="w-full appearance-none h-6 bg-transparent cursor-pointer relative z-10"
          />
        </div>
      </div>

      {/* Color Picker */}
      <ColorPicker
        label="Colour"
        color={borderColor}
        onColorChange={onBorderColorChange}
        size="md"
      />

      {/* Buttons */}
      <div className="flex flex-col gap-2 mt-4">
        <button
          onClick={() => onBorderWidthChange(0)}
          className="w-full py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition font-medium"
        >
          Remove Outline
        </button>
        <button
          onClick={onBack}
          className="w-full py-2 text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-md transition font-medium shadow"
        >
          Done
        </button>
      </div>

      {/* Slider thumb styling */}
      <style>
        {`
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: #4B5563;
            border: 2px solid white;
            margin-top: -6px;
            cursor: pointer;
            transition: background 0.2s;
          }
          input[type="range"]::-webkit-slider-thumb:hover {
            background: #111827;
          }
          input[type="range"]::-moz-range-thumb {
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: #4B5563;
            border: 2px solid white;
            cursor: pointer;
          }
          input[type="range"]::-ms-thumb {
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: #4B5563;
            border: 2px solid white;
            cursor: pointer;
          }
          input[type="range"]::-webkit-slider-runnable-track {
            height: 1px;
            background: transparent;
          }
        `}
      </style>
    </div>
  );
}
