import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BottomNav } from '../components/BottomNav';
import {
  BookOpen, Calculator, PenTool, FlaskConical, Atom,
  ArrowLeft, Lock, Zap, Crown
} from 'lucide-react';

const subjects = [
  {
    key: 'ingles',
    title: 'Inglês',
    desc: 'Vocabulário, gramática e conversação',
    icon: BookOpen,
    color: 'from-blue-500 to-cyan-400',
    path: '/ingles',
    premium: false,
  },
  {
    key: 'matematica',
    title: 'Matemática',
    desc: 'Álgebra, geometria e lógica',
    icon: Calculator,
    color: 'from-emerald-500 to-teal-400',
    path: '/matematica',
    premium: false,
  },
  {
    key: 'portugues',
    title: 'Português',
    desc: 'Gramática, interpretação e literatura',
    icon: PenTool,
    color: 'from-amber-500 to-orange-400',
    path: '/portugues',
    premium: true,
  },
  {
    key: 'quimica',
    title: 'Química',
    desc: 'Básica, tabela periódica e reações',
    icon: FlaskConical,
    color: 'from-pink-500 to-rose-400',
    path: '/quimica',
    premium: true,
  },
  {
    key: 'fisica',
    title: 'Física',
    desc: 'Mecânica, termodinâmica e óptica',
    icon: Atom,
    color: 'from-violet-500 to-purple-400',
    path: '/fisica',
    premium: true,
  },
];

export function MateriasPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const isPremium = profile?.premium || false;

  return (
    <div className="min-h-screen bg-dark-900 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="text-dark-300 hover:text-white transition-colors">
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-white font-bold text-lg">Matérias</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Premium Banner */}
        {!isPremium && (
          <div className="card p-5 relative overflow-hidden border-accent-500/30">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/10 rounded-full blur-[40px] pointer-events-none" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-12 h-12 gradient-gold rounded-2xl flex items-center justify-center shrink-0">
                <Crown size={24} className="text-dark-900" />
              </div>
              <div className="flex-1">
                <div className="text-accent-400 text-xs font-semibold mb-0.5">Desbloqueie Todas as Matérias</div>
                <div className="text-white font-bold text-sm">Acesse Português, Química e Física com o Premium</div>
              </div>
            </div>
          </div>
        )}

        {/* Subject Cards */}
        <div className="space-y-3">
          <h2 className="text-white font-bold text-lg">Escolha uma Matéria</h2>
          <div className="space-y-3">
            {subjects.map((subject) => {
              const locked = subject.premium && !isPremium;
              return (
                <button
                  key={subject.key}
                  onClick={() => {
                    if (locked) return;
                    navigate(subject.path);
                  }}
                  className={`w-full card p-5 flex items-center gap-4 relative group ${
                    locked ? 'opacity-70' : ''
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${subject.color} flex items-center justify-center shrink-0 ${
                    !locked ? 'group-hover:scale-110' : ''
                  } transition-transform duration-300`}>
                    <subject.icon size={28} className="text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-bold">{subject.title}</h3>
                      {locked && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-500/20 text-accent-400 text-xs font-semibold">
                          <Crown size={10} />
                          Premium
                        </div>
                      )}
                    </div>
                    <p className="text-dark-400 text-sm mt-0.5">{subject.desc}</p>
                  </div>
                  {locked ? (
                    <Lock size={20} className="text-dark-400 shrink-0" />
                  ) : (
                    <Zap size={18} className="text-dark-400 shrink-0" />
                  )}

                  {/* Locked overlay */}
                  {locked && (
                    <div className="absolute inset-0 rounded-2xl bg-dark-900/40 backdrop-blur-[1px] flex items-center justify-center">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/20 border border-accent-500/30">
                        <Lock size={14} className="text-accent-400" />
                        <span className="text-accent-400 text-sm font-semibold">Premium</span>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
