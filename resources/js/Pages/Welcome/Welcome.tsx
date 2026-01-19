import { Head, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import GuestLayout from "@/Layouts/GuestLayout";

import HeroSection from "./HeroSection";
import CategorySection from "./CategorySection";
import BrandsSection from "./BrandsSection";
import SaleHeroSection from "./SaleHeroSections";
import TrendingNowPage from "./TrendingNowPage";

type User = {
  id: number;
  name: string;
  email: string;
};

type Product = {
  id: number;
  name: string;
  slug: string;
  type: string;
  brand: string;
  price: number;
  original_price?: number | null;
  images: string[];
};

type PageProps = {
  auth: {
    user?: User;
  };
  products: Product[];
};

export default function Welcome() {
  const { props } = usePage<PageProps>();
  const user = props.auth?.user;
  const Layout = user ? AuthenticatedLayout : GuestLayout;

  // 🔥 Log products to verify they are being passed
  console.log("🔥 Products received in Welcome page:", props.products);

  return (
    <Layout>
      <Head title="Welcome" />

      <HeroSection />
      <CategorySection />
      <BrandsSection />

      {/* Trending Now Section */}
      <TrendingNowPage products={props.products} />

      <SaleHeroSection />
    </Layout>
  );
}
