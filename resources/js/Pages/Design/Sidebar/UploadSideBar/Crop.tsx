"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";

type CropProps = {
  selectedImage: string;
  onReplaceCanvasImage: (url: string) => void;
  onClose: () => void;
};

type CropBox = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/* ---------- Checkerboard background ---------- */
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
  onReplaceCanvasImage,
  onClose,
}: CropProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const cropRef = useRef<HTMLDivElement | null>(null);

  const [crop, setCrop] = useState<CropBox>({
    left: 40,
    top: 40,
    width: 200,
    height: 200,
  });

  /* ---------- Drag State ---------- */
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

  /* ---------- Init crop to image bounds ---------- */
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    img.onload = () => {
      const parent = img.parentElement!;
      const rect = parent.getBoundingClientRect();

      const imgAspect = img.naturalWidth / img.naturalHeight;
      const parentAspect = rect.width / rect.height;

      let width, height;
      if (imgAspect > parentAspect) {
        width = rect.width;
        height = rect.width / imgAspect;
      } else {
        height = rect.height;
        width = rect.height * imgAspect;
      }

      setCrop({
        left: (rect.width - width) / 2,
        top: (rect.height - height) / 2,
        width,
        height,
      });
    };
  }, [selectedImage]);

  /* ---------- APPLY CROP (PIXEL PERFECT) ---------- */
  const applyCrop = () => {
    if (!imgRef.current || !cropRef.current) return;

    const img = imgRef.current;
    const container = img.parentElement!;
    const cropEl = cropRef.current;

    const containerRect = container.getBoundingClientRect();
    const cropRect = cropEl.getBoundingClientRect();

    const containerW = containerRect.width;
    const containerH = containerRect.height;

    const imageAspect = img.naturalWidth / img.naturalHeight;
    const containerAspect = containerW / containerH;

    let renderW = 0;
    let renderH = 0;
    let offsetX = 0;
    let offsetY = 0;

    if (imageAspect > containerAspect) {
      renderW = containerW;
      renderH = containerW / imageAspect;
      offsetY = (containerH - renderH) / 2;
    } else {
      renderH = containerH;
      renderW = containerH * imageAspect;
      offsetX = (containerW - renderW) / 2;
    }

    const cropX = cropRect.left - containerRect.left - offsetX;
    const cropY = cropRect.top - containerRect.top - offsetY;

    const scaleX = img.naturalWidth / renderW;
    const scaleY = img.naturalHeight / renderH;

    const sx = cropX * scaleX;
    const sy = cropY * scaleY;
    const sw = cropRect.width * scaleX;
    const sh = cropRect.height * scaleY;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(sw);
    canvas.height = Math.round(sh);

    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

    onReplaceCanvasImage(canvas.toDataURL("image/png"));
    onClose();
  };

  return (
    <div className="p-5 h-full flex flex-col bg-white shadow-lg rounded-xl">
      {/* 🔙 Back button — matches UploadSidebar */}
      <button
        onClick={onClose}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <h2 className="text-2xl font-bold mb-4">Crop Image</h2>

      <div className="relative flex-1 overflow-hidden rounded-xl border bg-neutral-100 shadow-inner">
        <div className="absolute inset-0" style={checkerboardStyle} />

        <img
          ref={imgRef}
          src={selectedImage}
          className="absolute inset-0 w-full h-full object-contain select-none"
        />

        {/* Dimmed outside */}
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
        <div
          ref={cropRef}
          className="absolute"
          style={{
            left: crop.left,
            top: crop.top,
            width: crop.width,
            height: crop.height,
          }}
        >
          <div className="absolute inset-0 border-2 border-white rounded-sm shadow-lg" />

          {["nw","ne","sw","se","n","s","w","e"].map((pos) => (
            <div
              key={pos}
              onMouseDown={(e) => startDrag(e, pos)}
              className="absolute w-3 h-3 bg-white rounded-full shadow cursor-pointer"
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
        className="mt-5 w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-lg"
      >
        Apply Crop
      </button>
    </div>
  );
}
