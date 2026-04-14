import { useHomeSceneContext } from '../context/HomeSceneContext';

const socialLinks = [
  {
    href: 'https://github.com/',
    label: 'GitHub',
    icon: (
      <path d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.32 6.84 9.66.5.1.68-.22.68-.5 0-.25-.01-.92-.01-1.8-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.31.1-2.73 0 0 .85-.28 2.78 1.05A9.5 9.5 0 0 1 12 6.9c.85 0 1.7.12 2.5.35 1.92-1.33 2.77-1.05 2.77-1.05.56 1.42.21 2.47.11 2.73.64.72 1.03 1.64 1.03 2.76 0 3.94-2.35 4.8-4.59 5.06.36.32.68.95.68 1.92 0 1.39-.01 2.5-.01 2.84 0 .28.18.61.69.5A10.23 10.23 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z" fill="currentColor" />
    ),
  },
  {
    href: 'https://x.com/',
    label: 'X',
    icon: <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.27l-4.9-6.4L6.4 22H3.3l7.26-8.3L1 2h6.35l4.42 5.85L18.9 2Zm-1.1 18h1.74L6.39 3.9H4.53L17.8 20Z" fill="currentColor" />,
  },
  {
    href: 'https://instagram.com/',
    label: 'Instagram',
    icon: <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.9A3.85 3.85 0 0 0 3.9 7.75v8.5A3.85 3.85 0 0 0 7.75 20.1h8.5a3.85 3.85 0 0 0 3.85-3.85v-8.5a3.85 3.85 0 0 0-3.85-3.85h-8.5Zm8.85 1.35a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.9a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2Z" fill="currentColor" />,
  },
  {
    href: 'https://linkedin.com/',
    label: 'LinkedIn',
    icon: <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5ZM3 9.5h4v11H3v-11Zm6 0h3.83v1.56h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.66 4.77 6.11v5.39h-4V15.7c0-1.15-.02-2.64-1.61-2.64-1.62 0-1.87 1.26-1.87 2.56v4.88H9v-11Z" fill="currentColor" />,
  },
];

export function SocialDock() {
  const { showSocial } = useHomeSceneContext();

  return (
    <nav className={`social-dock ${showSocial ? 'is-visible' : 'is-hidden'}`} aria-label="Social links">
      {socialLinks.map((link) => (
        <a key={link.label} href={link.href} target="_blank" rel="noreferrer" aria-label={link.label}>
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
            {link.icon}
          </svg>
        </a>
      ))}
    </nav>
  );
}
