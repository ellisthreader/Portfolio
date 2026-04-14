import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import type { AnimatedTextProps } from '../types/home';

export function AnimatedText({
  as: Component = 'p',
  className,
  text,
  delay = 0,
  charDelay = 0.012,
  amount = 0.5,
}: AnimatedTextProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, amount });
  const prefersReducedMotion = useReducedMotion();

  return (
    <Component className={className}>
      <span ref={ref} className="text-reveal">
        {Array.from(text).map((char, index) => (
          <motion.span
            key={`${char}-${index}`}
            className="text-reveal-char"
            initial={prefersReducedMotion ? { opacity: 1, y: '0em', filter: 'blur(0px)' } : { opacity: 0, y: '0.82em', filter: 'blur(10px)' }}
            animate={isInView ? { opacity: 1, y: '0em', filter: 'blur(0px)' } : undefined}
            transition={
              prefersReducedMotion
                ? undefined
                : {
                    duration: 0.34,
                    ease: [0.22, 1, 0.36, 1],
                    delay: delay + index * charDelay,
                  }
            }
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </span>
    </Component>
  );
}
