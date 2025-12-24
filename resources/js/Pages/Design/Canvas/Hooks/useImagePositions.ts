// 📍 Initializes and maintains image positions, centering new images and clamping them safely within a restricted canvas area.


import { useEffect, useState } from "react";
import { clampPosition } from "../Utils/clampPosition";

type Position = { x: number; y: number };
type Size = { w: number; h: number };
type RestrictedBox = { left: number; top: number; width: number; height: number };

export function useImagePositions(
  uids?: string[], // optional
  sizes?: Record<string, Size>, // optional
  restrictedBox?: RestrictedBox // optional
) {
  const [positions, setPositions] = useState<Record<string, Position>>({});

  // ensure safe defaults
  const safeUids = Array.isArray(uids) ? uids : [];
  const safeSizes = sizes ?? {};
  const safeBox = restrictedBox ?? { left: 0, top: 0, width: 0, height: 0 };

  useEffect(() => {
    setPositions((prev) => {
      const next = { ...prev };

      safeUids.forEach((uid) => {
        if (!next[uid] && safeSizes[uid]) {
          const s = safeSizes[uid];
          next[uid] = clampPosition(
            safeBox.left + (safeBox.width - s.w) / 2,
            safeBox.top + (safeBox.height - s.h) / 2,
            s.w,
            s.h,
            safeBox
          );
        }
      });

      return next;
    });
  }, [
    safeUids.length ? safeUids.join(",") : "", // safe dependency
    JSON.stringify(safeSizes),
    safeBox.left,
    safeBox.top,
    safeBox.width,
    safeBox.height,
  ]);

  return { positions, setPositions };
}
