import type { CareerEntry, WorkCard } from '../types/home';

export const TITLES = ['AI ENGINEER', 'FULL STACK DEVELOPER', 'SOFTWARE ENGINEER'];

export const TERMINAL_LINES = [
  'Booting visual system',
  'Syncing selected work',
  'Calibrating motion layer',
  'Preparing cinematic intro',
  'Opening experience',
  'System ready',
];

export const TERMINAL_CHAR_OFFSETS = TERMINAL_LINES.reduce<number[]>((offsets, _line, index) => {
  offsets.push(index === 0 ? 0 : offsets[index - 1] + TERMINAL_LINES[index - 1].length);
  return offsets;
}, []);

export const TOTAL_TERMINAL_CHARS = TERMINAL_LINES.reduce((count, line) => count + line.length, 0);

export const WHAT_I_DO_CARDS: WorkCard[] = [
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

export const CAREER_ENTRIES: CareerEntry[] = [
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
