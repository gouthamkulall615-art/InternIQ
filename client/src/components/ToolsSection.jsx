// ToolsSection.jsx
import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
  useMemo
} from 'react';
import {
  motion,
  useInView,
  useScroll,
  useSpring,
  useMotionValue,
  AnimatePresence,
  useReducedMotion
} from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ToolsSection.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ==========================================
// DATA DEFINITIONS
// ==========================================

const RUBRIC_ROWS = [
  '1. Formatting & Readability',
  '2. Keyword Relevance',
  '3. Experience & Metrics',
  '4. Structure & Order',
  '5. Clarity & Professional Tone'
];

const ROLES_DATA = [
  {
    role: 'Frontend Developer',
    match: 67,
    have: ['React', 'Git'],
    missing: ['TypeScript', 'Jest']
  },
  {
    role: 'Backend Developer',
    match: 50,
    have: ['Node.js', 'Git'],
    missing: ['Docker', 'Redis']
  },
  {
    role: 'Data Analyst',
    match: 75,
    have: ['SQL', 'Excel', 'Python'],
    missing: ['Tableau']
  }
];

const LETTERS_DATA = [
  {
    company: 'Stripe',
    role: 'Intern',
    words: 312,
    text: 'Dear Hiring Team, I am writing to express my enthusiasm for the Software Engineering Internship at Stripe. My background in building responsive web applications and REST APIs directly aligns with your focus on reliable, well-documented payment systems.'
  },
  {
    company: 'Razorpay',
    role: 'SDE Intern',
    words: 287,
    text: 'Dear Hiring Team, I am excited to apply for the SDE Internship at Razorpay. Building full-stack projects with React and Node.js, and solving data structures problems regularly, has prepared me to contribute to fast-moving, high-reliability payment products.'
  },
  {
    company: 'Atlassian',
    role: 'Frontend Intern',
    words: 301,
    text: 'Dear Hiring Team, I am writing to apply for the Frontend Internship at Atlassian. I have shipped collaborative, real-time interfaces in React, and I care about accessible, polished UI, which matches the way your teams build tools for other teams.'
  }
];

const PATHWAYS = ['Frontend Dev', 'Backend Dev', 'Data Analyst', 'Machine Learning'];

const S_CURVE_PATH = 'M 30 90 C 150 90, 150 30, 220 30 S 380 90, 450 90 S 540 30, 570 30';

const PATH_NODES = [
  { label: 'Basics', f: 0, x: 30, y: 90 },
  { label: 'Projects', f: 0.33, x: 200, y: 35 },
  { label: 'Advanced', f: 0.66, x: 400, y: 85 },
  { label: 'Job-ready', f: 1, x: 570, y: 30 }
];

const SCRAMBLE_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%&';

// ==========================================
// SUBCOMPONENTS & HOOKS
// ==========================================

// Text Scramble Component
function ScrambleHeading({ text, start = false }) {
  const spanRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!spanRef.current) return;
    if (prefersReducedMotion || !start) {
      spanRef.current.textContent = text;
      return;
    }

    let frameId;
    const startTime = performance.now();
    const chars = text.split('');
    const totalDuration = 0.25 + (chars.length - 1) * 0.022; // in seconds

    const update = (now) => {
      const elapsed = (now - startTime) / 1000;
      let allSettled = true;

      const output = chars
        .map((char, i) => {
          if (char === ' ' || /^[.,/#!$%^&*;:{}=\-_`~()]$/.test(char)) {
            return char;
          }
          const settleTime = 0.25 + i * 0.022;
          if (elapsed >= settleTime) {
            return char;
          }
          allSettled = false;
          return SCRAMBLE_CHARSET[Math.floor(Math.random() * SCRAMBLE_CHARSET.length)];
        })
        .join('');

      if (spanRef.current) {
        spanRef.current.textContent = output;
      }

      if (!allSettled && elapsed < totalDuration + 0.1) {
        frameId = setTimeout(() => requestAnimationFrame(update), 40);
      } else if (spanRef.current) {
        spanRef.current.textContent = text;
      }
    };

    frameId = requestAnimationFrame(update);
    return () => clearTimeout(frameId);
  }, [text, start, prefersReducedMotion]);

  return (
    <h3 className="tools-card-heading" aria-label={text}>
      <span ref={spanRef} aria-hidden="true">
        {text}
      </span>
    </h3>
  );
}

