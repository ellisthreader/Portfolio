import { useEffect, useRef } from "react";

type Layer =
  | { type: "text" }
  | { type: "image"; isClipart?: boolean };

type Props = {
  selected: string[];
  imageState: Record<string, Layer>;
  onSelectImage?: (uid: string | null) => void;
  onSelectText?: (uid: string | null) => void;
  onSwitchTab?: (tab: string | null) => void;

  // optional external observer
  onSelectionChange?: (selected: string[]) => void;
};

export default function SelectionWatcher({
  selected,
  imageState,
  onSelectImage,
  onSelectText,
  onSwitchTab,
  onSelectionChange,
}: Props) {
  // Keep track of previous selection to prevent loops
  const prevSelectedRef = useRef<string[]>([]);

  useEffect(() => {
    const prevSelected = prevSelectedRef.current;

    // Check if selection has actually changed
    const isSame =
      prevSelected.length === selected.length &&
      prevSelected.every((v, i) => v === selected[i]);

    if (isSame) return; // ✅ skip if no change

    prevSelectedRef.current = selected;

    // Notify external listeners
    onSelectionChange?.(selected);

    // ---------------- EMPTY ----------------
    if (selected.length === 0) {
      onSelectImage?.(null);
      onSelectText?.(null);
      onSwitchTab?.(null);
      return;
    }

    // ---------------- MULTI ----------------
    if (selected.length > 1) {
      onSelectImage?.(null);
      onSelectText?.(null);
      onSwitchTab?.("multi");
      return;
    }

    // ---------------- SINGLE ----------------
    const uid = selected[0];
    const layer = imageState[uid];
    if (!layer) return;

    // TEXT
    if (layer.type === "text") {
      onSelectText?.(uid);
      onSelectImage?.(null);
      onSwitchTab?.("text");
      return;
    }

    // IMAGE (UPLOAD vs CLIPART)
    if (layer.type === "image") {
      onSelectText?.(null);
      onSelectImage?.(uid);

      if (layer.isClipart) {
        onSwitchTab?.("clipart"); // ✅ DO NOT FALL THROUGH
      } else {
        onSwitchTab?.("upload");
      }
    }
  }, [
    selected,
    imageState,
    onSelectImage,
    onSelectText,
    onSwitchTab,
    onSelectionChange,
  ]);

  return null;
}
