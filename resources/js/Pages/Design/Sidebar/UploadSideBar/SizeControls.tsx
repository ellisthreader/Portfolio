"use client";

import { useEffect, useState } from "react";

const DPI = 96;
const MIN_INCHES = 0.1;

type SizeControlsProps = {
  selectedImage: string;
  image: any; // could be typed as ImageState
  restrictedBox?: { x: number; y: number; w: number; h: number };
  canvasPositions?: Record<string, { x: number; y: number }>;
  onUpdateImageSize?: (id: string, w: number, h: number) => void;
  setImageState?: React.Dispatch<any>;
  setSizes?: React.Dispatch<any>;
};

export default function SizeControls({
  selectedImage,
  image,
  restrictedBox,
  canvasPositions,
  onUpdateImageSize,
  setImageState,
  setSizes,
}: SizeControlsProps) {
  const [sizeInches, setSizeInches] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!image?.size) return;

    setSizeInches({
      width: Number((image.size.w / DPI).toFixed(2)),
      height: Number((image.size.h / DPI).toFixed(2)),
    });
  }, [image?.size?.w, image?.size?.h]);

  const clamp = (v: number) => Math.max(MIN_INCHES, v);

const updateSize = (wIn: number, hIn: number) => {
  if (!selectedImage || !image) return;

  const pos = canvasPositions?.[selectedImage] ?? { x: 0, y: 0 };

  let pxW = wIn * DPI;
  let pxH = hIn * DPI;

  if (restrictedBox) {
    const boxLeft = restrictedBox.x ?? 0;
    const boxTop = restrictedBox.y ?? 0;
    const boxRight = boxLeft + (restrictedBox.w ?? 0);
    const boxBottom = boxTop + (restrictedBox.h ?? 0);

    // Ensure width & height do not push the image outside the box
    // If the image is partially outside left/top, move it in first
    let newX = pos.x;
    let newY = pos.y;

    if (pos.x < boxLeft) newX = boxLeft;
    if (pos.y < boxTop) newY = boxTop;

    // Now clamp size so right/bottom edges stay inside
    pxW = Math.min(pxW, boxRight - newX);
    pxH = Math.min(pxH, boxBottom - newY);

    // Also ensure size is at least MIN_INCHES
    pxW = Math.max(pxW, MIN_INCHES * DPI);
    pxH = Math.max(pxH, MIN_INCHES * DPI);

    // Optional: update the position if it was corrected
    canvasPositions![selectedImage] = { ...pos, x: newX, y: newY };
  }

  // Update local state
  setSizeInches({
    width: +(pxW / DPI).toFixed(2),
    height: +(pxH / DPI).toFixed(2),
  });

  // Update global state
  onUpdateImageSize?.(selectedImage, Math.round(pxW), Math.round(pxH));

  setImageState?.((prev: any) => ({
    ...prev,
    [selectedImage]: {
      ...prev[selectedImage],
      size: { w: Math.round(pxW), h: Math.round(pxH) },
    },
  }));

  setSizes?.((prev: any) => ({
    ...prev,
    [selectedImage]: { w: Math.round(pxW), h: Math.round(pxH) },
  }));
};
  
  return (
    <div className="space-y-2">
      <p className="font-semibold text-lg">Upload Size</p>

      <div className="grid grid-cols-2 gap-3">
        {/* Width */}
        <div>
          <label className="text-sm text-gray-600">Width (inches)</label>
          <input
            type="number"
            step={0.1}
            min={MIN_INCHES}
            value={sizeInches.width}
            onChange={(e) => {
              const w = clamp(Number(e.target.value));
              setSizeInches((s) => ({ ...s, width: w }));
              updateSize(w, sizeInches.height);
            }}
            className="w-full mt-1 border rounded-lg px-3 py-2"
          />
        </div>

        {/* Height */}
        <div>
          <label className="text-sm text-gray-600">Height (inches)</label>
          <input
            type="number"
            step={0.1}
            min={MIN_INCHES}
            value={sizeInches.height}
            onChange={(e) => {
              const h = clamp(Number(e.target.value));
              setSizeInches((s) => ({ ...s, height: h }));
              updateSize(sizeInches.width, h);
            }}
            className="w-full mt-1 border rounded-lg px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
}
