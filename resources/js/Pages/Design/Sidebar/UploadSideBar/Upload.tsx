"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  UploadCloud, Image as ImageIcon, ArrowLeft, RotateCw, RefreshCw, Trash2, Copy, 
  FlipHorizontal, FlipVertical 
} from "lucide-react";

import Crop from "./Crop"; // <-- new: external crop component

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

const [originalImageMap, setOriginalImageMap] = useState<Record<string, string>>({});
const [cropStateMap, setCropStateMap] = useState<Record<string, any>>({});


  // ---------- Crop mode state (kept) ----------
  const [cropMode, setCropMode] = useState(false);

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
      console.log("Loaded image state:", st);
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
      console.log("Loaded new image natural size:", img.width, img.height);
    };

    return () => { cancelled = true; };
  }, [selectedImage, imageState]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    console.log("Uploading file:", file.name, url);
    onUpload(url);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    console.log("Dropped file:", file.name, url);
    onUpload(url);
  };

  const handleRotateChange = (angle: number) => {
    console.log("Rotate change:", angle);
    setRotation(angle);
    if (selectedImage) onRotateImage?.(selectedImage, angle);
  };

  const handleWidthChange = (valueInches: number) => {
    const newSize = { width: valueInches, height: imageSizeInches.height };
    setImageSizeInches(newSize);
    if (selectedImage) {
      console.log("Width changed:", newSize);
      onUpdateImageSize?.(selectedImage, Math.round(newSize.width * 96), Math.round(newSize.height * 96));
    }
  };

  const handleHeightChange = (valueInches: number) => {
    const newSize = { width: imageSizeInches.width, height: valueInches };
    setImageSizeInches(newSize);
    if (selectedImage) {
      console.log("Height changed:", newSize);
      onUpdateImageSize?.(selectedImage, Math.round(newSize.width * 96), Math.round(newSize.height * 96));
    }
  };

  const handleDuplicate = () => {
    if (selectedImage) {
      console.log("Duplicate image:", selectedImage);
      onDuplicateUploadedImage?.(selectedImage);
    }
  };

  // ------------------ FIXED FLIP LOGIC ------------------
  const handleFlip = (type: "horizontal" | "vertical") => {
    if (!selectedImage) return;

    let newFlip: "none" | "horizontal" | "vertical" = type;

    // Only flip to selected type, do not toggle automatically back
    setFlip(newFlip);
    console.log(`Flip ${type} clicked. Setting flip to:`, newFlip);
    onFlipImage?.(selectedImage, newFlip);
  };

  const handleReset = () => {
    if (!selectedImage) return;
    console.log("Reset image:", selectedImage);
    onResetImage?.(selectedImage);
    setRotation(0);
    setImageSizeInches({ width: 0, height: 0 });
    setFlip("none");
  };

  const handleRemove = () => {
    if (!selectedImage) return;
    console.log("Remove image:", selectedImage);
    onRemoveUploadedImage?.(selectedImage);
    onSelectImage?.(null);
  };

  // --- Removed internal crop drag/canvas logic (replaced with external Crop component) ---

  // If crop mode active and an image is selected -> render external Crop component
  if (cropMode && selectedImage) {
    return (
      <Crop
        selectedImage={selectedImage}
        originalImage={originalImageMap[selectedImage]}
        initialCrop={cropStateMap[selectedImage]}
        onReplaceCanvasImage={(newURL, crop) => {
          if (!originalImageMap[selectedImage]) {
            setOriginalImageMap(prev => ({
              ...prev,
              [newURL]: selectedImage,
            }));
          } else {
            setOriginalImageMap(prev => ({
              ...prev,
              [newURL]: originalImageMap[selectedImage],
            }));
          }

          setCropStateMap(prev => ({ ...prev, [newURL]: crop }));

          const st = imageState[selectedImage];
          onRemoveUploadedImage?.(selectedImage);
          onUpload(newURL);

          if (st) {
            onUpdateImageSize?.(newURL, st.size.w, st.size.h);
            onRotateImage?.(newURL, st.rotation);
            onFlipImage?.(newURL, st.flip);
          }

          onSelectImage?.(newURL);
        }}
        onClose={() => setCropMode(false)}
      />
    );
  }


  // ---------- Normal UI when selectedImage is present ----------
  if (selectedImage) {
    const scaleX = flip === "horizontal" ? -1 : 1;
    const scaleY = flip === "vertical" ? -1 : 1;

    return (
      <div className="p-5 space-y-6 h-full overflow-y-auto bg-white shadow-lg rounded-xl">
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
            className="max-w-full max-h-full object-contain transition-transform duration-200"
            style={{ transform: `rotate(${rotation}deg) scaleX(${scaleX}) scaleY(${scaleY})` }}
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

        {/* Action Buttons */}
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

          {/* Flip Buttons */}
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

          {/* Rotate */}
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
              className="w-16 px-2 py-1 border rounded-lg font-mono text-right focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            className="w-full py-3 bg-red-100 text-red-700 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-red-200 transition"
            onClick={handleReset}
          >
            <RefreshCw size={18} /> Reset To Original
          </button>

          <button
            className="w-full py-3 bg-red-200 text-red-700 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-red-300 transition"
            onClick={handleRemove}
          >
            <Trash2 size={18} /> Delete Image
          </button>
        </div>
      </div>
    );
  }

  // Default Upload Panel
  return (
    <div className="p-5 space-y-6 h-full overflow-y-auto bg-white shadow-lg rounded-xl">
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
