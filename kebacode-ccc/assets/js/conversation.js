/* ============================================================
   KebaCode CCC — Moteur de conversation modulaire
   Graphe orienté : chaque réponse détermine la suite logique
   ============================================================ */

import { getToneKey } from './data.js';
import { getConvMessage, getConvChoiceLabel } from './conversation-i18n.js';

/** Nœuds de conversation par profil */
const GRAPHS = {
  enfant: buildEnfantGraph(),
  ado: buildAdoGraph(),
  parent: buildParentGraph(),
  visiteur: buildVisiteurGraph(),
};

function buildEnfantGraph() {
  return {
    start: {
      id: 'start',
      illustration: 'mascot',
      message: {
        child: (ctx) => `Coucou ${ctx.userName || 'toi'} ! Moi c'est Keba, ton copain numérique du club CCC.`,
      },
      autoNext: 'devices',
      choices: null,
    },
    devices: {
      id: 'devices',
      illustration: 'devices',
      message: {
        child: () => 'Dis-moi : qu\'est-ce que tu touches le plus souvent à la maison ou à l\'école ?',
      },
      choices: [
        { id: 'tablet', label: { child: 'Une tablette' }, traits: { device: 'tablet', access: 'medium' }, flags: {}, score: { tech: 1 }, next: 'code_try' },
        { id: 'phone', label: { child: 'Le téléphone des grands' }, traits: { device: 'phone', access: 'medium' }, flags: {}, score: { tech: 1 }, next: 'code_try' },
        { id: 'computer', label: { child: 'Un ordinateur' }, traits: { device: 'computer', access: 'high' }, flags: {}, score: { tech: 2 }, next: 'code_try' },
        { id: 'rarely', label: { child: 'Presque jamais' }, traits: { device: 'none', access: 'low' }, flags: { jamais_internet: true }, score: { tech: 0 }, next: 'offline_welcome' },
      ],
    },
    offline_welcome: {
      id: 'offline_welcome',
      illustration: 'mascot',
      message: {
        child: () => 'Pas de souci ! Au club CCC, on a des ordinateurs pour tout le monde. Tu vas pouvoir découvrir.',
      },
      autoNext: 'creation',
      choices: null,
    },
    code_try: {
      id: 'code_try',
      illustration: 'blocks',
      message: {
        child: (ctx) => ctx.access === 'high'
          ? 'Super ! Et le codage, tu as déjà essayé ? C\'est un peu comme assembler des puzzles.'
          : 'Tu as déjà entendu parler du codage ? C\'est donner des instructions à l\'ordinateur.',
      },
      choices: [
        { id: 'yes', label: { child: 'Oui, j\'ai déjà fait !' }, traits: { coding: 'experienced' }, flags: { connait_scratch: true }, score: { code: 2 }, next: 'creation' },
        { id: 'heard', label: { child: 'J\'en ai entendu parler' }, traits: { coding: 'curious' }, flags: {}, score: { code: 1 }, next: 'explain_code' },
        { id: 'no', label: { child: 'Non, c\'est quoi ?' }, traits: { coding: 'beginner' }, flags: {}, score: { code: 0 }, next: 'explain_code' },
      ],
    },
    explain_code: {
      id: 'explain_code',
      illustration: 'blocks',
      message: {
        child: () => 'Imagine : tu dis à un personnage « avance de 10 pas, tourne, saute »… et il obéit ! C\'est ça le code. Amusant, non ?',
      },
      autoNext: 'creation',
      choices: null,
    },
    creation: {
      id: 'creation',
      illustration: 'creation',
      message: {
        child: () => 'Si tu avais un super-pouvoir numérique, tu créerais quoi en premier ?',
      },
      choices: [
        { id: 'game', label: { child: 'Un jeu à moi' }, traits: { interest: 'game' }, flags: {}, score: { create: 2, logic: 1 }, next: 'react_game' },
        { id: 'animation', label: { child: 'Un dessin animé' }, traits: { interest: 'animation' }, flags: {}, score: { create: 2 }, next: 'react_animation' },
        { id: 'robot', label: { child: 'Un robot' }, traits: { interest: 'robot' }, flags: { aime_robots: true }, score: { create: 1, logic: 2 }, next: 'react_robot' },
      ],
    },
    react_game: {
      id: 'react_game',
      illustration: 'game',
      message: {
        child: () => 'Un jeu ! J\'adore. Avec Scratch, tu peux faire bouger des personnages en quelques clics. Ça te dit ?',
      },
      choices: [
        { id: 'yes', label: { child: 'Oui, trop cool !' }, traits: { scratch: 'yes' }, flags: { connait_scratch: true }, score: { scratch: 2 }, next: 'learn_style' },
        { id: 'maybe', label: { child: 'Peut-être' }, traits: { scratch: 'maybe' }, flags: {}, score: { scratch: 1 }, next: 'learn_style' },
      ],
    },
    react_animation: {
      id: 'react_animation',
      illustration: 'animation',
      message: {
        child: () => 'Les dessins animés, c\'est de la magie image par image. Scratch est parfait pour ça aussi !',
      },
      autoNext: 'learn_style',
      choices: null,
    },
    react_robot: {
      id: 'react_robot',
      illustration: 'robot',
      message: {
        child: () => 'Un robot ! On en construit au labo CCC. Tu programmes ses yeux et ses roues. Excitant ?',
      },
      choices: [
        { id: 'yes', label: { child: 'Carrément !' }, traits: { robot: 'yes' }, flags: { aime_robots: true }, score: { robot: 2 }, next: 'learn_style' },
        { id: 'curious', label: { child: 'Je veux voir' }, traits: { robot: 'curious' }, flags: {}, score: { robot: 1 }, next: 'learn_style' },
      ],
    },
    learn_style: {
      id: 'learn_style',
      illustration: 'group',
      message: {
        child: () => 'Pour apprendre, tu préfères être avec d\'autres enfants ou avancer à ton rythme ?',
      },
      choices: [
        { id: 'group', label: { child: 'Avec les copains' }, traits: { style: 'group' }, flags: { aime_aider: true }, score: { social: 2 }, next: 'internet_check' },
        { id: 'solo', label: { child: 'Tout seul' }, traits: { style: 'solo' }, flags: {}, score: { social: 0 }, next: 'internet_check' },
        { id: 'both', label: { child: 'Les deux' }, traits: { style: 'both' }, flags: {}, score: { social: 1 }, next: 'internet_check' },
      ],
    },
    internet_check: {
      id: 'internet_check',
      illustration: 'internet',
      message: {
        child: (ctx) => ctx.access === 'low'
          ? 'Chez toi, est-ce que parfois tu arrives à te connecter à Internet ?'
          : 'Et Internet à la maison, ça marche bien ?',
      },
      choices: [
        { id: 'yes', label: { child: 'Oui' }, traits: { internet: 'yes' }, flags: {}, score: { internet: 2 }, next: 'security_simple' },
        { id: 'sometimes', label: { child: 'Parfois' }, traits: { internet: 'sometimes' }, flags: {}, score: { internet: 1 }, next: 'security_simple' },
        { id: 'no', label: { child: 'Non / je ne sais pas' }, traits: { internet: 'no' }, flags: { jamais_internet: true }, score: { internet: 0 }, next: 'dream' },
      ],
    },
    security_simple: {
      id: 'security_simple',
      illustration: 'security',
      message: {
        child: () => 'Petite question importante : tu sais qu\'il ne faut jamais donner son mot de passe à personne ?',
      },
      choices: [
        { id: 'yes', label: { child: 'Oui, c\'est secret !' }, traits: { security: 'good' }, flags: {}, score: { secu: 2 }, next: 'dream' },
        { id: 'learn', label: { child: 'Apprends-moi' }, traits: { security: 'learn' }, flags: { probleme_motdepasse: true }, score: { secu: 0 }, next: 'dream' },
      ],
    },
    dream: {
      id: 'dream',
      illustration: 'dream',
      message: {
        child: () => 'Dernière chose : en grandissant, tu aimerais faire quoi avec le numérique ?',
      },
      kind: 'open',
      placeholderKey: 'yourAnswer',
      next: 'availability',
    },
    availability: {
      id: 'availability',
      illustration: 'calendar',
      message: {
        child: () => 'Quand est-ce que tu pourrais venir au club CCC ? (mercredi, samedi…)',
      },
      kind: 'open',
      placeholderKey: 'yourAnswer',
      next: null,
      terminal: true,
    },
  };
}

