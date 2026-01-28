"use client";

import React, { useEffect } from "react";
import { FlipHorizontal, FlipVertical } from "lucide-react";
import SizeControls from "./SizeControls";
import ActionButtons from "./ActionButtons";

export type ImageState = {
  url: string;
  size: { w: number; h: number };
  rotation: number;
  flip: "none" | "horizontal" | "vertical";
  original?: any;
  type?: string;
};

type ImageEditorProps = {
  selectedImage: string | null;
  imageState: Record<string, ImageState>;
  onSelectImage?: (image: ImageState) => void;

  onRotateImage?: (id: string, rotation: number) => void;
  onFlipImage?: (id: string, flip: "none" | "horizontal" | "vertical") => void;

  onDuplicateUploadedImage?: (id: string) => void;
  onRemoveUploadedImage?: (id: string) => void;
  onResetImage?: (id: string) => void;
  onCrop?: (id: string) => void;

  canvasPositions?: Record<string, any>;
  restrictedBox?: { x: number; y: number; w: number; h: number };
  onUpdateImageSize?: (id: string, size: { w: number; h: number }) => void;
  setImageState?: React.Dispatch<React.SetStateAction<Record<string, ImageState>>>;
};

export default function ImageEditor({
  selectedImage,
  imageState,
  onSelectImage,
  onRotateImage,
  onFlipImage,
  onDuplicateUploadedImage,
  onRemoveUploadedImage,
  onResetImage,
  onCrop,
  canvasPositions,
  restrictedBox,
  onUpdateImageSize,
  setImageState,
}: ImageEditorProps) {
  if (!selectedImage) return null;

  const st = imageState[selectedImage];
  if (!st) return null;

  // ------------------- Debug Log -------------------
  useEffect(() => {
    const pos = canvasPositions?.[selectedImage] ?? { x: 0, y: 0, width: st.size.w, height: st.size.h, scale: 1 };
    console.log("📌 ImageEditor render", {
      selectedImage,
      layer: st,
      canvasPosition: pos,
      restrictedBox,
    });
  }, [selectedImage, st, canvasPositions, restrictedBox]);

  const position = canvasPositions?.[selectedImage] ?? {
    x: 0,
    y: 0,
    width: st.size.w ?? 150,
    height: st.size.h ?? 150,
    scale: 1,
  };

  // ------------------- Flip Handler -------------------
  const handleFlip = (direction: "horizontal" | "vertical") => {
    console.log("Flip clicked:", selectedImage, direction);

    // Use the latest state if available
    if (setImageState) {
      setImageState(prev => {
        const current = prev[selectedImage];
        if (!current) return prev;

        const newFlip = current.flip === direction ? "none" : direction;
        console.log("Flipping", selectedImage, "from", current.flip, "to", newFlip);

        return { ...prev, [selectedImage]: { ...current, flip: newFlip } };
      });
      return;
    }

    // fallback to callback
    if (onFlipImage) {
      const newFlip = st.flip === direction ? "none" : direction;
      onFlipImage(selectedImage, newFlip);
    }
  };

  const handleRotate = (rotation: number) => {
    if (!onRotateImage) return;
    onRotateImage(selectedImage, rotation);
  };

  return (
    <div className="p-5 space-y-6 h-full overflow-y-auto bg-white">
      {/* Size Controls */}
      <SizeControls
        selectedImage={selectedImage}
        image={st}
        canvasPositions={{ [selectedImage]: position }}
        restrictedBox={{
          left: restrictedBox?.x ?? 0,
          top: restrictedBox?.y ?? 0,
          width: restrictedBox?.w ?? 150,
          height: restrictedBox?.h ?? 150,
        }}
        onUpdateImageSize={onUpdateImageSize}
        setImageState={setImageState}
      />

      {/* Rotate */}
      <div className="space-y-2">
        <p className="font-semibold text-lg">Rotate</p>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={-180}
            max={180}
            value={st.rotation ?? 0}
            onChange={(e) => handleRotate(Number(e.target.value))}
            className="flex-1"
          />
          <input
            type="number"
            min={-180}
            max={180}
            value={st.rotation ?? 0}
            onChange={(e) => handleRotate(Number(e.target.value))}
            className="w-20 px-2 py-1 border rounded-lg font-mono text-right focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Flip */}
      <div className="space-y-2">
        <p className="font-semibold text-lg">Flip</p>
        <div className="flex gap-3">
          <button
            className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition ${
              st.flip === "horizontal" ? "bg-blue-200" : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => handleFlip("horizontal")}
          >
            <FlipHorizontal size={18} />
            Horizontal
          </button>

          <button
            className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition ${
              st.flip === "vertical" ? "bg-blue-200" : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => handleFlip("vertical")}
          >
            <FlipVertical size={18} />
            Vertical
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <ActionButtons
        selectedImage={selectedImage}
          onDuplicateUploadedImage={onDuplicateUploadedImage}
          onRemoveUploadedImage={onRemoveUploadedImage}
          onResetImage={onResetImage}
          onCrop={onCrop}
              />
    </div>
  );
}
