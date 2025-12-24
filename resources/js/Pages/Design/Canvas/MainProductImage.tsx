// 🧱 Displays the main product image centered in the canvas as a non-interactive background reference.


export default function MainProductImage({ src }: { src: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <img src={src} className="max-w-full max-h-full object-contain" />
    </div>
  );
}
