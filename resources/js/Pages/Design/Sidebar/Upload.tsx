"use client";

import React, { useState, useEffect } from "react";
import { UploadCloud, Image as ImageIcon, ArrowLeft } from "lucide-react";

type ImageState = {
  url: string;
  size: { w: number; h: number }; // pixels
  rotation: number;
  flip: "none" | "horizontal";
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
  onFlipImage?: (url: string) => void;
  onResetImage?: (url: string) => void;
  imageState?: Record<string, ImageState>;
}) {
  // UI state stored in inches for the inputs
  const [imageSizeInches, setImageSizeInches] = useState({ width: 0, height: 0 });
  const [rotation, setRotation] = useState(0);

  // ---------------------- FIXED USEEFFECT ----------------------
  useEffect(() => {
    if (!selectedImage) {
      setImageSizeInches({ width: 0, height: 0 });
      setRotation(0);
      return;
    }

    // Use current saved imageState if available
    const st = imageState[selectedImage];
    if (st) {
      setImageSizeInches({
        width: Number((st.size.w / 96).toFixed(2)),
        height: Number((st.size.h / 96).toFixed(2)),
      });

      setRotation(st.rotation ?? 0);
      return;
    }

    // FALLBACK: load image ONLY ONCE per selectedImage
    let cancelled = false;

    const img = new Image();
    img.src = selectedImage;

    img.onload = () => {
      if (cancelled) return;

      const widthInches = Number((img.width / 96).toFixed(2));
      const heightInches = Number((img.height / 96).toFixed(2));

      setImageSizeInches({ width: widthInches, height: heightInches });
      setRotation(0);
    };

    return () => {
      cancelled = true;
    };
  }, [selectedImage]); // <-- IMPORTANT: remove imageState to prevent infinite loop

  // ---------------------- File Upload ----------------------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    onUpload(url);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    onUpload(url);
  };

  // ---------------------- Image Controls ----------------------
  const handleRotateChange = (angle: number) => {
    setRotation(angle);
    if (selectedImage) onRotateImage?.(selectedImage, angle);
  };

  const handleWidthChange = (valueInches: number) => {
    const newSize = { width: valueInches, height: imageSizeInches.height };
    setImageSizeInches(newSize);

    if (selectedImage) {
      const pxW = Math.round(newSize.width * 96);
      const pxH = Math.round(newSize.height * 96);
      onUpdateImageSize?.(selectedImage, pxW, pxH);
    }
  };

  const handleHeightChange = (valueInches: number) => {
    const newSize = { width: imageSizeInches.width, height: valueInches };
    setImageSizeInches(newSize);

    if (selectedImage) {
      const pxW = Math.round(newSize.width * 96);
      const pxH = Math.round(newSize.height * 96);
      onUpdateImageSize?.(selectedImage, pxW, pxH);
    }
  };

  const handleDuplicate = () => {
    if (selectedImage) onDuplicateUploadedImage?.(selectedImage);
  };

  const handleFlip = () => {
    if (selectedImage) onFlipImage?.(selectedImage);
  };

  const handleReset = () => {
    if (!selectedImage) return;

    onResetImage?.(selectedImage);
    setRotation(0);
    setImageSizeInches({ width: 0, height: 0 });
  };

  const handleRemove = () => {
    if (!selectedImage) return;

    onRemoveUploadedImage?.(selectedImage);
    onSelectImage?.(null);
  };

  // ---------------------- Photo Properties Panel ----------------------
  if (selectedImage) {
    return (
      <div className="p-5 space-y-6 h-full overflow-y-auto">
        <button
          onClick={() => onSelectImage?.(null)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Back to uploads
        </button>

        <h2 className="text-2xl font-bold">Photo Properties</h2>

        <div className="w-full rounded-xl overflow-hidden border h-48 bg-gray-100 flex items-center justify-center">
          <img
            src={selectedImage}
            className="max-w-full max-h-full object-contain"
            style={{ rotate: `${rotation}deg` }}
            alt="preview"
          />
        </div>

        {/* Size Controls */}
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
                className="w-full mt-1 border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Height (inches)</label>
              <input
                type="number"
                step={0.1}
                value={imageSizeInches.height}
                onChange={(e) => handleHeightChange(Number(e.target.value))}
                className="w-full mt-1 border rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            className="w-full py-3 bg-gray-200 rounded-xl font-medium"
            onClick={handleDuplicate}
          >
            Duplicate
          </button>

          <button
            className="w-full py-3 bg-gray-200 rounded-xl font-medium"
            onClick={() => alert("Crop feature coming soon")}
          >
            Crop
          </button>

          <button
            className="w-full py-3 bg-gray-200 rounded-xl font-medium"
            onClick={handleFlip}
          >
            Flip
          </button>

          <div>
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

          <button
            className="w-full py-3 bg-red-100 text-red-700 rounded-xl font-medium"
            onClick={handleReset}
          >
            Reset To Original
          </button>

          <button
            className="w-full py-3 bg-red-200 text-red-700 rounded-xl font-medium"
            onClick={handleRemove}
          >
            Delete Image
          </button>
        </div>
      </div>
    );
  }

  // ---------------------- Default Upload Panel ----------------------
  return (
    <div className="p-5 space-y-6 h-full overflow-y-auto">
      <h2 className="text-xl font-bold">Upload Images</h2>
      <p className="text-gray-500">Add your own images to the canvas.</p>

      <label className="w-full flex items-center gap-3 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl border border-gray-300 transition shadow-sm">
        <UploadCloud size={22} />
        <span className="font-medium">Browse your computer</span>
        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </label>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="w-full h-36 border-2 border-dashed border-gray-400 rounded-xl flex flex-col items-center justify-center text-gray-600 bg-gray-50 hover:bg-gray-100 transition"
      >
        <ImageIcon size={30} className="mb-2 opacity-70" />
        <p className="text-sm">Or drag and drop</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-900 text-sm shadow-sm">
        <p className="font-semibold mb-1">Image Requirements</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>High-resolution images (300 DPI+) look best</li>
          <li>Maximum file size: 25MB</li>
        </ul>
      </div>

      <div className="pb-4">
        <h3 className="text-lg font-semibold mb-2">Recent Uploads</h3>
        {recentImages.length === 0 ? (
          <p className="text-gray-500 text-sm">No uploads yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 pr-1">
            {recentImages.map((url, i) => (
              <div
                key={i}
                onClick={() => onSelectImage?.(url)}
                className="w-full h-32 rounded-lg overflow-hidden border cursor-pointer hover:ring-2 hover:ring-blue-400 transition"
              >
                <img
                  src={url}
                  alt={`recent-${i}`}
                  className="w-full h-full object-contain bg-gray-100"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
