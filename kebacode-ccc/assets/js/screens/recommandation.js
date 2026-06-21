/* Écran recommandation — layout bento */
import { t } from '../data.js';
import { getReco, getParcoursLabel } from '../recos-i18n.js';
import { headerBar, dockBar, btn } from '../ui.js';

export function renderRecommandation(state) {
  const lang = state.lang;
  const recoKey = state.recoResult?.key;
  const reco = getReco(recoKey, lang) || {};
  const scores = state.recoResult?.parcoursScores || {};
  const answers = state.conversation?.answers || state.answers || [];

  const stepsHtml = (reco.steps || []).map((s, i) =>
    `<li><span class="reco-step-num">${String(i + 1).padStart(2, '0')}</span><span>${s}</span></li>`).join('');

  const scoresHtml = Object.entries(scores)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `<div>${getParcoursLabel(k, lang)} · ${v}pt</div>`)
    .join('');

  const answersHtml = answers.map((a) =>
    `<div class="reco-dialogue-line"><span class="reco-dialogue-q">${a.nodeId || a.questionId}</span> ${a.label || a.value || '—'}</div>`).join('');

  return `
    <div class="screen reco-screen fade-enter">
      ${headerBar({ lang, profile: state.profile, userName: state.userName, online: state.online, etat: state.etat, title: 'Parcours' })}
      <div class="reco-body scroll-y">
        <div class="reco-bento">
          <div class="reco-bento__main">
            <span class="reco-badge">${t(lang, 'recommended')}</span>
            <div class="reco-track">${reco.track || ''}</div>
            <div class="reco-tag">${reco.tag || ''}</div>
            <h3 style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-faint);margin-bottom:10px">${t(lang, 'nextSteps')}</h3>
            <ol class="reco-steps">${stepsHtml}</ol>
            <div class="reco-club">${reco.club || ''}</div>
          </div>
          ${scoresHtml ? `<div class="reco-scores"><h4>${t(lang, 'scoresTitle')}</h4>${scoresHtml}</div>` : ''}
          <div class="reco-bento__aside accordion" data-action="toggle_accordion">
            <div class="accordion__header">${t(lang, 'basedOn')} <span>+</span></div>
            <div class="accordion__body reco-dialogue">${answersHtml}</div>
          </div>
        </div>
      </div>
      <div class="reco-footer">
        ${btn({ variant: 'primary', lg: true, text: `${t(lang, 'joinCCC')} →`, attrs: 'data-action="rejoindre_club"' })}
        ${btn({ variant: 'secondary', text: t(lang, 'downloadPdf'), attrs: 'data-action="telecharger_pdf"' })}
        ${btn({ variant: 'ghost', text: `↺ ${t(lang, 'restart')}`, attrs: 'data-action="recommencer"' })}
      </div>
      ${dockBar({ lang, online: state.online })}
    </div>`;
}
