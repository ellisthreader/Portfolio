export interface WomenCategoryData {
  topLevel: { title: string }[];
  links: { name: string; key: string }[];
  subcategories: Record<string, string[]>;
}

export const womenCategories: WomenCategoryData = {
  topLevel: [
    { title: "BEST SELLERS" },
    { title: "NEW IN" },
    { title: "SALE" },
  ],

  links: [
    { name: "Clothing", key: "clothing" },
    { name: "Shoes", key: "shoes" },
    { name: "Accessories", key: "accessories" },
    { name: "Brands (A-Z)", key: "brands" },
  ],

  subcategories: {
    clothing: [
      "Dresses",
      "Tops",
      "Coats & Jackets",
      "Hoodies & Sweatshirts",
      "Knitwear",
      "Co-Ords",
      "Jeans",
      "Trousers",
      "Tracksuits",
      "Joggers",
      "Sports",
      "Playsuits & Jumpsuits",
      "Denim",
      "Skirts",
      "Blazers",
    ],

    shoes: ["Trainers", "Heels", "Boots", "Sandals", "Sliders"],

    accessories: ["Bags", "Hats", "Sunglasses", "Jewellery"],
  },
};
