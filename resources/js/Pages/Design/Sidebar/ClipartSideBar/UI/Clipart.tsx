import { useState } from "react";
import clipartCategories from "./clipartCategories";
import ClipartSectionsPage from "./ClipartSectionsPage";
import ClipartItemsPage from "./ClipartItemsPage";

interface ClipartProps {
  onAddClipart: (src: string) => void;
  forceSections?: boolean; // 🔥 NEW
}

export default function Clipart({
  onAddClipart,
  forceSections,
}: ClipartProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  // 🔥 When Change Art is clicked → reset view
  if (forceSections && activeCategoryId !== null) {
    setActiveCategoryId(null);
  }

  const activeCategory = clipartCategories.find(
    (c) => c.id === activeCategoryId
  );

  return (
    <div className="p-4">
      {/* HEADER */}
      {!activeCategory && (
        <>
          <h2 className="text-xl font-bold mb-3">Clipart Library</h2>
          <p className="text-gray-600 mb-4">
            Choose from clipart to apply to your design.
          </p>
        </>
      )}

      {/* SECTIONS */}
      {!activeCategory && (
        <ClipartSectionsPage
          categories={clipartCategories}
          onSelectCategory={setActiveCategoryId}
        />
      )}

      {/* ITEMS */}
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
  