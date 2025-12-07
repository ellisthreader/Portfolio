="use client";

import React, { useState, useRef, useEffect } from "react";

interface ImageMoveProps {
  uploadedImages: string[];
  mainImage: string;
  setMainImage: (url: string) => void;
  productImages: string[];
  safeName: string;
}

interface PositionedImage {
  url: string;
  x: number;
  y: number;
}

export default function ImageMove({ uploadedImages, mainImage, setMainImage, productImages, safeName }: ImageMoveProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [positionedImages, setPositionedImages] = useState<PositionedImage[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const { width, height } = canvasRef.current.getBoundingClientRect();
    setCanvasSize({ width, height });

    setPositionedImages(uploadedImages.map((url) => ({
      url,
      x: width * 0.37 + 10,
      y: height * 0.15 + 10,
    })));
  }, [uploadedImages]);

  const handleMouseDown = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex(index);
    const startX = e.clientX;
    const startY = e.clientY;
    const startPos = { x: positionedImages[index].x, y: positionedImages[index].y };

    const restrictedBox = {
      x: canvasSize.width * 0.37,
      y: canvasSize.height * 0.15,
      width: canvasSize.width * 0.25,
      height: canvasSize.height * 0.6,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      setPositionedImages((prev) => {
        const copy = [...prev];
        const img = copy[index];

        let newX = startPos.x + (moveEvent.clientX - startX);
        let newY = startPos.y + (moveEvent.clientY - startY);

        // Restrict inside box
        newX = Math.min(Math.max(newX, restrictedBox.x), restrictedBox.x + restrictedBox.width - 50);
        newY = Math.min(Math.max(newY, restrictedBox.y), restrictedBox.y + restrictedBox.height - 50);

        copy[index] = { ...img, x: newX, y: newY };
        return copy;
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div ref={canvasRef} className="w-full h-full relative">
      {/* Main product image */}
      <img src={mainImage} alt={safeName} className="max-w-full max-h-full object-contain absolute top-0 left-0" />

      {/* Small restricted box */}
      {canvasSize.width > 0 && (
        <div
          className="absolute border-2 border-dashed border-blue-500 pointer-events-none"
          style={{
            left: canvasSize.width * 0.37,
            top: canvasSize.height * 0.15,
            width: canvasSize.width * 0.25,
            height: canvasSize.height * 0.6,
          }}
        />
      )}

      {/* Uploaded images overlay */}
      {positionedImages.map((img, i) => (
        <img
          key={i}
          src={img.url}
          alt={`Uploaded ${i}`}
          onMouseDown={(e) => handleMouseDown(i, e)}
          className={`absolute top-0 left-0 max-w-[200px] max-h-[200px] object-contain cursor-move ${
            selectedImageIndex === i ? "border-2 border-white" : ""
          }`}
          style={{ transform: `translate(${img.x}px, ${img.y}px)` }}
        />
      ))}
    </div>
  );
}
