"use client";

import React from "react";
import UploadedImagesLayer from "./UploadedImagesLayer";
import MainProductImage from "./MainProductImage";
import RestrictedArea from "./RestrictedArea";
import Marquee from "./Marquee";
import SelectionBox from "../SelectionBox";
import TextSelectionBox from "../SelectionBox/TextSelectionBox/TextSelectionBox";

import { useDragSelection } from "./Hooks/useDragSelection";
import { useMarqueeSelection } from "./Hooks/useMarqueeSelection";
import { useImageSizes } from "./Hooks/useImageSizes";
import { useImagePositions } from "./Hooks/useImagePositions";
import { useGroupResize } from "./Hooks/useGroupResize";
import { useDuplicateImages } from "./Hooks/useDuplicateImages";
import DraggableText from "./DraggableText";
import SelectionWatcher from "../Components/SelectionWatcher";


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
  onResizeText?: (uid: string, newFontSize: number) => void;
  onReset?: (uids: string[]) => void;

  onSelectImage?: (uid: string | null) => void;
  onSelectText?: (uid: string | null) => void;
  onSwitchTab?: (tab: string) => void;
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
    onResizeText
  } = props;

  // --------------------- Image sizes ---------------------
  const { sizes, setSizes } = useImageSizes(uploadedImages, imageState);

  // --------------------- Image positions ---------------------
// include EVERYTHING that exists in imageState
const allUids = Object.keys(imageState);

const { positions, setPositions } = useImagePositions(
  allUids,
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

  // --------------------- Split selection ---------------------
  const selectedImages = drag.selected.filter(
    (uid) => imageState[uid]?.type === "image"
  );

  const selectedText = drag.selected.filter(
    (uid) => imageState[uid]?.type === "text"
  );

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
    uids: allUids,
    onSelect: drag.setSelected,
  });


  // --------------------- Duplicate hook ---------------------
  const duplicateImages = useDuplicateImages({
    setPositions,
    setSizes,
    setImageState: props.setImageState,
    setUploadedImages: props.setUploadedImages,
  });

  const handleDuplicateFromSelectionBox = () => {
    if (drag.selected.length === 0) return;
    duplicateImages(drag.selected);
  };

  const handleDeleteFromSelectionBox = (uids: string[]) => {
    if (!props.onDelete) return;
    props.onDelete(uids);
  };

// --------------------- Canvas pointer down ---------------------
const handleCanvasPointerDown = (e: React.PointerEvent) => {
  const target = e.target as HTMLElement;

  if (target.closest(".selection-button")) return;

  const uid = (target.closest("[data-uid]") as HTMLElement)?.dataset.uid;

  // 👉 EMPTY SPACE → marquee
  if (!uid) {
    drag.setSelected([]);
    onSelectImage?.(null);
    onSelectText?.(null);
    marquee.onPointerDown(e);
    return;
  }

  const layer = imageState[uid];
  if (!layer) return;

  // 👉 TEXT
  if (layer.type === "text") {
    onSelectText?.(uid);
    onSwitchTab?.("text");
    drag.setSelected([uid]);

    // 🚫 NO MARQUEE FOR TEXT
    drag.onPointerDown(e, uid);
    return;
  }

  // 👉 IMAGE
  onSelectText?.(null);
  drag.setSelected([uid]);
  onSelectImage?.(uid);

  drag.onPointerDown(e, uid);

  // 👍 ONLY images or canvas background should allow marquee logic
  // (this simply records pointer start but won't run while dragging)
  // If you prefer: you can even remove this line completely.
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

      {/* IMAGES */}
      <UploadedImagesLayer
        uids={uploadedImages}
        positions={positions}
        sizes={sizes}
        imageState={imageState}
        selected={drag.selected}
        hovered={marquee.hovered}
        onPointerDown={drag.onPointerDown}
      />
      
  {/* TEXT */}
  {Object.entries(imageState)
    .filter(([_, layer]) => layer.type === "text")
    .map(([uid, layer]: any) => {
      const p = positions[uid] ?? { x: 200, y: 200 };

      return (
        <DraggableText
          key={uid}
          uid={uid}
          text={layer.text}
          pos={p}

          // ✅ width uncontrolled
          // ✅ height follows fontSize only
          size={{ w: undefined, h: layer.fontSize }}

          rotation={layer.rotation ?? 0}
          flip={layer.flip ?? "none"}
          fontFamily={layer.fontFamily}
          color={layer.color}
          borderColor={layer.borderColor}
          borderWidth={layer.borderWidth}
          highlighted={drag.selected.includes(uid)}
          selected={drag.selected}
          onPointerDown={drag.onPointerDown}

          // ✅ READ-ONLY measurement
          onMeasure={(uid, w, h) => {
            setSizes(prev => {
              const existing = prev[uid];
              if (
                existing &&
                Math.abs(existing.w - w) < 0.5 &&
                Math.abs(existing.h - h) < 0.5
              ) {
                return prev;
              }
              return { ...prev, [uid]: { w, h } };
            });
          }}
        />
      );
    })}





      {/* IMAGE SELECTION BOX */}
      {selectedImages.length > 0 && (
        <SelectionBox
          selectedImages={selectedImages}
          canvasRef={drag.selectionBoxProps.canvasRef}
          onDuplicate={handleDuplicateFromSelectionBox}
          onStartGroupResize={groupResize.startResize}
          onDelete={handleDeleteFromSelectionBox}
          onResize={drag.selectionBoxProps.onResize}
          onDeselectAll={drag.selectionBoxProps.onDeselectAll}
        />
      )}

      {/* TEXT SELECTION BOX */}
      {selectedText.length > 0 && (
        <TextSelectionBox
          selectedText={selectedText}
          canvasRef={drag.selectionBoxProps.canvasRef}
          onDuplicate={handleDuplicateFromSelectionBox}
          onDelete={handleDeleteFromSelectionBox}
          onDeselectAll={drag.selectionBoxProps.onDeselectAll}
          onResizeText={onResizeText}
          restrictedBox={restrictedBox}
        />
      )}

      <SelectionWatcher
        selected={drag.selected}          // the currently selected UIDs
        imageState={imageState}           // full image/text state
        onSelectImage={onSelectImage}     // callback for single image selection
        onSelectText={onSelectText}       // callback for single text selection
        onSwitchTab={onSwitchTab}         // callback to switch sidebar tab
        onSelectionChange={props.onSelectionChange} // NEW: reports full selection array
      />


      <Marquee marquee={marquee.marquee} />
    </div>
  );
}
