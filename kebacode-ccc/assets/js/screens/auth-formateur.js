/* Écran connexion formateur */
import { t } from '../data.js';
import { DEV_MODE } from '../config.js';
import { headerBar, dockBar, btn } from '../ui.js';

export function renderAuthFormateur(state) {
  const lang = state.lang;
  const err = state.authError || '';
  const loading = state.authLoading;
  const passType = state.authShowPassword ? 'text' : 'password';

  return `
    <div class="screen auth-formateur fade-enter">
      ${headerBar({ lang, online: state.online, etat: state.etat, title: t(lang, 'trainerMode') })}
      <div class="auth-formateur__body scroll-y">
        <div class="auth-formateur__card" data-action-stop>
          <div class="auth-formateur__icon" aria-hidden="true">🎓</div>
          <h1 class="auth-formateur__title">${t(lang, 'authTitle')}</h1>
          <p class="auth-formateur__hint">${t(lang, 'authHint')}</p>

          ${err ? `<div class="auth-formateur__error" role="alert">${err}</div>` : ''}

          <label class="auth-formateur__label">${t(lang, 'authEmail')}</label>
          <input class="auth-formateur__input" id="auth-email" type="email"
            value="${state.authEmailDraft || ''}" placeholder="formateur@ccc.cd"
            autocomplete="username" data-vk="email" data-action-input="auth_email"
            data-action="auth_focus_email" />

          <label class="auth-formateur__label">${t(lang, 'authPassword')}</label>
          <div class="auth-formateur__pin-row">
            <input class="auth-formateur__input auth-formateur__input--pass" id="auth-password"
              type="${passType}" value="${state.authPasswordDraft || ''}" placeholder="ccc2026"
              maxlength="32" autocomplete="current-password" data-vk="text"
              data-action-input="auth_password" data-action="auth_focus_password" />
            <button type="button" class="auth-formateur__toggle" data-action="toggle_auth_password"
              aria-label="${t(lang, 'authShowPassword')}">${state.authShowPassword ? '🙈' : '👁'}</button>
          </div>

          <p class="auth-formateur__kbd-hint">${t(lang, 'authKbdHint')}</p>

          <div class="auth-formateur__actions">
            ${btn({
              variant: 'primary',
              block: true,
              lg: true,
              text: loading ? t(lang, 'authLoading') : t(lang, 'authSubmit'),
              attrs: `data-action="submit_auth_formateur"${loading ? ' disabled' : ''}`,
              id: 'btn-auth-submit',
            })}
            ${btn({ variant: 'ghost', block: true, text: `← ${t(lang, 'back')}`, attrs: 'data-action="retour_auth_formateur"' })}
          </div>
          ${DEV_MODE ? `<p class="auth-formateur__demo">Démo · formateur@ccc.cd · code : ccc2026</p>` : ''}
        </div>
      </div>
      ${dockBar({ lang, online: state.online })}
    </div>`;
}

export function updateAuthSubmitButton() {
  const email = document.getElementById('auth-email');
  const pass = document.getElementById('auth-password');
  const btnEl = document.getElementById('btn-auth-submit');
  if (email && pass && btnEl) {
    btnEl.disabled = !email.value.trim() || !pass.value.trim();
  }
}
