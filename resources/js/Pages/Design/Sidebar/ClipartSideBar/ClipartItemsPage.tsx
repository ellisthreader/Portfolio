import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ClipartCategoryType } from "./types";

interface Props {
  category: ClipartCategoryType;
  onBack: () => void;
}

export default function ClipartItemsPage({
  category,
  onBack,
}: Props) {

  // 🔍 DEBUG LOGS
  useEffect(() => {
    console.log("📂 ACTIVE CATEGORY OBJECT:", category);
    console.log("🧩 CATEGORY ID:", category?.id);
    console.log("📦 ITEMS ARRAY:", category?.items);
    console.log("🔢 ITEMS COUNT:", category?.items?.length);
  }, [category]);

  return (
    <div>
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-4 text-sm text-blue-600 hover:underline"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        Back
      </button>

      {/* Category title */}
      <h3 className="text-lg font-semibold mb-4">
        {category.name}
      </h3>

      {/* Empty-state message (IMPORTANT) */}
      {category.items.length === 0 && (
        <p className="text-sm text-red-600">
          ⚠️ No clipart items found for this category.
        </p>
      )}

      {/* Items grid */}
      <div className="grid grid-cols-3 gap-4">
        {category.items.map((item) => (
          <button
            key={item.id}
            className="border rounded p-2 hover:bg-gray-100"
            title={item.label}
          >
            <img
              src={item.src}
              alt={item.label}
              className="w-full h-auto"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
