"use client";

type Props = {
  fontFamily: string;
  onOpenFonts: () => void;
};

export default function FontSelector({ fontFamily, onOpenFonts }: Props) {
  return (
    <div
      className="flex items-center w-full cursor-pointer"
      onClick={onOpenFonts}
    >
      {/* Left label */}
      <div className="text-sm font-medium">
        Font
      </div>

      {/* Font name — back on the right */}
      <div
        className="ml-auto truncate text-base"
        style={{ fontFamily }}
        title={fontFamily}
      >
        {fontFamily}
      </div>
    </div>
  );
}
