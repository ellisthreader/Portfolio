import { ClipartCategoryType } from "./types";

const clipartCategories: ClipartCategoryType[] = [
  {
    id: "emojis",
    name: "Emojis",
    items: Array.from({ length: 16 }).map((_, i) => ({
      id: `emoji-${i}`,
      label: `Emoji ${i + 1}`,
    })),
  },
  {
    id: "flags",
    name: "Flags",
    items: Array.from({ length: 16 }).map((_, i) => ({
      id: `flag-${i}`,
      label: `Flag ${i + 1}`,
    })),
  },
  {
    id: "animals",
    name: "Animals",
    items: Array.from({ length: 16 }).map((_, i) => ({
      id: `animal-${i}`,
      label: `Animal ${i + 1}`,
    })),
  },
  {
    id: "food",
    name: "Food & Drink",
    items: Array.from({ length: 16 }).map((_, i) => ({
      id: `food-${i}`,
      label: `Food ${i + 1}`,
    })),
  },
];

export default clipartCategories;
