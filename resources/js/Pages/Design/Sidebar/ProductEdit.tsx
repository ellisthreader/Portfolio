export default function ProductEdit({ product }: { product: any }) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">Product Options</h2>
      <p className="text-gray-600">Here you can edit product-specific options.</p>

      <div className="mt-4 text-sm text-gray-500">
        <p><strong>Name:</strong> {product?.name}</p>
        <p><strong>Colour Options:</strong> {product?.colourProducts?.length}</p>
      </div>
    </div>
  );
}
