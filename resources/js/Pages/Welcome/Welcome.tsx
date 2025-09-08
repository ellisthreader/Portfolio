import { Head, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import HeroSection from "./HeroSection";
import SkillsSection from "./SkillsSection";
import GuestLayout from "@/Layouts/GuestLayout";

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
      <HeroSection />
      <SkillsSection />
    </Layout>
  );
}
