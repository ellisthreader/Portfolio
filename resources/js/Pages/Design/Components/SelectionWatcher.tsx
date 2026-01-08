import { useEffect } from "react";

type Props = {
  selected: string[];
  imageState: Record<string, { type: "image" | "text" }>;
  onSelectImage?: (uid: string | null) => void;
  onSelectText?: (uid: string | null) => void;
  onSwitchTab?: (tab: string) => void;

  // Add this to support multi-selection or other callbacks
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
  useEffect(() => {
    // Call the selection change callback if provided
    onSelectionChange?.(selected);

    // NOTHING SELECTED
    if (selected.length === 0) {
      onSelectImage?.(null);
      onSelectText?.(null);
      return;
    }

    // MULTI SELECT
    if (selected.length > 1) {
      onSelectImage?.(null);
      onSelectText?.(null);
      onSwitchTab?.("multi"); // this triggers your MultiSelectPanel
      return;
    }

    // SINGLE SELECT
    const uid = selected[0];
    const layer = imageState[uid];
    if (!layer) return;

    if (layer.type === "text") {
      onSelectText?.(uid);
      onSwitchTab?.("text");
      onSelectImage?.(null);
    } else {
      onSelectImage?.(uid);
      onSelectText?.(null);
      onSwitchTab?.("upload");
    }
  }, [selected, imageState, onSelectImage, onSelectText, onSwitchTab, onSelectionChange]);

  return null;
}
