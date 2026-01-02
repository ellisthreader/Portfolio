// /TextProperties/BorderProperties.tsx
"use client";

import React from "react";
import { SquareDashed, Palette, Minus } from "lucide-react";
import ColorPicker from "./ColorPicker";
import RangeSlider from "./RangeSlider";

type Props = {
  borderColor: string;
  onBorderColorChange: (v: string) => void;
  borderWidth: number;
  onBorderWidthChange: (v: number) => void;
};

export default function BorderProperties({
  borderColor,
  onBorderColorChange,
  borderWidth,
  onBorderWidthChange,
}: Props) {
  return (
    <div className="space-y-3 rounded-2xl border p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <SquareDashed size={16} />
        Border
      </div>

      <ColorPicker
        label="Colour"
        color={borderColor}
        onColorChange={onBorderColorChange}
        size="sm"
      />

      <RangeSlider
        label="Size"
        min={0}
        max={20}
        value={borderWidth}
        onChange={onBorderWidthChange}
        icon={<Minus size={14} />}
      />
    </div>
  );
}
