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
  const prevSelectedRef = useRef<string[]>([]);

  useEffect(() => {
    const prev = prevSelectedRef.current;
    const isSame =
      prev.length === selected.length &&
      prev.every((v, i) => v === selected[i]);
    if (isSame) return;

    prevSelectedRef.current = selected;
    onSelectionChange?.(selected);

    if (selected.length === 0) {
      onSwitchTab?.(null);
      return;
    }

    if (selected.length > 1) {
      onSwitchTab?.("multi");
      return;
    }

    const uid = selected[0];
    const layer = imageState[uid];
    if (!layer) return;

    if (layer.type === "text") {
      onSelectText?.(uid);
      onSwitchTab?.("text");
      return;
    }

    if (layer.type === "image") {
      onSelectImage?.(uid);
      // FIX: uploaded images → open "image-properties" tab
      onSwitchTab?.(layer.isClipart ? "clipart" : "image-properties");
    }
  }, [selected, imageState, onSelectImage, onSelectText, onSwitchTab, onSelectionChange]);

  return null;
}
