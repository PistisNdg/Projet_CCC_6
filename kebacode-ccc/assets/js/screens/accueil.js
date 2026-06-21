/* Écran d'accueil — sélection de langue */
import { t } from '../data.js';
import { renderAccueilHeroShowcase } from '../illustrations.js';
import { brandMark, bgMesh, btn, dockBar } from '../ui.js';

const LANGS = [
  { code: 'fr', labelKey: 'langFr', flag: '🇫🇷' },
  { code: 'en', labelKey: 'langEn', flag: '🇬🇧' },
  { code: 'ln', labelKey: 'langLn', flag: '🇨🇩' },
  { code: 'sw', labelKey: 'langSw', flag: '🇹🇿' },
];

export function renderAccueil(state) {
  const saved = state.savedSession;

  const langCards = LANGS.map(({ code, labelKey, flag }) => `
    <button class="lang-card" data-action="choisir_langue" data-lang="${code}">
      <span class="lang-card__flag">${flag}</span>
      <span class="lang-card__name">${t('fr', labelKey)}</span>
    </button>`).join('');

  const resumeBlock = saved ? `
    <div class="accueil__resume" data-action-stop>
      <div class="accueil__resume-title">${t('fr', 'resumeTitle')}</div>
      <div class="accueil__resume-sub">${t('fr', 'resumeFor')} ${saved.contexte?.userName || '…'}</div>
      <div class="accueil__resume-actions">
        ${btn({ variant: 'primary', text: t('fr', 'resumeBtn'), attrs: 'data-action="reprendre"' })}
        ${btn({ variant: 'ghost', text: t('fr', 'newSession'), attrs: 'data-action="nouvelle_session"' })}
      </div>
    </div>` : '';

  return `
    <div class="screen accueil fade-enter">
      <aside class="accueil__hero accueil__hero--animated">
        ${renderAccueilHeroShowcase()}
        <div class="accueil__hero-brand">
          <div class="accueil__hero-mark">${brandMark('lg')}</div>
          <p class="accueil__hero-tag">Fondation CCC · RDC</p>
        </div>
      </aside>
      <div class="accueil__panel">
        ${bgMesh()}
        <div class="accueil__content" data-action-stop>
          <p class="accueil__eyebrow">Orientation numérique</p>
          <h1 class="accueil__title">${t('fr', 'welcome').replace(/\bCCC\b/, '<mark>CCC</mark>')}</h1>
          <p class="accueil__tagline">${t('fr', 'langQ')}</p>
          <div class="lang-grid">${langCards}</div>
          ${resumeBlock}
        </div>
      </div>
      ${dockBar({ lang: 'fr', online: state.online, hideLang: true, hideOnline: true })}
    </div>`;
}
