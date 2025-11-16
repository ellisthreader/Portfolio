export interface Product {
  slug: string;
  brand: string;
  name: string;
  price: string;
  originalPrice?: string;
  description: string;
  images: string[];
  colors?: string[];
  sizes?: string[];
}

export const products: Product[] = [
  {
    slug: "cloudmonster",
    brand: "ON",
    name: "Cloudmonster",
    price: "£160",
    description:
      "Experience next-level running comfort with the ON Cloudmonster — built with maximum cushioning, explosive energy return, and a lightweight design perfect for every stride.",
    images: [
      "/images/Trending/cloudtecW1.avif",
      "/images/Trending/cloudtecW2.avif",
    ],
    colors: ["#d9d9d9", "#000000", "#ffffff"],
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
  },
  {
    slug: "balenciaga-x-adidas",
    brand: "BALENCIAGA",
    name: "X Adidas Speed Trainers",
    price: "£150",
    originalPrice: "£700",
    description:
      "Experience a perfect fusion of avant-garde design and athletic performance with the Balenciaga x Adidas Speed Trainers. Built for comfort and statement-making style.",
    images: [
      "/images/Trending/BalenciagaX1.avif",
      "/images/Trending/BalenciagaX2.avif",
    ],
    colors: ["#000000", "#ffffff"],
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
  },
  // ✅ add more products here...
];
