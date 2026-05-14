-- =============================================================
-- PRODE MUNDIAL 2026 - Schema SQL para Supabase
-- Ejecutar en el SQL Editor de Supabase (en orden)
-- =============================================================

-- PROFILES (extiende auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MATCHES
CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  match_date TIMESTAMPTZ NOT NULL,
  stage TEXT NOT NULL CHECK (stage IN ('group','round_of_32','round_of_16','quarterfinal','semifinal','third_place','final')),
  group_name TEXT,
  home_score INTEGER,
  away_score INTEGER,
  is_finished BOOLEAN DEFAULT FALSE,
  venue TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PREDICTIONS
CREATE TABLE IF NOT EXISTS predictions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE NOT NULL,
  home_score INTEGER NOT NULL CHECK (home_score >= 0),
  away_score INTEGER NOT NULL CHECK (away_score >= 0),
  points INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, match_id)
);

-- =============================================================
-- ROW LEVEL SECURITY
-- =============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Profiles son visibles para todos los usuarios autenticados"
  ON profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuarios pueden insertar su propio perfil"
  ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil"
  ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- MATCHES policies
CREATE POLICY "Partidos visibles para todos los autenticados"
  ON matches FOR SELECT TO authenticated USING (true);

CREATE POLICY "Solo admins pueden insertar partidos"
  ON matches FOR INSERT TO authenticated
  WITH CHECK ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Solo admins pueden actualizar partidos"
  ON matches FOR UPDATE TO authenticated
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

-- PREDICTIONS policies
CREATE POLICY "Predicciones visibles para todos los autenticados"
  ON predictions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuarios pueden insertar sus propias predicciones"
  ON predictions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propias predicciones antes del partido"
  ON predictions FOR UPDATE TO authenticated
  USING (
    auth.uid() = user_id AND
    (SELECT match_date FROM matches WHERE id = match_id) > NOW()
  );

CREATE POLICY "Admins pueden actualizar puntos de predicciones"
  ON predictions FOR UPDATE TO authenticated
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

-- =============================================================
-- FUNCIONES
-- =============================================================

-- Calcula los puntos de una prediccion
CREATE OR REPLACE FUNCTION calculate_points(
  pred_home INTEGER,
  pred_away INTEGER,
  actual_home INTEGER,
  actual_away INTEGER
) RETURNS INTEGER AS $$
BEGIN
  IF pred_home = actual_home AND pred_away = actual_away THEN
    RETURN 3;
  END IF;
  IF (pred_home > pred_away AND actual_home > actual_away) OR
     (pred_home = pred_away AND actual_home = actual_away) OR
     (pred_home < pred_away AND actual_home < actual_away) THEN
    RETURN 1;
  END IF;
  RETURN 0;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger: crear perfil automaticamente al registrarse
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Trigger: actualizar updated_at en predictions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS predictions_updated_at ON predictions;
CREATE TRIGGER predictions_updated_at
  BEFORE UPDATE ON predictions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
