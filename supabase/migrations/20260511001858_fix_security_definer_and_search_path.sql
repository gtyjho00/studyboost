/*
  # Fix Security Issues: SECURITY DEFINER, Search Path, and EXECUTE Permissions

  1. View Changes
    - `stripe_user_subscriptions`: Recreated as SECURITY INVOKER (was SECURITY DEFINER).
      The view already filters by `auth.uid()`, so SECURITY INVOKER is safe and correct.

  2. Function Changes
    - `add_xp(uuid, integer)`: Set `search_path = ''` to prevent search path injection.
      Revoked EXECUTE from `anon` and `authenticated` — this function should only be
      called by triggers or server-side code, not via REST API.
    - `handle_new_user()`: Set `search_path = ''`. Revoked EXECUTE from `anon` and
      `authenticated` — this is a trigger function for auth.users inserts, not for
      direct API calls.
    - `handle_new_user_role()`: Already has `search_path = ""`. Revoked EXECUTE from
      `anon` and `authenticated` — this is a trigger function for auth.users inserts,
      not for direct API calls.

  3. Security
    - All three functions remain SECURITY DEFINER (required for trigger functions that
      write to tables the calling user may not have direct access to), but are now
      protected from public execution via REST API.
    - Search path is pinned to empty string on all functions to prevent injection.
*/

-- ============================================================
-- 1. Fix stripe_user_subscriptions view: SECURITY DEFINER -> SECURITY INVOKER
-- ============================================================
CREATE OR REPLACE VIEW public.stripe_user_subscriptions
WITH (security_invoker = true) AS
SELECT
  sc.customer_id,
  ss.subscription_id,
  ss.status AS subscription_status,
  ss.price_id,
  ss.current_period_start,
  ss.current_period_end,
  ss.cancel_at_period_end,
  ss.payment_method_brand,
  ss.payment_method_last4
FROM public.stripe_customers sc
JOIN public.stripe_subscriptions ss ON sc.customer_id = ss.customer_id
WHERE sc.user_id = auth.uid()
  AND sc.deleted_at IS NULL
  AND ss.deleted_at IS NULL;

-- ============================================================
-- 2. Fix add_xp: set search_path and revoke public execution
-- ============================================================
CREATE OR REPLACE FUNCTION public.add_xp(user_uuid uuid, xp_amount integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.profiles SET
    xp = xp + xp_amount,
    coins = coins + FLOOR(xp_amount * 0.5),
    level = GREATEST(1, FLOOR((xp + xp_amount) / 200) + 1),
    streak = CASE
      WHEN DATE(last_study_at) = CURRENT_DATE - INTERVAL '1 day' THEN streak + 1
      WHEN DATE(last_study_at) = CURRENT_DATE THEN streak
      ELSE 1
    END,
    last_study_at = NOW()
  WHERE id = user_uuid;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.add_xp(uuid, integer) FROM anon;
REVOKE EXECUTE ON FUNCTION public.add_xp(uuid, integer) FROM authenticated;

-- ============================================================
-- 3. Fix handle_new_user: set search_path and revoke public execution
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', 'Estudante'),
    COALESCE(NEW.email, '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;

-- ============================================================
-- 4. Fix handle_new_user_role: revoke public execution (search_path already set)
-- ============================================================
REVOKE EXECUTE ON FUNCTION public.handle_new_user_role() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_role() FROM authenticated;
