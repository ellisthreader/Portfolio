"use client";

import { ArrowLeft, Trash2, Copy } from "lucide-react";

import ColorPicker from "./ColorPicker";
import ChangeArtButton from "./ChangeArtButton";
import RotateControls from "./RotateControls";
import FlipControls from "./FlipControls";
import ClipartSizeControls from "./ClipartSizeControls";

import { getClampedSize } from "./utils/getClampedSize";

type Props = {
  layer: ImageState;

  restrictedBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  canvasPosition: {
    x: number;
    y: number;
  };

  onBack?: () => void;

  onRotate: (v: number) => void;
  onFlip: (v: "none" | "horizontal" | "vertical") => void;
  onResize: (w: number, h: number) => void;

  onChangeArt: () => void;
  onChangeColor: (color: string) => void;
  onDelete: () => void;
  onDuplicate: () => void; // ✅ New prop
};

export default function ClipartProperties({
  layer,
  restrictedBox,
  canvasPosition,
  onBack,
  onRotate,
  onFlip,
  onResize,
  onChangeArt,
  onChangeColor,
  onDelete,
  onDuplicate, // ✅ New prop
}: Props) {
  const isSvg =
    layer.url?.endsWith(".svg") ||
    layer.src?.endsWith(".svg");

  const handleResize = (requestedWidth: number) => {
    // ✅ Prevent user from typing < 1
    const clampedWidth = Math.max(requestedWidth, 1);

    const pos = canvasPosition ?? { x: 0, y: 0 };

    const result = getClampedSize({
      requestedWidth: clampedWidth,
      currentWidth: layer.size.w,
      currentHeight: layer.size.h,
      position: pos,
      restrictedBox,
    });

    if (!result) return;

    onResize(result.width, result.height);
  };

  return (
    <div className="p-6 space-y-5 h-full overflow-y-auto relative">
      {/* Back */}
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-900 transition"
        >
          <ArrowLeft size={20} />
        </button>
      )}

      {/* SIZE */}
      <ClipartSizeControls
        value={layer.size.w}
        min={20}
        max={600}
        onChange={handleResize}
      />

      {/* ROTATE */}
      <RotateControls
        value={layer.rotation ?? 0}
        onRotate={onRotate}
      />

      {/* COLOR (SVG only) */}
      {isSvg && (
        <ColorPicker
          color={layer.color ?? "#000000"}
          onChangeColor={onChangeColor}
        />
      )}

      {/* FLIP */}
      <FlipControls
        value={layer.flip}
        onFlip={onFlip}
      />

      {/* Bottom actions */}
      <div className="space-y-4">
        {/* Change Art */}
        <ChangeArtButton
          onBack={onBack}
          onChangeArt={onChangeArt}
        />

        {/* Duplicate Clipart */}
        {onDuplicate && (
          <button
            onClick={onDuplicate}
            className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold flex items-center justify-center gap-2 transition"
          >
            <Copy size={18} />
            Duplicate Clipart
          </button>
        )}

        {/* Delete Clipart */}
        <button
          onClick={onDelete}
          className="w-full py-3 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-semibold flex items-center justify-center gap-2 transition"
        >
          <Trash2 size={18} />
          Delete Clipart
        </button>
      </div>
    </div>
  );
}
