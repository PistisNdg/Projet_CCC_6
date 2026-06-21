/* Données participants réelles — sessions Supabase + repli local */
import { PROFILES, t } from './data.js';
import { getReco } from './recos-i18n.js';
import { listerSessionsParticipants, isOffline } from './supabase.js';
import { SESSION_KEY } from './config.js';

export const PROFILE_TARGETS = {
  adolescents: 'ado',
  adolescent: 'ado',
  ado: 'ado',
  enfants: 'enfant',
  enfant: 'enfant',
  parents: 'parent',
  parent: 'parent',
  visiteurs: 'visiteur',
  visiteur: 'visiteur',
};

const VILLE_CANON = {
  kinshasa: 'Kinshasa',
  lubumbashi: 'Lubumbashi',
  goma: 'Goma',
  bukavu: 'Bukavu',
  kisangani: 'Kisangani',
  matadi: 'Matadi',
};

const DEMO = [
  { id: 'd1', userName: 'Grace M.', profil: 'ado', ville: 'Kinshasa', statut: 'terminee', parcours: 'Scratch avancé → Python débutant', date: '2026-06-18T09:12:00Z', campagne: 'Cybersécurité', lang: 'fr' },
  { id: 'd2', userName: 'Patrick K.', profil: 'ado', ville: 'Kinshasa', statut: 'terminee', parcours: 'Python Avancé', date: '2026-06-17T14:05:00Z', campagne: 'Cybersécurité', lang: 'fr' },
  { id: 'd3', userName: 'Amina B.', profil: 'ado', ville: 'Lubumbashi', statut: 'en_cours', parcours: '—', date: '2026-06-19T11:20:00Z', campagne: 'Cybersécurité', lang: 'fr' },
  { id: 'd4', userName: 'Samuel T.', profil: 'enfant', ville: 'Goma', statut: 'terminee', parcours: 'Scratch Junior → Blockly Games', date: '2026-06-16T16:40:00Z', campagne: 'Cybersécurité', lang: 'ln' },
  { id: 'd5', userName: 'Chloé N.', profil: 'enfant', ville: 'Kinshasa', statut: 'terminee', parcours: 'Scratch Junior → Blockly Games', date: '2026-06-15T10:00:00Z', campagne: 'Cybersécurité', lang: 'fr' },
  { id: 'd6', userName: 'Marie L.', profil: 'parent', ville: 'Bukavu', statut: 'terminee', parcours: 'Découverte CCC → Atelier parents', date: '2026-06-14T08:30:00Z', campagne: 'Cybersécurité', lang: 'fr' },
  { id: 'd7', userName: 'Jean-Paul O.', profil: 'visiteur', ville: 'Matadi', statut: 'abandonnee', parcours: '—', date: '2026-06-13T13:15:00Z', campagne: 'Cybersécurité', lang: 'fr' },
  { id: 'd8', userName: 'David S.', profil: 'ado', ville: 'Kinshasa', statut: 'terminee', parcours: 'Cybersécurité Jeunes', date: '2026-06-12T17:50:00Z', campagne: 'Cybersécurité', lang: 'sw' },
];

function normalizeSession(row) {
  const ctx = row.contexte || {};
  const lang = ctx.lang || 'fr';
  const recoKey = ctx.recoResult?.key || row.recommandation?.[0]?.parcours_key;
  const reco = recoKey ? getReco(recoKey, lang) : ctx.recoResult?.reco;
  const profil = ctx.profile || row.utilisateur?.tranche_age || 'visiteur';
  const villeRaw = ctx.ville || row.utilisateur?.ville?.nom_ville || '—';

  return {
    id: row.id,
    userName: ctx.userName || row.utilisateur?.pseudo || t(lang, 'anonymous') || 'Anonyme',
    profil,
    ville: villeRaw,
    statut: row.statut || 'en_cours',
    parcours: reco?.track || recoKey || '—',
    date: row.created_at || new Date().toISOString(),
    campagne: row.campagne?.nom || row.campagne?.theme || '—',
    lang,
  };
}

