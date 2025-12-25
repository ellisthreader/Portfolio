// 📐 Scales and repositions multiple selected images together by resizing them as a group during mouse drag.
// Prevents images from resizing outside a restricted bounding box.

import { computeBoundingBox } from "../Utils/boundingBox";

export interface GroupResizeParams {
  selected: string[]; // array of selected image uids
  sizes: Record<string, { w: number; h: number }>;
  positions: Record<string, { x: number; y: number }>;
  setSizes: React.Dispatch<React.SetStateAction<Record<string, { w: number; h: number }>>>;
  setPositions: React.Dispatch<React.SetStateAction<Record<string, { x: number; y: number }>>>;
  restrictedBox?: { left: number; top: number; width: number; height: number };
  setImageState?: React.Dispatch<any>; // optional if you track global image state
}

export function useGroupResize({
  selected,
  sizes,
  positions,
  setSizes,
  setPositions,
  restrictedBox,
  setImageState,
}: GroupResizeParams) {
  const startResize = (startX: number) => {
    // Compute initial bounding box of selected images
    const box = computeBoundingBox(positions, sizes, selected);
    if (!box) return;

    const startSizes = structuredClone(sizes);
    const startPos = structuredClone(positions);

    const handleMouseMove = (e: MouseEvent) => {
      let scale = Math.exp((e.clientX - startX) / 200);

      // --- Constrain scale to restricted box if provided ---
      if (restrictedBox) {
        const scaledBox = {
          left: box.left,
          top: box.top,
          width: box.width * scale,
          height: box.height * scale,
        };

        // Horizontal constraints
        if (scaledBox.left < restrictedBox.left) {
          scale = (restrictedBox.left + restrictedBox.width - box.left) / box.width;
        }
        if (scaledBox.left + scaledBox.width > restrictedBox.left + restrictedBox.width) {
          scale = Math.min(
            scale,
            (restrictedBox.left + restrictedBox.width - box.left) / box.width
          );
        }

        // Vertical constraints
        if (scaledBox.top < restrictedBox.top) {
          scale = Math.min(
            scale,
            (restrictedBox.top + restrictedBox.height - box.top) / box.height
          );
        }
        if (scaledBox.top + scaledBox.height > restrictedBox.top + restrictedBox.height) {
          scale = Math.min(
            scale,
            (restrictedBox.top + restrictedBox.height - box.top) / box.height
          );
        }
      }

      // --- Apply scale to sizes ---
      setSizes(prev => {
        const next = { ...prev };
        selected.forEach(uid => {
          next[uid] = {
            w: startSizes[uid].w * scale,
            h: startSizes[uid].h * scale,
          };
        });
        return next;
      });

      // --- Apply scale to positions ---
      setPositions(prev => {
        const next = { ...prev };
        selected.forEach(uid => {
          const rx = startPos[uid].x - box.left;
          const ry = startPos[uid].y - box.top;
          next[uid] = {
            x: box.left + rx * scale,
            y: box.top + ry * scale,
          };
        });
        return next;
      });

      // Optional: update global image state
      if (setImageState) {
        setImageState((prev: any) => {
          const next = { ...prev };
          selected.forEach(uid => {
            next[uid] = {
              ...prev[uid],
              size: {
                w: startSizes[uid].w * scale,
                h: startSizes[uid].h * scale,
              },
            };
          });
          return next;
        });
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return { startResize };
}
