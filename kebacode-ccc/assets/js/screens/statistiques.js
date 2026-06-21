/* Écran statistiques */
import { t, STATS } from '../data.js';
import { headerBar, dockBar, btn, metric, barChart, donutChart, lineChart, exportCSV } from '../ui.js';
import { renderParticipantsTableUI, participantsToCSV } from '../participants.js';

export function renderStatistiques(state) {
  const lang = state.lang;
  const S = STATS;
  const ps = state.participantsStats;
  const participants = state.participantsData;
  const loading = state.participantsData === null;

  const metrics = ps ? {
    participants: ps.participants,
    dropouts: ps.dropouts,
    completionRate: ps.completionRate,
    avgTime: S.avgTime,
    cities: ps.cities,
    profiles: ps.profiles,
  } : {
    participants: S.participants,
    dropouts: S.dropouts,
    completionRate: S.completionRate,
    avgTime: S.avgTime,
    cities: S.cities,
    profiles: S.profiles,
  };

  return `
    <div class="screen stats-screen fade-enter">
      <div class="no-print">${headerBar({ lang, online: state.online, etat: state.etat, title: t(lang, 'stats'), dark: false })}</div>
      <div class="stats-toolbar no-print" style="display:flex;gap:10px;padding:12px 24px;border-bottom:var(--brut);background:var(--white)">
        ${btn({ variant: 'ghost', text: '← Terminal', attrs: 'data-action="retour_stats"' })}
        <div style="flex:1"></div>
        ${btn({ variant: 'secondary', text: '↓ CSV', attrs: 'data-action="export_csv"' })}
        ${btn({ variant: 'secondary', text: '↓ PDF', attrs: 'data-action="export_pdf_stats"' })}
      </div>
      <div class="stats-body scroll-y">
        <div class="stats-header">
          <h1 class="stats-title">${t(lang, 'stats')}</h1>
          <span class="stats-campaign">${t(lang, 'campaign')} · ${S.campaign}</span>
        </div>
        <div class="stats-metrics">
          ${metric(metrics.participants, t(lang, 'participants'), 'var(--orange)')}
          ${metric(metrics.dropouts, t(lang, 'dropouts'), 'var(--cyan)')}
          ${metric(metrics.completionRate + '%', t(lang, 'completion'), 'var(--orange)')}
          ${metric(metrics.avgTime, t(lang, 'avgTime'), 'var(--cyan)')}
        </div>
        <div class="stats-charts">
          <div class="stats-chart-box">
            <h3>${t(lang, 'byCity')}</h3>
            ${barChart(metrics.cities, 'var(--orange)')}
          </div>
          <div class="stats-chart-box">
            <h3>${t(lang, 'byProfile')}</h3>
            ${donutChart(metrics.profiles)}
          </div>
          <div class="stats-chart-box stats-chart-box--wide">
            <h3>${t(lang, 'perDay')}</h3>
            ${lineChart(S.perDay)}
          </div>
        </div>
        ${loading
          ? `<div class="participants-loading">${t(lang, 'loadingParticipants')}</div>`
          : renderParticipantsTableUI(participants || [], lang, { activeFilter: state.participantsFilter || '' })}
      </div>
      <div class="no-print">${dockBar({ lang, online: state.online })}</div>
    </div>`;
}

export function doExportCSV(participants, lang = 'fr') {
  if (participants?.length) {
    exportCSV(participantsToCSV(participants, lang), 'participants_ccc.csv');
    return;
  }
  const S = STATS;
  const rows = [
    ['Campagne', 'Participants', 'Abandons', 'Complétion', 'Durée moyenne'],
    [S.campaign, S.participants, S.dropouts, S.completionRate + '%', S.avgTime],
    [],
    ['Ville', 'Participants'],
    ...S.cities.map((c) => [c.label, c.value]),
  ];
  exportCSV(rows, 'campagne_cybersecurite.csv');
}
