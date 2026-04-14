import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedText } from './AnimatedText';

export function AboutSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="about" className="scroll-section about-section">
      <div className="section-inner about-shell">
        <motion.article
          className="about-copy"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24, filter: 'blur(12px)' }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        >
          <motion.p className="story-label" initial={false} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            About Me
          </motion.p>
          <AnimatedText
            as="h2"
            className="story-title story-title-left"
            text="I build immersive digital experiences that feel precise, premium, and alive."
            delay={0.04}
            charDelay={0.009}
            amount={0.4}
          />
          <AnimatedText
            as="p"
            className="story-body story-body-left"
            text="I focus on frontend engineering, motion, and visual direction that helps products feel modern and memorable without losing clarity."
            delay={0.18}
            charDelay={0.0046}
            amount={0.3}
          />
          <AnimatedText
            as="p"
            className="story-body story-body-left"
            text="The aim is simple: elegant structure, smooth interaction, and a finish that feels considered at every layer."
            delay={0.28}
            charDelay={0.004}
            amount={0.3}
          />
        </motion.article>
      </div>
    </section>
  );
}
