import React, { useRef, useLayoutEffect, useState } from "react";

type RestrictedBox = { left: number; top: number; width: number; height: number };

type Props = {
  uid: string;
  text: string;
  pos?: { x: number; y: number };
  size: { h?: number }; // font size only
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

  const fontSize = typeof size?.h === "number" && size.h > 0 ? size.h : 40;

  const [measured, setMeasured] = useState({ w: 0, h: 0 });

  const lastMeasuredRef = useRef<{ w: number; h: number } | null>(null);

  const rawX = pos?.x ?? 200;
  const rawY = pos?.y ?? 200;

  

  /* ------------------------------------------------------------
   * Accurate measurement without triggering infinite updates
   * ------------------------------------------------------------ */
  useLayoutEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    const prevTransform = el.style.transform;
    el.style.transform = "none";

    const rect = el.getBoundingClientRect();
    const w = rect.width + (borderWidth || 0) * 2;
    const h = rect.height + (borderWidth || 0) * 2;

    el.style.transform = prevTransform;

    // Only update state if measurement has actually changed
    const last = lastMeasuredRef.current;
    if (!last || Math.abs(last.w - w) > 0.5 || Math.abs(last.h - h) > 0.5) {
      lastMeasuredRef.current = { w, h };
      setMeasured({ w, h });
      // Call onMeasure AFTER state update to avoid loops
      requestAnimationFrame(() => onMeasure?.(uid, w, h));
    }
  }, [text, fontSize, fontFamily, borderWidth, uid, onMeasure]);

  /* ------------------------------------------------------------
   * Clamp position
   * ------------------------------------------------------------ */
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
      data-font={fontSize}
      onMouseDown={(e) => onPointerDown(e, uid, isMultiSelected)}
      className="absolute cursor-move select-none"
      style={{
        left: clampedX,
        top: clampedY,
        width: measured.w,
        height: measured.h,
        zIndex: highlighted ? 200 : 50,

        // ✅ ONLY flip here — NO rotation
        transform: `scale(${scaleX}, ${scaleY})`,
        transformOrigin: "left top",

        pointerEvents: "auto",
        userSelect: "none",
      }}
    >
      {/* 🔄 ROTATION LIVES HERE (visual only) */}
      <div
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: "left top",
          display: "inline-block",
          width: "fit-content",
          height: "fit-content",
        }}
      >
        {/* 📏 MEASURED TEXT (never rotated directly) */}
        <span
          ref={spanRef}
          style={{
            fontFamily,
            fontSize: `${fontSize}px`,
            lineHeight: 1,
            verticalAlign: "top",
            display: "inline-block",
            color,
            WebkitTextStrokeWidth: `${borderWidth || 0}px`,
            WebkitTextStrokeColor: borderColor,
            WebkitTextFillColor: color,
            whiteSpace: "nowrap",
          }}
        >
          {text || "Text"}
        </span>
      </div>
    </div>
  );
  }
