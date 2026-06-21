/* Écran analyse des réponses */
import { t } from '../data.js';
import { loader } from '../ui.js';

export function renderAnalyse(state) {
  const lang = state.lang;
  return `
    <div class="screen screen--gray analyse-screen fade-enter">
      ${loader(t(lang, 'analyzing'))}
      <div class="analyse-screen__msg" id="analyse-msg">${t(lang, 'computing')}</div>
    </div>`;
}

export const ANALYSE_DELAY = 2300;
