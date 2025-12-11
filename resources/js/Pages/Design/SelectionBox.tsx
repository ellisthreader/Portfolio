import React, { useEffect, useState } from "react";
import { X, Copy, Move } from "lucide-react";

interface SelectionBoxProps {
  selectedImages: string[]; // uids
  canvasRef: React.RefObject<HTMLDivElement>;
  onDelete: (uids: string[]) => void;
  onDuplicate: (uids: string[]) => void;
  onResize: (imageUid: string, newSize: number) => void; // single-image resize
  onStartGroupResize?: (startClientX: number) => any;
}

const SelectionBox: React.FC<SelectionBoxProps> = ({
  selectedImages,
  canvasRef,
  onDelete,
  onDuplicate,
  onResize,
  onStartGroupResize,
}) => {
  const [box, setBox] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const [labelPos, setLabelPos] = useState<{ left: number; top: number } | null>(null);

  const firstUid = selectedImages[0];

  const updateBoundingBox = () => {
    if (selectedImages.length === 0 || !canvasRef.current) {
      setBox(null);
      return;
    }

    const canvasRect = canvasRef.current.getBoundingClientRect();
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    selectedImages.forEach((uid) => {
      const el = document.querySelector<HTMLImageElement>(`img[data-uid="${CSS.escape(uid)}"][data-type="img"]`);
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = r.left - canvasRect.left;
      const y = r.top - canvasRect.top;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + r.width);
      maxY = Math.max(maxY, y + r.height);
    });

    if (minX === Infinity) {
      setBox(null);
      return;
    }

    setBox({ left: minX, top: minY, width: maxX - minX, height: maxY - minY });
  };

  useEffect(() => {
    updateBoundingBox();
    const onResize = () => updateBoundingBox();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [selectedImages, canvasRef]);

  if (!box || !firstUid) return null;

  const showLabel = (text: string, x: number, y: number) => {
    setHoverLabel(text);
    setLabelPos({ left: x, top: y });
  };
  const hideLabel = () => {
    setHoverLabel(null);
    setLabelPos(null);
  };

  const stopAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSingleResizeMouseDown = (e: React.MouseEvent) => {
    stopAll(e);
    if (!firstUid) return;

    const el = document.querySelector<HTMLImageElement>(`img[data-uid="${CSS.escape(firstUid)}"][data-type="img"]`);
    if (!el) return;

    const startSize = el.width;
    const startX = e.clientX;
    const startY = e.clientY;

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      const delta = Math.max(dx, dy);
      const newSize = Math.max(30, startSize + delta);

      onResize(firstUid, newSize);
      updateBoundingBox();
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const handleGroupResizeMouseDown = (e: React.MouseEvent) => {
    stopAll(e);
    if (typeof onStartGroupResize === "function") {
      onStartGroupResize(e.clientX);
    } else {
      handleSingleResizeMouseDown(e);
    }
  };

  return (
    <>
      {hoverLabel && labelPos && (
        <div
          className="absolute bg-black text-white text-xs px-2 py-1 rounded"
          style={{ left: labelPos.left, top: labelPos.top, zIndex: 9999, whiteSpace: "nowrap", pointerEvents: "none", transform: "translate(-50%, -100%)" }}
        >
          {hoverLabel}
        </div>
      )}

      <div
        className="absolute border-2 border-blue-500 pointer-events-none"
        style={{
          left: box.left,
          top: box.top,
          width: box.width,
          height: box.height,
          zIndex: 300,
          background: "rgba(59,130,246,0.08)",
        }}
      >
        {/* DELETE */}
        <div
          className="absolute bg-white rounded-full shadow p-1 cursor-pointer selection-button"
          style={{ right: -15, top: -15, zIndex: 400, pointerEvents: "auto" }}
          onMouseDown={stopAll}
          onClick={(e) => { stopAll(e); onDelete(selectedImages); }}
          onMouseEnter={() => showLabel("Delete", box.left + box.width - 10, box.top - 30)}
          onMouseLeave={hideLabel}
        >
          <X size={16} color="red" />
        </div>

        {/* RESIZE */}
        <div
          className="absolute bg-white rounded-full shadow p-1 cursor-se-resize selection-button"
          style={{ right: -15, bottom: -15, zIndex: 400, pointerEvents: "auto" }}
          onMouseDown={handleGroupResizeMouseDown}
          onMouseEnter={() => showLabel("Resize", box.left + box.width - 10, box.top + box.height + 20)}
          onMouseLeave={hideLabel}
        >
          <Move size={16} />
        </div>

        {/* DUPLICATE */}
        <div
          className="absolute bg-white rounded-full shadow p-1 cursor-pointer selection-button"
          style={{ left: -15, bottom: -15, zIndex: 400, pointerEvents: "auto" }}
          onMouseDown={stopAll}
          onClick={(e) => { stopAll(e); onDuplicate(selectedImages); }}
          onMouseEnter={() => showLabel("Duplicate", box.left - 10, box.top + box.height + 20)}
          onMouseLeave={hideLabel}
        >
          <Copy size={16} />
        </div>
      </div>
    </>
  );
};

export default SelectionBox;
