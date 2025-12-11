"use client";

import React, { useState } from "react";
import UploadSidebar from "./UploadSidebar";
import Canvas from "./Canvas";

type ImageState = {
  url: string;
  size: { w: number; h: number }; // pixels
  rotation: number;
  flip: "none" | "horizontal";
};

export default function DesignCanvasWrapper() {
  const [uploadedImagesState, setUploadedImagesState] = useState<Record<string, ImageState>>({});

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Upload adds a new entry where the UID is the url (option A)
  const handleUpload = (url: string) => {
    const id = url;
    setUploadedImagesState((prev) => ({
      ...prev,
      [id]: { url, size: { w: 150, h: 150 }, rotation: 0, flip: "none" },
    }));
    setSelectedImage(id);
  };

  const handleUpdateImageSize = (uid: string, w: number, h: number) => {
    setUploadedImagesState((prev) => {
      if (!prev[uid]) return prev;
      return {
        ...prev,
        [uid]: { ...prev[uid], size: { w, h } },
      };
    });
  };

  const handleRotateImage = (uid: string, rotation: number) => {
    setUploadedImagesState((prev) => {
      if (!prev[uid]) return prev;
      return {
        ...prev,
        [uid]: { ...prev[uid], rotation },
      };
    });
  };

  const handleFlipImage = (uid: string) => {
    setUploadedImagesState((prev) => {
      if (!prev[uid]) return prev;
      return {
        ...prev,
        [uid]: { ...prev[uid], flip: prev[uid].flip === "none" ? "horizontal" : "none" },
      };
    });
  };

  const handleRemoveUploadedImage = (uid: string) => {
    setUploadedImagesState((prev) => {
      const copy = { ...prev };
      delete copy[uid];
      return copy;
    });
    if (selectedImage === uid) setSelectedImage(null);
  };

  const handleDuplicateUploadedImage = (uid: string) => {
    const original = uploadedImagesState[uid];
    if (!original) return;
    // Keep URL-as-UID pattern but append suffix
    const newUid = `${uid}#dup-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    setUploadedImagesState((prev) => ({
      ...prev,
      [newUid]: { ...original }, // copy original metadata; url stays the same
    }));
    setSelectedImage(newUid);
  };

  const handleResetImage = (uid: string) => {
    // Reset to defaults (you can adapt this to store "original" metadata if desired)
    setUploadedImagesState((prev) => {
      if (!prev[uid]) return prev;
      return {
        ...prev,
        [uid]: { ...prev[uid], size: { w: 150, h: 150 }, rotation: 0, flip: "none" },
      };
    });
  };

  return (
    <div className="flex h-full">
      <UploadSidebar
        onUpload={handleUpload}
        recentImages={Object.values(uploadedImagesState).map((img) => img.url)}
        selectedImage={selectedImage}
        onSelectImage={setSelectedImage}
        onDuplicateUploadedImage={handleDuplicateUploadedImage}
        onRemoveUploadedImage={handleRemoveUploadedImage}
        onUpdateImageSize={handleUpdateImageSize}
        onRotateImage={handleRotateImage}
        onFlipImage={handleFlipImage}
        onResetImage={handleResetImage}
        // Pass full state so UploadSidebar can read current pixel sizes & rotation if needed
        imageState={uploadedImagesState}
      />

      <Canvas
        mainImage="/placeholder.png"
        uploadedImages={Object.keys(uploadedImagesState)}
        displayImages={Object.keys(uploadedImagesState)}
        onSelectImage={setSelectedImage}
        onUploadedImageSelect={setSelectedImage}
        selectedImage={selectedImage}
        onRemoveUploadedImage={handleRemoveUploadedImage}
        onDuplicateUploadedImage={handleDuplicateUploadedImage}
        onUpdateImageSize={handleUpdateImageSize}
        onRotateImage={handleRotateImage}
        onFlipImage={handleFlipImage}
        imageState={uploadedImagesState}
        restrictedBox={{ left: 100, top: 100, width: 500, height: 500 }}
        canvasRef={React.createRef<HTMLDivElement>()}
      />
    </div>
  );
}
