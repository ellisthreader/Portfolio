"use client";

import React from "react";

type Props = {
  uid: string;
  text: string;
  pos: { x: number; y: number };
  size: { w: number; h: number };
  rotation?: number;
  flip?: "none" | "horizontal" | "vertical";
  fontFamily?: string;
  color?: string;
  borderColor?: string;
  borderWidth?: number; // in pixels
  highlighted: boolean;
  selected?: string[];
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
  onPointerDown,
}: Props) {
  const scaleX = flip === "horizontal" ? -1 : 1;
  const scaleY = flip === "vertical" ? -1 : 1;
  const isMultiSelected = selected.includes(uid);

  // Optional subtle multi-layer shadow for softer outline
  const shadowLayers = 2; // fixed small number
  const shadow = borderWidth
    ? Array(shadowLayers)
        .fill(0)
        .map((_, i) => {
          const offset = i + 0.5; // small offset
          return `${-offset}px ${-offset}px 0 ${borderColor}, ${offset}px ${-offset}px 0 ${borderColor}, ${-offset}px ${offset}px 0 ${borderColor}, ${offset}px ${offset}px 0 ${borderColor}`;
        })
        .join(", ")
    : "none";

  return (
    <div
      data-uid={uid}
      data-type="text"
      draggable={false}
      onMouseDown={(e) => onPointerDown(e, uid, isMultiSelected)}
      className={`
        absolute
        cursor-move
        select-none
        transition-shadow
        flex
        items-center
        justify-center
        ${highlighted ? "ring-2 ring-blue-500" : ""}
      `}
      style={{
        left: pos.x,
        top: pos.y,
        width: size.w,
        height: size.h,
        zIndex: highlighted ? 200 : 50,
        boxShadow: highlighted
          ? "0 8px 20px rgba(0,0,0,0.25)"
          : "none",
        transform: `rotate(${rotation}deg) scale(${scaleX}, ${scaleY})`,
        transformOrigin: "center center",
        pointerEvents: "auto",
        userSelect: "none",
        whiteSpace: "pre",
      }}
    >
      <span
        style={{
          fontFamily,
          fontSize: size.h,
          color,
          lineHeight: 1,
          WebkitTextStrokeWidth: `${borderWidth}px`, // main outline
          WebkitTextStrokeColor: borderColor,
          WebkitTextFillColor: color,
          textShadow: shadow, // optional softening
          background: "transparent",
        }}
      >
        {text || "Text"}
      </span>
    </div>
  );
}
