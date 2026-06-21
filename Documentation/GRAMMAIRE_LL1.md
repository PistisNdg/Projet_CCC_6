# Grammaire LL(1) — Mini-français KebaCode

**Implémentation** : `kebacode-ccc/assets/js/lexer.js` + `parser.js`

---

## 1. Définition formelle

### Axiome

```
PROGRAMME
```

### Terminaux

| Catégorie | Tokens | Exemples |
|-----------|--------|----------|
| VERBE | `verbe` | afficher, lancer, chercher, ajouter, modifier, supprimer, exporter, lister, aide, quitter… |
| ARTICLE | `article` | le, la, les, un, une, des |
| OBJET | `objet` | statistiques, erreurs, participants, question, rapport, campagne… |
| COMPLEMENT | `complement` | kinshasa, cybersecurite, python, scratch, robotique, ecole… |
| PREP | `prep` | de, par, pour, à |
| NOMBRE | `nombre` | 1, 2, 3, 4… |
| FILTRE | `filtre` | intéressés, interesses |
| FIN | `$` | fin de chaîne |

### Non-terminaux

```
PROGRAMME, COMMANDE, SUITE, CORPS, COMPLEMENT, VALEUR, ACTION, ARTICLE, OBJET, PREP
```

### Règles de production (factorisées, sans ambiguïté)

```
(1)  PROGRAMME  → COMMANDE $
(2)  COMMANDE   → ACTION SUITE
(3)  SUITE      → ARTICLE CORPS | CORPS
(4)  CORPS      → OBJET COMPLEMENT | OBJET | ε
(5)  COMPLEMENT → PREP VALEUR COMPLEMENT | ε
(6)  VALEUR     → VILLE | THEME | NOMBRE | FILTRE
(7)  ACTION     → verbe
(8)  ARTICLE    → article
(9)  OBJET      → objet
(10) PREP       → prep
```

**Factorisation** : la règle (3) `SUITE → ARTICLE CORPS | CORPS` évite l'ambiguïté entre commandes avec/sans article (« afficher **les** statistiques » vs « lister tout »).

**Suppression ambiguïté** : les verbes sont normalisés en actions (`show`, `launch`, `search`…) avant l'exécution, séparant analyse et sémantique.

---

## 2. Ensembles FIRST

| Non-terminal | FIRST |
|--------------|-------|
| PROGRAMME | { verbe, inconnu, article, objet, prep, complement, nombre, filtre } |
| COMMANDE | { verbe, inconnu, article, objet } |
| SUITE | { article, objet, complement, prep, nombre, filtre, **ε** } |
| CORPS | { objet, complement, prep, nombre, filtre, **ε** } |
| COMPLEMENT | { prep, complement, nombre, filtre, **ε** } |
| VALEUR | { complement, nombre, filtre } |
| ACTION | { verbe } |
| ARTICLE | { article } |
| OBJET | { objet } |
| PREP | { prep } |

---

## 3. Ensembles FOLLOW

| Non-terminal | FOLLOW |
|--------------|--------|
| PROGRAMME | { $ } |
| COMMANDE | { $ } |
| SUITE | { $ } |
| CORPS | { $ } |
| COMPLEMENT | { $ } |

---

## 4. Table LL(1)

| Non-terminal | Lookahead | Production |
|--------------|-----------|------------|
| PROGRAMME | START | COMMANDE $ |
| COMMANDE | verbe | ACTION SUITE |
| COMMANDE | inconnu | ACTION SUITE |
| SUITE | article | ARTICLE CORPS |
| SUITE | objet, complement, prep, nombre, filtre | CORPS |
| SUITE | $ | ε |
| CORPS | objet | OBJET COMPLEMENT |
| CORPS | complement, prep, nombre, filtre | COMPLEMENT |
| CORPS | $ | ε |
| COMPLEMENT | prep | PREP VALEUR COMPLEMENT |
| COMPLEMENT | complement, nombre, filtre | VALEUR COMPLEMENT |
| COMPLEMENT | $ | ε |
| VALEUR | complement (ville) | VILLE |
| VALEUR | complement (thème) | THEME |
| VALEUR | nombre | NOMBRE |
| VALEUR | filtre | FILTRE |
| ACTION | verbe | verbe |
| ARTICLE | article | article |
| OBJET | objet | objet |
| PREP | prep | prep |

### Preuve LL(1)

Pour chaque paire (A, a) où A est un non-terminal et a un terminal, **au plus une production** est applicable. Les conflits FIRST/FOLLOW sont résolus par :

- Factorisation de SUITE (article optionnel)
- COMPLEMENT récursif à gauche remplacé par récursion à droite implicite (ε terminal)
- Pas de non-terminal commençant par le même terminal dans des alternatives disjointes

---

