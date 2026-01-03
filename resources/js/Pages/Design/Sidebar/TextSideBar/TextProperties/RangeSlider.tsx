"use client";

import React from "react";

type Props = {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
};

export default function RangeSlider({ label, min, max, value, onChange }: Props) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  return (
    <div className="flex items-center gap-4">
      {/* Label */}
      <div className="text-base font-semibold w-24">
        {label}
      </div>

      {/* Slider + number */}
      <div className="flex items-center gap-3 flex-1">
        {/* Slider */}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(clamp(Number(e.target.value)))}
          className="flex-1"
        />

        {/* Number box */}
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(clamp(Number(e.target.value)))}
          className="w-20 border rounded px-2 py-1 text-base"
        />
      </div>
    </div>
  );
}
