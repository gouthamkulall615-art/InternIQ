'use client';

import React, { useRef, useEffect, useCallback } from 'react';

export default function ClickSpark({
  sparkColor = '#818cf8',
  sparkSize = 10,
  sparkRadius = 18,
  sparkCount = 8,
  duration = 450,
  easing = 'ease-out',
  extraScale = 1.0,
  children,
  className = '',
  style
}) {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);
  const animIdRef = useRef(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const now = performance.now();
    const activeSparks = [];

    for (let i = 0; i < sparksRef.current.length; i++) {
      const s = sparksRef.current[i];
      const elapsed = now - s.startTime;
      if (elapsed < s.duration) {
        const progress = elapsed / s.duration;
        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentDistance = s.radius * ease * extraScale;
        const currentLength = s.size * (1 - progress);

        const x1 = s.x + Math.cos(s.angle) * currentDistance;
        const y1 = s.y + Math.sin(s.angle) * currentDistance;
        const x2 = s.x + Math.cos(s.angle) * (currentDistance + currentLength);
        const y2 = s.y + Math.sin(s.angle) * (currentDistance + currentLength);

        ctx.save();
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.globalAlpha = Math.max(0, 1 - progress);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();

        activeSparks.push(s);
      }
    }

    sparksRef.current = activeSparks;
    if (activeSparks.length > 0) {
      animIdRef.current = requestAnimationFrame(draw);
    } else {
      animIdRef.current = null;
    }
  }, [extraScale]);

  const handleClick = (e) => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = performance.now();

    for (let i = 0; i < sparkCount; i++) {
      const angle = (2 * Math.PI * i) / sparkCount + (Math.random() - 0.5) * 0.35;
      sparksRef.current.push({
        x,
        y,
        angle,
        startTime: now,
        duration: duration + (Math.random() - 0.5) * 80,
        size: sparkSize * (0.8 + Math.random() * 0.4),
        radius: sparkRadius * (0.8 + Math.random() * 0.4),
        color: sparkColor
      });
    }

    if (!animIdRef.current) {
      animIdRef.current = requestAnimationFrame(draw);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);

    return () => {
      ro.disconnect();
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    };
  }, []);

  return (
    <div
      onClick={handleClick}
      className={`click-spark-container ${className}`}
      style={{ position: 'relative', width: '100%', ...style }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 99
        }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}

