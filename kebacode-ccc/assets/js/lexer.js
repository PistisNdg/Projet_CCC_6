/* ============================================================
   KebaCode CCC — Analyseur lexical mini-français
   ============================================================ */

import { LEVENSHTEIN_MAX } from './config.js';

export const LEX = {
  verbe: {
    montre: 'show', montrer: 'show', affiche: 'show', afficher: 'show', voir: 'show',
    ajoute: 'add', ajouter: 'add', cree: 'add', créer: 'add', crée: 'add',
    liste: 'list', lister: 'list', list: 'list',
    efface: 'clear', effacer: 'clear', vide: 'clear',
    aide: 'help', aider: 'help',
    exporte: 'export', exporter: 'export',
    lance: 'launch', lancer: 'launch',
    cherche: 'search', chercher: 'search',
    supprime: 'delete', supprimer: 'delete',
    modifie: 'modify', modifier: 'modify',
    recommence: 'restart', recommencer: 'restart',
    quitte: 'quit', quitter: 'quit',
    analyse: 'analyze', analyser: 'analyze',
  },
  article: ['le', 'la', 'les', 'l', 'un', 'une', 'des', 'du', 'de'],
  objet: {
    stats: 'stats', statistiques: 'stats', statistique: 'stats', tableau: 'stats',
    question: 'question', questions: 'question',
    tout: 'all', toutes: 'all', tous: 'all',
    participants: 'participants', ville: 'cities', villes: 'cities',
    profils: 'profiles', profil: 'profiles',
    csv: 'csv', pdf: 'pdf',
    session: 'sessions', sessions: 'sessions',
    erreurs: 'errors', erreur: 'errors',
    enquete: 'enquete', enquête: 'enquete',
    campagne: 'campagne',
    rapport: 'rapport',
    commandes: 'commandes',
    adolescents: 'adolescents', enfants: 'enfants',
  },
  complement: {
    kinshasa: 'kinshasa', lubumbashi: 'lubumbashi', goma: 'goma',
    bukavu: 'bukavu', kisangani: 'kisangani', matadi: 'matadi',
    cybersecurite: 'cybersecurite', cybersécurité: 'cybersecurite',
    ecole: 'ecole', école: 'ecole',
    python: 'python', scratch: 'scratch', robotique: 'robotique',
    de: 'prep', par: 'prep', pour: 'prep', à: 'prep', a: 'prep',
    interesses: 'filter', intéressés: 'filter',
  },
};

/** Distance de Levenshtein */
export function lev(a, b) {
  const m = a.length;
  const n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
  }
  return d[m][n];
}

/** Classifie un mot brut */
export function classify(raw) {
  const w = raw.toLowerCase().replace(/[.,;:!?'']/g, '');

  if (/^\d+$/.test(w)) {
    return { type: 'nombre', value: w, number: parseInt(w, 10) };
  }

  if (LEX.verbe[w]) {
    return { type: 'verbe', value: w, action: LEX.verbe[w], canonical: w };
  }
  if (LEX.article.includes(w)) {
    return { type: 'article', value: w };
  }
  if (LEX.objet[w]) {
    return { type: 'objet', value: w, target: LEX.objet[w] };
  }
  if (LEX.complement[w]) {
    const val = LEX.complement[w];
    if (val === 'prep') return { type: 'prep', value: w };
    if (val === 'filter') return { type: 'filtre', value: w, filter: w };
    return { type: 'complement', value: w, complement: val };
  }

  // Correction auto via Levenshtein
  let best = null;
  const pool = [
    ...Object.keys(LEX.verbe).map((k) => ({ k, type: 'verbe', action: LEX.verbe[k] })),
    ...Object.keys(LEX.objet).map((k) => ({ k, type: 'objet', target: LEX.objet[k] })),
    ...Object.keys(LEX.complement).map((k) => ({ k, type: 'complement', complement: LEX.complement[k] })),
  ];

  for (const c of pool) {
    const dist = lev(w, c.k);
    if (dist <= LEVENSHTEIN_MAX && (!best || dist < best.dist)) {
      best = { ...c, dist };
    }
  }

  if (best) {
    const confidence = Math.round((1 - best.dist / (LEVENSHTEIN_MAX + 1)) * 100);
    return {
      type: 'inconnu',
      value: w,
      suggest: best.k,
      suggestType: best.type,
      confidence,
      corrected: best.k,
    };
  }

  return { type: 'inconnu', value: w, confidence: 0 };
}

/** Tokenise une phrase complète */
export function tokenize(line) {
  return line.trim().split(/\s+/).filter(Boolean).map(classify);
}

/** Applique les corrections automatiques (confiance > 80%) */
export function autoCorrectTokens(tokens) {
  return tokens.map((tk) => {
    if (tk.type === 'inconnu' && tk.suggest && tk.confidence > 80) {
      const corrected = classify(tk.suggest);
      return { ...corrected, value: tk.suggest, autoCorrected: true, original: tk.value };
    }
    return tk;
  });
}
