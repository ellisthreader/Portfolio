// Canvas.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import SelectionBox from "./SelectionBox";

type ImgState = {
  rotation: number;
  flip: "none" | "horizontal" | "vertical";
  size: { w: number; h: number };
};

type CanvasProps = {
  mainImage: string;
  displayImages: string[];
  uploadedImages: string[];
  onSelectImage: (img: string | null) => void;
  restrictedBox: { left: number; top: number; width: number; height: number };
  canvasRef: React.RefObject<HTMLDivElement>;
  onUploadedImageSelect: (img: string | null) => void;
  selectedImage?: string | null;
  onRemoveUploadedImage?: (url: string) => void;
  onDuplicateUploadedImage?: (url: string) => void;
  imageState?: Record<string, ImgState>;
  setImageState?: React.Dispatch<React.SetStateAction<Record<string, ImgState>>>;
  positions: Record<string, { x: number; y: number }>;
  setPositions: React.Dispatch<React.SetStateAction<Record<string, { x: number; y: number }>>>;
};

function DraggableImage({
  uid,
  url,
  pos,
  size,
  rotation = 0,
  flip = "none",
  highlighted,
  onPointerDown,
}: {
  uid: string;
  url: string;
  pos: { x: number; y: number };
  size: { w: number; h: number };
  rotation?: number;
  flip?: "none" | "horizontal" | "vertical";
  highlighted: boolean;
  onPointerDown: (e: React.MouseEvent, uid: string) => void;
}) {
  const scaleX = flip === "horizontal" ? -1 : 1;
  const scaleY = flip === "vertical" ? -1 : 1;

  return (
    <img
      src={url}
      alt=""
      data-type="img"
      data-uid={uid}
      className="absolute object-contain cursor-move"
      style={{
        width: size.w,
        height: size.h,
        left: pos.x,
        top: pos.y,
        zIndex: highlighted ? 150 : 50,
        boxShadow: highlighted ? "0 8px 20px rgba(0,0,0,0.12)" : undefined,
        transform: `rotate(${rotation}deg) scale(${scaleX}, ${scaleY})`,
        transformOrigin: "center center",
        userSelect: "none",
        pointerEvents: "auto",
      }}
      onMouseDown={(e) => onPointerDown(e, uid)}
      draggable={false}
    />
  );
}

