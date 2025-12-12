"use client";

import React, { useEffect, useRef, useState } from "react";

type CropProps = {
  selectedImage: string;
  onUpload: (url: string) => void;
  onSelectImage?: (url: string | null) => void;
  onClose: () => void;
};

type CropBox = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export default function Crop({ selectedImage, onUpload, onSelectImage, onClose }: CropProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const cropRef = useRef<HTMLDivElement | null>(null);

  const [crop, setCrop] = useState<CropBox>({
    left: 40,
    top: 40,
    width: 200,
    height: 200,
  });

  const dragState = useRef<{
    dragging: boolean;
    handle: string | null;
    startX: number;
    startY: number;
    startCrop: CropBox | null;
  }>({ dragging: false, handle: null, startX: 0, startY: 0, startCrop: null });

  // ---------------- Drag Handlers ----------------
  const startDrag = (e: React.MouseEvent | React.TouchEvent, handle: string) => {
    const clientX = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

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
    if (!handle) return;

    const newCrop: CropBox = { ...startCrop };

    // Corner handles
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

    // Side handles
    if (handle === "n") {
      newCrop.top = startCrop.top + dy;
      newCrop.height = startCrop.height - dy;
    }
    if (handle === "s") {
      newCrop.height = startCrop.height + dy;
    }
    if (handle === "w") {
      newCrop.left = startCrop.left + dx;
      newCrop.width = startCrop.width - dx;
    }
    if (handle === "e") {
      newCrop.width = startCrop.width + dx;
    }

    // Min size + clamp
    newCrop.width = Math.max(40, newCrop.width);
    newCrop.height = Math.max(40, newCrop.height);
    newCrop.left = Math.max(0, newCrop.left);
    newCrop.top = Math.max(0, newCrop.top);

    setCrop(newCrop);
  };

  const onMouseUp = () => {
    dragState.current.dragging = false;
    dragState.current.handle = null;
    dragState.current.startCrop = null;
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  // ---------------- Compute image rect ----------------
  const computeRenderedImageRect = (): CropBox | null => {
    const img = imgRef.current;
    if (!img || !img.parentElement) return null;
    const container = img.parentElement;
    const containerRect = container.getBoundingClientRect();

    if (!img.naturalWidth || !img.naturalHeight) return null;

    const naturalRatio = img.naturalWidth / img.naturalHeight;
    const containerRatio = containerRect.width / containerRect.height;

    let displayedW, displayedH;
    if (naturalRatio > containerRatio) {
      displayedW = containerRect.width;
      displayedH = containerRect.width / naturalRatio;
    } else {
      displayedH = containerRect.height;
      displayedW = containerRect.height * naturalRatio;
    }

    return {
      left: (containerRect.width - displayedW) / 2,
      top: (containerRect.height - displayedH) / 2,
      width: displayedW,
      height: displayedH,
    };
  };

  // ---------------- Apply Crop ----------------
  const applyCrop = () => {
    if (!imgRef.current || !cropRef.current) return;

    const img = imgRef.current;
    const cropBox = cropRef.current;
    const container = img.parentElement!;
    const containerRect = container.getBoundingClientRect();
    const cropRect = cropBox.getBoundingClientRect();

    const scaleX = img.naturalWidth / crop.width;
    const scaleY = img.naturalHeight / crop.height;

    const sx = (cropRect.left - containerRect.left) * scaleX;
    const sy = (cropRect.top - containerRect.top) * scaleY;
    const sw = cropRect.width * scaleX;
    const sh = cropRect.height * scaleY;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(sw);
    canvas.height = Math.round(sh);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    const newURL = canvas.toDataURL("image/png");

    onUpload(newURL);
    onSelectImage?.(newURL);
    onClose();
  };

  useEffect(() => {
    // Snap crop to image rect on mount
    const rect = computeRenderedImageRect();
    if (rect) setCrop(rect);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImage]);

  return (
    <div className="p-5 h-full flex flex-col space-y-4 bg-white shadow-lg rounded-xl">
      <button
        onClick={onClose}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        Back
      </button>
      <h2 className="text-2xl font-bold">Crop</h2>

      <div className="relative w-full border rounded-xl bg-black/5 overflow-hidden" style={{ height: "70%" }}>
        <img
          ref={imgRef}
          src={selectedImage}
          className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
          alt="to-crop"
        />
        <div
          ref={cropRef}
          className="absolute border-2 border-white/90 bg-transparent"
          style={{
            left: crop.left,
            top: crop.top,
            width: crop.width,
            height: crop.height,
          }}
        >
          {["nw", "ne", "sw", "se", "n", "s", "w", "e"].map((pos) => (
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
        className="mt-auto w-full py-3 bg-blue-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-600 transition"
      >
        Apply Crop
      </button>
    </div>
  );
}
