import React, { useState, useEffect } from "react";
import HoverLabel from "./HoverLabel";
import SelectionBoundingBox from "./SelectionBoundingBox";
import DeleteButton from "./DeleteButton";
import DuplicateButton from "./DuplicateButton";
import ResizeHandle from "./ResizeHandle";
import { useTextResize } from "./useTextResize";

interface Props {
  selectedText: string[];
  canvasRef: React.RefObject<HTMLDivElement>;
  onDelete: (uids: string[]) => void;
  onDuplicate: (uids: string[]) => void;
  onDeselectAll?: () => void;
  onResizeText: (uid: string, newFontSize: number) => void;
  restrictedBox: { left: number; top: number; width: number; height: number };
  positions: Record<string, { x: number; y: number }> | undefined;
  sizes: Record<string, { w: number; h: number }> | undefined;
}

export default function TextSelectionBox({
  selectedText,
  canvasRef,
  onDelete,
  onDuplicate,
  onDeselectAll,
  onResizeText,
  restrictedBox,
  positions,
  sizes,
}: Props) {
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const [labelPos, setLabelPos] = useState<{ left: number; top: number } | null>(
    null
  );

  // ✅ Defensive: bail if positions or sizes are undefined
  if (!positions || !sizes) return null;

  // ✅ Only include selected UIDs that exist in both positions AND sizes
  const readyUids = selectedText.filter(uid => positions[uid] && sizes[uid]);

  // ✅ Bail early if nothing is ready
  if (readyUids.length === 0) return null;

  const uid = readyUids[0]; // anchor UID
  const pos = positions[uid]!;
  const size = sizes[uid]!;

  const box = {
    left: pos.x,
    top: pos.y,
    width: size.w,
    height: size.h,
  };

  /* ------------------------------------------------------------
   * 🧠 Outside click deselect
   * ------------------------------------------------------------ */
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickedInside = readyUids.some(
        uid => target.closest(`[data-uid="${CSS.escape(uid)}"]`)
      );
      if (!clickedInside) onDeselectAll?.();
    };

    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [readyUids, onDeselectAll]);

  const showLabel = (text: string, left: number, top: number) => {
    setHoverLabel(text);
    setLabelPos({ left, top });
  };

  const hideLabel = () => {
    setHoverLabel(null);
    setLabelPos(null);
  };

  const stopAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  /* ------------------------------------------------------------
   * 🔄 Resize (font-size driven)
   * ------------------------------------------------------------ */
  const handleResize = useTextResize(
    uid,
    canvasRef,
    restrictedBox,
    () => size.h, // current font size
    () => {},     // no local font state needed
    onResizeText,
    () => size    // authoritative box size
  );

  /* ------------------------------------------------------------
   * ✅ Render selection box
   * ------------------------------------------------------------ */
  return (
    <>
      {hoverLabel && labelPos && (
        <HoverLabel text={hoverLabel} left={labelPos.left} top={labelPos.top} />
      )}

      <SelectionBoundingBox box={box}>
        <DeleteButton
          stopAll={stopAll}
          onClick={() => onDelete(readyUids)}
          onEnter={() =>
            showLabel("Delete", box.left + box.width - 10, box.top - 30)
          }
          onLeave={hideLabel}
        />

        <ResizeHandle
          onMouseDown={handleResize}
          onEnter={() =>
            showLabel(
              "Resize",
              box.left + box.width - 10,
              box.top + box.height + 20
            )
          }
          onLeave={hideLabel}
        />

        <DuplicateButton
          stopAll={stopAll}
          onClick={() => onDuplicate(readyUids)}
          onEnter={() =>
            showLabel("Duplicate", box.left - 10, box.top + box.height + 20)
          }
          onLeave={hideLabel}
        />
      </SelectionBoundingBox>
    </>
  );
}
