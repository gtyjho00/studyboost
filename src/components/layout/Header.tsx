import { useAuth } from '../../hooks/useAuth'
import { useSubscription } from '../../hooks/useSubscription'
import { Button } from '../ui/button'
import { Crown, LogOut, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function Header() {
  const { user, signOut } = useAuth()
  const { getSubscriptionPlan, isPremium } = useSubscription()
  const navigate = useNavigate()

  const activePlan = getSubscriptionPlan()
  const hasPremium = isPremium()

  return (
    <header className="bg-dark-900/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-purple rounded-lg flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">
              StudyBoost AI
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            {user && (
              <>
                <div className="text-sm text-dark-300 hidden sm:block">
                  {user.email}
                </div>

                {hasPremium && activePlan ? (
                  <button
                    onClick={() => navigate('/perfil/assinatura')}
                    className="flex items-center gap-1.5 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full text-sm font-medium text-primary-300 hover:bg-primary-500/20 transition-all"
                  >
                    <Crown size={14} />
                    {activePlan.name}
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/pricing')}
                    className="flex items-center gap-1.5 px-3 py-1 gradient-purple rounded-full text-sm font-medium text-white hover:opacity-90 transition-all"
                  >
                    <Crown size={14} />
                    Premium
                  </button>
                )}

                <Button
                  variant="outline"
                  onClick={signOut}
                  className="border-white/10 text-dark-300 hover:text-white hover:bg-dark-700"
                >
                  <LogOut size={16} />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
