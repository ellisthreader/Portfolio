// /TextProperties/ColorPicker.tsx
"use client";

import React from "react";

type Props = {
  label?: string;
  color: string;
  onColorChange: (v: string) => void;
  size?: "sm" | "md";
};

export default function ColorPicker({
  label = "Colour",
  color,
  onColorChange,
  size = "md",
}: Props) {
  const className = size === "sm" ? "h-6 w-8" : "h-8 w-10";

  return (
    <div className="flex items-center justify-between gap-3">
      {/* Left side label */}
      <div className="text-sm font-medium">
        {label}
      </div>

      {/* Right side: hex + picker */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-600">
          {color.toUpperCase()}
        </span>

        <input
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className={`${className} appearance-none cursor-pointer p-0 border-0 bg-transparent`}
          style={{
            padding: 0,
          }}
        />
      </div>
    </div>
  );
}
