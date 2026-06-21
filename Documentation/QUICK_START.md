# Démarrage rapide — KebaCode CCC

## En 3 minutes

### 1. Cloner et lancer le serveur local

```bash
git clone https://github.com/PistisNdg/Projet_CCC_6.git
cd Projet_CCC_6/kebacode-ccc
python3 -m http.server 8080
```

Ouvrir **http://localhost:8080** dans Chrome ou Firefox.

### 2. Parcours visiteur (mode public)

1. Touchez l'écran d'accueil → choisissez **Français**
2. **Candidat** → saisissez un prénom → choisissez une ville
3. Sélectionnez un profil (Enfant / Adolescent / Parent / Visiteur)
4. Répondez aux questions de l'enquête conversationnelle
5. Consultez votre parcours recommandé → téléchargez le PDF

### 3. Parcours formateur

1. Accueil → **Formateur CCC**
2. Connexion : `formateur@ccc.cd` / `ccc2026`
3. Tapez une commande, par exemple :

```
afficher les statistiques
```

```
lister tout
```

```
aide
```

### 4. Debug console (soutenance)

Ouvrir les DevTools (F12) :

```javascript
// Analyser une commande
window.__CCC_PARSER.parse('chercher adolescents de Kinshasa')

// Tokeniser
window.__CCC_LEXER.tokenize('afficher les statistiques')

// Grammaire LL(1)
import('./assets/js/parser.js').then(m => console.log(m.getGrammarInfo()))
```

---

## Vérifications rapides

| Test | Résultat attendu |
|------|------------------|
| Badge « En ligne » en bas | Supabase connecté |
| Badge « Hors ligne » | Mode dégradé (localStorage) |
| `afficher statistique` | Suggestion « afficher les statistiques » |
| Inactivité 20 s | Bulle d'aide contextuelle |
| Reprendre session | Bouton sur l'écran d'accueil |

---

## Prochaines étapes

- Configuration Supabase complète → [INSTALL_GUIDE.md](INSTALL_GUIDE.md)
- Architecture → [ARCHITECTURE.md](ARCHITECTURE.md)
- Commandes formateur → [GUIDE_FORMATEUR.md](GUIDE_FORMATEUR.md)
