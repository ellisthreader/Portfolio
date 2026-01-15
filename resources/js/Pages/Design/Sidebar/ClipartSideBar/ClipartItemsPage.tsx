
import ClipartCategory from "./ClipartCategory";
import { ClipartCategoryType } from "./types";

interface ClipartItemsPageProps {
  category: ClipartCategoryType;
  onBack: () => void;
}

export default function ClipartItemsPage({ category, onBack }: ClipartItemsPageProps) {
  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        ← Back
      </button>

      <h3 className="font-semibold text-lg">{category.name}</h3>

      <div className="grid grid-cols-4 gap-3">
        {category.items.map((item) => (
          <ClipartCategory key={item.id} label={item.label} />
        ))}
      </div>
    </div>
  );
}
