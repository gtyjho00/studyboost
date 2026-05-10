-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Secure XP update function
CREATE OR REPLACE FUNCTION add_xp(user_uuid uuid, xp_amount int)
RETURNS void AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add last_study_at column if not exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_study_at timestamptz;

-- Allow reading all profiles for ranking
DROP POLICY IF EXISTS "Users can read all profiles for ranking" ON public.profiles;
CREATE POLICY "Users can read all profiles for ranking"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);
