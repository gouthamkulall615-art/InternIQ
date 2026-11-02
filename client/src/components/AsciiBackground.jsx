import { useMemo } from 'react';
import GradientASCII from './GradientASCII/GradientASCII';
import { useTheme } from '../contexts/ThemeContext';

export default function AsciiBackground({
  shape = 'horizon',
  className = '',
  cellSize = 18,
  density = 0.8,
  glyphOpacity = 0.85,
  flow = 0.5,
  speed = 1,
  grain,
  glow,
  gradientOpacity,
  colors,
  ...props
}) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const hasWebGL2 = useMemo(() => {
    if (typeof document === 'undefined') return false;
    try {
      return !!document.createElement('canvas').getContext('webgl2');
    } catch {
      return false;
    }
  }, []);

  if (!hasWebGL2) {
    return (
      <div
        className={`fixed inset-0 z-0 pointer-events-none transition-colors duration-300 ${
          isLight ? 'bg-[#f4f1ea]' : 'bg-[#030712]'
        } ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={`fixed inset-0 z-0 pointer-events-none transition-colors duration-300 ${
        isLight ? 'bg-[#f4f1ea]' : 'bg-[#030712]'
      } ${className}`}
      aria-hidden="true"
    >
      <GradientASCII
        shape={shape}
        lightMode={isLight}
        cellSize={cellSize}
        density={density}
        glyphOpacity={glyphOpacity}
        flow={flow}
        speed={speed}
        grain={grain}
        glow={glow}
        gradientOpacity={gradientOpacity}
        colors={colors}
        mouseInteraction
        clickEffect="wave"
        intro
        className="!border-0 !rounded-none"
        style={{ width: '100%', height: '100%' }}
        {...props}
      />
    </div>
  );
}

