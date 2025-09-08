import { ReactNode } from "react";
import NavMenu from "@/Components/Menu/NavMenu";

export default function GuestLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">

      <header className="flex justify-center items-center px-8 py-4 shadow bg-white dark:bg-gray-800 transition-colors duration-300">
        <NavMenu />
      </header>

      <main>{children}</main>
    </div>
  );
}