function buildAdoGraph() {
  return {
    start: {
      id: 'start',
      message: {
        teen: (ctx) => `Hey ${ctx.userName || ''} ! On va discuter deux minutes pour trouver un parcours qui te correspond.`,
      },
      autoNext: 'digital_life',
      choices: null,
    },
    digital_life: {
      id: 'digital_life',
      message: {
        teen: () => 'Concrètement, tu passes combien de temps en ligne chaque semaine ?',
      },
      choices: [
        { id: 'lot', label: { teen: 'Beaucoup (+10h)' }, traits: { online: 'high' }, flags: {}, score: { tech: 2 }, next: 'online_activity' },
        { id: 'moderate', label: { teen: 'Un peu (3–10h)' }, traits: { online: 'moderate' }, flags: {}, score: { tech: 1 }, next: 'online_activity' },
        { id: 'little', label: { teen: 'Presque pas' }, traits: { online: 'low' }, flags: { jamais_internet: true }, score: { tech: 0 }, next: 'offline_interest' },
      ],
    },
    offline_interest: {
      id: 'offline_interest',
      message: {
        teen: () => 'Pas grave — au club on a tout le matériel. Qu\'est-ce qui t\'attirerait le plus ?',
      },
      autoNext: 'passion',
      choices: null,
    },
    online_activity: {
      id: 'online_activity',
      message: {
        teen: () => 'Et tu fais surtout quoi en ligne ?',
      },
      choices: [
        { id: 'social', label: { teen: 'Réseaux sociaux & messages' }, traits: { activity: 'social' }, flags: {}, score: { social_net: 2 }, next: 'cyber_check' },
        { id: 'games', label: { teen: 'Jeux & vidéos' }, traits: { activity: 'games' }, flags: {}, score: { create: 1 }, next: 'passion' },
        { id: 'learn', label: { teen: 'Apprendre / créer' }, traits: { activity: 'learn' }, flags: { connait_scratch: true }, score: { code: 2 }, next: 'coding_level' },
        { id: 'mix', label: { teen: 'Un peu de tout' }, traits: { activity: 'mix' }, flags: {}, score: { tech: 1 }, next: 'passion' },
      ],
    },
    cyber_check: {
      id: 'cyber_check',
      message: {
        teen: () => 'Sur les réseaux, tu as déjà vu quelqu\'un se faire embêter en ligne ?',
      },
      choices: [
        { id: 'yes_me', label: { teen: 'Oui, moi' }, traits: { cyber: 'victim' }, flags: { probleme_motdepasse: true }, score: { cyber: 2 }, next: 'passion' },
        { id: 'yes_other', label: { teen: 'Oui, quelqu\'un que je connais' }, traits: { cyber: 'witness' }, flags: {}, score: { cyber: 1 }, next: 'passion' },
        { id: 'no', label: { teen: 'Non' }, traits: { cyber: 'none' }, flags: {}, score: { cyber: 0 }, next: 'passion' },
      ],
    },
    coding_level: {
      id: 'coding_level',
      message: {
        teen: () => 'Tu as déjà codé ? Scratch, Python, autre chose ?',
      },
      choices: [
        { id: 'python', label: { teen: 'Oui, Python ou plus' }, traits: { coding: 'advanced' }, flags: { aime_python: true, connait_scratch: true }, score: { code: 2 }, next: 'passion' },
        { id: 'scratch', label: { teen: 'Scratch surtout' }, traits: { coding: 'scratch' }, flags: { connait_scratch: true }, score: { code: 1 }, next: 'passion' },
        { id: 'beginner', label: { teen: 'Presque jamais' }, traits: { coding: 'beginner' }, flags: {}, score: { code: 0 }, next: 'passion' },
      ],
    },
    passion: {
      id: 'passion',
      message: {
        teen: () => 'Si tu devais choisir un projet perso, ce serait plutôt…',
      },
      choices: [
        { id: 'game', label: { teen: 'Un jeu ou une app' }, traits: { interest: 'game' }, flags: {}, score: { create: 2 }, next: 'tech_interest' },
        { id: 'python', label: { teen: 'De la data / du Python' }, traits: { interest: 'python' }, flags: { aime_python: true }, score: { python: 2 }, next: 'tech_interest' },
        { id: 'robot', label: { teen: 'Robotique / hardware' }, traits: { interest: 'robot' }, flags: { aime_robots: true }, score: { robot: 2 }, next: 'tech_interest' },
        { id: 'web', label: { teen: 'Un site web' }, traits: { interest: 'web' }, flags: {}, score: { create: 2 }, next: 'tech_interest' },
      ],
    },
    tech_interest: {
      id: 'tech_interest',
      message: {
        teen: (ctx) => ctx.interest === 'python' || ctx.coding === 'advanced'
          ? 'Python t\'attire — tu vises plutôt la création ou la résolution de problèmes complexes ?'
          : 'Tu préfères apprendre en créant un truc concret ou en comprenant la théorie d\'abord ?',
      },
      choices: [
        { id: 'build', label: { teen: 'Créer un projet' }, traits: { approach: 'build' }, flags: {}, score: { create: 1 }, next: 'help_others' },
        { id: 'theory', label: { teen: 'Comprendre en profondeur' }, traits: { approach: 'theory' }, flags: { aime_python: true }, score: { logic: 2 }, next: 'help_others' },
        { id: 'both', label: { teen: 'Les deux' }, traits: { approach: 'both' }, flags: {}, score: { logic: 1 }, next: 'help_others' },
      ],
    },
    help_others: {
      id: 'help_others',
      message: {
        teen: () => 'Est-ce que tu aimes aider les autres quand tu as compris quelque chose ?',
      },
      choices: [
        { id: 'yes', label: { teen: 'Oui, j\'adore expliquer' }, traits: { helper: 'yes' }, flags: { aime_aider: true }, score: { social: 2 }, next: 'availability' },
        { id: 'sometimes', label: { teen: 'Parfois' }, traits: { helper: 'sometimes' }, flags: {}, score: { social: 1 }, next: 'availability' },
        { id: 'no', label: { teen: 'Je préfère avancer seul' }, traits: { helper: 'no' }, flags: {}, score: { social: 0 }, next: 'availability' },
      ],
    },
    availability: {
      id: 'availability',
      message: {
        teen: () => 'Pour finir : quels jours tu serais dispo pour le club ?',
      },
      kind: 'open',
      placeholderKey: 'yourAnswer',
      next: null,
      terminal: true,
    },
  };
}

