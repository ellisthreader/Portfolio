const navItems = ['ABOUT', 'WORK', 'CONTACT'] as const;

export function HomeNav() {
  return (
    <header className="hero-nav">
      <div className="hero-nav-inner">
        <a className="hero-nav-email" href="mailto:ellis.threader3001@gmail.com">
          ellis.threader3001@gmail.com
        </a>

        <nav className="hero-nav-links">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} aria-label={item}>
              <span className="nav-label nav-label-current">{item}</span>
              <span className="nav-label nav-label-next">{item}</span>
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
