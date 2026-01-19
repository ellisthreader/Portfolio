"use client";

import { useState } from "react";

const MAX_TEXT_LENGTH = 260;

export type TextLayer = {
  id: string;
  type: "text";
  text: string;
  font: string;
  color: string;
  fontSize: number;
  rotation: number;
  borderColor: string;
  borderWidth: number;
  width?: number;
};

export default function AddText({
  onAddText,
}: {
  onAddText: (layer: TextLayer) => void;
}) {
  const [text, setText] = useState("");

  const calculateFontSize = (
    text: string,
    fontFamily: string,
    maxWidth: number,
    maxFontSize: number
  ) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) return maxFontSize;

    let fontSize = maxFontSize;

    while (fontSize > 5) {
      context.font = `${fontSize}px ${fontFamily}`;
      const textWidth = context.measureText(text).width;
      if (textWidth <= maxWidth) break;
      fontSize -= 1;
    }

    return fontSize;
  };

  const handleAddText = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // 🔒 HARD CLAMP (paste / programmatic safe)
    const clampedText = trimmed.slice(0, MAX_TEXT_LENGTH);

    const maxWidth = 200;
    const maxFontSize = 40;

    const adjustedFontSize = calculateFontSize(
      clampedText,
      "Inter",
      maxWidth,
      maxFontSize
    );

    onAddText({
      id: crypto.randomUUID(),
      type: "text",
      text: clampedText,
      font: "Inter",
      color: "#000000",
      fontSize: adjustedFontSize,
      rotation: 0,
      borderColor: "#000000",
      borderWidth: 0,
      width: maxWidth,
    });

    setText("");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">Add Text</h2>

      <input
        type="text"
        placeholder="Enter text..."
        className="w-full p-2 bg-white rounded border border-gray-300"
        value={text}
        maxLength={MAX_TEXT_LENGTH}
        onChange={(e) =>
          setText(e.target.value.slice(0, MAX_TEXT_LENGTH))
        }
      />

      <div className="text-xs text-gray-500 text-right mt-1">
        {text.length} / {MAX_TEXT_LENGTH}
      </div>

      <button
        className="mt-4 w-full bg-blue-600 text-white p-2 rounded-lg"
        onClick={handleAddText}
      >
        Add Text
      </button>
    </div>
  );
}
