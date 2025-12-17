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
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [crop, setCrop] = useState<CropBox>(
    initialCrop ?? { left: 0, top: 0, width: 0, height: 0 }
  );

  const imageToShow = originalImage ?? selectedImage;

  const dragState = useRef({
    dragging: false,
    handle: null as string | null,
    startX: 0,
    startY: 0,
    startCrop: null as CropBox | null,
  });

  /* ---------------- INITIAL AUTO-FIT CROP ---------------- */
  useEffect(() => {
    if (!imgRef.current || !containerRef.current) return;

    // Only auto-fit when there is NO existing crop
    if (initialCrop) return;

    const img = imgRef.current;
    const container = containerRef.current;

    const containerRect = container.getBoundingClientRect();
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const containerAspect = containerRect.width / containerRect.height;

    let renderWidth = 0;
    let renderHeight = 0;
    let offsetX = 0;
    let offsetY = 0;

    if (imgAspect > containerAspect) {
      renderWidth = containerRect.width;
      renderHeight = renderWidth / imgAspect;
      offsetY = (containerRect.height - renderHeight) / 2;
    } else {
      renderHeight = containerRect.height;
      renderWidth = renderHeight * imgAspect;
      offsetX = (containerRect.width - renderWidth) / 2;
    }

    setCrop({
      left: offsetX,
      top: offsetY,
      width: renderWidth,
      height: renderHeight,
    });
  }, [imageToShow, initialCrop]);

  /* ---------------- DRAG LOGIC ---------------- */
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
    const stopDrag = () => (dragState.current.dragging = false);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stopDrag);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stopDrag);
    };
  }, []);

  /* ---------------- APPLY CROP ---------------- */
  const applyCrop = () => {
    if (!imgRef.current || !containerRef.current) return;

    const img = imgRef.current;
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();

    const imgAspect = img.naturalWidth / img.naturalHeight;
    const containerAspect = containerRect.width / containerRect.height;

    let renderWidth = 0;
    let renderHeight = 0;
    let offsetX = 0;
    let offsetY = 0;

    if (imgAspect > containerAspect) {
      renderWidth = containerRect.width;
      renderHeight = renderWidth / imgAspect;
      offsetY = (containerRect.height - renderHeight) / 2;
    } else {
      renderHeight = containerRect.height;
      renderWidth = renderHeight * imgAspect;
      offsetX = (containerRect.width - renderWidth) / 2;
    }

    const scaleX = img.naturalWidth / renderWidth;
    const scaleY = img.naturalHeight / renderHeight;

    const sx = (crop.left - offsetX) * scaleX;
    const sy = (crop.top - offsetY) * scaleY;
    const sw = crop.width * scaleX;
    const sh = crop.height * scaleY;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(sw);
    canvas.height = Math.round(sh);

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

    onReplaceCanvasImage(canvas.toDataURL("image/png"), crop);
    onClose();
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="p-5 h-full flex flex-col bg-white shadow-lg rounded-xl">
      <button onClick={onClose} className="flex items-center gap-2 text-sm mb-4">
        <ArrowLeft size={18} /> Back
      </button>

      <h2 className="text-2xl font-bold mb-4">Crop Image</h2>

      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden rounded-xl border"
      >
        <div className="absolute inset-0" style={checkerboardStyle} />

        <img
          ref={imgRef}
          src={imageToShow}
          className="absolute inset-0 w-full h-full object-contain select-none"
          draggable={false}
        />

        {/* Overlay */}
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

        {/* Crop box */}
        <div ref={cropRef} className="absolute" style={{ ...crop }}>
          <div className="absolute inset-0 border-2 border-white" />
          {["nw","ne","sw","se","n","s","w","e"].map(pos => (
            <div
              key={pos}
              onMouseDown={(e) => startDrag(e, pos)}
              className="absolute w-3 h-3 bg-white rounded-full cursor-pointer"
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

      <button
        onClick={applyCrop}
        className="mt-5 w-full py-3 bg-blue-600 text-white rounded-xl"
      >
        Apply Crop
      </button>
    </div>
  );
}
