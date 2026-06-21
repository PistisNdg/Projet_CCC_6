# Cahier des charges — KebaCode CCC

**Projet N°6 — Version PI.06.26 FCCC-V004**  
**Fondation Children Coding Club — République Démocratique du Congo**

---

## 1. Contexte

La Fondation CCC souhaite prototyper une **borne interactive de sensibilisation au numérique** pour les écoles, centres communautaires, bibliothèques et événements publics.

La borne doit permettre à différents publics de dialoguer avec un système informatique, participer à une enquête intelligente, utiliser des commandes en **mini-français**, recevoir des recommandations adaptées et générer des statistiques utiles à la Fondation.

---

## 2. Problématique

> Comment concevoir un système homme-machine capable de dialoguer avec différents profils, d'interpréter des commandes en mini-français, de piloter dynamiquement une enquête, de recommander un parcours de formation et d'exploiter une base de données relationnelle ?

---

## 3. Objectif général

Réaliser le prototype **KebaCode CCC — Borne Interactive d'Orientation Numérique** démontrant :

- Modélisation d'un problème complexe
- Architecture logicielle cohérente
- Interface robuste (IHM)
- Grammaire compatible LL(1)
- Automate d'états
- Base de données relationnelle
- Recommandations personnalisées
- Justification des choix techniques

---

## 4. Public cible

| Mode | Utilisateurs |
|------|-------------|
| **Public** | Enfants (6–12), adolescents (13–17), parents/tuteurs, visiteurs |
| **Formateur** | Encadreurs CCC certifiés |

---

## 5. Fonctionnalités attendues

### 5.1 Mode public

- Choix de langue (FR, EN, Lingala, Swahili)
- Saisie prénom et ville
- Identification du profil utilisateur
- Enquête interactive adaptative (non linéaire)
- Orientation personnalisée (recommandation de parcours)
- Aide contextuelle progressive
- Reprise de session interrompue
- Fermeture propre (sauvegarde + retour accueil)
- Export PDF du parcours recommandé

### 5.2 Mode formateur

- Authentification sécurisée (email + mot de passe)
- Pilotage par commandes textuelles en mini-français
- Lancement de campagnes thématiques
- Consultation des statistiques (tableau de bord)
- Administration des questions (ajouter, modifier, supprimer)
- Recherche de profils / participants
- Export CSV et PDF
- Analyse des erreurs fréquentes
- Analyse LL(1) détaillée (`analyser …`)

### 5.3 Commandes formateur minimales

```
afficher les statistiques
afficher les erreurs
lancer enquête cybersécurité
lancer campagne école
chercher adolescents de Kinshasa
chercher adolescents intéressés par Python
ajouter question
modifier question 3
supprimer question 4
exporter rapport
recommencer session
quitter
aide
```

---

## 6. Entrées et sorties

| Entrée | Traitement | Sortie | Erreur possible | Réaction système |
|--------|-----------|--------|-----------------|------------------|
| Texte saisi (nom) | Validation non vide | Écran ville | Champ vide | Bouton désactivé |
| Choix ville | Sélection carte | Écran profil | Aucune sélection | Bouton désactivé |
| Choix profil | FSM → ENQUETE | Questions adaptées | — | — |
| Réponse enquête | Scoring + flags | Question suivante | Réponse vide | Bouton désactivé |
| Commande formateur | Lexer → Parser LL(1) | Action système | Faute orthographe | Auto-correction Levenshtein |
| Commande incomplète | Parser | Message warning | Objet manquant | Suggestion de complétion |
| Commande inconnue | Parser | Message danger | Token inconnu | Reformulation + aide |
| Inactivité 20 s | Timer | Bulle aide | — | Message adapté au profil |
| Inactivité 60 s | Timer + FSM | Sauvegarde | — | localStorage + Supabase |
| Interruption réseau | Détection offline | Mode dégradé | DB indisponible | Queue localStorage |

---

## 7. Contraintes techniques

### 7.1 Automate d'états (obligatoire)

États minimaux : ACCUEIL, IDENTIFICATION_PROFIL, CHOIX_MODE, ENQUETE, ANALYSE_REPONSES, RECOMMANDATION, MODE_FORMATEUR, ANALYSE_COMMANDE, STATISTIQUES, ERREUR, SAUVEGARDE, FIN_SESSION.

États additionnels implémentés : SAISIE_NOM, SAISIE_VILLE, AUTH_FORMATEUR.

### 7.2 Gestion du temps d'attente

| Délai | Action |
|-------|--------|
| 20 s | Proposer une aide |
| 40 s | Reformuler la question |
| 60 s | Sauvegarder la session |
| 90 s | Fermer proprement |

### 7.3 Résistance aux erreurs (3 niveaux)

1. **Correction automatique** — confiance > 80 % (Levenshtein ≤ 2)
2. **Suggestion** — confiance 50–80 % (« Voulez-vous dire… ? »)
3. **Reformulation** — confiance < 50 % (liste des commandes)

### 7.4 Grammaire LL(1)

Grammaire non ambiguë, factorisée, avec ensembles FIRST/FOLLOW, table LL(1), analyse de phrases valides/invalides, arbre syntaxique et stratégie de récupération.

### 7.5 Base de données relationnelle

12 tables minimales : utilisateur, session, question, réponse, parcours, recommandation, campagne, ville, commande, erreur, événement, formateur.

Minimum 15 fonctions SQL / requêtes métier.

### 7.6 Enquête adaptative

Thèmes obligatoires : accès téléphone, Internet, codage, réseaux sociaux, cybersécurité, protection données, cyberharcèlement, Scratch, Python, robotique, ville, disponibilité club CCC.

Logique non linéaire selon les réponses (flags → branchement).

---

## 8. Livrables attendus

### Documentation de conception
1. Cahier des charges *(ce document)*
2. Architecture générale
3. Diagramme d'états
4. Modèle de données
5. Scripts SQL
6. Grammaire complète + table LL(1)

### Composants logiciels
8. Analyseur lexical (`lexer.js`)
9. Analyseur syntaxique (`parser.js`)
10. Moteur de dialogue (`conversation.js`)
11. Interface utilisateur (`screens/`, `ui.js`)
12. Module de recommandation (`data.js` → `recommander()`)
13. Module de statistiques (`statistiques.js`, vues SQL)
14. Système de gestion des erreurs (`parser.js`, `engine.js`)

### Documentation et validation
15. Documentation technique
16. Guide utilisateur
17. Guide formateur
18. Rapport de tests
19. Journal d'exécution
20. Présentation de soutenance

---

## 9. Barème d'évaluation (rappel)

| Critère | Points |
|---------|--------|
| Analyse du problème | 10 |
| Architecture et moteur d'états | 10 |
| Interface homme-machine | 10 |
| Grammaire et analyse LL(1) | 20 |
| Gestion des erreurs | 10 |
| Base de données relationnelle | 15 |
| Algorithme de recommandation | 10 |
| Tests et robustesse | 10 |
| Documentation et soutenance | 5 |
| **Bonus** (offline, multilingue, dashboard, export, anonymisation) | +23 max |

---

## 10. Démonstration obligatoire (soutenance)

- Session enfant, adolescent, formateur
- Commande valide et invalide
- Correction automatique
- Analyse LL(1) détaillée
- Requête SQL complexe
- Session interrompue puis reprise
- Recommandation personnalisée
- Statistique utile à la Fondation
- Modification du système en direct
