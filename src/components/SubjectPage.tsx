import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { BottomNav } from '../components/BottomNav';
import {
  ArrowLeft, Zap, Star, Lock, Crown, type LucideIcon
} from 'lucide-react';

interface Category {
  key: string;
  title: string;
  icon: LucideIcon;
  color: string;
}

interface Lesson {
  id: string;
  category: string;
  level: number;
  title: string;
  xp_reward: number;
}

interface SubjectPageProps {
  module: string;
  title: string;
  icon: LucideIcon;
  color: string;
  categories: Category[];
  premium?: boolean;
}

export function SubjectPage({ module, title, icon: SubjectIcon, color, categories, premium = false }: SubjectPageProps) {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const isPremium = profile?.premium || false;
  const locked = premium && !isPremium;

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchLessons = async () => {
      const { data } = await supabase
        .from('lessons')
        .select('id, category, level, title, xp_reward')
        .eq('module', module)
        .order('level', { ascending: true });
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
  }, [user, module]);

  const getCategoryProgress = (categoryKey: string) => {
    const catLessons = lessons.filter((l) => l.category === categoryKey);
    if (catLessons.length === 0) return 0;
    const completed = catLessons.filter((l) => completedLessons.has(l.id)).length;
    return Math.round((completed / catLessons.length) * 100);
  };

  const getCategoryXp = (categoryKey: string) => {
    return lessons
      .filter((l) => l.category === categoryKey)
      .reduce((sum, l) => sum + l.xp_reward, 0);
  };

  // Locked overlay
  if (locked) {
    return (
      <div className="min-h-screen bg-dark-900 flex flex-col">
        <header className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={() => navigate('/materias')} className="text-dark-300 hover:text-white transition-colors">
              <ArrowLeft size={22} />
            </button>
            <h1 className="text-white font-bold text-lg">{title}</h1>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-sm animate-slide-up">
            <div className="w-20 h-20 gradient-gold rounded-full flex items-center justify-center mx-auto mb-6">
              <Crown size={36} className="text-dark-900" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Recurso Premium</h2>
            <p className="text-dark-300 mb-6">{title} está disponível apenas para assinantes Premium.</p>
            <button onClick={() => navigate('/')} className="btn-primary inline-flex items-center gap-2">
              <Crown size={16} />
              Conhecer Premium
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/materias')} className="text-dark-300 hover:text-white transition-colors">
            <ArrowLeft size={22} />
          </button>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
              <SubjectIcon size={16} className="text-white" />
            </div>
            <h1 className="text-white font-bold text-lg">{title}</h1>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Category Cards */}
        <div className="space-y-3">
          <h2 className="text-white font-bold text-lg">Categorias</h2>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => {
              const progress = getCategoryProgress(cat.key);
              const xp = getCategoryXp(cat.key);
              const CatIcon = cat.icon;

              return (
                <button
                  key={cat.key}
                  onClick={() => {
                    const lesson = lessons.find((l) => l.category === cat.key);
                    if (lesson) navigate(`/${module}/licao/${lesson.id}`);
                  }}
                  className="card p-4 text-left group"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <CatIcon size={20} className="text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">{cat.title}</h3>
                  <div className="w-full h-1.5 bg-dark-600 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${cat.color} transition-all duration-500`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-dark-400 text-xs">{progress}%</span>
                    {xp > 0 && (
                      <span className="text-accent-400 text-xs font-semibold flex items-center gap-0.5">
                        <Zap size={10} /> {xp} XP
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* All Lessons */}
        {lessons.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-white font-bold text-lg">Todas as Lições</h2>
            <div className="space-y-2">
              {lessons.map((lesson) => {
                const isCompleted = completedLessons.has(lesson.id);
                return (
                  <button
                    key={lesson.id}
                    onClick={() => navigate(`/${module}/licao/${lesson.id}`)}
                    className="w-full card p-4 flex items-center gap-3"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isCompleted ? 'bg-success-500/20' : 'bg-dark-600'
                    }`}>
                      {isCompleted ? (
                        <Star size={18} className="text-success-400 fill-success-400" />
                      ) : (
                        <SubjectIcon size={18} className="text-dark-300" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-white font-semibold text-sm">{lesson.title}</div>
                      <div className="text-dark-400 text-xs capitalize">{lesson.category}</div>
                    </div>
                    <div className="flex items-center gap-1 text-accent-400 text-xs font-semibold">
                      <Zap size={12} />
                      {lesson.xp_reward}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
