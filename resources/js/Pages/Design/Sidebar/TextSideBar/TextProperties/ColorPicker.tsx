// /TextProperties/ColorPicker.tsx
"use client";

import React from "react";
import { Palette } from "lucide-react";

type Props = {
  label?: string;
  color: string;
  onColorChange: (v: string) => void;
  size?: "sm" | "md";
};

export default function ColorPicker({ label = "Colour", color, onColorChange, size = "md" }: Props) {
  const className = size === "sm" ? "h-6 w-8" : "h-8 w-10";
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Palette size={16} />
        {label}
      </div>

      <input
        type="color"
        value={color}
        onChange={(e) => onColorChange(e.target.value)}
        className={`${className} rounded border`}
      />
    </div>
  );
}
