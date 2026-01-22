import { X } from "lucide-react";

type SidebarHeaderProps = {
  title: string;
  onClose: () => void;
};

export default function SidebarHeader({
  title,
  onClose,
}: SidebarHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b px-4 py-3 flex items-center justify-between">
      <h2 className="font-semibold text-sm">{title}</h2>

      <button
        onClick={() => {
          console.log("[SidebarHeader] Close clicked");
          onClose();
        }}
        className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900"
      >
        <X size={18} />
      </button>
    </div>
  );
}
