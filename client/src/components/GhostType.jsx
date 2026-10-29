import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * GhostType Component
 * Emulates modern IDE / Copilot autocomplete "ghost text" with a blinking cursor
 * and an interactive [Tab] badge.
 *
 * Cycles through completions:
 * 1. 'typing': Types ghost characters in faint gray with cursor at prefix.
 * 2. 'suggested': Full ghost completion shown with [Tab] badge for 2.2s.
 * 3. 'accepted': Text turns solid ink with cursor at the end for 2.4s.
 * 4. 'deleting': Smooth backspacing back to base prefix.
 * 5. Cycles to next completion string.
 *
 * Also allows user to press Tab key or click [Tab] to accept immediately.
 */
export default function GhostType({
  text = 'Fix your resume',
  completions = [
    ' before they see it.',
    ' before you apply.',
    ' before it\'s rejected.',
  ],
  typingSpeed = 40,
  deletingSpeed = 22,
  suggestedDelay = 2200,
  acceptedDelay = 2400,
  className = '',
}) {
  const [completionIndex, setCompletionIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState('typing'); // 'typing' | 'suggested' | 'accepted' | 'deleting'
  const containerRef = useRef(null);

  const currentCompletion = completions[completionIndex] || '';

  // Instantly accept the ghost completion
  const handleAccept = useCallback(() => {
    if (phase === 'typing' || phase === 'suggested') {
      setCharIndex(currentCompletion.length);
      setPhase('accepted');
    }
  }, [phase, currentCompletion.length]);

  // Keyboard shortcut listener for Tab key
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if (e.key === 'Tab' && (phase === 'typing' || phase === 'suggested')) {
        e.preventDefault();
        handleAccept();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAccept, phase]);

  // Main animation lifecycle
  useEffect(() => {
    let timer;

    if (phase === 'typing') {
      if (charIndex < currentCompletion.length) {
        timer = setTimeout(() => {
          setCharIndex((prev) => prev + 1);
        }, typingSpeed);
      } else {
        // Full ghost suggestion reached -> pause in suggested state
        setPhase('suggested');
      }
    } else if (phase === 'suggested') {
      timer = setTimeout(() => {
        setPhase('accepted');
      }, suggestedDelay);
    } else if (phase === 'accepted') {
      timer = setTimeout(() => {
        setPhase('deleting');
      }, acceptedDelay);
    } else if (phase === 'deleting') {
      if (charIndex > 0) {
        timer = setTimeout(() => {
          setCharIndex((prev) => prev - 1);
        }, deletingSpeed);
      } else {
        // Back to 0 -> next completion
        setCompletionIndex((prev) => (prev + 1) % completions.length);
        setPhase('typing');
      }
    }

    return () => clearTimeout(timer);
  }, [
    charIndex,
    phase,
    currentCompletion.length,
    completions.length,
    typingSpeed,
    deletingSpeed,
    suggestedDelay,
    acceptedDelay,
  ]);

  const displayedText = currentCompletion.slice(0, charIndex);
  const isAccepted = phase === 'accepted';
  const isDeleting = phase === 'deleting';
  const showTabBadge = (phase === 'typing' || phase === 'suggested') && charIndex >= 5;

  return (
    <h1
      ref={containerRef}
      className={`font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[3.75rem] xl:text-[4.25rem] font-semibold tracking-[-0.02em] text-white leading-[1.14] sm:leading-[1.1] min-h-[2.8em] sm:min-h-[2.4em] lg:min-h-[2.3em] select-text ${className}`}
    >
      {/* Base permanent text in Bricolage Grotesque */}
      <span className="font-heading font-semibold tracking-[-0.02em] text-white pr-1">
        {text}
      </span>

      {/* Cursor between base and ghost text during typing / suggested */}
      {!isAccepted && !isDeleting && (
        <span
          aria-hidden="true"
          className="inline-block w-[3.5px] sm:w-[4px] h-[0.88em] bg-[#38BDF8] mx-1 align-baseline rounded-[1px] animate-pulse shadow-[0_0_12px_rgba(56,189,248,0.8)]"
        />
      )}

      {/* Completion text in Poppins (ghost color if typing/suggested, solid ink if accepted/deleting) */}
      <span
        className={`whitespace-pre-wrap font-poppins font-medium transition-colors duration-200 ${
          isAccepted || isDeleting
            ? 'text-white'
            : 'text-slate-400 select-none'
        }`}
      >
        {displayedText}
      </span>

      {/* Cursor at the end during accepted and deleting phases */}
      {(isAccepted || isDeleting) && (
        <span
          aria-hidden="true"
          className="inline-block w-[3.5px] sm:w-[4px] h-[0.88em] bg-[#4F46E5] dark:bg-[#38BDF8] ml-1 align-baseline rounded-[1px] animate-pulse shadow-[0_0_8px_rgba(79,70,229,0.5)] dark:shadow-[0_0_12px_rgba(56,189,248,0.8)]"
        />
      )}

      {/* Interactive [Tab] badge */}
      {showTabBadge && (
        <button
          type="button"
          onClick={handleAccept}
          title="Press Tab or click to complete"
          className="inline-flex items-center justify-center ml-2.5 px-2.5 py-0.5 align-middle text-[11px] font-editorial-mono font-medium tracking-normal rounded-[4px] shadow-xs transition-all cursor-pointer select-none -translate-y-0.5 hover:scale-105 active:scale-95 text-slate-800 dark:text-sky-200 bg-slate-200/90 dark:bg-sky-500/20 border border-slate-300 dark:border-sky-400/30 hover:bg-[#4F46E5] hover:text-white dark:hover:bg-sky-500 dark:hover:text-white"
        >
          Tab
        </button>
      )}
    </h1>
  );
}
