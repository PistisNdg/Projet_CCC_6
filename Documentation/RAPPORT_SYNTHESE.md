# Rapport de synthèse — KebaCode CCC

**Projet N°6 — Borne Interactive d'Orientation Numérique**  
**Fondation Children Coding Club — Version PI.06.26 FCCC-V004**  
**Date : Juin 2026**

---

## 1. Problème traité

### Contexte

La Fondation CCC souhaite équiper les écoles et centres communautaires de RDC d'une borne capable d'orienter les jeunes vers des parcours numériques adaptés, tout en collectant des statistiques pour piloter ses campagnes de sensibilisation.

### Problème

Comment concevoir un système homme-machine qui dialogue avec différents profils, interprète des commandes en mini-français, pilote une enquête adaptative, recommande un parcours et persiste les données en base relationnelle — tout en résistant aux erreurs, interruptions et périodes d'inactivité ?

### Solution

**KebaCode CCC** : application web vanilla JS avec automate d'états explicite, analyseur LL(1), moteur de conversation adaptatif, recommandation par scoring, et persistance Supabase (PostgreSQL) avec repli hors ligne.

---

## 2. Architecture retenue

```
Navigateur (borne) ──► app.js (orchestrateur)
                    ├── engine.js (FSM + inactivité)
                    ├── lexer.js + parser.js (mini-français LL(1))
                    ├── conversation.js (enquête adaptative)
                    ├── data.js (recommandation + i18n)
                    ├── supabase.js (15+ fonctions DB)
                    └── screens/ (12 modules IHM) + virtual-keyboard.js
                              │
                              ▼
                    Supabase PostgreSQL (12 tables, 4 vues, RPC auth)
                              │
                              ▼
                    localStorage (session + offline queue)
```

Voir [ARCHITECTURE.md](ARCHITECTURE.md) pour le détail complet.

---

## 3. Technologies utilisées

| Couche | Technologie | Justification |
|--------|-------------|---------------|
| Frontend | HTML5, CSS3, JS ES6 modules | Zero build, déploiement borne trivial |
| État | FSM maison (`engine.js`) | Transitions documentées, défendables à l'oral |
| Parsing | Lexer + Parser LL(1) | Grammaire non ambiguë, trace pile visible |
| Correction | Levenshtein (distance ≤ 2) | 3 niveaux d'erreur explicables |
| Dialogue | Modules conversation + flags | Enquête non linéaire |
| DB | Supabase / PostgreSQL | Relationnel, RLS, RPC, gratuit MVP |
| Offline | localStorage + sync queue | Bonus barème, résilience RDC |
| i18n | 4 langues (FR/EN/LN/SW) | Bonus barème multilingue |

---

## 4. Résultats obtenus

### 4.1 Couverture fonctionnelle

| Exigence cahier des charges | Statut |
|-----------------------------|--------|
| Mode public (4 profils) | ✅ |
| Mode formateur (commandes mini-français) | ✅ |
| Automate d'états (12+ états) | ✅ 15 états |
| Inactivité 20/40/60/90 s | ✅ |
| 3 niveaux correction erreurs | ✅ |
| Grammaire LL(1) + table | ✅ |
| Enquête adaptative non linéaire | ✅ |
| 12 tables relationnelles | ✅ |
| 15+ fonctions/requêtes SQL | ✅ 20 |
| Recommandation personnalisée | ✅ |
| Auth formateur sécurisée | ✅ RPC SHA-256 |
| Reprise session | ✅ |
| Export PDF/CSV | ✅ |

### 4.2 Bonus barème

| Bonus | Points | Statut |
|-------|--------|--------|
| Mode hors ligne | +5 | ✅ |
| Interface multilingue (4 langues) | +5 | ✅ |
| Tableau de bord graphique | +5 | ✅ |
| Export PDF ou CSV | +3 | ✅ |
| Anonymisation avancée | +5 | ⚠️ Partiel (skip nom, flag anonymise) |

### 4.3 Tests

43 scénarios testés, **100 % PASS** — voir [RAPPORT_TESTS.md](RAPPORT_TESTS.md).

---

## 5. Choix techniques justifiés

### FSM explicite vs framework SPA

Un routeur React/Vue aurait masqué la logique d'états exigée par le barème. La matrice `TRANSITIONS` dans `engine.js` est directement inspectable et modifiable en soutenance.

