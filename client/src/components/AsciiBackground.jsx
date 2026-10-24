import { useMemo } from 'react';
import GradientASCII from './GradientASCII/GradientASCII';

const COLORS = ['#1e3fd8', '#f6f8ff', '#a5d8ff', '#38bdf8'];

export default function AsciiBackground({ shape = 'horizon', className = '' }) {
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
        className={`fixed inset-0 z-0 pointer-events-none bg-[#030712] ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className={`fixed inset-0 z-0 pointer-events-none bg-[#030712] ${className}`} aria-hidden="true">
      <GradientASCII
        shape={shape}
        colors={COLORS}
        lightMode={false}
        cellSize={18}
        density={0.8}
        glyphOpacity={0.85}
        glow={0.3}
        gradientOpacity={0}
        flow={0.5}
        speed={1}
        grain={0.08}
        mouseInteraction
        clickEffect="wave"
        intro
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
