// 📏 Manages image size state by initializing defaults and keeping canvas sizes in sync with external image state changes.

import { useEffect, useState } from "react";

export function useImageSizes(
  uids?: string[],
  imageState?: Record<string, any>
) {
  const [sizes, setSizes] = useState<Record<string, { w: number; h: number }>>({});

  const safeUids = Array.isArray(uids) ? uids : [];

  // init sizes once
  useEffect(() => {
    setSizes(prev => {
      const next = { ...prev };

      safeUids.forEach(uid => {
        if (!next[uid]) {
          const s = imageState?.[uid]?.size ?? { w: 150, h: 150 };
          next[uid] = { w: Math.max(1, s.w), h: Math.max(1, s.h) };
        }
      });

      return next;
    });
  }, [safeUids.join(","), imageState]);

  // sync sidebar → canvas
  useEffect(() => {
    if (!imageState) return;

    setSizes(prev => {
      let changed = false;
      const next = { ...prev };

      Object.entries(imageState).forEach(([uid, s]) => {
        if (!s?.size) return;
        if (!prev[uid] || prev[uid].w !== s.size.w || prev[uid].h !== s.size.h) {
          next[uid] = s.size;
          changed = true;
        }
      });

      return changed ? next : prev;
    });
  }, [imageState]);

  return { sizes, setSizes };
}
