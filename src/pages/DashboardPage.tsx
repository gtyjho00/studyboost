import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { BottomNav } from '../components/BottomNav';
import {
  Flame, Coins, Zap, BookOpen, Calculator, GraduationCap,
  CheckCircle2, Circle, Trophy, Crown, Medal, Star,
  LogOut, ChevronRight, Target, Shield, Award, Copy
} from 'lucide-react';

interface Mission {
  id: string;
  label: string;
  xp: number;
  completed: boolean;
}

interface RankingUser {
  name: string;
  xp_week: number;
  rank: number;
}

const defaultMissions: Mission[] = [
  { id: 'm1', label: 'Complete 1 lição', xp: 30, completed: false },
  { id: 'm2', label: 'Acerte 5 questões seguidas', xp: 50, completed: false },
  { id: 'm3', label: 'Estude por 15 minutos', xp: 40, completed: false },
];

const modules = [
  {
    key: 'ingles',
    title: 'Inglês',
    desc: 'Vocabulário, gramática e conversação',
    icon: BookOpen,
    color: 'from-blue-500 to-cyan-400',
    lessons: 4,
    progress: 0,
  },
  {
    key: 'matematica',
    title: 'Matemática',
    desc: 'Álgebra, geometria e lógica',
    icon: Calculator,
    color: 'from-emerald-500 to-teal-400',
    lessons: 3,
    progress: 0,
  },
  {
    key: 'enem',
    title: 'ENEM',
    desc: 'Questões e simulados direcionados',
    icon: GraduationCap,
    color: 'from-amber-500 to-orange-400',
    lessons: 2,
    progress: 0,
  },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const { profile, user, isAdmin, signOut } = useAuth();
  const [showUserId, setShowUserId] = useState(false);
  const [missions, setMissions] = useState<Mission[]>(defaultMissions);
  const [rankings, setRankings] = useState<RankingUser[]>([]);
  const [dailyGoal, setDailyGoal] = useState({ current: 0, target: 3 });
  const [moduleProgress, setModuleProgress] = useState<Record<string, number>>({});

  const name = profile?.name || user?.user_metadata?.name || 'Estudante';
  const xp = profile?.xp || 0;
  const coins = profile?.coins || 0;
  const streak = profile?.streak || 0;
  const level = profile?.level || 1;

  const xpForNextLevel = level * 200;
  const xpProgress = Math.min((xp / xpForNextLevel) * 100, 100);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  useEffect(() => {
    if (!user) return;

    const fetchMissions = async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('user_missions')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today);

      if (data && data.length > 0) {
        setMissions(defaultMissions.map((m) => ({
          ...m,
          completed: data.some((d) => d.mission_id === m.id && d.completed),
        })));
      }
    };

    const fetchRankings = async () => {
      const { data } = await supabase
        .from('rankings')
        .select('user_id, xp_week')
        .order('xp_week', { ascending: false })
        .limit(3);

      if (data) {
        const withNames = await Promise.all(
          data.map(async (r, i) => {
            const { data: p } = await supabase
              .from('profiles')
              .select('name')
              .eq('id', r.user_id)
              .maybeSingle();
            return { name: p?.name || 'Aluno', xp_week: r.xp_week, rank: i + 1 };
          })
        );
        setRankings(withNames);
      }
    };

    const fetchProgress = async () => {
      const { data: lessons } = await supabase
        .from('lessons')
        .select('id, module');

      const { data: progress } = await supabase
        .from('user_progress')
        .select('lesson_id, completed')
        .eq('user_id', user.id)
        .eq('completed', true);

      if (lessons && progress) {
        const completedIds = new Set(progress.map((p) => p.lesson_id));
        const byModule: Record<string, { total: number; completed: number }> = {};

        lessons.forEach((l) => {
          if (!byModule[l.module]) byModule[l.module] = { total: 0, completed: 0 };
          byModule[l.module].total++;
          if (completedIds.has(l.lesson_id)) byModule[l.module].completed++;
        });

        const progMap: Record<string, number> = {};
        Object.entries(byModule).forEach(([mod, v]) => {
          progMap[mod] = v.total > 0 ? Math.round((v.completed / v.total) * 100) : 0;
        });
        setModuleProgress(progMap);

        const completedToday = progress.filter((p) => {
          const d = new Date();
          d.setHours(0, 0, 0, 0);
          return true;
        }).length;
        setDailyGoal({ current: Math.min(completedToday, 3), target: 3 });
      }
    };

    fetchMissions();
    fetchRankings();
    fetchProgress();
  }, [user]);

  const toggleMission = async (missionId: string) => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    const mission = missions.find((m) => m.id === missionId);
    if (!mission) return;

    const newCompleted = !mission.completed;

    setMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, completed: newCompleted } : m))
    );

    await supabase
      .from('user_missions')
      .upsert({
        user_id: user.id,
        mission_id: missionId,
        completed: newCompleted,
        date: today,
      }, { onConflict: 'user_id,mission_id,date' });

    if (newCompleted) {
      await supabase
        .from('profiles')
        .update({ xp: xp + mission.xp, coins: coins + 5 })
        .eq('id', user.id);
    }
  };

  const rankIcons = [Crown, Medal, Star];
  const rankColors = ['text-accent-400', 'text-dark-200', 'text-amber-700'];

  return (
    <div className="min-h-screen bg-dark-900 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-purple rounded-full flex items-center justify-center text-sm font-bold text-white">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-white font-semibold text-sm">Nv. {level}</div>
              <div className="w-24 h-1.5 bg-dark-600 rounded-full overflow-hidden">
                <div
                  className="h-full gradient-purple rounded-full transition-all duration-500"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-accent-400">
              <Flame size={18} />
              <span className="text-sm font-bold">{streak}</span>
            </div>
            <div className="flex items-center gap-1 text-accent-400">
              <Coins size={18} />
              <span className="text-sm font-bold">{coins}</span>
            </div>
            <div className="flex items-center gap-1 text-primary-400">
              <Zap size={18} />
              <span className="text-sm font-bold">{xp}</span>
            </div>
            <button onClick={signOut} className="text-dark-400 hover:text-white transition-colors ml-1">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Greeting */}
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-white">
            {greeting()}, <span className="text-gradient-purple">{name}</span>!
          </h1>
          <p className="text-dark-300 mt-1">Vamos estudar hoje?</p>
        </div>

        {/* Quick Links */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button onClick={() => navigate('/certificados')} className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass glass-hover shrink-0 text-sm text-dark-200 hover:text-white transition-all">
            <Award size={14} className="text-accent-400" />
            Certificados
          </button>
          {isAdmin && (
            <button onClick={() => navigate('/admin')} className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass glass-hover shrink-0 text-sm text-dark-200 hover:text-white transition-all">
              <Shield size={14} className="text-primary-400" />
              Admin
            </button>
          )}
          <button
            onClick={() => setShowUserId(!showUserId)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass glass-hover shrink-0 text-sm text-dark-200 hover:text-white transition-all"
          >
            <Copy size={14} className="text-dark-400" />
            Meu ID
          </button>
        </div>

        {/* User ID display */}
        {showUserId && user && (
          <div className="card p-4 animate-slide-up flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-dark-400 text-xs mb-1">Seu User ID (copie para configurar admin):</div>
              <div className="text-dark-200 text-xs font-mono break-all select-all bg-dark-800 p-2 rounded-lg">{user.id}</div>
            </div>
            <button
              onClick={() => { navigator.clipboard.writeText(user.id); }}
              className="shrink-0 w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-400 hover:bg-primary-500/30 transition-all"
            >
              <Copy size={14} />
            </button>
          </div>
        )}

        {/* Daily Goal */}
        <div className="card p-5 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target size={18} className="text-primary-400" />
              <span className="text-white font-semibold text-sm">Meta Diária</span>
            </div>
            <span className="text-dark-300 text-sm">
              {dailyGoal.current}/{dailyGoal.target} lições
            </span>
          </div>
          <div className="w-full h-3 bg-dark-600 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${(dailyGoal.current / dailyGoal.target) * 100}%`,
                background: dailyGoal.current >= dailyGoal.target
                  ? 'linear-gradient(135deg, #10b981, #34d399)'
                  : 'linear-gradient(135deg, #7c3aed, #a855f7)',
              }}
            />
          </div>
          {dailyGoal.current >= dailyGoal.target && (
            <p className="text-success-400 text-xs mt-2 font-medium">Meta atingida! Parabéns!</p>
          )}
        </div>

        {/* Module Cards */}
        <div className="space-y-3">
          <h2 className="text-white font-bold text-lg">Módulos</h2>
          {modules.map((mod, i) => {
            const progress = moduleProgress[mod.key] || 0;
            return (
              <div
                key={mod.key}
                className="card p-5 flex items-center gap-4 animate-slide-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${mod.color} flex items-center justify-center shrink-0`}>
                  <mod.icon size={24} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white font-semibold">{mod.title}</h3>
                    <span className="text-dark-400 text-xs">{progress}%</span>
                  </div>
                  <p className="text-dark-400 text-xs mb-2">{mod.desc}</p>
                  <div className="w-full h-1.5 bg-dark-600 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${mod.color} transition-all duration-500`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <ChevronRight size={20} className="text-dark-400 shrink-0" />
              </div>
            );
          })}
        </div>

        {/* Daily Missions */}
        <div className="space-y-3">
          <h2 className="text-white font-bold text-lg">Missões do Dia</h2>
          <div className="card p-5 space-y-3">
            {missions.map((mission) => (
              <button
                key={mission.id}
                onClick={() => toggleMission(mission.id)}
                className="w-full flex items-center gap-3 py-2 group"
              >
                {mission.completed ? (
                  <CheckCircle2 size={22} className="text-success-400 shrink-0" />
                ) : (
                  <Circle size={22} className="text-dark-400 group-hover:text-primary-400 transition-colors shrink-0" />
                )}
                <span className={`flex-1 text-left text-sm ${mission.completed ? 'text-dark-400 line-through' : 'text-dark-100'}`}>
                  {mission.label}
                </span>
                <span className={`text-xs font-semibold ${mission.completed ? 'text-success-400' : 'text-accent-400'}`}>
                  +{mission.xp} XP
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Weekly Ranking */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-bold text-lg">Ranking Semanal</h2>
            <Trophy size={18} className="text-accent-400" />
          </div>
          <div className="card p-5 space-y-3">
            {rankings.length > 0 ? (
              rankings.map((r, i) => {
                const RankIcon = rankIcons[i] || Star;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <RankIcon size={20} className={rankColors[i]} />
                    <div className="w-8 h-8 gradient-purple rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {r.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="flex-1 text-dark-100 text-sm font-medium">{r.name}</span>
                    <span className="text-primary-400 text-sm font-bold">{r.xp_week} XP</span>
                  </div>
                );
              })
            ) : (
              [1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${i === 1 ? 'bg-accent-500/20 text-accent-400' : i === 2 ? 'bg-dark-500 text-dark-200' : 'bg-amber-900/30 text-amber-600'}`}>
                    {i}
                  </div>
                  <div className="w-8 h-8 bg-dark-600 rounded-full" />
                  <div className="flex-1 h-4 bg-dark-600 rounded" />
                  <div className="w-12 h-4 bg-dark-600 rounded" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
