import { useCallback } from "react";

export function useDuplicateImages({
  positions,
  setPositions,
  sizes,
  setSizes,
  imageState,
  setImageState,
  uploadedImages,
  setUploadedImages,
}: {
  positions: Record<string, { x: number; y: number }>;
  setPositions: React.Dispatch<React.SetStateAction<Record<string, { x: number; y: number }>>>;
  sizes: Record<string, { w: number; h: number }>;
  setSizes: React.Dispatch<React.SetStateAction<Record<string, { w: number; h: number }>>>;
  imageState: Record<string, any>;
  setImageState: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  uploadedImages: string[];
  setUploadedImages: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const duplicate = useCallback((uids: string[]) => {
    const newPositions = { ...positions };
    const newSizes = { ...sizes };
    const newImageState = { ...imageState };
    const newUids: string[] = [];

    uids.forEach(uid => {
      const newUid = crypto.randomUUID();
      newUids.push(newUid);
      newPositions[newUid] = { x: positions[uid].x + 20, y: positions[uid].y + 20 };
      newSizes[newUid] = { ...sizes[uid] };
      newImageState[newUid] = { ...imageState[uid] };
    });

    setPositions(newPositions);
    setSizes(newSizes);
    setImageState(newImageState);
    setUploadedImages(prev => [...prev, ...newUids]);

    console.log("Duplication complete. New UIDs:", newUids);
  }, [positions, sizes, imageState, setPositions, setSizes, setImageState, setUploadedImages]);

  return duplicate;
}
