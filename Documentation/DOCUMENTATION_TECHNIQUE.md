# Documentation technique — KebaCode CCC

## Configuration (`config.js`)

| Constante | Valeur | Description |
|-----------|--------|-------------|
| `SUPABASE_URL` | URL projet Supabase | Endpoint API |
| `SUPABASE_ANON_KEY` | Clé publique anon | Authentification client |
| `TIMEOUTS.AIDE` | 20000 ms | Premier seuil inactivité |
| `TIMEOUTS.REFORMULER` | 40000 ms | Reformulation |
| `TIMEOUTS.SAUVEGARDER` | 60000 ms | Sauvegarde auto |
| `TIMEOUTS.FERMER` | 90000 ms | Fermeture session |
| `SESSION_KEY` | `ccc_session_v1` | Clé localStorage session |
| `FORMATEUR_AUTH_KEY` | `ccc_formateur_auth` | Session formateur |
| `FORMATEUR_AUTH_TTL_MS` | 28800000 (8 h) | Expiration auth |
| `LEVENSHTEIN_MAX` | 2 | Seuil correction orthographe |
| `DEV_MODE` | true/false | Affiche hints auth en dev |

---

## Module `app.js` — API interne

### Classe `App`

| Méthode | Description |
|---------|-------------|
| `init()` | Bootstrap : Supabase, session, auth, listeners |
| `render()` | Switch FSM → écran correspondant |
| `handleAction(action, el)` | Route les `data-action` UI |
| `persistToDb()` | Sauvegarde contexte → Supabase |
| `startInactivity()` | Active InactivityManager selon état |
| `handleConvOpen(text)` | Réponse libre enquête |
| `submitAuthFormateur()` | Login formateur |
| `doExportPDF()` | Génère fiche parcours |

### Actions UI (`data-action`)

| Action | Contexte |
|--------|----------|
| `choisir_langue` | Accueil |
| `demarrer` / `mode_formateur` | Choix rôle |
| `choisir_ville` | Carte ville |
| `choisir_profil` | Carte profil |
| `conv_choose` / `conv_send` | Enquête |
| `submit_auth_formateur` | Login |
| `cmd_submit` / `cmd_suggestion` | Terminal formateur |
| `export_csv` / `export_pdf` | Stats |

---

## Module `engine.js`

### `ETATS` — énumération des 15 états

### `FSM`

```javascript
const fsm = new FSM();
fsm.transition('choisir_langue');  // ACCUEIL → CHOIX_MODE
fsm.sauvegarder(contexte);         // localStorage
fsm.restaurer();                   // { etat, contexte, savedAt }
fsm.peutTransitionner('demarrer'); // boolean
```

### `InactivityManager`

```javascript
inactivity.start(ETATS.ENQUETE, {
  onAide: () => { ... },
  onReformuler: () => { ... },
  onSauvegarder: () => { ... },
  onFermer: () => { ... },
});
inactivity.bump();  // reset sur interaction
inactivity.stop();  // fin de session
```

---

## Module `lexer.js`

### Exports

| Fonction | Signature | Retour |
|----------|-----------|--------|
| `tokenize` | `(line: string)` | `Token[]` |
| `autoCorrectTokens` | `(tokens: Token[])` | `Token[]` |
| `lev` | `(a, b: string)` | `number` |
| `classify` | `(word: string)` | `Token \| null` |

### Structure Token

```javascript
{
  type: 'verbe' | 'article' | 'objet' | 'complement' | 'nombre' | 'filtre' | 'inconnu',
  value: 'afficher',
  action: 'show',        // si verbe
  target: 'stats',       // si objet
  complement: 'kinshasa', // si complement
  autoCorrected: true,   // si corrigé
  suggest: 'statistiques', // si suggestion
  confidence: 85         // 0-100
}
```

---

## Module `parser.js`

### Exports

| Fonction | Usage |
|----------|-------|
| `parse(line)` | Analyse complète → action système |
| `parseWithStack(tokens)` | Trace LL(1) pour soutenance |
| `buildLL1Table()` | Table de parsing |
| `getGrammarInfo()` | FIRST, FOLLOW, productions |
| `SUGGESTED_COMMANDS` | Liste aide formateur |

### Résultat `parse()`

```javascript
// Succès
{ ok: true, action: 'show', target: 'stats', complement: null, autoFixed: false }

// Erreur niveau 2
{ ok: false, level: 'warning', message: '...', suggestion: 'afficher les statistiques' }

// Erreur niveau 3
{ ok: false, level: 'danger', message: 'Commande inconnue...' }
```

