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

    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 1.5) : 1;

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
      const { startY, endX } = props;
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

    const getMaxActiveCrowd = (width) => {
      if (width < 640) return 22;   // Mobile: clean and lightweight
      if (width < 1024) return 40;  // Tablet
      if (width < 1440) return 65;  // Laptop: dense crowd with no gaps
      return 82;                    // Desktop / PC: full lively crowd
    };

    let maxActiveCrowd = 65;

    const initCrowd = () => {
      while (crowd.length < maxActiveCrowd && availablePeeps.length) {
        const p = addPeepToCrowd();
        if (p?.walk) p.walk.progress(Math.random());
      }
    };

    const addPeepToCrowd = () => {
      if (!availablePeeps.length) return null;
      const peep = removeRandomFromArray(availablePeeps);
      const walk = getRandomFromArray(walks)({
        peep,
        props: resetPeep({
          peep,
          stage,
        }),
      }).eventCallback('onComplete', () => {
        removePeepFromCrowd(peep);
        if (crowd.length < maxActiveCrowd) {
          addPeepToCrowd();
        }
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

      maxActiveCrowd = getMaxActiveCrowd(stage.width);

      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });

      crowd.length = 0;
      availablePeeps.length = 0;
      availablePeeps.push(...allPeeps);

      initCrowd();
    };

    let isTickerActive = false;
    const startTicker = () => {
      if (!isTickerActive) {
        isTickerActive = true;
        gsap.ticker.add(render);
        crowd.forEach((peep) => {
          peep.walk?.resume();
        });
      }
    };

    const stopTicker = () => {
      if (isTickerActive) {
        isTickerActive = false;
        gsap.ticker.remove(render);
        crowd.forEach((peep) => {
          peep.walk?.pause();
        });
      }
    };

    let observer = null;
    const init = () => {
      createPeeps();
      resize();
      startTicker();

      if (typeof IntersectionObserver !== 'undefined' && canvas) {
        observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              startTicker();
            } else {
              stopTicker();
            }
          },
          { threshold: 0.05 }
        );
        observer.observe(canvas);
      }
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
      observer?.disconnect();
      stopTicker();
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
      className="relative z-10 h-screen w-full max-w-full overflow-hidden bg-[#FAF8F4] dark:bg-[#0A121F] text-[#0A121F] dark:text-[#F5EEDC] border-none select-none transition-colors"
    >
      {/* Walking Crowd Canvas: spans full width and 85vh height */}
      <div className="absolute inset-x-0 bottom-0 h-[82vh] sm:h-[86vh] w-full overflow-hidden pointer-events-none">
        <CrowdCanvas src="/images/peeps/all-peeps.png" rows={15} cols={7} className="dark:invert dark:opacity-85" />

        {/* ATS Scan Beam & Line (Animates down on scroll) */}
        <div className="scan-wrap pointer-events-none absolute inset-x-0 will-change-transform z-15">
          {/* Vermilion scanner gradient trail */}
          <div className="h-28 w-full bg-gradient-to-t from-[#E8553D]/20 via-[#E8553D]/05 to-transparent" />
          {/* Laser scan line */}
          <div className="relative h-[2px] w-full bg-[#E8553D] shadow-[0_0_18px_2px_rgba(232,85,61,0.5)] flex items-center justify-end px-3 sm:px-8">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-bold tracking-wider text-[#FAF8F4] bg-[#0A121F] border border-[#1E2C46] -translate-y-3.5 sm:-translate-y-4 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8553D] animate-ping" />
              ATS SCANNER ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* Story Card Overlay positioned safely below sticky navbar and horizontally centered */}
      <div className="pointer-events-none absolute inset-x-0 top-24 sm:top-28 z-20 flex flex-col items-center px-4 sm:px-6">
        <div className="relative w-full max-w-xl sm:max-w-2xl min-h-[160px] sm:min-h-[175px] flex items-center justify-center">

          {/* Beat 1 */}
          <div className="beat beat-1 absolute inset-0 flex flex-col items-center justify-center text-center bg-white/95 dark:bg-[#0F1724]/95 backdrop-blur-md border border-[#E4E0D8] dark:border-[#1E2C46] rounded-2xl px-6 py-5 shadow-sm">
            <span className="eyebrow text-[#5A6578] dark:text-[#8E9BB0] bg-[#F3EFE6] dark:bg-[#17233A] border border-[#E4E0D8] dark:border-[#1E2C46] px-2.5 py-0.5 rounded-full mb-2">
              THE APPLICANT POOL
            </span>
            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-semibold tracking-[-0.03em] text-[#0A121F] dark:text-[#F5EEDC] leading-tight">
              Every opening gets hundreds of applications.
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#5A6578] dark:text-[#8E9BB0] mt-1.5 font-normal">
              A massive sea of candidates compete for every single position.
            </p>
          </div>

          {/* Beat 2 */}
          <div className="beat beat-2 absolute inset-0 flex flex-col items-center justify-center text-center bg-white/95 dark:bg-[#0F1724]/95 backdrop-blur-md border border-[#E4E0D8] dark:border-[#1E2C46] rounded-2xl px-6 py-5 shadow-sm">
            <span className="eyebrow text-[#5A6578] dark:text-[#8E9BB0] bg-[#F3EFE6] dark:bg-[#17233A] border border-[#E4E0D8] dark:border-[#1E2C46] px-2.5 py-0.5 rounded-full mb-2">
              AUTOMATED FILTERING
            </span>
            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-semibold tracking-[-0.03em] text-[#0A121F] dark:text-[#F5EEDC] leading-tight">
              Most are filtered out before a human reads a word.
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#5A6578] dark:text-[#8E9BB0] mt-1.5 font-normal">
              75% of resumes are rejected by ATS algorithms before reaching a recruiter.
            </p>
          </div>

          {/* Beat 3 */}
          <div className="beat beat-3 absolute inset-0 flex flex-col items-center justify-center text-center bg-white/95 dark:bg-[#0F1724]/95 backdrop-blur-md border border-[#E4E0D8] dark:border-[#1E2C46] rounded-2xl px-6 py-5 shadow-sm">
            <span className="eyebrow text-[#5A6578] dark:text-[#8E9BB0] bg-[#F3EFE6] dark:bg-[#17233A] border border-[#E4E0D8] dark:border-[#1E2C46] px-2.5 py-0.5 rounded-full mb-1.5">
              THE SOLUTION
            </span>
            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-semibold tracking-[-0.03em] text-[#0A121F] dark:text-[#F5EEDC] leading-tight">
              Be one of the few who get shortlisted.
            </h2>
            {onCta && (
              <button
                type="button"
                onClick={onCta}
                className="pointer-events-auto mt-3.5 inline-flex items-center justify-center px-6 py-2.5 text-xs sm:text-sm font-semibold text-[#101A2B] bg-[#E8553D] hover:bg-[#D4452E] rounded-full transition-colors cursor-pointer shadow-sm"
              >
                Analyze my resume
              </button>
            )}
          </div>

        </div>

        {/* Floating Scroll Indicator directly below the card */}
        <div className="scroll-hint pointer-events-none mt-4 sm:mt-5 flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/95 dark:bg-[#0F1724]/95 backdrop-blur-md border border-[#E4E0D8] dark:border-[#1E2C46] shadow-xs text-xs font-medium text-[#0A121F] dark:text-[#F5EEDC]">
          <div className="w-3.5 h-5 rounded-full border border-[#E4E0D8] dark:border-[#1E2C46] flex items-start justify-center p-0.5">
            <div className="w-1 h-1.5 rounded-full bg-[#E8553D] animate-bounce" />
          </div>
          <span className="text-[#5A6578] dark:text-[#8E9BB0]">Scroll down to continue</span>
          <span className="text-[#E8553D] font-bold animate-bounce text-sm">↓</span>
        </div>
      </div>

      {/* Bottom subtle indicator across the walking crowd */}
      <div className="scroll-hint pointer-events-none absolute bottom-6 inset-x-0 z-20 flex justify-center px-4">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 dark:bg-[#0F1724]/85 backdrop-blur-md border border-[#E4E0D8] dark:border-[#1E2C46] shadow-xs text-xs text-[#5A6578] dark:text-[#8E9BB0]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E8553D] animate-ping" />
          <span>Scroll to explore the applicant story</span>
          <span className="text-[#E8553D] font-bold animate-bounce text-sm">↓</span>
        </div>
      </div>
    </section>
  );
}

export { CrowdCanvas, CrowdStory };
