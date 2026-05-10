import React from 'react';
import { Crown, Check, Loader2 } from 'lucide-react';
import { stripeProducts, formatPrice } from '../stripe-config';
import { useStripe } from '../hooks/useStripe';
import { useSubscription } from '../hooks/useSubscription';

export default function Premium() {
  const { createCheckoutSession, loading: checkoutLoading, error } = useStripe();
  const { subscription, getSubscriptionPlan, isActive } = useSubscription();

  const currentPlan = getSubscriptionPlan();

  const handleSubscribe = async (product: typeof stripeProducts[0]) => {
    await createCheckoutSession(product);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha seu Plano Premium
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Desbloqueie todo o potencial do StudyBoost AI com acesso ilimitado a lições,
            certificados e recursos exclusivos.
          </p>
        </div>

        {isActive() && currentPlan && (
          <div className="mb-8 p-4 bg-green-100 border border-green-300 rounded-lg text-center">
            <p className="text-green-800 font-medium">
              Você tem o plano <strong>{currentPlan.name}</strong> ativo
            </p>
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-red-100 border border-red-300 rounded-lg text-center">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stripeProducts.map((product) => {
            const isCurrentPlan = currentPlan?.priceId === product.priceId;
            const isFamily = product.name.includes('Família');
            const isAnnual = product.interval === 'year';

            return (
              <div
                key={product.id}
                className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                  isFamily ? 'border-purple-500 transform scale-105' : 'border-gray-200'
                }`}
              >
                {isFamily && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Mais Popular
                    </span>
                  </div>
                )}

                {isAnnual && (
                  <div className="absolute -top-2 -right-2">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      2 meses grátis
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {product.description}
                    </p>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900">
                        {formatPrice(product.price, product.currency)}
                      </span>
                      <span className="text-gray-600 ml-2">
                        /{product.interval === 'month' ? 'mês' : 'ano'}
                      </span>
                    </div>
                    {isAnnual && (
                      <p className="text-sm text-green-600 font-medium">
                        Economize {product.interval === 'year' ? '17%' : ''}
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(product)}
                    disabled={checkoutLoading || isCurrentPlan}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                      isCurrentPlan
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : isFamily
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {checkoutLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    ) : isCurrentPlan ? (
                      'Plano Atual'
                    ) : (
                      'Assinar Agora'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Todos os planos incluem garantia de 7 dias. Cancele a qualquer momento.
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            <span>✓ Pagamento seguro</span>
            <span>✓ Sem taxas ocultas</span>
            <span>✓ Suporte 24/7</span>
          </div>
        </div>
      </div>
    </div>
  );
}