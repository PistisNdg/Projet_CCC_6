/* ============================================================
   KebaCode CCC — Analyseur syntaxique LL(1)
   ============================================================ */

import { tokenize, autoCorrectTokens, classify } from './lexer.js';

export const SUGGESTED_COMMANDS = [
  'afficher les participants',
  'afficher les statistiques',
  'afficher les erreurs',
  'chercher adolescents de Kinshasa',
  'lister tout',
  'ajouter question',
  'modifier question 3',
  'lancer enquête cybersécurité',
  'lancer campagne école',
  'exporter rapport',
  'recommencer session',
  'aide',
];

/** Grammaire LL(1) — ensembles FIRST */
const FIRST = {
  PROGRAMME: ['verbe', 'inconnu', 'article', 'objet', 'prep', 'complement', 'nombre', 'filtre'],
  COMMANDE: ['verbe', 'inconnu', 'article', 'objet'],
  SUITE: ['article', 'objet', 'complement', 'prep', 'nombre', 'filtre', 'ε'],
  CORPS: ['objet', 'complement', 'prep', 'nombre', 'filtre', 'ε'],
  COMPLEMENT: ['prep', 'complement', 'nombre', 'filtre', 'ε'],
  VALEUR: ['complement', 'nombre', 'filtre'],
  ACTION: ['verbe'],
  ARTICLE: ['article'],
  OBJET: ['objet'],
  PREP: ['prep'],
};

/** FOLLOW sets */
const FOLLOW = {
  PROGRAMME: ['$'],
  COMMANDE: ['$'],
  SUITE: ['$'],
  CORPS: ['$'],
  COMPLEMENT: ['$'],
};

/** Table LL(1) simplifiée : non-terminal → (lookahead → production) */
export function buildLL1Table() {
  return {
    PROGRAMME: { START: 'COMMANDE $' },
    COMMANDE: { verbe: 'ACTION SUITE', inconnu: 'ACTION SUITE' },
    SUITE: { article: 'ARTICLE CORPS', objet: 'CORPS', complement: 'CORPS', prep: 'CORPS', nombre: 'CORPS', filtre: 'CORPS', $: 'ε' },
    CORPS: { objet: 'OBJET COMPLEMENT', complement: 'COMPLEMENT', prep: 'COMPLEMENT', nombre: 'COMPLEMENT', filtre: 'COMPLEMENT', $: 'ε' },
    COMPLEMENT: { prep: 'PREP VALEUR COMPLEMENT', complement: 'VALEUR COMPLEMENT', nombre: 'VALEUR COMPLEMENT', filtre: 'VALEUR COMPLEMENT', $: 'ε' },
    VALEUR: { complement: 'VILLE|THEME', nombre: 'NOMBRE', filtre: 'FILTRE' },
    ACTION: { verbe: 'verbe' },
    ARTICLE: { article: 'article' },
    OBJET: { objet: 'objet' },
    PREP: { prep: 'prep' },
  };
}

/** Analyse avec pile — retourne les étapes détaillées */
export function parseWithStack(tokens) {
  const steps = [];
  const stack = ['$', 'PROGRAMME'];
  let idx = 0;
  const corrected = autoCorrectTokens(tokens);
  const input = [...corrected, { type: '$', value: '$' }];

  const table = buildLL1Table();

  while (stack.length > 0) {
    const top = stack.pop();
    const current = input[idx] || { type: '$', value: '$' };
    const lookahead = current.type === 'inconnu' && current.autoCorrected ? 'verbe' : current.type;

    steps.push({
      stack: [...stack, top],
      input: input.slice(idx).map((t) => t.value),
      action: `Sommet: ${top}, Lookahead: ${current.value} (${lookahead})`,
    });

    if (top === '$') {
      if (current.type === '$') {
        steps.push({ stack: [], input: [], action: 'Accepté ✓' });
        break;
      }
      steps.push({ stack: [...stack], input: input.slice(idx).map((t) => t.value), action: 'Erreur: pile vide' });
      break;
    }

    if (top === 'ε') continue;

    const terminals = ['verbe', 'article', 'objet', 'prep', 'complement', 'nombre', 'filtre', 'inconnu'];
    if (terminals.includes(top) || top.startsWith('VILLE') || top.startsWith('THEME') || top.startsWith('NOMBRE') || top.startsWith('FILTRE')) {
      const matchTypes = {
        ACTION: 'verbe', ARTICLE: 'article', OBJET: 'objet', PREP: 'prep',
        VILLE: 'complement', THEME: 'complement', NOMBRE: 'nombre', FILTRE: 'filtre',
      };
      const expected = matchTypes[top] || top;
      if (current.type === expected || (top === 'ACTION' && current.type === 'verbe')) {
        idx++;
        steps[steps.length - 1].action += ` → Déplacer ${current.value}`;
      } else if (top === 'verbe' && current.type === 'verbe') {
        idx++;
      } else {
        steps[steps.length - 1].action += ` → Erreur: attendu ${expected}`;
        break;
      }
      continue;
    }

    const prod = table[top]?.[lookahead] || table[top]?.['$'] || table[top]?.['objet'] || table[top]?.['verbe'];
    if (!prod || prod === 'ε') continue;

    const symbols = prod.split(' ').reverse();
    stack.push(...symbols);
    steps[steps.length - 1].action += ` → ${top} → ${prod}`;
  }

  return { steps, tokens: corrected };
}

