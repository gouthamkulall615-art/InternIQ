import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Target, PenLine, Map, ArrowUpRight, Copy, Check, FileDown } from 'lucide-react';
import SpotlightCard from './SpotlightCard';
import CountUp from './CountUp';
import TextType from './TextType';
import Magnet from './Magnet';
import AnimatedContent from './AnimatedContent';
import { useTheme } from '../contexts/ThemeContext';

export interface ToolCardData {
  id: string;
  tag: string;
  title: string;
  headline: string;
  description: string;
  footerNote: string;
  actionText: string;
  actionHref: string;
  isExternal?: boolean;
}

export const TOOLS_DATA: readonly ToolCardData[] = [
  {
    id: 'resume-analyzer',
    tag: '01 / RESUME ANALYZER',
    title: 'Resume Analyzer',
    headline: 'ATS scoring on a strict five-part rubric.',
    description:
      'Upload your resume in PDF, DOCX, or TXT. An evaluation rubric scores five specific dimensions out of two points each, summing to a transparent score out of 10.',
    footerNote: 'Immediate scoring · Line-by-line feedback',
    actionText: 'Open tool',
    actionHref: '/resume-analyzer'
  },
  {
    id: 'skill-gap',
    tag: '02 / SKILL GAP ANALYZER',
    title: 'Skill Gap Analyzer',
    headline: 'Target role comparison and readiness index.',
    description:
      'Select your target role. Compare your extracted resume skills against expected requirements to see what you match and what you need to learn next.',
    footerNote: '8 technical & product tracks',
    actionText: 'Compare skills',
    actionHref: '/skill-gap'
  },
  {
    id: 'cover-letter',
    tag: '03 / COVER LETTER GENERATOR',
    title: 'Cover Letter Generator',
    headline: 'Grounded in your actual work history.',
    description:
      'Provide a target company, role title, and job description. InternIQ produces a concise 250 to 400 word letter referencing your verified background, ready to edit, copy, or export to PDF.',
    footerNote: 'Factually tailored · No fluff',
    actionText: 'Draft letter',
    actionHref: '/cover-letter'
  },
  {
    id: 'roadmap-provider',
    tag: '04 / ROADMAP PROVIDER',
    title: 'Roadmap Provider',
    headline: 'Curated learning paths on PathForge.',
    description:
      'When you identify a skill gap, jump directly to structured, community-tested roadmaps across modern engineering and data disciplines without searching blindly.',
    footerNote: 'External learning companion',
    actionText: 'Explore PathForge',
    actionHref: 'https://path-forge-amber.vercel.app/',
    isExternal: true
  }
] as const;

const RUBRIC_ITEMS = [
  { label: '1. Formatting & Readability', maxPts: 2 },
  { label: '2. Keyword Relevance', maxPts: 2 },
  { label: '3. Experience & Metrics', maxPts: 2 },
  { label: '4. Structure & Order', maxPts: 2 },
  { label: '5. Clarity & Professional Tone', maxPts: 2 }
] as const;

const PATHWAYS = ['Frontend Dev', 'Backend Dev', 'Data Analyst', 'Machine Learning'] as const;

const SAMPLE_LETTER_TEXT =
  "Dear Hiring Team, I am writing to express my enthusiasm for the Software Engineering Internship at Stripe. My background in building responsive web applications and REST APIs directly aligns with Stripe's developer-first infrastructure.";

