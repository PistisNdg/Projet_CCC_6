# Projet_CCC_6 — KebaCode CCC

**Borne Interactive d'Orientation Numérique**  
**Projet N°6 — Fondation Children Coding Club**  
**Version PI.06.26 FCCC-V004**

Prototype de borne interactive de sensibilisation numérique pilotée en **mini-français**, destinée aux écoles, centres communautaires et événements publics en République Démocratique du Congo.

---

## Dépôt GitHub

| | |
|---|---|
| **Repository** | [github.com/PistisNdg/Projet_CCC_6](https://github.com/PistisNdg/Projet_CCC_6) |
| **Clone HTTPS** | `git clone https://github.com/PistisNdg/Projet_CCC_6.git` |
| **Clone SSH** | `git clone git@github.com:PistisNdg/Projet_CCC_6.git` |

---

## Présentation

KebaCode CCC permet à des enfants, adolescents, parents et visiteurs de :

- Dialoguer avec un système adaptatif (enquête intelligente)
- Recevoir une recommandation de parcours CCC personnalisée
- Reprendre une session interrompue
- Télécharger une fiche PDF de leur parcours

Les formateurs CCC pilotent la borne par **commandes textuelles** en mini-français, avec analyse lexicale, syntaxique LL(1) et persistance Supabase.

---

## Démarrage rapide

```bash
git clone https://github.com/PistisNdg/Projet_CCC_6.git
cd Projet_CCC_6/kebacode-ccc
python3 -m http.server 8080
# Ouvrir http://localhost:8080
```

Configuration Supabase → voir [Documentation/INSTALL_GUIDE.md](Documentation/INSTALL_GUIDE.md).

---

## Fonctionnalités principales

| Domaine | Détail |
|---------|--------|
| **Mode public** | 4 langues (FR / EN / LN / SW), profils adaptatifs, enquête conversationnelle, recommandation, PDF |
| **Mode formateur** | Terminal mini-français, auth sécurisée, stats, gestion questions/campagnes, export CSV/PDF |
| **Automate d'états** | FSM 15 états avec transitions validées et journalisation |
| **Inactivité** | 20 s aide · 40 s reformulation · 60 s sauvegarde · 90 s fermeture |
| **Clavier visuel** | Clavier flottant tactile pour saisie prénom, réponses libres et terminal formateur |
| **Erreurs commandes** | 3 niveaux (auto-correction, suggestion, reformulation) via Levenshtein |
| **Base de données** | 12 tables PostgreSQL (Supabase), vues stats, RPC auth formateur |
| **Bonus** | Mode hors ligne, multilingue, dashboard graphique, export PDF/CSV |

---

## Structure du projet

```
Projet_CCC_6/
├── README.md               ← Ce fichier (accueil GitHub)
├── Documentation/          ← Documentation complète (14 livrables)
│   ├── README.md
│   ├── QUICK_START.md
│   ├── INSTALL_GUIDE.md
│   ├── CAHIER_DES_CHARGES.md
│   ├── ARCHITECTURE.md
│   └── …
├── document_pdf.pdf        ← Cahier des charges officiel
├── KebaCode CCC - PROTOTYPE.html
└── kebacode-ccc/
    ├── index.html
    ├── assets/
    │   ├── css/
    │   └── js/
    │       ├── app.js
    │       ├── engine.js
    │       ├── lexer.js
    │       ├── parser.js
    │       ├── virtual-keyboard.js
    │       ├── supabase.js
    │       └── screens/     ← 12 modules écran
    └── supabase/
        └── schema.sql
```

---

## Documentation

| Document | Contenu |
|----------|---------|
| [Documentation/README.md](Documentation/README.md) | Index complet de la documentation |
| [QUICK_START.md](Documentation/QUICK_START.md) | Démarrage en 3 minutes |
| [INSTALL_GUIDE.md](Documentation/INSTALL_GUIDE.md) | Installation et déploiement |
| [GUIDE_UTILISATEUR.md](Documentation/GUIDE_UTILISATEUR.md) | Mode public — parcours visiteur |
| [GUIDE_FORMATEUR.md](Documentation/GUIDE_FORMATEUR.md) | Mode formateur — commandes mini-français |
| [ARCHITECTURE.md](Documentation/ARCHITECTURE.md) | Architecture logicielle |
| [RAPPORT_SYNTHESE.md](Documentation/RAPPORT_SYNTHESE.md) | Synthèse projet et bilan |

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

---

## Licence et contexte

Projet réalisé dans le cadre du recrutement de formateurs CCC — Projet N°6, Fondation Children Coding Club, RDC.
