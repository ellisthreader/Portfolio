"use client";

import React, { useRef, useLayoutEffect, useState } from "react";

type RestrictedBox = { left: number; top: number; width: number; height: number };

type Props = {
  uid: string;
  text: string;
  pos?: { x: number; y: number };
  size: { h?: number };
  rotation?: number;
  flip?: "none" | "horizontal" | "vertical";
  fontFamily?: string;
  color?: string;
  borderColor?: string;
  borderWidth?: number;
  highlighted: boolean;
  selected?: string[];
  onPointerDown: (e: React.PointerEvent, uid: string, multi: boolean) => void;
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
  onPointerDown,
  onMeasure,
}: Props) {
  const measureRef = useRef<HTMLSpanElement>(null);

  const isMultiSelected = selected.includes(uid);
  const fontSize = typeof size?.h === "number" && size.h > 0 ? size.h : 40;

  const [measured, setMeasured] = useState({ w: 0, h: 0 });
  const lastMeasured = useRef<{ w: number; h: number } | null>(null);

  const x = pos?.x ?? 200;
  const y = pos?.y ?? 200;

  /* ------------------------------------------------------------
   * 📏 MEASURE (hidden, never rotated)
   * ------------------------------------------------------------ */
  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const w = rect.width + (borderWidth || 0) * 2;
    const h = rect.height + (borderWidth || 0) * 2;

    const last = lastMeasured.current;
    if (!last || Math.abs(last.w - w) > 0.5 || Math.abs(last.h - h) > 0.5) {
      lastMeasured.current = { w, h };
      setMeasured({ w, h });
      requestAnimationFrame(() => onMeasure?.(uid, w, h));
    }
  }, [text, fontSize, fontFamily, borderWidth, uid, onMeasure]);

  const scaleX = flip === "horizontal" ? -1 : 1;
  const scaleY = flip === "vertical" ? -1 : 1;

  /* ------------------------------------------------------------
   * 🧠 RENDER
   * ------------------------------------------------------------ */
  return (
    <>
      {/* 🔒 HIDDEN MEASURER — NEVER ROTATED */}
      <span
        ref={measureRef}
        style={{
          position: "absolute",
          visibility: "hidden",
          whiteSpace: "nowrap",
          fontFamily,
          fontSize: `${fontSize}px`,
          lineHeight: 1,
          WebkitTextStrokeWidth: `${borderWidth || 0}px`,
        }}
      >
        {text || "Text"}
      </span>

      {/* 🖱️ DRAG CONTAINER — NEVER TRANSFORMED */}
      <div
        data-uid={uid}
        onPointerDown={(e) => onPointerDown(e, uid, isMultiSelected)}
        className="absolute cursor-move select-none"
        style={{
          left: x,
          top: y,
          width: measured.w,
          height: measured.h,
          zIndex: highlighted ? 200 : 50,
          userSelect: "none",
        }}
      >
        {/* 🎨 VISUAL ONLY — ROTATION LIVES HERE */}
        <div
          style={{
            width: measured.w,
            height: measured.h,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `rotate(${rotation}deg) scale(${scaleX}, ${scaleY})`,
            transformOrigin: "center center",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontFamily,
              fontSize: `${fontSize}px`,
              lineHeight: 1,
              whiteSpace: "nowrap",
              color,
              WebkitTextStrokeWidth: `${borderWidth || 0}px`,
              WebkitTextStrokeColor: borderColor,
              WebkitTextFillColor: color,
            }}
          >
            {text || "Text"}
          </span>
        </div>
      </div>
    </>
  );
}
