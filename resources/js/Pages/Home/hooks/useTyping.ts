import { useEffect, useState } from 'react';

export function useTyping(words: string[]) {
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
