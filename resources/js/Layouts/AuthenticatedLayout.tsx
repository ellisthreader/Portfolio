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
      <main className="flex-1 overflow-y-hidden w-full flex items-center justify-center ">
        <div className="w-full bg-red-400">{children}</div>
      </main>
    </div>
  );
}