export default function ToolsSection(): React.JSX.Element {
  const { theme } = useTheme();
  const cardTheme = theme === 'dark' ? 'dark' : 'light';

  // Card 02 Scroll-in trigger for progress bar
  const [card2InView, setCard2InView] = useState<boolean>(false);
  const card2Ref = useRef<HTMLDivElement | null>(null);

  // Card 03 TextType cursor state
  const [typingComplete, setTypingComplete] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const el = card2Ref.current;
    if (!el) return;

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setCard2InView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCard2InView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleCopySample = () => {
    navigator.clipboard?.writeText(SAMPLE_LETTER_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportDummy = () => {
    const blob = new Blob([SAMPLE_LETTER_TEXT], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stripe-intern-cover-letter.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section
      id="tools"
      className="scroll-mt-20 py-16 sm:py-20 bg-[#FFFFFF] dark:bg-[#07090E] border-b border-[#E4E0D8] dark:border-[#1E233A] transition-colors"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 max-w-2xl">
          <span className="font-editorial-mono text-xs uppercase tracking-wider text-[#6B7280] dark:text-[#818CF8] block font-medium">
            THE FOUR TOOLS
          </span>
          <h2 className="font-editorial-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#14161F] dark:text-[#F1F3F9] mt-2">
            Four focused tools. One transparent workflow.
          </h2>
          <p className="font-editorial-sans text-sm sm:text-base text-[#5A5D6B] dark:text-[#9AA3BF] mt-2 leading-relaxed">
            Every tool operates on real text, concrete rubrics, and zero artificial hype.
          </p>
        </div>

        {/* 2x2 Bento Grid: Row 1 is 1.2fr / 1fr, Row 2 is 1fr / 1.2fr, stacking to 1 col on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ============================================================== */}
          {/* Card 01: Resume Analyzer (Row 1: 1.2fr -> 7 cols on lg)        */}
          {/* ============================================================== */}
          <div className="lg:col-span-7">
            <AnimatedContent
              distance={20}
              direction="vertical"
              duration={0.7}
              delay={0}
              trigger="scroll"
              once={true}
              className="h-full"
            >
              <SpotlightCard
                theme={cardTheme}
                spotlightColor="#9CA3AF"
                intensity={0.08}
                spotlightSize={260}
                softness={0.7}
                borderGlow={0.25}
                proximity={60}
                className="h-full rounded-[12px] bg-[#F9F8F4] dark:bg-[#121524] border border-[#E4E0D8] dark:border-[#1E233A] p-6 sm:p-8 flex flex-col justify-between transition-colors shadow-none"
                style={{
                  borderRadius: '12px',
                  '--spotlight-card-surface': cardTheme === 'dark' ? '#121524' : '#F9F8F4',
                  '--spotlight-card-border': cardTheme === 'dark' ? '#1E233A' : '#E4E0D8',
                  '--spotlight-card-shadow': 'none'
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-editorial-mono text-xs text-[#6B7280] dark:text-[#7E88A8]">
                      {TOOLS_DATA[0].tag}
                    </span>
                    <FileText className="h-5 w-5 text-[#4F46E5] dark:text-[#818CF8]" strokeWidth={1.5} />
                  </div>

                  <h3 className="font-editorial-serif text-xl sm:text-2xl font-normal text-[#14161F] dark:text-[#F1F3F9] mb-2">
                    {TOOLS_DATA[0].headline}
                  </h3>

                  <p className="font-editorial-sans text-sm text-[#5A5D6B] dark:text-[#9AA3BF] leading-relaxed mb-6">
                    {TOOLS_DATA[0].description}
                  </p>

                  {/* Preview Panel: Rubric List with CountUp */}
                  <div className="bg-white dark:bg-[#191D32] border border-[#E4E0D8] dark:border-[#252A45] rounded-[6px] p-4 space-y-2 mb-6">
                    <div className="flex items-center justify-between pb-2 border-b border-[#E4E0D8] dark:border-[#252A45]">
                      <span className="font-editorial-mono text-[11px] text-[#6B7280] dark:text-[#7E88A8] uppercase tracking-wider">
                        Scoring Rubric (5 Dimensions)
                      </span>
                      {/* Total Score Line counting from 0 to 8 */}
                      <span className="font-editorial-mono text-xs font-semibold text-[#4F46E5] dark:text-[#818CF8]">
                        Score: <CountUp to={8} from={0} duration={1.2} /> / 10
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                      {RUBRIC_ITEMS.slice(0, 4).map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center justify-between border-b border-[#E4E0D8]/60 dark:border-[#252A45]/60 pb-1"
                        >
                          <span className="text-[#14161F] dark:text-[#E8EAF6] font-editorial-sans">
                            {item.label}
                          </span>
                          <span className="font-editorial-mono text-[#6B7280] dark:text-[#7E88A8]">
                            0 - <CountUp to={item.maxPts} from={0} duration={1} /> pts
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-[#14161F] dark:text-[#E8EAF6] font-editorial-sans">
                        {RUBRIC_ITEMS[4].label}
                      </span>
                      <span className="font-editorial-mono text-[#6B7280] dark:text-[#7E88A8]">
                        0 - <CountUp to={RUBRIC_ITEMS[4].maxPts} from={0} duration={1} /> pts
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E4E0D8] dark:border-[#1E233A] flex items-center justify-between">
                  <span className="font-editorial-mono text-xs text-[#6B7280] dark:text-[#7E88A8]">
                    {TOOLS_DATA[0].footerNote}
                  </span>
                  <Link
                    to={TOOLS_DATA[0].actionHref}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#4F46E5] dark:text-[#818CF8] hover:text-[#4338CA] dark:hover:text-[#A5B4FC] transition-colors min-h-[36px]"
                  >
                    <span>{TOOLS_DATA[0].actionText}</span>
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                  </Link>
                </div>
              </SpotlightCard>
            </AnimatedContent>
          </div>

          {/* ============================================================== */}
          {/* Card 02: Skill Gap Analyzer (Row 1: 1fr -> 5 cols on lg)       */}
          {/* ============================================================== */}
          <div className="lg:col-span-5" ref={card2Ref}>
            <AnimatedContent
              distance={20}
              direction="vertical"
              duration={0.7}
              delay={0.1}
              trigger="scroll"
              once={true}
              className="h-full"
            >
              <SpotlightCard
                theme={cardTheme}
                spotlightColor="#9CA3AF"
                intensity={0.08}
                spotlightSize={260}
                softness={0.7}
                borderGlow={0.25}
                proximity={60}
                className="h-full rounded-[12px] bg-[#F9F8F4] dark:bg-[#121524] border border-[#E4E0D8] dark:border-[#1E233A] p-6 sm:p-8 flex flex-col justify-between transition-colors shadow-none"
                style={{
                  borderRadius: '12px',
                  '--spotlight-card-surface': cardTheme === 'dark' ? '#121524' : '#F9F8F4',
                  '--spotlight-card-border': cardTheme === 'dark' ? '#1E233A' : '#E4E0D8',
                  '--spotlight-card-shadow': 'none'
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-editorial-mono text-xs text-[#6B7280] dark:text-[#7E88A8]">
                      {TOOLS_DATA[1].tag}
                    </span>
                    <Target className="h-5 w-5 text-[#4F46E5] dark:text-[#818CF8]" strokeWidth={1.5} />
                  </div>

                  <h3 className="font-editorial-serif text-xl sm:text-2xl font-normal text-[#14161F] dark:text-[#F1F3F9] mb-2">
                    {TOOLS_DATA[1].headline}
                  </h3>

                  <p className="font-editorial-sans text-sm text-[#5A5D6B] dark:text-[#9AA3BF] leading-relaxed mb-6">
                    {TOOLS_DATA[1].description}
                  </p>

                  {/* Preview Panel: Role Benchmark + Progress Bar + Chips */}
                  <div className="bg-white dark:bg-[#191D32] border border-[#E4E0D8] dark:border-[#252A45] rounded-[6px] p-4 mb-6 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-[#14161F] dark:text-[#E8EAF6] font-editorial-sans">
                        Frontend Developer
                      </span>
                      <span className="font-editorial-mono text-[#4F46E5] dark:text-[#818CF8] font-semibold">
                        <CountUp to={67} from={0} duration={1.2} suffix="%" /> Match
                      </span>
                    </div>

                    {/* Progress bar: 0 -> 67% on scroll-in, 900ms ease-out */}
                    <div className="w-full bg-[#FAF8F4] dark:bg-[#0D101C] h-2 rounded-[2px] border border-[#E4E0D8] dark:border-[#252A45] overflow-hidden">
                      <div
                        className="bg-[#4F46E5] dark:bg-[#818CF8] h-full"
                        style={{
                          width: card2InView ? '67%' : '0%',
                          transition: 'width 900ms cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      />
                    </div>

                    {/* Matched (Green) and Missing (Amber) Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="font-editorial-mono text-[10px] text-[#15803D] dark:text-[#4ADE80] bg-[#F0FDF4] dark:bg-[#0B2816] border border-[#DCFCE7] dark:border-[#1E502B] px-1.5 py-0.5 rounded-[3px]">
                        + React
                      </span>
                      <span className="font-editorial-mono text-[10px] text-[#15803D] dark:text-[#4ADE80] bg-[#F0FDF4] dark:bg-[#0B2816] border border-[#DCFCE7] dark:border-[#1E502B] px-1.5 py-0.5 rounded-[3px]">
                        + Git
                      </span>
                      <span className="font-editorial-mono text-[10px] text-[#B45309] dark:text-[#FBBF24] bg-[#FFFBEB] dark:bg-[#2D1807] border border-[#FEF3C7] dark:border-[#572F0E] px-1.5 py-0.5 rounded-[3px]">
                        - TypeScript
                      </span>
                      <span className="font-editorial-mono text-[10px] text-[#B45309] dark:text-[#FBBF24] bg-[#FFFBEB] dark:bg-[#2D1807] border border-[#FEF3C7] dark:border-[#572F0E] px-1.5 py-0.5 rounded-[3px]">
                        - Jest
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E4E0D8] dark:border-[#1E233A] flex items-center justify-between">
                  <span className="font-editorial-mono text-xs text-[#6B7280] dark:text-[#7E88A8]">
                    {TOOLS_DATA[1].footerNote}
                  </span>
                  <Link
                    to={TOOLS_DATA[1].actionHref}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#4F46E5] dark:text-[#818CF8] hover:text-[#4338CA] dark:hover:text-[#A5B4FC] transition-colors min-h-[36px]"
                  >
                    <span>{TOOLS_DATA[1].actionText}</span>
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                  </Link>
                </div>
              </SpotlightCard>
            </AnimatedContent>
          </div>

          {/* ============================================================== */}
          {/* Card 03: Cover Letter Generator (Row 2: 1fr -> 5 cols on lg)   */}
          {/* ============================================================== */}
          <div className="lg:col-span-5">
            <AnimatedContent
              distance={20}
              direction="vertical"
              duration={0.7}
              delay={0.2}
              trigger="scroll"
              once={true}
              className="h-full"
            >
              <SpotlightCard
                theme={cardTheme}
                spotlightColor="#9CA3AF"
                intensity={0.08}
                spotlightSize={260}
                softness={0.7}
                borderGlow={0.25}
                proximity={60}
                className="h-full rounded-[12px] bg-[#F9F8F4] dark:bg-[#121524] border border-[#E4E0D8] dark:border-[#1E233A] p-6 sm:p-8 flex flex-col justify-between transition-colors shadow-none"
                style={{
                  borderRadius: '12px',
                  '--spotlight-card-surface': cardTheme === 'dark' ? '#121524' : '#F9F8F4',
                  '--spotlight-card-border': cardTheme === 'dark' ? '#1E233A' : '#E4E0D8',
                  '--spotlight-card-shadow': 'none'
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-editorial-mono text-xs text-[#6B7280] dark:text-[#7E88A8]">
                      {TOOLS_DATA[2].tag}
                    </span>
                    <PenLine className="h-5 w-5 text-[#4F46E5] dark:text-[#818CF8]" strokeWidth={1.5} />
                  </div>

                  <h3 className="font-editorial-serif text-xl sm:text-2xl font-normal text-[#14161F] dark:text-[#F1F3F9] mb-2">
                    {TOOLS_DATA[2].headline}
                  </h3>

                  <p className="font-editorial-sans text-sm text-[#5A5D6B] dark:text-[#9AA3BF] leading-relaxed mb-6">
                    {TOOLS_DATA[2].description}
                  </p>

                  {/* Preview Panel: Target header + TextType typed excerpt + Action buttons */}
                  <div className="bg-white dark:bg-[#191D32] border border-[#E4E0D8] dark:border-[#252A45] rounded-[6px] p-4 mb-6 space-y-3">
                    <div className="flex justify-between items-center text-xs pb-2 border-b border-[#E4E0D8]/60 dark:border-[#252A45]/60">
                      <span className="font-editorial-mono text-[#14161F] dark:text-[#E8EAF6] font-medium">
                        Target: Stripe · Intern
                      </span>
                      <span className="font-editorial-mono text-[#6B7280] dark:text-[#7E88A8]">
                        312 words
                      </span>
                    </div>

                    {/* Italic Sample Letter Excerpt with TextType typing animation */}
                    <div className="text-xs italic text-[#5A5D6B] dark:text-[#9AA3BF] leading-relaxed min-h-[56px] font-editorial-sans">
                      <TextType
                        text={SAMPLE_LETTER_TEXT}
                        typingSpeed={25}
                        loop={false}
                        startOnVisible={true}
                        cursorStyle="bar"
                        showCursor={!typingComplete}
                        cursorBlinkDuration={0.4}
                        onSentenceComplete={() => setTypingComplete(true)}
                        className="text-xs italic"
                      />
                    </div>

                    {/* Action buttons: Copy text and Export PDF */}
                    <div className="flex items-center gap-2 pt-1 border-t border-[#E4E0D8]/60 dark:border-[#252A45]/60">
                      <button
                        type="button"
                        onClick={handleCopySample}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-editorial-mono font-medium rounded-[4px] border border-[#E4E0D8] dark:border-[#252A45] bg-[#FAF8F4] dark:bg-[#121524] text-[#14161F] dark:text-[#E8EAF6] hover:border-[#4F46E5] dark:hover:border-[#818CF8] transition-colors cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy text</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleExportDummy}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-editorial-mono font-medium rounded-[4px] border border-[#E4E0D8] dark:border-[#252A45] bg-[#FAF8F4] dark:bg-[#121524] text-[#14161F] dark:text-[#E8EAF6] hover:border-[#4F46E5] dark:hover:border-[#818CF8] transition-colors cursor-pointer"
                      >
                        <FileDown className="h-3 w-3" />
                        <span>Export PDF</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E4E0D8] dark:border-[#1E233A] flex items-center justify-between">
                  <span className="font-editorial-mono text-xs text-[#6B7280] dark:text-[#7E88A8]">
                    {TOOLS_DATA[2].footerNote}
                  </span>
                  <Link
                    to={TOOLS_DATA[2].actionHref}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#4F46E5] dark:text-[#818CF8] hover:text-[#4338CA] dark:hover:text-[#A5B4FC] transition-colors min-h-[36px]"
                  >
                    <span>{TOOLS_DATA[2].actionText}</span>
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                  </Link>
                </div>
              </SpotlightCard>
            </AnimatedContent>
          </div>

          {/* ============================================================== */}
          {/* Card 04: Roadmap Provider (Row 2: 1.2fr -> 7 cols on lg)       */}
          {/* ============================================================== */}
          <div className="lg:col-span-7">
            <AnimatedContent
              distance={20}
              direction="vertical"
              duration={0.7}
              delay={0.3}
              trigger="scroll"
              once={true}
              className="h-full"
            >
              <SpotlightCard
                theme={cardTheme}
                spotlightColor="#9CA3AF"
                intensity={0.08}
                spotlightSize={260}
                softness={0.7}
                borderGlow={0.25}
                proximity={60}
                className="h-full rounded-[12px] bg-[#F9F8F4] dark:bg-[#121524] border border-[#E4E0D8] dark:border-[#1E233A] p-6 sm:p-8 flex flex-col justify-between transition-colors shadow-none"
                style={{
                  borderRadius: '12px',
                  '--spotlight-card-surface': cardTheme === 'dark' ? '#121524' : '#F9F8F4',
                  '--spotlight-card-border': cardTheme === 'dark' ? '#1E233A' : '#E4E0D8',
                  '--spotlight-card-shadow': 'none'
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-editorial-mono text-xs text-[#6B7280] dark:text-[#7E88A8]">
                      {TOOLS_DATA[3].tag}
                    </span>
                    <Map className="h-5 w-5 text-[#4F46E5] dark:text-[#818CF8]" strokeWidth={1.5} />
                  </div>

                  <h3 className="font-editorial-serif text-xl sm:text-2xl font-normal text-[#14161F] dark:text-[#F1F3F9] mb-2">
                    {TOOLS_DATA[3].headline}
                  </h3>

                  <p className="font-editorial-sans text-sm text-[#5A5D6B] dark:text-[#9AA3BF] leading-relaxed mb-6">
                    {TOOLS_DATA[3].description}
                  </p>

                  {/* Preview Panel: 4 Pathway Buttons with Magnet */}
                  <div className="bg-white dark:bg-[#191D32] border border-[#E4E0D8] dark:border-[#252A45] rounded-[6px] p-4 mb-6 space-y-3">
                    <span className="font-editorial-mono text-[11px] text-[#6B7280] dark:text-[#7E88A8] uppercase tracking-wider block">
                      AVAILABLE PATHWAYS ON PATHFORGE:
                    </span>

                    {/* Pathway buttons with Magnet effect (padding 30, magnetStrength 4) */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {PATHWAYS.map((pathway) => (
                        <Magnet key={pathway} padding={30} magnetStrength={4}>
                          <a
                            href="https://path-forge-amber.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-editorial-mono font-medium rounded-[4px] border border-[#E4E0D8] dark:border-[#252A45] bg-[#FAF8F4] dark:bg-[#121524] text-[#14161F] dark:text-[#E8EAF6] hover:border-[#4F46E5] dark:hover:border-[#818CF8] hover:text-[#4F46E5] dark:hover:text-[#818CF8] transition-colors"
                          >
                            <span>{pathway}</span>
                            <ArrowUpRight className="h-3 w-3 opacity-60" />
                          </a>
                        </Magnet>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E4E0D8] dark:border-[#1E233A] flex items-center justify-between">
                  <span className="font-editorial-mono text-xs text-[#6B7280] dark:text-[#7E88A8]">
                    {TOOLS_DATA[3].footerNote}
                  </span>
                  <a
                    href={TOOLS_DATA[3].actionHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#4F46E5] dark:text-[#818CF8] hover:text-[#4338CA] dark:hover:text-[#A5B4FC] transition-colors min-h-[36px]"
                  >
                    <span>{TOOLS_DATA[3].actionText}</span>
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                  </a>
                </div>
              </SpotlightCard>
            </AnimatedContent>
          </div>
        </div>
      </div>
    </section>
  );
}
