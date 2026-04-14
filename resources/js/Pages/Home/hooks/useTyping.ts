import { useEffect, useMemo, useRef, useState } from 'react';

export function useTyping(words: string[]) {
  const sequence = useMemo(() => words.filter(Boolean), [words]);
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [activeWord, setActiveWord] = useState(sequence[0] ?? '');
  const phaseRef = useRef<'typing' | 'holding' | 'deleting'>('typing');
  const progressRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);
  const holdElapsedRef = useRef(0);

  useEffect(() => {
    if (!sequence.length) return;

    const typingSpeed = 18;
    const deletingSpeed = 30;
    const holdDuration = 1180;
    const updateDisplayed = (word: string, progress: number) => {
      const nextValue = word.slice(0, Math.round(progress));
      setDisplayed((prev) => (prev === nextValue ? prev : nextValue));
    };

    const tick = (time: number) => {
      const currentWord = sequence[wordIndex] ?? sequence[0];
      if (!currentWord) return;

      if (!lastTimeRef.current) {
        lastTimeRef.current = time;
      }

      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = time;

      if (phaseRef.current === 'typing') {
        progressRef.current = Math.min(currentWord.length, progressRef.current + typingSpeed * dt);
        updateDisplayed(currentWord, progressRef.current);

        if (progressRef.current >= currentWord.length) {
          phaseRef.current = 'holding';
          holdElapsedRef.current = 0;
        }
      } else if (phaseRef.current === 'holding') {
        updateDisplayed(currentWord, currentWord.length);
        holdElapsedRef.current += dt * 1000;

        if (holdElapsedRef.current >= holdDuration) {
          phaseRef.current = 'deleting';
        }
      } else {
        progressRef.current = Math.max(0, progressRef.current - deletingSpeed * dt);
        updateDisplayed(currentWord, progressRef.current);

        if (progressRef.current <= 0) {
          phaseRef.current = 'typing';
          holdElapsedRef.current = 0;
          lastTimeRef.current = time;
          setWordIndex((prev) => (prev + 1) % sequence.length);
        }
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    const initialWord = sequence[wordIndex] ?? sequence[0];
    setActiveWord(initialWord);
    progressRef.current = Math.min(progressRef.current, initialWord.length);
    lastTimeRef.current = 0;
    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [sequence, wordIndex]);

  useEffect(() => {
    setActiveWord(sequence[wordIndex] ?? '');
  }, [sequence, wordIndex]);

  return {
    displayed,
    activeWord,
    longestWord: sequence.reduce((longest, word) => (word.length > longest.length ? word : longest), ''),
  };
}