function buildParentGraph() {
  return {
    start: {
      id: 'start',
      message: {
        adult: (ctx) => `Bonjour ${ctx.userName || ''}. Je suis Keba, l'assistant du club CCC. Quelques questions pour vous orienter.`,
      },
      autoNext: 'reason',
      choices: null,
    },
    reason: {
      id: 'reason',
      message: {
        adult: () => 'Qu\'est-ce qui vous amène aujourd\'hui ?',
      },
      choices: [
        { id: 'child', label: { adult: 'Inscrire / accompagner mon enfant' }, traits: { reason: 'child' }, flags: {}, score: {}, next: 'child_age' },
        { id: 'learn', label: { adult: 'Comprendre le numérique moi-même' }, traits: { reason: 'self' }, flags: {}, score: {}, next: 'self_goal' },
        { id: 'visit', label: { adult: 'Découvrir le club' }, traits: { reason: 'visit' }, flags: {}, score: {}, next: 'visit_goal' },
      ],
    },
    child_age: {
      id: 'child_age',
      message: {
        adult: () => 'Quel âge a votre enfant ?',
      },
      choices: [
        { id: 'young', label: { adult: '6–9 ans' }, traits: { child_age: 'young' }, flags: {}, score: {}, next: 'child_interest' },
        { id: 'preteen', label: { adult: '10–12 ans' }, traits: { child_age: 'preteen' }, flags: {}, score: {}, next: 'child_interest' },
        { id: 'teen', label: { adult: '13–17 ans' }, traits: { child_age: 'teen' }, flags: {}, score: {}, next: 'child_interest' },
      ],
    },
    child_interest: {
      id: 'child_interest',
      message: {
        adult: () => 'Votre enfant montre-t-il déjà de l\'intérêt pour le numérique ou les jeux créatifs ?',
      },
      choices: [
        { id: 'yes', label: { adult: 'Oui, beaucoup' }, traits: { child_interest: 'high' }, flags: { connait_scratch: true }, score: { tech: 2 }, next: 'family_cyber' },
        { id: 'some', label: { adult: 'Un peu' }, traits: { child_interest: 'some' }, flags: {}, score: { tech: 1 }, next: 'family_cyber' },
        { id: 'no', label: { adult: 'Pas encore' }, traits: { child_interest: 'low' }, flags: {}, score: { tech: 0 }, next: 'family_cyber' },
      ],
    },
    family_cyber: {
      id: 'family_cyber',
      message: {
        adult: () => 'La sécurité en ligne de votre famille vous préoccupe-t-elle ?',
      },
      choices: [
        { id: 'yes', label: { adult: 'Oui, c\'est une priorité' }, traits: { cyber_concern: 'high' }, flags: { probleme_motdepasse: true }, score: { secu: 2 }, next: 'parent_availability' },
        { id: 'some', label: { adult: 'Un peu' }, traits: { cyber_concern: 'some' }, flags: {}, score: { secu: 1 }, next: 'parent_availability' },
        { id: 'no', label: { adult: 'Pas spécialement' }, traits: { cyber_concern: 'low' }, flags: {}, score: { secu: 0 }, next: 'parent_availability' },
      ],
    },
    self_goal: {
      id: 'self_goal',
      message: {
        adult: () => 'Qu\'aimeriez-vous apprendre en priorité ?',
      },
      choices: [
        { id: 'support', label: { adult: 'Aider mon enfant avec le numérique' }, traits: { goal: 'support' }, flags: {}, score: {}, next: 'family_cyber' },
        { id: 'basics', label: { adult: 'Les bases du codage' }, traits: { goal: 'basics' }, flags: {}, score: { code: 1 }, next: 'parent_availability' },
        { id: 'cyber', label: { adult: 'Cybersécurité & vie privée' }, traits: { goal: 'cyber' }, flags: { probleme_motdepasse: true }, score: { secu: 2 }, next: 'parent_availability' },
      ],
    },
    visit_goal: {
      id: 'visit_goal',
      message: {
        adult: () => 'Souhaitez-vous une visite guidée ou directement tester une activité ?',
      },
      choices: [
        { id: 'tour', label: { adult: 'Visite guidée' }, traits: { visit: 'tour' }, flags: {}, score: {}, next: 'parent_availability' },
        { id: 'trial', label: { adult: 'Séance d\'essai' }, traits: { visit: 'trial' }, flags: {}, score: {}, next: 'parent_availability' },
      ],
    },
    parent_availability: {
      id: 'parent_availability',
      message: {
        adult: () => 'Quelles disponibilités avez-vous pour les sessions familles ou ateliers parents ?',
      },
      kind: 'open',
      placeholderKey: 'yourAnswer',
      next: null,
      terminal: true,
    },
  };
}

