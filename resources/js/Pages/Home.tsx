import { Head } from '@inertiajs/react';
import type { ElementType } from 'react';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { HomeStyles } from '../styles/home';

gsap.registerPlugin(ScrollTrigger);

type ModelScrollState = {
  positionX: number;
  rotationY: number;
  scale: number;
};

type HeadControl = {
  target: THREE.Object3D;
  neutralRotationX: number;
  neutralRotationY: number;
  neutralRotationZ: number;
  introTilt: number;
  yawWeight: number;
  pitchWeight: number;
  lerp: number;
};

const TITLES = ['AI ENGINEER', 'FULL STACK DEVELOPER', 'SOFTWARE ENGINEER'];
const TERMINAL_LINES = [
  'Booting visual system',
  'Syncing selected work',
  'Calibrating motion layer',
  'Preparing cinematic intro',
  'Opening experience',
  'System ready',
];
const WHAT_I_DO_CARDS = [
  {
    title: 'Frontend Engineering',
    eyebrow: 'Interfaces',
    summary: 'Responsive, polished builds that feel sharp on every screen.',
    detail: 'I build refined React and TypeScript experiences with motion, performance, and clean component structure all working together.',
  },
  {
    title: 'Creative Interaction',
    eyebrow: 'Motion',
    summary: 'Scroll, hover, and transition systems that feel elegant not excessive.',
    detail: 'The goal is always controlled, premium movement that supports the brand and guides attention without overwhelming the page.',
  },
  {
    title: 'Visual Systems',
    eyebrow: 'Design',
    summary: 'Dark, cinematic, high-end web direction with consistency across sections.',
    detail: 'I shape spacing, typography, lighting, and card systems so the whole product feels cohesive, modern, and intentional.',
  },
];
const CAREER_ENTRIES = [
  {
    title: 'AI Engineer',
    subtitle: 'Independent / Product-focused',
    year: '2025',
    description: 'Building AI-driven experiences and modern frontend systems with a strong focus on polish, usability, and premium interaction design.',
  },
  {
    title: 'Full Stack Developer',
    subtitle: 'Web Products / Client Work',
    year: '2024',
    description: 'Developing full-stack websites and applications with responsive UI, scalable architecture, and clean implementation across the entire stack.',
  },
  {
    title: 'Software Engineer',
    subtitle: 'Creative Engineering',
    year: '2023',
    description: 'Crafting fast, reliable digital builds while refining motion, performance, and interface detail to create stronger visual presence.',
  },
];
const TOTAL_TERMINAL_CHARS = TERMINAL_LINES.reduce((count, line) => count + line.length, 0);

type AnimatedTextProps = {
  as?: ElementType;
  className?: string;
  text: string;
  delay?: number;
  charDelay?: number;
  amount?: number;
};

function AnimatedText({ as: Component = 'p', className, text, delay = 0, charDelay = 0.012, amount = 0.5 }: AnimatedTextProps) {
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

function AboutSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="about" className="scroll-section about-section">
      <div className="section-inner about-shell">
        <motion.div
          className="about-visual"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 28, filter: 'blur(12px)' }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="about-portrait">
            <div className="about-portrait-glow" aria-hidden="true" />
            <div className="about-portrait-core">
              <span className="about-portrait-kicker">ELLIS THREADER</span>
              <span className="about-portrait-mark">ET</span>
              <span className="about-portrait-caption">creative engineer / premium web builds</span>
            </div>
          </div>
        </motion.div>

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

