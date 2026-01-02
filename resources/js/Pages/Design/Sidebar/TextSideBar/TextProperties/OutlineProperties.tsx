"use client";

import React from "react";

type Props = {
  onOpenOutline: () => void;
};

export default function OutlineProperties({ onOpenOutline }: Props) {
  return (
    <div className="flex items-center justify-between w-full py-2 cursor-pointer">
      {/* Label */}
      <div className="text-sm font-medium">
        Outline
      </div>

      {/* Clickable text on right */}
      <button
        onClick={onOpenOutline}
        className="italic text-sm text-gray-500 hover:text-black transition"
      >
        Select outline
      </button>
    </div>
  );
}
