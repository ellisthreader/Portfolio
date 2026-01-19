"use client";

import { RefreshCcw } from "lucide-react";

type Props = {
  color?: string;
  onChangeColor: (color: string) => void;
};

export default function ColorPicker({ color = "#000000", onChangeColor }: Props) {
  if (typeof onChangeColor !== "function") {
    console.error("ColorPicker: onChangeColor is not a function");
    return null;
  }

  return (
    <div className="space-y-3">
      <p className="font-semibold text-lg text-gray-900">Color</p>

      <div className="flex items-center gap-4">
        <input
          type="color"
          value={color}
          onChange={(e) => onChangeColor(e.target.value)}
          className="w-12 h-12 rounded-lg border cursor-pointer"
        />

        <button
          type="button"
          onClick={() => onChangeColor("#000000")}
          className="px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition font-medium flex items-center gap-2"
        >
          <RefreshCcw size={16} />
          Reset
        </button>
      </div>
    </div>
  );
}
