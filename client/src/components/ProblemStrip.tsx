import React from 'react';
import AnimatedContent from './AnimatedContent';
import DecryptedText from './DecryptedText';

export interface ProblemItem {
  number: string;
  tag: string;
  label: string;
  headline: string;
  description: string;
}

export const PROBLEMS: readonly ProblemItem[] = [
  {
    number: '01',
    tag: 'PARSING FILTERS',
    label: '01 / PARSING FILTERS',
    headline: 'Resumes get filtered before humans read them.',
    description:
      'Applicant tracking systems discard candidates for multi-column tables, unparsed text boxes, and missing standard headers. Qualified candidates get dropped automatically.'
  },
  {
    number: '02',
    tag: 'UNCLEAR BENCHMARKS',
    label: '02 / UNCLEAR BENCHMARKS',
    headline: "Students don't know what roles expect.",
    description:
      'Job postings list dozens of overlapping technologies. Without an objective baseline, candidates cannot separate core prerequisites from optional preferences.'
  },
  {
    number: '03',
    tag: 'BOILERPLATE DRAFTS',
    label: '03 / BOILERPLATE DRAFTS',
    headline: 'Cover letters sound generic.',
    description:
      'Using ungrounded generic templates yields letters that say nothing specific about actual candidate projects. Hiring managers discard them within seconds.'
  }
] as const;

export default function ProblemStrip(): React.JSX.Element {
  return (
    <section
      aria-label="Core application problems"
      className="bg-[#F9F8F4] dark:bg-[#0B0D17] border-b border-[#E4E0D8] dark:border-[#1E233A] py-14 sm:py-16 md:py-20 transition-colors"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col divide-y divide-[#E4E0D8] dark:divide-[#1E233A] md:divide-y-0 md:grid md:grid-cols-3 md:divide-x md:divide-[#E4E0D8] md:dark:divide-[#1E233A]">
          {PROBLEMS.map((item, index) => (
            <div
              key={item.label}
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
                {/* Monospace Decrypted Label */}
                <div className="font-editorial-mono text-xs uppercase tracking-wider text-[#6B7280] dark:text-[#7E88A8]">
                  <DecryptedText
                    text={item.label}
                    animateOn="view"
                    sequential={true}
                    speed={40}
                    maxIterations={10}
                    characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/ "
                    className="text-[#6B7280] dark:text-[#7E88A8]"
                    encryptedClassName="text-[#6B7280]/60 dark:text-[#7E88A8]/60"
                  />
                </div>

                {/* Static Semibold Heading (~20px) */}
                <h3 className="font-editorial-sans text-[20px] font-semibold text-[#14161F] dark:text-[#F1F3F9] leading-snug tracking-tight mt-3 mb-2.5">
                  {item.headline}
                </h3>

                {/* Static Body (1.6 line-height, muted gray) */}
                <p className="text-sm sm:text-[15px] text-[#5A5D6B] dark:text-[#9AA3BF] leading-[1.6]">
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