function readLocalParticipant() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    const ctx = saved.contexte || {};
    if (!ctx.profile && !ctx.userName) return null;
    return {
      id: ctx.sessionId || 'local',
      userName: ctx.userName || 'Visiteur',
      profil: ctx.profile || 'visiteur',
      ville: ctx.ville || 'Kinshasa',
      statut: ['FIN_SESSION', 'RECOMMANDATION'].includes(saved.etat) ? 'terminee' : 'en_cours',
      parcours: ctx.recoResult?.key
        ? (getReco(ctx.recoResult.key, ctx.lang || 'fr')?.track || ctx.recoResult.key)
        : '—',
      date: new Date(saved.savedAt || Date.now()).toISOString(),
      campagne: 'Campagne Cybersécurité 2026',
      lang: ctx.lang || 'fr',
      _local: true,
    };
  } catch (_) {
    return null;
  }
}

export function buildFiltersFromCommand(target, complement) {
  const filters = {};
  if (target && PROFILE_TARGETS[target]) filters.profil = PROFILE_TARGETS[target];
  if (complement?.ville) filters.ville = VILLE_CANON[complement.ville] || complement.ville;
  return filters;
}

export function filterParticipants(list, { profil, ville, statut } = {}) {
  return list.filter((p) => {
    if (profil && p.profil !== profil) return false;
    if (ville) {
      const v = p.ville.toLowerCase();
      const wanted = ville.toLowerCase();
      if (!v.includes(wanted)) return false;
    }
    if (statut && p.statut !== statut) return false;
    return true;
  });
}

export async function fetchParticipants(filters = {}) {
  let list = [];
  let source = 'demo';

  const { data, error } = await listerSessionsParticipants();

  if (data?.length) {
    list = data.map(normalizeSession);
    source = 'supabase';
  } else if (error) {
    console.warn('[Participants] Erreur Supabase:', error);
  }

  const local = readLocalParticipant();
  if (local && !list.some((p) => p.id === local.id)) list.unshift(local);

  if (!list.length && isOffline()) {
    list = [...DEMO];
    if (local) list.unshift(local);
    source = 'demo+local';
  } else if (!list.length) {
    source = 'empty';
  }

  const filtered = filterParticipants(list, filters);
  return { data: filtered, total: list.length, source, filters };
}

export function profilLabel(profil, lang) {
  const p = PROFILES.find((x) => x.id === profil);
  return p?.label[lang] || p?.label.fr || profil;
}

export function statutLabel(statut, lang) {
  const map = {
    en_cours: t(lang, 'statusProgress'),
    terminee: t(lang, 'statusDone'),
    abandonnee: t(lang, 'statusDropped'),
  };
  return map[statut] || statut;
}

export function formatDate(iso, lang = 'fr') {
  try {
    return new Date(iso).toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch (_) {
    return iso;
  }
}

export function computeStatsFromParticipants(participants) {
  const byCity = {};
  const byProfile = {};
  let terminees = 0;
  let abandons = 0;

  participants.forEach((p) => {
    byCity[p.ville] = (byCity[p.ville] || 0) + 1;
    const pl = profilLabel(p.profil, 'fr');
    byProfile[pl] = (byProfile[pl] || 0) + 1;
    if (p.statut === 'terminee') terminees++;
    if (p.statut === 'abandonnee') abandons++;
  });

  const total = participants.length || 1;
  return {
    participants: participants.length,
    dropouts: abandons,
    completionRate: Math.round((terminees / total) * 100),
    cities: Object.entries(byCity).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value),
    profiles: Object.entries(byProfile).map(([label, value], i) => ({
      label, value, color: ['var(--orange)', 'var(--cyan)', 'var(--orange-light)', 'var(--cyan-light)'][i % 4],
    })),
  };
}