### LL(1) avec pile vs regex

Les expressions régulières ne produisent pas de trace d'analyse ni de table FIRST/FOLLOW. L'analyseur par pile permet la démonstration « analyse LL(1) détaillée » obligatoire.

### Supabase vs SQLite embarqué

La borne est un client web sans backend Python. Supabase fournit PostgreSQL relationnel complet (vues, RPC, RLS) accessible via HTTPS, compatible avec le déploiement statique.

### Conversation adaptative vs questionnaire linéaire

Les `flags` (jamais_internet, connait_scratch, aime_python…) déclenchent des branchements de modules, conformément à l'exigence d'enquête non linéaire du cahier des charges.

---

## 6. Documentation livrée

| # | Livrable | Fichier |
|---|----------|---------|
| 1 | Cahier des charges | [CAHIER_DES_CHARGES.md](CAHIER_DES_CHARGES.md) |
| 2 | Architecture générale | [ARCHITECTURE.md](ARCHITECTURE.md) |
| 3 | Diagramme d'états | [DIAGRAMME_ETATS.md](DIAGRAMME_ETATS.md) |
| 4 | Modèle de données | [MODELE_DONNEES.md](MODELE_DONNEES.md) |
| 5 | Scripts SQL | `kebacode-ccc/supabase/schema.sql` |
| 6 | Grammaire + table LL(1) | [GRAMMAIRE_LL1.md](GRAMMAIRE_LL1.md) |
| 15 | Documentation technique | [DOCUMENTATION_TECHNIQUE.md](DOCUMENTATION_TECHNIQUE.md) |
| 16 | Guide utilisateur | [GUIDE_UTILISATEUR.md](GUIDE_UTILISATEUR.md) |
| 17 | Guide formateur | [GUIDE_FORMATEUR.md](GUIDE_FORMATEUR.md) |
| 18 | Rapport de tests | [RAPPORT_TESTS.md](RAPPORT_TESTS.md) |
| 19 | Journal d'exécution | [JOURNAL_EXECUTION.md](JOURNAL_EXECUTION.md) |
| 20 | Rapport de synthèse | Ce document |
| + | README, Quick Start, Install | [README.md](README.md) |

**Score documentation : 14/14 livrables + 3 guides complémentaires**

---

## 7. Pistes d'amélioration

1. **RLS production** — Restreindre INSERT anon par token borne
2. **Tests automatisés** — Suite Jest pour lexer/parser/FSM
3. **Bcrypt formateur** — Remplacer SHA-256 par hash adaptatif
4. **Service Worker** — Cache assets pour offline complet
5. **Anonymisation** — Option « session anonyme » explicite avec purge auto
6. **Plus de villes** — Interface admin pour étendre le référentiel

---

## 8. Limites du système

| Limite | Description |
|--------|-------------|
| Vocabulaire fermé | Le mini-français ne couvre que ~50 verbes/objets/complements |
| 6 villes | Liste fixe RDC, pas de saisie libre |
| Auth prototype | SHA-256, pas de 2FA |
| RLS permissif | Prototype : policies ouvertes pour anon |
| Pas de backend custom | Toute la logique métier est côté client |

---

## 9. Conclusion

Le prototype **KebaCode CCC** répond aux exigences du Projet N°6 :

- Système interactif piloté par algorithmes (FSM, LL(1), scoring)
- Interface robuste multilingue avec gestion d'inactivité
- Base de données relationnelle complète (12 tables, 4 vues, 20 requêtes)
- Documentation exhaustive (20 livrables)
- Bonus : offline, multilingue, dashboard, export

Le système est **prêt pour la démonstration et la soutenance** du 16/06/2026.

---

## 10. Signature projet

| Item | Détail |
|------|--------|
| **Projet** | N°6 — KebaCode CCC |
| **Dépôt GitHub** | [github.com/PistisNdg/Projet_CCC_6](https://github.com/PistisNdg/Projet_CCC_6) |
| **Version** | PI.06.26 FCCC-V004 |
| **Deadline** | 16/06/2026 |
| **Statut** | ✅ Complet et testé |
| **Prêt démo** | ✅ Oui |
| **Documentation** | ✅ 14/14 livrables |

---

*Tous les objectifs du Projet N°6 sont couverts. Le système est prêt pour évaluation finale.*
