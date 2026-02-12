import React, { useState } from "react";
import ProductStep from "./ProductStep";
import EmbroideryStep from "./EmbroideryStep";
import ContactStep from "./ContactStep";

/* ================= TYPES ================= */
export type QuoteItem = {
  productType: string;
  quantity: number;
  designType: string;
  sizeCategory: string;
  size: string;
  price: number;
};

/* ================= CONSTANTS ================= */
export const sizeOptions: Record<string, string[]> = {
  Women: ["XS", "S", "M", "L", "XL", "XXL"],
  Men: ["XS", "S", "M", "L", "XL", "XXL"],
  Junior: ["13-15 YRS", "12-13 YRS", "10-12 YRS", "8-10 YRS", "7-8 YRS"],
  Children: ["6-7 YRS", "5-6 YRS", "4-5 YRS", "3-4 YRS", "2-3 YRS"],
  Infants: ["Baby & Newborn", "3-6M", "6-9M", "9-12M", "12-18M"],
};

/* ================= PRICE LOGIC ================= */
export const calculatePrice = (
  productType: string,
  quantity: number,
  designType: string,
  size: string
) => {
  let basePrice = 0;

  const clothingBase: Record<string, number> = {
    "T Shirts": 10,
    "Long sleeve shirts": 12,
    "Polo tops": 14,
    Trousers: 15,
    Jeans: 18,
    Joggers: 12,
    Shorts: 10,
    Hoodies: 20,
    Jackets: 30,
    "Quater Zips": 28,
    Nightwear: 15,
    Tracksuit: 40,
  };

  const sportsBase: Record<string, number> = {
    "Sports uniform": 25,
    "Sports top": 12,
    "Sports bottoms": 12,
    "Sports shorts": 10,
  };

  const accessoriesBase: Record<string, number> = {
    Socks: 5,
    Gloves: 8,
    Hats: 8,
    Scarves: 7,
    Boxers: 6,
  };

  const otherBase: Record<string, number> = {
    "Baby bibs": 5,
    Bears: 12,
    "Baby sets": 20,
  };

  basePrice =
    clothingBase[productType] ||
    sportsBase[productType] ||
    accessoriesBase[productType] ||
    otherBase[productType] ||
    10;

  if (designType === "Custom Design") basePrice *= 1.2;
  if (designType === "Complex Pattern") basePrice *= 1.5;
  if (designType === "Text") basePrice *= 0.8;
  if (designType === "Image") basePrice *= 1.3;

  if (size.includes("XS") || size.includes("2-3") || size.includes("BABY"))
    basePrice *= 1;
  else if (size.includes("S")) basePrice *= 1.05;
  else if (size.includes("M")) basePrice *= 1.1;
  else if (size.includes("L") || size.includes("XL")) basePrice *= 1.2;
  else if (size.includes("XXL") || size.includes("12-18M"))
    basePrice *= 1.3;

  return basePrice * quantity;
};

/* ================= MAIN ================= */
export default function GetQuoteInstantly() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [productType, setProductType] = useState("T Shirts");
  const [quantity, setQuantity] = useState(1);
  const [designType, setDesignType] = useState("Logo");
  const [sizeCategory, setSizeCategory] = useState("Women");
  const [size, setSize] = useState("XS");

  const [items, setItems] = useState<QuoteItem[]>([]);
  const [total, setTotal] = useState(0);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const addItem = () => {
    const price = calculatePrice(productType, quantity, designType, size);

    setItems((prev) => [
      ...prev,
      { productType, quantity, designType, sizeCategory, size, price },
    ]);

    setTotal((t) => t + price);

    setProductType("T Shirts");
    setQuantity(1);
    setDesignType("Logo");
    setSizeCategory("Women");
    setSize("XS");

    setStep(1);
  };

  const removeItem = (index: number) => {
  setItems((prev) => {
    const updated = [...prev];
    const removed = updated.splice(index, 1)[0];
    setTotal((t) => t - removed.price);
    return updated;
  });
};


  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl px-12 py-8 sm:px-12 sm:py-10">
      <h1 className="text-4xl font-extrabold text-center mb-6">
        Get Quote Instantly
      </h1>

      {step === 1 && (
        <ProductStep
          productType={productType}
          setProductType={setProductType}
          quantity={quantity}
          setQuantity={setQuantity}
          sizeCategory={sizeCategory}
          setSizeCategory={setSizeCategory}
          size={size}
          setSize={setSize}
          sizeOptions={sizeOptions}
          items={items}
          onNext={() => setStep(2)}
          onGetQuote={() => setStep(3)}
          onRemoveItem={removeItem}
        />
      )}

      {step === 2 && (
        <EmbroideryStep
          designType={designType}
          setDesignType={setDesignType}
          onBack={() => setStep(1)}
          onAdd={addItem}
        />
      )}

      {step === 3 && (
        <ContactStep
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          items={items}
          total={total}
        />
      )}
    </div>
  );
}
