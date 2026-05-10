import { useNavigate } from 'react-router-dom';
import { Crown, X, Zap } from 'lucide-react';

interface LimitModalProps {
  open: boolean;
  onClose: () => void;
  limit: number;
}

export function LimitModal({ open, onClose, limit }: LimitModalProps) {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative card p-6 max-w-sm w-full text-center animate-scale-in">
        <button onClick={onClose} className="absolute top-3 right-3 text-dark-400 hover:text-white transition-colors">
          <X size={20} />
        </button>

        <div className="w-16 h-16 gradient-gold rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Crown size={32} className="text-dark-900" />
        </div>

        <h2 className="text-xl font-bold text-white mb-2">Limite Atingido</h2>
        <p className="text-dark-300 text-sm mb-6">
          Você completou suas {limit} lições gratuitas de hoje. Faça o upgrade para Premium e tenha acesso ilimitado!
        </p>

        <button
          onClick={() => { onClose(); navigate('/pricing'); }}
          className="btn-primary w-full flex items-center justify-center gap-2 mb-3"
        >
          <Zap size={16} />
          Assinar Premium
        </button>

        <button
          onClick={onClose}
          className="w-full py-2 text-dark-400 text-sm hover:text-dark-200 transition-colors"
        >
          Voltar amanha
        </button>
      </div>
    </div>
  );
}
