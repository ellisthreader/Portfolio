"use client";

import { FlipHorizontal, FlipVertical } from "lucide-react";
import SizeControls from "./SizeControls";
import ActionButtons from "./ActionButtons";

export default function ImageEditor({
  selectedImage,
  layer,
  restrictedBox,
  positions,
  handleUpdateImageSize,
  setImageState,
  setSizes,

  onRotateImage,
  onFlipImage,
  onDuplicateUploadedImage,
  onRemoveUploadedImage,
  onResetImage,
  onCrop,

  ...rest
}: any) {
  if (!layer) return null;

  return (
    <div className="p-6 space-y-5 h-full overflow-y-auto relative">
      <SizeControls
        selectedImage={selectedImage}       // currently selected image UID
        image={layer}                        // layer object
        restrictedBox={restrictedBox}        // comes from Canvas props
        canvasPositions={positions}          // from useImagePositions
        onUpdateImageSize={handleUpdateImageSize} // defined above
        setImageState={setImageState}        // comes from Canvas props
        setSizes={setSizes}                  // comes from useImageSizes
      />
      {/* ROTATE */}
      <div className="space-y-2">
        <p className="font-semibold text-lg">Rotate</p>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={-180}
            max={180}
            value={layer.rotation}
            onChange={(e) =>
              onRotateImage?.(selectedImage, Number(e.target.value))
            }
            className="flex-1"
          />

          <input
            type="number"
            min={-180}
            max={180}
            value={layer.rotation}
            onChange={(e) =>
              onRotateImage?.(selectedImage, Number(e.target.value))
            }
            className="w-20 px-2 py-1 border rounded-lg font-mono text-right focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* FLIP */}
      <div className="space-y-2">
        <p className="font-semibold text-lg">Flip</p>
        <div className="flex gap-3">
          <button
            className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition ${
              layer.flip === "horizontal"
                ? "bg-blue-200"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() =>
              onFlipImage?.(
                selectedImage,
                layer.flip === "horizontal" ? "none" : "horizontal"
              )
            }
          >
            <FlipHorizontal size={18} />
            Horizontal
          </button>

          <button
            className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition ${
              layer.flip === "vertical"
                ? "bg-blue-200"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() =>
              onFlipImage?.(
                selectedImage,
                layer.flip === "vertical" ? "none" : "vertical"
              )
            }
          >
            <FlipVertical size={18} />
            Vertical
          </button>
        </div>
      </div>

      {/* ACTIONS */}
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
