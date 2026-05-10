import { useSubscription } from '../../hooks/useSubscription'
import { useAuth } from '../../hooks/useAuth'
import { useLessonLimit } from '../../hooks/useLessonLimit'
import { supabase } from '../../lib/supabase'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Crown, Zap, Lock, Star,
  Flame, Coins, Target, ChevronRight, CheckCircle2,
  Circle, Globe, Calculator, GraduationCap,
  Trophy
} from 'lucide-react'

interface UserProfile {
  name: string
  xp: number
  coins: number
  streak: number
  premium: boolean
}

interface Mission {
  id: string
  label: string
  completed: boolean
}

interface RankingUser {
  user_id: string
  name: string
  xp_week: number
}

export function Dashboard() {
  const { getSubscriptionPlan, isActive, isPremium } = useSubscription()
  const { user } = useAuth()
  const { remainingLessons, premium, todayCount, FREE_DAILY_LIMIT } = useLessonLimit()
  const navigate = useNavigate()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [missions, setMissions] = useState<Mission[]>([])
  const [ranking, setRanking] = useState<RankingUser[]>([])
  const [greeting, setGreeting] = useState('Bom dia')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) setGreeting('Bom dia')
    else if (hour >= 12 && hour < 18) setGreeting('Boa tarde')
    else setGreeting('Boa noite')
  }, [])

  useEffect(() => {
    if (!user) return

    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('name, xp, coins, streak, premium')
        .eq('id', user.id)
        .maybeSingle()

      if (data) setProfile(data as UserProfile)
    }

    const fetchMissions = async () => {
      const today = new Date().toISOString().split('T')[0]
      const { data } = await supabase
        .from('user_missions')
        .select('mission_id, completed')
        .eq('user_id', user.id)
        .eq('date', today)

      if (data && data.length > 0) {
        setMissions(data.map(m => ({
          id: m.mission_id,
          label: getMissionLabel(m.mission_id),
          completed: m.completed,
        })))
      } else {
        setMissions([
          { id: 'm1', label: 'Complete 1 lição', completed: false },
          { id: 'm2', label: 'Acerte 5 questões', completed: false },
          { id: 'm3', label: 'Estude 2 matérias', completed: false },
        ])
      }
    }

    const fetchRanking = async () => {
      const { data } = await supabase
        .from('rankings')
        .select('user_id, xp_week')
        .order('xp_week', { ascending: false })
        .limit(3)

      if (data && data.length > 0) {
        const userIds = data.map(r => r.user_id)
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', userIds)

        const nameMap = new Map(profilesData?.map(p => [p.id, p.name]) ?? [])
        setRanking(data.map(r => ({
          user_id: r.user_id,
          name: nameMap.get(r.user_id) || 'Estudante',
          xp_week: r.xp_week,
        })))
      }
    }

    fetchProfile()
    fetchMissions()
    fetchRanking()
  }, [user])

  const getMissionLabel = (id: string) => {
    const labels: Record<string, string> = {
      m1: 'Complete 1 lição',
      m2: 'Acerte 5 questões',
      m3: 'Estude 2 matérias',
    }
    return labels[id] || id
  }

  const toggleMission = async (missionId: string) => {
    if (!user) return
    const today = new Date().toISOString().split('T')[0]
    const mission = missions.find(m => m.id === missionId)
    if (!mission) return

    const newCompleted = !mission.completed
    setMissions(prev => prev.map(m =>
      m.id === missionId ? { ...m, completed: newCompleted } : m
    ))

    await supabase
      .from('user_missions')
      .upsert({
        user_id: user.id,
        mission_id: missionId,
        date: today,
        completed: newCompleted,
      }, { onConflict: 'user_id,mission_id,date' })
  }

  const activePlan = getSubscriptionPlan()
  const hasPremium = isPremium()
  const dailyGoal = premium ? 10 : 3
  const dailyProgress = Math.min(todayCount / dailyGoal, 1)

  const modules = [
    {
      name: 'Inglês',
      icon: Globe,
      color: 'from-blue-500 to-cyan-400',
      path: '/ingles',
      progress: 0,
    },
    {
      name: 'Matemática',
      icon: Calculator,
      color: 'from-emerald-500 to-teal-400',
      path: '/matematica',
      progress: 0,
    },
    {
      name: 'ENEM',
      icon: GraduationCap,
      color: 'from-amber-500 to-orange-400',
      path: '/enem',
      progress: 0,
    },
  ]

  return (
    <div className="min-h-screen bg-dark-900 pb-24">
      <div className="max-w-lg mx-auto px-4 py-6 space-y-5">

        {/* Top Stats Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-800 border border-white/5">
              <Star size={14} className="text-amber-400" />
              <span className="text-white text-sm font-bold">{profile?.xp ?? 0}</span>
              <span className="text-dark-400 text-xs">XP</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-800 border border-white/5">
              <Coins size={14} className="text-yellow-400" />
              <span className="text-white text-sm font-bold">{profile?.coins ?? 0}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-800 border border-white/5">
            <Flame size={14} className="text-orange-400" />
            <span className="text-white text-sm font-bold">{profile?.streak ?? 0}</span>
            <span className="text-dark-400 text-xs">dias</span>
          </div>
        </div>

        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-white">
            {greeting}, {profile?.name || 'Estudante'}!
          </h1>
          <p className="text-dark-400 text-sm mt-0.5">
            {premium ? 'Acesso ilimitado ativo' : `Lições restantes hoje: ${remainingLessons}`}
          </p>
        </div>

        {/* Daily Goal Progress */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-primary-400" />
              <span className="text-white text-sm font-semibold">Meta diária</span>
            </div>
            <span className="text-dark-300 text-sm">
              {todayCount}/{dailyGoal} lições
            </span>
          </div>
          <div className="w-full bg-dark-700 rounded-full h-3 overflow-hidden">
            <div
              className="gradient-purple h-3 rounded-full transition-all duration-500"
              style={{ width: `${dailyProgress * 100}%` }}
            />
          </div>
          {!premium && remainingLessons === 0 && (
            <button
              onClick={() => navigate('/pricing')}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-semibold hover:bg-amber-500/20 transition-all"
            >
              <Lock size={14} />
              Limite atingido — Assine Premium
            </button>
          )}
        </div>

        {/* Module Cards */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-bold text-lg">Matérias</h2>
            <button
              onClick={() => navigate('/materias')}
              className="text-primary-400 text-sm font-semibold flex items-center gap-1 hover:text-primary-300 transition-colors"
            >
              Ver todas <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {modules.map((mod) => (
              <button
                key={mod.name}
                onClick={() => navigate(mod.path)}
                className="card p-4 text-center group"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                  <mod.icon size={20} className="text-white" />
                </div>
                <p className="text-white text-sm font-semibold">{mod.name}</p>
                <p className="text-dark-400 text-xs mt-0.5">{mod.progress}%</p>
              </button>
            ))}
          </div>
        </div>

        {/* Daily Missions */}
        <div>
          <h2 className="text-white font-bold text-lg mb-3">Missões do dia</h2>
          <div className="card p-4 space-y-3">
            {missions.map((mission) => (
              <button
                key={mission.id}
                onClick={() => toggleMission(mission.id)}
                className="flex items-center gap-3 w-full text-left group"
              >
                {mission.completed ? (
                  <CheckCircle2 size={20} className="text-success-400 shrink-0" />
                ) : (
                  <Circle size={20} className="text-dark-500 shrink-0 group-hover:text-dark-300 transition-colors" />
                )}
                <span className={`text-sm ${mission.completed ? 'text-dark-400 line-through' : 'text-dark-200'}`}>
                  {mission.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Weekly Ranking Preview */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-bold text-lg">Ranking semanal</h2>
            <button
              onClick={() => navigate('/ranking')}
              className="text-primary-400 text-sm font-semibold flex items-center gap-1 hover:text-primary-300 transition-colors"
            >
              Ver mais <ChevronRight size={14} />
            </button>
          </div>
          <div className="card p-4 space-y-2">
            {ranking.length > 0 ? ranking.map((r, i) => (
              <div key={r.user_id} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold ${
                  i === 0 ? 'gradient-gold text-dark-900' :
                  i === 1 ? 'bg-dark-500 text-dark-200' :
                  'bg-dark-700 text-dark-400'
                }`}>
                  {i + 1}
                </div>
                <span className="text-white text-sm font-medium flex-1">{r.name}</span>
                <span className="text-dark-300 text-sm">{r.xp_week} XP</span>
              </div>
            )) : (
              <div className="flex items-center justify-center gap-2 py-4">
                <Trophy size={16} className="text-dark-500" />
                <span className="text-dark-400 text-sm">Nenhum dado ainda</span>
              </div>
            )}
          </div>
        </div>

        {/* Subscription Status */}
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                hasPremium ? 'gradient-gold' : 'bg-dark-700'
              }`}>
                <Crown size={20} className={hasPremium ? 'text-dark-900' : 'text-dark-400'} />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">
                  {hasPremium && activePlan ? activePlan.name : 'Plano Gratuito'}
                </p>
                <p className="text-dark-400 text-xs">
                  {hasPremium ? 'Acesso ilimitado' : '3 lições por dia'}
                </p>
              </div>
            </div>
            {!hasPremium && (
              <button
                onClick={() => navigate('/pricing')}
                className="btn-primary text-sm px-4 py-2 flex items-center gap-1.5"
              >
                <Zap size={14} />
                Premium
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
