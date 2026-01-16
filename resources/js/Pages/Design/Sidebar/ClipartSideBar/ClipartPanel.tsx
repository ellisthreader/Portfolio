import { useState } from "react";
import clipartCategories from "./clipartCategories";
import ClipartSectionsPage from "./ClipartSectionsPage";
import ClipartItemsPage from "./ClipartItemsPage";
import { ClipartCategoryType } from "./types";

export default function ClipartPanel() {
  const [activeCategory, setActiveCategory] =
    useState<ClipartCategoryType | null>(null);

  return (
    <div className="p-4 space-y-4">
      {!activeCategory ? (
        <ClipartSectionsPage
          categories={clipartCategories}
          onSelectCategory={(id) => {
            const found = clipartCategories.find((c) => c.id === id);
            if (found) setActiveCategory(found);
          }}
        />
      ) : (
        <ClipartItemsPage
          category={activeCategory}
          onBack={() => setActiveCategory(null)}
        />
      )}
    </div>
  );
}
