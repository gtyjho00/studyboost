import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { getProductByPriceId } from '../stripe-config';

interface SubscriptionData {
  subscription_id: string | null;
  subscription_status: string | null;
  price_id: string | null;
  current_period_start: number | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean | null;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    fetchSubscription();
  }, [user]);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      setSubscription(data || null);
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError('Erro ao carregar dados da assinatura');
    } finally {
      setLoading(false);
    }
  };

  const getSubscriptionPlan = () => {
    if (!subscription?.price_id) return null;
    return getProductByPriceId(subscription.price_id);
  };

  const isActive = () => {
    return subscription?.subscription_status === 'active';
  };

  const isPremium = () => {
    return isActive() && subscription?.subscription_status === 'active';
  };

  return {
    subscription,
    loading,
    error,
    refetch: fetchSubscription,
    plan: getSubscriptionPlan(),
    isActive: isActive(),
    isPremium: isPremium()
  };
}