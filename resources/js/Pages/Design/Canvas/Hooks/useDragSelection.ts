// 🖱️ Handles single-image selection and dragging within a restricted canvas, updating position while managing pointer lifecycle and selection state.


import { useState, useRef, useEffect } from "react";
import React from "react";

interface RestrictedBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface UseDragSelectionArgs {
  uids: string[];
  sizes: Record<string, { w: number; h: number }>;
  positions: Record<string, { x: number; y: number }>;
  setPositions: React.Dispatch<
    React.SetStateAction<Record<string, { x: number; y: number }>>
  >;
  canvasRef: React.RefObject<HTMLDivElement>;
  restrictedBox?: RestrictedBox; // 🔒 defensive
  onDelete?: (uids: string[]) => void;
  onDuplicate?: (uids: string[]) => void;
  onResize?: (uid: string, w: number, h: number) => void;
  onReset?: (uids: string[]) => void;
}

export function useDragSelection(args: UseDragSelectionArgs) {
  const [selected, setSelected] = useState<string[]>([]);
  const draggingUids = useRef<string[]>([]);
  const dragOffsets = useRef<Record<string, { x: number; y: number }>>({});

const onPointerDown = (e: React.PointerEvent, uid: string) => {
  e.stopPropagation();

  if (!args.positions[uid]) return;

  // ✅ keep current selection or start new one
  let multiSelected: string[];
  if (selected.includes(uid)) {
    multiSelected = [...selected]; // drag all selected
  } else {
    multiSelected = [uid]; // new selection
  }
  setSelected(multiSelected);
  draggingUids.current = multiSelected;


  // calculate offset for each selected image
  const offsets: Record<string, { x: number; y: number }> = {};
  multiSelected.forEach((u) => {
    const pos = args.positions[u];
    offsets[u] = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
  });
  dragOffsets.current = offsets;

  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
};

const onPointerMove = (e: PointerEvent) => {
  if (!draggingUids.current.length) return;
  if (!args.restrictedBox) return;

  const box = args.restrictedBox;

  args.setPositions((prev) => {
    const next = { ...prev };

    draggingUids.current.forEach((uid) => {
      const size = args.sizes[uid];
      if (!size) return;

      const rawX = e.clientX - dragOffsets.current[uid].x;
      const rawY = e.clientY - dragOffsets.current[uid].y;

      // clamp X and Y independently
      const clampedX = Math.min(Math.max(rawX, box.left), box.left + box.width - size.w);
      const clampedY = Math.min(Math.max(rawY, box.top), box.top + box.height - size.h);

      // set each image individually
      next[uid] = { x: clampedX, y: clampedY };
    });

    return next;
  });
};




const onPointerUp = () => {
  draggingUids.current = [];
  dragOffsets.current = {};
  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerup", onPointerUp);
};


  // 🔒 Cleanup on unmount (prevents stuck listeners)
  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  const selectionBoxProps = {
    selectedImages: selected,
    canvasRef: args.canvasRef,
    onDelete: args.onDelete ?? (() => {}),
    onDuplicate: args.onDuplicate ?? (() => {}),
    onResize: args.onResize ?? (() => {}),
    onReset: args.onReset ?? (() => {}),
  };

  return {
    selected,
    setSelected,
    onPointerDown,
    selectionBoxProps,
  };
}
