"use client";

import React, { useState, useMemo, useEffect } from "react";
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
import Upload from "./Sidebar/Upload";
import AddText from "./Sidebar/AddText";
import Clipart from "./Sidebar/Clipart";
import DesignImage from "./Image";

// ⭐ REAL MODAL
import ChangeProductModal from "./ChangeProduct";

interface ColourProduct {
  colour: string;
  sizes: string[];
  images: string[];
}

interface Product {
  brand: string;
  name: string;
  slug: string;
  price: number | string;
  original_price?: number | string | null;
  description?: string;
  images: string[];
  sizes?: string[];
  colourProducts?: ColourProduct[];
  variants?: any[];
}

interface DesignProps {
  product: Product;
  selectedColour?: string;
  selectedSize?: string;
}

type Variant = {
  id?: number | string;
  colour: string;
  size?: string;
  images?: Array<string | { path?: string; url?: string }>;
};

// ---------- SORT IMAGES ----------
const sortImagesByName = (images: string[]) => {
  const weight = (img: string) => {
    const lower = img.toLowerCase();
    if (lower.includes("front")) return 0;
    if (lower.includes("back")) return 1;
    if (lower.includes("right") || lower.includes("rsleeve") || lower.includes("rs")) return 2;
    if (lower.includes("left") || lower.includes("lsleeve") || lower.includes("ls")) return 3;
    return 4;
  };
  return [...images].sort((a, b) => weight(a) - weight(b));
};

export default function Design() {
  const { props } = usePage();
  const { product, selectedColour: propColour, selectedSize: propSize } =
    props as DesignProps;

  const safeProduct = product ?? {
    name: "Unknown",
    brand: "",
    slug: "",
    images: [],
    sizes: [],
    colourProducts: [],
  };

  const safeName = safeProduct.name ?? "Unknown";

  // -------------------------
  // MODAL MANAGEMENT
  // -------------------------
  const [isChangeProductModalOpen, setIsChangeProductModalOpen] = useState(false);

  const handleOpenChangeProductModal = () => setIsChangeProductModalOpen(true);
  const handleCloseChangeProductModal = () => setIsChangeProductModalOpen(false);

  // ---------- GROUP VARIANTS ----------
  const variantsByColour: Record<string, Variant[]> = useMemo(() => {
    const grouped: Record<string, Variant[]> = {};

    if (Array.isArray(safeProduct?.colourProducts) && safeProduct.colourProducts.length > 0) {
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
    } else {
      (safeProduct?.variants ?? []).forEach((v: Variant) => {
        const colour = v.colour ?? "Unknown";
        if (!grouped[colour]) grouped[colour] = [];
        grouped[colour].push({ ...v, images: v.images ?? [] });
      });
    }

    return grouped;
  }, [safeProduct]);

  const uniqueColours = Object.keys(variantsByColour);

  // ---------- NORMALIZE IMAGES ----------
  const normalizeImages = (
    images: Array<string | { path?: string; url?: string }> | undefined
  ): string[] => {
    if (!images) return [];
    return images.map((img) =>
      typeof img === "string"
        ? img
        : img.url ?? img.path ?? ""
    );
  };

  // ---------- STATE ----------
  const [selectedColour, setSelectedColour] = useState<string | null>(
    propColour && uniqueColours.includes(propColour)
      ? propColour
      : uniqueColours[0] ?? null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(propSize ?? null);
  const [displayImages, setDisplayImages] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<string>("");

  // ---------- INIT IMAGE SET ----------
  useEffect(() => {
    if (!selectedColour) return;

    const sizesForColour = variantsByColour[selectedColour]
      .map((v) => v.size)
      .filter(Boolean);

    if (!selectedSize) setSelectedSize(sizesForColour[0] ?? null);

    const variant =
      variantsByColour[selectedColour].find((v) => v.size === selectedSize) ??
      variantsByColour[selectedColour][0];

    const sorted = sortImagesByName(normalizeImages(variant?.images ?? []));
    setDisplayImages(sorted);
    setMainImage(sorted[0] ?? "");
  }, [selectedColour, selectedSize, variantsByColour]);

  // ---------- COLOUR CHANGE ----------
  const handleColourChange = (colour: string) => {
    setSelectedColour(colour);

    const sizesForColour = variantsByColour[colour]
      .map((v) => v.size)
      .filter(Boolean);

    const sizeToUse = sizesForColour.includes(selectedSize ?? "")
      ? selectedSize
      : sizesForColour[0] ?? null;

    setSelectedSize(sizeToUse);

    const variant =
      variantsByColour[colour].find((v) => v.size === sizeToUse) ??
      variantsByColour[colour][0];

    const sorted = sortImagesByName(normalizeImages(variant?.images ?? []));
    setDisplayImages(sorted);
    setMainImage(sorted[0] ?? "");
  };

  // ---------- SIZE CHANGE ----------
  const handleSizeChange = (size: string) => {
    setSelectedSize(size);

    const variant =
      variantsByColour[selectedColour!].find((v) => v.size === size) ??
      variantsByColour[selectedColour!][0];

    const sorted = sortImagesByName(normalizeImages(variant?.images ?? []));
    setDisplayImages(sorted);
    setMainImage(sorted[0] ?? "");
  };

  // ---------- SIDEBAR TABS ----------
  const [activeTab, setActiveTab] = useState<string>("product");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "product":
        return (
          <ProductEdit
            product={safeProduct}
            selectedColour={selectedColour}
            selectedSize={selectedSize}
            onColourChange={handleColourChange}
            onSizeChange={handleSizeChange}
            onOpenChangeProductModal={handleOpenChangeProductModal}
          />
        );
      case "upload":
        return <Upload />;
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

  // ---------- RENDER ----------
  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900 relative">

      <Head title="Start Designing" />

      {/* ------------------------------ */}
      {/* ⭐ MODAL (always above everything) */}
      {/* ------------------------------ */}
      {isChangeProductModalOpen && (
        <ChangeProductModal onClose={handleCloseChangeProductModal} />
      )}

      {/* ------------------------------ */}
      {/* ⭐ BLUR EVERYTHING WHEN MODAL IS OPEN */}
      {/* ------------------------------ */}
      <div
        className={`
          transition-all duration-300
          ${isChangeProductModalOpen ? "blur-lg scale-[0.98] opacity-40" : ""}
        `}
      >

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

        {/* MAIN CONTENT */}
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
          <div className="flex-1 mt-4 mb-6 mr-6 h-[calc(100vh-160px)] bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
            <DesignImage
              productImage={mainImage}
              safeName={safeName}
              productImages={displayImages}
              onSelectImage={setMainImage}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
