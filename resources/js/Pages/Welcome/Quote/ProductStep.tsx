import React, { useState } from "react";
import { QuoteItem } from "./GetQuoteInstantly";

type Props = {
  productType: string;
  setProductType: (v: string) => void;
  quantity: number;
  setQuantity: (v: number) => void;
  sizeCategory: string;
  setSizeCategory: (v: string) => void;
  size: string;
  setSize: (v: string) => void;
  onNext: () => void;
  onGetQuote: () => void;
  onRemoveItem: (index: number) => void;
  sizeOptions: Record<string, string[]>;
  items: QuoteItem[];
};

export default function ProductStep({
  productType,
  setProductType,
  quantity,
  setQuantity,
  sizeCategory,
  setSizeCategory,
  size,
  setSize,
  onNext,
  onGetQuote,
  onRemoveItem,
  sizeOptions,
  items,
}: Props) {
  const [showProductForm, setShowProductForm] = useState(items.length === 0);

  /* ================= PRODUCT FORM ================= */
  if (showProductForm) {
    return (
      <>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Select Product
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <select
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            className="border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-[#C9A24D]"
          >
            <optgroup label="CLOTHING">
              <option>T Shirts</option>
              <option>Long sleeve shirts</option>
              <option>Polo tops</option>
              <option>Trousers</option>
              <option>Jeans</option>
              <option>Joggers</option>
              <option>Shorts</option>
              <option>Hoodies</option>
              <option>Jackets</option>
              <option>Quarter Zips</option>
              <option>Tracksuit</option>
              <option>Nightwear</option>
            </optgroup>
            <optgroup label="SPORTS">
              <option>Sports uniform</option>
              <option>Sports top</option>
              <option>Sports bottoms</option>
              <option>Sports shorts</option>
            </optgroup>
            <optgroup label="ACCESSORIES">
              <option>Socks</option>
              <option>Boxers</option>
              <option>Gloves</option>
              <option>Hats</option>
              <option>Scarves</option>
            </optgroup>
            <optgroup label="OTHER">
              <option>Baby bibs</option>
              <option>Bears</option>
              <option>Baby sets</option>
            </optgroup>
          </select>

          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border border-gray-300 rounded-2xl px-4 py-3"
          />

          <select
            value={sizeCategory}
            onChange={(e) => {
              setSizeCategory(e.target.value);
              setSize(sizeOptions[e.target.value][0]);
            }}
            className="border border-gray-300 rounded-2xl px-4 py-3"
          >
            {Object.keys(sizeOptions).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="border border-gray-300 rounded-2xl px-4 py-3"
          >
            {sizeOptions[sizeCategory].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            setShowProductForm(false);
            onNext();
          }}
          className="w-full px-6 py-4 bg-[#C9A24D] text-white font-bold rounded-3xl hover:opacity-90 transition"
        >
          Add Product
        </button>
      </>
    );
  }

  /* ================= QUOTE VIEW ================= */
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Your Quote
      </h2>

      <div className="space-y-4 mb-10">
        {items.map((item, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm flex items-center justify-between"
          >
            {/* Left */}
            <div>
              <p className="font-semibold text-gray-900">
                {item.productType}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {item.quantity} × {item.designType}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {item.sizeCategory} — {item.size}
              </p>
            </div>

            {/* Center-right action */}
            <button
              onClick={() => onRemoveItem(i)}
              className="text-sm font-semibold text-[#C9A24D] hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => setShowProductForm(true)}
          className="flex-1 px-6 py-4 border-2 border-[#C9A24D] text-[#C9A24D] font-bold rounded-3xl hover:bg-[#C9A24D] hover:text-white transition"
        >
          Add Another Item
        </button>

        <button
          onClick={onGetQuote}
          className="flex-1 px-6 py-4 bg-[#C9A24D] text-white font-bold rounded-3xl hover:opacity-90 transition"
        >
          Get Quote Price
        </button>
      </div>
    </>
  );
}
