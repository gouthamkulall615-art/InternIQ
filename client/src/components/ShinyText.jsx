'use client';

import React from 'react';
import './ShinyText.css';

export default function ShinyText({
  text,
  disabled = false,
  speed = 4,
  className = '',
  color = '#E8553D',
  shineColor = '#ffffff'
}) {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`shiny-text ${disabled ? 'disabled' : ''} ${className}`}
      style={{
        animationDuration,
        ['--st-color']: color,
        ['--st-shine']: shineColor
      }}
    >
      {text}
    </span>
  );
}

