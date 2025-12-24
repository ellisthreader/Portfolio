import {
  Copy,
  RotateCw,
  RefreshCw,
  Trash2,
} from "lucide-react";

export default function ActionButtons({
  selectedImage,
  onDuplicateUploadedImage,
  onRemoveUploadedImage,
  onResetImage,
  onCrop,
}: {
  selectedImage: string;
  onDuplicateUploadedImage?: (url: string) => void;
  onRemoveUploadedImage?: (url: string) => void;
  onResetImage?: (url: string) => void;
  onCrop: () => void;
}) {
  return (
    <div className="space-y-3">
      <button
        className="w-full py-3 bg-gray-200 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-300"
        onClick={() => onDuplicateUploadedImage?.(selectedImage)}
      >
        <Copy size={18} />
        Duplicate
      </button>

      <button
        className="w-full py-3 bg-gray-200 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-300"
        onClick={onCrop}
      >
        <RotateCw size={18} />
        Crop
      </button>

      <button
        className="w-full py-3 bg-red-100 text-red-700 rounded-xl flex items-center justify-center gap-2 hover:bg-red-200"
        onClick={() => onResetImage?.(selectedImage)}
      >
        <RefreshCw size={18} />
        Reset To Original
      </button>

      <button
        className="w-full py-3 bg-red-200 text-red-700 rounded-xl flex items-center justify-center gap-2 hover:bg-red-300"
        onClick={() => onRemoveUploadedImage?.(selectedImage)}
      >
        <Trash2 size={18} />
        Delete Image
      </button>
    </div>
  );
}
