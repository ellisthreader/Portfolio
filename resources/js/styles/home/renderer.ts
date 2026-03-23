import type { Declarations, StyleRule, StyleSheet } from './types';

const normalize = (selector: string) => selector.replace(/\s+/g, ' ').replace(/\s*,\s*/g, ', ').trim();

const isDeclarations = (rule: StyleRule): rule is Declarations =>
  typeof rule === 'object' && rule !== null && Object.values(rule).every((value) => typeof value === 'string');

const renderDeclarations = (declarations: Declarations): string =>
  Object.entries(declarations)
    .map(([property, value]) => `${property}:${value};`)
    .join('');

const renderKeyframes = (frames: StyleSheet): string =>
  Object.entries(frames)
    .map(([frame, rule]) => {
      if (!isDeclarations(rule)) return '';
      return `${normalize(frame)}{${renderDeclarations(rule)}}`;
    })
    .join('');

export const renderStyleSheet = (styleSheet: StyleSheet): string =>
  Object.entries(styleSheet)
    .map(([rawSelector, rule]) => {
      const selector = normalize(rawSelector);

      if (selector.startsWith('@media') || selector.startsWith('@supports')) {
        return `${selector}{${renderStyleSheet(rule as StyleSheet)}}`;
      }

      if (selector.startsWith('@keyframes')) {
        return `${selector}{${renderKeyframes(rule as StyleSheet)}}`;
      }

      if (selector.startsWith('@import')) {
        return `${selector};`;
      }

      if (isDeclarations(rule)) {
        return `${selector}{${renderDeclarations(rule)}}`;
      }

      return `${selector}{${renderStyleSheet(rule as StyleSheet)}}`;
    })
    .join('');
