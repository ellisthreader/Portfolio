"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";

type CropProps = {
  selectedImage: string;
  originalImage?: string;
  initialCrop?: CropBox | null;
  onReplaceCanvasImage: (url: string, crop: CropBox) => void;
  onClose: () => void;
};

type CropBox = {
  left: number;
  top: number;
  width: number;
  height: number;
};

const checkerboardStyle: React.CSSProperties = {
  backgroundColor: "#d6d6d6",
  backgroundImage: `
    linear-gradient(45deg, #ececec 25%, transparent 25%),
    linear-gradient(-45deg, #ececec 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ececec 75%),
    linear-gradient(-45deg, transparent 75%, #ececec 75%)
  `,
  backgroundSize: "16px 16px",
  backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
};

export default function Crop({
  selectedImage,
  originalImage,
  initialCrop,
  onReplaceCanvasImage,
  onClose,
}: CropProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const cropRef = useRef<HTMLDivElement | null>(null);

  const [crop, setCrop] = useState<CropBox>(
    initialCrop ?? { left: 40, top: 40, width: 200, height: 200 }
  );

  const imageToShow = originalImage ?? selectedImage;

  const dragState = useRef({
    dragging: false,
    handle: null as string | null,
    startX: 0,
    startY: 0,
    startCrop: null as CropBox | null,
  });

  const startDrag = (e: React.MouseEvent, handle: string) => {
    dragState.current = {
      dragging: true,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startCrop: { ...crop },
    };
    e.preventDefault();
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragState.current.dragging || !dragState.current.startCrop) return;

    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    const start = dragState.current.startCrop;
    const h = dragState.current.handle;

    const next = { ...start };

    if (h === "nw") { next.left += dx; next.top += dy; next.width -= dx; next.height -= dy; }
    if (h === "ne") { next.top += dy; next.width += dx; next.height -= dy; }
    if (h === "sw") { next.left += dx; next.width -= dx; next.height += dy; }
    if (h === "se") { next.width += dx; next.height += dy; }
    if (h === "n")  { next.top += dy; next.height -= dy; }
    if (h === "s")  next.height += dy;
    if (h === "w")  { next.left += dx; next.width -= dx; }
    if (h === "e")  next.width += dx;

    next.width = Math.max(40, next.width);
    next.height = Math.max(40, next.height);
    next.left = Math.max(0, next.left);
    next.top = Math.max(0, next.top);

    setCrop(next);
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", () => (dragState.current.dragging = false));
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  const applyCrop = () => {
    if (!imgRef.current || !cropRef.current) return;

    const img = imgRef.current;
    const container = img.parentElement!;
    const cropEl = cropRef.current;

    const containerRect = container.getBoundingClientRect();
    const cropRect = cropEl.getBoundingClientRect();

    const scaleX = img.naturalWidth / containerRect.width;
    const scaleY = img.naturalHeight / containerRect.height;

    const sx = (cropRect.left - containerRect.left) * scaleX;
    const sy = (cropRect.top - containerRect.top) * scaleY;
    const sw = cropRect.width * scaleX;
    const sh = cropRect.height * scaleY;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(sw);
    canvas.height = Math.round(sh);

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

    onReplaceCanvasImage(canvas.toDataURL("image/png"), crop);
    onClose();
  };

  return (
    <div className="p-5 h-full flex flex-col bg-white shadow-lg rounded-xl">
      <button onClick={onClose} className="flex items-center gap-2 text-sm mb-4">
        <ArrowLeft size={18} /> Back
      </button>

      <h2 className="text-2xl font-bold mb-4">Crop Image</h2>

      <div className="relative flex-1 overflow-hidden rounded-xl border">
        <div className="absolute inset-0" style={checkerboardStyle} />

        <img
          ref={imgRef}
          src={imageToShow}
          className="absolute inset-0 w-full h-full object-contain select-none"
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "rgba(0,0,0,0.45)",
            clipPath: `
              polygon(
                0% 0%,100% 0%,100% 100%,0% 100%,
                0% ${crop.top}px,
                ${crop.left}px ${crop.top}px,
                ${crop.left}px ${crop.top + crop.height}px,
                ${crop.left + crop.width}px ${crop.top + crop.height}px,
                ${crop.left + crop.width}px ${crop.top}px,
                0% ${crop.top}px
              )
            `,
          }}
        />

        <div
          ref={cropRef}
          className="absolute"
          style={{ ...crop }}
        >
          <div className="absolute inset-0 border-2 border-white" />
          {["nw","ne","sw","se","n","s","w","e"].map(pos => (
            <div
              key={pos}
              onMouseDown={(e) => startDrag(e, pos)}
              className="absolute w-3 h-3 bg-white rounded-full"
              style={{
                top: pos.includes("n") ? -6 : pos.includes("s") ? "auto" : "50%",
                bottom: pos.includes("s") ? -6 : "auto",
                left: pos.includes("w") ? -6 : pos.includes("e") ? "auto" : "50%",
                right: pos.includes("e") ? -6 : "auto",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>
      </div>

      <button onClick={applyCrop} className="mt-5 w-full py-3 bg-blue-600 text-white rounded-xl">
        Apply Crop
      </button>
    </div>
  );
}
