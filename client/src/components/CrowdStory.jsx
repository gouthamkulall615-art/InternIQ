'use client';

import { useLayoutEffect, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * CrowdCanvas Component
 * Animated canvas simulation of Open Peeps characters walking across the screen horizontally.
 * Adapted from Szenia Zadvornykh (https://codepen.io/zadvorsky/pen/xxwbBQV)
 * Illustrations by Pablo Stanley (https://www.openpeeps.com/)
 */
const CrowdCanvas = ({ src = '/images/peeps/all-peeps.png', rows = 15, cols = 7, className = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const config = {
      src,
      rows,
      cols,
    };

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

    // UTILS
    const randomRange = (min, max) => min + Math.random() * (max - min);
    const randomIndex = (array) => randomRange(0, array.length) | 0;
    const removeFromArray = (array, i) => array.splice(i, 1)[0];
    const removeItemFromArray = (array, item) => removeFromArray(array, array.indexOf(item));
    const removeRandomFromArray = (array) => removeFromArray(array, randomIndex(array));
    const getRandomFromArray = (array) => array[randomIndex(array) | 0];

    // TWEEN FACTORIES
    const resetPeep = ({ stage, peep }) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const offsetY = 100 - 250 * gsap.parseEase('power2.in')(Math.random());
      const startY = stage.height - peep.height + offsetY;
      let startX;
      let endX;

      if (direction === 1) {
        startX = -peep.width;
        endX = stage.width;
        peep.scaleX = 1;
      } else {
        startX = stage.width + peep.width;
        endX = 0;
        peep.scaleX = -1;
      }

      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;

      return {
        startX,
        startY,
        endX,
      };
    };

    const normalWalk = ({ peep, props }) => {
      const { startX, startY, endX } = props;
      const xDuration = 10;
      const yDuration = 0.25;

      const tl = gsap.timeline();
      tl.timeScale(randomRange(0.5, 1.5));
      tl.to(
        peep,
        {
          duration: xDuration,
          x: endX,
          ease: 'none',
        },
        0,
      );
      tl.to(
        peep,
        {
          duration: yDuration,
          repeat: xDuration / yDuration,
          yoyo: true,
          y: startY - 10,
        },
        0,
      );

      return tl;
    };

    const walks = [normalWalk];

    // FACTORY FUNCTIONS
    const createPeep = ({ image, rect }) => {
      const peep = {
        image,
        rect: [],
        width: 0,
        height: 0,
        drawArgs: [],
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        walk: null,
        setRect: (rect) => {
          peep.rect = rect;
          peep.width = rect[2];
          peep.height = rect[3];
          peep.drawArgs = [peep.image, ...rect, 0, 0, peep.width, peep.height];
        },
        render: (ctx) => {
          ctx.save();
          ctx.translate(peep.x, peep.y);
          ctx.scale(peep.scaleX, 1);
          ctx.drawImage(
            peep.image,
            peep.rect[0],
            peep.rect[1],
            peep.rect[2],
            peep.rect[3],
            0,
            0,
            peep.width,
            peep.height,
          );
          ctx.restore();
        },
      };

      peep.setRect(rect);
      return peep;
    };

    // MAIN
    const img = new Image();
    const stage = {
      width: 0,
      height: 0,
    };

    const allPeeps = [];
    const availablePeeps = [];
    const crowd = [];

    const createPeeps = () => {
      const { rows, cols } = config;
      const { naturalWidth: width, naturalHeight: height } = img;
      const total = rows * cols;
      const rectWidth = width / rows;
      const rectHeight = height / cols;

      for (let i = 0; i < total; i++) {
        allPeeps.push(
          createPeep({
            image: img,
            rect: [
              (i % rows) * rectWidth,
              ((i / rows) | 0) * rectHeight,
              rectWidth,
              rectHeight,
            ],
          }),
        );
      }
    };

    const initCrowd = () => {
      while (availablePeeps.length) {
        addPeepToCrowd().walk.progress(Math.random());
      }
    };

    const addPeepToCrowd = () => {
      const peep = removeRandomFromArray(availablePeeps);
      const walk = getRandomFromArray(walks)({
        peep,
        props: resetPeep({
          peep,
          stage,
        }),
      }).eventCallback('onComplete', () => {
        removePeepFromCrowd(peep);
        addPeepToCrowd();
      });

      peep.walk = walk;

      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);

      return peep;
    };

    const removePeepFromCrowd = (peep) => {
      removeItemFromArray(crowd, peep);
      availablePeeps.push(peep);
    };

    const render = () => {
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      crowd.forEach((peep) => {
        peep.render(ctx);
      });

      ctx.restore();
    };

    const resize = () => {
      if (!canvas) return;
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      canvas.width = stage.width * dpr;
      canvas.height = stage.height * dpr;

      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });

      crowd.length = 0;
      availablePeeps.length = 0;
      availablePeeps.push(...allPeeps);

      initCrowd();
    };

    const init = () => {
      createPeeps();
      resize();
      gsap.ticker.add(render);
    };

    img.onload = init;
    img.src = config.src;
    if (img.complete && img.naturalWidth) {
      init();
    }

    const handleResize = () => resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      gsap.ticker.remove(render);
      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });
    };
  }, [src, rows, cols]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-x-0 bottom-0 h-full w-full pointer-events-none select-none ${className}`}
    />
  );
};

export default function CrowdStory({ onCta }) {
  const root = useRef(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: '(min-width: 768px)',
          mobile: '(max-width: 767px)',
          reduce: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { mobile, reduce } = context.conditions;

          if (reduce) {
            gsap.set('.beat-1, .beat-2, .scroll-hint', { display: 'none' });
            gsap.set('.beat-3', { autoAlpha: 1, y: 0 });
            return;
          }

          // Initial state for scroll beats
          gsap.set('.beat', { autoAlpha: 0, y: 20 });
          gsap.set('.beat-1', { autoAlpha: 1, y: 0 });
          gsap.set('.scroll-hint', { autoAlpha: 1, y: 0 });
          gsap.set('.scan-wrap', { autoAlpha: 0, top: '14%' });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: mobile ? '+=1800' : '+=2600',
              scrub: 0.6,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          tl
            // Pause on Beat 1 so user can read initial state
            .to({}, { duration: 0.9 })

            // Beat 1 fades out, scan sweeps down, Beat 2 fades in
            .to('.beat-1', { autoAlpha: 0, y: -20, duration: 0.6 })
            .to('.scan-wrap', { autoAlpha: 1, duration: 0.2 }, '<')
            .to('.scan-wrap', { top: '88%', duration: 2.2, ease: 'none' }, '<')
            .to('.beat-2', { autoAlpha: 1, y: 0, duration: 0.7 }, '<0.3')

            // Pause on Beat 2
            .to({}, { duration: 0.8 })

            // Scanner fades, Beat 2 fades out, Beat 3 (CTA) fades in, scroll hints fade out
            .to('.scan-wrap', { autoAlpha: 0, duration: 0.4 })
            .to('.beat-2', { autoAlpha: 0, y: -20, duration: 0.6 }, '<')
            .to('.beat-3', { autoAlpha: 1, y: 0, duration: 0.8 }, '<0.2')
            .to('.scroll-hint', { autoAlpha: 0, duration: 0.4 }, '<')
            .to({}, { duration: 0.8 });
        }
      );
    }, root);

    document.fonts?.ready?.then(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      aria-label="Most applicants never reach a human reader"
      className="relative z-10 h-screen w-full overflow-hidden bg-[#FAF8F4] dark:bg-[#0B0D17] text-[#14161F] dark:text-[#F1F3F9] border-none select-none transition-colors"
    >
      {/* Walking Crowd Canvas: spans full width and 85vh height */}
      <div className="absolute inset-x-0 bottom-0 h-[82vh] sm:h-[86vh] w-full overflow-hidden pointer-events-none">
        <CrowdCanvas src="/images/peeps/all-peeps.png" rows={15} cols={7} className="dark:invert dark:opacity-85" />

        {/* ATS Scan Beam & Line (Animates down on scroll) */}
        <div className="scan-wrap pointer-events-none absolute inset-x-0 will-change-transform z-15">
          {/* Cyan/sky scanner gradient trail */}
          <div className="h-28 w-full bg-gradient-to-t from-sky-400/25 via-sky-400/10 to-transparent" />
          {/* Glowing laser scan line */}
          <div className="relative h-[2.5px] w-full bg-[#0284c7] shadow-[0_0_20px_3px_rgba(2,132,199,0.7)] flex items-center justify-end px-4 sm:px-8">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider text-white bg-sky-600/90 shadow-xs -translate-y-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
              ATS SCANNER ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* Story Card Overlay positioned safely below sticky navbar and horizontally centered */}
      <div className="pointer-events-none absolute inset-x-0 top-24 sm:top-28 z-20 flex flex-col items-center px-4 sm:px-6">
        <div className="relative w-full max-w-xl sm:max-w-2xl min-h-[160px] sm:min-h-[175px] flex items-center justify-center">

          {/* Beat 1 */}
          <div className="beat beat-1 absolute inset-0 flex flex-col items-center justify-center text-center bg-white/95 dark:bg-[#131626]/95 backdrop-blur-md border border-[#E4E0D8] dark:border-[#1E233A] rounded-2xl px-6 py-5 shadow-lg shadow-black/5 dark:shadow-black/20">
            <span className="text-[11px] font-sans font-semibold uppercase tracking-widest text-[#4F46E5] dark:text-[#818CF8] bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/60 px-2.5 py-0.5 rounded-full mb-2">
              THE APPLICANT POOL
            </span>
            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-[#14161F] dark:text-[#F1F3F9] leading-tight">
              Every opening gets hundreds of applications.
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#5A5D6B] dark:text-[#9AA3BF] mt-1.5 font-normal">
              A massive sea of candidates compete for every single position.
            </p>
          </div>

          {/* Beat 2 */}
          <div className="beat beat-2 absolute inset-0 flex flex-col items-center justify-center text-center bg-white/95 dark:bg-[#131626]/95 backdrop-blur-md border border-sky-200 dark:border-sky-800/60 rounded-2xl px-6 py-5 shadow-lg shadow-sky-500/10 dark:shadow-sky-950/30">
            <span className="text-[11px] font-sans font-semibold uppercase tracking-widest text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800/60 px-2.5 py-0.5 rounded-full mb-2">
              AUTOMATED FILTERING
            </span>
            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-[#14161F] dark:text-[#F1F3F9] leading-tight">
              Most are filtered out before a human reads a word.
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#5A5D6B] dark:text-[#9AA3BF] mt-1.5 font-normal">
              75% of resumes are rejected by ATS algorithms before reaching a recruiter.
            </p>
          </div>

          {/* Beat 3 */}
          <div className="beat beat-3 absolute inset-0 flex flex-col items-center justify-center text-center bg-white/95 dark:bg-[#131626]/95 backdrop-blur-md border border-indigo-200 dark:border-indigo-800/60 rounded-2xl px-6 py-5 shadow-xl shadow-indigo-500/10 dark:shadow-indigo-950/30">
            <span className="text-[11px] font-sans font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-full mb-1.5">
              THE SOLUTION
            </span>
            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-[#14161F] dark:text-[#F1F3F9] leading-tight">
              Be one of the few who get shortlisted.
            </h2>
            {onCta && (
              <button
                type="button"
                onClick={onCta}
                className="pointer-events-auto mt-3.5 inline-flex items-center justify-center px-6 py-2.5 text-xs sm:text-sm font-medium text-white bg-[#1e3fd8] hover:bg-[#2563eb] rounded-full transition-all hover:shadow-lg hover:shadow-blue-500/30 cursor-pointer shadow-md"
              >
                Analyze my resume
              </button>
            )}
          </div>

        </div>

        {/* Floating Scroll Indicator directly below the card */}
        <div className="scroll-hint pointer-events-none mt-4 sm:mt-5 flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/95 dark:bg-[#131626]/95 backdrop-blur-md border border-[#E4E0D8] dark:border-[#1E233A] shadow-md text-xs font-medium text-[#14161F] dark:text-[#F1F3F9]">
          <div className="w-3.5 h-5 rounded-full border border-indigo-600 dark:border-indigo-400 flex items-start justify-center p-0.5">
            <div className="w-1 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-bounce" />
          </div>
          <span>Scroll down to continue</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-bold animate-bounce text-sm">↓</span>
        </div>
      </div>

      {/* Bottom subtle indicator across the walking crowd */}
      <div className="scroll-hint pointer-events-none absolute bottom-6 inset-x-0 z-20 flex justify-center px-4">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 dark:bg-[#131626]/85 backdrop-blur-md border border-[#E4E0D8]/80 dark:border-white/10 shadow-xs text-xs text-[#5A5D6B] dark:text-[#9AA3BF]">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
          <span>Scroll to explore the applicant story</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-bold animate-bounce text-sm">↓</span>
        </div>
      </div>
    </section>
  );
}

export { CrowdCanvas, CrowdStory };
