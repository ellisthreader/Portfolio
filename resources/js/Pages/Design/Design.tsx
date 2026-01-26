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
  import SidebarHeader from "./Components/SidebarHeader";

  import ClipartSectionsPage from "./Sidebar/ClipartSideBar/UI/ClipartSectionsPage";
  import BlankSidebar from "./Sidebar/BlankSidebar";





  export type ImageState = {
    url: string;

    /** What kind of layer this is */
    type: "image" | "text";

    /** Clipart / uploaded image */
    isClipart?: boolean;

    /** Explicit SVG flag (IMPORTANT) */
    isSvg?: boolean;

    /** Text layer only */
    text?: string;
    fontFamily?: string;

    /** Shared transforms */
    rotation: number;
    flip: "none" | "horizontal" | "vertical";
    size: { w: number; h: number };

    /** Visual styling */
    color?: string;        // SVG fill OR text color
    borderColor?: string;
    borderWidth?: number;

    /** Original values for reset */
    original: {
      url: string;
      rotation: number;
      flip: "none" | "horizontal" | "vertical";
      size: { w: number; h: number };
      color?: string;

      renderKey?: string; // 👈 add this
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
    
  // ------------------------------------
  // Sidebar UI state
  // ------------------------------------
  const [sidebarTitleOverride, setSidebarTitleOverride] = useState<string | null>(null);

  type SidebarView =
    | "blank"
    | "product"
    | "upload"
    | "text"
    | "clipart"
    | "clipart-sections"
    | "clipart-properties"
    | "text-properties"
    | "image-properties";

  // ------------------------------------
  // Sidebar navigation stack
  // ------------------------------------
  const [sidebarStack, setSidebarStack] = useState<SidebarView[]>(["product"]);

  const activeSidebar = sidebarStack[sidebarStack.length - 1];

  // ------------------------------------
  // Navigation helpers
  // ------------------------------------

  // ➕ Push a new page
  const pushSidebar = (view: SidebarView) => {
    console.log("[Sidebar] push →", view);

    setSidebarTitleOverride(null);
    setSidebarStack(prev => [...prev, view]);
  };

  // ⬅️ Pop current page
  const goBackSidebar = () => {
    console.log("[Sidebar] back");

    setSidebarStack(prev => {
      if (prev.length <= 1) {
        console.log("[Sidebar] ❌ already at root");
        return prev;
      }

      const next = prev.slice(0, -1);
      console.log("[Sidebar] stack →", next);

      return next;
    });
  };


  // ✅ Compute if back arrow should be shown
  const canGoBack = sidebarStack.length > 1;



  // ❌ close sidebar (blank page)
const closeSidebar = () => {
  // Only clear selections — do NOT change navigation
  setSelectedObjects([]);
  setSelectedUploadedImage(null);
  setSelectedText(null);
};


    const [displayImages, setDisplayImages] = useState<string[]>([]);
    const [mainImage, setMainImage] = useState("");
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const canvasRef = useRef<HTMLDivElement | null>(null);
    const [selectedObjects, setSelectedObjects] = useState<string[]>([]);
    const [replaceClipartId, setReplaceClipartId] = useState<string | null>(null);



    const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
    const { onResizeTextCommit } = props;
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
    // Inside your component:

    const colorTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleChangeImageColor = (uid: string, color: string) => {
      // Clear previous timeout
      if (colorTimeout.current) clearTimeout(colorTimeout.current);

      // Set a new timeout
      colorTimeout.current = setTimeout(() => {
        setImageState((prev) => {
          const layer = prev[uid];
          if (!layer) return prev;

          if (layer.color === color) return prev; // no change

          return {
            ...prev,
            [uid]: {
              ...layer,
              color,
            },
          };
        });
      }, 50); // 50ms throttle
    };


const handleAddClipart = (src: string) => {
  const uid = crypto.randomUUID();
  const size = { w: 150, h: 150 };

  // 1️⃣ Add the clipart to image state
  setImageState((prev) => ({
    ...prev,
    [uid]: {
      url: src,
      src,
      type: "image",
      isClipart: true,
      rotation: 0,
      flip: "none",
      size,
      color: "#000000",
      renderKey: crypto.randomUUID(),
      original: { url: src, rotation: 0, flip: "none", size: { ...size } },
    },
  }));

  // 2️⃣ Select the new clipart
  setSelectedUploadedImage(uid);
  setSelectedText(null); // clear text selection

  // 3️⃣ Open the **clipart properties** sidebar directly
  setSidebarStack(["clipart"]);

  // 4️⃣ Ensure the title is reset
  setSidebarTitleOverride(null);
};



  // 2️⃣ REPLACE an existing clipart
  const handleReplaceClipart = (src: string) => {
    if (!replaceClipartId) return;

    setImageState(prev => {
      const layer = prev[replaceClipartId];
      if (!layer || !layer.isClipart) return prev;

      return {
        ...prev,
        [replaceClipartId]: {
          ...layer,
          url: src,
          src,
          color: "#000000",
          original: { ...layer.original, url: src },
        },
      };
    });

    setSelectedUploadedImage(replaceClipartId);
    setReplaceClipartId(null);

    // ✅ Return to properties view
    pushSidebar("clipart");
  };


  // 3️⃣ CHANGE an existing clipart (trigger picker)
  const handleChangeClipart = () => {
    if (!selectedUploadedImage) return;

    setReplaceClipartId(selectedUploadedImage);
    setSelectedUploadedImage(null);

    // ✅ Go back to clipart picker
    pushSidebar("clipart");
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

    const closeToBlank = () => {
    setSelectedObjects([]);
    setSelectedUploadedImage(null);
    setSelectedText(null);
    setSidebarTitleOverride(null);
    setSidebarStack(["blank"]);
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

    const deleteTextLayer = (uid: string) => {
    setImageState(prev => {
      const next = { ...prev };
      delete next[uid];
      return next;
    });

    // Clear selection
    setSelectedText(null);
    setSelectedObjects(prev => prev.filter(id => id !== uid));

    // Go somewhere safe
    setSidebarStack(["text"]); // or ["product"] if you prefer
  };


const handleCanvasSelectionChange = (objects: string[]) => {
  setSelectedObjects(objects);

  if (objects.length === 0) {
    setSelectedText(null);
    setSelectedUploadedImage(null);
    // ❌ DO NOT touch sidebarStack here
  }
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
        [dup]: {
          ...source,
                renderKey: crypto.randomUUID(), // 🔥 forces remount
          color: source.color ?? "#000000", // ensure color is copied
        },
      }));

      setSelectedUploadedImage(dup);
      pushSidebar("upload");
    };

    const duplicateTextLayer = (uid: string) => {
    const source = imageState[uid];
    if (!source || source.type !== "text") return;

    
    const newId = crypto.randomUUID();

    setImageState(prev => ({
      ...prev,
      [newId]: {
        ...source,
      },
    }));

    setSelectedText(newId);
    pushSidebar("text");
  };

    const updateTextLayer = (uid: string, updates: Partial<ImageState>) => {
      setImageState((prev) => ({
        ...prev,
        [uid]: {
          ...prev[uid],
          ...updates,
        },
      }));
    };


    useEffect(() => {
      if (!selectedColour) return;

      const colourVariants = variantsByColour[selectedColour];
      if (!colourVariants || colourVariants.length === 0) return;

      const variant =
        colourVariants.find((v) => v.size === selectedSize) ??
        colourVariants[0];

      if (!variant) return;

      const sorted = normalizeImages(variant.images ?? []);

      // Bail out if nothing changed
      setDisplayImages((prev) => {
        if (prev.length === sorted.length && prev.every((v, i) => v === sorted[i])) {
          return prev; // no change
        }
        return sorted;
      });

      setMainImage((prev) => (prev === (sorted[0] ?? "") ? prev : (sorted[0] ?? "")));
    }, [selectedColour, selectedSize, variantsByColour]);

  const SIDEBAR_TITLES: Record<
    string,
    string | ((props: any) => string)
  > = {
    product: "Product",
    text: ({ selectedText }) =>
      selectedText ? "Text Properties" : "Text",

    clipart: ({ selectedUploadedImage, imageState }) =>
      selectedUploadedImage && imageState[selectedUploadedImage]?.isClipart
        ? "Clipart Properties"
        : "Clipart",

    upload: ({ selectedUploadedImage, imageState }) =>
      selectedUploadedImage && !imageState[selectedUploadedImage]?.isClipart
        ? "Image Properties"
        : "Upload",
  };



 const renderActiveTab = () => {
  // ---------------- MULTI-SELECTION ----------------
  if (selectedObjects.length > 1) {
    return (
      <MultiSelectPanel
        selectedObjects={selectedObjects}
        imageState={imageState}
      />
    );
  }

  // ---------------- BLANK SIDEBAR ----------------
  // Blank should ONLY appear when explicitly set
  if (activeSidebar === "blank") {
    return (
      <BlankSidebar
        onOpenProduct={() => setSidebarStack(["product"])}
        onOpenUpload={() => setSidebarStack(["upload"])}
        onOpenText={() => setSidebarStack(["text"])}
        onOpenClipart={() => setSidebarStack(["clipart"])}
      />
    );
  }

  // ---------------- HELPERS ----------------
  const resetAndOpen = (view: SidebarView) => {
    setSelectedObjects([]);
    setSelectedUploadedImage(null);
    setSelectedText(null);
    setSidebarStack([view]);
  };

  // ---------------- OTHER SIDEBARS ----------------
  switch (activeSidebar) {
    // ------------------------------------
    // PRODUCT
    // ------------------------------------
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

    // ------------------------------------
    // UPLOAD
    // ------------------------------------
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

    // ------------------------------------
    // TEXT
    // ------------------------------------
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
              setSidebarStack(["text"]);
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
          rotation={layer.rotation ?? 0}
          onRotationChange={(val) =>
            updateTextLayer(selectedText, { rotation: val })
          }
          fontSize={layer.fontSize ?? 24}
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
          flip={layer.flip ?? "none"}
          onFlipChange={(val) =>
            updateTextLayer(selectedText, { flip: val })
          }
          onDuplicate={() => duplicateTextLayer(selectedText)}
          onDelete={() => deleteTextLayer(selectedText)}
          restrictedBox={restrictedBox}
        />
      );
    }

    // ------------------------------------
    // CLIPART
    // ------------------------------------
    case "clipart": {
      const layer =
        selectedUploadedImage &&
        imageState[selectedUploadedImage]?.isClipart
          ? imageState[selectedUploadedImage]
          : null;

      if (layer) {
        return (
          <ClipartProperties
            layer={layer}
            restrictedBox={{
              x: restrictedBox.left,
              y: restrictedBox.top,
              width: restrictedBox.width,
              height: restrictedBox.height,
            }}
            canvasPosition={positions[layer.id]}
            onRotate={(v) =>
              handleRotateImage(selectedUploadedImage!, v)
            }
            onFlip={(v) =>
              handleFlipImage(selectedUploadedImage!, v)
            }
            onResize={(w, h) =>
              handleUpdateImageSize(selectedUploadedImage!, w, h)
            }
            onChangeColor={(color) =>
              handleChangeImageColor(selectedUploadedImage!, color)
            }
            onChangeArt={handleChangeClipart}
            onDelete={() =>
              handleRemoveUploadedImage(selectedUploadedImage!)
            }
            onDuplicate={() =>
              handleDuplicateUploadedImage(selectedUploadedImage!)
            }
          />
        );
      }

      return (
        <Clipart
          onBack={goBackSidebar}
          onAddClipart={(url) => {
            if (replaceClipartId) {
              handleReplaceClipart(url);
              setReplaceClipartId(null);
            } else {
              handleAddClipart(url);
            }
          }}
          setSidebarTitle={setSidebarTitleOverride}
          onOpenSections={() => {
            setSidebarTitleOverride(null);
            setSidebarStack(["clipart-sections"]);
          }}
        />
      );
    }

    // ------------------------------------
    // CLIPART SECTIONS
    // ------------------------------------
    case "clipart-sections":
      return (
        <ClipartSectionsPage
          onBack={() => {
            setSidebarTitleOverride(null);
            goBackSidebar();
          }}
        />
      );

    // ------------------------------------
    // FALLBACK
    // ------------------------------------
    default:
      return (
        <BlankSidebar
          onOpenProduct={() => resetAndOpen("product")}
          onOpenUpload={() => resetAndOpen("upload")}
          onOpenText={() => resetAndOpen("text")}
          onOpenClipart={() => resetAndOpen("clipart")}
        />
      );
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

            <button
              onClick={closeToBlank}
              className="p-2 rounded-full hover:bg-red-100"
            >

                <X size={28} className="text-red-600" />
              </button>
            </div>
          </div>

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
            onClick={() => {
              setSidebarStack([tab.id as SidebarView]);


              // 🔑 STEP 3 — clear incompatible selections
              if (tab.id !== "clipart") {
                setSelectedUploadedImage(null);
              }
              if (tab.id !== "text") {
                setSelectedText(null);
              }
            }}
            className={`w-full h-16 flex flex-col items-center justify-center rounded-xl transition ${
              activeSidebar === tab.id
                ? "bg-neutral-600"
                : "bg-neutral-700 hover:bg-neutral-600"
            }`}
          >
            {React.cloneElement(tab.icon, { className: "text-white" })}
            <span className="text-white text-sm">{tab.label}</span>
          </button>
        ))}
      </div>

