-- =============================================================
-- PRODE MUNDIAL 2026 - Fixture Fase de Grupos
-- 12 grupos x 6 partidos = 72 partidos
-- Ejecutar DESPUÉS del schema.sql
-- =============================================================

-- GRUPO A: México, Sudáfrica, Corea del Sur, Chequia
INSERT INTO matches (home_team, away_team, match_date, stage, group_name, venue) VALUES
('México',        'Sudáfrica',    '2026-06-11 19:00:00-05', 'group', 'A', 'Ciudad de México'),
('Corea del Sur', 'Chequia',      '2026-06-11 22:00:00-05', 'group', 'A', 'Ciudad de México'),
('México',        'Corea del Sur','2026-06-15 19:00:00-05', 'group', 'A', 'Guadalajara'),
('Sudáfrica',     'Chequia',      '2026-06-15 16:00:00-05', 'group', 'A', 'Guadalajara'),
('México',        'Chequia',      '2026-06-26 16:00:00-05', 'group', 'A', 'Ciudad de México'),
('Sudáfrica',     'Corea del Sur','2026-06-26 16:00:00-05', 'group', 'A', 'Ciudad de México');

-- GRUPO B: Canadá, Suiza, Qatar, Bosnia y Herzegovina
INSERT INTO matches (home_team, away_team, match_date, stage, group_name, venue) VALUES
('Canadá',              'Bosnia y Herzegovina','2026-06-12 19:00:00-04', 'group', 'B', 'Toronto'),
('Suiza',               'Qatar',               '2026-06-12 22:00:00-04', 'group', 'B', 'Toronto'),
('Canadá',              'Suiza',               '2026-06-17 19:00:00-04', 'group', 'B', 'Vancouver'),
('Bosnia y Herzegovina','Qatar',               '2026-06-17 16:00:00-04', 'group', 'B', 'Vancouver'),
('Canadá',              'Qatar',               '2026-06-26 12:00:00-04', 'group', 'B', 'Toronto'),
('Suiza',               'Bosnia y Herzegovina','2026-06-26 12:00:00-04', 'group', 'B', 'Toronto');

-- GRUPO C: Brasil, Marruecos, Haití, Escocia
INSERT INTO matches (home_team, away_team, match_date, stage, group_name, venue) VALUES
('Brasil',    'Haití',    '2026-06-12 16:00:00-05', 'group', 'C', 'Los Ángeles'),
('Marruecos', 'Escocia',  '2026-06-12 13:00:00-05', 'group', 'C', 'San Francisco'),
('Brasil',    'Marruecos','2026-06-17 16:00:00-05', 'group', 'C', 'Los Ángeles'),
('Haití',     'Escocia',  '2026-06-17 13:00:00-05', 'group', 'C', 'San Francisco'),
('Brasil',    'Escocia',  '2026-06-25 16:00:00-05', 'group', 'C', 'Los Ángeles'),
('Marruecos', 'Haití',    '2026-06-25 16:00:00-05', 'group', 'C', 'San Francisco');

-- GRUPO D: Estados Unidos, Paraguay, Australia, Turquía
INSERT INTO matches (home_team, away_team, match_date, stage, group_name, venue) VALUES
('Estados Unidos', 'Paraguay',      '2026-06-12 13:00:00-07', 'group', 'D', 'Los Ángeles'),
('Australia',      'Turquía',       '2026-06-12 10:00:00-07', 'group', 'D', 'San Francisco'),
('Estados Unidos', 'Australia',     '2026-06-18 13:00:00-07', 'group', 'D', 'Los Ángeles'),
('Paraguay',       'Turquía',       '2026-06-18 10:00:00-07', 'group', 'D', 'San Francisco'),
('Estados Unidos', 'Turquía',       '2026-06-25 12:00:00-07', 'group', 'D', 'Los Ángeles'),
('Paraguay',       'Australia',     '2026-06-25 12:00:00-07', 'group', 'D', 'San Francisco');

-- GRUPO E: Alemania, Curazao, Costa de Marfil, Ecuador
INSERT INTO matches (home_team, away_team, match_date, stage, group_name, venue) VALUES
('Alemania',       'Curazao',         '2026-06-13 18:00:00-04', 'group', 'E', 'Nueva York'),
('Costa de Marfil','Ecuador',         '2026-06-13 15:00:00-04', 'group', 'E', 'Boston'),
('Alemania',       'Costa de Marfil', '2026-06-18 18:00:00-04', 'group', 'E', 'Nueva York'),
('Curazao',        'Ecuador',         '2026-06-18 15:00:00-04', 'group', 'E', 'Boston'),
('Alemania',       'Ecuador',         '2026-06-26 12:00:00-04', 'group', 'E', 'Nueva York'),
('Curazao',        'Costa de Marfil', '2026-06-26 12:00:00-04', 'group', 'E', 'Boston');

-- GRUPO F: Países Bajos, Japón, Túnez, Suecia
INSERT INTO matches (home_team, away_team, match_date, stage, group_name, venue) VALUES
('Países Bajos', 'Japón',        '2026-06-13 18:00:00-05', 'group', 'F', 'Dallas'),
('Túnez',        'Suecia',       '2026-06-13 15:00:00-05', 'group', 'F', 'Houston'),
('Países Bajos', 'Túnez',        '2026-06-19 18:00:00-05', 'group', 'F', 'Dallas'),
('Japón',        'Suecia',       '2026-06-19 15:00:00-05', 'group', 'F', 'Houston'),
('Países Bajos', 'Suecia',       '2026-06-26 16:00:00-05', 'group', 'F', 'Dallas'),
('Japón',        'Túnez',        '2026-06-26 16:00:00-05', 'group', 'F', 'Houston');

