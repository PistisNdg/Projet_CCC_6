# Journal d'exécution — KebaCode CCC

Ce document présente des **traces d'exécution typiques** du système, telles qu'observables dans la console navigateur (F12) et les logs Supabase.

---

## 1. Session enfant — trace FSM complète

```
[FSM] ACCUEIL → CHOIX_MODE (event: choisir_langue)
[FSM] CHOIX_MODE → SAISIE_NOM (event: demarrer)
[FSM] SAISIE_NOM → SAISIE_VILLE (event: continuer)
[FSM] SAISIE_VILLE → IDENTIFICATION_PROFIL (event: continuer)
[Supabase] creerUtilisateur({ pseudo: 'Amina', ville: 'Kinshasa', tranche_age: '6–12' })
[Supabase] creerSession({ mode: 'public', etat: 'ENQUETE' })
[FSM] IDENTIFICATION_PROFIL → ENQUETE (event: choisir_profil)
[Conversation] Module: decouverte → Question q1 (profil: enfant)
[Supabase] enregistrerReponse({ id_session, id_question_ext: 'q1', valeur: 'Oui' })
[Conversation] Flag: utilise_telephone=true
[Conversation] Module: decouverte → Question q2
[Supabase] enregistrerReponse({ id_question_ext: 'q2', valeur: 'Non' })
[Conversation] Flag: jamais_internet=true → branchement parcours découverte
[Conversation] Module: cybersecurite → Question q5
...
[FSM] ENQUETE → ANALYSE_REPONSES (event: terminer)
[Recommandation] parcoursScores: { enfant: 70, cybersec: 0, ado: 0 }
[Recommandation] bestKey: 'enfant' → Découverte numérique
[Supabase] enregistrerRecommandation({ parcours_key: 'enfant', score: 70 })
[FSM] ANALYSE_REPONSES → RECOMMANDATION (event: terminee)
[FSM] RECOMMANDATION → FIN_SESSION (event: rejoindre)
[Supabase] finaliserSession({ statut: 'terminee' })
[FSM] FIN_SESSION → ACCUEIL (event: delai)
```

---

## 2. Session formateur — commande valide

```
[FSM] AUTH_FORMATEUR → MODE_FORMATEUR (event: login_ok)
[Auth] formateur@ccc.cd — Marie Kabila

kebacode> afficher les statistiques

[Lexer] tokenize → [
  { type: 'verbe', value: 'afficher', action: 'show' },
  { type: 'article', value: 'les' },
  { type: 'objet', value: 'statistiques', target: 'stats' }
]
[Parser] parse → { ok: true, action: 'show', target: 'stats' }
[FSM] MODE_FORMATEUR → ANALYSE_COMMANDE (event: saisir_cmd)
[Supabase] journaliserCommande({
  texte_brut: 'afficher les statistiques',
  action: 'show', objet: 'stats', statut: 'ok'
})
[Supabase] tableauDeBordSynthetique() → v_tableau_bord
[Output] Mini-dash: 48 participants, 75% complétion
[FSM] ANALYSE_COMMANDE → MODE_FORMATEUR (event: ok)
```

---

## 3. Commande avec auto-correction (niveau 1)

```
kebacode> afficher statistique

[Lexer] tokenize → [
  { type: 'verbe', value: 'afficher', action: 'show' },
  { type: 'inconnu', value: 'statistique', suggest: 'statistiques', confidence: 92 }
]
[Lexer] autoCorrectTokens → 'statistique' corrigé en 'statistiques' (Levenshtein=1)
[Parser] parse → { ok: true, action: 'show', target: 'stats', autoFixed: true }
[Supabase] journaliserCommande({
  texte_brut: 'afficher statistique',
  texte_corrige: 'afficher statistiques',
  statut: 'corrige'
})
[Output] Statistiques affichées (correction silencieuse)
```

---

## 4. Commande avec suggestion (niveau 2)

```
kebacode> afficher stat

[Lexer] 'stat' → suggest: 'statistiques', confidence: 67
[Parser] parse → {
  ok: false,
  level: 'warning',
  message: 'Mot inconnu « stat » — vouliez-vous dire « statistiques » ?',
  suggestion: 'afficher statistiques'
}
[Supabase] journaliserErreur({
  type_erreur: 'commande',
  entree_fautive: 'stat',
  message: 'Mot inconnu — suggestion proposée'
})
[Output] Chip cliquable: ↵ afficher les statistiques
[FSM] ANALYSE_COMMANDE → MODE_FORMATEUR (event: erreur)
```

---

## 5. Analyse LL(1) — trace pile

Commande : `analyser chercher adolescents de Kinshasa`

