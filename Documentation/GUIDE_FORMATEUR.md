# Guide formateur — Mode mini-français

**KebaCode CCC — Espace encadreurs CCC**

---

## Accès

1. Accueil → choisir langue → **Formateur CCC**
2. Saisir email et code d'accès
3. Touchez **Se connecter**

### Comptes de démonstration

| Email | Code |
|-------|------|
| `formateur@ccc.cd` | `ccc2026` |
| `admin@ccc.cd` | `ccc2026` |

La session formateur dure **8 heures** (persistée localement).

---

## Interface terminal

Le mode formateur affiche un **terminal** sombre style console :

```
kebacode> afficher les statistiques
```

- **Historique** des commandes et réponses
- **Tokens colorés** lors de l'analyse LL(1)
- **Mini-dashboard** intégré (participants, abandons, complétion)
- **Suggestions** cliquables en cas d'erreur

---

## Commandes disponibles

### Consultation

| Commande | Action |
|----------|--------|
| `afficher les statistiques` | Tableau de bord campagne (participants, taux, durée) |
| `afficher les erreurs` | Top des commandes fautives (vue `v_erreurs_frequentes`) |
| `afficher les commandes` | Fréquence des commandes utilisées |
| `afficher les participants` | Liste des participants avec filtres |
| `lister tout` | Questions actives + campagnes + modules conversation |
| `aide` | Liste complète des commandes |

### Recherche

| Commande | Action |
|----------|--------|
| `chercher adolescents de Kinshasa` | Filtre participants ado + ville |
| `chercher enfants de Lubumbashi` | Filtre enfants + ville |
| `chercher adolescents intéressés par Python` | Filtre profil + intérêt Python |

### Campagnes

| Commande | Action |
|----------|--------|
| `lancer enquête cybersécurité` | Crée/active campagne cybersécurité |
| `lancer campagne école` | Crée campagne scolaire |

### Gestion des questions

| Commande | Action |
|----------|--------|
| `ajouter question` | Ouvre formulaire → INSERT en base |
| `modifier question 3` | Formulaire pré-rempli → UPDATE question n°3 |
| `supprimer question 4` | Désactive question n°4 (`actif = false`) |

Le formulaire permet de choisir : texte (FR), thème, profil cible.

### Export et session

| Commande | Action |
|----------|--------|
| `exporter rapport` | Export CSV/PDF des stats |
| `exporter csv` | Téléchargement CSV participants |
| `exporter pdf` | Impression rapport |
| `recommencer session` | Reset terminal |
| `quitter` | Retour choix rôle (session auth conservée) |

### Analyse LL(1) (soutenance)

| Commande | Action |
|----------|--------|
| `analyser afficher les statistiques` | Trace complète pile/input LL(1) |
| `analyser chercher adolescents de Kinshasa` | Idem pour phrase complexe |

---

## Gestion des erreurs de commande

Le système corrige automatiquement les fautes :

| Vous tapez | Système répond |
|-----------|----------------|
| `afficher statistique` | Auto-correction → exécution |
| `afficher stat` | « Voulez-vous dire "afficher les statistiques" ? » [chip cliquable] |
| `xyz participants` | « Commande inconnue — tapez "aide" » |
| `afficher` | « Commande incomplète — vouliez-vous dire "afficher les statistiques" ? » |

Les erreurs sont **journalisées** en base (table `erreur`) pour analyse ultérieure.

---

## Tableau de bord graphique

Commande `afficher les statistiques` ou bouton **Ouvrir le tableau de bord** :

- Métriques : participants, abandons, taux complétion, durée moyenne
- Graphique barres : participants par ville
- Graphique donut : répartition par profil
- Graphique courbe : sessions par jour
- Boutons **Exporter CSV** et **Imprimer PDF**

---

## Déconnexion

- Commande `quitter` → retour écran choix (reste connecté)
- Bouton **Déconnexion** → efface la session auth (8 h)

---

## Conseils pour la borne en événement

1. **Avant l'événement** : `lancer enquête cybersécurité` pour activer la campagne
2. **Pendant** : surveiller `afficher les statistiques` périodiquement
3. **Après** : `exporter rapport` pour archivage Fondation
4. **Problème réseau** : la borne fonctionne hors ligne, sync auto au retour

---

## Variantes acceptées (lexer)

Le mini-français accepte des synonymes :

- **Verbes** : montrer, voir → afficher ; créer → ajouter ; effacer → supprimer
- **Objets** : stats, tableau → statistiques ; profils → participants
- **Accents** : cybersécurité ↔ cybersecurite, école ↔ ecole

---

## Référence technique

- Grammaire complète → [GRAMMAIRE_LL1.md](GRAMMAIRE_LL1.md)
- Architecture → [ARCHITECTURE.md](ARCHITECTURE.md)
- API Supabase → [DOCUMENTATION_TECHNIQUE.md](DOCUMENTATION_TECHNIQUE.md)
