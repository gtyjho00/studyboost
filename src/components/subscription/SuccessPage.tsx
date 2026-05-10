import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { useSubscription } from '../../hooks/useSubscription'
import { CheckCircle2, Crown, Sparkles } from 'lucide-react'

export function SuccessPage() {
  const navigate = useNavigate()
  const { refetch } = useSubscription()

  useEffect(() => {
    const timer = setTimeout(() => {
      refetch()
    }, 2000)
    return () => clearTimeout(timer)
  }, [refetch])

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-dark-800 border-white/5">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 gradient-gold rounded-2xl flex items-center justify-center mb-4">
            <Crown size={32} className="text-dark-900" />
          </div>
          <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
            <CheckCircle2 size={24} className="text-success-400" />
            Pagamento Confirmado!
          </CardTitle>
          <CardDescription className="text-dark-300">
            Bem-vindo ao Premium! Sua assinatura foi ativada com sucesso
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-success-500/10 border border-success-500/20">
            <Sparkles size={16} className="text-success-400" />
            <span className="text-success-400 text-sm font-semibold">Acesso completo desbloqueado</span>
          </div>

          <p className="text-dark-300">
            Agora você tem acesso ilimitado a todos os recursos da plataforma.
          </p>

          <Button
            onClick={() => navigate('/')}
            className="w-full gradient-purple text-white border-0"
          >
            Começar a Aprender
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
