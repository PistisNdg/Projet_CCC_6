/* Écran saisie du prénom */
import { t } from '../data.js';
import { headerBar, dockBar, stepRail } from '../ui.js';

export function renderNom(state) {
  const lang = state.lang;
  const tone = state.profile ? `tone-${state.profile.tone || 'adult'}` : '';
  const canContinue = !!(state.userName || '').trim();

  return `
    <div class="screen nom-screen fade-enter ${tone}">
      ${headerBar({ lang, userName: state.userName, online: state.online, etat: state.etat, title: '01 · Prénom' })}
      ${stepRail(1, 4)}
      <div class="nom-screen__body scroll-y">
        <h2 class="nom-screen__heading">${t(lang, 'nameQ')}</h2>
        <p class="nom-hint">${t(lang, 'nameHint')}</p>
        <div class="nom-input-row" data-action-stop>
          <button type="button" class="nom-side-btn nom-side-btn--skip" data-action="skip_nom">
            <span class="nom-side-btn__icon" aria-hidden="true">⏭</span>
            <span class="nom-side-btn__label">${t(lang, 'skipName')}</span>
          </button>
          <div class="nom-input-wrap">
            <span class="nom-input-prefix">@</span>
            <input class="nom-input" id="nom-input" type="text" value="${state.userName || ''}"
              placeholder="${t(lang, 'namePlaceholder')}" autocomplete="off"
              data-vk="text" data-vk-scroll="minimal" data-action-input="saisie_nom" />
          </div>
          <button type="button" class="nom-side-btn nom-side-btn--next" id="btn-continuer-nom"
            data-action="continuer_nom"${canContinue ? '' : ' disabled'}>
            <span class="nom-side-btn__icon" aria-hidden="true">→</span>
            <span class="nom-side-btn__label">${t(lang, 'continueBtn')}</span>
          </button>
        </div>
      </div>
      ${dockBar({ lang, online: state.online })}
    </div>`;
}

export function updateNomButton() {
  const input = document.getElementById('nom-input');
  const btnEl = document.getElementById('btn-continuer-nom');
  if (input && btnEl) btnEl.disabled = !input.value.trim();
}
