type Props = {
  designType: string;
  setDesignType: (v: string) => void;
  onBack: () => void;
  onAdd: () => void;
};

export default function EmbroideryStep({
  designType,
  setDesignType,
  onBack,
  onAdd,
}: Props) {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Embroidery</h2>

      <select
        value={designType}
        onChange={(e) => setDesignType(e.target.value)}
        className="border border-gray-300 rounded-2xl px-4 py-3 w-full mb-10"
      >
        <option>Logo</option>
        <option>Custom Design</option>
        <option>Complex Pattern</option>
        <option>Text</option>
        <option>Image</option>
      </select>

      <div className="flex gap-4">
        <button onClick={onBack} className="flex-1 border rounded-3xl py-4">
          Back
        </button>
        <button
          onClick={onAdd}
          className="flex-1 bg-[#C9A24D] text-white rounded-3xl py-4 font-bold"
        >
          Add Item
        </button>
      </div>
    </>
  );
}
