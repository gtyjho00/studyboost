import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';

export function NotificationPrompt() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const wasDismissed = localStorage.getItem('notif_prompt_dismissed');
    if (wasDismissed) return;

    const timer = setTimeout(() => {
      if ('Notification' in window && Notification.permission === 'default') {
        setShow(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      await Notification.requestPermission();
    }
    dismiss();
  };

  const dismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem('notif_prompt_dismissed', 'true');
  };

  if (!show || dismissed) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 max-w-lg mx-auto animate-slide-up">
      <div className="card p-4 border-primary-500/20 flex items-center gap-3">
        <div className="w-10 h-10 gradient-purple rounded-xl flex items-center justify-center shrink-0">
          <Bell size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white font-semibold text-sm">Ative as notificações</div>
          <div className="text-dark-300 text-xs">Receba lembretes diários: "Sua meta diária te espera!"</div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={requestPermission} className="btn-primary text-xs py-1.5 px-3">
            Ativar
          </button>
          <button onClick={dismiss} className="text-dark-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
