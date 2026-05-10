import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

const FREE_DAILY_LIMIT = 3;

export function useLessonLimit() {
  const { user } = useAuth();
  const [todayCount, setTodayCount] = useState(0);
  const [premium, setPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchLimitStatus = useCallback(async () => {
    if (!user) { setLoading(false); return; }

    const { data: profile } = await supabase
      .from('profiles')
      .select('premium, premium_expires_at')
      .eq('id', user.id)
      .maybeSingle();

    // Premium is active if flag is true AND not expired
    let isPremium = false;
    if (profile?.premium) {
      if (profile.premium_expires_at) {
        isPremium = new Date(profile.premium_expires_at) > new Date();
      } else {
        isPremium = true;
      }
    }
    setPremium(isPremium);

    const today = new Date().toISOString().split('T')[0];
    const { count } = await supabase
      .from('lesson_access_log')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('access_date', today);

    setTodayCount(count ?? 0);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchLimitStatus();
  }, [fetchLimitStatus]);

  const canAccessLesson = premium || todayCount < FREE_DAILY_LIMIT;
  const remainingLessons = premium ? Infinity : Math.max(0, FREE_DAILY_LIMIT - todayCount);

  const logLessonAccess = async (lessonId: string) => {
    if (!user) return;
    const { error } = await supabase.from('lesson_access_log').insert({
      user_id: user.id,
      lesson_id: lessonId,
      access_date: new Date().toISOString().split('T')[0],
    });
    if (!error) {
      setTodayCount((prev) => prev + 1);
    }
  };

  return {
    canAccessLesson,
    remainingLessons,
    todayCount,
    premium,
    loading,
    logLessonAccess,
    FREE_DAILY_LIMIT,
    refetch: fetchLimitStatus,
  };
}
