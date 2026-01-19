"use client";

type Props = {
  replacingUid: string | null;
  onSelectClipart: (src: string) => void;
};

export default function ReplaceClipartController({
  replacingUid,
  onSelectClipart,
}: Props) {
  // This component is intentionally invisible
  return null;
}
