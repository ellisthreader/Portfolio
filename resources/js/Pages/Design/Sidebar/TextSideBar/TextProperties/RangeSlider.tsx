// /TextProperties/RangeSlider.tsx
"use client";

import React from "react";

type Props = {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  icon?: React.ReactNode;
};

export default function RangeSlider({ label, min, max, value, onChange, icon }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm font-medium">
        {icon}
        {label}
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
