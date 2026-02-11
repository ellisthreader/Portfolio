import { ArrowLeft, ArrowRight } from "lucide-react";

type Props = {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

export default function HistoryControls({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: Props) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-40"
      >
        <ArrowLeft size={24} />
      </button>

      <button
        onClick={onRedo}
        disabled={!canRedo}
        className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-40"
      >
        <ArrowRight size={24} />
      </button>
    </div>
  );
}
