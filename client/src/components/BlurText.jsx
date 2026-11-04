'use client';

import React, { useRef, useEffect, useState } from 'react';
import './BlurText.css';

export default function BlurText({
  text = '',
  delay = 120, // ms per word
  className = '',
  animateBy = 'words', // 'words' | 'letters'
  direction = 'top', // 'top' | 'bottom'
  threshold = 0.2,
  rootMargin = '0px',
  onAnimationComplete,
  start = false // optional controlled trigger
}) {
  const containerRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (start) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, start]);

  const units = animateBy === 'letters' ? text.split('') : text.split(' ');

  useEffect(() => {
    if (inView && onAnimationComplete) {
      const totalTime = delay * (units.length - 1) + 600;
      const timer = setTimeout(onAnimationComplete, totalTime);
      return () => clearTimeout(timer);
    }
  }, [inView, delay, units.length, onAnimationComplete]);

  return (
    <span ref={containerRef} className={`blur-text-wrap ${className}`}>
      {units.map((unit, index) => (
        <span
          key={index}
          className={`blur-text-unit ${inView ? 'is-visible' : ''} dir-${direction}`}
          style={{
            transitionDelay: `${index * delay}ms`,
            transitionDuration: '0.6s'
          }}
        >
          {unit}
          {animateBy === 'words' && index < units.length - 1 && '\u00A0'}
        </span>
      ))}
    </span>
  );
}

