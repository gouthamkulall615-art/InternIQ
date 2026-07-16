import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';

export default function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      // Check for updates periodically (every hour)
      registration && setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000);
    },
  });

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50 bg-[#0A66C2] text-white rounded-2xl shadow-2xl p-5 flex items-center gap-4 animate-in slide-in-from-bottom-4">
      <div className="flex-1">
        <h3 className="font-bold text-base">Update Available</h3>
        <p className="text-sm text-white/80 mt-0.5">A new version is ready to install.</p>
      </div>
      <button
        onClick={() => updateServiceWorker(true)}
        className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-[#0A66C2] bg-white rounded-xl hover:bg-gray-100 transition-colors"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Update
      </button>
      <button
        onClick={() => setNeedRefresh(false)}
        className="flex-shrink-0 p-1 text-white/70 hover:text-white transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