function WhatIDoSection() {
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

        <div
          className="services-cards"
          onMouseLeave={() => setActiveCard(0)}
        >
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
                  animate={
                    prefersReducedMotion
                      ? { height: 'auto', opacity: 1 }
                      : {
                          height: isActive ? 'auto' : 0,
                          opacity: isActive ? 1 : 0,
                        }
                  }
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

function CareerSection() {
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

function ContactSection() {
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

function useTyping(words: string[]) {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex];
    const doneTyping = displayed === current;
    const doneDeleting = displayed === '';
    const delay = deleting ? 50 : doneTyping ? 1200 : 80;

    const timer = window.setTimeout(() => {
      if (!deleting && !doneTyping) {
        setDisplayed(current.slice(0, displayed.length + 1));
        return;
      }

      if (!deleting && doneTyping) {
        setDeleting(true);
        return;
      }

      if (deleting && !doneDeleting) {
        setDisplayed(current.slice(0, displayed.length - 1));
        return;
      }

      setDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [deleting, displayed, wordIndex, words]);

  return displayed;
}

function initParallax(root: HTMLElement) {
  const layers = gsap.utils.toArray<HTMLElement>('[data-parallax]', root);

  layers.forEach((layer) => {
    const amount = Number.parseFloat(layer.dataset.parallax ?? '14');
    const section = layer.closest('.scroll-section') ?? root;

    gsap.to(layer, {
      yPercent: amount,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
}

function initTextReveals(root: HTMLElement) {
  const revealNodes = gsap.utils.toArray<HTMLElement>('.js-reveal-down', root);

  revealNodes.forEach((node) => {
    gsap.fromTo(
      node,
      { y: -44, opacity: 0 },
      {
        y: 34,
        opacity: 1,
        duration: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: node,
          start: 'top 88%',
          end: 'top 40%',
          scrub: true,
        },
      }
    );
  });
}

function initTextParallaxUp(root: HTMLElement) {
  const nodes = gsap.utils.toArray<HTMLElement>('.js-parallax-up', root);

  nodes.forEach((node) => {
    const section = node.closest('.scroll-section') ?? root;

    gsap.to(node, {
      y: () => -window.innerHeight * 0.42,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
  });
}

function initPinnedContent(root: HTMLElement) {
  const frames = gsap.utils.toArray<HTMLElement>('.pin-frame', root);
  if (frames.length === 0) return;

  gsap.set(frames, { autoAlpha: 0, y: 72, scale: 0.94 });
  gsap.set(frames[0], { autoAlpha: 1, y: 0, scale: 1 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: root.querySelector('.s-model-hold'),
      start: 'top top',
      end: '+=220%',
      pin: true,
      scrub: true,
      anticipatePin: 1,
    },
  });

  frames.forEach((frame, index) => {
    const isLast = index === frames.length - 1;

    tl.to(frame, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.64,
      ease: 'power3.out',
    });

    if (!isLast) {
      tl.to(
        frame,
        {
          autoAlpha: 0.15,
          y: -46,
          scale: 0.95,
          duration: 0.5,
          ease: 'power2.inOut',
        },
        '+=0.34'
      );
    }
  });
}

export default function Home() {
  const pageRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const loaderOverlayRef = useRef<HTMLDivElement | null>(null);
  const loaderIrisRef = useRef<HTMLDivElement | null>(null);
  const pointerLightRef = useRef<HTMLDivElement | null>(null);
  const cursorAuraRef = useRef<HTMLDivElement | null>(null);
  const introTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const revealTimeoutRef = useRef<number | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const hasStartedRevealRef = useRef(false);
  const isIntroCompleteRef = useRef(false);
  const isSceneReadyRef = useRef(false);
  const isTypingDoneRef = useRef(false);
  const typingProgressRef = useRef(0);
  const modelProgressRef = useRef(0);
  const overallProgressRef = useRef(0);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [activeTerminalLine, setActiveTerminalLine] = useState('');
  const [terminalProgress, setTerminalProgress] = useState(0);
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [showSocial, setShowSocial] = useState(false);
  const typed = useTyping(TITLES);

  useEffect(() => {
    const root = pageRef.current;
    const canvas = canvasRef.current;
    const loaderOverlay = loaderOverlayRef.current;
    const loaderIris = loaderIrisRef.current;
    const pointerLight = pointerLightRef.current;
    const cursorAura = cursorAuraRef.current;
    if (!root || !canvas || !loaderOverlay || !loaderIris || !pointerLight || !cursorAura) return;

    const mediaQuery = window.matchMedia('(pointer: fine)');
    const useEnhancedPointer = mediaQuery.matches;
    let pointerNormalizedX = 0;
    let pointerNormalizedY = 0;

    let detachInteractiveCursorHandlers = () => {};

    if (useEnhancedPointer) {
      let targetX = window.innerWidth / 2;
      let targetY = window.innerHeight / 2;
      let auraX = targetX;
      let auraY = targetY;
      let lightX = targetX;
      let lightY = targetY;

      const syncPointer = (event: PointerEvent) => {
        targetX = event.clientX;
        targetY = event.clientY;
        pointerNormalizedX = THREE.MathUtils.clamp(event.clientX / window.innerWidth, 0, 1) * 2 - 1;
        pointerNormalizedY = THREE.MathUtils.clamp(event.clientY / window.innerHeight, 0, 1) * 2 - 1;
      };

      const renderPointer = () => {
        auraX += (targetX - auraX) * 0.24;
        auraY += (targetY - auraY) * 0.24;
        lightX += (targetX - lightX) * 0.11;
        lightY += (targetY - lightY) * 0.11;

        gsap.set(cursorAura, {
          x: auraX,
          y: auraY,
        });

        gsap.set(pointerLight, {
          x: lightX,
          y: lightY,
        });
      };

      const interactiveNodes = Array.from(
        document.querySelectorAll<HTMLElement>('a, button, [role="button"], input, textarea, select')
      );

      const onInteractiveEnter = () => {
        gsap.to(cursorAura, { scale: 1.24, opacity: 0.96, duration: 0.2, ease: 'power3.out', overwrite: true });
        gsap.to(pointerLight, { opacity: 0.9, duration: 0.35, ease: 'power2.out', overwrite: true });
      };

      const onInteractiveLeave = () => {
        gsap.to(cursorAura, { scale: 1, opacity: 0.78, duration: 0.3, ease: 'power3.out', overwrite: true });
        gsap.to(pointerLight, { opacity: 0.7, duration: 0.35, ease: 'power2.out', overwrite: true });
      };

      interactiveNodes.forEach((node) => {
        node.addEventListener('pointerenter', onInteractiveEnter);
        node.addEventListener('pointerleave', onInteractiveLeave);
      });

      detachInteractiveCursorHandlers = () => {
        interactiveNodes.forEach((node) => {
          node.removeEventListener('pointerenter', onInteractiveEnter);
          node.removeEventListener('pointerleave', onInteractiveLeave);
        });
      };

      window.addEventListener('pointermove', syncPointer);
      gsap.ticker.add(renderPointer);

      gsap.set([pointerLight, cursorAura], {
        x: targetX,
        y: targetY,
      });

      gsap.set(pointerLight, { opacity: 0.7 });
      gsap.set(cursorAura, { opacity: 0.78, scale: 1 });

      const cleanupEnhancedPointer = () => {
        window.removeEventListener('pointermove', syncPointer);
        gsap.ticker.remove(renderPointer);
      };

      detachInteractiveCursorHandlers = (() => {
        const detachInteractive = detachInteractiveCursorHandlers;
        return () => {
          detachInteractive();
          cleanupEnhancedPointer();
        };
      })();
    }

    const maybeStartReveal = () => {
      if (!isSceneReadyRef.current || !isTypingDoneRef.current || hasStartedRevealRef.current) return;
      hasStartedRevealRef.current = true;
      overallProgressRef.current = 100;
      setTerminalProgress(100);
      const terminalShell = loaderOverlay.querySelector<HTMLElement>('.terminal-shell');
      const shellRect = terminalShell?.getBoundingClientRect();
      const shellScaleTarget = shellRect
        ? Math.max(window.innerWidth / shellRect.width, window.innerHeight / shellRect.height) * 1.18
        : 4.2;

      revealTimeoutRef.current = window.setTimeout(() => {
        introTimelineRef.current = gsap
          .timeline({
            defaults: {
              ease: 'power3.out',
            },
            onComplete: () => {
              setShowLoader(false);
              setShowSocial(true);
            },
          })
          .set([canvas, root], {
            transformOrigin: '50% 50%',
            willChange: 'transform, opacity, filter',
            force3D: true,
          })
          .set('.terminal-shell', {
            transformOrigin: '50% 50%',
            willChange: 'transform, border-radius, box-shadow, filter',
            force3D: true,
          })
          .set('.terminal-welcome', {
            transformOrigin: '50% 50%',
            willChange: 'transform, opacity, filter',
            force3D: true,
          })
          .set('.hero-nav-email, .hero-nav-links a, .hero-greeting, .hero-name, .hero-job-label, .hero-job-title', {
            autoAlpha: 0,
            y: 18,
          })
          .set(loaderIris, { autoAlpha: 0, scale: 0.6 })
          .to(
            '.terminal-topbar, .terminal-log, .terminal-footer',
            {
              autoAlpha: 0,
              y: -10,
              duration: 0.32,
              ease: 'power2.out',
            },
            0
          )
          .fromTo(
            '.terminal-welcome',
            {
              autoAlpha: 0,
              scale: 0.08,
              z: -320,
              filter: 'blur(28px)',
            },
            {
              autoAlpha: 1,
              scale: 1.82,
              z: 0,
              filter: 'blur(0px)',
              duration: 1.2,
              ease: 'power4.out',
            },
            0
          )
          .to(
            '.terminal-welcome-wrap',
            {
              autoAlpha: 0,
              scale: 1.02,
              filter: 'blur(8px)',
              duration: 0.22,
              ease: 'power2.inOut',
            },
            1.88
          )
          .to(
            loaderIris,
            {
              autoAlpha: 0.72,
              scale: 10,
              duration: 1.26,
              ease: 'power3.out',
            },
            2.12
          )
          .to(
            '.terminal-shell',
            {
              scale: shellScaleTarget * 0.88,
              duration: 1.02,
              ease: 'power2.inOut',
            },
            2.12
          )
          .to(
            '.terminal-shell',
            {
              scale: shellScaleTarget,
              borderRadius: '0px',
              duration: 0.84,
              ease: 'power3.out',
            },
            2.82
          )
          .fromTo(
            [canvas, root],
            {
              autoAlpha: 1,
              scale: 1.11,
              filter: 'blur(18px) brightness(0.46) saturate(0.78)',
            },
            {
              autoAlpha: 1,
              scale: 1,
              filter: 'blur(0px) brightness(1) saturate(1)',
              duration: 1.22,
              stagger: 0.05,
              ease: 'power2.out',
              onStart: () => {
                isIntroCompleteRef.current = true;
                setIsIntroComplete(true);
              },
            },
            2.88
          )
          .to(
            '.terminal-shell',
            {
              borderColor: 'rgba(0, 0, 0, 0)',
              boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
              duration: 0.58,
              ease: 'power1.out',
            },
            2.96
          )
          .to(
            loaderOverlay,
            {
              backgroundColor: 'rgba(5, 3, 11, 0)',
              autoAlpha: 0,
              duration: 0.76,
              ease: 'power2.inOut',
            },
            2.98
          )
          .call(() => {
            gsap.set([canvas, root], { clearProps: 'filter,transform,willChange,force3D' });
            gsap.set('.terminal-shell', { clearProps: 'transform,borderRadius,boxShadow,borderColor,willChange,force3D' });
          })
          .fromTo(
            '.hero-nav-email, .hero-nav-links a',
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.98, stagger: 0.06, ease: 'power2.out' },
            3.18
          )
          .fromTo(
            '.hero-greeting, .hero-name, .hero-job-label, .hero-job-title',
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 1.08, stagger: 0.07, ease: 'power3.out' },
            3.24
          )
          .call(
            () => {
              if (!headControls.length) return;

              gsap.to(headMotion, {
                lift: 1,
                track: 1,
                duration: 1.24,
                ease: 'power3.out',
              });
            },
            [],
            3.06
          )
          .to(ambientLight, { intensity: ambientTarget, duration: 1.5, ease: 'sine.out' }, 3.02)
          .to(directionalLight, { intensity: directionalTarget, duration: 2.2, ease: 'sine.out' }, '<')
          .to(accentLight, { intensity: accentTarget, duration: 2.35, ease: 'sine.out' }, '<')
          .to(pinkRim, { intensity: rimTarget, duration: 2.55, ease: 'sine.out' }, '<')
          .to(backlight, { intensity: backlightTarget, duration: 2.7, ease: 'sine.out' }, '<');
      }, 0);
    };

    const finishIntro = () => {
      modelProgressRef.current = 100;
      const combined = Math.round(typingProgressRef.current * 0.72 + modelProgressRef.current * 0.28);
      const nextProgress = Math.min(99, Math.max(overallProgressRef.current, combined));
      overallProgressRef.current = nextProgress;
      setTerminalProgress(nextProgress);
      isSceneReadyRef.current = true;
      maybeStartReveal();
    };

    const updateTerminalProgress = (lineIndex: number, charIndex: number) => {
      const completedChars = TERMINAL_LINES.slice(0, lineIndex).reduce((count, line) => count + line.length, 0);
      const typedChars = Math.min(completedChars + charIndex, TOTAL_TERMINAL_CHARS);
      typingProgressRef.current = Math.round((typedChars / TOTAL_TERMINAL_CHARS) * 100);
      const combined = Math.round(typingProgressRef.current * 0.72 + modelProgressRef.current * 0.28);
      const nextProgress = Math.min(99, Math.max(overallProgressRef.current, combined));
      overallProgressRef.current = nextProgress;
      setTerminalProgress(nextProgress);
    };

    const typeTerminalLine = (lineIndex: number) => {
      if (lineIndex >= TERMINAL_LINES.length) {
        typingProgressRef.current = 100;
        isTypingDoneRef.current = true;
        maybeStartReveal();
        return;
      }

      const line = TERMINAL_LINES[lineIndex];
      let charIndex = 0;

      const typeCharacter = () => {
        if (charIndex <= line.length) {
          updateTerminalProgress(lineIndex, charIndex);
          setActiveTerminalLine(line.slice(0, charIndex));
          charIndex += 1;
          const baseDelay = lineIndex === TERMINAL_LINES.length - 1 ? 30 : 22;
          const jitter = Math.floor(Math.random() * 28);
          typingTimeoutRef.current = window.setTimeout(typeCharacter, baseDelay + jitter);
          return;
        }

        setTerminalLines((prev) => [...prev, line]);
        setActiveTerminalLine('');
        typingTimeoutRef.current = window.setTimeout(
          () => typeTerminalLine(lineIndex + 1),
          170 + Math.floor(Math.random() * 140)
        );
      };

      typeCharacter();
    };

    typeTerminalLine(0);

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      lerp: 0.085,
    });

    const syncLenisWithScrollTrigger = () => ScrollTrigger.update();
    lenis.on('scroll', syncLenisWithScrollTrigger);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0.95, 4.8);
    camera.lookAt(0, 0, 0);

    const ambientTarget = 0.96;
    const directionalTarget = 1.72;
    const accentTarget = 1.15;
    const rimTarget = 0.95;
    const backlightTarget = 1.34;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xf5d0fe, 0);
    directionalLight.position.set(2.8, 4.2, 3.8);
    scene.add(directionalLight);

    const accentLight = new THREE.PointLight(0xa855f7, 0, 18, 1.2);
    accentLight.position.set(-1.8, 1.3, 2.2);
    scene.add(accentLight);

    const pinkRim = new THREE.PointLight(0xe879f9, 0, 16, 1.3);
    pinkRim.position.set(1.5, 1.7, 2.4);
    scene.add(pinkRim);
    const backlight = new THREE.PointLight(0xa855f7, 0, 20, 1.15);
    backlight.position.set(0, 1.05, -2.8);
    scene.add(backlight);

    const modelAnchor = new THREE.Group();
    scene.add(modelAnchor);

    const modelState: ModelScrollState = {
      positionX: 0,
      rotationY: 0,
      scale: 0.72,
    };

    let mixer: THREE.AnimationMixer | null = null;
    let modelRoot: THREE.Group | null = null;
    const headControls: HeadControl[] = [];
    const headMotion = { lift: 0, track: 0 };
    let smoothedHeadPointerX = 0;
    let smoothedHeadPointerY = 0;
    let rafId = 0;
    const clock = new THREE.Clock();
    const headTrackYaw = THREE.MathUtils.degToRad(12);
    const headTrackPitch = THREE.MathUtils.degToRad(8);

    const setCanvasSize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      modelState.positionX = 0;
      modelState.rotationY = 0;
      modelState.scale = window.innerWidth < 768 ? 0.64 : 0.72;
    };

    window.addEventListener('resize', setCanvasSize);

    const ctx = gsap.context(() => {}, root);

    const loader = new GLTFLoader();
    loader.load(
      '/assets/FIXED.glb?v=2',
      (gltf: GLTF) => {
        const model = gltf.scene;

        console.log('Animations:', gltf.animations);

        gltf.scene.traverse((obj) => {
          const debugObj = obj as THREE.Object3D & {
            isMesh?: boolean;
            isSkinnedMesh?: boolean;
            skeleton?: THREE.Skeleton;
          };

          console.log({
            name: obj.name,
            type: obj.type,
            isMesh: debugObj.isMesh || false,
            isSkinnedMesh: debugObj.isSkinnedMesh || false,
            hasSkeleton: !!debugObj.skeleton,
          });

          if (debugObj.isSkinnedMesh) {
            console.warn('Model is still rigged (this causes T-pose)');
          }
        });

        const bounds = new THREE.Box3().setFromObject(model);
        const center = bounds.getCenter(new THREE.Vector3());
        model.position.sub(center);

        model.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (mesh.isMesh) {
            mesh.castShadow = false;
            mesh.receiveShadow = false;
          }
        });

        const availableBones: string[] = [];
        model.traverse((obj) => {
          if ((obj as THREE.Bone).isBone) availableBones.push(obj.name);
        });

        const headBone =
          model.getObjectByName('Bone006L') ??
          model.getObjectByName('Bone.006.L');

        if (headBone) {
          headControls.push({
            target: headBone,
            neutralRotationX: headBone.rotation.x,
            neutralRotationY: headBone.rotation.y,
            neutralRotationZ: headBone.rotation.z,
            introTilt: THREE.MathUtils.degToRad(90),
            yawWeight: 1,
            pitchWeight: 1,
            lerp: 0.18,
          });
        } else {
          console.warn('Head bone Bone006L / Bone.006.L was not found in FIXED.glb');
          console.log('Available runtime bones:', availableBones);
        }

        console.log(
          'Head motion controls:',
          headControls.map((control) => control.target.name)
        );

        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);

          const clip = gltf.animations[0];
          const action = mixer.clipAction(clip);
          const isSingleFramePose = clip.tracks.every((track) => track.times.length <= 1);

          action.reset();

          if (isSingleFramePose) {
            action.setLoop(THREE.LoopOnce, 1);
            action.clampWhenFinished = true;
            action.play();
            mixer.setTime(clip.duration);
          } else {
            action.play();
          }
        } else {
          console.warn(
            'The GLB was loaded without animation data. If this armature pose should animate, re-export it from Blender with animation. If it should be static, bake the pose before export.'
          );
        }

        modelAnchor.position.set(0, 0, 0);
        modelAnchor.rotation.set(0, 0, 0);

        headControls.forEach((control) => {
          control.target.rotation.x = control.neutralRotationX + control.introTilt;
          control.target.rotation.y = control.neutralRotationY;
          control.target.rotation.z = control.neutralRotationZ;
        });

        modelRoot = model;
        modelAnchor.add(modelRoot);

        ScrollTrigger.refresh();
        finishIntro();
      },
      (progressEvent: ProgressEvent<EventTarget>) => {
        if (progressEvent.total <= 0) return;

        modelProgressRef.current = Math.min(100, Math.round((progressEvent.loaded / progressEvent.total) * 100));
        const combined = Math.round(typingProgressRef.current * 0.72 + modelProgressRef.current * 0.28);
        const nextProgress = Math.min(99, Math.max(overallProgressRef.current, combined));
        overallProgressRef.current = nextProgress;
        setTerminalProgress(nextProgress);
      },
      (error) => {
        console.error('Unable to load model:', error);
        finishIntro();
      }
    );

    const render = () => {
      rafId = window.requestAnimationFrame(render);

      const dt = clock.getDelta();
      if (mixer) mixer.update(dt);

      if (modelRoot) {
        const targetScale = modelState.scale;
        modelAnchor.scale.x = THREE.MathUtils.lerp(modelAnchor.scale.x || 1, targetScale, 0.12);
        modelAnchor.scale.y = THREE.MathUtils.lerp(modelAnchor.scale.y || 1, targetScale, 0.12);
        modelAnchor.scale.z = THREE.MathUtils.lerp(modelAnchor.scale.z || 1, targetScale, 0.12);
        backlight.position.x = 0;
        backlight.intensity = backlightTarget;

        if (headControls.length) {
          smoothedHeadPointerX += (pointerNormalizedX - smoothedHeadPointerX) * 0.075;
          smoothedHeadPointerY += (pointerNormalizedY - smoothedHeadPointerY) * 0.075;

          headControls.forEach((control) => {
            const introTilt = (1 - headMotion.lift) * control.introTilt;
            const trackingYaw = smoothedHeadPointerX * headTrackYaw * headMotion.track * control.yawWeight;
            const trackingPitch = -smoothedHeadPointerY * headTrackPitch * headMotion.track * control.pitchWeight;

            control.target.rotation.x = THREE.MathUtils.lerp(
              control.target.rotation.x,
              control.neutralRotationX + introTilt + trackingPitch,
              control.lerp
            );
            control.target.rotation.y = THREE.MathUtils.lerp(
              control.target.rotation.y,
              control.neutralRotationY + trackingYaw,
              control.lerp
            );
            control.target.rotation.z = THREE.MathUtils.lerp(
              control.target.rotation.z,
              control.neutralRotationZ,
              control.lerp
            );
          });
        }
      }

      renderer.render(scene, camera);
    };

    render();

    ScrollTrigger.refresh();

    return () => {
      if (typingTimeoutRef.current) window.clearTimeout(typingTimeoutRef.current);
      introTimelineRef.current?.kill();
      if (revealTimeoutRef.current) window.clearTimeout(revealTimeoutRef.current);
      isIntroCompleteRef.current = false;
      detachInteractiveCursorHandlers();
      ctx.revert();
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', setCanvasSize);
      ScrollTrigger.clearMatchMedia();

      gsap.ticker.remove(onTick);
      lenis.off('scroll', syncLenisWithScrollTrigger);
      lenis.destroy();

      if (modelRoot) {
        modelRoot.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (!mesh.isMesh) return;

          mesh.geometry.dispose();

          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material) => material.dispose());
          } else {
            mesh.material.dispose();
          }
        });
      }

      renderer.dispose();
    };
  }, []);

  const terminalComplete = terminalLines.length >= TERMINAL_LINES.length;
  const terminalProgressLabel = `${String(terminalProgress).padStart(3, '0')}%`;
  const isTotalLoadDone = terminalComplete && terminalProgress >= 100;

  return (
    <>
      <Head title="Ellis Threader | 3D Scroll Experience" />
      <HomeStyles />
      {showLoader ? (
        <div ref={loaderOverlayRef} className="site-loader">
          <div ref={loaderIrisRef} className="loader-iris" aria-hidden="true" />
          <div className="terminal-shell">
            <div className="terminal-topbar" aria-hidden="true">
              <div className="terminal-status-cluster">
                <span className="terminal-dot terminal-dot-red" />
                <span className="terminal-dot terminal-dot-amber" />
                <span className="terminal-dot terminal-dot-green" />
              </div>

              <div className="terminal-title-wrap">
                <span className="terminal-title">portfolio://boot</span>
              </div>
            </div>

            <div className="terminal-body">
              <div className="terminal-log">
                {terminalLines.map((line) => (
                  <p className="terminal-line" key={line}>
                    {line}
                  </p>
                ))}

                {!terminalComplete ? (
                  <p className="terminal-line terminal-line-active">
                    {activeTerminalLine}
                    <span className="terminal-cursor" />
                  </p>
                ) : null}
              </div>

              {isTotalLoadDone ? (
                <div className="terminal-welcome-wrap">
                  <p className="terminal-welcome">WELCOME</p>
                </div>
              ) : null}
            </div>

            <div className="terminal-footer">
              <span className="terminal-footer-label">{isTotalLoadDone ? 'ready' : 'loading'}</span>
              <div className="terminal-footer-progress" aria-live="polite">
                <span className="terminal-progress">{terminalProgressLabel}</span>
                <span className="terminal-progress-meter" aria-hidden="true">
                  <span className="terminal-progress-fill" style={{ width: `${terminalProgress}%` }} />
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div ref={pointerLightRef} className={`ambient-pointer-light ${isIntroComplete ? 'is-active' : 'is-hidden'}`} aria-hidden="true" />
      <div ref={cursorAuraRef} className={`custom-cursor custom-cursor-aura ${isIntroComplete ? 'is-active' : 'is-hidden'}`} aria-hidden="true" />

      <nav className={`social-dock ${showSocial ? 'is-visible' : 'is-hidden'}`} aria-label="Social links">
        <a href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub">
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
            <path
              d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.32 6.84 9.66.5.1.68-.22.68-.5 0-.25-.01-.92-.01-1.8-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.31.1-2.73 0 0 .85-.28 2.78 1.05A9.5 9.5 0 0 1 12 6.9c.85 0 1.7.12 2.5.35 1.92-1.33 2.77-1.05 2.77-1.05.56 1.42.21 2.47.11 2.73.64.72 1.03 1.64 1.03 2.76 0 3.94-2.35 4.8-4.59 5.06.36.32.68.95.68 1.92 0 1.39-.01 2.5-.01 2.84 0 .28.18.61.69.5A10.23 10.23 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z"
              fill="currentColor"
            />
          </svg>
        </a>
        <a href="https://x.com/" target="_blank" rel="noreferrer" aria-label="X">
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
            <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.27l-4.9-6.4L6.4 22H3.3l7.26-8.3L1 2h6.35l4.42 5.85L18.9 2Zm-1.1 18h1.74L6.39 3.9H4.53L17.8 20Z" fill="currentColor" />
          </svg>
        </a>
        <a href="https://instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
            <path
              d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.9A3.85 3.85 0 0 0 3.9 7.75v8.5A3.85 3.85 0 0 0 7.75 20.1h8.5a3.85 3.85 0 0 0 3.85-3.85v-8.5a3.85 3.85 0 0 0-3.85-3.85h-8.5Zm8.85 1.35a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.9a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2Z"
              fill="currentColor"
            />
          </svg>
        </a>
        <a href="https://linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
            <path
              d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5ZM3 9.5h4v11H3v-11Zm6 0h3.83v1.56h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.66 4.77 6.11v5.39h-4V15.7c0-1.15-.02-2.64-1.61-2.64-1.62 0-1.87 1.26-1.87 2.56v4.88H9v-11Z"
              fill="currentColor"
            />
          </svg>
        </a>
      </nav>

      <main ref={pageRef} className={`scroll-page ${isIntroComplete ? 'is-ready' : 'is-preloading'}`}>
        <header className="hero-nav">
          <div className="hero-nav-inner">
            <a className="hero-nav-email" href="mailto:ellis.threader3001@gmail.com">
              ellis.threader3001@gmail.com
            </a>

            <nav className="hero-nav-links">
              <a href="#about" aria-label="ABOUT">
                <span className="nav-label nav-label-current">ABOUT</span>
                <span className="nav-label nav-label-next">ABOUT</span>
              </a>
              <a href="#work" aria-label="WORK">
                <span className="nav-label nav-label-current">WORK</span>
                <span className="nav-label nav-label-next">WORK</span>
              </a>
              <a href="#contact" aria-label="CONTACT">
                <span className="nav-label nav-label-current">CONTACT</span>
                <span className="nav-label nav-label-next">CONTACT</span>
              </a>
            </nav>
          </div>
        </header>

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

        <AboutSection />
        <WhatIDoSection />
        <CareerSection />
        <ContactSection />
      </main>
    </>
  );
}
