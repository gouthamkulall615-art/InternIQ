import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './VideoHero.css';

const STATS_DATA = [
  { glyph: '<', value: '10-point', label: 'ATS Resume Scoring', delay: '0.5s', isStatic: true },
  { glyph: '%', target: 8, suffix: '', decimals: 0, label: 'Target Roles Covered', delay: '0.58s', duration: 1580, offset: 570 },
  { glyph: '*', target: 3, suffix: '', decimals: 0, label: 'AI Tools, One Workspace', delay: '0.66s', duration: 1660, offset: 660 },
  { glyph: '#', value: '250-400', label: 'Word Tailored Cover Letters', delay: '0.74s', isStatic: true },
];

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export default function VideoHero({ onCta }) {
  const { isAuthenticated } = useAuth();
  const footerRef = useRef(null);
  const [counts, setCounts] = useState(() =>
    STATS_DATA.map((s) => (s.isStatic ? s.value : '0'))
  );
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    function runCounters() {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      STATS_DATA.forEach((stat, index) => {
        if (stat.isStatic) return;

        setTimeout(() => {
          let startTime = null;

          function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / stat.duration, 1);
            const val = (easeOutCubic(progress) * stat.target).toFixed(stat.decimals);

            setCounts((prev) => {
              const next = [...prev];
              next[index] = `${val}${stat.suffix}`;
              return next;
            });

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setCounts((prev) => {
                const next = [...prev];
                next[index] = `${stat.target.toFixed(stat.decimals)}${stat.suffix}`;
                return next;
              });
            }
          }

          requestAnimationFrame(step);
        }, stat.offset);
      });
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              runCounters();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.25 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    } else {
      runCounters();
    }
  }, []);

  return (
    <section id="overview" className="video-hero-root">
      {/* Full-viewport Background Video */}
      <div className="video-hero-bg">
        <video
          className="video-hero-video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Hero Content */}
      <div className="video-hero-content">
        {/* Exact Two-Line Headline */}
        <h1 className="vh-headline">
          <span className="vh-headline-line line-1">Prep Smarter.</span>
          <span className="vh-headline-line line-2">Get Shortlisted.</span>
        </h1>

        {/* Subhead */}
        <p className="vh-subhead vh-anim" style={{ '--d': '0.28s' }}>
          Scan your resume, find your skill gaps and generate tailored cover letters, all in one AI-powered career prep platform.
        </p>

        {/* CTA Button */}
        <div className="vh-cta-wrapper vh-anim" style={{ '--d': '0.4s' }}>
          {onCta ? (
            <button type="button" onClick={onCta} className="vh-cta-btn">
              Get Started
            </button>
          ) : (
            <Link
              to={isAuthenticated ? '/resume-analyzer' : '/register'}
              className="vh-cta-btn"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>

      {/* Stats Footer */}
      <footer ref={footerRef} className="vh-stats-footer">
        {STATS_DATA.map((stat, i) => (
          <div
            key={stat.label}
            className="vh-stat-item vh-anim"
            style={{ '--d': stat.delay }}
          >
            <div className="vh-stat-top">
              <span className="vh-stat-glyph">{stat.glyph}</span>
              <span className="vh-stat-value">{counts[i]}</span>
            </div>
            <span className="vh-stat-label">{stat.label}</span>
          </div>
        ))}
      </footer>
    </section>
  );
}
