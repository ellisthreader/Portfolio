"use client";

import React from "react";
import InlineSvg from "../Components/InlineSvg";

type Props = {
  uid: string;
  url: string;
  pos: { x: number; y: number };
  size: { w: number; h: number };
  rotation?: number;
  flip?: "none" | "horizontal" | "vertical";
  highlighted: boolean;
  selected?: string[];
  color?: string;
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
  selected = [],
  color,
  onPointerDown,
}: Props) {
  const scaleX = flip === "horizontal" ? -1 : 1;
  const scaleY = flip === "vertical" ? -1 : 1;

  const isMultiSelected = selected.includes(uid);
  const isSvg = url.split("?")[0].toLowerCase().endsWith(".svg");

  return (
    <div
      data-uid={uid}
      data-type="img"
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
    >
      {isSvg ? (
        <InlineSvg src={url} color={color} />
      ) : (
        <img
          src={url}
          draggable={false}
          className="w-full h-full object-contain pointer-events-none"
          alt=""
        />
      )}
    </div>
  );
}
