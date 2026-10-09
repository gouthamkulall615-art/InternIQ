import { useEffect } from 'react';
import { Settings } from 'lucide-react';

export default function MaintenancePage() {
  useEffect(() => {
    // Respect stored theme or system dark mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Ensure <meta name="robots" content="noindex"> is set
    let metaRobots = document.querySelector('meta[name="robots"]');
    let created = false;
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
      created = true;
    }
    const previousContent = metaRobots.getAttribute('content');
    metaRobots.setAttribute('content', 'noindex');

    return () => {
      if (created) {
        metaRobots.remove();
      } else if (previousContent) {
        metaRobots.setAttribute('content', previousContent);
      } else {
        metaRobots.removeAttribute('content');
      }
    };
  }, []);

  return (
    <main
      id="maintenance-page"
      className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12 transition-colors"
    >
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 sm:p-10 shadow-sm text-center">
        {/* Animated gear */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-blue-50 dark:bg-[#0A66C2]/10 border border-[#0A66C2]/20 flex items-center justify-center text-[#0A66C2]">
          <Settings
            className="w-8 h-8 animate-spin"
            style={{ animationDuration: '8s' }}
            aria-hidden="true"
          />
        </div>

        {/* Brand */}
        <div className="mb-3">
          <span className="text-sm font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400">
            Intern<span className="text-[#0A66C2]">IQ</span>
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-3">
          We're fixing some bugs
        </h1>

        {/* Short line */}
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
          InternIQ will be back shortly. Thanks for your patience.
        </p>

        {/* Status badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-[#0A66C2] dark:text-blue-400 border border-blue-200 dark:border-blue-800/40">
          <span className="w-2 h-2 rounded-full bg-[#0A66C2] animate-pulse" />
          Maintenance in progress
        </div>
      </div>
    </main>
  );
}
