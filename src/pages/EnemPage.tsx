import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { BottomNav } from '../components/BottomNav';
import {
  GraduationCap, ArrowLeft, Clock, BookOpen, Calculator,
  FlaskConical, Globe, PenTool, Zap, Crown, Lock,
  Target, ChevronRight, Sparkles
} from 'lucide-react';

interface Lesson {
  id: string;
  category: string;
  title: string;
  xp_reward: number;
}

const enemAreas = [
  { key: 'linguagens', title: 'Linguagens', icon: BookOpen, color: 'from-blue-500 to-cyan-400', desc: 'Português, Inglês, Espanhol' },
  { key: 'matematica', title: 'Matemática', icon: Calculator, color: 'from-emerald-500 to-teal-400', desc: 'Álgebra, geometria, probabilidade' },
  { key: 'ciencias_natureza', title: 'Ciências da Natureza', icon: FlaskConical, color: 'from-pink-500 to-rose-400', desc: 'Química, Física, Biologia' },
  { key: 'ciencias_humanas', title: 'Ciências Humanas', icon: Globe, color: 'from-amber-500 to-orange-400', desc: 'História, Geografia, Filosofia' },
  { key: 'redacao', title: 'Redação', icon: PenTool, color: 'from-violet-500 to-purple-400', desc: 'Dissertativo-argumentativa' },
];

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const enemDate = new Date('2026-11-08T13:30:00-03:00');

    const update = () => {
      const now = new Date();
      const diff = enemDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      {[
        { value: timeLeft.days, label: 'dias' },
        { value: timeLeft.hours, label: 'h' },
        { value: timeLeft.minutes, label: 'min' },
        { value: timeLeft.seconds, label: 's' },
      ].map((item, i) => (
        <div key={i} className="text-center">
          <div className="text-2xl md:text-3xl font-extrabold text-white tabular-nums">
            {String(item.value).padStart(2, '0')}
          </div>
          <div className="text-dark-400 text-[10px] uppercase tracking-wider">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

export function EnemPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const isPremium = profile?.premium || false;
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchLessons = async () => {
      const { data } = await supabase
        .from('lessons')
        .select('id, category, title, xp_reward')
        .eq('module', 'enem');
      if (data) setLessons(data as Lesson[]);
    };

    const fetchProgress = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('user_progress')
        .select('lesson_id')
        .eq('user_id', user.id)
        .eq('completed', true);
      if (data) setCompletedLessons(new Set(data.map((d) => d.lesson_id)));
    };

    fetchLessons();
    fetchProgress();
  }, [user]);

  const getAreaProgress = (categoryKey: string) => {
    const catLessons = lessons.filter((l) => l.category === categoryKey);
    if (catLessons.length === 0) return 0;
    const completed = catLessons.filter((l) => completedLessons.has(l.id)).length;
    return Math.round((completed / catLessons.length) * 100);
  };

  return (
    <div className="min-h-screen bg-dark-900 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="text-dark-300 hover:text-white transition-colors">
            <ArrowLeft size={22} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center">
              <GraduationCap size={16} className="text-white" />
            </div>
            <h1 className="text-white font-bold text-lg">ENEM 2026</h1>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Countdown */}
        <div className="card p-6 text-center relative overflow-hidden border-amber-500/20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] bg-amber-500/10 rounded-full blur-[60px] pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Clock size={16} className="text-amber-400" />
              <span className="text-amber-400 text-sm font-semibold">Contagem Regressiva</span>
            </div>
            <CountdownTimer />
            <p className="text-dark-400 text-xs mt-3">ENEM 2026 — Novembro de 2026</p>
          </div>
        </div>

        {/* Simular ENEM CTA */}
        <button
          onClick={() => navigate(isPremium ? '/enem/simulado' : '/enem/simulado')}
          className="w-full card p-5 relative overflow-hidden border-primary-500/30 group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-[40px] pointer-events-none" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 gradient-purple rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
              <Target size={24} className="text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-primary-300 text-xs font-semibold mb-0.5">Simular ENEM</div>
              <div className="text-white font-bold">
                {isPremium ? '45 questões' : '10 questões grátis'}
              </div>
              <div className="text-dark-400 text-xs mt-0.5">Cronometrado como o exame real</div>
            </div>
            <ChevronRight size={20} className="text-dark-400" />
          </div>
        </button>

        {/* ENEM Areas */}
        <div className="space-y-3">
          <h2 className="text-white font-bold text-lg">Áreas do Conhecimento</h2>
          <div className="space-y-3">
            {enemAreas.map((area) => {
              const progress = getAreaProgress(area.key);
              const isRedacao = area.key === 'redacao';
              const locked = isRedacao && !isPremium;

              return (
                <button
                  key={area.key}
                  onClick={() => {
                    if (locked) return;
                    if (isRedacao) {
                      navigate('/enem/redacao');
                    } else {
                      const lesson = lessons.find((l) => l.category === area.key);
                      if (lesson) navigate(`/enem/licao/${lesson.id}`);
                    }
                  }}
                  className={`w-full card p-4 flex items-center gap-3 relative ${locked ? 'opacity-70' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${area.color} flex items-center justify-center shrink-0`}>
                    <area.icon size={20} className="text-white" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-semibold text-sm">{area.title}</h3>
                      {locked && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-500/20 text-accent-400 text-[10px] font-semibold">
                          <Crown size={10} />
                          Premium
                        </div>
                      )}
                    </div>
                    <p className="text-dark-400 text-xs">{area.desc}</p>
                    <div className="w-full h-1.5 bg-dark-600 rounded-full overflow-hidden mt-2">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${area.color} transition-all duration-500`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-dark-400 text-xs shrink-0">{progress}%</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/enem/cronograma')}
            className="card p-4 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
              <Sparkles size={20} className="text-white" />
            </div>
            <h3 className="text-white font-semibold text-sm">Cronograma</h3>
            <p className="text-dark-400 text-xs mt-0.5">Plano de estudos personalizado</p>
          </button>

          <button
            onClick={() => navigate('/enem/redacao')}
            className={`card p-4 text-left group relative ${!isPremium ? 'opacity-70' : ''}`}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
              <PenTool size={20} className="text-white" />
            </div>
            <h3 className="text-white font-semibold text-sm">Redação</h3>
            <p className="text-dark-400 text-xs mt-0.5">Pratique com correção IA</p>
            {!isPremium && (
              <div className="absolute top-2 right-2">
                <Lock size={14} className="text-accent-400" />
              </div>
            )}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
