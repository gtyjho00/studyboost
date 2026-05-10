/*
  # StudyBoost AI - Complete Database Schema

  1. New Tables
    - `profiles` — User profiles with XP, coins, streak, level, premium status
    - `lessons` — Lesson content organized by module, category, and level
    - `user_progress` — Tracks which lessons each user completed and their scores
    - `user_missions` — Daily mission completion tracking per user
    - `badges` — Achievement badges with conditions for earning
    - `user_badges` — Junction table tracking which badges each user earned
    - `rankings` — Weekly XP leaderboard data

  2. Security
    - RLS enabled on ALL tables
    - Users can only read/update their own profile
    - Users can only read/write their own progress, missions, and badges
    - Lessons and badges are readable by all authenticated users
    - Rankings readable by authenticated users, updatable only by own user

  3. Important Notes
    - profiles.id references auth.users.id (1:1 relationship)
    - user_progress and user_missions use composite primary keys
    - All tables have proper foreign key constraints
    - Default values provided for gamification fields (xp=0, coins=0, streak=0, level=1)
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  avatar text DEFAULT '',
  level integer NOT NULL DEFAULT 1,
  xp integer NOT NULL DEFAULT 0,
  coins integer NOT NULL DEFAULT 0,
  streak integer NOT NULL DEFAULT 0,
  premium boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module text NOT NULL,
  category text NOT NULL,
  level integer NOT NULL DEFAULT 1,
  title text NOT NULL,
  content_json jsonb NOT NULL DEFAULT '{}',
  xp_reward integer NOT NULL DEFAULT 50,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read lessons"
  ON lessons FOR SELECT
  TO authenticated
  USING (true);

-- User progress table
CREATE TABLE IF NOT EXISTS user_progress (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed boolean NOT NULL DEFAULT false,
  score integer NOT NULL DEFAULT 0,
  completed_at timestamptz,
  PRIMARY KEY (user_id, lesson_id)
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- User missions table
CREATE TABLE IF NOT EXISTS user_missions (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_id text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  date date NOT NULL DEFAULT CURRENT_DATE,
  PRIMARY KEY (user_id, mission_id, date)
);

ALTER TABLE user_missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own missions"
  ON user_missions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own missions"
  ON user_missions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own missions"
  ON user_missions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  label text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT '',
  condition_type text NOT NULL,
  condition_value integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read badges"
  ON badges FOR SELECT
  TO authenticated
  USING (true);

-- User badges table
CREATE TABLE IF NOT EXISTS user_badges (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, badge_id)
);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own badges"
  ON user_badges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges"
  ON user_badges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Rankings table
CREATE TABLE IF NOT EXISTS rankings (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  xp_week integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read rankings"
  ON rankings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own ranking"
  ON rankings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own ranking"
  ON rankings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed some lessons
INSERT INTO lessons (module, category, level, title, content_json, xp_reward) VALUES
  ('ingles', 'vocabulario', 1, 'Saudações Básicas', '{"type": "vocab", "words": [{"en": "Hello", "pt": "Olá"}, {"en": "Good morning", "pt": "Bom dia"}, {"en": "Good night", "pt": "Boa noite"}, {"en": "How are you?", "pt": "Como vai?"}, {"en": "Thank you", "pt": "Obrigado"}]}', 50),
  ('ingles', 'vocabulario', 2, 'Comida e Bebida', '{"type": "vocab", "words": [{"en": "Water", "pt": "Água"}, {"en": "Bread", "pt": "Pão"}, {"en": "Coffee", "pt": "Café"}, {"en": "Rice", "pt": "Arroz"}, {"en": "Chicken", "pt": "Frango"}]}', 60),
  ('ingles', 'gramatica', 1, 'Present Simple', '{"type": "grammar", "rule": "Sujeito + verbo (base form)", "examples": ["I play soccer", "She reads books", "They study English"]}', 70),
  ('ingles', 'gramatica', 2, 'Past Simple', '{"type": "grammar", "rule": "Sujeito + verbo (past form)", "examples": ["I played soccer", "She read a book", "They studied English"]}', 70),
  ('matematica', 'algebra', 1, 'Equações do 1º Grau', '{"type": "lesson", "content": "Uma equação do 1º grau tem a forma ax + b = 0", "examples": ["2x + 4 = 0 → x = -2", "3x - 9 = 0 → x = 3"]}', 50),
  ('matematica', 'algebra', 2, 'Sistemas Lineares', '{"type": "lesson", "content": "Dois ou mais equações com as mesmas variáveis", "examples": ["x + y = 5, x - y = 1 → x=3, y=2"]}', 70),
  ('matematica', 'geometria', 1, 'Áreas de Figuras Planas', '{"type": "lesson", "content": "Fórmulas de área para figuras básicas", "formulas": [{"shape": "Quadrado", "formula": "A = l²"}, {"shape": "Retângulo", "formula": "A = b × h"}, {"shape": "Triângulo", "formula": "A = (b × h)/2"}, {"shape": "Círculo", "formula": "A = πr²"}]}', 60),
  ('enem', 'matematica', 1, 'ENEM - Porcentagem', '{"type": "lesson", "content": "Questões de porcentagem frequentes no ENEM", "examples": ["15% de 200 = 30", "Aumento de 20% sobre R$150 = R$180"]}', 80),
  ('enem', 'ingles', 1, 'ENEM - Interpretação de Texto', '{"type": "lesson", "content": "Estratégias para interpretação de textos em inglês no ENEM", "tips": ["Leia o texto completo antes de responder", "Identifique palavras-chave", "Use o contexto para inferir significados"]}', 80);

-- Seed badges
INSERT INTO badges (key, label, description, icon, condition_type, condition_value) VALUES
  ('first_lesson', 'Primeira Lição', 'Complete sua primeira lição', 'trophy', 'lessons_completed', 1),
  ('streak_7', 'Semana Perfeita', 'Mantenha 7 dias de streak', 'flame', 'streak_days', 7),
  ('xp_500', 'Estudante Dedicado', 'Acumule 500 XP', 'star', 'xp_total', 500),
  ('xp_2000', 'Mestre do Conhecimento', 'Acumule 2000 XP', 'crown', 'xp_total', 2000),
  ('all_ingles', 'Polyglot', 'Complete todas as lições de Inglês', 'book-open', 'module_completed', 100),
  ('all_matematica', 'Matemático', 'Complete todas as lições de Matemática', 'calculator', 'module_completed', 100);
