"use client";

import {
  Shirt,
  Upload,
  Type,
  Image as ClipartIcon,
  MousePointer2,
  Move,
  RotateCw,
} from "lucide-react";

interface Props {
  onOpenProduct?: () => void;
  onOpenUpload?: () => void;
  onOpenText?: () => void;
  onOpenClipart?: () => void;
}

export default function BlankSidebar({
  onOpenProduct,
  onOpenUpload,
  onOpenText,
  onOpenClipart,
}: Props) {
  return (
    <div className="h-full flex flex-col justify-between px-6 py-8">
      {/* ---------------- HEADER ---------------- */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Get started
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Choose a tool below to begin customizing your product.
        </p>
      </div>

      {/* ---------------- PRIMARY ACTIONS ---------------- */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        <ActionButton
          icon={<Shirt size={20} />}
          label="Product"
          onClick={onOpenProduct}
        />
        <ActionButton
          icon={<Upload size={20} />}
          label="Upload"
          onClick={onOpenUpload}
        />
        <ActionButton
          icon={<Type size={20} />}
          label="Text"
          onClick={onOpenText}
        />
        <ActionButton
          icon={<ClipartIcon size={20} />}
          label="Clipart"
          onClick={onOpenClipart}
        />
      </div>

      {/* ---------------- HELP / TIPS ---------------- */}
      <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Helpful tips
        </h3>

        <Tip icon={<MousePointer2 size={16} />}>
          Click an element on the canvas to edit it
        </Tip>

        <Tip icon={<Move size={16} />}>
          Drag elements to reposition them
        </Tip>

        <Tip icon={<RotateCw size={16} />}>
          Use rotation & flip controls for precision
        </Tip>
      </div>
    </div>
  );
}

/* ---------------- SUB COMPONENTS ---------------- */

function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="
        group
        flex
        flex-col
        items-center
        justify-center
        gap-2
        h-24
        rounded-xl
        border
        border-gray-200
        dark:border-gray-700
        bg-gray-50
        dark:bg-gray-800
        hover:bg-white
        dark:hover:bg-gray-700
        shadow-sm
        hover:shadow-md
        transition
      "
    >
      <div className="text-gray-700 dark:text-gray-200 group-hover:scale-105 transition-transform">
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
        {label}
      </span>
    </button>
  );
}

function Tip({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 text-sm text-gray-500 dark:text-gray-400">
      <div className="mt-[2px] text-gray-400">{icon}</div>
      <span>{children}</span>
    </div>
  );
}
