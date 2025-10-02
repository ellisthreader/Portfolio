import { ReactNode } from "react";
import NavMenu from "@/Components/Menu/NavMenu";
import CartSidebar from "@/Components/Cart/CartSidebar"; // ✅ default import

export default function GuestLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">

      {/* Header */}
      <header className="flex justify-center items-center px-8 py-4 shadow bg-white dark:bg-gray-800 transition-colors duration-300">
        <NavMenu />
      </header>

      {/* Main Content */}
      <main className="flex-1 relative w-full">
        {children}
      </main>

      {/* Cart Sidebar */}
      <CartSidebar />
    </div>
  );
}
