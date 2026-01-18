import { useState } from "react";
import clipartCategories from "./clipartCategories";
import ClipartSectionsPage from "./ClipartSectionsPage";
import ClipartItemsPage from "./ClipartItemsPage";

interface ClipartProps {
  onAddClipart: (src: string) => void;
}

export default function Clipart({ onAddClipart }: ClipartProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const activeCategory = clipartCategories.find(
    (c) => c.id === activeCategoryId
  );

  return (
    <div className="p-4">
      {/* HEADER (only show on category list) */}
      {!activeCategory && (
        <>
          <h2 className="text-xl font-bold mb-3">Clipart Library</h2>
          <p className="text-gray-600 mb-4">
            Choose from clipart to apply to your design.
          </p>
        </>
      )}

      {/* CATEGORY LIST */}
      {!activeCategory && (
        <ClipartSectionsPage
          categories={clipartCategories}
          onSelectCategory={setActiveCategoryId}
        />
      )}

      {/* ITEMS GRID */}
      {activeCategory && (
        <ClipartItemsPage
          category={activeCategory}
          onBack={() => setActiveCategoryId(null)}
          onAddClipart={onAddClipart}
        />
      )}
    </div>
  );
}
