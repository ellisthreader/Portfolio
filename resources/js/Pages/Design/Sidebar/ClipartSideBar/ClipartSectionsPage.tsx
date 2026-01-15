import ClipartSection from "./ClipartSection";
import { ClipartCategoryType } from "./types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmile, faFlag, faPaw, faPizzaSlice, faFutbol, faStar } from "@fortawesome/free-solid-svg-icons";

interface ClipartSectionsPageProps {
  categories: ClipartCategoryType[];
  onSelectCategory: (categoryId: string) => void;
}

// Neutral colored Font Awesome icons
const categoryIcons: Record<string, React.ReactNode> = {
  emojis: <FontAwesomeIcon icon={faSmile} />,
  flags: <FontAwesomeIcon icon={faFlag} />,
  animals: <FontAwesomeIcon icon={faPaw} />,
  food: <FontAwesomeIcon icon={faPizzaSlice} />,
  sports: <FontAwesomeIcon icon={faFutbol} />,
  stars: <FontAwesomeIcon icon={faStar} />,
};

export default function ClipartSectionsPage({ categories, onSelectCategory }: ClipartSectionsPageProps) {
  return (
    <div className="grid grid-cols-2 gap-6">
      {categories.map((category) => (
        <ClipartSection
          key={category.id}
          title={category.name}
          icon={categoryIcons[category.id]}
          onClick={() => onSelectCategory(category.id)}
        />
      ))}
    </div>
  );
}
