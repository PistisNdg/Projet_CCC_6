# KebaCode CCC — Borne Interactive d'Orientation Numérique

**Projet N°6 — Fondation Children Coding Club**  
**Version PI.06.26 FCCC-V004 — Deadline : 16/06/2026**

Prototype de borne interactive de sensibilisation numérique pilotée en **mini-français**, destinée aux écoles, centres communautaires et événements publics en République Démocratique du Congo.

> **Dépôt GitHub** : [github.com/PistisNdg/Projet_CCC_6](https://github.com/PistisNdg/Projet_CCC_6)

---

## Présentation

KebaCode CCC permet à des enfants, adolescents, parents et visiteurs de :

- Dialoguer avec un système adaptatif (enquête intelligente)
- Recevoir une recommandation de parcours CCC personnalisée
- Reprendre une session interrompue
- Télécharger une fiche PDF de leur parcours

Les formateurs CCC pilotent la borne par **commandes textuelles** en mini-français, avec analyse lexicale, syntaxique LL(1) et persistance Supabase.

---

## Fonctionnalités principales

| Domaine | Détail |
|---------|--------|
| **Mode public** | 4 langues (FR / EN / LN / SW), profils adaptatifs, enquête conversationnelle, recommandation, PDF |
| **Mode formateur** | Terminal mini-français, auth sécurisée, stats, gestion questions/campagnes, export CSV/PDF |
| **Automate d'états** | FSM 15 états avec transitions validées et journalisation |
| **Inactivité** | 20 s aide · 40 s reformulation · 60 s sauvegarde · 90 s fermeture |
| **Erreurs commandes** | 3 niveaux (auto-correction, suggestion, reformulation) via Levenshtein |
| **Base de données** | 12 tables PostgreSQL (Supabase), vues stats, RPC auth formateur |
| **Bonus** | Mode hors ligne, multilingue, dashboard graphique, export PDF/CSV |

---

## Structure du projet

```
Projet_CCC_6/
├── README.md               ← Accueil GitHub
├── Documentation/          ← Vous êtes ici
│   ├── README.md
│   ├── QUICK_START.md
│   ├── INSTALL_GUIDE.md
│   ├── CAHIER_DES_CHARGES.md
│   ├── ARCHITECTURE.md
│   ├── DIAGRAMME_ETATS.md
│   ├── MODELE_DONNEES.md
│   ├── GRAMMAIRE_LL1.md
│   ├── DOCUMENTATION_TECHNIQUE.md
│   ├── GUIDE_UTILISATEUR.md
│   ├── GUIDE_FORMATEUR.md
│   ├── RAPPORT_TESTS.md
│   ├── JOURNAL_EXECUTION.md
│   └── RAPPORT_SYNTHESE.md
├── document_pdf.pdf        ← Cahier des charges officiel
└── kebacode-ccc/
    ├── index.html
    ├── assets/
    │   ├── css/            ← main, components, screens
    │   └── js/
    │       ├── app.js       ← Orchestrateur principal
    │       ├── engine.js    ← FSM + inactivité
    │       ├── lexer.js     ← Analyseur lexical
    │       ├── parser.js    ← Analyseur LL(1)
    │       ├── supabase.js  ← Client DB (15+ fonctions)
    │       ├── conversation.js
    │       ├── data.js      ← i18n, profils, recommandation
    │       ├── virtual-keyboard.js ← Clavier tactile flottant
    │       └── screens/     ← Écrans IHM (12 modules)
    └── supabase/
        └── schema.sql       ← Schéma PostgreSQL complet
```

---

## Démarrage rapide

```bash
git clone https://github.com/PistisNdg/Projet_CCC_6.git
cd Projet_CCC_6/kebacode-ccc
python3 -m http.server 8080
# Ouvrir http://localhost:8080
```

Voir [QUICK_START.md](QUICK_START.md) et [INSTALL_GUIDE.md](INSTALL_GUIDE.md) pour la configuration Supabase.

---

## Index de la documentation

### Conception (livrables 18.1)

| Document | Contenu |
|----------|---------|
| [CAHIER_DES_CHARGES.md](CAHIER_DES_CHARGES.md) | Problématique, objectifs, contraintes |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Architecture logicielle, composants, flux |
| [DIAGRAMME_ETATS.md](DIAGRAMME_ETATS.md) | Automate d'états, transitions, timeouts |
| [MODELE_DONNEES.md](MODELE_DONNEES.md) | Modèle entité-relation, tables, vues |
| [GRAMMAIRE_LL1.md](GRAMMAIRE_LL1.md) | Grammaire, FIRST/FOLLOW, table LL(1) |
| `kebacode-ccc/supabase/schema.sql` | Scripts SQL (livrable 6) |

### Exploitation (livrables 18.3)

| Document | Contenu |
|----------|---------|
| [DOCUMENTATION_TECHNIQUE.md](DOCUMENTATION_TECHNIQUE.md) | Modules JS, API Supabase, config |
| [GUIDE_UTILISATEUR.md](GUIDE_UTILISATEUR.md) | Mode public — parcours visiteur |
| [GUIDE_FORMATEUR.md](GUIDE_FORMATEUR.md) | Mode formateur — commandes mini-français |
| [RAPPORT_TESTS.md](RAPPORT_TESTS.md) | Scénarios de test et résultats |
| [JOURNAL_EXECUTION.md](JOURNAL_EXECUTION.md) | Traces FSM, commandes, événements |
| [RAPPORT_SYNTHESE.md](RAPPORT_SYNTHESE.md) | Synthèse projet et bilan |

---

## Technologies

- **Frontend** : HTML5, CSS3, JavaScript ES6 modules (vanilla)
- **Backend / DB** : Supabase (PostgreSQL), Row Level Security
- **Auth formateur** : RPC `verifier_formateur` (SHA-256 côté serveur)
- **Hors ligne** : localStorage + file d'attente de synchronisation

---

## Comptes de démonstration formateur

| Email | Mot de passe |
|-------|--------------|
| `formateur@ccc.cd` | `ccc2026` |
| `admin@ccc.cd` | `ccc2026` |

*(Hash SHA-256 stocké en base — voir `schema.sql`)*

---

## Licence et contexte

Projet réalisé dans le cadre du recrutement de formateurs CCC — Projet N°6, Fondation Children Coding Club, RDC.
