"use client";

import React, { useEffect } from "react";
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
import { useTextAutoShrink } from "./Hooks/TextAutoShrink";


function fitsInRestrictedBox(
  x: number,
  y: number,
  w: number,
  h: number,
  box: { left: number; top: number; width: number; height: number }
) {
  return (
    x >= box.left &&
    y >= box.top &&
    x + w <= box.left + box.width &&
    y + h <= box.top + box.height
  );
}



// 🔧 Helper: checks if text touches the restricted box
function rectsIntersect(
  a: { x: number; y: number; w: number; h: number },
  b: { left: number; top: number; width: number; height: number }
) {
  return !(
    a.x + a.w < b.left ||
    a.x > b.left + b.width ||
    a.y + a.h < b.top ||
    a.y > b.top + b.height
  );
}



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
  onResizeTextCommit: (uid: string, newFontSize: number) => void;
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
    onResizeTextCommit,
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
  // --------------------- Text shrink auto ---------------------

  useTextAutoShrink({
    imageState,
    positions,
    sizes,
    restrictedBox,
    onResizeText: onResizeTextCommit,
  });


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

      const fontSize = layer.fontSize ?? 24; // ✅ hard default
      const size = sizes[uid] ?? { w: 200, h: fontSize };

      return (
        <DraggableText
          key={uid}
          uid={uid}
          text={layer.text ?? ""}
          pos={p}
          size={size}
          rotation={layer.rotation ?? 0}
          flip={layer.flip ?? "none"}
          fontFamily={layer.fontFamily ?? "Arial"}
          color={layer.color ?? "#000"}
          borderColor={layer.borderColor}
          borderWidth={layer.borderWidth}
          highlighted={drag.selected.includes(uid)}
          selected={drag.selected}
          onPointerDown={drag.onPointerDown}
          fontSize={fontSize}   // ✅ single source of truth
          onMeasure={(uid, w, h) => {
            setSizes(prev => {
              const existing = prev[uid];
              
                 console.log("🧠 SIZE STATE UPDATE", {
                    uid,
                    previous: existing,
                    next: { w, h },
                  });

              // Round to 0.1px to avoid tiny floating-point jitter
              const roundedW = Math.round(w * 10) / 10;
              const roundedH = Math.round(h * 10) / 10;

              const firstMeasure = !existing;
              const changed =
                firstMeasure ||
                Math.abs(existing?.w - roundedW) >= 0.5 ||
                Math.abs(existing?.h - roundedH) >= 0.5;

              if (!changed) {
                // no significant change → skip re-render
                return prev;
              }

              // ✅ Log for debugging
              console.log("🔺 setSizes updating:", uid, existing, "->", { w: roundedW, h: roundedH });

              // ✅ Update sizes
              return {
                ...prev,
                [uid]: { w: roundedW, h: roundedH },
              };
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
          onResizeText={onResizeTextCommit}
          restrictedBox={restrictedBox}
          positions={positions}
          imageState={imageState}
          sizes={sizes}   
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
