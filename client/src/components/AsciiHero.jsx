import GradientASCII from './GradientASCII';
import Magnet from './Magnet';
import { useTheme } from '../contexts/ThemeContext';
import './AsciiHero.css';

export default function AsciiHero() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <section className="hero" data-theme={theme}>
      <div className="hero__bg">
        <GradientASCII shape="horizon" lightMode={isLight} />
      </div>

      <button
        type="button"
        className="hero__toggle"
        aria-pressed={isLight}
        onClick={toggleTheme}
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
          <Magnet padding={60} magnetStrength={2.5} tilt={8} scale={1.04} maxOffset={18}>
            <a className="hero__btn hero__btn--solid" href="#analyze">
              Analyze my resume
            </a>
          </Magnet>
          <Magnet padding={60} magnetStrength={2.5} tilt={8} scale={1.04} maxOffset={18}>
            <a className="hero__btn hero__btn--outline" href="#how-it-works">
              See how it works
            </a>
          </Magnet>
        </div>
      </div>
    </section>
  );
}
