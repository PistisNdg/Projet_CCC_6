/* ============================================================
   KebaCode CCC — Parcours recommandés i18n
   ============================================================ */

import { RECOS } from './data.js';

const RECOS_I18N = {
  enfant: {
    en: {
      track: 'Scratch Junior → Blockly Games',
      tag: 'Curious child · learning through play',
      steps: ['Scratch Junior workshop (6 sessions)', 'Group Blockly challenges', 'Mini-project: your first game'],
      club: 'CCC Kids Club — Wednesday afternoons',
    },
    ln: {
      track: 'Scratch Junior → Blockly Games',
      tag: 'Mwana ya bolingo · koyekola na masano',
      steps: ['Atelier Scratch Junior (maséances 6)', 'Ba défis Blockly na ekipi', 'Mini-projet : jeu na yo ya liboso'],
      club: 'Club CCC Kids — midi ya mposo',
    },
    sw: {
      track: 'Scratch Junior → Blockly Games',
      tag: 'Mtoto mwenye udadisi · kujifunza kwa michezo',
      steps: ['Warsha ya Scratch Junior (vipindi 6)', 'Changamoto za Blockly kwa kikundi', 'Mradi mdogo: mchezo wako wa kwanza'],
      club: 'Klabu ya CCC Kids — Jumatano alasiri',
    },
  },
  ado: {
    en: {
      track: 'Advanced Scratch → Python basics',
      tag: 'Motivated teen · logic & creation',
      steps: ['Advanced Scratch game project', 'Python intro (algorithms)', 'CCC junior hackathon'],
      club: 'CCC Teens Club — Saturday mornings',
    },
    ln: {
      track: 'Scratch ya minene → Python ya ebandeli',
      tag: 'Elenge ya motivation · logique & création',
      steps: ['Projet ya jeu na Scratch ya minene', 'Ebandeli Python (algorithmes)', 'Hackathon junior CCC'],
      club: 'Club CCC Teens — samedi na ntongo',
    },
    sw: {
      track: 'Scratch ya juu → Python ya msingi',
      tag: 'Kijana mwenye hamu · mantiki & ubunifu',
      steps: ['Mradi wa mchezo wa Scratch ya juu', 'Utangulizi wa Python (algoriti)', 'Hackathon ya vijana CCC'],
      club: 'Klabu ya CCC Teens — Jumamosi asubuhi',
    },
  },
  parent: {
    en: {
      track: 'CCC Discovery → Parents workshop',
      tag: 'Guardian · understanding digital literacy',
      steps: ['Guided tour of CCC paths', 'Workshop « code with your child »', 'Family cybersecurity awareness'],
      club: 'Family sessions — one Saturday per month',
    },
    ln: {
      track: 'Découverte CCC → Atelier ya baboti',
      tag: 'Moboti · koyeba numérique',
      steps: ['Visite guidée ya ba parcours CCC', 'Atelier « coder na mwana na yo »', 'Sensibilisation cybersécurité ya libota'],
      club: 'Maséances ya libota — samedi moko na sanza',
    },
    sw: {
      track: 'Ugunduzi wa CCC → Warsha ya wazazi',
      tag: 'Mzazi · kuelewa kidijitali',
      steps: ['Ziara ya njia za CCC', 'Warsha « panga programu na mtoto wako »', 'Uhamasishaji wa usalama mtandaoni kwa familia'],
      club: 'Vipindi vya familia — Jumamosi moja kwa mwezi',
    },
  },
  visiteur: {
    en: {
      track: 'CCC Discovery Path',
      tag: 'Visitor · first steps',
      steps: ['Interactive language demo', 'Meet a CCC trainer', 'Sign up for a trial session'],
      club: 'CCC open days — every Friday',
    },
    ln: {
      track: 'Parcours Découverte CCC',
      tag: 'Mopaya · liboso ya koyeba',
      steps: ['Démo interactive ya ba langages', 'Kutana na molakisi CCC', 'Kokoma na séance ya esai'],
      club: 'Ba portes ouvertes CCC — vendredi nyonso',
    },
    sw: {
      track: 'Njia ya Ugunduzi wa CCC',
      tag: 'Mgeni · hatua za kwanza',
      steps: ['Onyesho la lugha za programu', 'Kutana na mkufunzi wa CCC', 'Usajili wa kipindi cha majaribio'],
      club: 'Siku za wazi za CCC — kila Ijumaa',
    },
  },
  mentor: {
    en: {
      track: 'CCC Junior Mentor',
      tag: 'Leader · helping others learn',
      steps: ['Junior mentor training (4 sessions)', 'Peer mentoring for beginners', 'CCC Mentor certification'],
      club: 'Mentor Programme — Friday evenings',
    },
    ln: {
      track: 'Mentor Junior CCC',
      tag: 'Leader · kosalisa bato mosusu',
      steps: ['Formation mentor junior (maséances 4)', 'Kosalisa baningani ya ebandeli', 'Certification CCC Mentor'],
      club: 'Programme Mentor — midi ya vendredi',
    },
    sw: {
      track: 'Mentor wa Vijana CCC',
      tag: 'Kiongozi · kuwasaidia wengine kujifunza',
      steps: ['Mafunzo ya mentor wa vijana (vipindi 4)', 'Kuongoza wenzako wanaoanza', 'Cheti cha Mentor wa CCC'],
      club: 'Programu ya Mentor — Ijumaa jioni',
    },
  },
  cybersec: {
    en: {
      track: 'Youth Cybersecurity',
      tag: 'Digital protection · online safety',
      steps: ['Passwords & privacy workshop', 'Phishing simulation', 'Personal security project'],
      club: 'CCC Cyber Club — Tuesday afternoons',
    },
    ln: {
      track: 'Cybersécurité ya bato ya moke',
      tag: 'Bobateli numérique · sécurité na Internet',
      steps: ['Atelier ba mots de passe & vie privée', 'Simulation ya phishing', 'Projet ya sécurité personnelle'],
      club: 'Club Cyber CCC — mardi na midi',
    },
    sw: {
      track: 'Usalama wa Mtandaoni kwa Vijana',
      tag: 'Ulinzi wa kidijitali · usalama mtandaoni',
      steps: ['Warsha ya manenosiri & faragha', 'Uigaji wa phishing', 'Mradi wa usalama wa kibinafsi'],
      club: 'Klabu ya Cyber CCC — Jumanne alasiri',
    },
  },
  robotique: {
    en: {
      track: 'Robotics Introduction',
      tag: 'Maker · build & program',
      steps: ['Educational robot assembly', 'Sensor programming', 'CCC robotics challenge'],
      club: 'Robotics Lab — Saturday afternoons',
    },
    ln: {
      track: 'Robotique ya ebandeli',
      tag: 'Maker · kotonga & kokoma programme',
      steps: ['Montage ya robot éducatif', 'Programmation ya ba capteurs', 'Défi robotique CCC'],
      club: 'Lab Robotique — samedi na midi',
    },
    sw: {
      track: 'Utangulizi wa Robotiki',
      tag: 'Mtengenezaji · kujenga & kuandika programu',
      steps: ['Kuunganisha roboti ya kielimu', 'Kuandika programu ya vihisi', 'Changamoto ya robotiki CCC'],
      club: 'Maabara ya Robotiki — Jumamosi alasiri',
    },
  },
  python_avance: {
    en: {
      track: 'Advanced Python',
      tag: 'Developer · algorithms & projects',
      steps: ['Python data structures', 'Flask web project', 'Junior open source contribution'],
      club: 'Python Pro Club — Thursday evenings',
    },
    ln: {
      track: 'Python ya minene',
      tag: 'Développeur · algorithmes & ba projets',
      steps: ['Ba structures de données Python', 'Projet web Flask', 'Contribution open source junior'],
      club: 'Club Python Pro — jeudi na midi',
    },
    sw: {
      track: 'Python ya Juu',
      tag: 'Msanidi programu · algoriti & miradi',
      steps: ['Miundo ya data ya Python', 'Mradi wa wavuti wa Flask', 'Mchango wa chanzo huria kwa vijana'],
      club: 'Klabu ya Python Pro — Alhamisi jioni',
    },
  },
};

