import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { BottomNav } from '../components/BottomNav';
import {
  BookOpen, MessageCircle, Headphones, PenTool,
  Layers, HelpCircle, Star, ArrowLeft, Sparkles, Zap
} from 'lucide-react';

interface Lesson {
  id: string;
  category: string;
  level: number;
  title: string;
  xp_reward: number;
}

const categories = [
  { key: 'vocabulario', title: 'Vocabulário', icon: BookOpen, color: 'from-blue-500 to-cyan-400' },
  { key: 'gramatica', title: 'Gramática', icon: PenTool, color: 'from-emerald-500 to-teal-400' },
  { key: 'conversacao', title: 'Conversação', icon: MessageCircle, color: 'from-amber-500 to-orange-400' },
  { key: 'listening', title: 'Listening', icon: Headphones, color: 'from-pink-500 to-rose-400' },
  { key: 'flashcards', title: 'Flashcards', icon: Layers, color: 'from-violet-500 to-purple-400' },
  { key: 'quiz', title: 'Quiz Diário', icon: HelpCircle, color: 'from-red-500 to-rose-400' },
];

const levelTabs = [
  { key: 1, label: 'Iniciante' },
  { key: 2, label: 'Intermediário' },
  { key: 3, label: 'Avançado' },
];

export function InglesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeLevel, setActiveLevel] = useState(1);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [dailyLesson, setDailyLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      const { data } = await supabase
        .from('lessons')
        .select('id, category, level, title, xp_reward')
        .eq('module', 'ingles')
        .order('level', { ascending: true });

      if (data) {
        setLessons(data as Lesson[]);
        if (data.length > 0) {
          setDailyLesson(data[Math.floor(Math.random() * data.length)] as Lesson);
        }
      }
    };

    const fetchProgress = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('user_progress')
        .select('lesson_id')
        .eq('user_id', user.id)
        .eq('completed', true);

      if (data) {
        setCompletedLessons(new Set(data.map((d) => d.lesson_id)));
      }
    };

    fetchLessons();
    fetchProgress();
  }, [user]);

  const filteredLessons = lessons.filter((l) => l.level === activeLevel);

  const getCategoryProgress = (categoryKey: string) => {
    const catLessons = lessons.filter((l) => l.category === categoryKey);
    if (catLessons.length === 0) return 0;
    const completed = catLessons.filter((l) => completedLessons.has(l.id)).length;
    return Math.round((completed / catLessons.length) * 100);
  };

  const getCategoryXp = (categoryKey: string) => {
    return lessons
      .filter((l) => l.category === categoryKey && l.level === activeLevel)
      .reduce((sum, l) => sum + l.xp_reward, 0);
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <h1 className="text-white font-bold text-lg">Inglês</h1>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Level Tabs */}
        <div className="flex gap-2 p-1 glass rounded-xl">
          {levelTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveLevel(tab.key)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeLevel === tab.key
                  ? 'gradient-purple text-white shadow-lg'
                  : 'text-dark-300 hover:text-dark-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Lição do Dia Banner */}
        {dailyLesson && (
          <button
            onClick={() => navigate(`/ingles/licao/${dailyLesson.id}`)}
            className="w-full card p-5 relative overflow-hidden border-primary-500/30"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-[40px] pointer-events-none" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-12 h-12 gradient-purple rounded-2xl flex items-center justify-center shrink-0">
                <Sparkles size={24} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-primary-300 text-xs font-semibold mb-0.5">Lição do Dia</div>
                <div className="text-white font-bold">{dailyLesson.title}</div>
                <div className="flex items-center gap-1 mt-1">
                  <Zap size={12} className="text-accent-400" />
                  <span className="text-accent-400 text-xs font-semibold">+{dailyLesson.xp_reward} XP</span>
                </div>
              </div>
              <div className="w-10 h-10 gradient-purple rounded-full flex items-center justify-center shrink-0">
                <Star size={18} className="text-white fill-white" />
              </div>
            </div>
          </button>
        )}

        {/* Category Cards */}
        <div className="space-y-3">
          <h2 className="text-white font-bold text-lg">Categorias</h2>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => {
              const progress = getCategoryProgress(cat.key);
              const xp = getCategoryXp(cat.key);
              const isFlashcards = cat.key === 'flashcards';

              return (
                <button
                  key={cat.key}
                  onClick={() => {
                    if (isFlashcards) {
                      navigate('/ingles/flashcards');
                    } else {
                      const lesson = filteredLessons.find((l) => l.category === cat.key);
                      if (lesson) navigate(`/ingles/licao/${lesson.id}`);
                    }
                  }}
                  className="card p-4 text-left group"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <cat.icon size={20} className="text-white" />
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

        {/* All Lessons List */}
        {filteredLessons.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-white font-bold text-lg">Lições — {levelTabs.find((t) => t.key === activeLevel)?.label}</h2>
            <div className="space-y-2">
              {filteredLessons.map((lesson) => {
                const isCompleted = completedLessons.has(lesson.id);
                return (
                  <button
                    key={lesson.id}
                    onClick={() => navigate(`/ingles/licao/${lesson.id}`)}
                    className="w-full card p-4 flex items-center gap-3"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isCompleted ? 'bg-success-500/20' : 'bg-dark-600'
                    }`}>
                      {isCompleted ? (
                        <Star size={18} className="text-success-400 fill-success-400" />
                      ) : (
                        <BookOpen size={18} className="text-dark-300" />
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
