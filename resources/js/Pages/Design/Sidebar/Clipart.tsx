export default function Clipart() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">Clipart Library</h2>
      <p className="text-gray-600 mb-4">Choose from clipart to apply to your design.</p>

      <div className="grid grid-cols-3 gap-3">
        <div className="w-full h-20 bg-gray-300 rounded"></div>
        <div className="w-full h-20 bg-gray-300 rounded"></div>
        <div className="w-full h-20 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}