function buildVisiteurGraph() {
  return {
    start: {
      id: 'start',
      message: {
        adult: (ctx) => `Bienvenue ${ctx.userName || ''} ! Je suis Keba. On va voir ensemble ce que le CCC peut vous offrir.`,
      },
      autoNext: 'discovery',
      choices: null,
    },
    discovery: {
      id: 'discovery',
      message: {
        adult: () => 'Qu\'est-ce qui vous intrigue le plus dans le monde du code ?',
      },
      choices: [
        { id: 'see', label: { adult: 'Voir une démo en direct' }, traits: { interest: 'demo' }, flags: {}, score: {}, next: 'background' },
        { id: 'kids', label: { adult: 'Les programmes pour jeunes' }, traits: { interest: 'kids' }, flags: {}, score: {}, next: 'background' },
        { id: 'tech', label: { adult: 'La tech & l\'innovation locale' }, traits: { interest: 'tech' }, flags: {}, score: { code: 1 }, next: 'background' },
      ],
    },
    background: {
      id: 'background',
      message: {
        adult: () => 'Avez-vous déjà une expérience avec la programmation ?',
      },
      choices: [
        { id: 'yes', label: { adult: 'Oui, un peu' }, traits: { coding: 'some' }, flags: { connait_scratch: true }, score: { code: 1 }, next: 'visitor_note' },
        { id: 'no', label: { adult: 'Non, curiosité pure' }, traits: { coding: 'none' }, flags: {}, score: {}, next: 'visitor_note' },
      ],
    },
    visitor_note: {
      id: 'visitor_note',
      message: {
        adult: () => 'Y a-t-il autre chose que vous aimeriez découvrir pendant votre visite ?',
      },
      kind: 'open',
      placeholderKey: 'yourAnswer',
      next: null,
      terminal: true,
    },
  };
}