export function renderParticipantsTableTerminal(participants, lang, { title = '', source = '', total = 0 } = {}) {
  if (!participants.length) {
    return `<div style="color:var(--term-muted);margin-top:8px;padding:12px">${t(lang, 'noParticipants')}</div>`;
  }

  const rows = participants.map((p) => `
    <tr>
      <td style="color:#fff;font-weight:600">${p.userName}</td>
      <td style="color:var(--term-cyan)">${profilLabel(p.profil, lang)}</td>
      <td>${p.ville}</td>
      <td style="color:rgba(255,255,255,.8);max-width:180px">${p.parcours}</td>
      <td>${statutLabel(p.statut, lang)}</td>
      <td style="color:var(--term-muted);white-space:nowrap">${formatDate(p.date, lang)}</td>
    </tr>`).join('');

  return `
    <div style="padding:16px;background:#121212;border-radius:12px;border:1px solid var(--term-line);margin-top:8px;overflow-x:auto">
      ${title ? `<div style="color:var(--term-orange);font-weight:700;margin-bottom:10px">${title}</div>` : ''}
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead>
          <tr style="color:var(--term-muted);text-align:left;border-bottom:1px solid var(--term-line)">
            <th style="padding:6px 8px">${t(lang, 'colName')}</th>
            <th style="padding:6px 8px">${t(lang, 'colProfile')}</th>
            <th style="padding:6px 8px">${t(lang, 'colCity')}</th>
            <th style="padding:6px 8px">${t(lang, 'colPath')}</th>
            <th style="padding:6px 8px">${t(lang, 'colStatus')}</th>
            <th style="padding:6px 8px">${t(lang, 'colDate')}</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div style="color:var(--term-muted);font-size:11px;margin-top:10px">
        ${participants.length} ${t(lang, 'resultsCount')}${total ? ` / ${total}` : ''}
        · ${t(lang, 'dataSource')}: ${source}
      </div>
    </div>`;
}

export function renderParticipantsTableUI(participants, lang, { activeFilter = '' } = {}) {
  const filters = [
    { id: '', label: t(lang, 'filterAll') },
    { id: 'ado', label: t(lang, 'filterTeens') },
    { id: 'enfant', label: t(lang, 'filterKids') },
    { id: 'parent', label: t(lang, 'filterParents') },
    { id: 'visiteur', label: t(lang, 'filterVisitors') },
  ];

  const chips = filters.map((f) =>
    `<button class="filter-chip${activeFilter === f.id ? ' filter-chip--active' : ''}"
      data-action="filter_participants" data-profil="${f.id}">${f.label}</button>`
  ).join('');

  if (!participants.length) {
    return `
      <div class="stats-participants">
        <h3>${t(lang, 'participantsList')}</h3>
        <div class="participants-filters">${chips}</div>
        <p class="participants-empty">${t(lang, 'noParticipants')}</p>
      </div>`;
  }

  const rows = participants.map((p) => `
    <tr>
      <td><strong>${p.userName}</strong></td>
      <td><span class="participants-profil participants-profil--${p.profil}">${profilLabel(p.profil, lang)}</span></td>
      <td>${p.ville}</td>
      <td class="participants-parcours">${p.parcours}</td>
      <td><span class="participants-statut participants-statut--${p.statut}">${statutLabel(p.statut, lang)}</span></td>
      <td class="participants-date">${formatDate(p.date, lang)}</td>
    </tr>`).join('');

  return `
    <div class="stats-participants">
      <h3>${t(lang, 'participantsList')}</h3>
      <div class="participants-filters">${chips}</div>
      <div class="participants-table-wrap">
        <table class="participants-table">
          <thead><tr>
            <th>${t(lang, 'colName')}</th>
            <th>${t(lang, 'colProfile')}</th>
            <th>${t(lang, 'colCity')}</th>
            <th>${t(lang, 'colPath')}</th>
            <th>${t(lang, 'colStatus')}</th>
            <th>${t(lang, 'colDate')}</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;
}

export function participantsToCSV(participants, lang) {
  const header = [t(lang, 'colName'), t(lang, 'colProfile'), t(lang, 'colCity'), t(lang, 'colPath'), t(lang, 'colStatus'), t(lang, 'colDate')];
  const rows = participants.map((p) => [
    p.userName,
    profilLabel(p.profil, lang),
    p.ville,
    p.parcours,
    statutLabel(p.statut, lang),
    formatDate(p.date, lang),
  ]);
  return [header, ...rows];
}
