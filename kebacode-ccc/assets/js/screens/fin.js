/* Écran fin de session */
import { t } from '../data.js';
import { brandMark } from '../ui.js';

export function renderFin(state) {
  const lang = state.lang;
  return `
    <div class="screen fin-screen fade-enter">
      <div class="fin-screen__mark">${brandMark('lg')}</div>
      <h1 class="fin-screen__title">${t(lang, 'finTitle')}</h1>
      <p class="fin-screen__sub">${t(lang, 'finSub')}</p>
      <div class="fin-countdown" id="fin-countdown">${t(lang, 'closingIn')} 3${t(lang, 'seconds')}</div>
    </div>`;
}

export const FIN_DELAY = 3000;