/** Initialise une session de conversation */
export function initConversation(profileId, userName = '', lang = 'fr') {
  const graph = GRAPHS[profileId] || GRAPHS.visiteur;
  return {
    profileId,
    lang,
    graph,
    currentNodeId: 'start',
    traits: { userName },
    history: [],
    answers: [],
    pendingOpen: false,
  };
}

/** Résout le texte d'un nœud selon le contexte et la langue */
export function resolveMessage(node, conv, tone) {
  const lang = conv.lang || 'fr';
  const i18n = getConvMessage(conv.profileId, node.id, tone, lang, conv.traits);
  if (i18n != null) return i18n;

  const fn = node.message?.[tone] || node.message?.adult || node.message?.teen || node.message?.child;
  if (typeof fn === 'function') return fn(conv.traits);
  if (typeof fn === 'string') return fn;
  return '';
}

/** Résout le libellé d'un choix selon la langue */
export function resolveChoiceLabel(choice, node, conv, tone) {
  const lang = conv.lang || 'fr';
  const i18n = getConvChoiceLabel(conv.profileId, node.id, choice.id, tone, lang);
  if (i18n != null) return i18n;

  return choice.label[tone] || choice.label.adult || choice.label.teen || choice.label.child || choice.id;
}

/** Retourne le nœud courant */
export function getCurrentNode(conv) {
  return conv.graph[conv.currentNodeId] || null;
}

