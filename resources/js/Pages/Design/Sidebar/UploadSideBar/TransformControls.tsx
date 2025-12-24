import { FlipHorizontal, FlipVertical } from "lucide-react";

export default function TransformControls({
  image,
  onRotateImage,
  onFlipImage,
  selectedImage,
}: any) {
  return (
    <div className="space-y-3">
      <input
        type="range"
        min={-180}
        max={180}
        value={image.rotation}
        onChange={(e) =>
          onRotateImage(selectedImage, Number(e.target.value))
        }
      />

      <div className="flex gap-2">
        <button onClick={() => onFlipImage(selectedImage, "horizontal")}>
          <FlipHorizontal />
        </button>
        <button onClick={() => onFlipImage(selectedImage, "vertical")}>
          <FlipVertical />
        </button>
      </div>
    </div>
  );
}
