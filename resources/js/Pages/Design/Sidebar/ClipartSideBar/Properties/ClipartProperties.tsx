"use client";

import {
  ArrowLeft,
  FlipHorizontal,
  FlipVertical,
  Palette,
  Trash2,
} from "lucide-react";
import ColorPicker from "./ColorPicker";

type Props = {
  layer: ImageState;

  onBack?: () => void;

  onRotate: (v: number) => void;
  onFlip: (v: "none" | "horizontal" | "vertical") => void;

  onResize: (w: number, h: number) => void;

  onChangeArt: () => void;
  onChangeColor: (color: string) => void;
  onDelete: () => void;
};

export default function ClipartProperties({
  layer,
  onBack,
  onRotate,
  onFlip,
  onResize,
  onChangeArt,
  onChangeColor,
  onDelete,
}: Props) {
  const isSvg =
    layer.url?.endsWith(".svg") ||
    layer.src?.endsWith(".svg");

  return (
    <div className="p-6 space-y-7 h-full overflow-y-auto relative">
      {/* Back */}
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-900 transition"
        >
          <ArrowLeft size={20} />
        </button>
      )}

      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-900 pt-6">
        Clipart Properties
      </h2>

      {/* Size */}
      <div className="space-y-3">
        <p className="font-semibold text-lg text-gray-900">Size</p>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-gray-500">Width</label>
            <input
              type="number"
              value={layer.size.w}
              onChange={(e) =>
                onResize(Number(e.target.value), layer.size.h)
              }
              className="w-full px-3 py-2.5 border rounded-lg font-mono text-right focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-500">Height</label>
            <input
              type="number"
              value={layer.size.h}
              onChange={(e) =>
                onResize(layer.size.w, Number(e.target.value))
              }
              className="w-full px-3 py-2.5 border rounded-lg font-mono text-right focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </div>

      {/* Rotate */}
      <div className="space-y-3">
        <p className="font-semibold text-lg text-gray-900">Rotate</p>

        <div className="flex items-center gap-4">
          <input
            type="range"
            min={-180}
            max={180}
            value={layer.rotation ?? 0}
            onChange={(e) => onRotate(Number(e.target.value))}
            className="flex-1"
          />

          <input
            type="number"
            min={-180}
            max={180}
            value={layer.rotation ?? 0}
            onChange={(e) => onRotate(Number(e.target.value))}
            className="w-20 px-3 py-2.5 border rounded-lg font-mono text-right focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Color (SVG only) */}
      {isSvg && (
        <ColorPicker
          color={layer.color ?? "#000000"}
          onChangeColor={onChangeColor}
        />
      )}

      {/* Flip */}
      <div className="space-y-3">
        <p className="font-semibold text-lg text-gray-900">Flip</p>

        <div className="flex gap-4">
          <button
            onClick={() =>
              onFlip(layer.flip === "horizontal" ? "none" : "horizontal")
            }
            className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition ${
              layer.flip === "horizontal"
                ? "bg-blue-100 text-blue-900"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <FlipHorizontal size={18} />
            Horizontal
          </button>

          <button
            onClick={() =>
              onFlip(layer.flip === "vertical" ? "none" : "vertical")
            }
            className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition ${
              layer.flip === "vertical"
                ? "bg-blue-100 text-blue-900"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <FlipVertical size={18} />
            Vertical
          </button>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="pt-4 space-y-4">
        <button
          onClick={onChangeArt}
          className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition font-medium flex items-center justify-center gap-2"
        >
          <Palette size={18} />
          Change Art
        </button>

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