// Magnetic Button / Chip Hook
function useMagnetic(ref, radius = 90) {
  const prefersReducedMotion = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [arrowRot, setArrowRot] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion || typeof window === 'undefined') return;
    const el = ref.current;
    if (!el) return;

    let rect = null;
    const updateRect = () => {
      if (el) rect = el.getBoundingClientRect();
    };

    const handlePointerEnter = () => {
      updateRect();
    };

    const handlePointerMove = (e) => {
      if (window.matchMedia('(pointer: coarse)').matches) return;
      if (!rect) updateRect();
      if (!rect) return;

      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const d = Math.hypot(e.clientX - cx, e.clientY - cy);

        if (d < radius) {
          const s = 1 - d / radius;
          const ox = Math.min(Math.max((e.clientX - cx) * 0.35 * s, -10), 10);
          const oy = Math.min(Math.max((e.clientY - cy) * 0.35 * s, -10), 10);
          setOffset({ x: ox, y: oy });
          setArrowRot(d < radius / 2 ? 45 : 0);
        } else {
          setOffset({ x: 0, y: 0 });
          setArrowRot(0);
        }
      });
    };

    const handlePointerLeave = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      rect = null;
      setOffset({ x: 0, y: 0 });
      setArrowRot(0);
    };

    el.addEventListener('pointerenter', handlePointerEnter, { passive: true });
    el.addEventListener('pointermove', handlePointerMove, { passive: true });
    el.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      el.removeEventListener('pointerenter', handlePointerEnter);
      el.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [ref, radius, prefersReducedMotion]);

  return { offset, arrowRot };
}

