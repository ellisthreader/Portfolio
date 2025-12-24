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
  }, [image]);

  const clamp = (v: number) => Math.max(MIN_INCHES, v);

  const updateSize = (wIn: number, hIn: number) => {
    const pos = canvasPositions[selectedImage] ?? { x: 0, y: 0 };

    const maxW =
      restrictedBox.width - (pos.x - restrictedBox.left);
    const maxH =
      restrictedBox.height - (pos.y - restrictedBox.top);

    const pxW = Math.min(wIn * DPI, maxW);
    const pxH = Math.min(hIn * DPI, maxH);

    onUpdateImageSize?.(
      selectedImage,
      Math.round(pxW),
      Math.round(pxH)
    );

    setImageState?.((prev: any) => ({
      ...prev,
      [selectedImage]: {
        ...prev[selectedImage],
        size: { w: Math.round(pxW), h: Math.round(pxH) },
      },
    }));
  };

  return (
    <div>
      <p className="font-semibold text-lg mb-2">Upload Size</p>

      <div className="grid grid-cols-2 gap-3">
        {/* Width */}
        <div>
          <label className="text-sm text-gray-600">
            Width (inches)
          </label>
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
          <label className="text-sm text-gray-600">
            Height (inches)
          </label>
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
