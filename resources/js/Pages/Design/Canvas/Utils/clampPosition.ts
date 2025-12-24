// 🔒 Clamps an element’s position so it stays fully within the bounds of a restricted container.


export function clampPosition(
  x: number,
  y: number,
  w: number,
  h: number,
  box: { left: number; top: number; width: number; height: number }
) {
  return {
    x: Math.min(Math.max(x, box.left), box.left + box.width - w),
    y: Math.min(Math.max(y, box.top), box.top + box.height - h),
  };
}
