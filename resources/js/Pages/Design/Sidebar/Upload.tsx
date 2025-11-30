export default function Upload() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">Upload Images</h2>
      <p className="text-gray-600 mb-4">Upload your own images to add to the canvas.</p>

      <input
        type="file"
        className="w-full bg-white p-2 rounded border border-gray-300"
      />
    </div>
  );
}
