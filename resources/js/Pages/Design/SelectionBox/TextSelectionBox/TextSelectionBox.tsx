import React, { useState, useEffect } from "react";
import { useBoundingBox } from "./useBoundingBox";
import { useTextResize } from "./useTextResize";
import HoverLabel from "./HoverLabel";
import SelectionBoundingBox from "./SelectionBoundingBox";
import DeleteButton from "./DeleteButton";
import DuplicateButton from "./DuplicateButton";
import ResizeHandle from "./ResizeHandle";


interface Props {
  selectedText: string[];
  canvasRef: React.RefObject<HTMLDivElement>;
  onDelete: (uids: string[]) => void;
  onDuplicate: (uids: string[]) => void;
  onDeselectAll?: () => void;
  onResizeText: (uid: string, newFontSize: number) => void;
  restrictedBox: { left: number; top: number; width: number; height: number };
}

export default function TextSelectionBox(props: Props) {
  const {
    selectedText,
    canvasRef,
    onDelete,
    onDuplicate,
    onDeselectAll,
    onResizeText,
    restrictedBox
  } = props;

  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const [labelPos, setLabelPos] = useState<{ left: number; top: number } | null>(
    null
  );
  const [fontSizes, setFontSizes] = useState<Record<string, number>>({});

  const firstUid = selectedText[0] ?? null;

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

  const { box, update } = useBoundingBox(selectedText, canvasRef);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const clicked = selectedText.some(uid => {
        const el = document.querySelector<HTMLElement>(
          `[data-uid="${CSS.escape(uid)}"][data-type="text"]`
        );
        return el?.contains(e.target as Node);
      });

      if (!clicked) onDeselectAll?.();
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [selectedText, onDeselectAll]);

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

  // 👇 REAL bounding-measure function (critical)
  const getTextBoxSize = (uid: string, fontSize: number) => {
    const el = document.querySelector<HTMLElement>(
      `[data-uid="${CSS.escape(uid)}"][data-type="text"]`
    );
    if (!el) return;

    const clone = el.cloneNode(true) as HTMLElement;

    clone.style.visibility = "hidden";
    clone.style.position = "absolute";
    clone.style.left = "-99999px";
    clone.style.top = "-99999px";
    clone.style.fontSize = `${fontSize}px`;

    document.body.appendChild(clone);
    const rect = clone.getBoundingClientRect();
    document.body.removeChild(clone);

    return { w: rect.width, h: rect.height };
  };

  const handleResize = useTextResize(
    firstUid,
    canvasRef,
    restrictedBox,
    getFontSize,
    setFontSizes,
    onResizeText,
    getTextBoxSize // ✅ instead of update
  );

  if (!box || !firstUid) return null;

  return (
    <>
      {hoverLabel && labelPos && (
        <HoverLabel text={hoverLabel} left={labelPos.left} top={labelPos.top} />
      )}

      <SelectionBoundingBox box={box}>
        <DeleteButton
          stopAll={stopAll}
          onClick={() => onDelete(selectedText)}
          onEnter={() => showLabel("Delete", box.left + box.width - 10, box.top - 30)}
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
          onClick={() => onDuplicate(selectedText)}
          onEnter={() =>
            showLabel("Duplicate", box.left - 10, box.top + box.height + 20)
          }
          onLeave={hideLabel}
        />
      </SelectionBoundingBox>
    </>
  );
}
