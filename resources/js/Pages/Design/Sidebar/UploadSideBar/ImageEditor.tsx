"use client";

import { FlipHorizontal, FlipVertical } from "lucide-react";

import ActionButtons from "./ActionButtons";
import ClipartSizeControls from "../ClipartSideBar/Properties/ClipartSizeControls";
import type { ImageState } from "./UploadSidebar";

type ImageEditorProps = {
  selectedImage: string;
  layer: ImageState;
  positions: Record<string, { x: number; y: number }>;
  canvasRef: React.RefObject<HTMLDivElement>;

  onResize?: (w: number, h: number) => void;
  onRotateImage?: (id: string, rotation: number) => void;
  onFlipImage?: (id: string, flip: "none" | "horizontal" | "vertical") => void;
  onDuplicateUploadedImage?: (id: string) => void;
  onRemoveUploadedImage?: (id: string) => void;
  onResetImage?: (id: string) => void;
  onCrop?: () => void;
};

/**
 * Compute the max width for the slider based on canvas size,
 * image center, and aspect ratio (matches the clamp)
 */
function getMaxWidthFromCanvas({
  canvasRect,
  center,
  layer,
}: {
  canvasRect: DOMRect;
  center: { x: number; y: number };
  layer: ImageState;
}) {
  const aspect = layer.size.h / layer.size.w;

  const maxWidthLeft = center.x;
  const maxWidthRight = canvasRect.width - center.x;
  const maxWidth = 2 * Math.min(maxWidthLeft, maxWidthRight);

  const maxHeightTop = center.y;
  const maxHeightBottom = canvasRect.height - center.y;
  const maxHeightAsWidth = 2 * Math.min(maxHeightTop, maxHeightBottom) / aspect;

  return Math.max(20, Math.min(maxWidth, maxHeightAsWidth));
}

export default function ImageEditor({
  canvasRef,
  selectedImage,
  layer,
  positions,
  onResize,
  onRotateImage,
  onFlipImage,
  onDuplicateUploadedImage,
  onRemoveUploadedImage,
  onResetImage,
  onCrop,
}: ImageEditorProps) {
  if (!layer || !selectedImage || !canvasRef.current) return null;

  const canvas = canvasRef.current;
  const center = positions[selectedImage];
  if (!center) return null;

  const canvasRect = canvas.getBoundingClientRect();
  const aspect = layer.size.h / layer.size.w;

  /**
   * ✅ Center-based resize clamp
   */
  const handleResize = (requestedWidth: number) => {
    const requestedHeight = requestedWidth * aspect;

    const maxWidthLeft = center.x;
    const maxWidthRight = canvasRect.width - center.x;
    const maxWidth = 2 * Math.min(maxWidthLeft, maxWidthRight);

    const maxHeightTop = center.y;
    const maxHeightBottom = canvasRect.height - center.y;
    const maxHeightAsWidth = 2 * Math.min(maxHeightTop, maxHeightBottom) / aspect;

    const scale = Math.min(
      maxWidth / requestedWidth,
      maxHeightAsWidth / requestedWidth,
      1
    );

    if (scale <= 0 || Number.isNaN(scale)) return;

    onResize?.(requestedWidth * scale, requestedHeight * scale);
  };

  const sliderMax = getMaxWidthFromCanvas({
    canvasRect,
    center,
    layer,
  });

  return (
    <div className="p-6 space-y-5 h-full overflow-y-auto">
      {/* SIZE */}
      <div className="space-y-2">
        <ClipartSizeControls
          value={layer.size.w}
          min={20}
          max={200}
          onChange={handleResize}
        />
      </div>

      {/* ROTATE */}
      <div className="space-y-2">
        <p className="font-semibold text-lg">Rotate</p>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={-180}
            max={180}
            value={layer.rotation ?? 0}
            onChange={(e) =>
              onRotateImage?.(selectedImage, Number(e.target.value))
            }
            className="flex-1"
          />
          <input
            type="number"
            min={-180}
            max={180}
            value={layer.rotation ?? 0}
            onChange={(e) =>
              onRotateImage?.(selectedImage, Number(e.target.value))
            }
            className="w-20 px-2 py-1 border rounded-lg font-mono text-right"
          />
        </div>
      </div>

      {/* FLIP */}
      <div className="space-y-2">
        <p className="font-semibold text-lg">Flip</p>
        <div className="flex gap-3">
          <button
            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 ${
              layer.flip === "horizontal"
                ? "bg-blue-200"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() =>
              onFlipImage?.(
                selectedImage,
                layer.flip === "horizontal" ? "none" : "horizontal"
              )
            }
          >
            <FlipHorizontal size={18} />
            Horizontal
          </button>

          <button
            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 ${
              layer.flip === "vertical"
                ? "bg-blue-200"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() =>
              onFlipImage?.(
                selectedImage,
                layer.flip === "vertical" ? "none" : "vertical"
              )
            }
          >
            <FlipVertical size={18} />
            Vertical
          </button>
        </div>
      </div>

      {/* ACTIONS */}
      <ActionButtons
        selectedImage={selectedImage}
        onDuplicateUploadedImage={onDuplicateUploadedImage}
        onRemoveUploadedImage={onRemoveUploadedImage}
        onResetImage={onResetImage}
        onCrop={onCrop}
      />
    </div>
  );
}
