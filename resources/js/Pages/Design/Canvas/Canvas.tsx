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
import DraggableText from "./DraggableText";

export type CanvasProps = {
  canvasRef: React.RefObject<HTMLDivElement>;
  mainImage: string;
  restrictedBox: { left: number; top: number; width: number; height: number };

  uploadedImages: string[];
  setUploadedImages: React.Dispatch<React.SetStateAction<string[]>>;

  imageState: Record<string, any>;
  setImageState: React.Dispatch<any>;

  onDelete?: (uids: string[]) => void;
  onDuplicate?: (uids: string[]) => void;
  onResize?: (uid: string, w: number, h: number) => void;
  onReset?: (uids: string[]) => void;

  onSelectImage?: (uid: string | null) => void;
  onSelectText?: (uid: string | null) => void;  // ✅ New prop
  onSwitchTab?: (tab: string) => void;          // ✅ New prop
};

export default function Canvas(props: CanvasProps) {
  const {
    canvasRef,
    restrictedBox,
    mainImage,
    uploadedImages,
    imageState,
    onSelectImage,
    onSelectText,
    onSwitchTab,
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
    setImageState: props.setImageState,
  });

  // --------------------- Marquee selection ---------------------
  const marquee = useMarqueeSelection({
    canvasRef,
    uids: uploadedImages,
    onSelect: drag.setSelected,
  });

  // --------------------- Duplicate hook ---------------------
  const duplicateImages = useDuplicateImages({
    setPositions,
    setSizes,
    setImageState: props.setImageState,
    setUploadedImages: props.setUploadedImages,
  });

  // --------------------- SelectionBox duplicate ---------------------
  const handleDuplicateFromSelectionBox = () => {
    if (drag.selected.length === 0) return;
    duplicateImages(drag.selected);
  };

  // --------------------- SelectionBox delete ---------------------
  const handleDeleteFromSelectionBox = (uids: string[]) => {
    if (!props.onDelete) return;
    props.onDelete(uids);
  };

  // --------------------- Canvas pointer down ---------------------
  const handleCanvasPointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;

    if (target.closest(".selection-button")) return;

    const uid = (target.closest("[data-uid]") as HTMLElement)?.dataset.uid;
    if (!uid) {
      // clicked empty canvas
      drag.setSelected([]);
      onSelectImage?.(null);
      onSelectText?.(null); // deselect any text layer
      marquee.onPointerDown(e);
      return;
    }

    const layer = imageState[uid];
    if (!layer) return;

    if (layer.type === "text") {
      // ---------------- TEXT LAYER ----------------
      onSelectText?.(uid);       // select text layer
      onSwitchTab?.("text");     // switch sidebar to text tab
      drag.setSelected([]);       // deselect any images
    } else {
      // ---------------- IMAGE LAYER ----------------
      onSelectText?.(null);      // deselect text layers
      if (!drag.selected.includes(uid)) {
        drag.setSelected([uid]);
      }
      onSelectImage?.(uid);
    }

    // Always allow dragging/marquee selection
    drag.onPointerDown(e, uid);
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

    {Object.entries(imageState)
      .filter(([_, layer]) => layer.type === "text")
      .map(([uid, layer]: any) => (
        <DraggableText
          key={uid}
          uid={uid}
          text={layer.text}
          pos={positions[uid] ?? { x: 200, y: 200 }}
          size={layer.size}
          rotation={layer.rotation ?? 0}
          flip={layer.flip ?? "none"}
          fontFamily={layer.fontFamily}
          color={layer.color}
          borderColor={layer.borderColor}
          borderWidth={layer.borderWidth}
          highlighted={drag.selected.includes(uid)}
          selected={drag.selected}
          onPointerDown={drag.onPointerDown}
        />
      ))}


      {drag.selected.length > 0 && (
        <SelectionBox
          {...drag.selectionBoxProps}
          onDuplicate={handleDuplicateFromSelectionBox}
          onStartGroupResize={groupResize.startResize}
          onDelete={handleDeleteFromSelectionBox}
        />
      )}

      <Marquee marquee={marquee.marquee} />
    </div>
  );
}

