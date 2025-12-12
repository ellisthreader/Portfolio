"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  UploadCloud,
  Image as ImageIcon,
  ArrowLeft,
  RotateCw,
  RefreshCw,
  Trash2,
  Copy,
  FlipHorizontal,
  FlipVertical,
} from "lucide-react";

type ImageState = {
  url: string;
  size: { w: number; h: number };
  rotation: number;
  flip: "none" | "horizontal" | "vertical";
};

export default function UploadSidebar({
  onUpload,
  recentImages = [],
  selectedImage,
  onSelectImage,
  onDuplicateUploadedImage,
  onRemoveUploadedImage,
  onUpdateImageSize,
  onRotateImage,
  onFlipImage,
  onResetImage,
  imageState = {},
}: {
  onUpload: (url: string) => void;
  recentImages?: string[];
  selectedImage?: string | null;
  onSelectImage?: (url: string | null) => void;
  onDuplicateUploadedImage?: (url: string) => void;
  onRemoveUploadedImage?: (url: string) => void;
  onUpdateImageSize?: (url: string, width: number, height: number) => void;
  onRotateImage?: (url: string, angle: number) => void;
  onFlipImage?: (url: string, type: "none" | "horizontal" | "vertical") => void;
  onResetImage?: (url: string) => void;
  imageState?: Record<string, ImageState>;
}) {
  const [imageSizeInches, setImageSizeInches] = useState({ width: 0, height: 0 });
  const [rotation, setRotation] = useState(0);
  const [flip, setFlip] = useState<"none" | "horizontal" | "vertical">("none");

  const [cropMode, setCropMode] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const cropRef = useRef<HTMLDivElement | null>(null);

  const [crop, setCrop] = useState({ left: 40, top: 40, width: 200, height: 200 });

  const dragState = useRef({
    dragging: false,
    handle: null as string | null,
    startX: 0,
    startY: 0,
    startCrop: null as any,
  });

  useEffect(() => {
    if (!selectedImage) {
      setImageSizeInches({ width: 0, height: 0 });
      setRotation(0);
      setFlip("none");
      return;
    }

    const st = imageState[selectedImage];
    if (st) {
      setImageSizeInches({
        width: Number((st.size.w / 96).toFixed(2)),
        height: Number((st.size.h / 96).toFixed(2)),
      });
      setRotation(st.rotation ?? 0);
      setFlip(st.flip ?? "none");
      return;
    }

    let cancelled = false;
    const img = new Image();
    img.src = selectedImage;
    img.onload = () => {
      if (cancelled) return;
      setImageSizeInches({
        width: Number((img.width / 96).toFixed(2)),
        height: Number((img.height / 96).toFixed(2)),
      });
      setRotation(0);
      setFlip("none");
    };

    return () => {
      cancelled = true;
    };
  }, [selectedImage, imageState]);

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onUpload(url);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onUpload(url);
  };

  const handleRotateChange = (angle: number) => {
    setRotation(angle);
    if (selectedImage) onRotateImage?.(selectedImage, angle);
  };

  const handleWidthChange = (valueInches: number) => {
    const newSize = { width: valueInches, height: imageSizeInches.height };
    setImageSizeInches(newSize);
    if (selectedImage)
      onUpdateImageSize?.(
        selectedImage,
        Math.round(newSize.width * 96),
        Math.round(newSize.height * 96)
      );
  };

  const handleHeightChange = (valueInches: number) => {
    const newSize = { width: imageSizeInches.width, height: valueInches };
    setImageSizeInches(newSize);
    if (selectedImage)
      onUpdateImageSize?.(
        selectedImage,
        Math.round(newSize.width * 96),
        Math.round(newSize.height * 96)
      );
  };

  const handleDuplicate = () => {
    if (selectedImage) onDuplicateUploadedImage?.(selectedImage);
  };

  const handleFlip = (type: "horizontal" | "vertical") => {
    if (!selectedImage) return;
    setFlip(type);
    onFlipImage?.(selectedImage, type);
  };

  const handleReset = () => {
    if (!selectedImage) return;
    onResetImage?.(selectedImage);
    setRotation(0);
    setImageSizeInches({ width: 0, height: 0 });
    setFlip("none");
  };

  const handleRemove = () => {
    if (!selectedImage) return;
    onRemoveUploadedImage?.(selectedImage);
    onSelectImage?.(null);
  };

  const startDrag = (e: any, handle: string) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

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
    if (!dragState.current.dragging) return;

    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    const handle = dragState.current.handle;
    const startCrop = dragState.current.startCrop;

    if (!handle || !startCrop) return;

    let newCrop = { ...startCrop };

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

  const computeRenderedImageRect = () => {
    const img = imgRef.current;
    if (!img || !img.parentElement) return null;

    const container = img.parentElement as HTMLElement;
    const containerRect = container.getBoundingClientRect();

    if (!img.naturalWidth || !img.naturalHeight) return null;

    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;
    const naturalRatio = naturalW / naturalH;

    const containerW = containerRect.width;
    const containerH = containerRect.height;
    const containerRatio = containerW / containerH;

    let displayedW: number;
    let displayedH: number;

    if (naturalRatio > containerRatio) {
      displayedW = containerW;
      displayedH = containerW / naturalRatio;
    } else {
      displayedH = containerH;
      displayedW = containerH * naturalRatio;
    }

    const offsetX = (containerW - displayedW) / 2;
    const offsetY = (containerH - displayedH) / 2;

    return { left: offsetX, top: offsetY, width: displayedW, height: displayedH };
  };

  useEffect(() => {
    if (!cropMode) return;

    const applyInitialCrop = () => {
      const rect = computeRenderedImageRect();
      if (!rect) return;

      setCrop({
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      });
    };

    const img = imgRef.current;
    if (img && img.naturalWidth) {
      applyInitialCrop();
      return;
    }

    const currImg = imgRef.current;
    const onLoad = () => applyInitialCrop();
    currImg?.addEventListener("load", onLoad);

    return () => currImg?.removeEventListener("load", onLoad);
  }, [cropMode, selectedImage]);

  const applyCrop = () => {
    if (!imgRef.current || !cropRef.current) return;

    const img = imgRef.current;
    const cropBox = cropRef.current;

    const container = img.parentElement!;
    const containerRect = container.getBoundingClientRect();
    const cropRect = cropBox.getBoundingClientRect();

    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;
    const naturalRatio = naturalW / naturalH;

    const containerW = containerRect.width;
    const containerH = containerRect.height;
    const containerRatio = containerW / containerH;

    let displayedW, displayedH;

    if (naturalRatio > containerRatio) {
      displayedW = containerW;
      displayedH = containerW / naturalRatio;
    } else {
      displayedH = containerH;
      displayedW = containerH * naturalRatio;
    }

    const offsetX = (containerW - displayedW) / 2;
    const offsetY = (containerH - displayedH) / 2;

    const scaleX = naturalW / displayedW;
    const scaleY = naturalH / displayedH;

    const sx = (cropRect.left - (containerRect.left + offsetX)) * scaleX;
    const sy = (cropRect.top - (containerRect.top + offsetY)) * scaleY;
    const sWidth = cropRect.width * scaleX;
    const sHeight = cropRect.height * scaleY;

    const safeSX = Math.max(0, Math.min(naturalW, sx));
    const safeSY = Math.max(0, Math.min(naturalH, sy));
    const safeSW = Math.max(1, Math.min(naturalW - safeSX, sWidth));
    const safeSH = Math.max(1, Math.min(naturalH - safeSY, sHeight));

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(safeSW);
    canvas.height = Math.round(safeSH);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(img, safeSX, safeSY, safeSW, safeSH, 0, 0, canvas.width, canvas.height);

    const newURL = canvas.toDataURL("image/png");

    onUpload(newURL);
    setCropMode(false);
    onSelectImage?.(newURL);
  };

  if (cropMode && selectedImage) {
    return (
      <div className="p-5 h-full flex flex-col space-y-4 bg-white shadow-lg rounded-xl">
        <button
          onClick={() => setCropMode(false)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <h2 className="text-2xl font-bold">Crop</h2>

        <div
          className="relative w-full border rounded-xl bg-black/5 overflow-hidden"
          style={{ height: "70%" }}
        >
          <img
            ref={imgRef}
            src={selectedImage}
            className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
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
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="border border-white/40" />
              ))}
            </div>

            {(["nw", "ne", "sw", "se"] as const).map((pos) => (
              <div
                key={pos}
                onMouseDown={(e) => startDrag(e, pos)}
                className="absolute w-4 h-4 bg-white rounded-full border border-black cursor-pointer"
                style={{
                  top: pos.includes("n") ? -6 : "auto",
                  bottom: pos.includes("s") ? -6 : "auto",
                  left: pos.includes("w") ? -6 : "auto",
                  right: pos.includes("e") ? -6 : "auto",
                }}
              />
            ))}

            {(["n", "s", "w", "e"] as const).map((pos) => (
              <div
                key={pos}
                onMouseDown={(e) => startDrag(e, pos)}
                className="absolute bg-white border border-black cursor-pointer"
                style={{
                  width: pos === "n" || pos === "s" ? "30%" : "6px",
                  height: pos === "w" || pos === "e" ? "30%" : "6px",
                  top: pos === "n" ? -3 : pos === "s" ? "auto" : "35%",
                  bottom: pos === "s" ? -3 : "auto",
                  left: pos === "w" ? -3 : pos === "e" ? "auto" : "35%",
                  right: pos === "e" ? -3 : "auto",
                  borderRadius: "3px",
                }}
              />
            ))}
          </div>
        </div>

        <div className="mt-auto space-y-3">
          <button
            onClick={applyCrop}
            className="w-full py-3 bg-blue-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-600 transition"
          >
            Apply Crop
          </button>
        </div>
      </div>
    );
  }

  if (selectedImage) {
    const scaleX = flip === "horizontal" ? -1 : 1;
    const scaleY = flip === "vertical" ? -1 : 1;

    return (
      <div className="p-5 space-y-6 h-full overflow-y-auto bg-white shadow-lg rounded-xl">
        <button
          onClick={() => onSelectImage?.(null)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} /> Back to uploads
        </button>

        <h2 className="text-2xl font-bold">Photo Properties</h2>

        <div className="w-full rounded-xl overflow-hidden border h-48 bg-gray-100 flex items-center justify-center">
          <img
            src={selectedImage}
            className="max-w-full max-h-full object-contain transition-transform duration-200"
            style={{ transform: `rotate(${rotation}deg) scaleX(${scaleX}) scaleY(${scaleY})` }}
          />
        </div>

        <div>
          <p className="font-semibold text-lg mb-2">Upload Size</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Width (inches)</label>
              <input
                type="number"
                step={0.1}
                value={imageSizeInches.width}
                onChange={(e) => handleWidthChange(Number(e.target.value))}
                className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Height (inches)</label>
              <input
                type="number"
                step={0.1}
                value={imageSizeInches.height}
                onChange={(e) => handleHeightChange(Number(e.target.value))}
                className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            className="w-full py-3 bg-gray-200 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-300 transition"
            onClick={handleDuplicate}
          >
            <Copy size={18} /> Duplicate
          </button>

          <button
            className="w-full py-3 bg-gray-200 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-300 transition"
            onClick={() => setCropMode(true)}
          >
            <RotateCw size={18} /> Crop
          </button>

          <div className="flex gap-3">
            <button
              className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
                flip === "horizontal" ? "bg-blue-200" : "bg-gray-200 hover:bg-gray-300"
              } transition`}
              onClick={() => handleFlip("horizontal")}
            >
              <FlipHorizontal size={18} /> Flip Horizontal
            </button>

            <button
              className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
                flip === "vertical" ? "bg-blue-200" : "bg-gray-200 hover:bg-gray-300"
              } transition`}
              onClick={() => handleFlip("vertical")}
            >
              <FlipVertical size={18} /> Flip Vertical
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="font-semibold mb-1">Rotate</p>
              <input
                type="range"
                min={-180}
                max={180}
                value={rotation}
                onChange={(e) => handleRotateChange(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <input
              type="number"
              min={-180}
              max={180}
              value={rotation}
              onChange={(e) => handleRotateChange(Number(e.target.value))}
              className="w-16 px-2 py-1 border rounded-lg font-mono text-right focus:ring-
