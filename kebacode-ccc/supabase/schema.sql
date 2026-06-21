-- ============================================================
-- KebaCode CCC — Schéma Supabase (PostgreSQL)
-- Fondation Children Coding Club — Projet N°6
-- ============================================================

-- Extensions utiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------- Tables principales ----------

CREATE TABLE IF NOT EXISTS ville (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom_ville   TEXT NOT NULL UNIQUE,
  province    TEXT,
  pays        TEXT DEFAULT 'RDC',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS utilisateur (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pseudo       TEXT,
  age          INTEGER,
  tranche_age  TEXT,
  niveau       TEXT,
  id_ville     UUID REFERENCES ville(id) ON DELETE SET NULL,
  anonymise    BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campagne (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom         TEXT NOT NULL,
  theme       TEXT,
  statut      TEXT DEFAULT 'active' CHECK (statut IN ('active', 'terminee', 'archivee')),
  date_debut  DATE,
  date_fin    DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS session (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_utilisateur  UUID REFERENCES utilisateur(id) ON DELETE SET NULL,
  id_campagne     UUID REFERENCES campagne(id) ON DELETE SET NULL,
  mode            TEXT DEFAULT 'public' CHECK (mode IN ('public', 'formateur')),
  etat            TEXT,
  statut          TEXT DEFAULT 'en_cours' CHECK (statut IN ('en_cours', 'terminee', 'abandonnee')),
  contexte        JSONB DEFAULT '{}',
  duree           INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS question (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_externe     TEXT UNIQUE,
  texte          JSONB NOT NULL,
  theme          TEXT,
  type_reponse   TEXT DEFAULT 'closed' CHECK (type_reponse IN ('closed', 'open')),
  ordre          INTEGER DEFAULT 0,
  actif          BOOLEAN DEFAULT TRUE,
  profil_cible   TEXT DEFAULT 'tous' CHECK (profil_cible IN ('tous', 'enfant', 'ado', 'adulte')),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reponse (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_session     UUID NOT NULL REFERENCES session(id) ON DELETE CASCADE,
  id_question    UUID REFERENCES question(id) ON DELETE SET NULL,
  id_question_ext TEXT,
  valeur         TEXT,
  duree_saisie   INTEGER DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS parcours (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom            TEXT NOT NULL,
  description    TEXT,
  niveau         TEXT,
  profil_cible   TEXT,
  technologie    TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recommandation (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_session     UUID NOT NULL REFERENCES session(id) ON DELETE CASCADE,
  id_parcours    UUID REFERENCES parcours(id) ON DELETE SET NULL,
  parcours_key   TEXT,
  score          INTEGER DEFAULT 0,
  conseil        TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS commande (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_session     UUID REFERENCES session(id) ON DELETE SET NULL,
  texte_brut     TEXT NOT NULL,
  texte_corrige  TEXT,
  action         TEXT,
  objet          TEXT,
  statut         TEXT DEFAULT 'ok' CHECK (statut IN ('ok', 'erreur', 'corrige')),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS erreur (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_session     UUID REFERENCES session(id) ON DELETE SET NULL,
  type_erreur    TEXT,
  message        TEXT,
  entree_fautive TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS evenement (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_session     UUID REFERENCES session(id) ON DELETE SET NULL,
  type_evt       TEXT,
  etat_avant     TEXT,
  etat_apres     TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS formateur (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom            TEXT NOT NULL,
  prenom         TEXT,
  email          TEXT UNIQUE,
  mot_de_passe   TEXT,
  id_ville       UUID REFERENCES ville(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ---------- Données initiales ----------

INSERT INTO ville (nom_ville, province) VALUES
  ('Kinshasa', 'Kinshasa'),
  ('Lubumbashi', 'Haut-Katanga'),
  ('Goma', 'Nord-Kivu'),
  ('Bukavu', 'Sud-Kivu'),
  ('Kisangani', 'Tshopo'),
  ('Matadi', 'Kongo Central')
ON CONFLICT (nom_ville) DO NOTHING;

INSERT INTO campagne (nom, theme, statut, date_debut) VALUES
  ('Campagne Cybersécurité 2026', 'Cybersécurité', 'active', CURRENT_DATE)
ON CONFLICT DO NOTHING;

INSERT INTO question (id_externe, texte, theme, type_reponse, ordre, actif, profil_cible) VALUES
  ('q1', '{"fr":"As-tu déjà utilisé un téléphone ou une tablette ?"}', 'Découverte', 'closed', 1, true, 'enfant'),
  ('q2', '{"fr":"Chez toi, est-ce que tu arrives à te connecter à Internet ?"}', 'Découverte', 'closed', 2, true, 'enfant'),
  ('q3', '{"fr":"Connais-tu le codage ou Scratch ?"}', 'Création', 'closed', 3, true, 'tous'),
  ('q4', '{"fr":"Utilises-tu les réseaux sociaux ?"}', 'Cybersécurité', 'closed', 4, true, 'ado'),
  ('q5', '{"fr":"Sais-tu protéger ton mot de passe ?"}', 'Cybersécurité', 'closed', 5, true, 'tous'),
  ('q6', '{"fr":"T''intéresse-tu à Python ou la robotique ?"}', 'Logique', 'closed', 6, true, 'ado')
ON CONFLICT (id_externe) DO NOTHING;

INSERT INTO parcours (nom, description, niveau, profil_cible, technologie) VALUES
  ('Découverte numérique', 'Initiation au numérique', 'débutant', 'enfant', 'Scratch Junior'),
  ('Scratch avancé → Python', 'Parcours adolescent motivé', 'intermédiaire', 'ado', 'Scratch/Python'),
  ('Mentor Junior CCC', 'Futurs encadreurs', 'avancé', 'ado', 'Pédagogie'),
  ('Cybersécurité Jeunes', 'Protection en ligne', 'intermédiaire', 'ado', 'Cybersécurité');

-- ---------- Vues statistiques ----------

CREATE OR REPLACE VIEW v_stats_par_ville AS
SELECT
  v.nom_ville,
  COUNT(DISTINCT s.id) AS nb_sessions,
  COUNT(DISTINCT s.id_utilisateur) AS nb_participants
FROM ville v
LEFT JOIN utilisateur u ON u.id_ville = v.id
LEFT JOIN session s ON s.id_utilisateur = u.id
GROUP BY v.nom_ville
ORDER BY nb_participants DESC;

CREATE OR REPLACE VIEW v_tableau_bord AS
SELECT
  c.nom AS campagne,
  COUNT(DISTINCT s.id) AS total_sessions,
  COUNT(DISTINCT CASE WHEN s.statut = 'terminee' THEN s.id END) AS sessions_terminees,
  COUNT(DISTINCT CASE WHEN s.statut = 'abandonnee' THEN s.id END) AS abandons,
  ROUND(
    100.0 * COUNT(DISTINCT CASE WHEN s.statut = 'terminee' THEN s.id END)
    / NULLIF(COUNT(DISTINCT s.id), 0), 1
  ) AS taux_completion,
  AVG(s.duree) AS duree_moyenne
FROM campagne c
LEFT JOIN session s ON s.id_campagne = c.id
GROUP BY c.id, c.nom;

CREATE OR REPLACE VIEW v_erreurs_frequentes AS
SELECT
  type_erreur,
  entree_fautive,
  COUNT(*) AS occurrences,
  MAX(created_at) AS derniere_occurrence
FROM erreur
GROUP BY type_erreur, entree_fautive
ORDER BY occurrences DESC
LIMIT 20;

CREATE OR REPLACE VIEW v_parcours_populaires AS
SELECT
  COALESCE(p.nom, r.parcours_key) AS parcours,
  COUNT(*) AS nb_recommandations,
  AVG(r.score) AS score_moyen
FROM recommandation r
LEFT JOIN parcours p ON p.id = r.id_parcours
GROUP BY COALESCE(p.nom, r.parcours_key)
ORDER BY nb_recommandations DESC;

-- ---------- Authentification formateur (RPC sécurisée) ----------

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION verifier_formateur(p_email TEXT, p_mot_de_passe TEXT)
RETURNS TABLE (ok BOOLEAN, id UUID, prenom TEXT, nom TEXT, email TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row formateur%ROWTYPE;
  v_hash TEXT;
BEGIN
  SELECT * INTO v_row FROM formateur WHERE lower(formateur.email) = lower(trim(p_email)) LIMIT 1;
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT;
    RETURN;
  END IF;

  v_hash := encode(digest(p_mot_de_passe, 'sha256'), 'hex');
  IF v_row.mot_de_passe = v_hash THEN
    RETURN QUERY SELECT true, v_row.id, v_row.prenom, v_row.nom, v_row.email;
  ELSE
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION verifier_formateur(TEXT, TEXT) TO anon, authenticated;

INSERT INTO formateur (nom, prenom, email, mot_de_passe) VALUES
  ('Kabila', 'Marie', 'formateur@ccc.cd', '085e71cbb029909d8236487d2417db5cda9e103e4bf80c87bc783a6d8dff4311'),
  ('Formateur', 'Jean', 'admin@ccc.cd', '085e71cbb029909d8236487d2417db5cda9e103e4bf80c87bc783a6d8dff4311')
ON CONFLICT (email) DO NOTHING;

-- ---------- RLS (Row Level Security) ----------

ALTER TABLE ville ENABLE ROW LEVEL SECURITY;
ALTER TABLE utilisateur ENABLE ROW LEVEL SECURITY;
ALTER TABLE campagne ENABLE ROW LEVEL SECURITY;
ALTER TABLE session ENABLE ROW LEVEL SECURITY;
ALTER TABLE question ENABLE ROW LEVEL SECURITY;
ALTER TABLE reponse ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcours ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommandation ENABLE ROW LEVEL SECURITY;
ALTER TABLE commande ENABLE ROW LEVEL SECURITY;
ALTER TABLE erreur ENABLE ROW LEVEL SECURITY;
ALTER TABLE evenement ENABLE ROW LEVEL SECURITY;
ALTER TABLE formateur ENABLE ROW LEVEL SECURITY;

-- Politiques permissives pour la borne (anon key)
-- En production, restreindre selon auth.uid()

CREATE POLICY "Lecture publique ville" ON ville FOR SELECT USING (true);
CREATE POLICY "Lecture publique campagne" ON campagne FOR SELECT USING (true);
CREATE POLICY "Lecture publique question" ON question FOR SELECT USING (true);
CREATE POLICY "Lecture publique parcours" ON parcours FOR SELECT USING (true);

CREATE POLICY "Insert utilisateur" ON utilisateur FOR INSERT WITH CHECK (true);
CREATE POLICY "Select utilisateur" ON utilisateur FOR SELECT USING (true);
CREATE POLICY "Update utilisateur" ON utilisateur FOR UPDATE USING (true);

CREATE POLICY "Insert session" ON session FOR INSERT WITH CHECK (true);
CREATE POLICY "Select session" ON session FOR SELECT USING (true);
CREATE POLICY "Update session" ON session FOR UPDATE USING (true);

CREATE POLICY "Insert reponse" ON reponse FOR INSERT WITH CHECK (true);
CREATE POLICY "Select reponse" ON reponse FOR SELECT USING (true);

CREATE POLICY "Insert recommandation" ON recommandation FOR INSERT WITH CHECK (true);
CREATE POLICY "Select recommandation" ON recommandation FOR SELECT USING (true);

CREATE POLICY "Insert commande" ON commande FOR INSERT WITH CHECK (true);
CREATE POLICY "Select commande" ON commande FOR SELECT USING (true);

CREATE POLICY "Insert erreur" ON erreur FOR INSERT WITH CHECK (true);
CREATE POLICY "Select erreur" ON erreur FOR SELECT USING (true);

CREATE POLICY "Insert evenement" ON evenement FOR INSERT WITH CHECK (true);
CREATE POLICY "Select evenement" ON evenement FOR SELECT USING (true);

CREATE POLICY "Update question formateur" ON question FOR UPDATE USING (true);
CREATE POLICY "Insert question formateur" ON question FOR INSERT WITH CHECK (true);

-- Index de performance
CREATE INDEX IF NOT EXISTS idx_session_utilisateur ON session(id_utilisateur);
CREATE INDEX IF NOT EXISTS idx_session_statut ON session(statut);
CREATE INDEX IF NOT EXISTS idx_reponse_session ON reponse(id_session);
CREATE INDEX IF NOT EXISTS idx_commande_session ON commande(id_session);
CREATE INDEX IF NOT EXISTS idx_erreur_type ON erreur(type_erreur);
