// 📍 Initializes and maintains image positions,
// ALWAYS clamping them inside the restricted box.

import { useEffect, useState } from "react";
import { clampPosition } from "../Utils/clampPosition";

type Position = { x: number; y: number };
type Size = { w: number; h: number };
type RestrictedBox = { left: number; top: number; width: number; height: number };

export function useImagePositions(
  uids?: string[],
  sizes?: Record<string, Size>,
  restrictedBox?: RestrictedBox
) {
  const [positions, setPositions] = useState<Record<string, Position>>({});

  const safeUids = Array.isArray(uids) ? uids : [];
  const safeSizes = sizes ?? {};
  const safeBox = restrictedBox ?? { left: 0, top: 0, width: 0, height: 0 };

  //
  // 1️⃣ Initialize + clamp when new images are added
  //
  useEffect(() => {
    setPositions((prev) => {
      const next = { ...prev };

      safeUids.forEach((uid) => {
        const size = safeSizes[uid];
        if (!size) return;

        // If brand-new → center + clamp
        if (!next[uid]) {
          next[uid] = clampPosition(
            safeBox.left + (safeBox.width - size.w) / 2,
            safeBox.top + (safeBox.height - size.h) / 2,
            size.w,
            size.h,
            safeBox
          );
        } else {
          // Already exists → RE-CLAMP (important!)
          next[uid] = clampPosition(
            next[uid].x,
            next[uid].y,
            size.w,
            size.h,
            safeBox
          );
        }
      });

      return next;
    });
  }, [
    safeUids.length ? safeUids.join(",") : "",
    JSON.stringify(safeSizes),
    safeBox.left,
    safeBox.top,
    safeBox.width,
    safeBox.height,
  ]);

  return { positions, setPositions };
}
