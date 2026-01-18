import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ClipartCategoryType } from "./types";

interface Props {
  category: ClipartCategoryType;
  onBack: () => void;
  onAddClipart: (src: string) => void;
}

export default function ClipartItemsPage({
  category,
  onBack,
  onAddClipart,
}: Props) {
  return (
    <div className="space-y-4">
      {/* Back button */}
      <button
        onClick={onBack}
        className="
          inline-flex
          items-center
          gap-2
          text-sm
          font-medium
          text-blue-600
          hover:text-blue-700
          transition
        "
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        Back
      </button>

      {/* Category title */}
      <h3 className="text-lg font-semibold text-gray-900">
        {category.name}
      </h3>

      {/* Empty state */}
      {category.items.length === 0 && (
        <p className="text-sm text-red-600">
          ⚠️ No clipart items found for this category.
        </p>
      )}

      {/* Clipart grid */}
      <div className="grid grid-cols-4 gap-5">
        {category.items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onAddClipart(item.src)}
            className="
              group
              aspect-square
              flex
              items-center
              justify-center
              rounded-xl
              border
              border-gray-200
              bg-gray-50
              shadow-sm
              transition
              hover:shadow-md
              hover:border-gray-300
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          >
            <img
              src={item.src}
              alt={item.label}
              draggable={false}
              className="
                max-w-[75%]
                max-h-[75%]
                object-contain
                transition-transform
                duration-200
                group-hover:scale-105
              "
            />
          </button>
        ))}
      </div>
    </div>
  );
}