/** Avance automatiquement (nœuds sans choix) */
export function processAutoNodes(conv, tone) {
  const messages = [];
  let node = getCurrentNode(conv);
  while (node && (node.autoNext || (node.choices === null && !node.kind))) {
    const text = resolveMessage(node, conv, tone);
    if (text) {
      messages.push({ role: 'bot', nodeId: node.id, text, illustration: node.illustration || null });
      conv.history.push({ role: 'bot', nodeId: node.id, text });
    }
    if (node.autoNext) {
      conv.currentNodeId = node.autoNext;
      node = getCurrentNode(conv);
    } else break;
  }
  return messages;
}

/** Premier rendu : messages d'accueil + question active */
export function bootstrapConversation(conv, tone) {
  conv.history = [];
  const autoMsgs = processAutoNodes(conv, tone);
  const node = getCurrentNode(conv);
  if (node && !node.autoNext) {
    const text = resolveMessage(node, conv, tone);
    if (text && !autoMsgs.some((m) => m.nodeId === node.id && m.text === text)) {
      autoMsgs.push({ role: 'bot', nodeId: node.id, text, illustration: node.illustration || null });
      conv.history.push({ role: 'bot', nodeId: node.id, text });
    }
  }
  return autoMsgs;
}

/** Applique un choix utilisateur et retourne les nouveaux messages bot */
export function applyChoice(conv, choiceId, tone, openText = '') {
  const node = getCurrentNode(conv);
  if (!node) return { messages: [], done: true };

  let choice = null;
  let nextId = node.next;
  let answerEntry = { nodeId: node.id, questionId: node.id };

  if (node.kind === 'open') {
    answerEntry.label = openText;
    answerEntry.value = openText;
    conv.history.push({ role: 'user', nodeId: node.id, text: openText });
    conv.answers.push(answerEntry);
    if (node.terminal || !node.next) {
      conv.currentNodeId = null;
      return { messages: [], done: true };
    }
    conv.currentNodeId = node.next;
  } else if (node.choices) {
    choice = node.choices.find((c) => c.id === choiceId);
    if (!choice) return { messages: [], done: false };
    const label = resolveChoiceLabel(choice, node, conv, tone);
    Object.assign(conv.traits, choice.traits || {});
    answerEntry = {
      nodeId: node.id,
      questionId: node.id,
      choiceId: choice.id,
      label,
      value: label,
      score: choice.score || {},
      flags: choice.flags || {},
    };
    conv.history.push({ role: 'user', nodeId: node.id, text: label });
    conv.answers.push(answerEntry);
    nextId = choice.next;
    conv.currentNodeId = nextId;
  } else {
    return { messages: [], done: true };
  }

  if (!nextId && node.terminal) {
    conv.currentNodeId = null;
    return { messages: [], done: true };
  }

  const messages = processAutoNodes(conv, tone);
  const nextNode = getCurrentNode(conv);

  if (!nextNode) {
    return { messages, done: true };
  }

  if (nextNode.kind === 'open' || nextNode.choices) {
    const text = resolveMessage(nextNode, conv, tone);
    if (text) {
      messages.push({ role: 'bot', nodeId: nextNode.id, text, illustration: nextNode.illustration || null });
      conv.history.push({ role: 'bot', nodeId: nextNode.id, text });
    }
  }

  const done = nextNode.terminal && nextNode.kind === 'open'
    ? false
    : nextNode.terminal && !nextNode.kind;

  return { messages, done: done || false, awaitingOpen: nextNode.kind === 'open' };
}

/** Estimation progression (pour indicateur discret) */
export function estimateProgress(conv) {
  const graph = conv.graph;
  const total = Object.keys(graph).length;
  const visited = new Set(conv.history.map((h) => h.nodeId)).size;
  return Math.min(Math.round((visited / total) * 100), 95);
}

/** Liste des modules pour le mode formateur */
export function listConversationModules(profileId) {
  const graph = GRAPHS[profileId] || GRAPHS.enfant;
  return Object.values(graph).map((n, i) => ({
    id: n.id,
    ordre: i + 1,
    terminal: !!n.terminal,
    hasChoices: !!(n.choices?.length),
  }));
}

export function restoreConversation(saved, lang = 'fr') {
  if (!saved?.profileId) return null;
  const conv = initConversation(saved.profileId, saved.traits?.userName || '', saved.lang || lang);
  conv.currentNodeId = saved.currentNodeId;
  conv.traits = { ...conv.traits, ...saved.traits };
  conv.history = saved.history || [];
  conv.answers = saved.answers || [];
  return conv;
}

export function getAllGraphs() {
  return GRAPHS;
}

export { getToneKey };
