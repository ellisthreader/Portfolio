import { useState } from "react";
import clipartCategories from "./clipartCategories";
import ClipartSectionsPage from "./ClipartSectionsPage";
import ClipartItemsPage from "./ClipartItemsPage";

export default function Clipart() {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const activeCategory = clipartCategories.find(
    (c) => c.id === activeCategoryId
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">Clipart Library</h2>
      <p className="text-gray-600 mb-4">
        Choose from clipart to apply to your design.
      </p>

      {!activeCategory && (
        <ClipartSectionsPage
          categories={clipartCategories}
          onSelectCategory={(id) => setActiveCategoryId(id)}
        />
      )}

      {activeCategory && (
        <ClipartItemsPage
          category={activeCategory}
          onBack={() => setActiveCategoryId(null)}
        />
      )}
    </div>
  );
}