/** Analyse complète d'une commande */
export function parse(line) {
  const rawTokens = tokenize(line);
  if (!rawTokens.length) {
    return { ok: false, level: null, tokens: rawTokens, message: '' };
  }

  const tokens = autoCorrectTokens(rawTokens);
  const inconnu = tokens.find((tk) => tk.type === 'inconnu' && !tk.autoCorrected);

  // Niveau 1 : correction auto (confiance > 80%)
  const autoFixed = tokens.some((tk) => tk.autoCorrected);

  // Niveau 2 : suggestion (confiance 50-80%)
  if (inconnu && inconnu.suggest && inconnu.confidence >= 50 && inconnu.confidence <= 80) {
    const fixed = tokens.map((tk) => (tk === inconnu ? inconnu.suggest : tk.value)).join(' ');
    return {
      ok: false,
      level: 'warning',
      tokens: rawTokens,
      message: `Mot inconnu « ${inconnu.value} » — vouliez-vous dire « ${inconnu.suggest} » ?`,
      suggestion: fixed,
      confidence: inconnu.confidence,
    };
  }

  // Niveau 3 : reformulation (confiance < 50%)
  if (inconnu && !inconnu.suggest) {
    return {
      ok: false,
      level: 'danger',
      tokens: rawTokens,
      message: 'Commande inconnue — tapez « aide » pour la liste des commandes.',
      confidence: 0,
    };
  }

  const verbe = tokens.find((tk) => tk.type === 'verbe');
  const objet = tokens.find((tk) => tk.type === 'objet');
  const complements = tokens.filter((tk) => tk.type === 'complement' || tk.type === 'filtre' || tk.type === 'nombre');

  if (!verbe) {
    return {
      ok: false,
      level: 'danger',
      tokens: rawTokens,
      message: 'Commande inconnue — veuillez reformuler. Tapez « aide » pour la liste.',
    };
  }

  const action = verbe.action;

  if (action === 'help') return { ok: true, action: 'help', level: null, tokens: rawTokens, autoFixed };
  if (action === 'clear') return { ok: true, action: 'clear', level: null, tokens: rawTokens, autoFixed };
  if (action === 'quit') return { ok: true, action: 'quit', level: null, tokens: rawTokens, autoFixed };
  if (action === 'restart') return { ok: true, action: 'restart', level: null, tokens: rawTokens, autoFixed };
  if (action === 'analyze') {
    const phrase = line.replace(/^analys(er|e)\s*/i, '');
    const stackResult = parseWithStack(tokenize(phrase));
    return { ok: true, action: 'analyze', level: null, tokens: rawTokens, stackResult, autoFixed };
  }

  if (!objet) {
    const hints = {
      show: 'afficher les statistiques',
      list: 'lister tout',
      add: 'ajouter une question',
      export: 'exporter csv',
      search: 'chercher adolescents de Kinshasa',
      launch: 'lancer enquête cybersécurité',
      delete: 'supprimer une question',
      modify: 'modifier une question',
    };
    const hint = hints[action] || 'afficher les statistiques';
    return {
      ok: false,
      level: 'warning',
      tokens: rawTokens,
      message: `Commande incomplète — vouliez-vous dire « ${hint} » ?`,
      suggestion: hint,
      autoFixed,
    };
  }

  const complement = complements.length
    ? {
        ville: complements.find((c) => ['kinshasa', 'lubumbashi', 'goma', 'bukavu', 'kisangani', 'matadi'].includes(c.complement || c.value))?.complement || complements.find((c) => c.complement)?.complement,
        theme: complements.find((c) => ['cybersecurite', 'ecole', 'python', 'scratch', 'robotique'].includes(c.complement || c.value))?.complement
          || complements.find((c) => ['cybersecurite', 'ecole', 'python', 'scratch', 'robotique'].includes(c.value))?.value,
        filter: complements.find((c) => c.type === 'filtre')?.filter,
        number: complements.find((c) => c.type === 'nombre')?.number,
      }
    : null;

  return {
    ok: true,
    action,
    target: objet.target,
    complement,
    level: null,
    tokens: rawTokens,
    autoFixed,
  };
}

/** FIRST/FOLLOW pour debug */
export function getGrammarInfo() {
  return {
    productions: [
      'PROGRAMME → COMMANDE $',
      'COMMANDE → ACTION SUITE',
      'SUITE → ARTICLE CORPS | CORPS',
      'CORPS → OBJET COMPLEMENT | OBJET | ε',
      'COMPLEMENT → PREP VALEUR COMPLEMENT | ε',
      'VALEUR → VILLE | THEME | NOMBRE | FILTRE',
    ],
    FIRST,
    FOLLOW,
    table: buildLL1Table(),
  };
}
