import { useEffect, useMemo, useState } from "react";

type Variant = {
  id?: number | string;
  colour: string;
  size?: string;
  images?: Array<string | { path: string }>;
  [k: string]: any;
};

export default function ProductEdit({ product }: { product: any }) {
  console.log("=== PRODUCT RECEIVED ===");
  console.log(JSON.parse(JSON.stringify(product)));

  // ---------- Build variants grouped by colour
  const variantsByColour: Record<string, Variant[]> = useMemo(() => {
    const grouped: Record<string, Variant[]> = {};

    console.log("Raw product.colourProducts:", product?.colourProducts);
    console.log("Raw product.variants:", product?.variants);

    // If using colourProducts
    if (Array.isArray(product?.colourProducts) && product.colourProducts.length > 0) {
      product.colourProducts.forEach((cp: any) => {
        const colour = cp.colour;
        const sizes = cp.sizes ?? [];
        const images = cp.images ?? product.images ?? [];

        if (!grouped[colour]) grouped[colour] = [];

        if (sizes.length) {
          sizes.forEach((s: string) =>
            grouped[colour].push({
              colour,
              size: s,
              images,
            })
          );
        } else {
          grouped[colour].push({
            colour,
            size: undefined,
            images,
          });
        }
      });

      console.log("Grouped via colourProducts:", grouped);
      return grouped;
    }

    // Else use product.variants
    (product?.variants ?? []).forEach((v: Variant) => {
      const colour = v.colour ?? "Unknown";
      if (!grouped[colour]) grouped[colour] = [];
      grouped[colour].push({
        ...v,
        images: v.images ?? [],
      });
    });

    console.log("Grouped via variants:", grouped);
    return grouped;
  }, [product]);

  const uniqueColours = Object.keys(variantsByColour);

  // ---------- Image normalizer
  const normalizeImages = (images: Array<string | { path: string }> | undefined) => {
    if (!images) return [];
    const normalized = images.map((img) =>
      typeof img === "string" ? img : img?.path ?? ""
    );
    console.log("Normalized images:", normalized);
    return normalized;
  };

  // ---------- STATE
  const [selectedColour, setSelectedColour] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [displayImages, setDisplayImages] = useState<string[]>([]);

  // ---------- INIT FROM URL OR DEFAULTS
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlColour = params.get("colour");
    const urlSize = params.get("size");

    console.log("URL Params → colour:", urlColour, "size:", urlSize);

    let initialColour =
      (urlColour && uniqueColours.includes(urlColour)) ? urlColour :
      uniqueColours[0] ?? null;

    const sizesForColour =
      initialColour ? variantsByColour[initialColour].map((v) => v.size).filter(Boolean) : [];

    let initialSize =
      (urlSize && sizesForColour.includes(urlSize)) ? urlSize :
      sizesForColour[0] ?? null;

    console.log("Initial computed selectedColour:", initialColour);
    console.log("Initial computed selectedSize:", initialSize);

    setSelectedColour(initialColour);
    setSelectedSize(initialSize);

    const variant = initialColour ? variantsByColour[initialColour][0] : undefined;
    const imgs = variant?.images ?? product?.images ?? [];

    console.log("Initial variant images:", imgs);
    setDisplayImages(normalizeImages(imgs));
  }, [product]);

  // ---------- Update when clicking colour
  const handleColourClick = (colour: string) => {
    console.log("Clicked colour:", colour);

    setSelectedColour(colour);

    const sizesForColour = variantsByColour[colour].map((v) => v.size).filter(Boolean);
    console.log("Sizes for this colour:", sizesForColour);

    // fix size if not available
    if (!sizesForColour.includes(selectedSize ?? "")) {
      const newSize = sizesForColour[0] ?? null;
      console.log("Updated size due to colour change:", newSize);
      setSelectedSize(newSize);
    }

    const imgs = variantsByColour[colour]?.[0]?.images ?? product.images ?? [];
    console.log("Colour clicked → images:", imgs);
    setDisplayImages(normalizeImages(imgs));
  };

  // ---------- Update when clicking size
  const handleSizeClick = (size: string) => {
    console.log("Clicked size:", size);
    setSelectedSize(size);
  };

  // ---------- Sizes for selected colour
  const availableSizes =
    selectedColour ? variantsByColour[selectedColour].map((v) => v.size).filter(Boolean) : [];

  // ---------- Colour preview helper
  const previewForColour = (colour: string) => {
    const variant = variantsByColour[colour]?.[0];
    const imgs = normalizeImages(variant?.images ?? product.images ?? []);
    console.log(`Preview for colour "${colour}":`, imgs[0]);
    return imgs[0];
  };

  console.log("Render → selectedColour:", selectedColour, "selectedSize:", selectedSize);
  console.log("Render → displayImages:", displayImages);

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{product?.name}</h1>
        </div>
      </div>

      {/* IMAGE */}
      <div className="mt-4">
        <img
          src={displayImages?.[0] ?? ""}
          alt="main"
          className="w-full h-48 object-cover rounded-md border bg-gray-100"
        />
      </div>

      {/* COLOURS */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Colours</h2>
        {uniqueColours.map((colour) => (
          <button
            key={colour}
            onClick={() => handleColourClick(colour)}
            className={`mr-2 px-2 py-1 rounded border ${
              selectedColour === colour ? "border-black" : "border-gray-300"
            }`}
          >
            {colour}
          </button>
        ))}
      </div>

      {/* SIZES */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Sizes</h2>
        {availableSizes.map((s) => (
          <button
            key={s}
            onClick={() => handleSizeClick(s)}
            className={`mr-2 px-2 py-1 rounded border ${
              selectedSize === s ? "border-black" : "border-gray-300"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
