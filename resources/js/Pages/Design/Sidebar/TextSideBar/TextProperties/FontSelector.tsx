// /TextProperties/FontSelector.tsx
"use client";

import React, { useState } from "react";

type Props = {
  fontFamily: string;
  onFontChange: (v: string) => void;
  fonts?: string[];
};

export default function FontSelector({ fontFamily, onFontChange, fonts }: Props) {
  const allFonts = fonts ?? [
    "Abril Fatface",
    "Amaranth",
    "Anton",
    "BBH Bogle",
    "Bebas Neue",
    "Caveat Brush",
    "Changa",
    "Chewy",
    "Comfortaa",
    "Comic Neue",
    "Courgette",
    "DM Mono",
    "Exo",
    "Great Vibes",
    "Indie Flower",
    "Kaushan Script",
    "Lobster",
    "Merienda",
    "Reenie Beanie",
    "Satisfy"
  ];

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Filter fonts by search
  const filteredFonts = allFonts.filter(f =>
    f.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full relative">
      {/* Top row: label + selected font */}
      <div
        className="flex items-center w-full cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="text-base flex-shrink-0 font-medium">Font:</div>
        <div
          className="text-lg ml-auto truncate"
          style={{ fontFamily }}
          title={fontFamily}
        >
          {fontFamily}
        </div>
      </div>

      {/* Font selection panel */}
      {open && (
        <div className="absolute top-10 left-0 w-full max-h-96 overflow-y-auto border border-gray-300 bg-white shadow-lg rounded-md z-50 p-2">
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search fonts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-2 p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Font list */}
          <div className="flex flex-col gap-1">
            {filteredFonts.map((font) => (
              <div
                key={font}
                className={`p-2 rounded-md cursor-pointer hover:bg-blue-100 ${
                  font === fontFamily ? "bg-blue-200 font-semibold" : ""
                }`}l
                style={{ fontFamily: font }}
                onClick={() => {
                  onFontChange(font);
                  setOpen(false);
                }}
              >
                {font}
              </div>
            ))}
            {filteredFonts.length === 0 && (
              <div className="p-2 text-gray-400 italic">No fonts found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
