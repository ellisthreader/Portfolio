import { useHomeSceneContext } from '../context/HomeSceneContext';

export function CursorLayers() {
  const { pointerLightRef, cursorAuraRef, isIntroComplete } = useHomeSceneContext();

  return (
    <>
      <div ref={pointerLightRef} className={`ambient-pointer-light ${isIntroComplete ? 'is-active' : 'is-hidden'}`} aria-hidden="true" />
      <div ref={cursorAuraRef} className={`custom-cursor custom-cursor-aura ${isIntroComplete ? 'is-active' : 'is-hidden'}`} aria-hidden="true" />
    </>
  );
}
