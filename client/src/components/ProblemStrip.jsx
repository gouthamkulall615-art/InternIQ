import AnimatedContent from './AnimatedContent';

/**
 * @typedef {Object} ProblemItem
 * @property {string} number
 * @property {string} title
 * @property {string} headline
 * @property {string} description
 */

/** @type {ProblemItem[]} */
export const PROBLEMS = [
  {
    number: '1',
    title: 'Parsing filters',
    headline: 'Resumes get filtered before humans read them.',
    description:
      'Applicant tracking systems discard candidates for multi-column tables, unparsed text boxes, and missing standard headers. Qualified candidates get dropped automatically.'
  },
  {
    number: '2',
    title: 'Unclear benchmarks',
    headline: "Students don't know what roles expect.",
    description:
      'Job postings list dozens of overlapping technologies. Without an objective baseline, candidates cannot separate core prerequisites from optional preferences.'
  },
  {
    number: '3',
    title: 'Boilerplate drafts',
    headline: 'Cover letters sound generic.',
    description:
      'Using ungrounded generic templates yields letters that say nothing specific about actual candidate projects. Hiring managers discard them within seconds.'
  }
];

export default function ProblemStrip() {
  return (
    <section
      aria-label="Core application problems"
      className="bg-[#F9F8F4] dark:bg-[#0B0D17] border-b border-[#E4E0D8] dark:border-[#1E233A] py-14 sm:py-16 md:py-20 transition-colors"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col divide-y divide-[#E4E0D8] dark:divide-[#1E233A] md:divide-y-0 md:grid md:grid-cols-3 md:divide-x md:divide-[#E4E0D8] md:dark:divide-[#1E233A]">
          {PROBLEMS.map((item, index) => (
            <div
              key={item.number}
              className="py-8 first:pt-0 last:pb-0 md:py-0 md:px-8 md:first:pl-0 md:last:pr-0"
            >
              <AnimatedContent
                distance={24}
                direction="vertical"
                duration={0.8}
                delay={index * 0.12}
                trigger="scroll"
                once={true}
                threshold={0.15}
                ease="power3.out"
                className="flex flex-col h-full"
              >
                {/* 28px rounded-md number badge + sentence-case Inter 500, 13px label */}
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="w-7 h-7 rounded-md bg-[#EEF2FF] dark:bg-[#1C2035] text-[#4F46E5] dark:text-[#818CF8] flex items-center justify-center text-xs font-semibold border border-[#E0E7FF] dark:border-[#282F4E] flex-shrink-0">
                    {item.number}
                  </span>
                  <span className="font-sans font-medium text-[13px] text-[#475569] dark:text-[#94A3B8]">
                    {item.title}
                  </span>
                </div>

                {/* Heading: Bricolage Grotesque (600-700), -0.02em tracking */}
                <h3 className="font-heading text-[20px] font-semibold text-[#14161F] dark:text-[#F1F3F9] leading-snug tracking-[-0.02em] mb-2.5">
                  {item.headline}
                </h3>

                {/* Body: Inter 400/500, 1.6 line-height */}
                <p className="font-sans text-sm sm:text-[15px] text-[#5A5D6B] dark:text-[#9AA3BF] leading-[1.6]">
                  {item.description}
                </p>
              </AnimatedContent>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