---

## Module `conversation.js`

| Fonction | Description |
|----------|-------------|
| `initConversation(profileId, lang)` | Démarre l'enquête adaptative |
| `bootstrapConversation()` | Charge modules + questions Supabase |
| `applyChoice(moduleId, choiceId)` | Enregistre réponse, calcule flags/scores |
| `restoreConversation(saved, lang)` | Reprise session |
| `listConversationModules()` | Liste pour commande `lister tout` |

### Flags de branchement

| Flag | Effet |
|------|-------|
| `jamais_internet` | Parcours découverte numérique |
| `connait_scratch` | Parcours algorithmique avancé |
| `aime_python` | Python débutant |
| `aime_aider` | Mentor Junior |
| `probleme_motdepasse` | Module cybersécurité |
| `aime_robots` | Robotique |

---

## Module `data.js`

### `recommander(answers, profileId)`

Algorithme de scoring :

1. Agrège `flags` et `scores` de toutes les réponses
2. Initialise `parcoursScores` selon profil de base (+30 enfant/ado)
3. Applique bonus flags (ex. `aime_python` → +60 python_avance)
4. Retourne parcours à score maximal

### Parcours (`RECOS`)

| Clé | Parcours |
|-----|----------|
| `enfant` | Découverte numérique — Scratch Junior |
| `ado` | Scratch avancé → Python |
| `python_avance` | Python + algorithmique |
| `mentor` | Mentor Junior CCC |
| `cybersec` | Cybersécurité Jeunes |
| `robotique` | Initiation robotique |
| `parent` | Accompagnement parental |
| `visiteur` | Découverte CCC |

### Internationalisation

4 langues : `fr`, `en`, `ln`, `sw` — fonction `t(lang, key)`.

---

## Module `supabase.js` — Référence API

### Initialisation

```javascript
initSupabase()  // window.supabase.createClient(...)
isOffline()     // true si pas de client ou navigator.offLine
setOffline(bool)
syncOfflineData()  // rejoue queue localStorage
```

### CRUD Session

```javascript
await creerSession(idUtilisateur, idCampagne, 'public', contexteInitial)
await sauvegarderProgression(idSession, etat, contexteJSON)
await finaliserSession(idSession, etat, contexte, 'terminee')
await enregistrerReponse(idSession, idQuestion, valeur, dureeSaisie)
await enregistrerRecommandation(idSession, parcoursKey, score)
```

### Auth formateur

```javascript
await authentifierFormateur(email, password)
// → RPC verifier_formateur → { ok, id, prenom, nom, email }

restaurerAuthFormateur()  // localStorage + TTL check
deconnecterFormateur()
```

### Offline queue

Clés localStorage :

- `ccc_offline_sessions`
- `ccc_offline_reponses`
- `ccc_offline_commandes`
- `ccc_offline_erreurs`

---

## Module `ui.js` — Composants

| Export | Description |
|--------|-------------|
| `render(html)` | Injecte dans `#root` |
| `headerBar(opts)` | Barre haute (langue, user, état) |
| `dockBar(opts)` | Barre basse (online/offline) |
| `btn(opts)` | Bouton stylé |
| `showToast(msg, type)` | Notification |
| `barChart / donutChart / lineChart` | Graphiques SVG |
| `genererFichePDF(state, reco)` | HTML → print PDF |
| `exportCSV(rows, filename)` | Téléchargement CSV |

---

## CSS — Variables (`main.css`)

```css
--orange: #FF6B2C;
--cyan: #00D4AA;
--bg: #0A0A0F;
--term-orange: #FF8C42;  /* terminal formateur */
```

Classes profil : `.tone-child`, `.tone-teen`, `.tone-adult`.

---

## Points d'extension

| Besoin | Fichier à modifier |
|--------|-------------------|
| Nouvelle commande | `lexer.js` (LEX) + `formateur.js` (handler) |
| Nouvel état FSM | `engine.js` (TRANSITIONS) + `app.js` (render switch) |
| Nouvelle question | Supabase `question` ou `conversation.js` |
| Nouveau parcours | `data.js` (RECOS) + `schema.sql` (parcours) |
| Nouvelle langue | `data.js` (I18N) + `conversation-i18n.js` |

---

## Debug

```javascript
// Console navigateur (F12)
window.__CCC_LEXER.tokenize('afficher les statistiques')
window.__CCC_PARSER.parse('lancer enquête cybersécurité')

// Logs FSM automatiques
// [FSM] ENQUETE → ANALYSE_REPONSES (event: terminer)
```
