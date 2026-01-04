"use client";

import React, { useRef, useLayoutEffect, useState } from "react";

type Props = {
  uid: string;
  text: string;
  pos: { x: number; y: number };
  size: { w?: number; h?: number }; // h = font size
  rotation?: number;
  flip?: "none" | "horizontal" | "vertical";
  fontFamily?: string;
  color?: string;
  borderColor?: string;
  borderWidth?: number;
  highlighted: boolean;
  selected?: string[];
  restrictedBox?: { width: number; height: number };
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
  const spanRef = useRef<HTMLSpanElement>(null);
  const isMultiSelected = selected.includes(uid);

  // reactive font size (true source)
  const fontSize = size?.h && size.h > 0 ? size.h : 24;

  const [containerSize, setContainerSize] = useState({
    w: fontSize * 0.6,
    h: fontSize,
  });

  useLayoutEffect(() => {
    if (!spanRef.current) return;

    const rect = spanRef.current.getBoundingClientRect();
    let textWidth = rect.width + (borderWidth || 0) * 2;
    let textHeight = rect.height + (borderWidth || 0) * 2;

    if (restrictedBox) {
      textWidth = Math.min(textWidth, restrictedBox.width);
      textHeight = Math.min(textHeight, restrictedBox.height);
    }

    setContainerSize({ w: textWidth, h: textHeight });
  }, [text, fontSize, fontFamily, borderWidth, restrictedBox]);

  const clampedX = restrictedBox
    ? Math.min(Math.max(0, pos.x), restrictedBox.width - containerSize.w)
    : pos.x;

  const clampedY = restrictedBox
    ? Math.min(Math.max(0, pos.y), restrictedBox.height - containerSize.h)
    : pos.y;

  const scaleX = flip === "horizontal" ? -1 : 1;
  const scaleY = flip === "vertical" ? -1 : 1;

  return (
    <div
      data-uid={uid}
      data-type="text"
      data-font={fontSize}          {/* <<< IMPORTANT */}
      draggable={false}
      onMouseDown={(e) => onPointerDown(e, uid, isMultiSelected)}
      className="absolute cursor-move select-none flex items-center justify-center"
      style={{
        left: clampedX,
        top: clampedY,
        width: containerSize.w,
        height: containerSize.h,
        zIndex: highlighted ? 200 : 50,
        transform: `rotate(${rotation}deg) scale(${scaleX}, ${scaleY})`,
        transformOrigin: "center center",
        pointerEvents: "auto",
        userSelect: "none",
        overflow: "hidden",
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
