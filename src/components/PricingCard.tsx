import React, { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { StripeProduct, formatPrice } from '../stripe-config';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface PricingCardProps {
  product: StripeProduct;
  isPopular?: boolean;
}

export function PricingCard({ product, isPopular = false }: PricingCardProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId: product.priceId }
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
      isPopular ? 'border-indigo-500 scale-105' : 'border-gray-200'
    }`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium">
            Mais Popular
          </span>
        </div>
      )}
      
      <div className="p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-900">
              {formatPrice(product.price, product.currency)}
            </span>
            <span className="text-gray-600 ml-2">
              /{product.interval === 'month' ? 'mês' : 'ano'}
            </span>
          </div>
        </div>

        <ul className="space-y-4 mb-8">
          {product.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={handleSubscribe}
          disabled={loading}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
            isPopular
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processando...
            </>
          ) : (
            'Assinar Agora'
          )}
        </button>
      </div>
    </div>
  );
}