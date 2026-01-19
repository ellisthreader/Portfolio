"use client";

import { useState } from "react";

type Props = {
  fontFamily: string;
  textValue: string;
  onFontChange: (v: string) => void;
  onBack: () => void;
};

export default function FontPage({
  fontFamily,
  textValue,
  onFontChange,
  onBack
}: Props) {
  const [search, setSearch] = useState("");

  // ✅ Inter is default
  const activeFont = fontFamily || "Inter";

  const allFonts = [
    "Inter", // 👈 default font
    "Abril Fatface","Amaranth","Anton","BBH Bogle","Bebas Neue",
    "Caveat Brush","Changa","Chewy","Comfortaa","Comic Neue",
    "Courgette","DM Mono","Exo","Great Vibes","Indie Flower",
    "Kaushan Script","Lobster","Merienda","Reenie Beanie","Satisfy"
  ];

  const filtered = allFonts.filter(f =>
    f.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="px-3 py-1 border rounded-md"
        >
          Back
        </button>

        <h2 className="text-lg font-semibold">Choose a Font</h2>
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        placeholder="Search fonts..."
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded-md"
      />

      {/* Font list */}
      <div className="flex flex-col gap-2">
        {filtered.map(font => (
          <div
            key={font}
            className={`p-3 rounded-md cursor-pointer hover:bg-blue-100 ${
              font === activeFont ? "bg-blue-200" : ""
            }`}
            onClick={() => {
              onFontChange(font);
              onBack();
            }}
          >
            {/* Preview */}
            <div
              className="text-lg"
              style={{ fontFamily: font }}
            >
              {textValue || "Sample Text"}
            </div>

            {/* Label */}
            <div className="text-xs text-gray-500 mt-1">
              {font}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-2 text-gray-400 italic">No fonts found</div>
        )}
      </div>
    </div>
  );
}
