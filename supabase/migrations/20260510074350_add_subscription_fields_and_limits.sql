/*
  # Add Subscription Fields and Family Groups

  1. Modified Tables
    - `profiles` — Add premium_expires_at, stripe_customer_id, stripe_subscription_id columns

  2. New Tables
    - `family_groups` — Tracks family plan memberships (owner + members)
    - `lesson_access_log` — Tracks daily lesson completions for free plan limit enforcement

  3. Security
    - RLS enabled on family_groups and lesson_access_log
    - Users can only read their own family group and lesson access

  4. Important Notes
    - premium_expires_at tracks when premium access ends
    - lesson_access_log used to enforce 3-lesson/day free limit
    - family_groups supports up to 6 members per family plan
*/

-- Add subscription fields to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'premium_expires_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN premium_expires_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'stripe_customer_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN stripe_customer_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'stripe_subscription_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN stripe_subscription_id text;
  END IF;
END $$;

-- Family groups table
CREATE TABLE IF NOT EXISTS family_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (owner_id, member_id)
);

ALTER TABLE family_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own family groups"
  ON family_groups FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id OR auth.uid() = member_id);

CREATE POLICY "Owners can insert family members"
  ON family_groups FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can delete family members"
  ON family_groups FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Lesson access log for free plan limits
CREATE TABLE IF NOT EXISTS lesson_access_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  access_date date NOT NULL DEFAULT CURRENT_DATE,
  accessed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id, access_date)
);

ALTER TABLE lesson_access_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own access log"
  ON lesson_access_log FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own access log"
  ON lesson_access_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create index for fast daily count queries
CREATE INDEX IF NOT EXISTS idx_lesson_access_user_date
  ON lesson_access_log (user_id, access_date);

-- View for users to read their own subscription data
CREATE OR REPLACE VIEW stripe_user_subscriptions AS
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
FROM stripe_customers sc
JOIN stripe_subscriptions ss ON sc.customer_id = ss.customer_id
WHERE sc.user_id = auth.uid()
  AND sc.deleted_at IS NULL
  AND ss.deleted_at IS NULL;

GRANT SELECT ON stripe_user_subscriptions TO authenticated;
