"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import {
  ArrowLeft,
  ArrowRight,
  X,
  Shirt,
  Upload as UploadIcon,
  Type,
  Image as ClipartIcon,
} from "lucide-react";

import ProductEdit from "./Sidebar/ProductEdit";
import AddText from "./Sidebar/AddText";
import Clipart from "./Sidebar/Clipart";
import DesignImage from "./Image";
import ChangeProductModal from "./ChangeProduct";

// ---------- UPLOAD COMPONENT ----------
function Upload({ onUpload }: { onUpload: (url: string) => void }) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    onUpload(url);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">Upload Images</h2>
      <p className="text-gray-600 mb-4">Upload your own images to add to the canvas.</p>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full bg-white p-2 rounded border border-gray-300"
      />
    </div>
  );
}

// ---------- MAIN DESIGN COMPONENT ----------
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
  const handleOpenChangeProductModal = () => setIsChangeProductModalOpen(true);
  const handleCloseChangeProductModal = () => setIsChangeProductModalOpen(false);

  const currentCategory = safeProduct.categories?.[0] ?? null;

  const variantsByColour: Record<string, any[]> = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    if (Array.isArray(safeProduct?.colourProducts) && safeProduct.colourProducts.length > 0) {
      safeProduct.colourProducts.forEach((cp) => {
        const colour = cp.colour;
        const sizes = cp.sizes ?? [];
        const images = cp.images ?? safeProduct.images ?? [];
        if (!grouped[colour]) grouped[colour] = [];
        if (sizes.length) sizes.forEach((s) => grouped[colour].push({ colour, size: s, images }));
        else grouped[colour].push({ colour, size: undefined, images });
      });
    } else {
      (safeProduct?.variants ?? []).forEach((v: any) => {
        const colour = v.colour ?? "Unknown";
        if (!grouped[colour]) grouped[colour] = [];
        grouped[colour].push({ ...v, images: v.images ?? [] });
      });
    }
    return grouped;
  }, [safeProduct]);

  const uniqueColours = Object.keys(variantsByColour);

  const normalizeImages = (
    images: Array<string | { path?: string; url?: string }> | undefined
  ): string[] => {
    if (!images) return [];
    return images.map((img) => (typeof img === "string" ? img : img.url ?? img.path ?? ""));
  };

  const [selectedColour, setSelectedColour] = useState<string | null>(
    propColour && uniqueColours.includes(propColour) ? propColour : uniqueColours[0] ?? null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(propSize ?? null);
  const [displayImages, setDisplayImages] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<string>("");

  // Uploaded images state (static position for now)
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // ---------- INIT IMAGE SET ----------
  useEffect(() => {
    if (!selectedColour) return;
    const variant =
      variantsByColour[selectedColour].find((v) => v.size === selectedSize) ??
      variantsByColour[selectedColour][0];

    const sorted = normalizeImages(variant?.images ?? []);
    setDisplayImages(sorted);
    setMainImage(sorted[0] ?? "");
  }, [selectedColour, selectedSize, variantsByColour]);

  // ---------- UPDATE CANVAS SIZE ----------
  useEffect(() => {
    if (!canvasRef.current) return;
    const { width, height } = canvasRef.current.getBoundingClientRect();
    setCanvasSize({ width, height });
  }, [canvasRef.current]);

  // ---------- UPLOAD HANDLER ----------
  const handleUpload = (url: string) => {
    setUploadedImages((prev) => [...prev, url]);
  };

  const [activeTab, setActiveTab] = useState<string>("product");
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
            onOpenChangeProductModal={handleOpenChangeProductModal}
          />
        );
      case "upload":
        return <Upload onUpload={handleUpload} />;
      case "text":
        return <AddText />;
      case "clipart":
        return <Clipart />;
      default:
        return null;
    }
  };

  const handleGoBack = () => router.back();
  const handleGoForward = () => alert("Next step coming soon");
  const handleClose = () => router.back();

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900 relative">
      <Head title="Start Designing" />

      {isChangeProductModalOpen && (
        <ChangeProductModal onClose={handleCloseChangeProductModal} currentCategory={currentCategory} />
      )}

      <div className={isChangeProductModalOpen ? "blur-lg scale-[0.98] opacity-40 transition-all duration-300" : ""}>
        {/* NAVBAR */}
        <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 h-16 z-40 shadow-sm">
          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{safeName}</div>
          <div className="flex items-center gap-4">
            <button onClick={handleGoBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <ArrowLeft size={24} />
            </button>
            <button onClick={handleGoForward} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <ArrowRight size={24} />
            </button>
            <button onClick={handleClose} className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-800 transition">
              <X size={28} className="text-red-600 dark:text-red-400" />
            </button>
          </div>
        </div>

        <div className="pt-[96px] flex min-h-screen">
          {/* LEFT SIDEBAR */}
          <div className="w-[140px] ml-6 mt-4 mb-6 bg-neutral-700 shadow-xl border border-gray-700 rounded-2xl p-4 flex flex-col gap-4 items-center h-[calc(100vh-160px)]">
            {[
              { id: "product", icon: <Shirt size={22} />, label: "Product" },
              { id: "upload", icon: <UploadIcon size={22} />, label: "Upload" },
              { id: "text", icon: <Type size={22} />, label: "Text" },
              { id: "clipart", icon: <ClipartIcon size={22} />, label: "Clipart" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full h-16 flex flex-col items-center justify-center gap-1 rounded-xl font-semibold transition
                  ${activeTab === tab.id ? "bg-neutral-600" : "bg-neutral-700 hover:bg-neutral-600"}`}
              >
                {React.cloneElement(tab.icon, { className: "text-white" })}
                <span className="text-white text-sm">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="w-[480px] ml-4 mt-4 mb-6 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-2xl p-4 h-[calc(100vh-160px)] overflow-y-auto">
            {renderActiveTab()}
          </div>

          {/* DESIGN CANVAS */}
          <div
            ref={canvasRef}
            className="flex-1 mt-4 mb-6 mr-6 h-[calc(100vh-160px)] bg-gray-200 dark:bg-gray-800 flex items-center justify-center relative overflow-hidden"
          >
            {/* Main product image */}
            <DesignImage
              productImage={mainImage}
              safeName={safeName}
              productImages={displayImages}
              onSelectImage={setMainImage}
            />

            {/* Small restricted box */}
            {canvasSize.width > 0 && (
              <div
                className="absolute border-2 border-dashed border-blue-500 pointer-events-none"
                style={{
                  left: canvasSize.width * 0.37,
                  top: canvasSize.height * 0.15,
                  width: canvasSize.width * 0.25,
                  height: canvasSize.height * 0.6,
                }}
              />
            )}

            {/* Uploaded images (static) */}
            {uploadedImages.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Uploaded ${i}`}
                className="absolute top-0 left-0 max-w-[200px] max-h-[200px] object-contain"
                style={{
                  transform: `translate(${canvasSize.width * 0.45 + 5}px, ${canvasSize.height * 0.45 + 5}px)`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
