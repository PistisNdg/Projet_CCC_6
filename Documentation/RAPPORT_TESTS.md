# Rapport de tests — KebaCode CCC

**Date** : Juin 2026  
**Version** : PI.06.26 FCCC-V004  
**Environnement** : Chrome 120, Python 3 http.server, Supabase PostgreSQL

---

## Résumé

| Catégorie | Scénarios | Passés | Échecs |
|-----------|-----------|--------|--------|
| Mode public | 8 | 8 | 0 |
| Mode formateur | 10 | 10 | 0 |
| Analyse LL(1) | 8 | 8 | 0 |
| FSM / inactivité | 6 | 6 | 0 |
| Base de données | 6 | 6 | 0 |
| Robustesse | 5 | 5 | 0 |
| **Total** | **43** | **43** | **0** |

**Taux de réussite : 100 %**

---

## 1. Mode public

### T-01 — Parcours enfant complet

| Étape | Action | Résultat attendu | Statut |
|-------|--------|------------------|--------|
| 1 | Accueil → FR → Candidat | CHOIX_MODE → SAISIE_NOM | ✅ |
| 2 | Prénom « Amina » → Kinshasa | Ville active, profil affiché | ✅ |
| 3 | Profil Enfant | Questions adaptées enfant | ✅ |
| 4 | Répondre à toutes les questions | Flags calculés, chat progressif | ✅ |
| 5 | Terminer enquête | ANALYSE → RECOMMANDATION | ✅ |
| 6 | Parcours affiché | Découverte numérique ou Scratch Junior | ✅ |
| 7 | Télécharger PDF | Fiche PDF générée | ✅ |

### T-02 — Parcours adolescent motivé

| Action | Résultat | Statut |
|--------|----------|--------|
| Profil Ado + réponses « connaît Scratch » + « intéresse Python » | Parcours Scratch→Python ou python_avance | ✅ |

### T-03 — Session parent

| Action | Résultat | Statut |
|--------|----------|--------|
| Profil Parent | Parcours « Accompagnement parental » | ✅ |

### T-04 — Skip prénom

| Action | Résultat | Statut |
|--------|----------|--------|
| Passer prénom | SAISIE_NOM → IDENTIFICATION_PROFIL direct | ✅ |

### T-05 — Multilingue

| Langue | Écran accueil | Questions | Statut |
|--------|---------------|-----------|--------|
| FR | Bienvenue | FR | ✅ |
| EN | Welcome | EN | ✅ |
| LN | Boyei malamu | LN | ✅ |
| SW | Karibu | SW | ✅ |

### T-06 — Reprise session

| Action | Résultat | Statut |
|--------|----------|--------|
| Session ENQUETE → fermer onglet → rouvrir | Bouton Reprendre visible | ✅ |
| Reprendre | État ENQUETE restauré, réponses intactes | ✅ |

### T-07 — Réponse libre enquête

| Action | Résultat | Statut |
|--------|----------|--------|
| « Autre — j'écris ma réponse » + texte | Réponse enregistrée, question suivante | ✅ |

### T-08 — Export PDF recommandation

| Action | Résultat | Statut |
|--------|----------|--------|
| Télécharger PDF | HTML print avec parcours, scores, conseil | ✅ |

---

## 2. Mode formateur

### T-09 — Authentification valide

| Input | Résultat | Statut |
|-------|----------|--------|
| formateur@ccc.cd / ccc2026 | MODE_FORMATEUR, message bienvenue | ✅ |

### T-10 — Authentification invalide

| Input | Résultat | Statut |
|-------|----------|--------|
| wrong@test / bad | Message erreur, reste AUTH_FORMATEUR | ✅ |

### T-11 — Afficher statistiques

| Commande | Résultat | Statut |
|----------|----------|--------|
| `afficher les statistiques` | Mini-dash + métriques Supabase | ✅ |

### T-12 — Ajouter question

| Commande | Résultat | Statut |
|----------|----------|--------|
| `ajouter question` → formulaire → submit | INSERT question, ordre auto | ✅ |

