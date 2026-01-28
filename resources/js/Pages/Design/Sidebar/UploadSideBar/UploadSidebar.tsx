"use client";

import { useState, useMemo, useEffect } from "react";
import UploadPanel from "./UploadPanel";
import ImageEditor from "./ImageEditor";
import Crop from "./Crop";

// -------------------- TYPES --------------------
export type ImageState = {
  url: string;
  type?: "image" | "text";
  isClipart?: boolean;
  size: { w: number; h: number };
  rotation?: number;
  flip?: "none" | "horizontal" | "vertical";
  crop?: any;
  original?: {
    url: string;
    size: { w: number; h: number };
    rotation?: number;
    flip?: "none" | "horizontal" | "vertical";
  };
  canvasPositions?: Record<string, any>;
  restrictedBox?: { x: number; y: number; w: number; h: number };
};

type UploadSidebarProps = {
  selectedImage?: string | null;
  imageState: Record<string, ImageState>;
  setImageState: React.Dispatch<React.SetStateAction<Record<string, ImageState>>>;
  onUpload: (url: string) => void;
  recentImages?: string[];
  onSelectImage?: (url: string | null) => void;

  // ---------------- Handlers for Action Buttons ----------------
  onDuplicateUploadedImage?: (id: string) => void;
  onRemoveUploadedImage?: (id: string) => void;
  onResetImage?: (id: string) => void;
  onRotateImage?: (id: string, rotation: number) => void;
  onFlipImage?: (id: string, flip: "none" | "horizontal" | "vertical") => void;
};

// -------------------- COMPONENT --------------------
export default function UploadSidebar({
  selectedImage,
  imageState,
  setImageState,
  onUpload,
  recentImages = [],
  onSelectImage,
  onDuplicateUploadedImage,
  onRemoveUploadedImage,
  onResetImage,
  onRotateImage,
  onFlipImage,
}: UploadSidebarProps) {
  const [cropMode, setCropMode] = useState(false);

  // ------------------- Debug -------------------
  useEffect(() => {
    const layer = selectedImage ? imageState[selectedImage] : null;
    console.log("📌 UploadSidebar render", { selectedImage, layer });
  }, [selectedImage, imageState]);

  // ------------------- Derived layer -------------------
  const layer = selectedImage ? imageState[selectedImage] : null;
  const layerExists = !!layer;

  // ------------------- Filter recent images -------------------
  const uploadOnlyImages = useMemo(
    () => recentImages.filter((uid) => !imageState[uid]?.isClipart),
    [recentImages, imageState]
  );

  // ------------------- Handle image resizing -------------------
  const handleUpdateImageSize = (id: string, size: { w: number; h: number }) => {
    setImageState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        size,
      },
    }));
  };

  // ------------------- CROPPING MODE -------------------
  if (cropMode && layerExists) {
    return (
      <Crop
        selectedImage={layer?.url ?? selectedImage}
        originalImage={layer?.original?.url}
        initialCrop={layer?.crop}
        onReplaceCanvasImage={(newURL, crop) => {
          setImageState((prev) => {
            const current = prev[selectedImage!];
            if (!current) return prev;

            return {
              ...prev,
              [selectedImage!]: {
                ...current,
                url: newURL,
                crop,
                original:
                  current.original ?? {
                    url: current.url,
                    size: current.size,
                    rotation: current.rotation,
                    flip: current.flip,
                  },
              },
            };
          });
          setCropMode(false);
        }}
        onClose={() => setCropMode(false)}
      />
    );
  }

  // ------------------- IMAGE EDITOR -------------------
  if (layerExists && selectedImage) {
    return (
      <ImageEditor
        selectedImage={selectedImage}
        imageState={imageState}
        setImageState={setImageState}
        onUpdateImageSize={handleUpdateImageSize}
        onCrop={() => setCropMode(true)}
        canvasPositions={layer?.canvasPositions}
        restrictedBox={layer?.restrictedBox}

        // ---------------- Action Buttons ----------------
        onDuplicateUploadedImage={onDuplicateUploadedImage}
        onRemoveUploadedImage={onRemoveUploadedImage}
        onResetImage={onResetImage}
        onRotateImage={onRotateImage}
        onFlipImage={onFlipImage}
      />
    );
  }

  // ------------------- UPLOAD PANEL -------------------
  return (
    <UploadPanel
      onUpload={onUpload}
      recentImages={uploadOnlyImages}
      imageState={imageState}
      onSelectImage={onSelectImage}
    />
  );
}
  