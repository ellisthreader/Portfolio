export default function AddText() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">Add Text</h2>
      <p className="text-gray-600 mb-4">Type in any text you want to add to the product.</p>

      <input
        type="text"
        placeholder="Enter text..."
        className="w-full p-2 bg-white rounded border border-gray-300"
      />

      <button className="mt-4 w-full bg-blue-600 text-white p-2 rounded-lg">
        Add Text
      </button>
    </div>
  );
}
