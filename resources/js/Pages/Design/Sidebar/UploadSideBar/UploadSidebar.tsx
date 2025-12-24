"use client";

import { useState } from "react";
import UploadPanel from "./UploadPanel";
import ImageEditor
 from "./ImageEditor";
import Crop from "./Crop";

export default function UploadSidebar(props: any) {
  const {
    selectedImage,
    imageState,
    setImageState,
  } = props;

  const [cropMode, setCropMode] = useState(false);

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
                original: img.original ?? {
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

  if (selectedImage) {
    return <ImageEditor {...props} onCrop={() => setCropMode(true)} />;
  }

  return <UploadPanel {...props} />;
}
