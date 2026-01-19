"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { ArrowLeft, ArrowRight, X, Shirt, Upload as UploadIcon, Type, Image as ClipartIcon } from "lucide-react";

import ProductEdit from "./Sidebar/ProductEdit";
import AddText from "./Sidebar/TextSideBar/AddText";
import Clipart from "./Sidebar/ClipartSideBar/UI/Clipart";
import UploadSidebar from "./Sidebar/UploadSideBar/UploadSidebar";
import ChangeProductModal from "./ChangeProduct";
import Canvas from "./Canvas/Canvas";
import TextProperties from "./Sidebar/TextSideBar/TextProperties/TextProperties";
import MultiSelectPanel from "./Sidebar/MultiSelectPanel";
import ClipartProperties from "./Sidebar/ClipartSideBar/Properties/ClipartProperties";


export type ImageState = {
  url: string;
  type: "image" | "text";
  isClipart?: boolean;
  text?: string;
  rotation: number;
  flip: "none" | "horizontal" | "vertical";
  size: { w: number; h: number };
  fontFamily?: string;
  color?: string;
  borderColor?: string;
  borderWidth?: number;
  original: {
    url: string;
    rotation: number;
    flip: "none" | "horizontal" | "vertical";
    size: { w: number; h: number };
  };
};

export default function Design() {
  const { props } = usePage();
  const { product, selectedColour: propColour, selectedSize: propSize } = props;

  const safeProduct = product ?? {
    name: "Unknown",
    brand: "",
    slug: "",
    images: [],
    sizes: [],
    colourProducts: [],
    categories: [],
  };

  const safeName = safeProduct.name ?? "Unknown";
  const [isChangeProductModalOpen, setIsChangeProductModalOpen] = useState(false);

  const [imageState, setImageState] = useState<Record<string, ImageState>>({});
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedUploadedImage, setSelectedUploadedImage] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [selectedClipart, setSelectedClipart] = useState<string | null>(null);


  const [activeTab, setActiveTab] = useState<"product" | "upload" | "text" | "clipart">("product");
  const [displayImages, setDisplayImages] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState("");
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);


  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const { onResizeTextCommit } = props;

  type ClipartView =
  | "sections"
  | "category"
  | "items"
  | "properties";

const [clipartView, setClipartView] = useState<ClipartView>("sections");


  const handleResizeImage = (uid: string, w: number, h: number) => {
  setImageState((prev) => ({
    ...prev,
    [uid]: {
      ...prev[uid],
      size: { w, h },
    },
  }));
};


const [replacingClipartUid, setReplacingClipartUid] =
  useState<string | null>(null);


const handleChangeClipartColor = (uid: string, color: string) => {
  setImageState((prev) => ({
    ...prev,
    [uid]: {
      ...prev[uid],
      color,
    },
  }));
};

const openClipartPicker = () => {
  setActiveTab("clipart");
};


