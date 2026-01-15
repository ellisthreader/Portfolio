import { useState } from "react";
import ClipartSection from "./ClipartSection";
import ClipartCategory from "./ClipartCategory";
import clipartCategories from "./clipartCategories";

export default function ClipartPanel() {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const activeCategory = clipartCategories.find(
    (c) => c.id === activeCategoryId
  );

  return (
    <div className="space-y-6">
      {/* SECTION GRID (2 columns) */}
      <div className="grid grid-cols-2 gap-4">
        {clipartCategories.map((category) => (
          <ClipartSection
            key={category.id}
            title={category.name}
            active={category.id === activeCategoryId}
            onClick={() => setActiveCategoryId(category.id)}
          />
        ))}
      </div>

      {/* CLIPART GRID (4 columns) */}
      {activeCategory && (
        <div>
          <h3 className="font-semibold mb-3">
            {activeCategory.name}
          </h3>

          <div className="grid grid-cols-4 gap-3">
            {activeCategory.items.map((item) => (
              <ClipartCategory
                key={item.id}
                label={item.label}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
