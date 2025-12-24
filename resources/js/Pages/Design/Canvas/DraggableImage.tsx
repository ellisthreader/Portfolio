// 🖼️ Renders a draggable image on the canvas, visually reflecting selection state and forwarding pointer events for single or multi-item dragging.


import React from "react";

type Props = {
  uid: string;
  url: string;
  pos: { x: number; y: number };
  size: { w: number; h: number };
  rotation?: number;
  flip?: "none" | "horizontal" | "vertical";
  highlighted: boolean;
  selected?: string[]; // ⬅️ optional for runtime safety
  onPointerDown: (
    e: React.MouseEvent,
    uid: string,
    multi: boolean
  ) => void;
};

export default function DraggableImage({
  uid,
  url,
  pos,
  size,
  rotation = 0,
  flip = "none",
  highlighted,
  selected = [], // ⬅️ default prevents undefined.includes crash
  onPointerDown,
}: Props) {
  const scaleX = flip === "horizontal" ? -1 : 1;
  const scaleY = flip === "vertical" ? -1 : 1;

  const isMultiSelected = selected.includes(uid);

  return (
    <img
      src={url}
      alt=""
      data-uid={uid}
      data-type="img"
      draggable={false}
      onMouseDown={(e) => onPointerDown(e, uid, isMultiSelected)}
      className={`
        absolute
        cursor-move
        select-none
        transition-shadow
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
      }}
    />
  );
}
