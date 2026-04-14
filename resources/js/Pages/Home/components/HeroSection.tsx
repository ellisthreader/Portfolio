import { useHomeSceneContext } from '../context/HomeSceneContext';

export function HeroSection({ typed }: { typed: string }) {
  const { canvasRef, isIntroComplete } = useHomeSceneContext();

  return (
    <section className="scroll-section s-hero">
      <div className="hero-model-stage" aria-hidden="true">
        <div className="model-backlight" />
        <canvas ref={canvasRef} className={`model-canvas ${isIntroComplete ? 'is-ready' : 'is-preloading'}`} />
      </div>

      <div className="section-inner hero-front">
        <div className="hero-left-panel js-reveal-down js-parallax-up">
          <p className="hero-greeting">Hello! I&apos;m</p>
          <p className="hero-name">ELLIS</p>
          <p className="hero-name">THREADER</p>
        </div>

        <div className="hero-right-panel js-reveal-down js-parallax-up">
          <p className="hero-job-label">I am a:</p>
          <p className="hero-job-title">{typed}</p>
        </div>
      </div>
    </section>
  );
}
