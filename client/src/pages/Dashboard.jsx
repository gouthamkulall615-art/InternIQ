import { Link } from 'react-router-dom';
import { FileSearch, FileSignature, Map, Target, BrainCircuit, ArrowRight } from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  const tools = [
    {
      name: 'Resume Analyzer',
      description: 'Upload your resume and get an instant ATS score with actionable improvement suggestions.',
      icon: FileSearch,
      href: '/resume-analyzer',
      active: true,
    },
    {
      name: 'Cover Letter Generator',
      description: 'Create tailored cover letters instantly based on your resume and job description.',
      icon: FileSignature,
      href: '#',
      active: false,
    },
    {
      name: 'Roadmap Provider',
      description: 'Explore structured, ready-made roadmaps across multiple career fields to guide your learning path.',
      icon: Map,
      href: 'https://path-forge-amber.vercel.app/',
      active: true,
      external: true,
    },
    {
      name: 'Application Tracker',
      description: 'Keep track of all your internships and job applications in one place.',
      icon: Target,
      href: '#',
      active: false,
    },
    {
      name: 'Skill Gap Analyzer',
      description: 'Compare your profile against job requirements to see what you need to learn.',
      icon: BrainCircuit,
      href: '/skill-gap',
      active: true,
    },
    {
      name: 'LinkedIn Optimizer',
      description: 'Get actionable suggestions to make your LinkedIn profile stand out to recruiters.',
      icon: FaLinkedin,
      href: '#',
      active: false,
      isReactIcon: true, // flag to render differently
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400">
          Your all-in-one platform to prepare for and land your dream internship.
        </p>
      </div>

      {/* Tool Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.name}
              className={`group relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-200 ${
                tool.active
                  ? 'hover:shadow-md hover:border-[#0A66C2]/40 dark:hover:border-[#0A66C2]/40 hover:-translate-y-0.5'
                  : 'opacity-75'
              }`}
            >
              {!tool.active && (
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Coming Soon
                  </span>
                </div>
              )}

              <div className="p-5 sm:p-6">
                {/* Icon — single consistent accent treatment */}
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[#0A66C2]/10 dark:bg-[#0A66C2]/15 mb-4">
                  {tool.isReactIcon ? (
                    <Icon className="h-5 w-5 text-[#0A66C2]" />
                  ) : (
                    <Icon className="h-5 w-5 text-[#0A66C2]" />
                  )}
                </div>

                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1.5">
                  {tool.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-5 line-clamp-2">
                  {tool.description}
                </p>

                {tool.active ? (
                  tool.external ? (
                    <a
                      href={tool.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-semibold text-white bg-[#0A66C2] rounded-lg hover:bg-[#004182] transition-colors min-h-[44px] gap-2"
                    >
                      Open Tool
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </a>
                  ) : (
                    <Link
                      to={tool.href}
                      className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-semibold text-white bg-[#0A66C2] rounded-lg hover:bg-[#004182] transition-colors min-h-[44px] gap-2"
                    >
                      Open Tool
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  )
                ) : (
                  <button
                    disabled
                    className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-lg cursor-not-allowed min-h-[44px]"
                  >
                    Not Available Yet
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
