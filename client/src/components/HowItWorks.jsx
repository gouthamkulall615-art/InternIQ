'use client';

import React, { useRef, useState, useEffect } from 'react';
import ShinyText from './ShinyText';
import BlurText from './BlurText';
import SpotlightCard from './SpotlightCard';
import CountUp from './CountUp';
import Magnet from './Magnet';
import ClickSpark from './ClickSpark';
import { useTheme } from '../contexts/ThemeContext';
import './HowItWorks.css';

const STEPS = [
  {
    number: 1,
    label: 'Step 1',
    title: 'Upload your resume',
    body: 'Drop your PDF, Word document, or plain text file. Text is parsed directly in your browser with zero manual re-typing required.'
  },
  {
    number: 2,
    label: 'Step 2',
    title: 'See your score and skills',
    body: 'Get your ATS rating broken down across the five rubric dimensions. Review line-level recommendations and catalog your extracted skillset.'
  },
  {
    number: 3,
    label: 'Step 3',
    title: 'Close the gap and apply',
    body: 'Check missing requirements against your target role, generate a tailored cover letter, and download an ATS-compliant resume template.'
  }
];

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  const { theme } = useTheme();

  // Trigger intro animation when section is 30% in view (once: true)
  useEffect(() => {
    const el = sectionRef.current;
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

  const isDark = theme === 'dark';

  return (
    <ClickSpark sparkColor="#E8553D" sparkCount={8} sparkSize={10} sparkRadius={18}>
      <section
        id="how-it-works"
        ref={sectionRef}
        aria-labelledby="how-it-works-heading"
        className={`how-it-works-section ${inView ? 'is-active' : ''}`}
      >
        <div className="how-container">
          {/* Header */}
          <header className="how-header">
            {/* Eyebrow (0.00s fade in 0.5s) */}
            <div
              className="how-eyebrow-wrap"
              style={{
                transitionDelay: '0s',
                transitionDuration: '0.5s'
              }}
            >
              <span className="how-eyebrow">
                <ShinyText text="PROCESS" speed={3.8} color="#E8553D" />
              </span>
            </div>

            {/* Heading (0.10s, 120ms per word BlurText) */}
            <h2 id="how-it-works-heading" className="how-heading">
              <BlurText
                text="How it works"
                delay={120}
                animateBy="words"
                direction="top"
                start={inView}
              />
            </h2>

            {/* Subtitle (0.60s, opacity 0->1, y 16->0, duration 0.6s) */}
            <p
              className="how-subtitle"
              style={{
                transitionDelay: '0.60s',
                transitionDuration: '0.6s'
              }}
            >
              Three straightforward steps from raw resume to targeted application.
            </p>
          </header>

          {/* Steps Ordered List */}
          <ol className="how-grid">
            {STEPS.map((step, idx) => {
              // Timeline base time: b = 0.9 + 0.9 * idx
              const b = 0.9 + 0.9 * idx;
              const cardDelay = `${b}s`;
              const badgeDelay = `${b + 0.15}s`;
              const connectorDelay = `${b + 0.35}s`;
              const labelDelay = `${b + 0.55}s`;
              const titleDelay = `${b + 0.55 + 0.08}s`;
              const bodyDelay = `${b + 0.55 + 0.16}s`;
              const dotDelay = `${3.6 + idx * 1.2}s`;
              const isLast = idx === STEPS.length - 1;

              return (
                <li key={step.number} className="how-step-wrapper">
                  {/* Spotlight Card */}
                  <SpotlightCard
                    className="how-card"
                    spotlightColor="rgba(232, 85, 61, 0.08)"
                    spotlightSize={280}
                    intensity={0.25}
                    theme={isDark ? "dark" : "light"}
                    style={{
                      transitionDelay: cardDelay
                    }}
                  >
                    {/* Badge Row */}
                    <div className="how-badge-row">
                      <Magnet
                        padding={60}
                        magnetStrength={3.5}
                        maxOffset={6}
                        tilt={0}
                        scale={1.02}
                      >
                        <div
                          className="how-badge"
                          style={{
                            transitionDelay: badgeDelay
                          }}
                        >
                          <CountUp
                            to={step.number}
                            from={0}
                            duration={0.8}
                            delay={b + 0.15}
                            startWhen={inView}
                          />
                        </div>
                      </Magnet>
                    </div>

                    {/* Step Content */}
                    <span
                      className="how-step-label"
                      style={{
                        transitionDelay: labelDelay
                      }}
                    >
                      {step.label}
                    </span>

                    <h3
                      className="how-step-title"
                      style={{
                        transitionDelay: titleDelay
                      }}
                    >
                      {step.title}
                    </h3>

                    <p
                      className="how-step-body"
                      style={{
                        transitionDelay: bodyDelay
                      }}
                    >
                      {step.body}
                    </p>
                  </SpotlightCard>

                  {/* Horizontal Connector Line (Desktop - placed on the wrapper) */}
                  <div className={`how-connector ${isLast ? 'is-last' : ''}`} aria-hidden="true">
                    <div
                      className="how-connector-line"
                      style={{
                        transitionDelay: connectorDelay
                      }}
                    >
                      {/* Traveling Dot (loops after intro at 3.6s + idx * 1.2s) */}
                      <span
                        className="how-travel-dot"
                        style={{
                          animationDelay: dotDelay
                        }}
                      />
                    </div>
                  </div>

                  {/* Vertical Connector Line (Mobile / Tablet < 900px) */}
                  <div className={`how-connector-vertical ${isLast ? 'is-last' : ''}`} aria-hidden="true">
                    <div
                      className="how-connector-vertical-line"
                      style={{
                        transitionDelay: connectorDelay
                      }}
                    >
                      <span
                        className="how-travel-dot-v"
                        style={{
                          animationDelay: dotDelay
                        }}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </ClickSpark>
  );
}