{/* ===================== RIGHT SIDEBAR ===================== */}
<div className="w-[480px] ml-4 mt-4 mb-6 h-[calc(100vh-160px)]">
  {selectedObjects.length > 1 ? (
    // ---------------- MULTI-SELECTION ----------------
    <div className="bg-white dark:bg-gray-800 shadow-xl border rounded-2xl overflow-y-auto h-full">
      <div className="p-4">
        <MultiSelectPanel
          selectedObjects={selectedObjects}
          imageState={imageState}
        />
      </div>
    </div>
  ) : activeSidebar === "blank" ? (
    // ---------------- BLANK SIDEBAR ----------------
    <BlankSidebar
      onOpenProduct={() => setSidebarStack(["product"])}
      onOpenUpload={() => setSidebarStack(["upload"])}
      onOpenText={() => setSidebarStack(["text"])}
      onOpenClipart={() => setSidebarStack(["clipart"])}
    />
  ) : (
    // ---------------- NORMAL SIDEBAR ----------------
    <div className="bg-white dark:bg-gray-800 shadow-xl border rounded-2xl overflow-y-auto h-full">
      {/* ---------- Sidebar Header ---------- */}
      <SidebarHeader
        title={
          sidebarTitleOverride ??
          (typeof SIDEBAR_TITLES[activeSidebar] === "function"
            ? SIDEBAR_TITLES[activeSidebar]!({
                selectedText,
                selectedUploadedImage,
                imageState,
              })
            : SIDEBAR_TITLES[activeSidebar] ?? "")
        }
        canGoBack={sidebarStack.length > 1}
        onBack={goBackSidebar}
        onClose={() => setSidebarStack(["blank"])}
      />

      {/* ---------- Sidebar Content ---------- */}
      <div className="p-4">
        {renderActiveTab()}
      </div>
    </div>
  )}
</div>


{/* ===================== MAIN CANVAS ===================== */}
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

  // ✅ Allow canvas to request sidebar changes (controlled)
  onSwitchTab={(tab) => {
    if (!tab) return;

    if (tab !== "clipart") setSelectedUploadedImage(null);
    if (tab !== "text") setSelectedText(null);

    setSidebarStack([tab as SidebarView]);
  }}

  onDelete={handleDeleteImages}
  onResizeTextCommit={handleResizeText}
  onSelectionChange={handleCanvasSelectionChange}
/>

          </div>
        </div>
      </div>
    );
  }