import { Head, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import GuestLayout from "@/Layouts/GuestLayout";

// Import your components
import HeroSection from "./HeroSection";
import CategorySection from "./CategorySection";
import BrandsSection from "./BrandsSection";
import SaleHeroSection from "./SaleHeroSections";
import TrendingNowPage from "./TrendingNowPage"; // <-- Import it

type User = {
  id: number;
  name: string;
  email: string;
};

type PageProps = {
  auth: {
    user?: User;
  };
};

export default function Welcome() {
  const { props } = usePage<PageProps>();
  const user = props.auth?.user;
  const Layout = user ? AuthenticatedLayout : GuestLayout;

  return (
    <Layout>
      <Head title="Welcome" />

      {/* Hero carousel at the top */}
      <HeroSection />

      {/* Category circles row */}
      <CategorySection />

      {/* Brands carousel section */}
      <BrandsSection />

      {/* Trending Now section */}
      <TrendingNowPage /> {/* <-- Added here */}

      {/* 🆕 Sale hero section (auto-sliding like HeroSection) */}
      <SaleHeroSection />
    </Layout>
  );
}
