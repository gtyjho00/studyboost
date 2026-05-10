import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import {
  ArrowLeft, User, Zap, Flame, Coins, Crown,
  Shield, Award, ChevronRight, LogOut, Save
} from 'lucide-react'

function getLiga(xp: number) {
  if (xp >= 3001) return { name: 'Diamante', color: 'text-cyan-400', bg: 'bg-cyan-400/20' }
  if (xp >= 1501) return { name: 'Ouro', color: 'text-yellow-400', bg: 'bg-yellow-400/20' }
  if (xp >= 501) return { name: 'Prata', color: 'text-gray-300', bg: 'bg-gray-300/20' }
  return { name: 'Bronze', color: 'text-orange-400', bg: 'bg-orange-400/20' }
}

export function Profile() {
  const navigate = useNavigate()
  const { user, profile, signOut, refreshProfile } = useAuth()
  const [editName, setEditName] = useState(profile?.name || '')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const name = profile?.name || user?.user_metadata?.name || 'Estudante'
  const email = profile?.email || user?.email || ''
  const xp = profile?.xp || 0
  const level = profile?.level || 1
  const coins = profile?.coins || 0
  const streak = profile?.streak || 0
  const premium = profile?.premium || false
  const liga = getLiga(xp)

  const xpForNextLevel = level * 200
  const xpProgress = Math.min((xp / xpForNextLevel) * 100, 100)

  const handleSave = async () => {
    if (!user || !editName.trim()) return
    setSaving(true)
    await supabase
      .from('profiles')
      .update({ name: editName.trim() })
      .eq('id', user.id)
    await refreshProfile()
    setEditing(false)
    setSaving(false)
  }

  const menuItems = [
    { label: 'Assinatura', icon: Crown, path: '/perfil/assinatura', color: 'text-yellow-400' },
    { label: 'Certificados', icon: Award, path: '/certificados', color: 'text-accent-400' },
    { label: 'Ranking', icon: Shield, path: '/ranking', color: 'text-primary-400' },
    { label: 'Premium', icon: Zap, path: '/premium', color: 'text-amber-400' },
  ]

  return (
    <div className="min-h-screen bg-dark-900 pb-24">
      <header className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="text-dark-300 hover:text-white transition-colors">
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-white font-bold text-lg">Perfil</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Avatar & Name */}
        <div className="text-center">
          <div className="w-24 h-24 gradient-purple rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4">
            {name.charAt(0).toUpperCase()}
          </div>

          {editing ? (
            <div className="flex items-center gap-2 justify-center mb-2">
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-dark-700 border border-white/10 rounded-lg px-3 py-2 text-white text-sm text-center w-48 focus:outline-none focus:border-primary-500"
                autoFocus
              />
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-9 h-9 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-400 hover:bg-primary-500/30 transition-all"
              >
                <Save size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setEditName(name); setEditing(true) }}
              className="text-white font-bold text-xl mb-1 hover:text-primary-300 transition-colors"
            >
              {name}
            </button>
          )}

          <p className="text-dark-400 text-sm">{email}</p>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full mt-3 ${liga.bg}`}>
            <span className={`text-sm font-semibold ${liga.color}`}>{liga.name}</span>
          </div>
          {premium && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mt-2 ml-2 bg-yellow-400/20">
              <Crown size={14} className="text-yellow-400" />
              <span className="text-sm font-semibold text-yellow-400">Premium</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="card p-4 text-center">
            <Zap size={20} className="text-primary-400 mx-auto mb-1" />
            <p className="text-white font-bold text-lg">{xp}</p>
            <p className="text-dark-400 text-xs">XP Total</p>
          </div>
          <div className="card p-4 text-center">
            <Flame size={20} className="text-accent-400 mx-auto mb-1" />
            <p className="text-white font-bold text-lg">{streak}</p>
            <p className="text-dark-400 text-xs">Streak</p>
          </div>
          <div className="card p-4 text-center">
            <Coins size={20} className="text-yellow-400 mx-auto mb-1" />
            <p className="text-white font-bold text-lg">{coins}</p>
            <p className="text-dark-400 text-xs">Moedas</p>
          </div>
        </div>

        {/* Level Progress */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-semibold text-sm">Nível {level}</span>
            <span className="text-dark-400 text-xs">{xp}/{xpForNextLevel} XP</span>
          </div>
          <div className="w-full h-3 bg-dark-600 rounded-full overflow-hidden">
            <div
              className="h-full gradient-purple rounded-full transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="card p-4 w-full flex items-center gap-3 hover:bg-dark-700/50 transition-all"
            >
              <item.icon size={20} className={item.color} />
              <span className="flex-1 text-left text-white font-medium text-sm">{item.label}</span>
              <ChevronRight size={18} className="text-dark-400" />
            </button>
          ))}
        </div>

        {/* Sign Out */}
        <button
          onClick={signOut}
          className="w-full py-3 rounded-xl bg-red-500/10 text-red-400 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all border border-red-500/20"
        >
          <LogOut size={16} />
          Sair da Conta
        </button>
      </div>
    </div>
  )
}
