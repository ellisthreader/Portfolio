import React from "react";

type Props = {
  uid: string;
  url: string;
  pos: { x: number; y: number };
  size: { w: number; h: number };
  rotation: number;
  flip: "none" | "horizontal" | "vertical";
  highlighted: boolean;
  onPointerDown: (e: React.PointerEvent, uid: string) => void;
  color?: string; // optional tint/color
};

export default function DraggableImage({
  uid,
  url,
  pos,
  size,
  rotation,
  flip,
  highlighted,
  onPointerDown,
  color = "#fff",
}: Props) {
  // Flip around center without changing position
  const scaleX = flip === "horizontal" ? -1 : 1;
  const scaleY = flip === "vertical" ? -1 : 1;

  const transform = `translate(${pos.x}px, ${pos.y}px) rotate(${rotation}deg) scaleX(${scaleX}) scaleY(${scaleY})`;

  return (
    <img
      data-uid={uid}
      src={url}
      onPointerDown={(e) => onPointerDown(e, uid)}
      style={{
        position: "absolute",
        width: size.w,
        height: size.h,
        transform,
        transformOrigin: "center center",
        cursor: "grab",
        zIndex: highlighted ? 1000 : 1,
        userSelect: "none",
        pointerEvents: "auto",
        objectFit: "contain",
        filter: color !== "#fff" ? `drop-shadow(0 0 0 ${color})` : undefined,
      }}
      alt=""
    />
  );
}
