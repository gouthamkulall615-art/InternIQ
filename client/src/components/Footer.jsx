'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useReducedMotion } from 'framer-motion';
import './Footer.css';

const WATERMARK_LETTERS = ['I', 'N', 'T', 'E', 'R', 'N', 'I', 'Q'];

const NAV_PILLS = [
  { label: 'Tools', href: '#tools', isHash: true },
  { label: 'How it works', href: '#how-it-works', isHash: true },
  { label: 'Log in', href: '/login', isRouter: true },
  { label: 'Register', href: '/register', isRouter: true },
  {
    label: 'GitHub',
    href: 'https://github.com/gouthamkulall615-art',
    isExternal: true,
    hasArrow: true
  }
];

// Magnetic Wrapper Component
function MagneticItem({ children, radius = 80, className = '' }) {
  const ref = useRef(null);
  const prefersReduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15 });
  const springY = useSpring(y, { stiffness: 200, damping: 15 });

  useEffect(() => {
    if (prefersReduced) return;
    if (window.matchMedia?.('(pointer: coarse)').matches) return;
    const el = ref.current;
    if (!el) return;

    const handlePointerMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const d = Math.hypot(e.clientX - cx, e.clientY - cy);

      if (d < radius) {
        const s = 1 - d / radius;
        const ox = Math.min(Math.max((e.clientX - cx) * 0.3 * s, -8), 8);
        const oy = Math.min(Math.max((e.clientY - cy) * 0.3 * s, -8), 8);
        x.set(ox);
        y.set(oy);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    const handlePointerLeave = () => {
      x.set(0);
      y.set(0);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [radius, x, y, prefersReduced]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={prefersReduced ? undefined : { x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
}

export default function Footer() {
  const footerRef = useRef(null);
  const svgRef = useRef(null);
  const overlaySvgRef = useRef(null);
  const textRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [hasHover, setHasHover] = useState(false);
  const prefersReduced = useReducedMotion();

  // Scroll Progress Tracking for the Circle
  const { scrollYProgress } = useScroll();
  const CIRCLE_CIRCUMFERENCE = 182.21; // 2 * PI * 29
  const strokeDashoffset = useTransform(scrollYProgress, [0, 1], [CIRCLE_CIRCUMFERENCE, 0]);

  // Observer for Entrance Timeline (at 30% in view)
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Watermark bbox auto-calibration after font loads
  useEffect(() => {
    document.fonts?.ready?.then(() => {
      if (textRef.current && svgRef.current) {
        try {
          const bbox = textRef.current.getBBox();
          if (bbox && bbox.width > 0 && bbox.height > 0) {
            const pad = 12;
            const vb = `${bbox.x - pad} ${bbox.y - pad} ${bbox.width + pad * 2} ${bbox.height + pad * 2}`;
            svgRef.current.setAttribute('viewBox', vb);
            if (overlaySvgRef.current) {
              overlaySvgRef.current.setAttribute('viewBox', vb);
            }
          }
        } catch {
          /* fallback to starting viewBox */
        }
      }
    });
  }, []);

  // Cursor Tracking with rAF Lerp for Spotlight Effects
  useEffect(() => {
    if (prefersReduced) return;
    if (window.matchMedia?.('(pointer: coarse)').matches) return;
    const footer = footerRef.current;
    if (!footer) return;

    const mouse = { currentX: 0, currentY: 0, targetX: -500, targetY: -500 };
    let rafId = null;

    const handleMouseMove = (e) => {
      const rect = footer.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    const handleMouseEnter = () => setHasHover(true);
    const handleMouseLeave = () => setHasHover(false);

    const updateLoop = () => {
      mouse.currentX += (mouse.targetX - mouse.currentX) * 0.15;
      mouse.currentY += (mouse.targetY - mouse.currentY) * 0.15;

      footer.style.setProperty('--mx', `${mouse.currentX.toFixed(1)}px`);
      footer.style.setProperty('--my', `${mouse.currentY.toFixed(1)}px`);

      rafId = requestAnimationFrame(updateLoop);
    };

    footer.addEventListener('mousemove', handleMouseMove, { passive: true });
    footer.addEventListener('mouseenter', handleMouseEnter);
    footer.addEventListener('mouseleave', handleMouseLeave);
    rafId = requestAnimationFrame(updateLoop);

    return () => {
      footer.removeEventListener('mousemove', handleMouseMove);
      footer.removeEventListener('mouseenter', handleMouseEnter);
      footer.removeEventListener('mouseleave', handleMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [prefersReduced]);

  // Smooth Scroll-To-Top handler
  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? 'auto' : 'smooth'
    });
  };

  // Nav pill click handler for hash anchors
  const handleNavClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
      }
    }
  };

  return (
    <footer
      ref={footerRef}
      className={`footer-section ${inView ? 'is-active' : ''} ${hasHover ? 'has-hover' : ''}`}
      aria-label="Footer"
    >
      {/* Background Glow */}
      <div className="footer-top-glow" aria-hidden="true" />

      {/* Grid Background Layers */}
      <div className="footer-grid-base" aria-hidden="true" />
      <div className="footer-grid-spotlight" aria-hidden="true" />

      {/* Watermark SVG 1 (Base Layer: Stroke Draw + Fill + Shine Sweep) */}
      <div className="footer-watermark-layer" aria-hidden="true">
        <svg
          ref={svgRef}
          viewBox="0 0 1300 230"
          className="footer-watermark-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="footer-sweep-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="42%" stopColor="transparent" />
              <stop
                className="wm-sweep-stop"
                offset="50%"
                stopColor="var(--footer-wm-sweep, rgba(129, 140, 248, 0.45))"
              />
              <stop offset="58%" stopColor="transparent" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          {/* Stroke-drawn base text */}
          <text
            ref={textRef}
            x="650"
            y="205"
            textAnchor="middle"
            fontSize="268"
            className="wm-text-base"
          >
            {WATERMARK_LETTERS.map((char, i) => (
              <tspan
                key={i}
                className={`wm-char ${inView ? 'draw' : ''}`}
                style={{
                  animationDelay: inView ? `${0.2 + i * 0.10}s` : '0s'
                }}
              >
                {char}
              </tspan>
            ))}
          </text>

          {/* Duplicate layer for shine sweep */}
          <text
            x="650"
            y="205"
            textAnchor="middle"
            fontSize="268"
            className="wm-text-sweep"
          >
            INTERNIQ
          </text>
        </svg>
      </div>

      {/* Watermark SVG 2 (Spotlight Overlay: lights up with cursor) */}
      <div className="footer-watermark-overlay" aria-hidden="true">
        <svg
          ref={overlaySvgRef}
          viewBox="0 0 1300 230"
          className="footer-watermark-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text
            x="650"
            y="205"
            textAnchor="middle"
            fontSize="268"
            className="wm-text-spotlight"
          >
            INTERNIQ
          </text>
        </svg>
      </div>

      {/* Main Content Container */}
      <div className="footer-inner">
        {/* 1. Tagline */}
        <p className="footer-tagline">
          Practical career preparation for students and early-career applicants.
        </p>

        {/* 2. Nav Pills Row */}
        <nav className="footer-nav" aria-label="Footer Navigation">
          {NAV_PILLS.map((pill, idx) => {
            const delay = `${0.3 + idx * 0.08}s`;
            const content = (
              <>
                <span>{pill.label}</span>
                {pill.hasArrow && <span className="footer-pill-arrow">↗</span>}
              </>
            );

            return (
              <MagneticItem key={pill.label} radius={80} className="footer-pill-wrap" style={{ transitionDelay: delay }}>
                {pill.isRouter ? (
                  <Link to={pill.href} className="footer-pill">
                    {content}
                  </Link>
                ) : pill.isExternal ? (
                  <a
                    href={pill.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-pill"
                  >
                    {content}
                  </a>
                ) : (
                  <a
                    href={pill.href}
                    onClick={(e) => handleNavClick(e, pill.href)}
                    className="footer-pill"
                  >
                    {content}
                  </a>
                )}
              </MagneticItem>
            );
          })}
        </nav>

        {/* 4. Bottom Bar */}
        <div className="footer-bottom-bar">
          {/* Left: Copyright */}
          <div className="footer-copyright">
            © 2026 INTERNIQ. ALL RIGHTS RESERVED.
          </div>

          {/* Center: Crafted Pill */}
          <MagneticItem radius={80} className="crafted-pill-wrap">
            <div className="crafted-pill">
              <div className="crafted-pill-beam" aria-hidden="true" />
              <span>CRAFTED WITH</span>
              <span className="crafted-heart" aria-label="love">❤</span>
              <span>BY</span>
              <span className="crafted-name">Goutham</span>
            </div>
          </MagneticItem>

          {/* Right: Scroll-To-Top Button with SVG Progress Ring */}
          <MagneticItem radius={80} className="scroll-top-wrap">
            <button
              type="button"
              onClick={handleScrollTop}
              className="scroll-top-btn"
              aria-label="Back to top"
            >
              {/* Circular Scroll Progress Ring */}
              <svg className="scroll-top-ring" viewBox="0 0 60 60" aria-hidden="true">
                {/* Track circle */}
                <circle
                  cx="30"
                  cy="30"
                  r="29"
                  fill="none"
                  className="scroll-top-track"
                  stroke="var(--footer-ring-track, rgba(255, 255, 255, 0.08))"
                  strokeWidth="2"
                />
                {/* Dynamic animated progress circle */}
                <motion.circle
                  cx="30"
                  cy="30"
                  r="29"
                  fill="none"
                  className="scroll-top-progress"
                  stroke="var(--footer-ring-progress, #818cf8)"
                  strokeWidth="2"
                  strokeDasharray={CIRCLE_CIRCUMFERENCE}
                  style={{ strokeDashoffset }}
                />
              </svg>

              {/* Arrow Up Icon */}
              <span className="scroll-top-arrow" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              </span>
            </button>
          </MagneticItem>
        </div>
      </div>
    </footer>
  );
}

