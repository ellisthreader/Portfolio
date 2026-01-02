// /TextProperties/TextArea.tsx
"use client";

import React from "react";

type Props = {
  textValue: string;
  onTextChange: (v: string) => void;
};

export default function TextArea({ textValue, onTextChange }: Props) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-gray-500">Text</label>
      <textarea
        value={textValue}
        onChange={(e) => onTextChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
        rows={2}
      />
    </div>
  );
}
