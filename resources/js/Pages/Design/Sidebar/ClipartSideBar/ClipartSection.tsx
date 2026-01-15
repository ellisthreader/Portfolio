import React from "react";

interface ClipartSectionProps {
  title: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

export default function ClipartSection({ title, onClick, icon }: ClipartSectionProps) {
  return (
    <button
      onClick={onClick}
      className="
        flex flex-col items-center justify-between
        p-4 w-full h-36
        bg-white dark:bg-gray-800
        rounded-xl
        shadow-md hover:shadow-xl
        transition-all duration-300
        hover:scale-105
        border border-gray-200 dark:border-gray-700
        text-gray-800 dark:text-gray-200
      "
    >
      {/* Icon in neutral circle */}
      <div className="
        flex items-center justify-center
        w-16 h-16
        mb-3
        rounded-full
        bg-gray-100 dark:bg-gray-700
        text-gray-700 dark:text-gray-200
        text-3xl
        shadow-sm
      ">
        {icon ?? <div className="w-8 h-8 bg-gray-300 rounded-full" />}
      </div>

      {/* Section title */}
      <h3 className="font-semibold text-center text-sm">
        {title}
      </h3>
    </button>
  );
}
