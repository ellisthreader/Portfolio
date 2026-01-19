import { useEffect, useState } from "react";

const DPI = 96;
const MIN_INCHES = 0.1;

export default function SizeControls({
  selectedImage,
  image,
  restrictedBox,
  canvasPositions,
  onUpdateImageSize,
  setImageState,
}: any) {
  const [sizeInches, setSizeInches] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!image) return;

    setSizeInches({
      width: Number((image.size.w / DPI).toFixed(2)),
      height: Number((image.size.h / DPI).toFixed(2)),
    });
  }, [image?.size?.w, image?.size?.h]);


  const clamp = (v: number) => Math.max(MIN_INCHES, v);

  const updateSize = (wIn: number, hIn: number) => {
    const pos = canvasPositions[selectedImage] ?? { x: 0, y: 0 };

    const pxW = wIn * DPI;
    const pxH = hIn * DPI;

    // Max size before crossing restricted border
    // Restricted edges
    const boxLeft = restrictedBox.left;
    const boxTop = restrictedBox.top;
    const boxRight = restrictedBox.left + restrictedBox.width;
    const boxBottom = restrictedBox.top + restrictedBox.height;

    // Where the image is allowed to start (can't be left of box)
    const clampedX = Math.max(pos.x, boxLeft);
    const clampedY = Math.max(pos.y, boxTop);

    // Max size while staying inside the box
    const maxW = Math.max(1, boxRight - clampedX);
    const maxH = Math.max(1, boxBottom - clampedY);


    // Freeze at the boundary
    const finalW = Math.min(pxW, maxW);
    const finalH = Math.min(pxH, maxH);

    // Sync the inputs so they "freeze" visually too
    setSizeInches({
      width: Number((finalW / DPI).toFixed(2)),
      height: Number((finalH / DPI).toFixed(2)),
    });

    onUpdateImageSize?.(
      selectedImage,
      Math.round(finalW),
      Math.round(finalH)
    );

    setImageState?.((prev: any) => ({
      ...prev,
      [selectedImage]: {
        ...prev[selectedImage],
        size: { w: Math.round(finalW), h: Math.round(finalH) },
      },
    }));
  };

  return (
    <div>
      <p className="font-semibold text-lg mb-2">Upload Size</p>

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