## 5. Analyse de phrases valides (5 exemples)

### Phrase 1 : `afficher les statistiques`

```
Tokens : [verbe:afficher] [article:les] [objet:statistiques] [$]

Pile          | Entrée                    | Action
--------------|---------------------------|----------------------------------
$ PROGRAMME   | afficher les statistiques | PROGRAMME → COMMANDE $
$ COMMANDE    | afficher ...              | COMMANDE → ACTION SUITE
$ SUITE ACTION| afficher ...              | ACTION → verbe (déplacer afficher)
$ SUITE       | les statistiques $        | SUITE → ARTICLE CORPS
$ CORPS ARTICLE| les statistiques $        | ARTICLE → article (déplacer les)
$ CORPS       | statistiques $            | CORPS → OBJET COMPLEMENT
$ COMPLEMENT OBJET | statistiques $       | OBJET → objet (déplacer statistiques)
$ COMPLEMENT  | $                         | COMPLEMENT → ε
$             | $                         | Accepté ✓

Résultat : { action: 'show', target: 'stats' }
```

### Phrase 2 : `lancer enquête cybersécurité`

```
Résultat : { action: 'launch', target: 'enquete', complement: { theme: 'cybersecurite' } }
```

### Phrase 3 : `chercher adolescents de Kinshasa`

```
Résultat : { action: 'search', target: 'profiles', complement: { filter: 'adolescents', ville: 'kinshasa' } }
```

### Phrase 4 : `modifier question 3`

```
Résultat : { action: 'modify', target: 'question', complement: { number: 3 } }
```

### Phrase 5 : `aide`

```
Résultat : { action: 'help' } — verbe seul, CORPS → ε
```

---

## 6. Analyse de phrases invalides (3 exemples)

### Phrase 1 : `afficher stat` (incomplète + faute)

```
Niveau 1 : auto-correction « stat » → « statistiques » (Levenshtein = 2)
Si échec → Niveau 2 : « Voulez-vous dire "afficher les statistiques" ? »
```

### Phrase 2 : `xyz les participants` (verbe inconnu)

```
Niveau 3 : confiance < 50 %
Message : « Commande inconnue — tapez "aide" pour la liste des commandes. »
```

### Phrase 3 : `afficher` (objet manquant)

```
Niveau 2 (warning) : « Commande incomplète — vouliez-vous dire "afficher les statistiques" ? »
Suggestion cliquable dans le terminal
```

---

## 7. Arbre syntaxique — `chercher adolescents de Kinshasa`

```
                    PROGRAMME
                        │
                    COMMANDE
                   /        \
               ACTION      SUITE
                 │           │
              afficher     CORPS
                           /    \
                       OBJET   COMPLEMENT
                          │      /       \
                    adolescents PREP    VALEUR
                          │      │         │
                          │      de     kinshasa
                          │      │
                          └── COMPLEMENT (ε)
```

---

## 8. Stratégie de récupération d'erreur

| Niveau | Condition | Action |
|--------|-----------|--------|
| **1 — Auto** | Levenshtein ≤ 2, confiance > 80 % | Correction silencieuse, flag `autoFixed` |
| **2 — Suggestion** | Confiance 50–80 % ou objet manquant | Message warning + chip cliquable |
| **3 — Reformulation** | Token inconnu ou confiance < 50 % | Message danger + liste `SUGGESTED_COMMANDS` |

Journalisation : chaque erreur → `journaliserErreur()` en base (table `erreur`).

---

## 9. Vocabulaire lexical (extrait)

### Verbes → actions

| Surface | Action normalisée |
|---------|-------------------|
| afficher, montrer, voir | show |
| lancer | launch |
| chercher | search |
| ajouter, créer | add |
| modifier | modify |
| supprimer, effacer | delete |
| exporter | export |
| lister | list |
| analyser | analyze |
| aide | help |
| quitter | quit |
| recommencer | restart |

### Objets → cibles

| Surface | Cible |
|---------|-------|
| statistiques, stats, tableau | stats |
| erreurs | errors |
| participants, profils | participants / profiles |
| question, questions | question |
| rapport | rapport |
| campagne | campagne |
| enquête | enquete |

---

## 10. Commande spéciale : `analyser …`

```
analyser afficher les statistiques
```

Déclenche `parseWithStack()` et affiche la trace complète de la pile LL(1) dans le terminal formateur — utile pour la démonstration de soutenance.

Console :

```javascript
window.__CCC_PARSER.parse('analyser chercher adolescents de Kinshasa')
// → stackResult.steps[]
```

---

## 11. Accès programmatique

```javascript
import { getGrammarInfo, buildLL1Table, parseWithStack } from './assets/js/parser.js';

console.log(getGrammarInfo());
// → { productions, FIRST, FOLLOW, table }
```
