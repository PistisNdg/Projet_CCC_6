# Architecture générale — KebaCode CCC

## Vue d'ensemble

```
┌───────────────────────────────────────────────────────────────────┐
│                    NAVIGATEUR (Borne / Tablette)                  │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────┐   │
│  │   index.html│  │  CSS (3 fich)│  │  JavaScript ES6 modules │   │
│  └──────┬──────┘  └──────────────┘  └───────────┬─────────────┘   │
│         │                                       │                 │
│  ┌──────▼───────────────────────────────────────▼───────────────┐ │
│  │                      app.js (Orchestrateur)                  │ │
│  │  • Événements UI  • Rendu écrans  • Persistance session      │ │
│  └──────┬───────────────┬────────────────┬───────────────┬──────┘ │
│         │               │                │               │        │
│  ┌──────▼──────┐ ┌──────▼──────┐ ┌───────▼──────┐ ┌──────▼──────┐ │
│  │  engine.js  │ │ parser.js   │ │conversation  │ │ supabase.js │ │
│  │  FSM +      │ │ lexer.js    │ │    .js       │ │  Client DB  │ │
│  │  inactivité │ │ LL(1)       │ │  Enquête     │ │  15+ req.   │ │
│  └─────────────┘ └─────────────┘ └──────────────┘ └──────┬──────┘ │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  screens/ (12 modules) + virtual-keyboard.js + ui.js + data.js │ │
│  └──────────────────────────────────────────────────────────────┘ │
└───────────────────────────────┬───────────────────────────────────┘
                                │ HTTPS (REST + RPC)
┌───────────────────────────────▼─────────────────────────────────┐
│                    SUPABASE (PostgreSQL)                        │
│  12 tables · 4 vues · RPC verifier_formateur · RLS policies     │
└─────────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │   localStorage        │
                    │   (session + offline) │
                    └───────────────────────┘
```

---

## Couches logicielles

| Couche | Fichiers |                  Responsabilité |
|--------|----------|---------------------------------|
| **Présentation** | `screens/*.js`, `ui.js`, `virtual-keyboard.js`, `*.css` | Rendu HTML, clavier tactile, composants réutilisables |
| **Orchestration** | `app.js` | Routage FSM, gestion événements, cycle de vie session |
| **Métier** | `data.js`, `conversation.js`, `participants.js` | Profils, i18n, enquête adaptative, recommandation |
| **Analyse** | `lexer.js`, `parser.js` | Mini-français : tokenisation, parsing LL(1), corrections |
| **État** | `engine.js` | Automate fini, timeouts inactivité |
| **Persistance** | `supabase.js`, `config.js` | CRUD PostgreSQL, mode offline, auth formateur |

---

## Composants détaillés

### 1. Orchestrateur (`app.js`)

Classe `App` — point d'entrée unique :

- Initialise Supabase et restaure session/auth
- Écoute événements `data-action` (délégation sur `document.body`)
- Appelle `fsm.transition(evenement)` puis `render()` selon l'état
- Persiste le contexte via `fsm.sauvegarder()` et `persistToDb()`
- Gère les timers analyse (3 s) et fin de session (5 s)

### 2. Automate d'états (`engine.js`)

Classe `FSM` :

- Matrice `TRANSITIONS[état][événement] → état_suivant`
- Validation : transition invalide → état `ERREUR`
- Sauvegarde/restauration localStorage (`SESSION_KEY`)
- Classe `InactivityManager` : timers cascadés 20/40/60/90 s

### 3. Analyseur lexical (`lexer.js`)

- Dictionnaire `LEX` : verbes, articles, objets, compléments
- `tokenize(line)` → tableau de tokens typés
- `autoCorrectTokens()` : Levenshtein (seuil `LEVENSHTEIN_MAX = 2`)
- Confiance : > 80 % auto-fix, 50–80 % suggestion, < 50 % erreur

### 4. Analyseur syntaxique (`parser.js`)

- Grammaire LL(1) factorisée (voir `GRAMMAIRE_LL1.md`)
- `buildLL1Table()` : table de parsing
- `parseWithStack()` : trace pile/input pour soutenance
- `parse(line)` → `{ ok, action, target, complement, level, message }`

### 5. Moteur de dialogue (`conversation.js`)

