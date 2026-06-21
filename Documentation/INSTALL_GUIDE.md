# Guide d'installation — KebaCode CCC

## Prérequis

| Composant | Version minimale |
|-----------|------------------|
| Navigateur | Chrome 90+, Firefox 88+, Edge 90+ |
| Python (serveur local) | 3.8+ |
| Compte Supabase | Gratuit (supabase.com) |

Aucune dépendance Node.js ni build step : le projet est du **vanilla JS** servi statiquement.

---

## Installation locale (développement)

### Étape 1 — Cloner le dépôt

```bash
git clone https://github.com/PistisNdg/Projet_CCC_6.git
cd Projet_CCC_6/kebacode-ccc
```

### Étape 2 — Configurer Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Ouvrir **SQL Editor** → coller le contenu de `supabase/schema.sql` → Exécuter
3. Vérifier que les 12 tables et 4 vues sont créées
4. Copier **Project URL** et **anon public key** depuis Settings → API

### Étape 3 — Configurer `config.js`

Éditer `assets/js/config.js` :

```javascript
export const SUPABASE_URL = 'https://VOTRE_PROJET.supabase.co';
export const SUPABASE_ANON_KEY = 'VOTRE_CLE_ANON';
export const DEV_MODE = false;  // true = affiche les identifiants démo sur l'écran auth
```

### Étape 4 — Lancer le serveur

```bash
python3 -m http.server 8080
```

> **Important** : ne pas ouvrir `index.html` en `file://` — les modules ES6 et Supabase nécessitent HTTP.

Alternative :

```bash
npx serve -p 8080
```

### Étape 5 — Vérifier la connexion

- Le badge en bas de l'écran doit afficher **En ligne**
- Console navigateur : pas d'erreur Supabase
- Mode formateur → connexion avec `formateur@ccc.cd` / `ccc2026`

---

## Déploiement borne (production)

### Option A — Hébergement statique

Déployer le dossier `kebacode-ccc/` sur :

- **GitHub Pages** (depuis [Projet_CCC_6](https://github.com/PistisNdg/Projet_CCC_6))
- Netlify / Vercel (static)
- Nginx sur mini-PC borne

Configurer les variables Supabase directement dans `config.js` (clé anon = publique par design Supabase).

### Option B — Borne locale (kiosk)

1. Installer Chromium en mode kiosk :
   ```bash
   chromium --kiosk --app=http://localhost:8080
   ```
2. Démarrer le serveur Python au boot (systemd ou cron)
3. Désactiver la barre d'adresse et les raccourcis système

### Sécurité production

| Mesure | Détail |
|--------|--------|
| RLS Supabase | Restreindre les politiques INSERT/UPDATE selon `auth.uid()` |
| Auth formateur | Ne jamais exposer le hash mot de passe côté client |
| HTTPS | Obligatoire en production (Supabase l'exige) |
| `DEV_MODE` | Mettre à `false` |

---

## Schéma SQL — vérification post-install

```sql
-- Tables attendues (12)
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Vues stats (4)
SELECT table_name FROM information_schema.views
WHERE table_schema = 'public';

-- Test RPC formateur
SELECT * FROM verifier_formateur('formateur@ccc.cd', 'ccc2026');
-- Attendu : ok = true
```

---

## Dépannage

| Problème | Solution |
|----------|----------|
| « Hors ligne » permanent | Vérifier URL/clé Supabase, CORS, connexion réseau |
| Modules JS non chargés | Utiliser un serveur HTTP, pas `file://` |
| Auth formateur échoue | Exécuter `schema.sql` (RPC + données seed) |
| Questions vides | Vérifier INSERT seed dans `schema.sql` |
| Erreur RLS | Vérifier les politiques CREATE POLICY du schéma |

---

## Structure des fichiers à ne pas modifier sans justification

| Fichier | Rôle |
|---------|------|
| `engine.js` | Automate d'états — transitions validées |
| `parser.js` | Grammaire LL(1) — table de parsing |
| `lexer.js` | Vocabulaire mini-français |
| `schema.sql` | Modèle relationnel complet |