const PARCOURS_LABELS = {
  enfant: { fr: 'Enfant', en: 'Child', ln: 'Mwana', sw: 'Mtoto' },
  ado: { fr: 'Adolescent', en: 'Teen', ln: 'Elenge', sw: 'Kijana' },
  parent: { fr: 'Parent', en: 'Parent', ln: 'Moboti', sw: 'Mzazi' },
  visiteur: { fr: 'Visiteur', en: 'Visitor', ln: 'Mopaya', sw: 'Mgeni' },
  mentor: { fr: 'Mentor', en: 'Mentor', ln: 'Mentor', sw: 'Mentor' },
  cybersec: { fr: 'Cybersécurité', en: 'Cybersecurity', ln: 'Cybersécurité', sw: 'Usalama mtandaoni' },
  robotique: { fr: 'Robotique', en: 'Robotics', ln: 'Robotique', sw: 'Robotiki' },
  python_avance: { fr: 'Python avancé', en: 'Advanced Python', ln: 'Python ya minene', sw: 'Python ya juu' },
};

/** Retourne un parcours localisé (track, tag, steps, club) */
export function getReco(key, lang = 'fr') {
  const base = RECOS[key];
  if (!base) return null;

  if (lang === 'fr') {
    return { ...base };
  }

  const tr = RECOS_I18N[key]?.[lang];
  if (!tr) {
    return { ...base };
  }

  return {
    key: base.key,
    track: tr.track ?? base.track,
    tag: tr.tag ?? base.tag,
    steps: tr.steps ?? base.steps,
    club: tr.club ?? base.club,
  };
}

/** Libellé court d'un parcours pour les scores */
export function getParcoursLabel(key, lang = 'fr') {
  return PARCOURS_LABELS[key]?.[lang] || PARCOURS_LABELS[key]?.fr || key;
}
