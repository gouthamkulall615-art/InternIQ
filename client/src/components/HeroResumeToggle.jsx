import { useState, useEffect, useRef } from 'react';
import { cleanResume, atsSample } from '../data/landingSample';
import { AlertCircle, CheckCircle2, Eye, Terminal } from 'lucide-react';

export default function HeroResumeToggle() {
  const [view, setView] = useState('human'); // 'human' | 'ats'
  const [hasInteracted, setHasInteracted] = useState(false);
  const tabHumanRef = useRef(null);
  const tabAtsRef = useRef(null);
  const autoPlayTimerRef = useRef(null);

  // Auto-play once on load: flip to 'ats' after 2.5s if user hasn't interacted
  useEffect(() => {
    autoPlayTimerRef.current = setTimeout(() => {
      if (!hasInteracted) {
        setView('ats');
      }
    }, 2500);

    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
    };
  }, [hasInteracted]);

  const selectTab = (nextView) => {
    if (!hasInteracted) {
      setHasInteracted(true);
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
    }
    setView(nextView);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const nextView = view === 'human' ? 'ats' : 'human';
      selectTab(nextView);
      if (nextView === 'human') {
        tabHumanRef.current?.focus();
      } else {
        tabAtsRef.current?.focus();
      }
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#131626] border border-[#E4E0D8] dark:border-[#1E233A] rounded-[6px] overflow-hidden shadow-xs transition-colors">
      {/* Segmented Top Bar / Tablist */}
      <div className="px-4 py-3 bg-[#FAF8F4] dark:bg-[#0B0D17] border-b border-[#E4E0D8] dark:border-[#1E233A] flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Resume comparison toggle"
          onKeyDown={handleKeyDown}
          className="inline-flex items-center p-1 bg-white dark:bg-[#1A1E33] border border-[#E4E0D8] dark:border-[#252A45] rounded-[4px]"
        >
          <button
            ref={tabHumanRef}
            id="tab-human"
            role="tab"
            aria-selected={view === 'human'}
            aria-controls="panel-human"
            tabIndex={view === 'human' ? 0 : -1}
            onClick={() => selectTab('human')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-[3px] transition-colors min-h-[36px] ${
              view === 'human'
                ? 'bg-[#14161F] dark:bg-[#4F46E5] text-white shadow-xs'
                : 'text-[#5A5D6B] dark:text-[#9AA3BF] hover:text-[#14161F] dark:hover:text-white'
            }`}
          >
            <Eye className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span>What you see</span>
          </button>

          <button
            ref={tabAtsRef}
            id="tab-ats"
            role="tab"
            aria-selected={view === 'ats'}
            aria-controls="panel-ats"
            tabIndex={view === 'ats' ? 0 : -1}
            onClick={() => selectTab('ats')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-[3px] transition-colors min-h-[36px] ${
              view === 'ats'
                ? 'bg-[#14161F] dark:bg-[#4F46E5] text-white shadow-xs'
                : 'text-[#5A5D6B] dark:text-[#9AA3BF] hover:text-[#14161F] dark:hover:text-white'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span>What the ATS sees</span>
          </button>
        </div>

        {/* View Badge Status */}
        <div className="hidden sm:flex items-center gap-2">
          {view === 'human' ? (
            <span className="font-editorial-mono text-[11px] text-[#15803D] dark:text-[#4ADE80] bg-[#F0FDF4] dark:bg-[#0B2816] border border-[#DCFCE7] dark:border-[#1E502B] px-2 py-0.5 rounded-[3px] inline-flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" strokeWidth={1.5} />
              <span>Clean Two-Column Layout</span>
            </span>
          ) : (
            <span className="font-editorial-mono text-[11px] text-[#B45309] dark:text-[#FBBF24] bg-[#FFFBEB] dark:bg-[#2D1807] border border-[#FEF3C7] dark:border-[#572F0E] px-2 py-0.5 rounded-[3px] inline-flex items-center gap-1">
              <AlertCircle className="h-3 w-3" strokeWidth={1.5} />
              <span>Parser Stream Corruption</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Panel Content with 200ms cross-fade */}
      <div className="relative min-h-[460px]">
        {/* VIEW 1: WHAT YOU SEE (Clean Two-Column Resume) */}
        <div
          id="panel-human"
          role="tabpanel"
          aria-labelledby="tab-human"
          hidden={view !== 'human'}
          className={`p-5 sm:p-6 text-[#14161F] dark:text-[#F1F3F9] transition-opacity duration-200 ${
            view === 'human' ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'
          }`}
        >
          {/* Resume Header */}
          <div className="border-b border-[#E4E0D8] dark:border-[#1E233A] pb-4 mb-4">
            <h2 className="font-heading text-2xl font-semibold tracking-[-0.02em] text-[#14161F] dark:text-white">
              {cleanResume.name}
            </h2>
            <p className="text-xs text-[#5A5D6B] dark:text-[#9AA3BF] font-medium mt-0.5">
              {cleanResume.title}
            </p>
            <div className="font-editorial-mono text-[11px] text-[#6B7280] dark:text-[#7E88A8] flex flex-wrap gap-x-4 gap-y-1 mt-2">
              <span>{cleanResume.contact.email}</span>
              <span>{cleanResume.contact.location}</span>
              <span>{cleanResume.contact.github}</span>
            </div>
          </div>

          {/* Two-Column Body */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-xs">
            {/* Left Column (7 cols): Summary & Projects */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <h3 className="font-editorial-mono text-[10px] uppercase font-bold text-[#6B7280] dark:text-[#7E88A8] tracking-wider mb-1">
                  Summary
                </h3>
                <p className="text-[#5A5D6B] dark:text-[#9AA3BF] leading-relaxed">
                  {cleanResume.summary}
                </p>
              </div>

              <div>
                <h3 className="font-editorial-mono text-[10px] uppercase font-bold text-[#6B7280] dark:text-[#7E88A8] tracking-wider mb-2">
                  Key Projects
                </h3>
                <div className="space-y-3">
                  {cleanResume.projects.map((proj) => (
                    <div key={proj.title} className="p-2.5 bg-[#FAF8F4] dark:bg-[#1A1E33] border border-[#E4E0D8] dark:border-[#252A45] rounded-[4px]">
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="font-semibold text-[#14161F] dark:text-white text-[12px]">{proj.title}</span>
                        <span className="font-editorial-mono text-[10px] text-[#6B7280] dark:text-[#7E88A8]">{proj.period}</span>
                      </div>
                      <span className="font-editorial-mono text-[10px] text-[#4F46E5] dark:text-[#818CF8] block mb-1.5">
                        {proj.tech}
                      </span>
                      <ul className="list-disc list-outside pl-3.5 space-y-1 text-[#5A5D6B] dark:text-[#9AA3BF] leading-normal text-[11px]">
                        {proj.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Skills & Education */}
            <div className="md:col-span-5 space-y-4 border-t md:border-t-0 md:border-l border-[#E4E0D8] dark:border-[#1E233A] pt-4 md:pt-0 md:pl-5">
              <div>
                <h3 className="font-editorial-mono text-[10px] uppercase font-bold text-[#6B7280] dark:text-[#7E88A8] tracking-wider mb-2">
                  Skills & Tools
                </h3>
                <div className="space-y-2">
                  {cleanResume.skills.map((grp) => (
                    <div key={grp.category}>
                      <span className="font-editorial-mono text-[10px] text-[#6B7280] dark:text-[#7E88A8] block">
                        {grp.category}:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {grp.items.map((s) => (
                          <span
                            key={s}
                            className="font-editorial-mono text-[10px] bg-[#FAF8F4] dark:bg-[#131626] text-[#14161F] dark:text-[#E8EAF6] border border-[#E4E0D8] dark:border-[#252A45] px-1.5 py-0.5 rounded-[3px]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-editorial-mono text-[10px] uppercase font-bold text-[#6B7280] dark:text-[#7E88A8] tracking-wider mb-1.5">
                  Education
                </h3>
                <div className="p-2.5 bg-[#FAF8F4] dark:bg-[#1A1E33] border border-[#E4E0D8] dark:border-[#252A45] rounded-[4px] space-y-1">
                  <p className="font-medium text-[#14161F] dark:text-white text-[11px]">
                    {cleanResume.education.degree}
                  </p>
                  <p className="text-[#5A5D6B] dark:text-[#9AA3BF] text-[10px]">
                    {cleanResume.education.institution}
                  </p>
                  <p className="font-editorial-mono text-[10px] text-[#4F46E5] dark:text-[#818CF8]">
                    GPA: {cleanResume.education.gpa} ({cleanResume.education.period})
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* VIEW 2: WHAT THE ATS SEES (Raw Parsed Stream on #0F111A Panel) */}
        <div
          id="panel-ats"
          role="tabpanel"
          aria-labelledby="tab-ats"
          hidden={view !== 'ats'}
          className={`p-5 sm:p-6 bg-[#0F111A] text-[#9CA3AF] font-editorial-mono text-[11px] leading-relaxed transition-opacity duration-200 min-h-[460px] flex flex-col justify-between ${
            view === 'ats' ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'
          }`}
        >
          <div>
            {/* Terminal Top Meta */}
            <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-[#262938] text-[10px] text-[#6B7280]">
              <span>PARSER ENGINE: STD_OCR_STREAM_V2.1</span>
              <span>PARSING STATUS: 18 ERRORS DETECTED</span>
            </div>

            {/* Staggered Line-by-Line Reveal */}
            <div className="space-y-1 overflow-x-auto max-h-[340px] pr-2">
              {atsSample.rawLines.map((line, idx) => (
                <div
                  key={idx}
                  style={{
                    animationDelay: `${idx * 25}ms`,
                  }}
                  className={`py-0.5 px-1 rounded-[2px] transition-all ${
                    line.includes('?') || line.includes('>>') || line.includes('UNPARSED') || line.includes('ERROR')
                      ? 'text-[#F59E0B] bg-[#2D1807]/30'
                      : 'text-[#E5E7EB]'
                  }`}
                >
                  <span className="text-[#4B5563] select-none mr-2 inline-block w-5 text-right">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  {line}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Diagnostic Warning Strip */}
          <div className="mt-4 pt-3 border-t border-[#262938] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-[#F59E0B]">
              <AlertCircle className="h-4 w-4 flex-shrink-0" strokeWidth={1.5} />
              <span className="font-semibold tracking-wide">
                {atsSample.atsNote}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="text-[#6B7280]">DETECTED:</span>
              <span className="text-[#10B981] bg-[#0B2816] px-1.5 py-0.5 rounded-[2px] border border-[#1E502B]">
                Python, SQL
              </span>
              <span className="text-[#6B7280] ml-1">MISSED:</span>
              <span className="text-[#EF4444] bg-[#2A1215] px-1.5 py-0.5 rounded-[2px] border border-[#521D24]">
                React, Node.js, MongoDB, Git
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
