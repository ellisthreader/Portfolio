import { useHomeSceneContext } from '../context/HomeSceneContext';

type TypingState = {
  displayed: string;
  activeWord: string;
  longestWord: string;
};

export function HeroSection({ typed }: { typed: TypingState }) {
  const { canvasRef } = useHomeSceneContext();

  return (
    <section className="scroll-section s-hero" aria-label="Hero section">
      <div className="hero-starfield" aria-hidden="true">
        <div className="hero-starfield-glow" />
        <div className="hero-starfield-layer hero-starfield-layer-a" />
        <div className="hero-starfield-layer hero-starfield-layer-b" />
      </div>

      <div className="section-inner hero-front">
        <div className="hero-copy">
          <p className="hero-greeting">Hi There,</p>
          <h1 className="hero-name-block">
            <span className="hero-name-line">I&apos;m Ellis</span>
            <span className="hero-name-line">Threader</span>
          </h1>
          <div className="hero-role-block">
            <p className="hero-job-label">I am a</p>
            <p className="hero-job-title" aria-label={typed.activeWord}>
              <span className="hero-job-title-ghost" aria-hidden="true">
                {typed.longestWord}
              </span>
              <span className="hero-job-title-live">{typed.displayed}</span>
            </p>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-model-stage" aria-hidden="true">
            <div className="model-backlight" />
            <canvas ref={canvasRef} className="model-canvas is-ready" />
          </div>
        </div>
      </div>

      <div className="hero-scroll-cue" aria-hidden="true">
        <span className="hero-scroll-cue-shell">
          <span className="hero-scroll-cue-dot" />
        </span>
        <span className="hero-scroll-cue-text">Scroll</span>
      </div>
    </section>
  );
}
