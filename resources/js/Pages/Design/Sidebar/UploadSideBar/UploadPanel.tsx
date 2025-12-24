"use client";

import { UploadCloud, Image as ImageIcon } from "lucide-react";

export default function UploadPanel({
  onUpload,
  recentImages = [],
  onSelectImage,
}: {
  onUpload: (url: string) => void;
  recentImages?: string[];
  onSelectImage?: (url: string) => void;
}) {
  const handleFile = (file?: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    onUpload(url);
  };

  return (
    <div className="p-5 space-y-6 h-full overflow-y-auto bg-white shadow-lg rounded-xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold">Upload Images</h2>
        <p className="text-gray-500 text-sm">
          Add your own images to the canvas.
        </p>
      </div>

      {/* Browse Button */}
      <label className="w-full flex items-center gap-3 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl border border-gray-300 transition shadow-sm">
        <UploadCloud size={22} />
        <span className="font-medium">Browse your computer</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </label>

      {/* Drag & Drop */}
      <div
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files?.[0]);
        }}
        onDragOver={(e) => e.preventDefault()}
        className="w-full h-36 border-2 border-dashed border-gray-400 rounded-xl flex flex-col items-center justify-center text-gray-600 bg-gray-50 hover:bg-gray-100 transition"
      >
        <ImageIcon size={30} className="mb-2 opacity-70" />
        <p className="text-sm font-medium">Or drag and drop</p>
        <p className="text-xs text-gray-500 mt-1">
          PNG, JPG, SVG supported
        </p>
      </div>

      {/* Image Requirements */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-900 text-sm shadow-sm">
        <p className="font-semibold mb-1">Image Requirements</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>High-resolution images (300 DPI+) look best</li>
          <li>Transparent backgrounds recommended</li>
          <li>Maximum file size: 25MB</li>
        </ul>
      </div>

      {/* Recent Uploads */}
      <div className="pb-4">
        <h3 className="text-lg font-semibold mb-2">Recent Uploads</h3>

        {recentImages.length === 0 ? (
          <p className="text-gray-500 text-sm">No uploads yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 pr-1">
            {recentImages.map((url, i) => (
              <div
                key={url + i}
                onClick={() => onSelectImage?.(url)}
                className="w-full h-32 rounded-lg overflow-hidden border cursor-pointer hover:ring-2 hover:ring-blue-400 transition"
              >
                <img
                  src={url}
                  alt={`recent-${i}`}
                  className="w-full h-full object-contain bg-gray-100"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
