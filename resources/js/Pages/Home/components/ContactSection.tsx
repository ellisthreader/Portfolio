import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedText } from './AnimatedText';

export function ContactSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="contact" className="scroll-section contact-section">
      <div className="section-inner story-shell">
        <motion.article
          className="story-block"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24, filter: 'blur(12px)' }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="story-label">Contact</p>
          <AnimatedText
            as="h2"
            className="story-title"
            text="Ready to build something sharp, immersive, and beautifully executed."
            delay={0.04}
            charDelay={0.009}
            amount={0.45}
          />
          <AnimatedText
            as="p"
            className="story-body"
            text="Open to freelance projects, creative builds, and high-end web experiences that need strong visual direction and clean engineering."
            delay={0.18}
            charDelay={0.0046}
            amount={0.3}
          />
        </motion.article>
      </div>
    </section>
  );
}
