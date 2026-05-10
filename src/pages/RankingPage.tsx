import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Trophy, Zap, Crown, Medal, Star } from 'lucide-react'

interface RankUser {
  id: string
  name: string
  xp: number
  level: number
  streak: number
}

function getLiga(xp: number) {
  if (xp >= 3001) return { name: 'Diamante', color: 'text-cyan-400', bg: 'bg-cyan-400/20' }
  if (xp >= 1501) return { name: 'Ouro', color: 'text-yellow-400', bg: 'bg-yellow-400/20' }
  if (xp >= 501) return { name: 'Prata', color: 'text-gray-300', bg: 'bg-gray-300/20' }
  return { name: 'Bronze', color: 'text-orange-400', bg: 'bg-orange-400/20' }
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function RankingPage() {
  const { user, profile } = useAuth()
  const [users, setUsers] = useState<RankUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRanking = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, name, xp, level, streak')
        .order('xp', { ascending: false })
        .limit(50)

      if (data) setUsers(data as RankUser[])
      setLoading(false)
    }

    fetchRanking()

    const channel = supabase
      .channel('ranking')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, fetchRanking)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const myPosition = users.findIndex(u => u.id === user?.id) + 1
  const top3 = users.slice(0, 3)
  const rest = users.slice(3)

  const podiumOrder = top3.length === 3 ? [top3[1], top3[0], top3[2]] : top3

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 gradient-purple rounded-xl flex items-center justify-center">
          <Trophy size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-xl">Ranking Semanal</h1>
          <p className="text-dark-400 text-sm">Liga Diamante · Atualizado em tempo real</p>
        </div>
      </div>

      {myPosition > 0 && (
        <div className="card p-4 mb-6 border-primary-500/30 flex items-center gap-3">
          <div className="w-8 h-8 gradient-purple rounded-lg flex items-center justify-center text-white font-bold text-sm">
            #{myPosition}
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">Sua posição</p>
            <p className="text-dark-400 text-xs">{profile?.xp || 0} XP total</p>
          </div>
          <div className={`px-2 py-1 rounded-lg text-xs font-semibold ${getLiga(profile?.xp || 0).bg} ${getLiga(profile?.xp || 0).color}`}>
            {getLiga(profile?.xp || 0).name}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {top3.length === 3 && (
            <div className="flex items-end justify-center gap-3 mb-8 px-4">
              {podiumOrder.map((u, i) => {
                const realPos = top3.indexOf(u) + 1
                const isFirst = realPos === 1
                const isMe = u.id === user?.id
                const heights = ['h-24', 'h-32', 'h-20']
                const colors = ['from-gray-400 to-gray-300', 'from-yellow-400 to-yellow-300', 'from-orange-500 to-orange-400']
                const icons = [<Medal size={16} />, <Crown size={18} />, <Star size={14} />]

                return (
                  <div key={u.id} className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mb-2 ${isMe ? 'ring-2 ring-primary-400' : ''}`}
                      style={{ background: isFirst ? 'linear-gradient(135deg,#f59e0b,#fbbf24)' : realPos === 2 ? 'linear-gradient(135deg,#9ca3af,#d1d5db)' : 'linear-gradient(135deg,#ea580c,#f97316)' }}>
                      {getInitials(u.name)}
                    </div>
                    <p className="text-white text-xs font-semibold text-center mb-1 truncate w-full text-center">{u.name.split(' ')[0]}</p>
                    <p className="text-dark-400 text-xs mb-2">{u.xp} XP</p>
                    <div className={`w-full ${heights[i]} bg-gradient-to-t ${colors[i]} rounded-t-xl flex items-center justify-center text-white`}>
                      {icons[i]}
                    </div>
                    <div className="w-full bg-dark-600 py-1 text-center text-white text-xs font-bold rounded-b-lg">
                      #{realPos}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="space-y-2">
            {rest.map((u, i) => {
              const pos = i + 4
              const isMe = u.id === user?.id
              const liga = getLiga(u.xp)
              return (
                <div key={u.id} className={`card p-4 flex items-center gap-3 ${isMe ? 'border-primary-500/40 bg-primary-500/5' : ''}`}>
                  <span className="text-dark-400 font-bold text-sm w-6 text-center">#{pos}</span>
                  <div className="w-9 h-9 rounded-full gradient-purple flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {getInitials(u.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm truncate ${isMe ? 'text-primary-300' : 'text-white'}`}>
                      {u.name} {isMe && '(você)'}
                    </p>
                    <p className="text-dark-400 text-xs">{u.streak} dias 🔥</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-primary-400 text-sm font-bold">
                      <Zap size={12} />
                      {u.xp}
                    </div>
                    <span className={`text-xs ${liga.color}`}>{liga.name}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
