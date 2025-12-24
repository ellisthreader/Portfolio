// 📐 Scales and repositions multiple selected images together by resizing them as a group relative to their bounding box during mouse drag.


import { computeBoundingBox } from "../Utils/boundingBox";


export function useGroupResize({
  selected,
  sizes,
  positions,
  setSizes,
  setPositions,
  restrictedBox,
  setImageState,
}: any) {
  const startResize = (startX: number) => {
    const box = computeBoundingBox(selected, positions, sizes);
    if (!box) return;

    const startSizes = structuredClone(sizes);
    const startPos = structuredClone(positions);

    const move = (e: MouseEvent) => {
      const scale = Math.exp((e.clientX - startX) / 200);

      setSizes(prev => {
        const next = { ...prev };
        selected.forEach(u => {
          next[u] = {
            w: startSizes[u].w * scale,
            h: startSizes[u].h * scale,
          };
        });
        return next;
      });

      setPositions(prev => {
        const next = { ...prev };
        selected.forEach(u => {
          const rx = startPos[u].x - box.left;
          const ry = startPos[u].y - box.top;
          next[u] = {
            x: box.left + rx * scale,
            y: box.top + ry * scale,
          };
        });
        return next;
      });

      setImageState?.((prev: any) => {
        const next = { ...prev };
        selected.forEach(u => {
          next[u] = {
            ...prev[u],
            size: {
              w: startSizes[u].w * scale,
              h: startSizes[u].h * scale,
            },
          };
        });
        return next;
      });
    };

    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  return { startResize };
}
