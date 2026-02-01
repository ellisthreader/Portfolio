import { useCallback } from "react";

type Position = { x: number; y: number };
type Size = { w: number; h: number };

type Positions = Record<string, Position>;
type Sizes = Record<string, Size>;
type ImageState = Record<string, any>;

export function useDuplicateImages({
  setPositions,
  setSizes,
  setImageState,
  setUploadedImages,
}: {
  setPositions: React.Dispatch<React.SetStateAction<Positions>>;
  setSizes: React.Dispatch<React.SetStateAction<Sizes>>;
  setImageState: React.Dispatch<React.SetStateAction<ImageState>>;
  setUploadedImages: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const duplicate = useCallback((uids: string[]) => {
    console.log("🟡 Duplicate requested for:", uids);

    // 🔑 Stable UID map (VERY important)
    const uidMap = new Map<string, string>();

    uids.forEach(uid => {
      uidMap.set(uid, crypto.randomUUID());
    });

    /* ---------------- POSITIONS ---------------- */
    setPositions(prev => {
      const next = { ...prev };

      uidMap.forEach((newUid, oldUid) => {
        const p = prev[oldUid];
        if (!p) {
          console.warn("⚠️ No position for", oldUid);
          return;
        }

        next[newUid] = {
          x: p.x + 20,
          y: p.y + 20,
        };
      });

      console.log("🟢 Positions duplicated:", next);
      return next;
    });

    /* ---------------- SIZES ---------------- */
    setSizes(prev => {
      const next = { ...prev };

      uidMap.forEach((newUid, oldUid) => {
        const s = prev[oldUid];
        if (!s) {
          console.warn("⚠️ No size for", oldUid);
          return;
        }

        next[newUid] = { ...s };
      });

      console.log("🟢 Sizes duplicated:", next);
      return next;
    });

    /* ---------------- IMAGE STATE (CRITICAL FIX) ---------------- */
setImageState(prev => {
  const next = { ...prev };

  uidMap.forEach((newUid, oldUid) => {
    const src = prev[oldUid];
    if (!src) {
      console.warn("⚠️ No imageState for", oldUid);
      return;
    }

    const oldCanvasPos = src.canvasPositions?.[oldUid];

    next[newUid] = {
      ...src,
      renderKey: crypto.randomUUID(),

      // 🔥 FIX: rewrite canvasPositions to the NEW UID
      canvasPositions: oldCanvasPos
        ? {
            [newUid]: {
              ...oldCanvasPos,
              x: oldCanvasPos.x + 20,
              y: oldCanvasPos.y + 20,
            },
          }
        : {},
    };
  });

  console.log("🟢 ImageState duplicated (canvasPositions fixed):", next);
  return next;
});


    /* ---------------- UPLOADED IMAGES ---------------- */
    setUploadedImages(prev => {
      const next = [...prev, ...Array.from(uidMap.values())];
      console.log("🟢 UploadedImages updated:", next);
      return next;
    });

    console.log(
      "✅ Duplication complete. New UIDs:",
      Array.from(uidMap.values())
    );
  }, [setPositions, setSizes, setImageState, setUploadedImages]);

  return duplicate;
}
