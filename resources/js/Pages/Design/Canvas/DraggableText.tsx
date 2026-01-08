import React, { useRef, useEffect, useState } from "react";

type RestrictedBox = { left: number; top: number; width: number; height: number };

type Props = {
  uid: string;
  text: string;
  pos?: { x: number; y: number };
  size: { h?: number }; // only font size
  rotation?: number;
  flip?: "none" | "horizontal" | "vertical";
  fontFamily?: string;
  color?: string;
  borderColor?: string;
  borderWidth?: number;
  highlighted: boolean;
  selected?: string[];
  restrictedBox?: RestrictedBox;
  onPointerDown: (e: React.MouseEvent, uid: string, multi: boolean) => void;
  onMeasure?: (uid: string, w: number, h: number) => void;
};

export default function DraggableText({
  uid,
  text,
  pos,
  size,
  rotation = 0,
  flip = "none",
  fontFamily = "Arial",
  color = "#000",
  borderColor = "#000",
  borderWidth = 0,
  highlighted,
  selected = [],
  restrictedBox,
  onPointerDown,
  onMeasure,
}: Props) {
  const spanRef = useRef<HTMLSpanElement>(null);

  const isMultiSelected = selected.includes(uid);

  // font size ONLY
  const fontSize = typeof size?.h === "number" && size.h > 0 ? size.h : 40;

  // measured text size
  const [measured, setMeasured] = useState({ w: 0, h: 0 });

  // raw x/y
  const rawX = pos?.x ?? 200;
  const rawY = pos?.y ?? 200;

  // measure text size
  useEffect(() => {
    if (!spanRef.current) return;

    // temporarily remove transforms for accurate measurement
    const el = spanRef.current;
    const oldTransform = el.style.transform;
    el.style.transform = "none";

    const rect = el.getBoundingClientRect();
    const w = rect.width + (borderWidth || 0) * 2;
    const h = rect.height + (borderWidth || 0) * 2;

    setMeasured(prev => {
      if (Math.abs(prev.w - w) < 0.5 && Math.abs(prev.h - h) < 0.5) return prev;
      queueMicrotask(() => onMeasure?.(uid, w, h));
      return { w, h };
    });

    el.style.transform = oldTransform;
  }, [text, fontSize, fontFamily, borderWidth, uid, onMeasure]);

  // clamp to restricted box
  const clampedX = restrictedBox
    ? Math.min(
        Math.max(rawX, restrictedBox.left),
        restrictedBox.left + restrictedBox.width - measured.w
      )
    : rawX;

  const clampedY = restrictedBox
    ? Math.min(
        Math.max(rawY, restrictedBox.top),
        restrictedBox.top + restrictedBox.height - measured.h
      )
    : rawY;

  const scaleX = flip === "horizontal" ? -1 : 1;
  const scaleY = flip === "vertical" ? -1 : 1;

  return (
    <div
      data-uid={uid}
      data-type="text"
      onMouseDown={(e) => onPointerDown(e, uid, isMultiSelected)}
      className="absolute cursor-move select-none"
      style={{
        left: clampedX,
        top: clampedY,
        width: measured.w,
        height: measured.h,
        zIndex: highlighted ? 200 : 50,
        transform: `rotate(${rotation}deg) scale(${scaleX}, ${scaleY})`,
        transformOrigin: "left top",
        pointerEvents: "auto",
        userSelect: "none",
      }}
    >
      <span
        ref={spanRef}
        style={{
          fontFamily,
          fontSize: `${fontSize}px`,
          lineHeight: 1,
          color,
          WebkitTextStrokeWidth: `${borderWidth || 0}px`,
          WebkitTextStrokeColor: borderColor,
          WebkitTextFillColor: color,
          display: "inline-block",
          whiteSpace: "nowrap",
          transformOrigin: "left top",
        }}
      >
        {text || "Text"}
      </span>
    </div>
  );
}
