import React from 'react';
import { Crown, Users } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';

export default function SubscriptionBadge() {
  const { getSubscriptionPlan, isActive } = useSubscription();
  
  const plan = getSubscriptionPlan();
  
  if (!isActive() || !plan) {
    return null;
  }

  const isFamily = plan.name.includes('Família');
  
  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
      isFamily 
        ? 'bg-purple-100 text-purple-800' 
        : 'bg-yellow-100 text-yellow-800'
    }`}>
      {isFamily ? (
        <Users className="w-3 h-3 mr-1" />
      ) : (
        <Crown className="w-3 h-3 mr-1" />
      )}
      {plan.name}
    </div>
  );
}