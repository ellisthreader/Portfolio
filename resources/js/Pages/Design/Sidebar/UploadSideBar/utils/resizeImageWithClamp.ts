type Position = { x: number; y: number };
type RestrictedBox = { x: number; y: number; width: number; height: number };

type Params = {
  requestedWidth: number;
  layer: { size: { w: number; h: number } };
  selectedImage: string;
  position: Position;
  restrictedBox: RestrictedBox;
  onUpdateImageSize?: (id: string, w: number, h: number) => void;
};

/**
 * Resizes an image while keeping its TOP-LEFT corner fixed
 * and guaranteeing it never leaves the restricted box.
 */
export function resizeImageWithClamp({
  requestedWidth,
  layer,
  selectedImage,
  position,
  restrictedBox,
  onUpdateImageSize,
}: Params) {
  if (!layer || !selectedImage) return;

  const aspect = layer.size.h / layer.size.w;
  const requestedHeight = requestedWidth * aspect;

  // Max size allowed from current top-left position
  const maxWidth =
    restrictedBox.x + restrictedBox.width - position.x;

  const maxHeight =
    restrictedBox.y + restrictedBox.height - position.y;

  const scale = Math.min(
    maxWidth / requestedWidth,
    maxHeight / requestedHeight,
    1
  );

  if (scale <= 0 || Number.isNaN(scale)) return;

  const finalWidth = requestedWidth * scale;
  const finalHeight = requestedHeight * scale;

  onUpdateImageSize?.(selectedImage, finalWidth, finalHeight);
}
