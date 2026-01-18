"use client";

import {
  ArrowLeft,
  FlipHorizontal,
  FlipVertical,
  Copy,
  Palette,
  Trash2,
  RefreshCcw,
} from "lucide-react";

type Props = {
  layer: ImageState;

  onBack?: () => void;

  onRotate: (v: number) => void;
  onFlip: (v: "none" | "horizontal" | "vertical") => void;

  onResize: (w: number, h: number) => void;

  onDuplicate: () => void;
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

  onDuplicate,
  onChangeArt,
  onChangeColor,
  onDelete,
}: Props) {
  return (
    <div className="p-6 space-y-7 h-full overflow-y-auto relative">
      {/* Back arrow (top-left) */}
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
              value={layer.width}
              onChange={(e) =>
                onResize(Number(e.target.value), layer.height)
              }
              className="w-full px-3 py-2.5 border rounded-lg font-mono text-right focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-500">Height</label>
            <input
              type="number"
              value={layer.height}
              onChange={(e) =>
                onResize(layer.width, Number(e.target.value))
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
            value={layer.rotation}
            onChange={(e) => onRotate(Number(e.target.value))}
            className="flex-1"
          />

          <input
            type="number"
            min={-180}
            max={180}
            value={layer.rotation}
            onChange={(e) => onRotate(Number(e.target.value))}
            className="w-20 px-3 py-2.5 border rounded-lg font-mono text-right focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Color (moved above Flip) */}
      <div className="space-y-3">
        <p className="font-semibold text-lg text-gray-900">Color</p>

        <div className="flex items-center gap-4">
          <input
            type="color"
            value={layer.color ?? "#000000"}
            onChange={(e) => onChangeColor(e.target.value)}
            className="w-12 h-12 rounded-lg border cursor-pointer"
          />

          <button
            onClick={() => onChangeColor("#000000")}
            className="px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition font-medium flex items-center gap-2"
          >
            <RefreshCcw size={16} />
            Reset
          </button>
        </div>
      </div>

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
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onDuplicate}
            className="py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition font-medium flex items-center justify-center gap-2"
          >
            <Copy size={18} />
            Duplicate
          </button>

          <button
            onClick={onChangeArt}
            className="py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition font-medium flex items-center justify-center gap-2"
          >
            <Palette size={18} />
            Change Art
          </button>
        </div>

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
