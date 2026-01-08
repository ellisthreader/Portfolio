"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { ArrowLeft, ArrowRight, X, Shirt, Upload as UploadIcon, Type, Image as ClipartIcon } from "lucide-react";

import ProductEdit from "./Sidebar/ProductEdit";
import AddText from "./Sidebar/TextSideBar/AddText";
import Clipart from "./Sidebar/Clipart";
import UploadSidebar from "./Sidebar/UploadSideBar/UploadSidebar";
import ChangeProductModal from "./ChangeProduct";
import Canvas from "./Canvas/Canvas";
import TextProperties from "./Sidebar/TextSideBar/TextProperties/TextProperties";
import MultiSelectPanel from "./Sidebar/MultiSelectPanel";


export type ImageState = {
  url: string;
  type?: "image" | "text";
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

  const [activeTab, setActiveTab] = useState<"product" | "upload" | "text" | "clipart">("product");
  const [displayImages, setDisplayImages] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState("");
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);


  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});

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


const handleResizeText = (uid: string, newFontSize: number) => {
  console.log("[RESIZE TEXT] update from canvas", uid, newFontSize);
  setImageState(prev => {
    const layer = prev[uid];
    if (!layer || layer.type !== "text") return prev;

    return {
      ...prev,
      [uid]: {
        ...layer,
        size: {
          ...layer.size,
          h: newFontSize   // OK again — now consistent
        }
      }
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
    // MULTI-SELECTION WINS
    if (selectedObjects.length > 1) {
      return (
        <MultiSelectPanel
          selectedObjects={selectedObjects}
          imageState={imageState}
        />
      );
    }

    // fallback to normal tabs
    switch (activeTab) {
      case "product":
        return (
          <ProductEdit
            product={safeProduct}
            selectedColour={selectedColour}
            selectedSize={selectedSize}
            onColourChange={setSelectedColour}
            onSizeChange={setSelectedSize}
            onOpenChangeProductModal={() => setIsChangeProductModalOpen(true)}
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

      case "text":
        // If no text is selected, show AddText sidebar
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
                    size: { w: 200, h: layer.fontSize }, // <-- keep size for TS
                    fontFamily: layer.font,
                    color: layer.color,
                    borderColor: layer.borderColor,
                    borderWidth: layer.borderWidth,
                    fontSize: layer.fontSize, // <-- optional, still store separately
                    width: layer.width,       // <-- optional, same as w
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

      case "clipart":
        return <Clipart />;

      default:
        return null;
    }
  };



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
        <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b flex items-center justify-between px-6 h-16 z-40 shadow-sm">
          <div className="text-xl font-bold">{safeName}</div>

          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100">
              <ArrowLeft size={24} />
            </button>

            <button onClick={() => alert("Next step coming soon")} className="p-2 rounded-full hover:bg-gray-100">
              <ArrowRight size={24} />
            </button>

            <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-red-100">
              <X size={28} className="text-red-600" />
            </button>
          </div>
        </div>

        <div className="pt-[96px] flex min-h-screen">
          <div className="w-[140px] ml-6 mt-4 mb-6 bg-neutral-700 shadow-xl border rounded-2xl p-4 flex flex-col gap-4 items-center h-[calc(100vh-160px)]">
            {[
              { id: "product", icon: <Shirt size={22} />, label: "Product" },
              { id: "upload", icon: <UploadIcon size={22} />, label: "Upload" },
              { id: "text", icon: <Type size={22} />, label: "Text" },
              { id: "clipart", icon: <ClipartIcon size={22} />, label: "Clipart" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full h-16 flex flex-col items-center justify-center rounded-xl transition ${
                  activeTab === tab.id ? "bg-neutral-600" : "bg-neutral-700 hover:bg-neutral-600"
                }`}
              >
                {React.cloneElement(tab.icon, { className: "text-white" })}
                <span className="text-white text-sm">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="w-[480px] ml-4 mt-4 mb-6 bg-white dark:bg-gray-800 shadow-xl border rounded-2xl p-4 h-[calc(100vh-160px)] overflow-y-auto">
            {renderActiveTab()}
          </div>


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
            onResizeText={handleResizeText}
            onSelectionChange={setSelectedObjects}
          />
        </div>
      </div>
    </div>
  );
}
