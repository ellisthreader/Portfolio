"use client";

import { ArrowLeft, FlipHorizontal, FlipVertical } from "lucide-react";
import ImagePreview from "./ImagePreview";
import SizeControls from "./SizeControls";
import ActionButtons from "./ActionButtons";

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

  ...rest
}: any) {
  const st = imageState[selectedImage];
  if (!st) return null;

  return (
    <div className="p-5 space-y-6 h-full overflow-y-auto bg-white">
      {/* Size */}
      <SizeControls
        selectedImage={selectedImage}
        image={st}
        {...rest}
      />

      {/* Rotate */}
      <div className="space-y-2">
        <p className="font-semibold text-lg">Rotate</p>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={-180}
            max={180}
            value={st.rotation}
            onChange={(e) =>
              onRotateImage?.(selectedImage, Number(e.target.value))
            }
            className="flex-1"
          />

          <input
            type="number"
            min={-180}
            max={180}
            value={st.rotation}
            onChange={(e) =>
              onRotateImage?.(selectedImage, Number(e.target.value))
            }
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
              st.flip === "horizontal"
                ? "bg-blue-200"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() =>
              onFlipImage?.(
                selectedImage,
                st.flip === "horizontal" ? "none" : "horizontal"
              )
            }
          >
            <FlipHorizontal size={18} />
            Horizontal
          </button>

          <button
            className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition ${
              st.flip === "vertical"
                ? "bg-blue-200"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() =>
              onFlipImage?.(
                selectedImage,
                st.flip === "vertical" ? "none" : "vertical"
              )
            }
          >
            <FlipVertical size={18} />
            Vertical
          </button>
        </div>
      </div>

      {/* Actions */}
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
