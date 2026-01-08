"use client";

import { useState } from "react";

export type TextLayer = {
  id: string;
  type: "text";
  text: string;
  font: string;
  color: string;
  fontSize: number; // actual font size
  rotation: number;
  borderColor: string;
  borderWidth: number;
  width?: number; // box width
};

export default function AddText({
  onAddText,
}: {
  onAddText: (layer: TextLayer) => void;
}) {
  const [text, setText] = useState("");

  // Function to calculate the maximum font size that fits the box
  const calculateFontSize = (
    text: string,
    fontFamily: string,
    maxWidth: number,
    maxFontSize: number
  ) => {
    console.log("Calculating font size for:", text);

    // Create a canvas to measure text width
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      console.warn("Canvas context unavailable, returning maxFontSize");
      return maxFontSize;
    }

    let fontSize = maxFontSize;

    // Decrease font size until text fits
    while (fontSize > 5) {
      context.font = `${fontSize}px ${fontFamily}`;
      const textWidth = context.measureText(text).width;

      console.log(`FontSize: ${fontSize}, TextWidth: ${textWidth}, MaxWidth: ${maxWidth}`);

      if (textWidth <= maxWidth) break;

      fontSize -= 1;
    }

    console.log("Final font size:", fontSize);
    return fontSize;
  };

  const handleAddText = () => {
    if (!text.trim()) return;

    const maxWidth = 200; // restricted box width
    const maxFontSize = 40; // maximum font size

    const adjustedFontSize = calculateFontSize(text, "Inter", maxWidth, maxFontSize);

    console.log("Adjusted font size for text:", adjustedFontSize);

    const newTextLayer: TextLayer = {
      id: crypto.randomUUID(),
      type: "text",
      text,
      font: "Inter",
      color: "#000000",
      fontSize: adjustedFontSize,
      rotation: 0,
      borderColor: "#000000",
      borderWidth: 0,
      width: maxWidth,
    };

    console.log("Adding new text layer:", newTextLayer);

    onAddText(newTextLayer);
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
        onChange={(e) => setText(e.target.value)}
      />

      <button
        className="mt-4 w-full bg-blue-600 text-white p-2 rounded-lg"
        onClick={handleAddText}
      >
        Add Text
      </button>
    </div>
  );
}
