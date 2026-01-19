import { useEffect } from "react";

type Box = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export function useTextAutoShrink({
  imageState,
  positions,
  sizes,
  restrictedBox,
  onResizeText,
}: {
  imageState: Record<string, any>;
  positions: Record<string, { x: number; y: number }>;
  sizes: Record<string, { w: number; h: number }>;
  restrictedBox: Box;
  onResizeText?: (uid: string, newFontSize: number) => void;
}) {
  useEffect(() => {
    Object.entries(imageState).forEach(([uid, layer]) => {
      if (layer.type !== "text") return;

      const pos = positions[uid];
      const size = sizes[uid];
      if (!pos || !size) return;

      const textRect = {
        x: pos.x,
        y: pos.y,
        w: size.w,
        h: size.h,
      };

      const exceeds =
        textRect.x < restrictedBox.left ||
        textRect.y < restrictedBox.top ||
        textRect.x + textRect.w >
          restrictedBox.left + restrictedBox.width ||
        textRect.y + textRect.h >
          restrictedBox.top + restrictedBox.height;

      if (!exceeds) return;

      const currentFontSize = layer.fontSize ?? size.h;

      if (currentFontSize <= 2) return;

      onResizeText?.(uid, currentFontSize - 1);
    });
  }, [positions, sizes, imageState, restrictedBox, onResizeText]);
}
