import { ReactNode } from "react";
import NavBar from "@/Components/Menu/NavMenu";

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      {/* Header */}
      <NavBar />

      {/* Content */}
      <main className="flex-1 w-full flex items-center justify-center p-6">
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
}
