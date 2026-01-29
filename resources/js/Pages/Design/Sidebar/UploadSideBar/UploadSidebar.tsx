"use client";

import { useState, useMemo, useEffect } from "react";
import UploadPanel from "./UploadPanel";
import ImageEditor from "./ImageEditor";
import Crop from "./Crop";

// -------------------- TYPES --------------------
export type ImageState = {
  url: string; // current (possibly cropped) image
  type?: "image" | "text";
  isClipart?: boolean;
  size: { w: number; h: number };
  rotation?: number;
  flip?: "none" | "horizontal" | "vertical";
  crop?: any;

  // ✅ original image is preserved forever
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
  setImageState: React.Dispatch<
    React.SetStateAction<Record<string, ImageState>>
  >;
  onUpload: (url: string) => void;
  recentImages?: string[];
  onSelectImage?: (url: string | null) => void;

  uploadedImages: Record<string, any>;
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
  uploadedImages,
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
  const [sizes, setSizes] = useState<Record<string, { w: number; h: number }>>({});

  // ------------------- Derived layer -------------------
  const layer = selectedImage ? imageState[selectedImage] : null;
  const layerExists = Boolean(layer);

  const imagePropertiesOpen = Boolean(
    selectedImage &&
      layerExists &&
      layer?.type === "image" &&
      !layer?.isClipart
  );

  // ------------------- Debug -------------------
  useEffect(() => {
    console.log("📌 UploadSidebar render", {
      selectedImage,
      layer,
      cropMode,
      imagePropertiesOpen,
    });
  }, [selectedImage, layer, cropMode, imagePropertiesOpen]);

  // ------------------- Filter recent images -------------------
  const uploadOnlyImages = useMemo(
    () => recentImages.filter((uid) => !imageState[uid]?.isClipart),
    [recentImages, imageState]
  );

  // ------------------- IMAGE SELECTION -------------------
  const handleSelectImage = (id: string | null) => {
    setCropMode(false);
    onSelectImage?.(id);
  };

  // ------------------- CROPPING MODE -------------------
  if (cropMode && layerExists && selectedImage) {
    const current = imageState[selectedImage];
    if (!current) return null;

    const originalImageUrl = current.original?.url ?? current.url;

    return (
      <Crop
        originalImageUrl={originalImageUrl}
        initialCrop={current.crop ?? undefined}
        onReplaceCanvasImage={(newUrl, crop) => {
          setImageState((prev) => {
            const existing = prev[selectedImage];
            if (!existing) return prev;

            return {
              ...prev,
              [selectedImage]: {
                ...existing,
                url: newUrl,
                crop,
                original:
                  existing.original ??
                  {
                    url: existing.url,
                    size: existing.size,
                    rotation: existing.rotation,
                    flip: existing.flip,
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
  if (imagePropertiesOpen && layerExists && selectedImage) {
    // ✅ These were missing in your code
    const restrictedBox = layer?.restrictedBox;
    const positions = layer?.canvasPositions ?? {};

    const handleUpdateImageSize = (id: string, w: number, h: number) => {
      setImageState((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          size: { w, h },
        },
      }));
    };

    return (
      <ImageEditor
        selectedImage={selectedImage}
        layer={layer}

        // new props for SizeControls
        restrictedBox={restrictedBox}
        positions={positions}
        handleUpdateImageSize={handleUpdateImageSize}
        setImageState={setImageState}
        setSizes={setSizes}

        onSelectImage={onSelectImage}
        onRotateImage={onRotateImage}
        onFlipImage={onFlipImage}
        onDuplicateUploadedImage={onDuplicateUploadedImage}
        onRemoveUploadedImage={onRemoveUploadedImage}
        onResetImage={onResetImage}
        onCrop={() => setCropMode(true)}
      />
    );
  }

  // ------------------- UPLOAD PANEL -------------------
  return (
    <UploadPanel
      onUpload={onUpload}
      recentImages={uploadOnlyImages}
      imageState={imageState}
      onSelectImage={handleSelectImage}
    />
  );
}
