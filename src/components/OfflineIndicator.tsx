import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-amber-500/90 backdrop-blur-sm px-4 py-2 flex items-center justify-center gap-2 text-dark-900 text-sm font-semibold animate-slide-up">
      <WifiOff size={16} />
      <span>Você está offline — progresso será sincronizado</span>
    </div>
  );
}
