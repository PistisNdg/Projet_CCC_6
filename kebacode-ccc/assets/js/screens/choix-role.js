/* Écran choix du rôle — Candidat ou Formateur */
import { t } from '../data.js';
import { brandMark, bgMesh, btn, dockBar } from '../ui.js';

export function renderChoixRole(state) {
  const lang = state.lang;

  return `
    <div class="screen accueil choix-role fade-enter">
      <aside class="accueil__hero">
        <div class="accueil__hero-mark">${brandMark('lg')}</div>
        <p class="accueil__hero-tag">Fondation CCC · RDC</p>
      </aside>
      <div class="accueil__panel">
        ${bgMesh()}
        <div class="accueil__content" data-action-stop>
          <p class="accueil__eyebrow">${t(lang, 'welcome').replace(/\bCCC\b/, 'CCC')}</p>
          <h1 class="accueil__title">${t(lang, 'whoAreYou')}</h1>
          <div class="role-grid">
            <article class="role-card role-card--candidate">
              <div class="role-card__icon">👤</div>
              <h2 class="role-card__title">${t(lang, 'candidate')}</h2>
              <p class="role-card__hint">${t(lang, 'candidateHint')}</p>
              ${btn({ variant: 'primary', block: true, lg: true, text: t(lang, 'letsTalk'), attrs: 'data-action="demarrer"' })}
            </article>
            <article class="role-card role-card--trainer">
              <div class="role-card__icon">🎓</div>
              <h2 class="role-card__title">${t(lang, 'trainer')}</h2>
              <p class="role-card__hint">${t(lang, 'trainerHint')}</p>
              ${btn({ variant: 'secondary', block: true, lg: true, text: t(lang, 'login'), attrs: 'data-action="mode_formateur"' })}
            </article>
          </div>
          <div class="choix-role__back">
            ${btn({ variant: 'ghost', text: `← ${t(lang, 'back')}`, attrs: 'data-action="retour_accueil"' })}
          </div>
        </div>
      </div>
      ${dockBar({ lang, online: state.online })}
    </div>`;
}
