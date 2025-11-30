"use client";

import React, { useState } from "react";
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

interface ColourProduct {
  colour: string;
  slug: string;
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
  images: { id?: number; url?: string }[];
  sizes?: string[];
  colourProducts?: ColourProduct[];
  specifications?: string;
}

interface DesignProps {
  product?: Product | null;
  selectedColour?: string;
  selectedSize?: string;
}

export default function Design() {
  const { props } = usePage();
  const { product, selectedColour, selectedSize } = props as DesignProps;

  const safeProduct: Product = product ?? {
    name: "Unknown Product",
    slug: "",
    brand: "",
    images: [],
    sizes: [],
    colourProducts: [],
  };

  const safeName = safeProduct.name ?? "Unknown Product";

  const safeImages =
    safeProduct.colourProducts?.find((cp) => cp.colour === selectedColour)?.images ??
    safeProduct.images?.map((img) => img.url ?? "") ??
    [];

  const safeColour = selectedColour ?? safeProduct.colourProducts?.[0]?.colour ?? "N/A";
  const safeSize =
    selectedSize ??
    safeProduct.colourProducts?.find((cp) => cp.colour === safeColour)?.sizes?.[0] ??
    safeProduct.sizes?.[0] ??
    "N/A";

  const productImages = safeImages; // All images for vertical right column
  const [mainImage, setMainImage] = useState<string>(productImages[0] ?? "");

  const [activeTab, setActiveTab] = useState<string>("product");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "product":
        return <ProductEdit product={safeProduct} />;
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
  const handleGoForward = () => alert("Next step (future feature)");
  const handleClose = () => router.back();

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900">
      <Head title="Start Designing" />

      {/* NAVBAR */}
      <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 h-16 z-50 shadow-sm">
        <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {safeName.replace(/-/g, " ")}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleGoBack}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <ArrowLeft size={24} strokeWidth={2} />
          </button>

          <button
            onClick={handleGoForward}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <ArrowRight size={24} strokeWidth={2} />
          </button>

          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-800 transition"
          >
            <X size={28} strokeWidth={2.5} className="text-red-600 dark:text-red-400" />
          </button>
        </div>
      </div>

      {/* PAGE LAYOUT */}
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
              className={`w-full h-16 flex flex-col items-center justify-center gap-1 rounded-xl font-semibold transition
                ${activeTab === tab.id ? "bg-neutral-600" : "bg-neutral-700 hover:bg-neutral-600"}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {React.cloneElement(tab.icon, { className: "text-white" })}
              <span className="text-white text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* RIGHT CONTENT SIDEBAR */}
        <div className="w-[480px] ml-4 mt-4 mb-6 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-2xl p-4 h-[calc(100vh-160px)] overflow-y-auto">
          {renderActiveTab()}
        </div>

        {/* DESIGN CANVAS — FULL PAGE GREY BACKGROUND */}
        <div className="flex-1 mt-4 mb-6 mr-6 h-[calc(100vh-160px)] bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
          <DesignImage
            productImage={mainImage}
            safeName={safeName}
            productImages={productImages}
            onSelectImage={(img) => setMainImage(img)}
          />
        </div>

      </div>
    </div>
  );
}
