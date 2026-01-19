"use client";

import { useState, useMemo } from "react";
import UploadPanel from "./UploadPanel";
import ImageEditor from "./ImageEditor";
import Crop from "./Crop";

type UploadSidebarProps = {
  selectedImage?: string;
  imageState: Record<string, any>;
  setImageState: (fn: (prev: any) => any) => void;

  // UploadPanel props
  onUpload: (url: string) => void;
  recentImages?: string[];
  onSelectImage?: (url: string) => void;
};

export default function UploadSidebar({
  selectedImage,
  imageState,
  setImageState,
  onUpload,
  recentImages = [],
  onSelectImage,
}: UploadSidebarProps) {
  const [cropMode, setCropMode] = useState(false);

  // ✅ FILTER OUT CLIPART
  const uploadOnlyImages = useMemo(
    () => recentImages.filter(uid => !imageState[uid]?.isClipart),
    [recentImages, imageState]
  );

  // ------------------- CROPPING MODE -------------------
  if (cropMode && selectedImage) {
    return (
      <Crop
        selectedImage={imageState[selectedImage]?.url ?? selectedImage}
        originalImage={imageState[selectedImage]?.original?.url}
        initialCrop={imageState[selectedImage]?.crop}
        onReplaceCanvasImage={(newURL, crop) => {
          setImageState((prev: any) => {
            const img = prev[selectedImage];
            if (!img) return prev;

            return {
              ...prev,
              [selectedImage]: {
                ...img,
                url: newURL,
                crop,
                original:
                  img.original ?? {
                    url: img.url,
                    size: img.size,
                    rotation: img.rotation,
                    flip: img.flip,
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
  if (selectedImage) {
    return (
      <ImageEditor
        selectedImage={selectedImage}
        imageState={imageState}
        setImageState={setImageState}
        onCrop={() => setCropMode(true)}
      />
    );
  }

  // ------------------- DEFAULT: UPLOAD PANEL -------------------
  return (
    <UploadPanel
      onUpload={onUpload}
      recentImages={uploadOnlyImages} // ✅ FIX HERE
      onSelectImage={onSelectImage}
    />
  );
}
  