- Modules conversationnels par thème (Découverte, Cybersécurité, Création, Logique)
- Branchement adaptatif via `flags` et `score` par réponse
- Filtrage questions selon `profil_cible` (enfant, ado, tous)
- Intégration questions Supabase (`listerQuestions`)

### 6. Recommandation (`data.js`)

Fonction `recommander(answers, profileId)` :

- Agrège scores et flags des réponses
- Calcule `parcoursScores` (enfant, ado, python_avance, mentor, cybersec, robotique…)
- Retourne le parcours à score maximal + objet `RECOS[key]`

### 7. Client Supabase (`supabase.js`)

15+ fonctions exportées :

| Catégorie | Fonctions |
|-----------|-----------|
| Session | `creerSession`, `sauvegarderProgression`, `finaliserSession` |
| Utilisateur | `creerUtilisateur`, `lierSessionUtilisateur` |
| Enquête | `enregistrerReponse`, `enregistrerRecommandation` |
| Questions | `listerQuestions`, `creerQuestion`, `modifierQuestionParOrdre`, `desactiverQuestionParOrdre` |
| Campagnes | `listerCampagnes`, `lancerCampagne` |
| Stats | `tableauDeBordSynthetique`, `afficherErreursFrequentes`, `listerSessionsParticipants` |
| Recherche | `adolescentsKinshasaPython`, `profilsOrientesScratch` |
| Journal | `journaliserCommande`, `journaliserErreur` |
| Auth | `authentifierFormateur` (RPC), `restaurerAuthFormateur` |
| Offline | `syncOfflineData`, queue localStorage |

### 8. Écrans IHM (`screens/`)

| Fichier | État FSM | Rôle |
|---------|----------|------|
| `accueil.js` | ACCUEIL | Splash, reprise session |
| `choix-role.js` | CHOIX_MODE | Candidat vs Formateur |
| `nom.js` | SAISIE_NOM | Prénom |
| `ville.js` | SAISIE_VILLE | Sélection ville RDC |
| `profil.js` | IDENTIFICATION_PROFIL | 4 profils |
| `enquete.js` | ENQUETE | Chat conversationnel |
| `analyse.js` | ANALYSE_REPONSES | Animation calcul |
| `recommandation.js` | RECOMMANDATION | Parcours + PDF |
| `auth-formateur.js` | AUTH_FORMATEUR | Login |
| `formateur.js` | MODE_FORMATEUR, ANALYSE_COMMANDE | Terminal |
| `statistiques.js` | STATISTIQUES | Dashboard graphique |
| `fin.js` | FIN_SESSION | Écran de clôture |

---

## Flux de données — Mode public

```
Accueil (langue)
    → Choix rôle (Candidat)
    → Saisie nom → Saisie ville
    → Profil → creerUtilisateur() + creerSession()
    → Enquête (conversation.js)
        → enregistrerReponse() à chaque réponse
    → Analyse (timer 3 s)
    → recommander() → enregistrerRecommandation()
    → Affichage parcours + PDF
    → FIN_SESSION → ACCUEIL
```

## Flux de données — Mode formateur

```
Accueil → Formateur → AUTH_FORMATEUR
    → authentifierFormateur() [RPC SHA-256]
    → MODE_FORMATEUR (terminal)
    → Saisie commande → tokenize → parse → ANALYSE_COMMANDE
    → Action (stats, questions, campagne, export…)
    → journaliserCommande() / journaliserErreur()
    → Retour MODE_FORMATEUR
```

---

## Choix techniques justifiés

| Choix | Justification |
|-------|---------------|
| **Vanilla JS (ES modules)** | Pas de build, déploiement trivial sur borne, zéro dépendance npm |
| **Supabase** | PostgreSQL managé, RLS, RPC, realtime optionnel, gratuit pour prototype |
| **FSM explicite** | Transitions documentées, testables, défendables à l'oral |
| **LL(1) avec pile** | Analyse déterministe, trace visible pour la soutenance |
| **localStorage offline** | Bonus barème + résilience coupure réseau en RDC |
| **Levenshtein** | Correction orthographique légère sans ML, explicable |
| **CSS custom properties** | Thèmes par profil (`tone-child`, `tone-teen`, `tone-adult`) |

---

## Dépendances externes

| Ressource | Usage |
|-----------|-------|
| `@supabase/supabase-js@2` (CDN) | Client PostgreSQL |
| Google Fonts (DM Sans, IBM Plex Mono) | Typographie |
| Aucun framework UI | Performance borne, simplicité |
