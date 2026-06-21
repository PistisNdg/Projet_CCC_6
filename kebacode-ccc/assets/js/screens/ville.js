/* Écran sélection de la ville */
import { t } from '../data.js';
import { VILLES } from '../supabase.js';
import { headerBar, dockBar, stepRail, btn } from '../ui.js';

export function renderVille(state) {
  const lang = state.lang;
  const tone = state.profile ? `tone-${state.profile.tone || 'adult'}` : '';

  const cityCards = VILLES.map((ville) => `
    <button type="button" class="ville-card${state.ville === ville ? ' ville-card--active' : ''}"
      data-action="choisir_ville" data-ville="${ville}">${ville}</button>`).join('');

  return `
    <div class="screen nom-screen fade-enter ${tone}">
      ${headerBar({ lang, userName: state.userName, online: state.online, etat: state.etat, title: '02 · Ville' })}
      ${stepRail(2, 4)}
      <div class="nom-screen__body scroll-y">
        <h2 class="nom-screen__heading">${t(lang, 'cityQ')}</h2>
        <p class="nom-hint">${t(lang, 'cityHint')}</p>
        <div class="ville-grid" data-action-stop>${cityCards}</div>
      </div>
      <div class="nom-footer" data-action-stop>
        ${btn({ variant: 'ghost', text: `← ${t(lang, 'back')}`, attrs: 'data-action="retour_ville"' })}
        ${btn({ variant: 'primary', text: `${t(lang, 'continueBtn')} →`, attrs: 'data-action="continuer_ville"', id: 'btn-continuer-ville' })}
      </div>
      ${dockBar({ lang, online: state.online })}
    </div>`;
}

export function updateVilleButton() {
  const btnEl = document.getElementById('btn-continuer-ville');
  const cityOk = !!document.querySelector('.ville-card--active');
  if (btnEl) btnEl.disabled = !cityOk;
}
