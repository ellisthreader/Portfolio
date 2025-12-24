// 🗂️ Renders and layers all uploaded images on the canvas, passing position, size, and selection state to each draggable image.


import DraggableImage from "./DraggableImage";

type Props = {
  uids: string[];
  positions: Record<string, { x: number; y: number }>;
  sizes: Record<string, { w: number; h: number }>;
  imageState: any;
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
      {uids.map(uid => {
        const s = sizes[uid];
        const p = positions[uid];
        if (!s || !p) return null;

        return (
          <DraggableImage
            key={uid}
            uid={uid}
            url={imageState[uid]?.url ?? uid}
            pos={p}
            size={s}
            rotation={imageState[uid]?.rotation ?? 0}
            flip={imageState[uid]?.flip ?? "none"}
            highlighted={selected.includes(uid) || hovered[uid]}
            onPointerDown={onPointerDown}
          />
        );
      })}
    </>
  );
}
