import { useCallback } from "react";

type Positions = Record<string, { x: number; y: number }>;
type Sizes = Record<string, { w: number; h: number }>;
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
    const newUids: string[] = [];

    // positions
  setPositions(prev => {
    const next = { ...prev };

    uids.forEach(uid => {
      // 💡 create a new key based on original url/id
      const newUid = `${uid}#dup-${Date.now()}`;
      newUids.push(newUid);

      const p = prev[uid];
      if (p) {
        next[newUid] = { x: p.x + 20, y: p.y + 20 };
      }
    });

    return next;
  });


    // sizes
    setSizes(prev => {
      const next = { ...prev };
      uids.forEach((uid, idx) => {
        const newUid = newUids[idx];
        if (prev[uid]) next[newUid] = { ...prev[uid] };
      });
      return next;
    });

    // image state
    setImageState(prev => {
      const next = { ...prev };
      uids.forEach((uid, idx) => {
        const newUid = newUids[idx];
        if (prev[uid]) next[newUid] = { ...prev[uid] };
      });
      return next;
    });

    // uploaded images
    setUploadedImages(prev => [...prev, ...newUids]);

    console.log("Duplication complete. New UIDs:", newUids);
  }, [setPositions, setSizes, setImageState, setUploadedImages]);

  return duplicate;
}
