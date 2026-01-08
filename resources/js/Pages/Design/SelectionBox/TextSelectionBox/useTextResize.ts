// useTextResize.ts
import { Dispatch, SetStateAction } from "react";

export function useTextResize(
  firstUid: string | null,
  canvasRef: React.RefObject<HTMLDivElement>,
  restrictedBox: { left: number; top: number; width: number; height: number },
  getFontSize: (uid: string) => number,
  setFontSizes: Dispatch<SetStateAction<Record<string, number>>>,
  onResizeText: (uid: string, size: number) => void,
  getTextBoxSize: (uid: string, fontSize: number) => { w: number; h: number } | undefined
) {
  return (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!firstUid || !canvasRef.current) return;

    const startFont = getFontSize(firstUid);
    const minFont = 8;
    const sensitivity = 0.005;
    const startX = e.clientX;

    const el = document.querySelector<HTMLElement>(
      `[data-uid="${CSS.escape(firstUid)}"][data-type="text"]`
    );
    if (!el) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const elLeft = elRect.left - canvasRect.left;
    const elTop = elRect.top - canvasRect.top;

    const getFittingFont = (desiredFont: number) => {
      const size = getTextBoxSize(firstUid, desiredFont);
      if (!size) return desiredFont;

      const maxWidth = restrictedBox.width - (elLeft - restrictedBox.left);
      if (size.w <= maxWidth) return desiredFont;

      // shrink proportionally
      return desiredFont * (maxWidth / size.w);
    };

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      let desired = Math.max(minFont, startFont * (1 + dx * sensitivity));
      desired = getFittingFont(desired);

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
