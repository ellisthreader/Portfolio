// 📝 Renders a draggable text layer that behaves like DraggableImage

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
  borderWidth?: number;
  highlighted: boolean;
  selected?: string[];
  onPointerDown: (
    e: React.MouseEvent,
    uid: string,
    multi: boolean
  ) => void;
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
          fontSize: size.h, // matches text scaling with height like you were doing
          color,
          lineHeight: 1,
          borderStyle: borderWidth ? "solid" : "none",
          borderWidth,
          borderColor,
          padding: "2px 6px",
          background: "transparent",
        }}
      >
        {text || "Text"}
      </span>
    </div>
  );
}
