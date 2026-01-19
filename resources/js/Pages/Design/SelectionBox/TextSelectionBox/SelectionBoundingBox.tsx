export default function SelectionBoundingBox({
  children,
  box
}: {
  children: React.ReactNode;
  box: { left: number; top: number; width: number; height: number };
}) {
  return (
    <div
      className="absolute border-2 border-purple-500 pointer-events-none"
      style={{
        left: box.left,
        top: box.top,
        width: box.width,
        height: box.height,
        zIndex: 310
      }}
    >
      {children}
    </div>
  );
}
