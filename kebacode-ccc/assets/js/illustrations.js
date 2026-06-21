/* ============================================================
   KebaCode CCC — Illustrations SVG (profil enfant)
   Chaque scène accompagne visuellement la question posée
   ============================================================ */

const SCENES = {
  /** Keba le guide — accueil */
  mascot: `<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="100" cy="55" r="38" fill="#E87722"/>
    <circle cx="88" cy="50" r="5" fill="#1a1a1a"/><circle cx="112" cy="50" r="5" fill="#1a1a1a"/>
    <path d="M88 68 Q100 78 112 68" stroke="#1a1a1a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <polygon points="100,20 88,42 112,42" fill="#00AECB"/>
    <rect x="72" y="93" width="56" height="50" rx="14" fill="#00AECB"/>
    <text x="100" y="125" text-anchor="middle" font-size="22" font-weight="700" fill="#fff">K</text>
  </svg>`,

  /** Appareils numériques */
  devices: `<svg viewBox="0 0 240 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="20" y="25" width="70" height="90" rx="8" fill="#E5F7FB" stroke="#00AECB" stroke-width="3"/>
    <rect x="30" y="35" width="50" height="65" rx="4" fill="#fff"/>
    <circle cx="55" cy="108" r="4" fill="#00AECB"/>
    <rect x="100" y="40" width="55" height="75" rx="6" fill="#FFF4E8" stroke="#E87722" stroke-width="3"/>
    <rect x="108" y="48" width="39" height="55" rx="3" fill="#fff"/>
    <rect x="170" y="20" width="55" height="38" rx="4" fill="#F5F4F2" stroke="#908d86" stroke-width="2"/>
    <rect x="175" y="26" width="45" height="24" rx="2" fill="#fff"/>
    <line x1="180" y1="65" x2="215" y2="65" stroke="#908d86" stroke-width="2"/>
    <rect x="168" y="68" width="12" height="4" rx="1" fill="#908d86"/>
  </svg>`,

  /** Blocs de code / Scratch */
  blocks: `<svg viewBox="0 0 220 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M25 30 h60 a8 8 0 0 1 8 8 v20 h-76 v-20 a8 8 0 0 1 8-8" fill="#E87722"/>
    <path d="M25 58 h76 v18 H25 z" fill="#F5B97A"/>
    <path d="M25 76 h50 a8 8 0 0 0 8-8 V58" fill="#E87722" opacity=".7"/>
    <path d="M120 35 h55 a8 8 0 0 1 8 8 v15 h-71 v-15 a8 8 0 0 1 8-8" fill="#00AECB"/>
    <path d="M120 58 h71 v20 H120 z" fill="#4FD8F0"/>
    <circle cx="170" cy="95" r="22" fill="#E87722"/>
    <polygon points="162,88 162,102 178,95" fill="#fff"/>
  </svg>`,

  /** Création — choix de projet */
  creation: `<svg viewBox="0 0 260 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="15" y="30" width="70" height="70" rx="10" fill="#FFF4E8" stroke="#E87722" stroke-width="2"/>
    <rect x="28" y="48" width="18" height="18" fill="#E87722"/><rect x="52" y="48" width="18" height="18" fill="#F5B97A"/>
    <rect x="28" y="72" width="18" height="18" fill="#F5B97A"/><rect x="52" y="72" width="18" height="18" fill="#E87722"/>
    <circle cx="130" cy="65" r="35" fill="#E5F7FB" stroke="#00AECB" stroke-width="2"/>
    <circle cx="120" cy="58" r="4" fill="#1a1a1a"/><circle cx="140" cy="58" r="4" fill="#1a1a1a"/>
    <path d="M118 72 Q130 80 142 72" stroke="#1a1a1a" stroke-width="2" fill="none"/>
    <rect x="185" y="45" width="55" height="45" rx="6" fill="#F5F4F2" stroke="#908d86" stroke-width="2"/>
    <circle cx="200" cy="62" r="6" fill="#00AECB"/><circle cx="225" cy="62" r="6" fill="#00AECB"/>
    <rect x="195" y="78" width="35" height="4" rx="2" fill="#908d86"/>
  </svg>`,

  /** Jeu vidéo */
  game: `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="40" y="25" width="120" height="80" rx="16" fill="#1a1a1a"/>
    <rect x="52" y="38" width="96" height="54" rx="6" fill="#00AECB"/>
    <polygon points="78,58 78,78 98,68" fill="#fff"/>
    <circle cx="130" cy="95" r="12" fill="#E87722"/><circle cx="70" cy="95" r="12" fill="#E87722"/>
    <rect x="85" y="105" width="30" height="8" rx="4" fill="#F5B97A"/>
  </svg>`,

  /** Robot */
  robot: `<svg viewBox="0 0 180 150" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="55" y="20" width="70" height="55" rx="12" fill="#E5F7FB" stroke="#00AECB" stroke-width="3"/>
    <circle cx="75" cy="45" r="7" fill="#00AECB"/><circle cx="105" cy="45" r="7" fill="#00AECB"/>
    <rect x="82" y="58" width="16" height="4" rx="2" fill="#00AECB"/>
    <rect x="70" y="75" width="40" height="45" rx="8" fill="#F5F4F2" stroke="#908d86" stroke-width="2"/>
    <rect x="35" y="82" width="22" height="35" rx="6" fill="#E87722"/>
    <rect x="123" y="82" width="22" height="35" rx="6" fill="#E87722"/>
    <rect x="78" y="120" width="14" height="22" rx="4" fill="#908d86"/>
    <rect x="98" y="120" width="14" height="22" rx="4" fill="#908d86"/>
  </svg>`,

  /** Apprentissage en groupe */
  group: `<svg viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="70" cy="45" r="22" fill="#E87722"/><circle cx="120" cy="38" r="26" fill="#00AECB"/>
    <circle cx="170" cy="45" r="22" fill="#F5B97A"/>
    <rect x="52" y="72" width="36" height="40" rx="10" fill="#E87722" opacity=".8"/>
    <rect x="102" y="68" width="36" height="44" rx="10" fill="#00AECB" opacity=".8"/>
    <rect x="152" y="72" width="36" height="40" rx="10" fill="#F5B97A" opacity=".8"/>
    <rect x="85" y="100" width="70" height="18" rx="6" fill="#F5F4F2" stroke="#908d86" stroke-width="1"/>
  </svg>`,

  /** Internet / connexion */
  internet: `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="100" cy="95" r="8" fill="#00AECB"/>
    <path d="M60 80 Q100 40 140 80" stroke="#00AECB" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M75 90 Q100 65 125 90" stroke="#4FD8F0" stroke-width="4" fill="none" stroke-linecap="round"/>
    <circle cx="45" cy="35" r="14" fill="#FFF4E8" stroke="#E87722" stroke-width="2"/>
    <circle cx="155" cy="30" r="12" fill="#E5F7FB" stroke="#00AECB" stroke-width="2"/>
  </svg>`,

  /** Sécurité / cadenas */
  security: `<svg viewBox="0 0 160 150" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="45" y="65" width="70" height="55" rx="10" fill="#E87722"/>
    <path d="M55 65 V50 a25 25 0 0 1 50 0 v15" stroke="#E87722" stroke-width="8" fill="none" stroke-linecap="round"/>
    <circle cx="80" cy="92" r="10" fill="#FFF4E8"/>
    <rect x="76" y="92" width="8" height="16" rx="2" fill="#FFF4E8"/>
  </svg>`,

  /** Calendrier / disponibilité */
  calendar: `<svg viewBox="0 0 180 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="30" y="25" width="120" height="100" rx="10" fill="#fff" stroke="#E87722" stroke-width="3"/>
    <rect x="30" y="25" width="120" height="28" rx="10" fill="#E87722"/>
    <rect x="50" y="15" width="8" height="20" rx="3" fill="#908d86"/>
    <rect x="122" y="15" width="8" height="20" rx="3" fill="#908d86"/>
    <circle cx="60" cy="75" r="8" fill="#E5F7FB" stroke="#00AECB" stroke-width="2"/>
    <circle cx="90" cy="75" r="8" fill="#E87722"/>
    <circle cx="120" cy="75" r="8" fill="#E5F7FB" stroke="#00AECB" stroke-width="2"/>
    <circle cx="75" cy="105" r="8" fill="#E5F7FB" stroke="#00AECB" stroke-width="2"/>
    <circle cx="105" cy="105" r="8" fill="#E5F7FB" stroke="#00AECB" stroke-width="2"/>
  </svg>`,

  /** Étoile / motivation */
  dream: `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <polygon points="100,15 118,65 172,65 128,95 145,145 100,115 55,145 72,95 28,65 82,65" fill="#E87722"/>
    <polygon points="100,40 110,70 142,70 116,88 126,118 100,100 74,118 84,88 58,70 90,70" fill="#F5B97A"/>
  </svg>`,

  /** Animation / film */
  animation: `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="30" y="30" width="140" height="80" rx="8" fill="#1a1a1a"/>
    <circle cx="65" cy="70" r="18" fill="#E87722"/>
    <rect x="95" y="55" width="55" height="30" rx="4" fill="#00AECB"/>
    <polygon points="155,45 155,95 185,70" fill="#4FD8F0"/>
  </svg>`,
};

