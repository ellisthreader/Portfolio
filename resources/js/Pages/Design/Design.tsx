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

// ---------------------- IMAGE STATE TYPE ----------------------
export type ImageState = {
  url: string;
  rotation: number;
  flip: "none" | "horizontal" | "vertical";
  size: { w: number; h: number };
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

  // ---------------------- IMAGE STATE ----------------------
  const [imageState, setImageState] = useState<Record<string, ImageState>>({});

  // Prevent selection/drag on page
  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault();
    document.addEventListener("selectstart", prevent);
    document.addEventListener("dragstart", prevent);
    return () => {
      document.removeEventListener("selectstart", prevent);
      document.removeEventListener("dragstart", prevent);
    };
  }, []);

  // ---------------------- PRODUCT VARIANTS ----------------------
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

  const [displayImages, setDisplayImages] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const handleRotateImage = (url: string, angle: number) => {
  setImageState(prev => {
    if (!prev[url]) return prev;
    return {
      ...prev,
      [url]: {
        ...prev[url],
        rotation: angle,
      },
    };
  });
};

  // ---------------------- UPDATE DISPLAY IMAGES ----------------------
  useEffect(() => {
    if (!selectedColour) return;
    const variant =
      variantsByColour[selectedColour].find((v) => v.size === selectedSize) ??
      variantsByColour[selectedColour][0];
    const sorted = normalizeImages(variant?.images ?? []);
    setDisplayImages(sorted);
    setMainImage(sorted[0] ?? "");
  }, [selectedColour, selectedSize, variantsByColour]);

  // Track canvas size
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

  // ---------------------- UPLOAD HANDLERS ----------------------
const handleUpload = (url: string) => {
  const size = { w: 150, h: 150 };
  setUploadedImages(prev => [...prev, url]);

  setImageState(prev => ({
    ...prev,
    [url]: {
      url,               // ✅ top-level required
      rotation: 0,
      flip: "none",
      size,
      original: {
        url,
        rotation: 0,
        flip: "none",
        size: { ...size },
      },
    },
  }));
};



  const [activeTab, setActiveTab] = useState("product");
  const [selectedUploadedImage, setSelectedUploadedImage] = useState<string | null>(null);

  const handleUploadedImageSelect = (url: string | null) => {
    setSelectedUploadedImage(url);
    if (url) setActiveTab("upload");
  };

  const restrictedBox = {
    left: canvasSize.width * 0.367,
    top: canvasSize.height * 0.1,
    width: canvasSize.width * 0.26,
    height: canvasSize.height * 0.65,
  };

  // ---------------------- IMAGE MANIPULATION ----------------------
const handleResetImage = (url: string) => {
  setImageState(prev => {
    const img = prev[url];
    if (!img) return prev;

    return {
      ...prev,
      [url]: {
        ...img,                // keep the current key
        url: img.original.url, // restore original image
        size: { ...img.original.size },
        rotation: img.original.rotation,
        flip: img.original.flip,
      },
    };
  });
};


  const handleFlipImage = (
    url: string,
    flip: "none" | "horizontal" | "vertical"
  ) => {
    setImageState(prev => ({
      ...prev,
      [url]: {
        ...(prev[url] ?? { rotation: 0, size: { w: 150, h: 150 } }),
        flip,
      },
    }));
  };


  const handleUpdateImageSize = (url: string, w: number, h: number) => {
    setImageState((prev) => ({
      ...prev,
      [url]: {
        ...(prev[url] ?? { rotation: 0, flip: "none", size: { w: 150, h: 150 } }),
        size: { w, h },
      },
    }));
  };

  const handleRemoveUploadedImage = (url: string) => {
    setUploadedImages((prev) => prev.filter((u) => u !== url));
    setImageState((prev) => {
      const next = { ...prev };
      delete next[url];
      return next;
    });
    if (selectedUploadedImage === url) setSelectedUploadedImage(null);
  };


  const handleDuplicateUploadedImage = (url: string) => {
  const dup = `${url}#dup-${Date.now()}`;
  const source = imageState[url];
  if (!source) return;

  setUploadedImages(prev => [...prev, dup]);

  setImageState(prev => ({
    ...prev,
    [dup]: {
      url: source.url,   // ✅ top-level
      rotation: source.rotation,
      flip: source.flip,
      size: { ...source.size },
      original: { ...source.original },
    },
  }));

  setSelectedUploadedImage(dup);
  setActiveTab("upload");
};




  // ---------------------- SIDEBAR RENDERER ----------------------
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});

  const renderActiveTab = () => {
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
            onSelectImage={handleUploadedImageSelect}
            onRotateImage={handleRotateImage} 
            onFlipImage={handleFlipImage}
            onUpdateImageSize={handleUpdateImageSize}
            onRemoveUploadedImage={handleRemoveUploadedImage}
            onDuplicateUploadedImage={handleDuplicateUploadedImage}
            imageState={imageState}
            restrictedBox={restrictedBox}
            canvasPositions={positions}
            setImageState={setImageState}   // ✅ REQUIRED
            onResetImage={handleResetImage} 
          />
        );
      case "text":
        return <AddText />;
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
          currentCategory={currentCategory}
        />
      )}

      <div className={isChangeProductModalOpen ? "blur-lg opacity-40" : ""}>
        {/* NAV */}
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

        {/* LAYOUT */}
        <div className="pt-[96px] flex min-h-screen">
          {/* LEFT SIDEBAR */}
          <div className="w-[140px] ml-6 mt-4 mb-6 bg-neutral-700 shadow-xl border rounded-2xl p-4 flex flex-col gap-4 items-center h-[calc(100vh-160px)]">
            {[
              { id: "product", icon: <Shirt size={22} />, label: "Product" },
              { id: "upload", icon: <UploadIcon size={22} />, label: "Upload" },
              { id: "text", icon: <Type size={22} />, label: "Text" },
              { id: "clipart", icon: <ClipartIcon size={22} />, label: "Clipart" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full h-16 flex flex-col items-center justify-center rounded-xl transition ${
                  activeTab === tab.id ? "bg-neutral-600" : "bg-neutral-700 hover:bg-neutral-600"
                }`}
              >
                {React.cloneElement(tab.icon, { className: "text-white" })}
                <span className="text-white text-sm">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="w-[480px] ml-4 mt-4 mb-6 bg-white dark:bg-gray-800 shadow-xl border rounded-2xl p-4 h-[calc(100vh-160px)] overflow-y-auto">
            {renderActiveTab()}
          </div>

          {/* CANVAS */}
            <Canvas
              mainImage={mainImage}
              displayImages={displayImages}
              uploadedImages={uploadedImages}
              restrictedBox={restrictedBox}
              canvasRef={canvasRef}

              selectedImage={selectedUploadedImage}

              // 👇 THIS IS THE IMPORTANT ONE
              onSelectImage={handleUploadedImageSelect}

              onUploadedImageSelect={handleUploadedImageSelect}
              onRemoveUploadedImage={handleRemoveUploadedImage}
              onDuplicateUploadedImage={handleDuplicateUploadedImage}
              imageState={imageState}
              setImageState={setImageState}
              positions={positions}
              setPositions={setPositions}
            />
        </div>
      </div>
    </div>
  );
}
