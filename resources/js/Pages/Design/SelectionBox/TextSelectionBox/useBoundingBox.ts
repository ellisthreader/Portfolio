import { useEffect, useState } from "react";

export function useBoundingBox(
  selectedText: string[],
  canvasRef: React.RefObject<HTMLDivElement>
) {
  const [box, setBox] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  const update = () => {
    if (!canvasRef.current || selectedText.length === 0) {
      setBox(null);
      return;
    }

    const canvasRect = canvasRef.current.getBoundingClientRect();
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    selectedText.forEach(uid => {
      const el = document.querySelector<HTMLElement>(
        `[data-uid="${CSS.escape(uid)}"][data-type="text"]`
      );
      if (!el) return;

      const r = el.getBoundingClientRect();
      const x = r.left - canvasRect.left;
      const y = r.top - canvasRect.top;

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + r.width);
      maxY = Math.max(maxY, y + r.height);
    });

    if (minX === Infinity) {
      setBox(null);
      return;
    }

    setBox({
      left: minX,
      top: minY,
      width: maxX - minX,
      height: maxY - minY
    });
  };

  useEffect(() => {
    update();
    const handle = () => update();
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, [selectedText, canvasRef]);

  return { box, update };
}
