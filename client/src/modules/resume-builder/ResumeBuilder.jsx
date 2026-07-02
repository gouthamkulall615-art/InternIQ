import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Bot, Save, Download } from 'lucide-react';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import AiReviewModal from './components/AiReviewModal';

export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState({
    personal: { name: '', email: '', phone: '', location: '', linkedin: '', github: '' },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: []
  });

  const [isAiReviewOpen, setIsAiReviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' or 'preview' — mobile only
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${resumeData.personal.name || 'Resume'}_InternIQ`,
  });

  const btnSecondary = "flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-h-[44px]";
  const btnPrimary = "flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-semibold text-white bg-[#0A66C2] rounded-lg hover:bg-[#004182] transition-colors min-h-[44px]";

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-3 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Resume Builder</h2>
          <div className="flex items-center gap-2 sm:gap-3">
            <button className={btnSecondary}>
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Save Draft</span>
              <span className="sm:hidden">Save</span>
            </button>
            <button onClick={handlePrint} className={btnSecondary}>
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
            <button onClick={() => setIsAiReviewOpen(true)} className={btnPrimary}>
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">AI Review</span>
              <span className="sm:hidden">Review</span>
            </button>
          </div>
        </div>

        {/* Mobile tab switcher */}
        <div className="flex lg:hidden mt-3 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1">
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors min-h-[36px] ${
              activeTab === 'edit'
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors min-h-[36px] ${
              activeTab === 'preview'
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Split Pane Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor Pane */}
        <div className={`w-full lg:w-1/2 overflow-y-auto border-r-0 lg:border-r border-gray-200 dark:border-gray-800 p-4 sm:p-6 bg-white dark:bg-gray-900 transition-colors ${
          activeTab === 'preview' ? 'hidden lg:block' : ''
        }`}>
          <ResumeForm resumeData={resumeData} setResumeData={setResumeData} />
        </div>

        {/* Preview Pane */}
        <div className={`w-full lg:w-1/2 overflow-y-auto bg-gray-100 dark:bg-gray-950 p-4 sm:p-6 lg:p-8 transition-colors ${
          activeTab === 'edit' ? 'hidden lg:flex' : 'flex'
        } justify-center`}>
          <div className="w-full max-w-[816px] shadow-lg overflow-x-auto">
            <ResumePreview resumeData={resumeData} ref={printRef} />
          </div>
        </div>
      </div>

      {isAiReviewOpen && (
        <AiReviewModal
          resumeData={resumeData}
          onClose={() => setIsAiReviewOpen(false)}
        />
      )}
    </div>
  );
}
