import React, { useState } from "react";

type QuoteItem = {
  productType: string;
  quantity: number;
  designType: string;
  sizeCategory: string;
  size: string;
  price: number;
};

export default function GetQuoteInstantly() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [productType, setProductType] = useState("T Shirts");
  const [quantity, setQuantity] = useState(1);
  const [designType, setDesignType] = useState("Logo");
  const [sizeCategory, setSizeCategory] = useState("Women");
  const [size, setSize] = useState("XS");
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [total, setTotal] = useState(0);

  // Size options
  const sizeOptions: Record<string, string[]> = {
    Women: ["XS", "S", "M", "L", "XL", "XXL"],
    Men: ["XS", "S", "M", "L", "XL", "XXL"],
    Junior: ["13-15 YRS", "12-13 YRS", "10-12 YRS", "8-10 YRS", "7-8 YRS"],
    Children: ["6-7 YRS", "5-6 YRS", "4-5 YRS", "3-4 YRS", "2-3 YRS"],
    Infants: ["Baby & Newborn ", "3-6M", "6-9M", "9-12M", "12-18M"],
  };

  // Base price calculation
  const calculatePrice = (
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
      "Trousers": 15,
      "Jeans": 18,
      "Joggers": 12,
      "Shorts": 10,
      "Hoodies": 20,
      "Jackets": 30,
      "Quater Zips": 28,
      "Nightwear": 15,
      "Tracksuit": 40,
    };

    const sportsBase: Record<string, number> = {
      "Sports uniform": 25,
      "Sports top": 12,
      "Sports bottoms": 12,
      "Sports shorts": 10,
    };

    const accessoriesBase: Record<string, number> = {
      "Socks": 5,
      "Gloves": 8,
      "Hats": 8,
      "Scarves": 7,
      "Boxers": 6,
    };

    const otherBase: Record<string, number> = {
      "Baby bibs": 5,
      "Bears": 12,
      "Baby sets": 20,
    };

    basePrice =
      clothingBase[productType] ||
      sportsBase[productType] ||
      accessoriesBase[productType] ||
      otherBase[productType] ||
      10;

    // Design type multiplier
    if (designType === "Logo") basePrice *= 1;
    if (designType === "Custom Design") basePrice *= 1.2;
    if (designType === "Complex Pattern") basePrice *= 1.5;
    if (designType === "Text") basePrice *= 0.8;
    if (designType === "Image") basePrice *= 1.3;

    // Size multiplier (simplified)
    if (size.includes("XS") || size.includes("2-3") || size.includes("3-4") || size.includes("BABY")) basePrice *= 1;
    else if (size.includes("S") || size.includes("4-5") || size.includes("5-6") || size.includes("6-7") || size.includes("7-8")) basePrice *= 1.05;
    else if (size.includes("M") || size.includes("8-10") || size.includes("10-12")) basePrice *= 1.1;
    else if (size.includes("L") || size.includes("12-13") || size.includes("13-15") || size.includes("XL")) basePrice *= 1.2;
    else if (size.includes("XXL") || size.includes("Extra Large") || size.includes("12-18M")) basePrice *= 1.3;

    return basePrice * quantity;
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    const price = calculatePrice(productType, quantity, designType, size);
    const newItem: QuoteItem = { productType, quantity, designType, sizeCategory, size, price };
    setItems([...items, newItem]);
    setTotal((prev) => prev + price);

    // Reset fields
    setQuantity(1);
    setDesignType("Logo");
    setSizeCategory("Women");
    setSize("XS");
  };

  const removeItem = (index: number) => {
    const itemPrice = items[index].price;
    setItems(items.filter((_, i) => i !== index));
    setTotal((prev) => prev - itemPrice);
  };

  return (
    <div className="p-12 max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
        Get Quote Instantly
      </h1>
      <p className="text-gray-600 mb-10 text-center text-lg">
        Add your items to the quote and see the total instantly.
      </p>

      {/* Contact Information */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-[#C9A24D] focus:outline-none shadow-sm"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-[#C9A24D] focus:outline-none shadow-sm"
            required
          />
        </div>
      </div>

      <form onSubmit={addItem}>
        {/* Product Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-[#C9A24D] focus:outline-none shadow-sm"
            >
              <optgroup label="CLOTHING">
                <option value="T Shirts">T Shirts</option>
                <option value="Long sleeve shirts">Long sleeve shirts</option>
                <option value="Polo tops">Polo tops</option>
                <option value="Trousers">Trousers</option>
                <option value="Jeans">Jeans</option>
                <option value="Joggers">Joggers</option>
                <option value="Shorts">Shorts</option>
                <option value="Hoodies">Hoodies</option>
                <option value="Jackets">Jackets</option>
                <option value="Quater Zips">Quater Zips</option>
                <option value="Tracksuit">Tracksuit</option>
                <option value="Nightwear">Nightwear</option>
              </optgroup>
              <optgroup label="SPORTS">
                <option value="Sports uniform">Sports uniform</option>
                <option value="Sports top">Sports top</option>
                <option value="Sports bottoms">Sports bottoms</option>
                <option value="Sports shorts">Sports shorts</option>
              </optgroup>
              <optgroup label="ACCESSORIES">
                <option value="Socks">Socks</option>
                <option value="Boxers">Boxers</option>
                <option value="Gloves">Gloves</option>
                <option value="Hats">Hats</option>
                <option value="Scarves">Scarves</option>
              </optgroup>
              <optgroup label="OTHER">
                <option value="Baby bibs">Baby bibs</option>
                <option value="Bears">Bears</option>
                <option value="Baby sets">Baby sets</option>
              </optgroup>
            </select>

            <input
              type="number"
              placeholder="Quantity"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-[#C9A24D] focus:outline-none shadow-sm"
            />

            <select
              value={sizeCategory}
              onChange={(e) => {
                setSizeCategory(e.target.value);
                setSize(sizeOptions[e.target.value][0]);
              }}
              className="border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-[#C9A24D] focus:outline-none shadow-sm"
            >
              {Object.keys(sizeOptions).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-[#C9A24D] focus:outline-none shadow-sm"
            >
              {sizeOptions[sizeCategory].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Embroidery Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Embroidery</h2>
          <select
            value={designType}
            onChange={(e) => setDesignType(e.target.value)}
            className="border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-[#C9A24D] focus:outline-none shadow-sm w-full"
          >
            <option value="Logo">Logo</option>
            <option value="Custom Design">Custom Design</option>
            <option value="Complex Pattern">Complex Pattern</option>
            <option value="Text">Text</option>
            <option value="Image">Image</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full px-6 py-4 bg-[#C9A24D] text-white font-bold rounded-3xl hover:shadow-lg transition-all mb-10"
        >
          Add Item
        </button>
      </form>

      {/* Quote Cart */}
      {items.length > 0 && (
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Quote Items</h2>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition"
              >
                <div>
                  <p className="font-semibold text-lg">{item.productType}</p>
                  <p className="text-gray-600">
                    {item.quantity} × {item.designType} ({item.sizeCategory}: {item.size})
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold text-[#C9A24D] text-lg">${item.price.toFixed(2)}</p>
                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-500 font-semibold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-5 bg-gray-50 rounded-3xl text-gray-800 font-bold text-xl shadow-inner text-right">
            Total Quote: <span className="text-[#C9A24D]">${total.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
