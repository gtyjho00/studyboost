import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { supabase } from '../lib/supabase';
import {
  ArrowLeft, Crown, Calendar, CreditCard, XCircle,
  ArrowUpRight, CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';
import { useState } from 'react';

export function SubscriptionPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscription, isActive, isPremium, getSubscriptionPlan, loading } = useSubscription();
  const [cancelling, setCancelling] = useState(false);

  const active = isActive();
  const hasPremium = isPremium();
  const plan = getSubscriptionPlan();
  const planName = plan?.name || null;

  const handleCancel = async () => {
    if (!subscription?.subscription_id) return;
    if (!confirm('Tem certeza que deseja cancelar? Você perderá o acesso premium ao final do período atual.')) return;

    setCancelling(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'cancel',
          subscription_id: subscription.subscription_id,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to cancel');
      }
    } catch (err) {
      console.error('Cancel error:', err);
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (timestamp: number | null | undefined) => {
    if (!timestamp) return '--';
    return new Date(timestamp * 1000).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <header className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-dark-300 hover:text-white transition-colors">
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-white font-bold text-lg">Minha Assinatura</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
        {/* Status Card */}
        <div className={`card p-6 ${hasPremium ? 'border-success-500/20' : 'border-dark-600'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              hasPremium ? 'gradient-gold' : 'bg-dark-700'
            }`}>
              <Crown size={24} className={hasPremium ? 'text-dark-900' : 'text-dark-400'} />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">
                {hasPremium ? planName || 'Premium' : 'Plano Gratuito'}
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                {hasPremium ? (
                  <>
                    <CheckCircle2 size={14} className="text-success-400" />
                    <span className="text-success-400 text-sm font-semibold">Ativo</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={14} className="text-dark-400" />
                    <span className="text-dark-400 text-sm">Sem assinatura</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {!hasPremium && (
            <button
              onClick={() => navigate('/pricing')}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Crown size={16} />
              Ver Planos Premium
            </button>
          )}
        </div>

        {/* Subscription Details */}
        {hasPremium && subscription && (
          <>
            <div className="card p-5 space-y-4">
              <h3 className="text-white font-semibold">Detalhes da Assinatura</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-dark-300 text-sm">
                    <Calendar size={16} />
                    Próxima cobrança
                  </div>
                  <span className="text-white text-sm font-medium">
                    {formatDate(subscription.current_period_end)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-dark-300 text-sm">
                    <CreditCard size={16} />
                    Cartão
                  </div>
                  <span className="text-white text-sm font-medium">
                    {subscription.payment_method_brand
                      ? `${subscription.payment_method_brand} ****${subscription.payment_method_last4}`
                      : 'N/A'}
                  </span>
                </div>

                {subscription.cancel_at_period_end && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <AlertCircle size={16} className="text-amber-400" />
                    <span className="text-amber-400 text-sm">
                      Cancelamento agendado para {formatDate(subscription.current_period_end)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="card p-5 space-y-3">
              <h3 className="text-white font-semibold">Gerenciar</h3>

              <button
                onClick={() => navigate('/pricing')}
                className="w-full py-2.5 rounded-xl bg-dark-700 text-dark-200 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-dark-600 transition-all border border-white/5"
              >
                <ArrowUpRight size={16} />
                Alterar Plano
              </button>

              {!subscription.cancel_at_period_end && (
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="w-full py-2.5 rounded-xl bg-red-500/10 text-red-400 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all border border-red-500/20 disabled:opacity-50"
                >
                  {cancelling ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <XCircle size={16} />
                  )}
                  Cancelar Assinatura
                </button>
              )}
            </div>
          </>
        )}

        {/* Free Plan Info */}
        {!hasPremium && (
          <div className="card p-5 space-y-3">
            <h3 className="text-white font-semibold">Plano Gratuito inclui:</h3>
            <ul className="space-y-2">
              {[
                '3 lições por dia',
                'Acesso ao Tutor IA básico',
                'Progresso salvo',
                'Rankings semanais',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-dark-300 text-sm">
                  <CheckCircle2 size={14} className="text-dark-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}