### T-13 — Modifier question 3

| Commande | Résultat | Statut |
|----------|----------|--------|
| `modifier question 3` | Formulaire pré-rempli, UPDATE OK | ✅ |

### T-14 — Supprimer question 4

| Commande | Résultat | Statut |
|----------|----------|--------|
| `supprimer question 4` | actif=false, question masquée enquête | ✅ |

### T-15 — Lancer campagne

| Commande | Résultat | Statut |
|----------|----------|--------|
| `lancer enquête cybersécurité` | INSERT campagne active | ✅ |

### T-16 — Chercher participants

| Commande | Résultat | Statut |
|----------|----------|--------|
| `chercher adolescents de Kinshasa` | Table filtrée | ✅ |

### T-17 — Exporter rapport

| Commande | Résultat | Statut |
|----------|----------|--------|
| `exporter rapport` | CSV ou PDF téléchargé | ✅ |

### T-18 — Déconnexion

| Action | Résultat | Statut |
|--------|----------|--------|
| Déconnexion | Auth effacée, retour CHOIX_MODE | ✅ |

---

## 3. Analyse LL(1) et erreurs

### T-19 — Commande valide

| Input | parse().ok | action | Statut |
|-------|------------|--------|--------|
| `afficher les statistiques` | true | show/stats | ✅ |
| `lancer enquête cybersécurité` | true | launch/enquete | ✅ |
| `chercher adolescents de Kinshasa` | true | search | ✅ |

### T-20 — Auto-correction (niveau 1)

| Input | Résultat | Statut |
|-------|----------|--------|
| `afficher statistiques` (sans « les ») | Exécution OK, autoFixed=true | ✅ |
| `lister toutes les questions` | Correction « toutes » → « tout » | ✅ |

### T-21 — Suggestion (niveau 2)

| Input | Résultat | Statut |
|-------|----------|--------|
| `afficher stat` | Warning + chip « afficher les statistiques » | ✅ |
| `afficher` (seul) | Warning + suggestion complète | ✅ |

### T-22 — Reformulation (niveau 3)

| Input | Résultat | Statut |
|-------|----------|--------|
| `xyz abc def` | Danger + message aide | ✅ |

### T-23 — Analyse pile LL(1)

| Input | Résultat | Statut |
|-------|----------|--------|
| `analyser afficher les statistiques` | Trace pile/input affichée | ✅ |

### T-24 — Journalisation erreurs

| Input | Résultat | Statut |
|-------|----------|--------|
| Commande invalide | INSERT table `erreur` | ✅ |

### T-25 — Commande `aide`

| Input | Résultat | Statut |
|-------|----------|--------|
| `aide` | Liste SUGGESTED_COMMANDS | ✅ |

### T-26 — Phrase LL(1) invalide syntaxe

| Input | Résultat | Statut |
|-------|----------|--------|
| `statistiques afficher les` (ordre inversé) | Erreur verbe manquant | ✅ |

---

## 4. FSM et inactivité

### T-27 — Transitions valides

| Transition | Statut |
|------------|--------|
| ACCUEIL → CHOIX_MODE → SAISIE_NOM → SAISIE_VILLE → PROFIL → ENQUETE | ✅ |
| ENQUETE → ANALYSE → RECOMMANDATION → FIN | ✅ |
| CHOIX_MODE → AUTH → MODE_FORMATEUR → ANALYSE_COMMANDE | ✅ |

### T-28 — Transition invalide

| Action | Résultat | Statut |
|--------|----------|--------|
| Event inconnu en ACCUEIL | État ERREUR, log console | ✅ |

### T-29 — Inactivité 20 s

| Contexte | Résultat | Statut |
|----------|----------|--------|
| ENQUETE, profil enfant | Bulle aide simple | ✅ |

### T-30 — Inactivité 60 s

| Contexte | Résultat | Statut |
|----------|----------|--------|
| ENQUETE | SAUVEGARDE + toast + redirect ACCUEIL | ✅ |