// Magnetic CTA Anchor
function MagneticCTA({ href, text, isExternal }) {
  const btnRef = useRef(null);
  const { offset, arrowRot } = useMagnetic(btnRef, 90);

  return (
    <motion.a
      ref={btnRef}
      href={href}
      target={isExternal ? '_blank' : '_self'}
      rel={isExternal ? 'noopener noreferrer' : ''}
      className="tools-cta-btn"
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      <span>{text}</span>
      <motion.span
        className="tools-cta-arrow"
        animate={{ rotate: arrowRot }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        ↗
      </motion.span>
    </motion.a>
  );
}

// Magnetic Pathway Chip
function MagneticPathwayChip({ pathway, onHoverStart, onHoverEnd }) {
  const chipRef = useRef(null);
  const { offset, arrowRot } = useMagnetic(chipRef, 90);

  return (
    <motion.a
      ref={chipRef}
      href="https://path-forge-amber.vercel.app/"
      target="_blank"
      rel="noopener noreferrer"
      className="tools-pathway-chip"
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      <span>{pathway}</span>
      <motion.span
        style={{ display: 'inline-block' }}
        animate={{ rotate: arrowRot }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        ↗
      </motion.span>
    </motion.a>
  );
}

// ==========================================
// SHARED GLASS CARD WRAPPER
// ==========================================

function GlassCard({
  badgeNumber,
  badgeLabel,
  icon,
  heading,
  body,
  footerNote,
  actionText,
  actionHref,
  isExternal = false,
  spanClass = 'card-span-7',
  delay = 0,
  isLeft = true,
  children,
  onCardHoverChange
}) {
  const cardRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });

  // 3D Tilt Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  // Scroll Progress for Badge Ring
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start 0.85', 'center 0.5']
  });

  useEffect(() => {
    if (prefersReducedMotion) {
      if (cardRef.current) cardRef.current.style.setProperty('--p', '1');
      return;
    }
    const unsubscribe = scrollYProgress.on('change', (v) => {
      if (cardRef.current) {
        cardRef.current.style.setProperty('--p', String(Math.min(Math.max(v, 0), 1)));
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, prefersReducedMotion]);

  const cardMouseMoveRaf = useRef(null);
  const handleMouseMove = (e) => {
    if (prefersReducedMotion || !cardRef.current) return;
    if (cardMouseMoveRaf.current) return;
    const clientX = e.clientX;
    const clientY = e.clientY;
    cardMouseMoveRaf.current = requestAnimationFrame(() => {
      cardMouseMoveRaf.current = null;
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const px = (clientX - rect.left) / rect.width;
      const py = (clientY - rect.top) / rect.height;

      // Tilt (max 6deg)
      const rotY = (px - 0.5) * 2 * 6;
      const rotX = -(py - 0.5) * 2 * 6;
      x.set(rotY);
      y.set(rotX);

      // Cursor Glow vars
      cardRef.current.style.setProperty('--mx', `${clientX - rect.left}px`);
      cardRef.current.style.setProperty('--my', `${clientY - rect.top}px`);
    });
  };

  const handleMouseLeave = () => {
    if (cardMouseMoveRaf.current) {
      cancelAnimationFrame(cardMouseMoveRaf.current);
      cardMouseMoveRaf.current = null;
    }
    x.set(0);
    y.set(0);
    if (onCardHoverChange) onCardHoverChange(false);
  };

  const handleMouseEnter = () => {
    if (onCardHoverChange) onCardHoverChange(true);
  };

  return (
    <div className={`tools-card-wrapper ${spanClass}`}>
      <motion.div
        ref={cardRef}
        className="tools-card"
        initial={
          prefersReducedMotion
            ? { opacity: 1, y: 0, x: 0, filter: 'blur(0px)' }
            : {
                opacity: 0,
                y: 40,
                x: isLeft ? -30 : 30,
                filter: 'blur(8px)'
              }
        }
        animate={
          isInView || prefersReducedMotion
            ? {
                opacity: 1,
                y: 0,
                x: 0,
                filter: 'blur(0px)'
              }
            : {}
        }
        transition={{
          duration: 0.8,
          delay: prefersReducedMotion ? 0 : delay,
          ease: [0.22, 1, 0.36, 1]
        }}
        style={{
          rotateX: springY,
          rotateY: springX
        }}
        whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="tools-card-content">
          <div>
            {/* Header */}
            <div className="tools-card-top">
              <div className="tools-badge-group">
                <div className="tools-badge-container">
                  <div className="tools-badge-ring" />
                  <motion.div
                    className="tools-badge"
                    initial={prefersReducedMotion ? { scale: 1 } : { scale: 0 }}
                    animate={isInView || prefersReducedMotion ? { scale: 1 } : {}}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 18,
                      delay: prefersReducedMotion ? 0 : delay + 0.15
                    }}
                  >
                    {badgeNumber}
                  </motion.div>
                </div>
                <span className="tools-card-label">{badgeLabel}</span>
              </div>
              <div className="tools-icon-box">{icon}</div>
            </div>

            {/* Heading & Body */}
            <ScrambleHeading text={heading} start={isInView} />
            <p className="tools-card-body">{body}</p>

            {/* Custom Interactive Internals */}
            {children}
          </div>

          {/* Footer & CTA */}
          <div className="tools-card-bottom">
            <span className="tools-footer-note">{footerNote}</span>
            <MagneticCTA href={actionHref} text={actionText} isExternal={isExternal} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ==========================================
// CARD 1 INTERNALS: Resume Analyzer
// ==========================================

function Card1Internals({ inView, delay }) {
  const prefersReducedMotion = useReducedMotion();
  const [score, setScore] = useState(prefersReducedMotion ? 8 : 0);
  const [scanTop, setScanTop] = useState(0);
  const [scanOpacity, setScanOpacity] = useState(0);
  const boxRef = useRef(null);

  // Score Count-up
  useEffect(() => {
    if (prefersReducedMotion || !inView) return;
    const timer = setTimeout(() => {
      const startTime = performance.now();
      const duration = 1200; // 1.2s

      const step = (now) => {
        const t = Math.min((now - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        setScore(Math.round(8 * ease));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, (delay + 0.6) * 1000);

    return () => clearTimeout(timer);
  }, [inView, delay, prefersReducedMotion]);

  // Scan line animation
  useEffect(() => {
    if (prefersReducedMotion || !inView || !boxRef.current) return;
    const boxHeight = boxRef.current.offsetHeight || 180;
    const timer = setTimeout(() => {
      const startTime = performance.now();
      const duration = 1100; // 1.1s

      const step = (now) => {
        const p = Math.min((now - startTime) / duration, 1);
        setScanTop(p * boxHeight);

        // Opacity 0 -> 1 in first 15%, 1 -> 0 in last 15%
        if (p < 0.15) setScanOpacity(p / 0.15);
        else if (p > 0.85) setScanOpacity((1 - p) / 0.15);
        else setScanOpacity(1);

        if (p < 1) requestAnimationFrame(step);
        else setScanOpacity(0);
      };
      requestAnimationFrame(step);
    }, (delay + 0.5) * 1000);

    return () => clearTimeout(timer);
  }, [inView, delay, prefersReducedMotion]);

  return (
    <div ref={boxRef} className="tools-inner-box">
      {/* Scan Line */}
      {!prefersReducedMotion && (
        <div
          className="tools-scan-line"
          style={{ top: `${scanTop}px`, opacity: scanOpacity }}
          aria-hidden="true"
        />
      )}

      {/* Box Header */}
      <div className="tools-rubric-header">
        <span className="tools-rubric-title">SCORING RUBRIC (5 DIMENSIONS)</span>
        <span className="tools-rubric-score" aria-live="off">
          Score: {score} / 10
        </span>
      </div>

      {/* Rubric Rows */}
      <div className="tools-rubric-list">
        {RUBRIC_ROWS.map((rowLabel, idx) => (
          <RubricRow
            key={rowLabel}
            label={rowLabel}
            index={idx}
            inView={inView}
            cardDelay={delay}
          />
        ))}
      </div>
    </div>
  );
}

function RubricRow({ label, index, inView, cardDelay }) {
  const prefersReducedMotion = useReducedMotion();
  const [flickerText, setFlickerText] = useState('0 - 2 pts');

  useEffect(() => {
    if (prefersReducedMotion || !inView) return;
    const startDelay = (cardDelay + 0.6 + 0.1 * index) * 1000;
    let ticks = 0;
    let intervalId;

    const timer = setTimeout(() => {
      intervalId = setInterval(() => {
        ticks++;
        if (ticks >= 10) {
          clearInterval(intervalId);
          setFlickerText('0 - 2 pts');
        } else {
          const r1 = Math.floor(Math.random() * 10);
          const r2 = Math.floor(Math.random() * 10);
          setFlickerText(`${r1} - ${r2} pts`);
        }
      }, 60);
    }, startDelay);

    return () => {
      clearTimeout(timer);
      if (intervalId) clearInterval(intervalId);
    };
  }, [inView, index, cardDelay, prefersReducedMotion]);

  return (
    <motion.div
      className="tools-rubric-row"
      initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
      animate={inView || prefersReducedMotion ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.45,
        delay: prefersReducedMotion ? 0 : cardDelay + 0.4 + index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      <span>{label}</span>
      <span className="tools-rubric-pts" aria-live="off">
        {flickerText}
      </span>
    </motion.div>
  );
}

// ==========================================
// CARD 2 INTERNALS: Skill Gap Analyzer
// ==========================================

function Card2Internals({ inView, delay, isHovered }) {
  const prefersReducedMotion = useReducedMotion();
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedMatch, setDisplayedMatch] = useState(prefersReducedMotion ? 67 : 0);
  const [barScale, setBarScale] = useState(prefersReducedMotion ? 0.67 : 0);
  const [contentVisible, setContentVisible] = useState(true);

  const currentRole = ROLES_DATA[roleIndex];

  // Initial count-up and bar scale
  useEffect(() => {
    if (prefersReducedMotion || !inView) return;
    const timer = setTimeout(() => {
      const startTime = performance.now();
      const targetMatch = ROLES_DATA[0].match;

      const step = (now) => {
        const t = Math.min((now - startTime) / 1200, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        setDisplayedMatch(Math.round(targetMatch * ease));
        setBarScale((targetMatch / 100) * ease);
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, (delay + 0.6) * 1000);

    return () => clearTimeout(timer);
  }, [inView, delay, prefersReducedMotion]);

  // 5s Cycling
  useEffect(() => {
    if (prefersReducedMotion || !inView) return;

    let intervalId;
    const startCycleTimeout = setTimeout(() => {
      intervalId = setInterval(() => {
        if (isHovered || document.hidden) return;

        // Fade out
        setContentVisible(false);

        setTimeout(() => {
          setRoleIndex((prev) => {
            const nextIdx = (prev + 1) % ROLES_DATA.length;
            const nextMatch = ROLES_DATA[nextIdx].match;

            // Animate bar and count to new value
            const startVal = ROLES_DATA[prev].match;
            const startTime = performance.now();
            const step = (now) => {
              const t = Math.min((now - startTime) / 900, 1);
              const val = Math.round(startVal + (nextMatch - startVal) * t);
              setDisplayedMatch(val);
              setBarScale(val / 100);
              if (t < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);

            return nextIdx;
          });

          // Fade back in
          setContentVisible(true);
        }, 300);
      }, 5000);
    }, (delay + 2.4) * 1000);

    return () => {
      clearTimeout(startCycleTimeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, [inView, delay, isHovered, prefersReducedMotion]);

  return (
    <div className="tools-inner-box">
      <div className="tools-role-top">
        <motion.span
          className="tools-role-name"
          animate={{ opacity: contentVisible ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentRole.role}
        </motion.span>
        <span className="tools-role-match" aria-live="off">
          {displayedMatch}% Match
        </span>
      </div>

      {/* Progress Track */}
      <div className="tools-progress-track">
        <div
          className="tools-progress-fill"
          style={{ transform: `scaleX(${barScale})` }}
        />
      </div>

      {/* Chips */}
      <motion.div
        className="tools-chips-group"
        animate={{ opacity: contentVisible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {currentRole.have.map((skill, i) => (
          <motion.span
            key={`have-${skill}-${roleIndex}`}
            className="tools-chip tools-chip--have"
            initial={prefersReducedMotion ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 420,
              damping: 22,
              delay: prefersReducedMotion ? 0 : i * 0.1
            }}
          >
            + {skill}
          </motion.span>
        ))}

        {currentRole.missing.map((skill, i) => (
          <motion.span
            key={`missing-${skill}-${roleIndex}`}
            className="tools-chip tools-chip--missing"
            initial={prefersReducedMotion ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0 }}
            animate={
              prefersReducedMotion
                ? { scale: 1, opacity: 1 }
                : {
                    scale: 1,
                    opacity: 1,
                    x: [0, -3, 3, -2, 2, 0]
                  }
            }
            transition={{
              scale: { type: 'spring', stiffness: 420, damping: 22, delay: currentRole.have.length * 0.1 + i * 0.1 },
              x: { duration: 0.4, delay: currentRole.have.length * 0.1 + i * 0.1 + 0.2 }
            }}
          >
            - {skill}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}

// ==========================================
// CARD 3 INTERNALS: Cover Letter Generator
// ==========================================

function Card3Internals({ inView, delay, onTypingStatusChange }) {
  const prefersReducedMotion = useReducedMotion();
  const [letterIdx, setLetterIdx] = useState(0);
  const [typedChars, setTypedChars] = useState(prefersReducedMotion ? LETTERS_DATA[0].text.length : 0);
  const [isTyping, setIsTyping] = useState(false);
  const [isBoxHovered, setIsBoxHovered] = useState(false);

  // Copy state & burst
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveFillWidth, setSaveFillWidth] = useState(0);

  const currentLetter = LETTERS_DATA[letterIdx];
  const textRef = useRef(null);

  // Live word count
  const displayedWords = useMemo(() => {
    if (prefersReducedMotion) return currentLetter.words;
    const ratio = currentLetter.text.length > 0 ? typedChars / currentLetter.text.length : 0;
    return Math.round(currentLetter.words * ratio);
  }, [typedChars, currentLetter, prefersReducedMotion]);

  // Typewriter Loop
  useEffect(() => {
    if (prefersReducedMotion || !inView) {
      if (textRef.current) textRef.current.textContent = LETTERS_DATA[0].text;
      return;
    }

    let active = true;
    let timeoutId;

    const runTypewriter = () => {
      const fullText = LETTERS_DATA[letterIdx].text;
      let charPos = 0;
      setIsTyping(true);
      if (onTypingStatusChange) onTypingStatusChange(true);

      const typeNextChar = () => {
        if (!active) return;
        if (isBoxHovered || document.hidden) {
          timeoutId = setTimeout(typeNextChar, 200);
          return;
        }

        if (charPos <= fullText.length) {
          const currentSlice = fullText.slice(0, charPos);
          if (textRef.current) textRef.current.textContent = currentSlice;
          setTypedChars(charPos);

          const lastChar = fullText[charPos - 1];
          let wait = 24 + (Math.random() * 16 - 8); // 24ms +/- 8ms
          if (lastChar === '.') wait += 120;
          if (lastChar === ',') wait += 60;

          charPos++;
          timeoutId = setTimeout(typeNextChar, wait);
        } else {
          // Finished typing -> hold 2.5s -> backspace
          setIsTyping(false);
          if (onTypingStatusChange) onTypingStatusChange(false);

          timeoutId = setTimeout(() => {
            let backPos = fullText.length;
            const backspace = () => {
              if (!active) return;
              if (isBoxHovered || document.hidden) {
                timeoutId = setTimeout(backspace, 200);
                return;
              }

              if (backPos >= 0) {
                if (textRef.current) textRef.current.textContent = fullText.slice(0, backPos);
                setTypedChars(backPos);
                backPos -= 2; // quick backspace at ~6ms/char
                timeoutId = setTimeout(backspace, 12);
              } else {
                setLetterIdx((prev) => (prev + 1) % LETTERS_DATA.length);
              }
            };
            backspace();
          }, 2500);
        }
      };

      typeNextChar();
    };

    const initialDelay = setTimeout(runTypewriter, (delay + 0.8) * 1000);

    return () => {
      active = false;
      clearTimeout(initialDelay);
      clearTimeout(timeoutId);
      if (onTypingStatusChange) onTypingStatusChange(false);
    };
  }, [inView, delay, letterIdx, isBoxHovered, prefersReducedMotion, onTypingStatusChange]);

  // Copy button handler
  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentLetter.text);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  // Export PDF handler
  const handleExport = () => {
    setSaveFillWidth(1);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setSaveFillWidth(0);
    }, 1600);
  };

  return (
    <div
      className="tools-inner-box"
      onMouseEnter={() => setIsBoxHovered(true)}
      onMouseLeave={() => setIsBoxHovered(false)}
    >
      {/* Letter Header */}
      <div className="tools-letter-header">
        <motion.span
          key={currentLetter.company}
          className="tools-letter-target"
          initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Target: {currentLetter.company} · {currentLetter.role}
        </motion.span>
        <span className="tools-letter-words" aria-live="off">
          {displayedWords} words
        </span>
      </div>

      {/* Typed Text Box */}
      <div className="tools-letter-text-box">
        <span ref={textRef}>
          {prefersReducedMotion ? currentLetter.text : ''}
        </span>
        <span className={`tools-letter-caret ${isTyping ? 'typing' : 'idle'}`} />
      </div>

      {/* Buttons Footer */}
      <div className="tools-letter-footer">
        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          className="tools-btn-small"
          aria-label="Copy letter text"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                style={{ display: 'inline-flex' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </motion.span>
            ) : (
              <motion.span key="copy" style={{ display: 'inline-flex' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </motion.span>
            )}
          </AnimatePresence>
          <span>{copied ? 'Copied!' : 'Copy text'}</span>

          {/* Burst Dots */}
          {copied && !prefersReducedMotion && (
            <>
              {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                <motion.span
                  key={deg}
                  className="tools-burst-dot"
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: Math.cos((deg * Math.PI) / 180) * 24,
                    y: Math.sin((deg * Math.PI) / 180) * 24,
                    opacity: 0
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              ))}
            </>
          )}
        </button>

        {/* Export PDF Button */}
        <button
          type="button"
          onClick={handleExport}
          className="tools-btn-small"
          aria-label="Export to PDF"
        >
          <motion.div
            className="tools-btn-fill"
            animate={{ scaleX: saveFillWidth }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
          />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span style={{ position: 'relative', zIndex: 1 }}>
            {saved ? 'Saved ✓' : 'Export PDF'}
          </span>
        </button>
      </div>
    </div>
  );
}

// ==========================================
// CARD 4 INTERNALS: Roadmap Provider
// ==========================================

function Card4Internals({ inView, delay, isChipHovered, setIsChipHovered }) {
  const prefersReducedMotion = useReducedMotion();
  const pathRef = useRef(null);
  const [pathLength, setPathLength] = useState(600);
  const [pathDrawn, setPathDrawn] = useState(prefersReducedMotion);
  const [activeTraveler, setActiveTraveler] = useState(false);

  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      if (len > 0) setPathLength(len);
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !inView) return;
    const drawTimer = setTimeout(() => {
      setPathDrawn(true);
    }, (delay + 0.8) * 1000);

    const travelerTimer = setTimeout(() => {
      setActiveTraveler(true);
    }, (delay + 2.4) * 1000);

    return () => {
      clearTimeout(drawTimer);
      clearTimeout(travelerTimer);
    };
  }, [inView, delay, prefersReducedMotion]);

  return (
    <div>
      {/* Available Pathways Panel */}
      <div className="tools-pathways-panel">
        <span className="tools-pathways-label">AVAILABLE PATHWAYS ON PATHFORGE:</span>
        <div className="tools-pathways-list">
          {PATHWAYS.map((p) => (
            <MagneticPathwayChip
              key={p}
              pathway={p}
              onHoverStart={() => setIsChipHovered(true)}
              onHoverEnd={() => setIsChipHovered(false)}
            />
          ))}
        </div>
      </div>

      {/* Learning Path S-Curve SVG */}
      <svg
        className="tools-learning-path-svg"
        viewBox="0 0 600 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Dashed background track */}
        <path
          d={S_CURVE_PATH}
          stroke="#F5EEDC"
          strokeWidth="2"
          strokeDasharray="4 4"
          opacity="0.15"
        />

        {/* Animated drawing path */}
        <motion.path
          ref={pathRef}
          d={S_CURVE_PATH}
          className={`tools-path-line ${isChipHovered ? 'bright' : ''}`}
          stroke="var(--tools-heading)"
          strokeWidth="2"
          initial={
            prefersReducedMotion
              ? { strokeDashoffset: 0 }
              : { strokeDasharray: pathLength, strokeDashoffset: pathLength }
          }
          animate={
            pathDrawn || prefersReducedMotion
              ? { strokeDashoffset: 0 }
              : { strokeDashoffset: pathLength }
          }
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* 4 Nodes / Milestones in vermilion */}
        {PATH_NODES.map((node) => (
          <g key={node.label}>
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="6"
              fill="var(--tools-bg)"
              stroke="#E8553D"
              strokeWidth="2"
              initial={prefersReducedMotion ? { scale: 1 } : { scale: 0 }}
              animate={
                pathDrawn || prefersReducedMotion
                  ? { scale: [1, 1.4, 1] }
                  : { scale: 0 }
              }
              transition={{
                delay: prefersReducedMotion ? 0 : delay + 0.8 + node.f * 1.6,
                duration: 0.6
              }}
            />
            <motion.text
              x={node.x}
              y={node.y > 60 ? node.y + 20 : node.y - 12}
              textAnchor="middle"
              fill="var(--tools-subtitle)"
              fontSize="11"
              fontFamily="JetBrains Mono, monospace"
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={pathDrawn || prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
              transition={{
                delay: prefersReducedMotion ? 0 : delay + 0.8 + node.f * 1.6 + 0.2,
                duration: 0.4
              }}
            >
              {node.label}
            </motion.text>
          </g>
        ))}

        {/* Traveler dot along the S-curve in vermilion */}
        {activeTraveler && !prefersReducedMotion && (
          <motion.circle
            r="4"
            fill="#E8553D"
            style={{
              offsetPath: `path("${S_CURVE_PATH}")`,
              filter: 'drop-shadow(0 0 4px rgba(232, 85, 61, 0.4))'
            }}
            animate={{ offsetDistance: ['0%', '100%'] }}
            transition={{
              duration: 3,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatDelay: 1
            }}
          />
        )}
      </svg>
    </div>
  );
}

// ==========================================
// MAIN TOOLS SECTION COMPONENT
// ==========================================

export default function ToolsSection() {
  const sectionRef = useRef(null);
  const row2Ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Header entrance in-view trigger (starts when 25% in view)
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.25 });

  // Hover states for inter-card animations
  const [card2Hovered, setCard2Hovered] = useState(false);
  const [isTypingActive, setIsTypingActive] = useState(false);
  const [card4Hovered, setCard4Hovered] = useState(false);
  const [isChipHovered, setIsChipHovered] = useState(false);

  // Parallax with GSAP ScrollTrigger
  useLayoutEffect(() => {
    if (prefersReducedMotion || typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Background blobs parallax
      gsap.to('.tools-blob--a', {
        y: -60,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });

      gsap.to('.tools-blob--b', {
        y: 40,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });

      gsap.to('.tools-blob--c', {
        y: -30,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });

      // Row 2 Depth Parallax
      if (row2Ref.current) {
        gsap.fromTo(
          row2Ref.current,
          { y: 40 },
          {
            y: -10,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Words for heading reveal
  const headingWords = ['Four', 'focused', 'tools.', 'One', 'transparent', 'workflow.'];

  return (
    <section id="tools" ref={sectionRef} className="tools-section">
      <div className="tools-container">
        {/* Header */}
        <header ref={headerRef} className="tools-header">
          {/* Eyebrow */}
          <motion.span
            className="tools-eyebrow"
            initial={prefersReducedMotion ? { opacity: 1, letterSpacing: '0.08em' } : { opacity: 0, letterSpacing: '0.35em' }}
            animate={isHeaderInView || prefersReducedMotion ? { opacity: 1, letterSpacing: '0.08em' } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            THE FOUR TOOLS
          </motion.span>

          {/* Heading */}
          <h2 className="tools-heading">
            {headingWords.map((word, i) => {
              const isHighlight = i >= 3;
              return (
                <span key={word} className="tools-heading-word-wrap">
                  <motion.span
                    className={`tools-heading-word ${isHighlight ? 'tools-highlight-text' : ''}`}
                    initial={prefersReducedMotion ? { y: 0 } : { y: '110%' }}
                    animate={isHeaderInView || prefersReducedMotion ? { y: '0%' } : {}}
                    transition={{
                      duration: 0.6,
                      delay: prefersReducedMotion ? 0 : 0.15 + i * 0.07,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  >
                    {word}
                  </motion.span>
                </span>
              );
            })}
          </h2>

          {/* Subtitle */}
          <motion.p
            className="tools-subtitle"
            initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            animate={isHeaderInView || prefersReducedMotion ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: prefersReducedMotion ? 0 : 1.0, ease: [0.22, 1, 0.36, 1] }}
          >
            Every tool operates on real text, concrete rubrics, and zero artificial hype.
          </motion.p>
        </header>

        {/* Bento Grid */}
        <div className="tools-grid">
          {/* ROW 1: Card 1 (span 7) & Card 2 (span 5) */}
          <GlassCard
            badgeNumber="1"
            badgeLabel="Resume Analyzer"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <motion.line
                  x1="16" y1="13" x2="8" y2="13"
                  initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
                  animate={isHeaderInView || prefersReducedMotion ? { pathLength: 1 } : {}}
                  transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 1.2 + 0.4 }}
                />
                <motion.line
                  x1="16" y1="17" x2="8" y2="17"
                  initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
                  animate={isHeaderInView || prefersReducedMotion ? { pathLength: 1 } : {}}
                  transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 1.2 + 0.52 }}
                />
                <motion.line
                  x1="10" y1="9" x2="8" y2="9"
                  initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
                  animate={isHeaderInView || prefersReducedMotion ? { pathLength: 1 } : {}}
                  transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 1.2 + 0.64 }}
                />
              </svg>
            }
            heading="ATS scoring on a strict five-part rubric."
            body="Upload your resume in PDF, DOCX, or TXT. An evaluation rubric scores five specific dimensions out of two points each, summing to a transparent score out of 10."
            footerNote="Immediate scoring · Line-by-line feedback"
            actionText="Open tool"
            actionHref="/resume-analyzer"
            spanClass="card-span-7"
            delay={1.20}
            isLeft={true}
          >
            <Card1Internals inView={isHeaderInView} delay={1.20} />
          </GlassCard>

          <GlassCard
            badgeNumber="2"
            badgeLabel="Skill Gap Analyzer"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <motion.circle
                  cx="12" cy="12" r="6"
                  animate={prefersReducedMotion ? {} : { scale: [1, 1.15, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
                <circle cx="12" cy="12" r="2" />
              </svg>
            }
            heading="Target role comparison and readiness index."
            body="Select your target role. Compare your extracted resume skills against expected requirements to see what you match and what you need to learn next."
            footerNote="8 technical & product tracks"
            actionText="Compare skills"
            actionHref="/skill-gap"
            spanClass="card-span-5"
            delay={1.35}
            isLeft={false}
            onCardHoverChange={setCard2Hovered}
          >
            <Card2Internals inView={isHeaderInView} delay={1.35} isHovered={card2Hovered} />
          </GlassCard>

          {/* ROW 2: Card 3 (span 5) & Card 4 (span 7) wrapped for GSAP Parallax */}
          <div ref={row2Ref} className="tools-row-2-wrapper">
            <GlassCard
              badgeNumber="3"
              badgeLabel="Cover Letter Generator"
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <motion.g
                    animate={isTypingActive && !prefersReducedMotion ? { rotate: [-8, 8, -8] } : { rotate: 0 }}
                    transition={{ duration: 0.15, repeat: Infinity }}
                    style={{ transformOrigin: '18px 2px' }}
                  >
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </motion.g>
                </svg>
              }
              heading="Grounded in your actual work history."
              body="Provide a target company, role title, and job description. InternIQ produces a concise 250 to 400 word letter referencing your verified background, ready to edit, copy, or export to PDF."
              footerNote="Factually tailored · No fluff"
              actionText="Draft letter"
              actionHref="/cover-letter"
              spanClass="card-span-5"
              delay={0}
              isLeft={true}
            >
              <Card3Internals inView={isHeaderInView} delay={0} onTypingStatusChange={setIsTypingActive} />
            </GlassCard>

            <GlassCard
              badgeNumber="4"
              badgeLabel="Roadmap Provider"
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <motion.g
                    initial={prefersReducedMotion ? { rotate: 45 } : { rotate: 0 }}
                    animate={
                      prefersReducedMotion
                        ? { rotate: 45 }
                        : card4Hovered
                        ? { rotate: [45, 33, 57, 45] }
                        : { rotate: 45 }
                    }
                    transition={
                      card4Hovered
                        ? { duration: 0.8, ease: 'easeInOut' }
                        : { type: 'spring', stiffness: 60, damping: 8, delay: 0.3 }
                    }
                    style={{ transformOrigin: '12px 12px' }}
                  >
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                  </motion.g>
                </svg>
              }
              heading="Curated learning paths on PathForge."
              body="When you identify a skill gap, jump directly to structured, community-tested roadmaps across modern engineering and data disciplines without searching blindly."
              footerNote="External learning companion"
              actionText="Explore PathForge"
              actionHref="https://path-forge-amber.vercel.app/"
              isExternal={true}
              spanClass="card-span-7"
              delay={0.15}
              isLeft={false}
              onCardHoverChange={setCard4Hovered}
            >
              <Card4Internals
                inView={isHeaderInView}
                delay={0.15}
                isChipHovered={isChipHovered}
                setIsChipHovered={setIsChipHovered}
              />
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