-- GRUPO G: Bélgica, Egipto, Irán, Nueva Zelanda
INSERT INTO matches (home_team, away_team, match_date, stage, group_name, venue) VALUES
('Bélgica',      'Egipto',       '2026-06-14 18:00:00-04', 'group', 'G', 'Filadelfia'),
('Irán',         'Nueva Zelanda','2026-06-14 15:00:00-04', 'group', 'G', 'Miami'),
('Bélgica',      'Irán',         '2026-06-19 18:00:00-04', 'group', 'G', 'Filadelfia'),
('Egipto',       'Nueva Zelanda','2026-06-19 15:00:00-04', 'group', 'G', 'Miami'),
('Bélgica',      'Nueva Zelanda','2026-06-25 16:00:00-04', 'group', 'G', 'Filadelfia'),
('Egipto',       'Irán',         '2026-06-25 16:00:00-04', 'group', 'G', 'Miami');

-- GRUPO H: España, Cabo Verde, Arabia Saudita, Uruguay
INSERT INTO matches (home_team, away_team, match_date, stage, group_name, venue) VALUES
('España',        'Arabia Saudita','2026-06-14 18:00:00-04', 'group', 'H', 'Atlanta'),
('Uruguay',       'Cabo Verde',    '2026-06-14 15:00:00-04', 'group', 'H', 'Charlotte'),
('España',        'Uruguay',       '2026-06-19 18:00:00-04', 'group', 'H', 'Atlanta'),
('Arabia Saudita','Cabo Verde',    '2026-06-19 15:00:00-04', 'group', 'H', 'Charlotte'),
('España',        'Cabo Verde',    '2026-06-27 16:00:00-04', 'group', 'H', 'Atlanta'),
('Uruguay',       'Arabia Saudita','2026-06-27 16:00:00-04', 'group', 'H', 'Charlotte');

-- GRUPO I: Francia, Senegal, Noruega, Irak
INSERT INTO matches (home_team, away_team, match_date, stage, group_name, venue) VALUES
('Francia', 'Senegal', '2026-06-15 18:00:00-04', 'group', 'I', 'Miami'),
('Noruega', 'Irak',    '2026-06-15 15:00:00-04', 'group', 'I', 'Kansas City'),
('Francia', 'Noruega', '2026-06-21 18:00:00-04', 'group', 'I', 'Miami'),
('Senegal', 'Irak',    '2026-06-21 15:00:00-04', 'group', 'I', 'Kansas City'),
('Francia', 'Irak',    '2026-06-26 16:00:00-04', 'group', 'I', 'Miami'),
('Senegal', 'Noruega', '2026-06-26 16:00:00-04', 'group', 'I', 'Kansas City');

-- GRUPO J: Argentina, Argelia, Austria, Jordania
INSERT INTO matches (home_team, away_team, match_date, stage, group_name, venue) VALUES
('Argentina', 'Argelia', '2026-06-15 18:00:00-05', 'group', 'J', 'Dallas'),
('Austria',   'Jordania','2026-06-15 15:00:00-05', 'group', 'J', 'Houston'),
('Argentina', 'Austria', '2026-06-21 18:00:00-05', 'group', 'J', 'Dallas'),
('Argelia',   'Jordania','2026-06-21 15:00:00-05', 'group', 'J', 'Houston'),
('Argentina', 'Jordania','2026-06-27 16:00:00-05', 'group', 'J', 'Dallas'),
('Argelia',   'Austria', '2026-06-27 16:00:00-05', 'group', 'J', 'Houston');

-- GRUPO K: Portugal, Uzbekistán, Colombia, Congo DR
INSERT INTO matches (home_team, away_team, match_date, stage, group_name, venue) VALUES
('Portugal',   'Uzbekistán','2026-06-16 18:00:00-04', 'group', 'K', 'Boston'),
('Colombia',   'Congo DR',  '2026-06-16 15:00:00-04', 'group', 'K', 'Atlanta'),
('Portugal',   'Colombia',  '2026-06-22 18:00:00-04', 'group', 'K', 'Boston'),
('Uzbekistán', 'Congo DR',  '2026-06-22 15:00:00-04', 'group', 'K', 'Atlanta'),
('Portugal',   'Congo DR',  '2026-06-26 16:00:00-04', 'group', 'K', 'Boston'),
('Uzbekistán', 'Colombia',  '2026-06-26 16:00:00-04', 'group', 'K', 'Atlanta');

-- GRUPO L: Inglaterra, Croacia, Ghana, Panamá
INSERT INTO matches (home_team, away_team, match_date, stage, group_name, venue) VALUES
('Inglaterra', 'Panamá',  '2026-06-16 18:00:00-04', 'group', 'L', 'Nueva York'),
('Croacia',    'Ghana',   '2026-06-16 15:00:00-04', 'group', 'L', 'Filadelfia'),
('Inglaterra', 'Croacia', '2026-06-22 18:00:00-04', 'group', 'L', 'Nueva York'),
('Ghana',      'Panamá',  '2026-06-22 15:00:00-04', 'group', 'L', 'Filadelfia'),
('Inglaterra', 'Ghana',   '2026-06-27 16:00:00-04', 'group', 'L', 'Nueva York'),
('Croacia',    'Panamá',  '2026-06-27 16:00:00-04', 'group', 'L', 'Filadelfia');

-- =============================================================
-- NOTA: Los partidos de eliminatoria (Round of 32, Round of 16,
-- Cuartos, Semis, 3er puesto y Final) se agregan una vez
-- definidos los clasificados. Las fechas son del 1 al 19 de julio.
-- =============================================================
