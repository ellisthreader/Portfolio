import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { WHAT_I_DO_CARDS } from '../constants/content';
import { AnimatedText } from './AnimatedText';

export function WhatIDoSection() {
  const prefersReducedMotion = useReducedMotion();
  const [activeCard, setActiveCard] = useState(0);

  return (
    <section id="work" className="scroll-section services-section">
      <div className="section-inner services-shell">
        <motion.div
          className="services-intro"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24, filter: 'blur(12px)' }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="story-label">What I Do</p>
          <AnimatedText
            as="h2"
            className="services-title"
            text="Designing clean systems and expressive interfaces that scale beautifully."
            delay={0.04}
            charDelay={0.009}
            amount={0.45}
          />
        </motion.div>

        <div className="services-cards" onMouseLeave={() => setActiveCard(0)}>
          {WHAT_I_DO_CARDS.map((card, index) => {
            const isActive = activeCard === index;

            return (
              <motion.article
                key={card.title}
                layout
                className={`service-card ${isActive ? 'is-active' : ''}`}
                tabIndex={0}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 28, filter: 'blur(12px)' }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.62, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={() => setActiveCard(index)}
                onFocus={() => setActiveCard(index)}
                onBlur={() => setActiveCard(0)}
                whileHover={prefersReducedMotion ? {} : { y: -4 }}
              >
                <div className="service-card-top">
                  <p className="service-card-eyebrow">{card.eyebrow}</p>
                  <h3 className="service-card-title">{card.title}</h3>
                </div>

                <p className="service-card-summary">{card.summary}</p>

                <motion.div
                  className="service-card-detail-wrap"
                  animate={prefersReducedMotion ? { height: 'auto', opacity: 1 } : { height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="service-card-detail">{card.detail}</p>
                </motion.div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
