import DraggableImage from "./DraggableImage";

type Props = {
  uids: string[];
  positions: Record<string, { x: number; y: number }>;
  sizes: Record<string, { w: number; h: number }>;
  imageState: Record<string, any>;
  selected: string[];
  hovered: Record<string, boolean>;
  onPointerDown: (e: React.MouseEvent, uid: string) => void;
};

export default function UploadedImagesLayer({
  uids,
  positions,
  sizes,
  imageState,
  selected,
  hovered,
  onPointerDown,
}: Props) {
  return (
    <>
      {uids
        .filter((uid) => imageState[uid]?.type === "image")
        .map((uid) => {
          const s = sizes[uid];
          const p = positions[uid];

          if (!s || !p) return null;

          return (
            <DraggableImage
              key={imageState[uid]?.renderKey ?? uid}
              uid={uid}
              url={imageState[uid]?.src ?? imageState[uid]?.url ?? ""}
              pos={p}
              size={s}
              rotation={imageState[uid]?.rotation ?? 0}
              flip={imageState[uid]?.flip ?? "none"}
              highlighted={selected.includes(uid) || hovered[uid]}
              onPointerDown={onPointerDown}
              color={imageState[uid]?.color ?? "#000000"} // ✅ Ensure color is always passed
            />
          );
        })}
    </>
  );
}