export function renderIllustration(sceneId) {
  const svg = SCENES[sceneId];
  if (!svg) return '';
  return `<div class="chat-illustration" role="img" aria-label="${sceneId}">${svg}</div>`;
}

/** Panneau gauche animé — page d'accueil (thème estudiantin) */
export function renderAccueilHeroShowcase() {
  const stickers = [
    { emoji: '📚', cls: 'accueil-sticker--1', label: 'Livre' },
    { emoji: '💻', cls: 'accueil-sticker--2', label: 'Code' },
    { emoji: '🎓', cls: 'accueil-sticker--3', label: 'Diplôme' },
    { emoji: '✨', cls: 'accueil-sticker--4', label: 'Étoile' },
    { emoji: '🚀', cls: 'accueil-sticker--5', label: 'Fusée' },
    { emoji: '🎮', cls: 'accueil-sticker--6', label: 'Jeu' },
  ];

  const scenes = [
    { id: 'mascot', cls: 'accueil-scene--mascot' },
    { id: 'blocks', cls: 'accueil-scene--blocks' },
    { id: 'robot', cls: 'accueil-scene--robot' },
    { id: 'group', cls: 'accueil-scene--group' },
    { id: 'game', cls: 'accueil-scene--game' },
  ];

  return `
    <div class="accueil-showcase" aria-hidden="true">
      <div class="accueil-showcase__grid"></div>
      <div class="accueil-showcase__glow accueil-showcase__glow--cyan"></div>
      <div class="accueil-showcase__glow accueil-showcase__glow--orange"></div>

      ${stickers.map((s) =>
        `<span class="accueil-sticker ${s.cls}" role="img" aria-label="${s.label}">${s.emoji}</span>`
      ).join('')}

      <div class="accueil-code-rain">
        ${['{ }', '< />', 'fn()', '0101', 'if()', 'K++', 'CCC', 'print'].map((c, i) =>
          `<span class="accueil-code-rain__bit accueil-code-rain__bit--${i + 1}">${c}</span>`
        ).join('')}
      </div>

      ${scenes.map(({ id, cls }) =>
        `<div class="accueil-scene ${cls}">${SCENES[id]}</div>`
      ).join('')}

      <div class="accueil-terminal">
        <div class="accueil-terminal__bar">
          <span></span><span></span><span></span>
        </div>
        <div class="accueil-terminal__body">
          <span class="accueil-terminal__prompt">kebacode&gt;</span>
          <span class="accueil-terminal__typed">print("Bonjour CCC!")</span>
          <span class="accueil-terminal__cursor"></span>
        </div>
      </div>

      <div class="accueil-orbit">
        <span class="accueil-orbit__dot"></span>
        <span class="accueil-orbit__dot"></span>
        <span class="accueil-orbit__dot"></span>
      </div>
    </div>`;
}

export function listScenes() {
  return Object.keys(SCENES);
}
