"use client";

import React from "react";
import UploadedImagesLayer from "./UploadedImagesLayer";
import MainProductImage from "./MainProductImage";
import RestrictedArea from "./RestrictedArea";
import Marquee from "./Marquee";
import SelectionBox from "../SelectionBox";

import { useDragSelection } from "./Hooks/useDragSelection";
import { useMarqueeSelection } from "./Hooks/useMarqueeSelection";
import { useImageSizes } from "./Hooks/useImageSizes";
import { useImagePositions } from "./Hooks/useImagePositions";
import { useGroupResize } from "./Hooks/useGroupResize";
import { useDuplicateImages } from "./Hooks/useDuplicateImages";

export type CanvasProps = {
  canvasRef: React.RefObject<HTMLDivElement>;
  mainImage: string;
  restrictedBox: { left: number; top: number; width: number; height: number };
  uploadedImages: string[];
  imageState: Record<
    string,
    { src: string; size?: { w: number; h: number } }
  >;
  onDelete?: (uids: string[]) => void;
  onDuplicate?: (uids: string[]) => void;
  onResize?: (uid: string, w: number, h: number) => void;
  onReset?: (uids: string[]) => void;

  // 👇 important — this controls the SIDEBAR selection
  onSelectImage?: (uid: string | null) => void;
};

export default function Canvas(props: CanvasProps) {
  const {
    canvasRef,
    restrictedBox,
    mainImage,
    imageState,
    uploadedImages,
    onSelectImage,
  } = props;

  // --------------------- Image sizes ---------------------
  const { sizes, setSizes } = useImageSizes(uploadedImages, imageState);

  // --------------------- Image positions ---------------------
  const { positions, setPositions } = useImagePositions(
    uploadedImages,
    sizes,
    restrictedBox
  );

  // --------------------- Drag selection ---------------------
  const drag = useDragSelection({
    uids: uploadedImages,
    sizes,
    positions,
    setPositions,
    canvasRef,
    restrictedBox,
    onDelete: props.onDelete,
    onDuplicate: props.onDuplicate,
    onResize: props.onResize,
    onReset: props.onReset,
    multiDrag: true,
  });

  // --------------------- Group resize ---------------------
  const groupResize = useGroupResize({
    selected: drag.selected,
    sizes,
    positions,
    setSizes,
    setPositions,
    restrictedBox,
  });

  // --------------------- Duplicate images ---------------------
  const duplicateImages = useDuplicateImages({
    positions,
    setPositions,
    sizes,
    setSizes,
    imageState,
    uploadedImages,
  });

  // --------------------- Marquee selection ---------------------
  const marquee = useMarqueeSelection({
    canvasRef,
    uids: uploadedImages,
    onSelect: drag.setSelected,
  });

  // --------------------- Canvas pointer down ---------------------
  const handleCanvasPointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;

    // Ignore resize / duplicate handles etc
    if (target.closest(".selection-button")) return;

    const uid = target.dataset.uid;

    // -------- click EMPTY SPACE --------
    if (target.dataset.type !== "img") {
      drag.setSelected([]);
      onSelectImage?.(null); // 👈 clear sidebar
      marquee.onPointerDown(e);
      return;
    }

    // -------- click IMAGE --------
    if (!drag.selected.includes(uid!)) {
      drag.setSelected([uid!]);
    }

    // 👇 tell sidebar WHICH uploaded image is active
    onSelectImage?.(uid!);

    drag.onPointerDown(e, uid!);
    marquee.onPointerDown(e);
  };

  return (
    <div
      ref={canvasRef}
      className="flex-1 relative bg-gray-200 dark:bg-gray-800"
      onPointerDown={handleCanvasPointerDown}
      onPointerMove={marquee.onPointerMove}
    >
      <MainProductImage src={mainImage} />
      <RestrictedArea box={restrictedBox} />

      <UploadedImagesLayer
        uids={uploadedImages}
        positions={positions}
        sizes={sizes}
        imageState={imageState}
        selected={drag.selected}
        hovered={marquee.hovered}
        onPointerDown={drag.onPointerDown}
      />

      {drag.selected.length > 0 && (
        <SelectionBox
          {...drag.selectionBoxProps}
          onDuplicate={duplicateImages}
          onStartGroupResize={groupResize.startResize}
        />
      )}

      <Marquee marquee={marquee.marquee} />
    </div>
  );
}
