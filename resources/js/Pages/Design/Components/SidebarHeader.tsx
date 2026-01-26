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
    <div
      className="
        sticky top-0 z-20
        flex items-center justify-between
        px-4 py-3
        bg-white/95 dark:bg-gray-800/95
        backdrop-blur
        border-b border-gray-200 dark:border-gray-700
        shadow-sm
      "
    >
      <h2 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
        {title}
      </h2>

      <button
        onClick={() => {
          console.log("[SidebarHeader] Close clicked");
          onClose();
        }}
        className="
          p-1.5 rounded-md
          text-gray-600 dark:text-gray-300
          hover:bg-red-100 hover:text-red-600
          dark:hover:bg-red-900/40 dark:hover:text-red-400
          transition
        "
        aria-label="Close sidebar"
      >
        <X size={18} />
      </button>
    </div>
  );
}
