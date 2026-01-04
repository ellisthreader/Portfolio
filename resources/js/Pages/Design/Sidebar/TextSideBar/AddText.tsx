"use client";

import { useState } from "react";

export type TextLayer = {
  id: string;
  type: "text";
  text: string;
  font: string;
  color: string;
  size: number;        // font size (number)
  rotation: number;
  borderColor: string;
  borderWidth: number;
  initialWidth?: number; // optional initial width for the box
};

export default function AddText({
  onAddText,
}: {
  onAddText: (layer: TextLayer) => void;
}) {
  const [text, setText] = useState("");

  const handleAddText = () => {
    if (!text.trim()) return;

    const newTextLayer: TextLayer = {
      id: crypto.randomUUID(),
      type: "text",
      text,               // the text content
      font: "Inter",      // font family
      color: "#000000",   // text color
      size: 40,           // font size in pixels
      rotation: 0,
      borderColor: "#000000",
      borderWidth: 0,
      initialWidth: 200,  // optional starting width of the text box
    };

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
