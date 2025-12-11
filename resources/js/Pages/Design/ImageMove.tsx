"use client";

import React, { useState, useRef } from "react";

interface ImageData {
  url: string;
  x: number;
  y: number;
  ref: React.RefObject<HTMLImageElement>;
}

export default function ImageMove() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [images, setImages] = useState<ImageData[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const [marquee, setMarquee] = useState<{
    active: boolean;
    startX: number;
    startY: number;
    x: number;
    y: number;
    w: number;
    h: number;
  }>({
    active: false,
    startX: 0,
    startY: 0,
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  });

  const [draggingSelected, setDraggingSelected] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ [url: string]: { x: number; y: number } }>({});

  // ---------------------------------------------------------
  // Upload Handler
  // ---------------------------------------------------------
  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImageData[] = [];

    for (const file of files) {
      const url = URL.createObjectURL(file);
      newImages.push({
        url,
        x: 50,
        y: 50,
        ref: React.createRef<HTMLImageElement>(),
      });
    }

    setImages((prev) => [...prev, ...newImages]);
  }

  // ---------------------------------------------------------
  // Mouse Down
  // ---------------------------------------------------------
  function handleMouseDown(e: React.MouseEvent) {
    if (e.button !== 0) return;

    const rect = containerRef.current!.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const clickedUrl = getImageAtPoint(mouseX, mouseY);

    if (clickedUrl) {
      // Single-click selects image and starts drag
      setSelected([clickedUrl]);
      startGroupDrag(mouseX, mouseY);
      return;
    }

    // Otherwise start marquee selection
    setSelected([]);
    setMarquee({
      active: true,
      startX: mouseX,
      startY: mouseY,
      x: mouseX,
      y: mouseY,
      w: 0,
      h: 0,
    });
  }

  // ---------------------------------------------------------
  // Mouse Move
  // ---------------------------------------------------------
  function handleMouseMove(e: React.MouseEvent) {
    if (marquee.active) {
      const rect = containerRef.current!.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const x = Math.min(mouseX, marquee.startX);
      const y = Math.min(mouseY, marquee.startY);
      const w = Math.abs(mouseX - marquee.startX);
      const h = Math.abs(mouseY - marquee.startY);

      setMarquee({ ...marquee, x, y, w, h });
      liveSelectWithinMarquee({ ...marquee, x, y, w, h });
      return;
    }

    if (draggingSelected) {
      dragSelectedImages(e);
    }
  }

  // ---------------------------------------------------------
  // Mouse Up
  // ---------------------------------------------------------
  function handleMouseUp() {
    if (marquee.active) {
      setMarquee({ ...marquee, active: false });
    }
    setDraggingSelected(false);
  }

  // ---------------------------------------------------------
  // Hit Detection — canvas-relative
  // ---------------------------------------------------------
  function getImageAtPoint(x: number, y: number): string | null {
    for (const img of [...images].reverse()) {
      const el = img.ref.current;
      if (!el) continue;

      const rect = el.getBoundingClientRect();
      const canvas = containerRef.current!.getBoundingClientRect();

      const left = rect.left - canvas.left;
      const top = rect.top - canvas.top;
      const right = left + rect.width;
      const bottom = top + rect.height;

      if (x >= left && x <= right && y >= top && y <= bottom) {
        return img.url;
      }
    }
    return null;
  }

  // ---------------------------------------------------------
  // Live marquee selection
  // ---------------------------------------------------------
  function liveSelectWithinMarquee(m: typeof marquee) {
    const newSelected: string[] = [];

    for (const img of images) {
      const el = img.ref.current;
      if (!el) continue;

      const rect = el.getBoundingClientRect();
      const canvas = containerRef.current!.getBoundingClientRect();

      const left = rect.left - canvas.left;
      const top = rect.top - canvas.top;
      const right = left + rect.width;
      const bottom = top + rect.height;

      const overlap =
        left < m.x + m.w &&
        right > m.x &&
        top < m.y + m.h &&
        bottom > m.y;

      if (overlap) newSelected.push(img.url);
    }

    setSelected(newSelected);
  }

  // ---------------------------------------------------------
  // Group Drag
  // ---------------------------------------------------------
  function startGroupDrag(mouseX: number, mouseY: number) {
    const offsets: { [url: string]: { x: number; y: number } } = {};

    for (const img of images) {
      if (selected.includes(img.url)) {
        offsets[img.url] = { x: img.x - mouseX, y: img.y - mouseY };
      }
    }

    setDragOffset(offsets);
    setDraggingSelected(true);
  }

  function dragSelectedImages(e: React.MouseEvent) {
    const rect = containerRef.current!.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setImages((prev) =>
      prev.map((img) =>
        selected.includes(img.url)
          ? { ...img, x: mouseX + dragOffset[img.url].x, y: mouseY + dragOffset[img.url].y }
          : img
      )
    );
  }

  // ---------------------------------------------------------
  // Render
  // ---------------------------------------------------------
  return (
    <div className="p-6">
      <input type="file" multiple onChange={handleUpload} />

      <div
        ref={containerRef}
        className="relative w-full h-[700px] border bg-white overflow-hidden mt-4"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {images.map((img) => {
          const isSelected = selected.includes(img.url);
          return (
            <img
              key={img.url}
              ref={img.ref}
              src={img.url}
              data-type="img" // important for marquee logic
              className={`absolute object-contain cursor-move transition-all ${
                isSelected ? "border-2 border--500 scale-105" : ""
              }`}
              style={{
                left: img.x,
                top: img.y,
                width: 150,
                height: 150,
                zIndex: isSelected ? 200 : 50,
                boxShadow: isSelected ? "0 8px 20px rgba(0,0,0,0.12)" : undefined,
              }}
              draggable={false}
            />
          );
        })}

        {/* MARQUEE BOX */}
        {marquee.active && (
          <div
            className="absolute border-2 border-blue-400 bg-blue-400/10 pointer-events-none"
            style={{
              left: marquee.x,
              top: marquee.y,
              width: marquee.w,
              height: marquee.h,
            }}
          />
        )}
      </div>
    </div>
  );
}
