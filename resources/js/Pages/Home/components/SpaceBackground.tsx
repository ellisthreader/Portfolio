import { useEffect } from 'react';

export function SpaceBackground() {
  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      root.style.setProperty('--space-drift-x', '0px');
      root.style.setProperty('--space-drift-y', '0px');
      return () => {
        root.style.removeProperty('--space-drift-x');
        root.style.removeProperty('--space-drift-y');
      };
    }

    let rafId = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handlePointerMove = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 18;
      targetY = (event.clientY / window.innerHeight - 0.5) * 14;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.045;
      currentY += (targetY - currentY) * 0.045;
      root.style.setProperty('--space-drift-x', `${currentX.toFixed(2)}px`);
      root.style.setProperty('--space-drift-y', `${currentY.toFixed(2)}px`);
      rafId = window.requestAnimationFrame(animate);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    animate();

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.cancelAnimationFrame(rafId);
      root.style.removeProperty('--space-drift-x');
      root.style.removeProperty('--space-drift-y');
    };
  }, []);

  return (
    <div className="site-space" aria-hidden="true">
      <div className="space-vignette" />
      <div className="space-nebula" />
      <div className="star-layer star-layer-far" />
      <div className="star-layer star-layer-mid" />
      <div className="star-layer star-layer-near" />
    </div>
  );
}
