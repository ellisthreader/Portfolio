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
    <div
      className="
        h-full flex flex-col justify-between
        px-8 py-10
        rounded-2xl
        bg-gradient-to-b from-white to-gray-50
        dark:from-gray-900 dark:to-gray-800
      "
    >
      {/* ---------------- HEADER ---------------- */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Let’s get started
        </h2>
        <p className="text-base text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
          Choose a tool below to start designing your product exactly how you
          want it.
        </p>
      </div>

      {/* ---------------- PRIMARY ACTIONS ---------------- */}
      <div className="grid grid-cols-2 gap-5 mt-12">
        <ActionButton
          icon={<Shirt size={24} />}
          label="Product"
          onClick={onOpenProduct}
        />
        <ActionButton
          icon={<Upload size={24} />}
          label="Upload"
          onClick={onOpenUpload}
        />
        <ActionButton
          icon={<Type size={24} />}
          label="Text"
          onClick={onOpenText}
        />
        <ActionButton
          icon={<ClipartIcon size={24} />}
          label="Clipart"
          onClick={onOpenClipart}
        />
      </div>

      {/* ---------------- HELP / TIPS ---------------- */}
      <div className="mt-14 pt-6 border-t border-gray-200/70 dark:border-gray-700/70 space-y-4">
        <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-600 dark:text-gray-300 text-center">
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
        group relative
        flex flex-col items-center justify-center gap-3
        h-32 rounded-2xl
        border border-gray-200/70 dark:border-gray-700/70
        bg-white/90 dark:bg-gray-800/90
        backdrop-blur
        shadow-sm
        hover:shadow-xl
        hover:-translate-y-1
        transition-all duration-300
      "
    >
      {/* Icon bubble */}
      <div
        className="
          flex items-center justify-center
          w-12 h-12 rounded-full
          bg-gradient-to-br from-gray-100 to-gray-200
          dark:from-gray-700 dark:to-gray-600
          text-gray-800 dark:text-white
          group-hover:scale-110 transition-transform
        "
      >
        {icon}
      </div>

      <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
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
    <div className="flex items-start gap-4 text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
      <div
        className="
          mt-[2px]
          flex items-center justify-center
          w-8 h-8 rounded-full
          bg-gray-100 dark:bg-gray-700
          text-gray-500 dark:text-gray-300
        "
      >
        {icon}
      </div>
      <span className="leading-relaxed">{children}</span>
    </div>
  );
}
