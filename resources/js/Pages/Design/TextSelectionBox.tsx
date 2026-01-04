// TextSelectionBox.tsx
import React, { useEffect, useState } from "react";
import { X, Copy, Move } from "lucide-react";

interface Props {
  selectedText: string[]; // uids
  canvasRef: React.RefObject<HTMLDivElement>;
  onDelete: (uids: string[]) => void;
  onDuplicate: (uids: string[]) => void;
  onDeselectAll?: () => void;
  onResizeText: (uid: string, newFontSize: number) => void;
}

export default function TextSelectionBox({
  selectedText,
  canvasRef,
  onDelete,
  onDuplicate,
  onDeselectAll,
  onResizeText
}: Props) {
  const [box, setBox] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const [labelPos, setLabelPos] = useState<{ left: number; top: number } | null>(null);

  // Track font sizes locally to prevent snapping
  const [fontSizes, setFontSizes] = useState<Record<string, number>>({});

  const firstUid = selectedText.length > 0 ? selectedText[0] : null;

  // Get current font size for a text element
  const getFontSize = (uid: string) => {
    if (fontSizes[uid] !== undefined) return fontSizes[uid];

    const el = document.querySelector<HTMLElement>(
      `[data-uid="${CSS.escape(uid)}"][data-type="text"]`
    );
    if (!el) return 40;

    const attr = el.getAttribute("data-font");
    const size = attr ? parseFloat(attr) : 40;

    setFontSizes(prev => ({ ...prev, [uid]: size }));
    return size;
  };

  // ✅ Populate fontSizes for newly selected texts
  useEffect(() => {
    if (selectedText.length === 0) return;

    setFontSizes(prev => {
      const newSizes = { ...prev };
      selectedText.forEach(uid => {
        if (newSizes[uid] === undefined) {
          const el = document.querySelector<HTMLElement>(
            `[data-uid="${CSS.escape(uid)}"][data-type="text"]`
          );
          if (el) {
            const attr = el.getAttribute("data-font");
            const size = attr ? parseFloat(attr) : 40;
            newSizes[uid] = size;
          }
        }
      });
      return newSizes;
    });
  }, [selectedText]);

  const updateBoundingBox = () => {
    if (!canvasRef.current || selectedText.length === 0) {
      setBox(null);
      return;
    }

    const canvasRect = canvasRef.current.getBoundingClientRect();
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    selectedText.forEach(uid => {
      const el = document.querySelector<HTMLElement>(
        `[data-uid="${CSS.escape(uid)}"][data-type="text"]`
      );
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
    const handleWindowResize = () => updateBoundingBox();
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, [selectedText, canvasRef]);

  // click outside → deselect
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const clickedOnSelected = selectedText.some(uid => {
        const el = document.querySelector<HTMLElement>(
          `[data-uid="${CSS.escape(uid)}"][data-type="text"]`
        );
        return el?.contains(e.target as Node);
      });

      if (!clickedOnSelected) onDeselectAll?.();
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [selectedText, onDeselectAll]);

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

  //
  // ⭐ SMOOTH TEXT RESIZE
  //
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    stopAll(e);
    if (!firstUid) return;

    const startFont = getFontSize(firstUid);
    const startX = e.clientX;

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const newSize = Math.max(8, startFont + dx * 0.4);

      // Update local font size
      setFontSizes(prev => ({ ...prev, [firstUid]: newSize }));

      // Call parent handler
      onResizeText(firstUid, newSize);
      updateBoundingBox();
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <>
      {hoverLabel && labelPos && (
        <div
          className="absolute bg-black text-white text-xs px-2 py-1 rounded"
          style={{
            left: labelPos.left,
            top: labelPos.top,
            zIndex: 9999,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            transform: "translate(-50%, -100%)"
          }}
        >
          {hoverLabel}
        </div>
      )}

      <div
        className="absolute border-2 border-purple-500 pointer-events-none"
        style={{
          left: box.left,
          top: box.top,
          width: box.width,
          height: box.height,
          zIndex: 310,
          background: "rgba(147,51,234,.06)"
        }}
      >
        {/* DELETE */}
        <div
          className="absolute bg-white rounded-full shadow p-1 cursor-pointer selection-button"
          style={{ right: -15, top: -15, zIndex: 400, pointerEvents: "auto" }}
          onMouseDown={stopAll}
          onClick={() => onDelete(selectedText)}
          onMouseEnter={() =>
            showLabel("Delete", box.left + box.width - 10, box.top - 30)
          }
          onMouseLeave={hideLabel}
        >
          <X size={16} color="red" />
        </div>

        {/* RESIZE */}
        <div
          className="absolute bg-white rounded-full shadow p-1 cursor-se-resize selection-button"
          style={{ right: -15, bottom: -15, zIndex: 400, pointerEvents: "auto" }}
          onMouseDown={handleResizeMouseDown}
          onMouseEnter={() =>
            showLabel("Resize", box.left + box.width - 10, box.top + box.height + 20)
          }
          onMouseLeave={hideLabel}
        >
          <Move size={16} />
        </div>

        {/* DUPLICATE */}
        <div
          className="absolute bg-white rounded-full shadow p-1 cursor-pointer selection-button"
          style={{ left: -15, bottom: -15, zIndex: 400, pointerEvents: "auto" }}
          onMouseDown={stopAll}
          onClick={() => onDuplicate(selectedText)}
          onMouseEnter={() =>
            showLabel("Duplicate", box.left - 10, box.top + box.height + 20)
          }
          onMouseLeave={hideLabel}
        >
          <Copy size={16} />
        </div>
      </div>
    </>
  );
}
