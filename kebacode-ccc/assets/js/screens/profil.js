/* Écran sélection de profil — bande horizontale */
import { t, PROFILES } from '../data.js';
import { headerBar, dockBar, stepRail, btn } from '../ui.js';

const ICONS = { enfant: '★', ado: '◆', parent: '♥', visiteur: '○' };
const COLORS = { enfant: 'var(--cyan)', ado: 'var(--orange)', parent: '#6B7280', visiteur: '#9CA3AF' };

export function renderProfil(state) {
  const lang = state.lang;

  const cards = PROFILES.map((p) => `
    <article class="profil-card" data-action="choisir_profil" data-profil-id="${p.id}">
      <div class="profil-card__icon" style="background:${COLORS[p.id] || 'var(--ink-soft)'}">${ICONS[p.id] || p.initial}</div>
      <div class="profil-card__name">${p.label[lang] || p.label.fr}</div>
      ${p.age ? `<div class="profil-card__age">${p.age}</div>` : ''}
      <span class="profil-card__cta">${t(lang, 'selectProfile')} →</span>
    </article>`).join('');

  return `
    <div class="screen fade-enter">
      ${headerBar({ lang, userName: state.userName, online: state.online, etat: state.etat, title: '03 · Profil' })}
      ${stepRail(3, 4)}
      <div class="profil-screen__body scroll-y">
        <div class="profil-intro">
          <h2>${t(lang, 'profileQ')}</h2>
          <p>${t(lang, 'profileHint')}</p>
        </div>
        <div class="profil-strip">${cards}</div>
      </div>
      <div class="profil-footer">
        ${btn({ variant: 'ghost', text: `← ${t(lang, 'back')}`, attrs: 'data-action="retour_profil"' })}
      </div>
      ${dockBar({ lang, online: state.online })}
    </div>`;
}
