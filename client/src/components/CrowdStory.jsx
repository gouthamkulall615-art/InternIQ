import { useLayoutEffect, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/* ------------------------------------------------------------------ *
 * CONFIG: everything you will want to tune lives here.
 * ------------------------------------------------------------------ */

// Put your clean crowd file in client/public/ (SVG or high-res PNG/WebP).
const CROWD_SRC = '/crowd.png';
const CROWD_W = 1422; // natural width of YOUR image, used only for aspect ratio
const CROWD_H = 657;  // natural height of crowded ppl.png

// The people who "get shortlisted", as % of the image (x from left, y from top).
// Turn DEBUG_PICKS on, click a face, read the console, paste the numbers here.
// Keep them between x = 30 and 70 so they stay visible on phones (the image is cropped sideways there).
const PICKS = [
  { x: 41.5, y: 42 }, // person in the turban
  { x: 58, y: 43 },   // person with the eyepatch
  { x: 49, y: 70 },   // person with sunglasses, lower centre
];
const DEBUG_PICKS = false;

// Sizes as a fraction of the image width, so they scale with the screen.
const HOLE = 0.043; // radius of the sharp area around each pick
const RING = 0.085; // diameter of the indigo ring

// Image box: always covers the screen while keeping its aspect ratio,
// so the PICKS percentages always land on the same faces.
const ASPECT = CROWD_W / CROWD_H;
const BOX_W = `max(100vw, ${(ASPECT * 100).toFixed(2)}vh)`;

const HEADING = 'font-heading';

const holes = PICKS.map(
  (p) =>
    `radial-gradient(circle calc(${BOX_W} * ${HOLE}) at ${p.x}% ${p.y}%, transparent 96%, #000 100%)`
).join(',');

/* ------------------------------------------------------------------ */

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

          // Reduced motion: no pin, no scrub. Show the end state.
          if (reduce) {
            gsap.set('.wash', { opacity: 0.92 });
            gsap.set('.pick', { scale: 1, autoAlpha: 1 });
            gsap.set('.beat-3', { autoAlpha: 1, y: 0 });
            return;
          }

          gsap.set('.crowd', { scale: 1.6, transformOrigin: '50% 60%' });
          gsap.set('.beat', { autoAlpha: 0, y: 24 });
          gsap.set('.pick', { scale: 0, autoAlpha: 0 });
          gsap.set('.scan', { autoAlpha: 0, top: '0%' });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: mobile ? '+=2200' : '+=3000',
              scrub: 0.6,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          tl
            // 1. Pull back from a few faces to the whole crowd
            .to('.crowd', { scale: 1, duration: 2.5, ease: 'power2.out' })
            .to('.beat-1', { autoAlpha: 1, y: 0, duration: 0.8 }, '<0.8')

            // 2. ATS scan sweeps down
            .to('.beat-1', { autoAlpha: 0, y: -24, duration: 0.6 }, '+=0.8')
            .to('.scan', { autoAlpha: 1, duration: 0.1 }, '<')
            .to('.scan', { top: '100%', duration: 2, ease: 'none' }, '<')
            .to('.beat-2', { autoAlpha: 1, y: 0, duration: 0.8 }, '<0.4')

            // 3. Everyone washes out except the picks
            .to('.wash', { opacity: 0.92, duration: 1.5 }, '-=0.9')
            .to('.scan', { autoAlpha: 0, duration: 0.3 }, '<')
            .to('.pick', {
              scale: 1,
              autoAlpha: 1,
              stagger: 0.25,
              duration: 0.6,
              ease: 'back.out(2)',
            })
            .to('.beat-2', { autoAlpha: 0, y: -24, duration: 0.6 }, '+=0.6')

            // 4. CTA
            .to('.beat-3', { autoAlpha: 1, y: 0, duration: 0.8 });
        }
      );
    }, root);

    // Pin spacing depends on fonts and the image being loaded.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, []);

  const logPick = (e) => {
    if (!DEBUG_PICKS) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (((e.clientX - r.left) / r.width) * 100).toFixed(1);
    const y = (((e.clientY - r.top) / r.height) * 100).toFixed(1);
    // eslint-disable-next-line no-console
    console.log(`{ x: ${x}, y: ${y} },`);
  };

  return (
    <section
      ref={root}
      aria-label="Most applicants never reach a human reader"
      className="relative z-10 h-screen overflow-hidden bg-[#FAF8F4] dark:bg-[#0B0D17]"
    >
      <p className="sr-only">
        Hundreds of people apply to every opening. Most resumes are filtered out
        by software before a person reads them. Only a few are shortlisted.
        Analyze your resume to be one of them.
      </p>

      {/* Crowd: sized to cover the screen, centred, aspect ratio locked */}
      <div
        className="crowd absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform"
        style={{ width: BOX_W, aspectRatio: `${CROWD_W} / ${CROWD_H}` }}
      >
        <div className="relative h-full w-full" onClick={logPick}>
          <img
            src={CROWD_SRC}
            alt=""
            aria-hidden="true"
            draggable={false}
            onLoad={() => ScrollTrigger.refresh()}
            className="block h-full w-full select-none dark:invert"
          />

          {/* Wash-out: page-coloured veil with a clear hole over each pick */}
          <div
            className="wash pointer-events-none absolute inset-0 bg-[#FAF8F4] opacity-0 dark:bg-[#0B0D17]"
            style={{
              WebkitMaskImage: holes,
              maskImage: holes,
              WebkitMaskComposite: 'source-in',
              maskComposite: 'intersect',
            }}
          />

          {/* Rings and tags on the shortlisted */}
          {PICKS.map((p, i) => (
            <div
              key={i}
              className="pick pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <div
                className="rounded-full border-2 border-[#4F46E5] dark:border-[#818CF8]"
                style={{
                  width: `calc(${BOX_W} * ${RING})`,
                  height: `calc(${BOX_W} * ${RING})`,
                }}
              />
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#4F46E5] px-2.5 py-0.5 font-mono text-[11px] text-white dark:bg-[#818CF8] dark:text-[#0B0D17]">
                Shortlisted
              </span>
            </div>
          ))}

          {/* ATS scan line */}
          <div className="scan pointer-events-none absolute inset-x-0 h-[2px] bg-[#38BDF8] shadow-[0_0_24px_4px_rgba(56,189,248,0.65)] will-change-transform" />
        </div>
      </div>

      {/* Story cards: solid backing so text stays legible over the line art */}
      <div className="pointer-events-none absolute inset-x-0 top-[7%] z-20 flex justify-center px-4">
        <div className="relative w-full max-w-3xl">
          <Card className="beat beat-1 invisible">
            <h2 className={`${HEADING} text-3xl font-semibold leading-[1.1] tracking-[-0.02em] md:text-5xl`}>
              Every opening gets hundreds of applications.
            </h2>
          </Card>

          <Card className="beat beat-2 invisible">
            <h2 className={`${HEADING} text-3xl font-semibold leading-[1.1] tracking-[-0.02em] md:text-5xl`}>
              Most are filtered out before a human reads a word.
            </h2>
          </Card>

          <Card className="beat beat-3 invisible">
            <h2 className={`${HEADING} text-3xl font-semibold leading-[1.1] tracking-[-0.02em] md:text-5xl`}>
              Be one of the few.
            </h2>
            <button
              type="button"
              onClick={onCta}
              className="pointer-events-auto mt-5 rounded-full bg-[#4F46E5] px-7 py-3 text-base font-medium text-white transition hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4F46E5] dark:bg-[#818CF8] dark:text-[#0B0D17] dark:focus-visible:outline-[#818CF8] cursor-pointer"
            >
              Analyze my resume
            </button>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Card({ className = '', children }) {
  return (
    <div
      className={`absolute inset-x-0 top-0 rounded-2xl border border-[#E4E0D8] bg-[#FAF8F4] px-6 py-6 text-center text-[#14161F] dark:border-[#1E233A] dark:bg-[#0B0D17] dark:text-[#F1F3F9] md:px-10 ${className}`}
    >
      {children}
    </div>
  );
}
