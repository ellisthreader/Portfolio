import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { CAREER_ENTRIES } from '../constants/content';
import { AnimatedText } from './AnimatedText';

export function CareerSection() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 75%', 'end 35%'],
  });
  const dotTop = useTransform(scrollYProgress, [0, 1], ['2%', '92%']);
  const progressScale = useTransform(scrollYProgress, [0, 1], [0.04, 1]);

  return (
    <section id="career" ref={sectionRef} className="scroll-section career-section">
      <div className="section-inner career-shell">
        <div className="career-timeline" aria-hidden="true">
          <div className="career-timeline-line" />
          <motion.div className="career-timeline-progress" style={{ scaleY: progressScale }} />
          <motion.div className="career-timeline-dot" style={{ top: dotTop }} />
        </div>

        <div className="career-rows">
          {CAREER_ENTRIES.map((entry, index) => (
            <motion.article
              key={`${entry.title}-${entry.year}`}
              className="career-row"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 26, filter: 'blur(12px)' }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.68, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="career-left">
                <AnimatedText as="h3" className="career-title" text={entry.title} delay={0.02} charDelay={0.008} amount={0.4} />
                <p className="career-subtitle">{entry.subtitle}</p>
                <p className="career-year">{entry.year}</p>
              </div>

              <div className="career-center" aria-hidden="true">
                <span className="career-center-mark" />
              </div>

              <div className="career-right">
                <AnimatedText as="p" className="career-description" text={entry.description} delay={0.08} charDelay={0.0042} amount={0.3} />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
