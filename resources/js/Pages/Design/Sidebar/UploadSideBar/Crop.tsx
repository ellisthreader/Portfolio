"use client";

import React, { useEffect, useRef, useState } from "react";

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

export default function Crop({ selectedImage, onReplaceCanvasImage, onClose }: CropProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const cropRef = useRef<HTMLDivElement | null>(null);

  const [crop, setCrop] = useState<CropBox>({
    left: 40,
    top: 40,
    width: 200,
    height: 200,
  });

  // ---------------- Drag State ----------------
  const dragState = useRef({
    dragging: false,
    handle: null as string | null,
    startX: 0,
    startY: 0,
    startCrop: null as CropBox | null,
  });

  const startDrag = (e: any, handle: string) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    dragState.current = {
      dragging: true,
      handle,
      startX: clientX,
      startY: clientY,
      startCrop: { ...crop },
    };

    e.preventDefault();
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragState.current.dragging || !dragState.current.startCrop) return;

    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    const startCrop = dragState.current.startCrop;
    const handle = dragState.current.handle;

    const newCrop: CropBox = { ...startCrop };

    // corners
    if (handle === "nw") {
      newCrop.left = startCrop.left + dx;
      newCrop.top = startCrop.top + dy;
      newCrop.width = startCrop.width - dx;
      newCrop.height = startCrop.height - dy;
    }
    if (handle === "ne") {
      newCrop.top = startCrop.top + dy;
      newCrop.width = startCrop.width + dx;
      newCrop.height = startCrop.height - dy;
    }
    if (handle === "sw") {
      newCrop.left = startCrop.left + dx;
      newCrop.width = startCrop.width - dx;
      newCrop.height = startCrop.height + dy;
    }
    if (handle === "se") {
      newCrop.width = startCrop.width + dx;
      newCrop.height = startCrop.height + dy;
    }

    // sides
    if (handle === "n") {
      newCrop.top = startCrop.top + dy;
      newCrop.height = startCrop.height - dy;
    }
    if (handle === "s") newCrop.height = startCrop.height + dy;
    if (handle === "w") {
      newCrop.left = startCrop.left + dx;
      newCrop.width = startCrop.width - dx;
    }
    if (handle === "e") newCrop.width = startCrop.width + dx;

    newCrop.width = Math.max(40, newCrop.width);
    newCrop.height = Math.max(40, newCrop.height);
    newCrop.left = Math.max(0, newCrop.left);
    newCrop.top = Math.max(0, newCrop.top);

    setCrop(newCrop);
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", () => {
      dragState.current.dragging = false;
      dragState.current.handle = null;
    });

    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  // ---------------- Compute image rect ----------------
  const computeImageRect = () => {
    const img = imgRef.current;
    if (!img) return null;
    const container = img.parentElement!;
    const rect = container.getBoundingClientRect();

    const imgAspect = img.naturalWidth / img.naturalHeight;
    const containerAspect = rect.width / rect.height;

    let w, h;
    if (imgAspect > containerAspect) {
      w = rect.width;
      h = rect.width / imgAspect;
    } else {
      h = rect.height;
      w = rect.height * imgAspect;
    }

    return {
      left: (rect.width - w) / 2,
      top: (rect.height - h) / 2,
      width: w,
      height: h,
    };
  };

  useEffect(() => {
    const r = computeImageRect();
    if (r) setCrop(r);
  }, [selectedImage]);

  // ---------------- Apply crop ----------------
  const applyCrop = () => {
    if (!imgRef.current || !cropRef.current) return;

    const img = imgRef.current;
    const container = img.parentElement!;
    const cRect = container.getBoundingClientRect();
    const cr = cropRef.current.getBoundingClientRect();

    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;

    const imgAspect = naturalW / naturalH;
    const containerAspect = cRect.width / cRect.height;

    let displayedW, displayedH, offsetX, offsetY;

    if (imgAspect > containerAspect) {
      displayedW = cRect.width;
      displayedH = cRect.width / imgAspect;
      offsetX = 0;
      offsetY = (cRect.height - displayedH) / 2;
    } else {
      displayedH = cRect.height;
      displayedW = cRect.height * imgAspect;
      offsetX = (cRect.width - displayedW) / 2;
      offsetY = 0;
    }

    const scaleX = naturalW / displayedW;
    const scaleY = naturalH / displayedH;

    const sx = (cr.left - cRect.left - offsetX) * scaleX;
    const sy = (cr.top - cRect.top - offsetY) * scaleY;
    const sw = cr.width * scaleX;
    const sh = cr.height * scaleY;

    const canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sh;

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

    const url = canvas.toDataURL("image/png");

    onReplaceCanvasImage(url);
    onClose();
  };

  return (
    <div className="p-5 h-full flex flex-col space-y-4 bg-white shadow-lg rounded-xl">

      <button onClick={onClose} className="text-sm text-gray-600 hover:text-gray-900">
        Back
      </button>

      <h2 className="text-2xl font-bold">Crop</h2>

      {/* MAIN CROPPING AREA */}
      <div className="relative w-full border rounded-xl bg-black/5 overflow-hidden" style={{ height: "70%" }}>

        {/* 1️⃣ Normal image (only visible inside crop box) */}
        <img
          ref={imgRef}
          src={selectedImage}
          className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
        />

        {/* 2️⃣ Blurred overlay mask outside crop box */}
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            backdropFilter: "blur(8px) brightness(0.7)",
            WebkitBackdropFilter: "blur(8px) brightness(0.7)",
            mask: `radial-gradient(
              circle at ${crop.left + crop.width / 2}px ${crop.top + crop.height / 2}px,
              transparent ${Math.min(crop.width, crop.height) / 2}px,
              black ${Math.min(crop.width, crop.height) / 2 + 1}px
            )`,
          }}
        ></div>

        {/* CROP BOX */}
        <div
          ref={cropRef}
          className="absolute border-2 border-white"
          style={{ left: crop.left, top: crop.top, width: crop.width, height: crop.height }}
        >
          {["nw","ne","sw","se","n","s","w","e"].map((pos) => (
            <div
              key={pos}
              onMouseDown={(e) => startDrag(e, pos)}
              className="absolute w-4 h-4 bg-white rounded-full border border-black cursor-pointer"
              style={{
                top: pos.includes("n") ? -6 : pos.includes("s") ? "auto" : "50%",
                bottom: pos.includes("s") ? -6 : "auto",
                left: pos.includes("w") ? -6 : pos.includes("e") ? "auto" : "50%",
                right: pos.includes("e") ? -6 : "auto",
              }}
            />
          ))}
        </div>
      </div>

      <button
        onClick={applyCrop}
        className="mt-auto w-full py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600"
      >
        Apply Crop
      </button>
    </div>
  );
}
