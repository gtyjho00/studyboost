import React from 'react';
import { Crown, Calendar, CreditCard } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { formatPrice } from '../stripe-config';

export function SubscriptionStatus() {
  const { subscription, plan, isActive, loading } = useSubscription();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!subscription || !isActive) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
            <Crown className="w-4 h-4 text-gray-500" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Plano Gratuito</p>
            <p className="text-sm text-gray-600">3 lições por dia</p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-4 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
            <Crown className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-medium">{plan?.name}</p>
            <p className="text-sm text-indigo-100">
              {plan && formatPrice(plan.price, plan.currency)}/{plan?.interval === 'month' ? 'mês' : 'ano'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center text-sm text-indigo-100 mb-1">
            <Calendar className="w-3 h-3 mr-1" />
            Renova em
          </div>
          <p className="text-sm font-medium">
            {subscription.current_period_end && formatDate(subscription.current_period_end)}
          </p>
        </div>
      </div>
      
      {subscription.payment_method_brand && subscription.payment_method_last4 && (
        <div className="mt-3 pt-3 border-t border-white/20">
          <div className="flex items-center text-sm text-indigo-100">
            <CreditCard className="w-3 h-3 mr-1" />
            {subscription.payment_method_brand.toUpperCase()} •••• {subscription.payment_method_last4}
          </div>
        </div>
      )}
      
      {subscription.cancel_at_period_end && (
        <div className="mt-2 text-sm text-yellow-200">
          ⚠️ Assinatura será cancelada no final do período
        </div>
      )}
    </div>
  );
}