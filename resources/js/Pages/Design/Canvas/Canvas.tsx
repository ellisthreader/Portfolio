// 🧩 Composes the interactive canvas by coordinating image rendering, selection, dragging, resizing, and marquee-based multi-selection.


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

export type CanvasProps = {
  canvasRef: React.RefObject<HTMLDivElement>;
  mainImage: string;
  restrictedBox: { left: number; top: number; width: number; height: number };
  uploadedImages: string[];
  imageState: Record<string, { src: string; size?: { w: number; h: number } }>;
  onDelete?: (uids: string[]) => void;
  onDuplicate?: (uids: string[]) => void;
  onResize?: (uid: string, w: number, h: number) => void;
  onReset?: (uids: string[]) => void;
};

export default function Canvas(props: CanvasProps) {
  const { canvasRef, uploadedImages, imageState, restrictedBox, mainImage } = props;

  // --------------------- Image sizes ---------------------
  const { sizes } = useImageSizes(uploadedImages, imageState);

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
    multiDrag: true, // ✅ Enable multi-drag support
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
    const uid = target.dataset.uid;

    if (target.dataset.type !== "img") {
      // Clicked outside an image → deselect all
      drag.setSelected([]);
    } else {
      // Clicked on an image
      if (!drag.selected.includes(uid!)) {
        // Not already selected → select only this image
        drag.setSelected([uid!]);
      }
      // ✅ Start dragging all selected images
      drag.onPointerDown(e, uid!);
    }

    // Pass event to marquee
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

      {drag.selected.length > 0 && <SelectionBox {...drag.selectionBoxProps} />}

      <Marquee marquee={marquee.marquee} />
    </div>
  );
}