### T-31 — Reset inactivité sur interaction

| Action | Résultat | Statut |
|--------|----------|--------|
| Toucher écran après 15 s | Timer reset, pas de bulle à 20 s | ✅ |

### T-32 — Reprise après SAUVEGARDE

| Action | Résultat | Statut |
|--------|----------|--------|
| Reprendre depuis ACCUEIL | Contexte ENQUETE restauré | ✅ |

---

## 5. Base de données

### T-33 — Création session + utilisateur

| Action | Résultat | Statut |
|--------|----------|--------|
| Démarrer enquête | INSERT utilisateur + session | ✅ |

### T-34 — Enregistrement réponses

| Action | Résultat | Statut |
|--------|----------|--------|
| 6 réponses | 6 INSERT reponse | ✅ |

### T-35 — Recommandation persistée

| Action | Résultat | Statut |
|--------|----------|--------|
| Fin enquête | INSERT recommandation | ✅ |

### T-36 — Vues statistiques

| Vue | Résultat | Statut |
|-----|----------|--------|
| v_tableau_bord | Données agrégées | ✅ |
| v_erreurs_frequentes | Top erreurs | ✅ |

### T-37 — RPC formateur

| SQL | Résultat | Statut |
|-----|----------|--------|
| verifier_formateur('formateur@ccc.cd', 'ccc2026') | ok=true | ✅ |

### T-38 — Mode offline + sync

| Action | Résultat | Statut |
|--------|----------|--------|
| Couper réseau → session → reconnecter | syncOfflineData() rejoue INSERT | ✅ |

---

## 6. Robustesse

### T-39 — Double clic bouton

| Action | Résultat | Statut |
|--------|----------|--------|
| Double « Continuer » rapide | Une seule transition | ✅ |

### T-40 — Champ nom vide

| Action | Résultat | Statut |
|--------|----------|--------|
| Continuer sans nom | Bouton désactivé | ✅ |

### T-41 — Ville non sélectionnée

| Action | Résultat | Statut |
|--------|----------|--------|
| Continuer sans ville | Bouton désactivé | ✅ |

### T-42 — Supabase indisponible

| Action | Résultat | Statut |
|--------|----------|--------|
| URL invalide | Badge Hors ligne, app fonctionnelle | ✅ |

### T-43 — localStorage plein (simulé)

| Action | Résultat | Statut |
|--------|----------|--------|
| Quota exceeded | Warning console, pas de crash | ✅ |

---

## Tests de démonstration soutenance (checklist)

| # | Scénario démo | Test associé |
|---|---------------|--------------|
| 1 | Session enfant | T-01 |
| 2 | Session adolescent | T-02 |
| 3 | Session formateur | T-09 à T-18 |
| 4 | Commande valide | T-19 |
| 5 | Commande invalide | T-22 |
| 6 | Correction automatique | T-20 |
| 7 | Analyse LL(1) détaillée | T-23 |
| 8 | Requête SQL complexe | MODELE_DONNEES.md § exemple |
| 9 | Session interrompue + reprise | T-06, T-32 |
| 10 | Recommandation personnalisée | T-01, T-02 |
| 11 | Statistique Fondation | T-11, T-36 |
| 12 | Modification en direct | T-13 (modifier grammaire/question) |

---

## Limites connues

| Limite | Impact | Mitigation |
|--------|--------|------------|
| RLS permissif (prototype) | INSERT anon non restreint | Restreindre en production |
| Pas de tests automatisés Jest | Régression manuelle | Scripts console `__CCC_PARSER` |
| Hash SHA-256 formateur | Pas bcrypt/argon2 | Acceptable pour prototype |
| 6 villes hardcodées | Villes hors liste non gérées | Étendre table ville |

---

## Conclusion

Les 43 scénarios de test couvrent l'intégralité des exigences du cahier des charges (modes public/formateur, LL(1), FSM, DB, robustesse). Le prototype est **prêt pour la démonstration de soutenance**.
