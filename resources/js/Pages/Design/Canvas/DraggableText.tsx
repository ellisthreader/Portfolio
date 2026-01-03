"use client";

import React, { useRef, useLayoutEffect, useState } from "react";

type Props = {
  uid: string;
  text: string;
  pos: { x: number; y: number };
  size: { w: number; h: number }; // desired font size
  rotation?: number;
  flip?: "none" | "horizontal" | "vertical";
  fontFamily?: string;
  color?: string;
  borderColor?: string;
  borderWidth?: number;
  highlighted: boolean;
  selected?: string[];
  restrictedBox?: { width: number; height: number }; // optional max
  onPointerDown: (e: React.MouseEvent, uid: string, multi: boolean) => void;
};

export default function DraggableText({
  uid,
  text,
  pos,
  size,
  rotation = 0,
  flip = "none",
  fontFamily = "Arial",
  color = "#000000",
  borderColor = "#000000",
  borderWidth = 0,
  highlighted,
  selected = [],
  restrictedBox,
  onPointerDown,
}: Props) {
  const scaleX = flip === "horizontal" ? -1 : 1;
  const scaleY = flip === "vertical" ? -1 : 1;
  const isMultiSelected = selected.includes(uid);

  const spanRef = useRef<HTMLSpanElement>(null);
  const [containerSize, setContainerSize] = useState({ w: size.w, h: size.h });

  useLayoutEffect(() => {
    if (!spanRef.current) return;

    const rect = spanRef.current.getBoundingClientRect();
    let textWidth = rect.width + (borderWidth || 0) * 2;
    let textHeight = rect.height + (borderWidth || 0) * 2;

    // optionally cap to restrictedBox
    if (restrictedBox) {
      textWidth = Math.min(textWidth, restrictedBox.width);
      textHeight = Math.min(textHeight, restrictedBox.height);
    }

    setContainerSize({ w: textWidth, h: textHeight });
  }, [text, size, fontFamily, borderWidth, restrictedBox]);

  return (
    <div
      data-uid={uid}
      data-type="text"
      draggable={false}
      onMouseDown={(e) => onPointerDown(e, uid, isMultiSelected)}
      className={`absolute cursor-move select-none flex items-center justify-center ${
        highlighted ? "ring-2 ring-blue-500" : ""
      }`}
      style={{
        left: pos.x,
        top: pos.y,
        width: containerSize.w,
        height: containerSize.h,
        zIndex: highlighted ? 200 : 50,
        transform: `rotate(${rotation}deg) scale(${scaleX}, ${scaleY})`,
        transformOrigin: "center center",
        pointerEvents: "auto",
        userSelect: "none",
        overflow: "visible", // allow box to grow
      }}
    >
      <span
        ref={spanRef}
        style={{
          fontFamily,
          fontSize: size.h,
          lineHeight: 1,
          color,
          WebkitTextStrokeWidth: `${borderWidth || 0}px`,
          WebkitTextStrokeColor: borderColor,
          WebkitTextFillColor: color,
          transformOrigin: "center center",
          display: "inline-block",
          whiteSpace: "pre",
        }}
      >
        {text || "Text"}
      </span>
    </div>
  );
}
