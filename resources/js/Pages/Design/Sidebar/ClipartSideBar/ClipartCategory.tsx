interface ClipartCategoryProps {
  label: string;
}

export default function ClipartCategory({ label }: ClipartCategoryProps) {
  return (
    <div className="h-20 bg-gray-300 rounded flex items-center justify-center cursor-pointer hover:bg-gray-400 transition">
      <span className="text-sm">{label}</span>
    </div>
  );
}
