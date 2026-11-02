import { useEffect, useState } from 'react';
import GradientASCII from './GradientASCII';
import { useTheme } from '../contexts/ThemeContext';
import './AsciiHero.css';

const STORAGE_KEY = 'theme';

const getInitialTheme = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* storage can be blocked, fall through to the system preference */
  }
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

export default function AsciiHero() {
  let themeContext = null;
  try {
    themeContext = useTheme();
  } catch {
    /* outside ThemeProvider */
  }

  const [localTheme, setLocalTheme] = useState(getInitialTheme);
  const theme = themeContext ? themeContext.theme : localTheme;
  const isLight = theme === 'light';

  const handleToggle = () => {
    if (themeContext) {
      themeContext.toggleTheme();
    } else {
      setLocalTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    }
  };

  useEffect(() => {
    if (!themeContext) {
      document.documentElement.dataset.theme = theme;
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch {
        /* ignore */
      }
    }
  }, [theme, themeContext]);

  return (
    <section className="hero" data-theme={theme}>
      <div className="hero__bg">
        <GradientASCII shape="horizon" lightMode={isLight} />
      </div>

      <button
        type="button"
        className="hero__toggle"
        aria-pressed={isLight}
        onClick={handleToggle}
      >
        {isLight ? 'Dark mode' : 'Light mode'}
      </button>

      <div className="hero__content">
        <h1 className="hero__title">Get past the filter.</h1>
        <p className="hero__sub">
          InternIQ reads your resume the way recruiter software does, shows the gap to your dream role, and helps you
          close it.
        </p>
        <div className="hero__actions">
          <a className="hero__btn hero__btn--solid" href="#analyze">
            Analyze my resume
          </a>
          <a className="hero__btn hero__btn--outline" href="#how-it-works">
            See how it works
          </a>
        </div>
      </div>
    </section>
  );
}
