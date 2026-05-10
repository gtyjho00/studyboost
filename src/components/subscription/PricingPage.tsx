import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';
import { stripeProducts, formatPrice } from '../../stripe-config';
import { createCheckoutSession } from '../../services/stripe';
import { ArrowLeft, Check, Zap, Crown, Users, Sparkles, Loader2 } from 'lucide-react';

export function PricingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPremium, getSubscriptionPlan } = useSubscription();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleSubscribe = async (product: typeof stripeProducts[0]) => {
    if (!user) {
      navigate('/');
      return;
    }
    setLoadingId(product.id);
    setError('');

    try {
      const { url } = await createCheckoutSession({
        price_id: product.priceId,
        success_url: `${window.location.origin}/success`,
        cancel_url: `${window.location.origin}/pricing`,
        mode: product.mode,
      });
      if (url) window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar pagamento');
    } finally {
      setLoadingId(null);
    }
  };

  const planIcons: Record<string, typeof Zap> = {
    'Premium Mensal': Zap,
    'Premium Anual': Crown,
    'Família Mensal': Users,
    'Família Anual': Sparkles,
  };

  const planColors: Record<string, string> = {
    'Premium Mensal': 'from-blue-500 to-cyan-400',
    'Premium Anual': 'from-amber-500 to-orange-400',
    'Família Mensal': 'from-emerald-500 to-teal-400',
    'Família Anual': 'from-rose-500 to-pink-400',
  };

  const monthlyPrice = (product: typeof stripeProducts[0]) => {
    if (product.interval === 'month') return product.price;
    return product.price / 12;
  };

  const popularPlanId = 'prod_UUACWHRV7IKbIj';

  return (
    <div className="min-h-screen bg-dark-900">
      <header className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-dark-300 hover:text-white transition-colors">
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-white font-bold text-lg">Planos Premium</h1>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 mb-4">
            <Crown size={14} className="text-primary-400" />
            <span className="text-primary-300 text-sm font-semibold">Desbloqueie todo o potencial</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Escolha seu plano
          </h2>
          <p className="text-dark-300 text-lg max-w-xl mx-auto">
            Acesse lições ilimitadas, certificados, tutor IA e muito mais
          </p>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {isPremium() && getSubscriptionPlan() && (
          <div className="max-w-md mx-auto mb-6 p-3 rounded-xl bg-success-500/10 border border-success-500/20 text-success-400 text-sm text-center">
            Você já tem o plano {getSubscriptionPlan()!.name} ativo
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {stripeProducts.map((product) => {
            const Icon = planIcons[product.name] || Zap;
            const gradient = planColors[product.name] || 'from-blue-500 to-cyan-400';
            const isLoading = loadingId === product.id;
            const isCurrentPlan = isPremium() && getSubscriptionPlan()?.name === product.name;
            const isPopular = product.id === popularPlanId;

            return (
              <div
                key={product.id}
                className={`card p-6 relative overflow-hidden animate-slide-up ${
                  isPopular ? 'border-primary-500/30 ring-1 ring-primary-500/20' : ''
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-gradient-to-r from-primary-500 to-primary-400 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                      MAIS POPULAR
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{product.name}</h3>
                    <p className="text-dark-400 text-xs">{product.description}</p>
                  </div>
                </div>

                <div className="mb-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">
                      {formatPrice(product.price, product.currency)}
                    </span>
                    <span className="text-dark-400 text-sm">
                      /{product.interval === 'month' ? 'mês' : 'ano'}
                    </span>
                  </div>
                  {product.interval === 'year' && (
                    <div className="text-success-400 text-sm font-semibold mt-1">
                      {formatPrice(monthlyPrice(product), product.currency)}/mês
                    </div>
                  )}
                </div>

                <ul className="space-y-2.5 mb-6">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
                        <Check size={12} className="text-white" />
                      </div>
                      <span className="text-dark-200">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(product)}
                  disabled={isLoading || isCurrentPlan}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                    isCurrentPlan
                      ? 'bg-dark-700 text-dark-400 cursor-default'
                      : isPopular
                        ? 'gradient-purple text-white shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30'
                        : 'bg-dark-700 text-white hover:bg-dark-600 border border-white/5'
                  }`}
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : isCurrentPlan ? (
                    'Plano Atual'
                  ) : (
                    <>
                      <Zap size={16} />
                      Assinar Agora
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <p className="text-dark-400 text-sm">
            Plano gratuito: 3 lições por dia com recursos básicos
          </p>
        </div>
      </div>
    </div>
  );
}
