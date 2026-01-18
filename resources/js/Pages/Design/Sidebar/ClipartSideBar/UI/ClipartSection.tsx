import React from "react";

interface ClipartSectionProps {
  title: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

export default function ClipartSection({
  title,
  onClick,
  icon,
}: ClipartSectionProps) {
  return (
    <button
      onClick={onClick}
      className="
        flex flex-col items-center justify-between
        p-4 w-full h-36
        bg-white dark:bg-gray-800
        rounded-xl
        shadow-md hover:shadow-lg
        transition
        border
      "
    >
      <div className="
        flex items-center justify-center
        w-16 h-16
        rounded-full
        bg-gray-100 dark:bg-gray-700
        text-gray-700
        text-3xl
      ">
        {icon}
      </div>

      <h3 className="font-semibold text-sm text-center">
        {title}
      </h3>
    </button>
  );
}
