import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Crown } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';

export default function Success() {
  const navigate = useNavigate();
  const { getSubscriptionPlan } = useSubscription();
  const [plan, setPlan] = useState<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentPlan = getSubscriptionPlan();
      setPlan(currentPlan);
    }, 2000);

    return () => clearTimeout(timer);
  }, [getSubscriptionPlan]);

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="card p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 gradient-gold rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Crown size={32} className="text-dark-900" />
            </div>
            <CheckCircle className="w-12 h-12 text-success-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">
              Pagamento Confirmado!
            </h1>
            <p className="text-dark-300">
              Sua assinatura foi ativada com sucesso
            </p>
          </div>

          {plan && (
            <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-6 mb-6">
              <Crown className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-white mb-1">
                {plan.name}
              </h3>
              <p className="text-sm text-dark-300">
                Agora você tem acesso a todos os recursos premium!
              </p>
            </div>
          )}

          <div className="space-y-4 mb-8">
            <div className="flex items-center text-left">
              <CheckCircle className="w-5 h-5 text-success-400 mr-3 shrink-0" />
              <span className="text-dark-200">Acesso ilimitado a lições</span>
            </div>
            <div className="flex items-center text-left">
              <CheckCircle className="w-5 h-5 text-success-400 mr-3 shrink-0" />
              <span className="text-dark-200">Certificados de conclusão</span>
            </div>
            <div className="flex items-center text-left">
              <CheckCircle className="w-5 h-5 text-success-400 mr-3 shrink-0" />
              <span className="text-dark-200">Suporte prioritário</span>
            </div>
            {plan?.name.includes('Família') && (
              <div className="flex items-center text-left">
                <CheckCircle className="w-5 h-5 text-success-400 mr-3 shrink-0" />
                <span className="text-dark-200">Até 6 contas familiares</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full gradient-purple text-white py-3 px-4 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center"
            >
              Começar a Estudar
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>

            <button
              onClick={() => navigate('/perfil/assinatura')}
              className="w-full bg-dark-700 hover:bg-dark-600 text-dark-200 py-3 px-4 rounded-xl font-medium transition-colors duration-200 border border-white/5"
            >
              Ver Minha Assinatura
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