export default function Canvas({
  mainImage,
  displayImages,
  uploadedImages,
  onSelectImage,
  restrictedBox,
  canvasRef,
  onUploadedImageSelect,
  onRemoveUploadedImage,
  onDuplicateUploadedImage,
  imageState = {},
  setImageState,
  positions,
  setPositions,
}: CanvasProps) {
  const [localUploads, setLocalUploads] = useState<string[]>([]);
  const [removedSet, setRemovedSet] = useState<Record<string, boolean>>({});
  const [sizes, setSizes] = useState<Record<string, { w: number; h: number }>>({});
  const [selectedUids, setSelectedUids] = useState<string[]>([]);
  const [marquee, setMarquee] = useState<{
    active: boolean;
    startX: number;
    startY: number;
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);
  const [hoveredWhileMarquee, setHoveredWhileMarquee] = useState<Record<string, boolean>>({});

  const allUploaded = [...uploadedImages.filter((u) => !removedSet[u]), ...localUploads];

  const dragRef = useRef<{
    dragging: boolean;
    startX: number;
    startY: number;
    startPositions: Record<string, { x: number; y: number }>;
  }>({ dragging: false, startX: 0, startY: 0, startPositions: {} });

  const queryImgEl = (uid: string) =>
    document.querySelector<HTMLImageElement>(`img[data-uid="${CSS.escape(uid)}"][data-type="img"]`);

  const clampPosition = (x: number, y: number, w: number, h: number) => {
    const clampedX = Math.min(Math.max(x, restrictedBox.left), restrictedBox.left + restrictedBox.width - w);
    const clampedY = Math.min(Math.max(y, restrictedBox.top), restrictedBox.top + restrictedBox.height - h);
    return { x: clampedX, y: clampedY };
  };

  // -------------------- Initialize sizes & positions --------------------
// Initialize + sync sizes from imageState
useEffect(() => {
  setSizes(prev => {
    const next = { ...prev };

    // 1️⃣ Ensure every uploaded image has a size
    allUploaded.forEach((uid) => {
      if (!next[uid]) {
        const s = imageState[uid]?.size ?? { w: 150, h: 150 };
        next[uid] = {
          w: Math.max(1, Math.abs(s.w)),
          h: Math.max(1, Math.abs(s.h)),
        };
      }
    });

    // 2️⃣ Sync sidebar size updates → canvas
    Object.entries(imageState).forEach(([uid, state]) => {
      if (!state?.size) return;

      next[uid] = {
        w: Math.max(1, Math.abs(state.size.w)),
        h: Math.max(1, Math.abs(state.size.h)),
      };
    });

    return next;
  });
}, [allUploaded.join(","), imageState]);


// Initialize positions once sizes are set
useEffect(() => {
  const next: Record<string, { x: number; y: number }> = {};
  allUploaded.forEach((u) => {
    if (!positions[u]) {

      const s = sizes[u];
      if (!s) return;
      const w = s.w;
      const h = s.h;
      
      next[u] = clampPosition(
        restrictedBox.left + (restrictedBox.width - w) / 2,
        restrictedBox.top + (restrictedBox.height - h) / 2,
        w,
        h
      );
    }
  });
  if (Object.keys(next).length) setPositions((prev) => ({ ...prev, ...next }));
  // only run when sizes are ready
}, [sizes, allUploaded.join(","), restrictedBox.left, restrictedBox.top, restrictedBox.width, restrictedBox.height, imageState]);

  // ---------------------- Dragging ----------------------
  const onImagePointerDown = (e: React.MouseEvent, uid: string) => {
    if ((e as any).button && (e as any).button !== 0) return;
    if (marquee?.active) return;
    e.stopPropagation();

    const newSelected = selectedUids.includes(uid) ? selectedUids : [uid];
    setSelectedUids(newSelected);
    onUploadedImageSelect(newSelected[0] ?? null);

    const startPositions: Record<string, { x: number; y: number }> = {};
    newSelected.forEach((u) => {
      startPositions[u] = positions[u] ? { ...positions[u] } : { x: restrictedBox.left, y: restrictedBox.top };
    });

    dragRef.current = { dragging: true, startX: e.clientX, startY: e.clientY, startPositions };

    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current.dragging) return;

      let dx = ev.clientX - dragRef.current.startX;
      let dy = ev.clientY - dragRef.current.startY;

      let maxDxPositive = Infinity,
        maxDxNegative = -Infinity;
      let maxDyPositive = Infinity,
        maxDyNegative = -Infinity;

      Object.entries(dragRef.current.startPositions).forEach(([u, sp]) => {
        const s = sizes[u];
        if (!s) return;
        const minX = restrictedBox.left;
        const minY = restrictedBox.top;
        const maxX = restrictedBox.left + restrictedBox.width - s.w;
        const maxY = restrictedBox.top + restrictedBox.height - s.h;

        maxDxPositive = Math.min(maxDxPositive, maxX - sp.x);
        maxDxNegative = Math.max(maxDxNegative, minX - sp.x);
        maxDyPositive = Math.min(maxDyPositive, maxY - sp.y);
        maxDyNegative = Math.max(maxDyNegative, minY - sp.y);
      });

      dx = Math.min(Math.max(dx, maxDxNegative), maxDxPositive);
      dy = Math.min(Math.max(dy, maxDyNegative), maxDyPositive);

      setPositions((prev) => {
        const next = { ...prev };
        Object.entries(dragRef.current.startPositions).forEach(([u, sp]) => {
          const s = sizes[u] ?? imageState[u]?.size ?? { w: 150, h: 150 };
          next[u] = clampPosition(sp.x + dx, sp.y + dy, s.w, s.h);
        });
        return next;
      });
    };

    const onUp = () => {
      dragRef.current.dragging = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // ---------------------- Marquee ----------------------
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button && e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.dataset?.type === "img") return;

    const rect = canvasRef.current!.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;

    setMarquee({ active: true, startX, startY, x: startX, y: startY, w: 0, h: 0 });
    setSelectedUids([]);
    onUploadedImageSelect(null);
    setHoveredWhileMarquee({});
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!marquee?.active) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const x = Math.min(mx, marquee.startX);
    const y = Math.min(my, marquee.startY);
    const w = Math.abs(mx - marquee.startX);
    const h = Math.abs(my - marquee.startY);

    setMarquee((m) => (m ? { ...m, x, y, w, h } : m));

    const hovered: Record<string, boolean> = {};
    allUploaded.forEach((u) => {
      const el = queryImgEl(u);
      if (!el) return;
      const r = el.getBoundingClientRect();
      const canvasRect = canvasRef.current!.getBoundingClientRect();
      const imgX = r.left - canvasRect.left;
      const imgY = r.top - canvasRect.top;

      if (imgX < x + w && imgX + r.width > x && imgY < y + h && imgY + r.height > y) {
        hovered[u] = true;
      }
    });

    setHoveredWhileMarquee(hovered);
  };

  const finalizeMarqueeSelection = () => {
    if (!marquee) return;
    const hovered = Object.keys(hoveredWhileMarquee).filter((k) => hoveredWhileMarquee[k]);
    setSelectedUids(hovered);
    onUploadedImageSelect(hovered[0] ?? null);
    setMarquee(null);
    setHoveredWhileMarquee({});
  };

  useEffect(() => {
    if (!marquee?.active) return;
    const up = () => finalizeMarqueeSelection();
    window.addEventListener("mouseup", up);
    return () => window.removeEventListener("mouseup", up);
  }, [marquee, hoveredWhileMarquee]);

  // ---------------------- Delete / Duplicate ----------------------
  const handleDeleteMultiple = (uids: string[]) => {
    uids.forEach((uid) => {
      if (localUploads.includes(uid)) {
        setLocalUploads((prev) => prev.filter((u) => u !== uid));
        setSizes((prev) => {
          const next = { ...prev };
          delete next[uid];
          return next;
        });
        setPositions((prev) => {
          const next = { ...prev };
          delete next[uid];
          return next;
        });
      } else if (onRemoveUploadedImage) {
        onRemoveUploadedImage(uid);
      } else {
        setRemovedSet((prev) => ({ ...prev, [uid]: true }));
      }
    });
    setSelectedUids([]);
    onUploadedImageSelect(null);
  };

  const handleDuplicateMultiple = (uids: string[]) => {
    const newSelected: string[] = [];
    uids.forEach((uid) => {
      if (onDuplicateUploadedImage) {
        onDuplicateUploadedImage(uid);
      } else {
        const dupUid = `${uid}#dup-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        setLocalUploads((prev) => [...prev, dupUid]);
        setSizes((prev) => ({ ...prev, [dupUid]: prev[uid] ? { ...prev[uid] } : { w: 150, h: 150 } }));
        setPositions((prev) => {
          const newPos = prev[uid] ? { x: prev[uid].x + 16, y: prev[uid].y + 16 } : { x: restrictedBox.left, y: restrictedBox.top };
          const w = prev[dupUid]?.w ?? 150;
          const h = prev[dupUid]?.h ?? 150;
          return { ...prev, [dupUid]: clampPosition(newPos.x, newPos.y, w, h) };
        });
        newSelected.push(dupUid);
      }
    });

    if (newSelected.length) {
      setSelectedUids(newSelected);
      onUploadedImageSelect(newSelected[0]);
    }
  };

  // ---------------------- Group Resize helpers ----------------------
  const computeBoundingBoxFor = (uids: string[]) => {
    if (uids.length === 0) return null;
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    uids.forEach((u) => {
      const p = positions[u];
      const s = sizes[u];
      if (!p || !s) return;
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x + s.w);
      maxY = Math.max(maxY, p.y + s.h);
    });
    if (minX === Infinity) return null;
    return { left: minX, top: minY, width: maxX - minX, height: maxY - minY };
  };

  const handleSelectionResizeStart = (startClientX: number) => {
    const startBox = computeBoundingBoxFor(selectedUids);
    if (!startBox) return null;

    const startSizes: Record<string, { w: number; h: number }> = {};
    const startPositions: Record<string, { x: number; y: number }> = {};

    selectedUids.forEach((u) => {
      const s = sizes[u];
      const p = positions[u];
      if (!s || !p) return;

      startSizes[u] = { ...s };
      startPositions[u] = { ...p };
    });


    const rafRef = { current: null as number | null };

    const move = (ev: MouseEvent) => {
      if (rafRef.current !== null) return;

      rafRef.current = requestAnimationFrame(() => {
        let dx = ev.clientX - startClientX;

        let minScale = -Infinity;
        let maxScale = Infinity;

        selectedUids.forEach((u) => {
          const s0 = startSizes[u];
          const p0 = startPositions[u];
          if (!s0 || !p0) return;

          const relX = p0.x - startBox.left;
          const relY = p0.y - startBox.top;

          const scaleMaxX =
            (restrictedBox.left + restrictedBox.width - (startBox.left + relX)) / s0.w;
          const scaleMaxY =
            (restrictedBox.top + restrictedBox.height - (startBox.top + relY)) / s0.h;

          const scaleMax = Math.min(scaleMaxX, scaleMaxY);
          const scaleMin = Math.max(30 / s0.w, 30 / s0.h);

          maxScale = Math.min(maxScale, scaleMax);
          minScale = Math.max(minScale, scaleMin);
        });

  const RESIZE_SENSITIVITY = 200;

  const rawScale = Math.exp(dx / RESIZE_SENSITIVITY);

  const clampedScale = Math.min(
    Math.max(rawScale, minScale),
    maxScale
  );

  setSizes((prev) => {
    const next = { ...prev };
    selectedUids.forEach((u) => {
      const s0 = startSizes[u];
      if (!s0) return;
      next[u] = {
        w: Math.max(1, s0.w * clampedScale),
        h: Math.max(1, s0.h * clampedScale),
      };
    });
    return next;
  });

  setPositions((prev) => {
    const next = { ...prev };
    selectedUids.forEach((u) => {
      const relX = startPositions[u].x - startBox.left;
      const relY = startPositions[u].y - startBox.top;

      const w = Math.max(1, startSizes[u].w * clampedScale);
      const h = Math.max(1, startSizes[u].h * clampedScale);

      next[u] = clampPosition(
        startBox.left + relX * clampedScale,
        startBox.top + relY * clampedScale,
        w,
        h
      );
    });
    return next;
  });

        rafRef.current = null;
      });
    };

    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);

    return { cancel: up };
  };


  // ---------------------- Flip Helpers ----------------------
  const flipSelected = (axis: "horizontal" | "vertical") => {
    if (!setImageState) return;

    setImageState((prev) => {
      const next = { ...prev };

      selectedUids.forEach((uid) => {
        const current = next[uid] ?? {
          rotation: 0,
          flip: "none",
          size: sizes[uid] ?? { w: 150, h: 150 },
        };

        // ✅ toggle flip instead of forcing it
        const nextFlip = current.flip === axis ? "none" : axis;

        next[uid] = {
          ...current,
          flip: nextFlip,
        };
      });

      return next;
    });
  };


  // ---------------------- Render ----------------------
  return (
    <div
      ref={canvasRef}
      className="flex-1 mt-4 mb-6 mr-6 h-[calc(100vh-160px)] bg-gray-200 dark:bg-gray-800 flex items-center justify-center relative overflow-hidden"
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (marquee?.active || target.dataset?.type === "img") return;
        setSelectedUids([]);
        onUploadedImageSelect(null);
      }}
    >
      {/* Main Image */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <img
          src={mainImage}
          alt="Product"
          data-type="product"
          className="max-w-full max-h-full object-contain pointer-events-none"
        />
      </div>

      {/* Restricted Area */}
      <div
        className="absolute border-2 border-dashed border-blue-500 pointer-events-none"
        style={{ left: restrictedBox.left, top: restrictedBox.top, width: restrictedBox.width, height: restrictedBox.height }}
      />

      {/* Selection Box */}
      <SelectionBox
        selectedImages={selectedUids}
        canvasRef={canvasRef}
        onDelete={() => handleDeleteMultiple(selectedUids)}
        onDuplicate={() => handleDuplicateMultiple(selectedUids)}
        onResize={(uid, newSize) =>
          setSizes((prev) => ({
            ...prev,
            [uid]: {
              w: Math.max(1, Math.abs(newSize)),
              h: Math.max(1, Math.abs(newSize)),
            },
          }))
        }
        onStartGroupResize={(startClientX: number) =>
          handleSelectionResizeStart(startClientX)
        }
        onFlip={(axis: "horizontal" | "vertical") =>
          flipSelected(axis)
        }
      />


      {/* Marquee */}
      {marquee?.active && (
        <>
          <div className="absolute inset-0 cursor-crosshair" style={{ zIndex: 9999 }} />
          <div
            className="absolute border-2 border-blue-500 bg-blue-200/20 pointer-events-none"
            style={{ left: marquee.x, top: marquee.y, width: marquee.w, height: marquee.h, zIndex: 10000 }}
          />
        </>
      )}

      {/* Uploaded Images */}
      {allUploaded.map((uid, i) => {
        const s = sizes[uid] ?? imageState[uid]?.size ?? { w: 150, h: 150 };
        if (!s) return null;
        const p = positions[uid] ?? clampPosition(
          restrictedBox.left + (restrictedBox.width - s.w) / 2,
          restrictedBox.top + (restrictedBox.height - s.h) / 2,
          s.w,
          s.h
        );
        const highlighted = !!hoveredWhileMarquee[uid] || selectedUids.includes(uid);
        const rotation = imageState[uid]?.rotation ?? 0;
        const flip = imageState[uid]?.flip ?? "none";

        return (
          <DraggableImage
            key={uid + "-" + i}
            uid={uid}
            url={uid}
            pos={p}
            size={s}
            rotation={rotation}
            flip={flip}
            highlighted={highlighted}
            onPointerDown={onImagePointerDown}
          />
        );
      })}
    </div>
  );
}