const handleDeleteImage = (uid: string) => {
  setImageState((prev) => {
    const next = { ...prev };
    delete next[uid];
    return next;
  });

  setUploadedImages((prev) => prev.filter((id) => id !== uid));
  setSelectedUploadedImage(null);
};


  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault();
    document.addEventListener("selectstart", prevent);
    document.addEventListener("dragstart", prevent);
    return () => {
      document.removeEventListener("selectstart", prevent);
      document.removeEventListener("dragstart", prevent);
    };
  }, []);

  const variantsByColour = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    if (Array.isArray(safeProduct.colourProducts)) {
      safeProduct.colourProducts.forEach((cp) => {
        const colour = cp.colour;
        const sizes = cp.sizes ?? [];
        const images = cp.images ?? safeProduct.images ?? [];
        if (!grouped[colour]) grouped[colour] = [];
        if (sizes.length) {
          sizes.forEach((s) => grouped[colour].push({ colour, size: s, images }));
        } else {
          grouped[colour].push({ colour, size: undefined, images });
        }
      });
    }
    return grouped;
  }, [safeProduct]);

  const uniqueColours = Object.keys(variantsByColour);

  const normalizeImages = (images: any[]) =>
    (images ?? []).map((img) => (typeof img === "string" ? img : img.url ?? img.path ?? ""));

  const [selectedColour, setSelectedColour] = useState(
    propColour && uniqueColours.includes(propColour) ? propColour : uniqueColours[0] ?? null
  );
  const [selectedSize, setSelectedSize] = useState(propSize ?? null);
  

  useEffect(() => {
    if (!canvasRef.current) return;
    const updateSize = () => {
      const { width, height } = canvasRef.current!.getBoundingClientRect();
      setCanvasSize({ width, height });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const restrictedBox = {
    left: canvasSize.width * 0.367,
    top: canvasSize.height * 0.1,
    width: canvasSize.width * 0.26,
    height: canvasSize.height * 0.65,
  };

  const handleRotateImage = (url: string, angle: number) => {
    setImageState((prev) => {
      if (!prev[url]) return prev;
      return { ...prev, [url]: { ...prev[url], rotation: angle } };
    });
  };

  const handleFlipImage = (url: string, flip: "none" | "horizontal" | "vertical") => {
    setImageState((prev) => ({
      ...prev,
      [url]: { ...(prev[url] ?? { rotation: 0, size: { w: 150, h: 150 } }), flip },
    }));
  };

  const handleUpdateImageSize = (url: string, w: number, h: number) => {
    setImageState((prev) => ({
      ...prev,
      [url]: { ...(prev[url] ?? { rotation: 0, flip: "none", size: { w: 150, h: 150 } }), size: { w, h } },
    }));
  };
const handleAddClipart = (src: string) => {
  const size = { w: 150, h: 150 };

  // 🔁 REPLACE EXISTING CLIPART
  if (replacingClipartUid) {
    setImageState(prev => {
      const existing = prev[replacingClipartUid];
      if (!existing) return prev;

      return {
        ...prev,
        [replacingClipartUid]: {
          ...existing,
          url: src,
          original: {
            ...existing.original,
            url: src,
          },
        },
      };
    });

    // keep selection + exit replace mode
    setSelectedUploadedImage(replacingClipartUid);
    setReplacingClipartUid(null);
    setActiveTab("clipart");
    return;
  }

  // ➕ ADD NEW CLIPART
  const uid = crypto.randomUUID();

  setImageState(prev => ({
    ...prev,
    [uid]: {
      url: src,
      type: "image",      // canvas-compatible
      isClipart: true,    // sidebar meaning
      rotation: 0,
      flip: "none",
      size,
      color: "#000000",  // ✅ important for SVG recoloring
      original: {
        url: src,
        rotation: 0,
        flip: "none",
        size: { ...size },
        color: "#000000",
      },
    },
  }));

  setSelectedUploadedImage(uid);
  setActiveTab("clipart");
};


const handleResizeText = (uid: string, newFontSize: number) => {
  console.log("🖊 handleResizeText called:", { uid, newFontSize });
  setImageState(prev => {
    const layer = prev[uid];
    if (!layer || layer.type !== "text") return prev;

    return {
      ...prev,
      [uid]: {
        ...layer,
        fontSize: newFontSize, // ✅ ONLY source of truth
      },
    };
  });
};

  const handleResetImage = (uid: string) => {
    setImageState((prev) => {
      const layer = prev[uid];
      if (!layer || !layer.original) return prev;

      if (layer.type === "text") {
        return {
          ...prev,
          [uid]: {
            ...layer,
            rotation: layer.original.rotation,
            flip: layer.original.flip,
            size: { ...layer.original.size },
          },
        };
      }

      return {
        ...prev,
        [uid]: {
          ...layer,
          url: layer.original.url,
          size: { ...layer.original.size },
          rotation: layer.original.rotation,
          flip: layer.original.flip,
        },
      };
    });
  };

  const handleRemoveUploadedImage = (url: string) => {
    setUploadedImages((prev) => prev.filter((u) => u !== url));
    setImageState((prev) => {
      const next = { ...prev };
      delete next[url];
      return next;
    });

    if (selectedUploadedImage === url) setSelectedUploadedImage(null);
    if (selectedText === url) setSelectedText(null);
  };

  const handleDeleteImages = (uids: string[]) => {
    uids.forEach((uid) => handleRemoveUploadedImage(uid));
  };

  const handleUpload = (url: string) => {
    const size = { w: 150, h: 150 };
    setUploadedImages((prev) => [...prev, url]);
    setImageState((prev) => ({
      ...prev,
      [url]: {
        url,
        type: "image",
        rotation: 0,
        flip: "none",
        size,
        original: { url, rotation: 0, flip: "none", size: { ...size } },
      },
    }));
  };

  const handleDuplicateUploadedImage = (url: string) => {
    const source = imageState[url];
    if (!source) return;
    const dup = `${url}#dup-${Date.now()}`;
    setUploadedImages((prev) => [...prev, dup]);
    setImageState((prev) => ({
      ...prev,
      [dup]: { ...source },
    }));
    setSelectedUploadedImage(dup);
    setActiveTab("upload");
  };

  const updateTextLayer = (uid: string, updates: Partial<ImageState>) => {
    setImageState((prev) => ({
      ...prev,
      [uid]: { ...prev[uid], ...updates },
    }));
  };

  

  useEffect(() => {
    if (!selectedColour) return;
    const variant =
      variantsByColour[selectedColour].find((v) => v.size === selectedSize) ??
      variantsByColour[selectedColour][0];
    const sorted = normalizeImages(variant?.images ?? []);
    setDisplayImages(sorted);
    setMainImage(sorted[0] ?? "");
  }, [selectedColour, selectedSize, variantsByColour]);

  const renderActiveTab = () => {
    if (selectedObjects.length > 1) {
      return (
        <MultiSelectPanel
          selectedObjects={selectedObjects}
          imageState={imageState}
        />
      );
    }

    switch (activeTab) {
      case "product":
        return (
          <ProductEdit
            product={safeProduct}
            selectedColour={selectedColour}
            selectedSize={selectedSize}
            onColourChange={setSelectedColour}
            onSizeChange={setSelectedSize}
            onOpenChangeProductModal={() =>
              setIsChangeProductModalOpen(true)
            }
          />
        );

      case "upload":
        return (
          <UploadSidebar
            onUpload={handleUpload}
            recentImages={uploadedImages}
            selectedImage={selectedUploadedImage}
            onSelectImage={setSelectedUploadedImage}
            onRotateImage={handleRotateImage}
            onFlipImage={handleFlipImage}
            onUpdateImageSize={handleUpdateImageSize}
            onRemoveUploadedImage={handleRemoveUploadedImage}
            onDuplicateUploadedImage={handleDuplicateUploadedImage}
            imageState={imageState}
            restrictedBox={restrictedBox}
            canvasPositions={positions}
            setImageState={setImageState}
            onResetImage={handleResetImage}
          />
        );

      case "text": {
        if (!selectedText || !imageState[selectedText]) {
          return (
            <AddText
              onAddText={(layer) => {
                setImageState((prev) => ({
                  ...prev,
                  [layer.id]: {
                    url: "",
                    type: "text",
                    text: layer.text,
                    rotation: 0,
                    flip: "none",
                    size: { w: 200, h: layer.fontSize },
                    fontFamily: layer.font,
                    color: layer.color,
                    borderColor: layer.borderColor,
                    borderWidth: layer.borderWidth,
                    fontSize: layer.fontSize,
                    width: layer.width,
                    original: {
                      url: "",
                      rotation: 0,
                      flip: "none",
                      size: { w: 200, h: layer.fontSize },
                    },
                  },
                }));
                setSelectedText(layer.id);
                setActiveTab("text");
              }}
            />
          );
        }

        const layer = imageState[selectedText];

        return (
          <TextProperties
            textValue={layer.text ?? ""}
            onTextChange={(val) =>
              updateTextLayer(selectedText, { text: val })
            }
            fontFamily={layer.fontFamily ?? "Arial"}
            onFontChange={(val) =>
              updateTextLayer(selectedText, { fontFamily: val })
            }
            color={layer.color ?? "#000000"}
            onColorChange={(val) =>
              updateTextLayer(selectedText, { color: val })
            }
            rotation={layer.rotation}
            onRotationChange={(val) =>
              updateTextLayer(selectedText, { rotation: val })
            }
            fontSize={layer.fontSize}
            onFontSizeChange={(val) =>
              updateTextLayer(selectedText, { fontSize: val })
            }
            borderColor={layer.borderColor ?? "#000000"}
            onBorderColorChange={(val) =>
              updateTextLayer(selectedText, { borderColor: val })
            }
            borderWidth={layer.borderWidth ?? 0}
            onBorderWidthChange={(val) =>
              updateTextLayer(selectedText, { borderWidth: val })
            }
          />
        );
      } // ✅ REQUIRED

      case "clipart": {
        const layer =
          selectedUploadedImage &&
          imageState[selectedUploadedImage]?.isClipart
            ? imageState[selectedUploadedImage]
            : null;

        return layer && selectedUploadedImage ? (
          <ClipartProperties
            layer={layer}
            onBack={() => setSelectedUploadedImage(null)}
            onRotate={(v) =>
              handleRotateImage(selectedUploadedImage, v)
            }
            onFlip={(v) =>
              handleFlipImage(selectedUploadedImage, v)
            }
            onResize={(w, h) =>
              handleResizeImage(selectedUploadedImage, w, h)
            }
            onChangeArt={() => {
              setReplacingClipartUid(selectedUploadedImage);
              setClipartView("sections");
              setActiveTab("clipart");
            }}
            onChangeColor={(color) =>
              handleChangeClipartColor(
                selectedUploadedImage,
                color
              )
            }
            onDelete={() =>
              handleDeleteImage(selectedUploadedImage)
            }
          />
        ) : (
          <Clipart
            onAddClipart={handleAddClipart}
            view={clipartView}
            onViewChange={setClipartView}
          />
        );
      }

      default:
        return null;
    }
  };


        const layer = imageState[selectedText];

        return (
          <TextProperties
            textValue={layer.text ?? ""}
            onTextChange={(val) => updateTextLayer(selectedText, { text: val })}
            fontFamily={layer.fontFamily ?? "Arial"}
            onFontChange={(val) => updateTextLayer(selectedText, { fontFamily: val })}
            color={layer.color ?? "#000000"}
            onColorChange={(val) => updateTextLayer(selectedText, { color: val })}
            rotation={layer.rotation}
            onRotationChange={(val) => updateTextLayer(selectedText, { rotation: val })}
            fontSize={layer.fontSize} // <- use fontSize
            onFontSizeChange={(val) => updateTextLayer(selectedText, { fontSize: val })}
            borderColor={layer.borderColor ?? "#000000"}
            onBorderColorChange={(val) => updateTextLayer(selectedText, { borderColor: val })}
            borderWidth={layer.borderWidth ?? 0}
            onBorderWidthChange={(val) => updateTextLayer(selectedText, { borderWidth: val })}
          />
        );

          
      case "clipart": {
        const layer =
          selectedUploadedImage &&
          imageState[selectedUploadedImage]?.isClipart
            ? imageState[selectedUploadedImage]
            : null;

        return layer && selectedUploadedImage ? (
          <ClipartProperties
            layer={layer}
            onBack={() => setSelectedUploadedImage(null)}
            onRotate={(v) => handleRotateImage(selectedUploadedImage, v)}
            onFlip={(v) => handleFlipImage(selectedUploadedImage, v)}
            onResize={(w, h) => handleResizeImage(selectedUploadedImage, w, h)}
            onChangeArt={() => {
              setReplacingClipartUid(selectedUploadedImage); // ✅ replace mode
              setClipartView("sections");
            }}
            onChangeColor={(color) =>
              handleChangeClipartColor(selectedUploadedImage, color)
            }
            onDelete={() => handleDeleteImage(selectedUploadedImage)}
          />
        ) : (
          <Clipart
            onAddClipart={handleAddClipart}
            view={clipartView}
            onViewChange={setClipartView}
          />
        );
      }



return (
  <div className="min-h-screen bg-gray-200 dark:bg-gray-900 relative disable-selection">
    <Head title="Start Designing" />

    {isChangeProductModalOpen && (
      <ChangeProductModal
        onClose={() => setIsChangeProductModalOpen(false)}
        currentCategory={null}
      />
    )}

    <div className={isChangeProductModalOpen ? "blur-lg opacity-40" : ""}>
      {/* TOP BAR */}
      <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b flex items-center justify-between px-6 h-16 z-40 shadow-sm">
        {/* top bar buttons */}
      </div>

      <div className="pt-[96px] flex min-h-screen">
        {/* LEFT SIDEBAR */}
        <div className="w-[140px] ml-6 mt-4 mb-6 bg-neutral-700 shadow-xl border rounded-2xl p-4 flex flex-col gap-4 items-center h-[calc(100vh-160px)]">
          {/* sidebar buttons */}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-[480px] ml-4 mt-4 mb-6 bg-white dark:bg-gray-800 shadow-xl border rounded-2xl p-4 h-[calc(100vh-160px)] overflow-y-auto">
          {layer && selectedUploadedImage ? (
            <ClipartProperties
              layer={layer}
              onBack={() => setSelectedUploadedImage(null)}
              onRotate={(v) => handleRotateImage(selectedUploadedImage, v)}
              onFlip={(v) => handleFlipImage(selectedUploadedImage, v)}
              onResize={(w, h) =>
                handleResizeImage(selectedUploadedImage, w, h)
              }
              onChangeArt={() => {
                setActiveTab("clipart");
                setClipartView("sections");
              }}
              onChangeColor={(color) =>
                handleChangeClipartColor(selectedUploadedImage, color)
              }
              onDelete={() =>
                handleDeleteImage(selectedUploadedImage)
              }
            />
          ) : (
            <Clipart
              view={clipartView}
              onViewChange={setClipartView}
              onAddClipart={(src: string) => {
                handleAddClipart(src);
                setClipartView("sections");
              }}
            />
          )}
        </div>

        {/* CANVAS */}
        <Canvas
          mainImage={mainImage}
          restrictedBox={restrictedBox}
          canvasRef={canvasRef}
          uploadedImages={uploadedImages}
          setUploadedImages={setUploadedImages}
          imageState={imageState}
          setImageState={setImageState}
          onSelectImage={setSelectedUploadedImage}
          onSelectText={setSelectedText}
          onSwitchTab={setActiveTab}
          onDelete={handleDeleteImages}
          onResizeTextCommit={handleResizeText}
          onSelectionChange={setSelectedObjects}
        />
      </div>
    </div>
  </div>
);