```
// analyse pile LL(1)
[$ PROGRAMME] | chercher adolescents de Kinshasa $ → PROGRAMME → COMMANDE $
[$ COMMANDE] | chercher adolescents de Kinshasa $ → COMMANDE → ACTION SUITE
[$ SUITE ACTION] | chercher adolescents de Kinshasa $ → ACTION → verbe → Déplacer chercher
[$ SUITE] | adolescents de Kinshasa $ → SUITE → CORPS
[$ CORPS] | adolescents de Kinshasa $ → CORPS → OBJET COMPLEMENT
[$ COMPLEMENT OBJET] | adolescents de Kinshasa $ → OBJET → objet → Déplacer adolescents
[$ COMPLEMENT] | de Kinshasa $ → COMPLEMENT → PREP VALEUR COMPLEMENT
[$ COMPLEMENT VALEUR PREP] | de Kinshasa $ → PREP → prep → Déplacer de
[$ COMPLEMENT VALEUR] | Kinshasa $ → VALEUR → VILLE → Déplacer kinshasa
[$ COMPLEMENT] | $ → COMPLEMENT → ε
[$] | $ → Accepté ✓
```

---

## 6. Inactivité — séquence timers

```
t=0s    [Inactivity] start(ENQUETE) — timers armés
t=12s   [User] touch conv_choose → bump() — timers reset
t=32s   [Inactivity] onAide() — bulle « Besoin d'aide pour continuer ? »
t=38s   [User] aide_non → bump()
t=58s   [Inactivity] onAide()
t=78s   [Inactivity] onReformuler() — « Je peux reformuler la question si besoin. »
t=98s   [Inactivity] onSauvegarder()
        [FSM] ENQUETE → SAUVEGARDE (event: inactivite_60)
        [Supabase] sauvegarderProgression({ etat: 'ENQUETE', contexte: {...} })
        [Toast] Session sauvegardée
        [FSM] SAUVEGARDE → ACCUEIL (event: ok)
t=128s  [Inactivity] onFermer() — (session déjà fermée)
```

---

## 7. Reprise session interrompue

```
[Init] localStorage.getItem('ccc_session_v1') → {
  etat: 'ENQUETE',
  contexte: { lang: 'fr', userName: 'Amina', profile: { id: 'enfant' }, answers: [...] },
  savedAt: 1718976000000
}
[FSM] Session restaurée → ENQUETE
[UI] Bandeau « Reprendre votre session ? — Session de Amina »

[User] data-action=reprendre
[FSM] ACCUEIL → ENQUETE (event: reprendre, etatSauvegarde: ENQUETE)
[Conversation] restoreConversation(saved.conversation, 'fr')
[UI] Fil de chat restauré, question courante affichée
```

---

## 8. Mode hors ligne — queue sync

```
[Network] offline event
[Supabase] isOffline() → true
[Toast] Hors ligne

[User] Répond question q3
[Offline] Queue: { type: 'reponse', payload: { id_session, valeur: 'Oui' } }

[Network] online event
[Supabase] syncOfflineData()
[Offline] Replay 3 reponses → INSERT reponse × 3
[Toast] En ligne — données synchronisées
```

---

## 9. Événements table `evenement` (exemple SQL)

```sql
INSERT INTO evenement (id_session, type_evt, etat_avant, etat_apres) VALUES
  ('uuid-session', 'transition', 'ACCUEIL', 'CHOIX_MODE'),
  ('uuid-session', 'transition', 'ENQUETE', 'ANALYSE_REPONSES'),
  ('uuid-session', 'timeout', 'ENQUETE', 'SAUVEGARDE'),
  ('uuid-session', 'transition', 'RECOMMANDATION', 'FIN_SESSION');
```

---

## 10. Tableau entrée → traitement → sortie

| # | Entrée | Traitement | Sortie | Erreur | Réaction |
|---|--------|-----------|--------|--------|----------|
| 1 | Touch accueil | FSM choisir_langue | Écran CHOIX_MODE | — | — |
| 2 | « afficher stat » | Lexer+Parser L2 | Chip suggestion | Token partiel | Warning |
| 3 | Inactivité 60s | InactivityManager | Toast + SAUVEGARDE | — | Redirect ACCUEIL |
| 4 | Réponse q2 « Non » | applyChoice | Flag jamais_internet | — | Branchement modules |
| 5 | Login wrong pass | RPC verifier_formateur | Message erreur | ok=false | Reste AUTH |
| 6 | Coupure réseau | setOffline(true) | Badge hors ligne | DB down | Queue localStorage |

---

## Comment générer ce journal en live

1. Ouvrir **http://localhost:8080**
2. DevTools → Console (F12)
3. Filtrer par `[FSM]`, `[Lexer]`, `[Parser]`, `[Supabase]`
4. Pour LL(1) : taper `analyser <commande>` dans le terminal formateur

Les logs `[FSM]` sont émis automatiquement par `engine.js` à chaque transition.
