// useTextResize.ts
import { Dispatch, SetStateAction } from "react";

export function useTextResize(
  firstUid: string | null,
  canvasRef: React.RefObject<HTMLDivElement>,
  restrictedBox: { left: number; top: number; width: number; height: number },
  getFontSize: (uid: string) => number,
  setFontSizes: Dispatch<SetStateAction<Record<string, number>>>,
  onResizeText: (uid: string, size: number) => void
) {
  return (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!firstUid || !canvasRef.current) return;

    const el = document.querySelector<HTMLElement>(
      `[data-uid="${CSS.escape(firstUid)}"][data-type="text"]`
    );
    if (!el) return;

    const startFont = getFontSize(firstUid);
    const minFont = 8;
    const sensitivity = 0.005;
    const startX = e.clientX;

    const canvasRect = canvasRef.current.getBoundingClientRect();

    let lastValidSize = startFont;
    let blocked = false;

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      let desired = Math.max(minFont, startFont * (1 + dx * sensitivity));

      // If blocked and user is still moving outward → ignore
      if (blocked && desired > lastValidSize) {
        return;
      }

      // Measure text size using temporary span
      const style = window.getComputedStyle(el);
      const tmp = document.createElement("span");
      tmp.style.fontFamily = style.fontFamily;
      tmp.style.fontWeight = style.fontWeight;
      tmp.style.fontStyle = style.fontStyle;
      tmp.style.fontSize = `${desired}px`;
      tmp.style.position = "absolute";
      tmp.style.whiteSpace = "nowrap";
      tmp.style.visibility = "hidden";
      tmp.innerText = el.innerText;
      document.body.appendChild(tmp);

      const rect = tmp.getBoundingClientRect();
      document.body.removeChild(tmp);

      const elRect = el.getBoundingClientRect();
      const left = elRect.left - canvasRect.left;
      const top = elRect.top - canvasRect.top;

      const maxRight = restrictedBox.left + restrictedBox.width;
      const maxBottom = restrictedBox.top + restrictedBox.height;

      const exceeds =
        left < restrictedBox.left ||
        top < restrictedBox.top ||
        left + rect.width > maxRight ||
        top + rect.height > maxBottom;

      if (exceeds) {
        // Lock at last valid size
        blocked = true;
        desired = lastValidSize;
      } else {
        blocked = false;
        lastValidSize = desired;
      }

      // Apply
      el.style.fontSize = `${desired}px`;
      setFontSizes(prev => ({ ...prev, [firstUid]: desired }));
      onResizeText(firstUid, desired);
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };
}
