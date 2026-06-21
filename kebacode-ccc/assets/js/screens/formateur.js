/* Écran mode formateur — terminal mini-français */
import { t, STATS } from '../data.js';
import { listConversationModules, getAllGraphs } from '../conversation.js';
import { SUGGESTED_COMMANDS, getGrammarInfo, parse } from '../parser.js';
import { tokenize } from '../lexer.js';
import { btn, barChart, donutChart, renderTokens } from '../ui.js';
import {
  fetchParticipants, buildFiltersFromCommand,
  renderParticipantsTableTerminal, computeStatsFromParticipants, profilLabel,
} from '../participants.js';
import {
  isOffline,
  listerQuestions, creerQuestion, obtenirQuestionParOrdre,
  modifierQuestionParOrdre, desactiverQuestionParOrdre,
  listerCampagnes, lancerCampagne,
  afficherErreursFrequentes, aggregateCommandesFrequentes,
  tableauDeBordSynthetique, libelleQuestion,
} from '../supabase.js';

let formateurState = {
  history: [],
  input: '',
  addMode: false,
  modifyMode: null,
  selectedTheme: 'Cybersécurité',
  lastCmd: '',
};

export function getFormateurState() {
  return formateurState;
}

export function resetFormateurState() {
  formateurState = {
    history: [],
    input: '',
    addMode: false,
    modifyMode: null,
    selectedTheme: 'Cybersécurité',
    lastCmd: '',
  };
}

export function appendHistory(entry) {
  formateurState.history.push(entry);
}

function renderHistoryEntry(e) {
  if (e.kind === 'system') {
    return `<div style="color:var(--term-muted);margin-bottom:4px">${e.text}</div>`;
  }
  if (e.kind === 'input') {
    return `<div style="margin-top:10px"><span style="color:var(--term-orange)">kebacode&gt;</span> ${e.text}</div>`;
  }
  if (e.kind === 'analyse') {
    return `<div class="analyse-banner">
      <span class="analyse-banner__label">analyse LL(1) ▸</span>
      <span class="token-live">${renderTokens(e.tokens)}</span>
    </div>`;
  }
  if (e.kind === 'out') return `<div style="color:rgba(255,255,255,.9);margin-top:4px">${e.html}</div>`;
  if (e.kind === 'error') {
    const cls = e.level === 'danger' ? '' : e.level === 'warning' ? ' term-error--warning' : ' term-error--info';
    const col = e.level === 'danger' ? 'var(--term-red)' : e.level === 'warning' ? 'var(--term-orange)' : 'var(--term-cyan)';
    return `<div class="term-error${cls}" style="color:${col}">
      ${e.message}
      ${e.suggestion ? `<button class="suggest-chip" data-action="cmd_suggestion" data-cmd="${e.suggestion}" style="margin-left:10px">↵ ${e.suggestion}</button>` : ''}
    </div>`;
  }
  if (e.kind === 'stack') {
    return `<div style="margin-top:8px;padding:12px;background:#121212;border:1px solid var(--term-line);border-radius:8px;font-size:12px">
      <div style="color:var(--term-muted);margin-bottom:8px">// analyse pile LL(1)</div>
      ${e.steps.map((s) => `<div style="margin:3px 0;color:rgba(255,255,255,.7)">
        <span style="color:var(--term-cyan)">[${s.stack.join(' ')}]</span>
        <span style="color:var(--term-muted)"> | </span>
        <span>${s.input.join(' ')}</span>
        <span style="color:var(--term-orange)"> → ${s.action}</span>
      </div>`).join('')}
    </div>`;
  }
  return '';
}

function miniDash(lang, metrics) {
  const m = metrics || {
    participants: STATS.participants,
    dropouts: STATS.dropouts,
    completionRate: STATS.completionRate,
    avgTime: STATS.avgTime,
    campaign: STATS.campaign,
  };
  return `<div class="mini-dash">
    <div style="color:var(--term-muted);font-size:11px;margin-bottom:10px">Campagne · ${m.campaign}</div>
    <div style="display:flex;gap:20px;flex-wrap:wrap;margin-bottom:14px">
      ${[[t(lang, 'participants'), m.participants, 'var(--term-orange)'],
        [t(lang, 'dropouts'), m.dropouts, 'var(--term-cyan)'],
        [t(lang, 'completion'), m.completionRate + '%', 'var(--term-orange)'],
        [t(lang, 'avgTime'), m.avgTime, 'var(--term-cyan)']].map(([l, v, c]) =>
        `<div><div style="color:${c};font-weight:700;font-size:22px">${v}</div><div style="color:var(--term-muted);font-size:11px">${l}</div></div>`
      ).join('')}
    </div>
    ${btn({ variant: 'cyan', text: `▸ ${t(lang, 'openStats')}`, attrs: 'data-action="voir_stats"' })}
  </div>`;
}

function questionForm(mode = 'add') {
  const themes = ['Cybersécurité', 'Logique', 'Création', 'Découverte'];
  const isModify = mode === 'modify';
  const ordre = formateurState.modifyMode?.ordre;
  const defaultText = isModify ? (formateurState.modifyMode?.text || '') : '';
  const defaultTheme = isModify ? (formateurState.modifyMode?.theme || 'Cybersécurité') : formateurState.selectedTheme;

  return `<div class="add-question-form" data-action-stop>
    <div style="color:var(--term-muted);font-size:12px;margin-bottom:10px">
      // ${isModify ? `modifier question ${ordre}` : 'nouvelle question'} · thème + intitulé
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px" id="theme-btns">
      ${themes.map((th) => `<button class="suggest-chip${defaultTheme === th ? ' suggest-chip--active' : ''}"
        data-action="select_theme" data-theme="${th}">${th}</button>`).join('')}
    </div>
    <input id="add-q-text" placeholder="Intitulé de la question…" value="${defaultText.replace(/"/g, '&quot;')}"
      data-vk="text"
      style="width:100%;background:#0A0A0A;border:1px solid var(--term-line);border-radius:8px;color:#fff;font-family:var(--font-mono);font-size:14px;padding:12px 14px" />
    <div style="display:flex;gap:10px;margin-top:12px">
      <button class="suggest-chip" data-action="${isModify ? 'save_modify_question' : 'save_question'}"
        style="background:var(--term-cyan);color:#06343b;font-weight:700">${isModify ? '✓ modifier' : '+ enregistrer'}</button>
      <button class="suggest-chip" data-action="cancel_add">annuler</button>
    </div>
  </div>`;
}

function renderQuestionsTable(questions, lang) {
  if (!questions.length) {
    return `<span style="color:var(--term-muted)">Aucune question en base${isOffline() ? ' (mode hors ligne)' : ''}.</span>`;
  }
  const rows = questions.map((q) => {
    const status = q.actif === false ? '<span style="color:var(--term-red)">inactive</span>' : '<span style="color:var(--term-cyan)">active</span>';
    return `<div style="display:flex;gap:12px;padding:4px 0;border-bottom:1px solid var(--term-line)">
      <span style="color:var(--term-orange);min-width:28px">${String(q.ordre).padStart(2, '0')}</span>
      <span style="color:var(--term-muted);min-width:100px">[${q.theme || '—'}]</span>
      <span style="flex:1;color:rgba(255,255,255,.85)">${libelleQuestion(q, lang)}</span>
      <span style="min-width:60px">${status}</span>
    </div>`;
  }).join('');
  return `<div style="margin-top:8px">${rows}</div>`;
}

function renderCampagnesTable(campagnes) {
  if (!campagnes.length) {
    return `<span style="color:var(--term-muted)">Aucune campagne enregistrée.</span>`;
  }
  return campagnes.slice(0, 8).map((c) => {
    const active = c.statut === 'active' ? ' style="color:var(--term-orange)"' : '';
    return `<div${active}>▸ ${c.nom} · ${c.theme || '—'} · ${c.statut}${c.date_debut ? ` · ${c.date_debut}` : ''}</div>`;
  }).join('');
}

async function loadDashboardMetrics() {
  const { data: dash } = await tableauDeBordSynthetique();
  const { data: participants } = await fetchParticipants({});
  const stats = computeStatsFromParticipants(participants || []);
  if (dash) {
    return {
      participants: dash.total_sessions ?? stats.participants ?? STATS.participants,
      dropouts: dash.abandons ?? stats.dropouts ?? STATS.dropouts,
      completionRate: dash.taux_completion ?? stats.completionRate ?? STATS.completionRate,
      avgTime: STATS.avgTime,
      campaign: dash.campagne ?? STATS.campaign,
    };
  }
  return {
    participants: stats.participants ?? STATS.participants,
    dropouts: stats.dropouts ?? STATS.dropouts,
    completionRate: stats.completionRate ?? STATS.completionRate,
    avgTime: STATS.avgTime,
    campaign: STATS.campaign,
  };
}

export function renderFormateur(state) {
  const lang = state.lang;
  const f = state.formateur;
  const userLabel = f ? `${f.prenom || ''} ${f.nom || ''}`.trim() || f.email : '';
  if (formateurState.history.length === 0) {
    formateurState.history = [
      { kind: 'system', text: 'KebaCode Terminal v2.0 — moteur d\'analyse mini-français (LL1)' },
      { kind: 'system', text: 'Tapez « aide » pour voir les commandes disponibles.' },
    ];
  }

  const liveTokens = formateurState.input.trim() ? tokenize(formateurState.input) : [];
  const historyHtml = formateurState.history.map(renderHistoryEntry).join('');
  const formHtml = formateurState.modifyMode
    ? questionForm('modify')
    : formateurState.addMode
      ? questionForm('add')
      : '';

  return `
    <div class="screen formateur-screen fade-enter">
      <div class="formateur-bar no-print">
        <span class="formateur-bar__mode">
          <span class="formateur-bar__dot"></span>MODE_FORMATEUR
          ${userLabel ? `<span class="formateur-bar__user">· ${userLabel}</span>` : ''}
        </span>
        <div style="flex:1"></div>
        ${btn({ variant: 'ghost', text: `▦ ${t(lang, 'stats')}`, attrs: 'data-action="voir_stats"' })}
        ${btn({ variant: 'ghost', text: t(lang, 'authLogout'), attrs: 'data-action="deconnexion_formateur"' })}
        ${btn({ variant: 'ghost', text: '✕ Quitter', attrs: 'data-action="quitter_formateur"' })}
      </div>
      <div class="formateur-output scroll-y" id="formateur-output">${historyHtml}${formHtml}</div>
      ${!formateurState.addMode && !formateurState.modifyMode ? `
      <div class="formateur-input-area no-print">
        <div class="formateur-prompt-row">
          <span class="formateur-prompt">kebacode&gt;</span>
          <input class="formateur-input" id="formateur-input" value="${formateurState.input}"
            placeholder="${t(lang, 'typeCommand')}" spellcheck="false"
            data-vk="command" data-action-input="formateur_input" autocomplete="off" />
          <span class="formateur-cursor"></span>
        </div>
        <div id="formateur-tokens" class="token-live"${liveTokens.length ? '' : ' hidden'}>${liveTokens.length ? renderTokens(liveTokens) : ''}</div>
        <div class="formateur-suggestions">
          <span style="color:var(--term-muted);font-size:12px">${t(lang, 'suggestions')} :</span>
          ${SUGGESTED_COMMANDS.map((c) =>
            `<button class="suggest-chip" data-action="cmd_suggestion" data-cmd="${c}">${c}</button>`
          ).join('')}
        </div>
      </div>` : ''}
    </div>`;
}

async function showParticipantsList(lang, filters, callbacks) {
  const loadingId = `load-${Date.now()}`;
  appendHistory({ kind: 'out', html: `<span id="${loadingId}" style="color:var(--term-muted)">${t(lang, 'loadingParticipants')}</span>` });
  callbacks.onRender?.();

  const { data, source, total } = await fetchParticipants(filters);

  const idx = formateurState.history.findIndex((e) => e.kind === 'out' && e.html?.includes(loadingId));
  if (idx >= 0) formateurState.history.splice(idx, 1);

  const filterDesc = [];
  if (filters.profil) filterDesc.push(profilLabel(filters.profil, lang));
  if (filters.ville) filterDesc.push(filters.ville);
  const title = filterDesc.length
    ? `// ${t(lang, 'participantsList')} — ${filterDesc.join(' · ')}`
    : `// ${t(lang, 'participantsList')}`;

  appendHistory({
    kind: 'out',
    html: renderParticipantsTableTerminal(data, lang, { title, source, total }),
  });
  callbacks.onRender?.();
}

/** Enregistre une nouvelle question (formulaire ou API) */
export async function saveQuestionFromForm(text, theme, lang, callbacks) {
  const { data, error } = await creerQuestion({ texte: text, theme });
  formateurState.addMode = false;

  if (error) {
    appendHistory({ kind: 'error', level: 'danger', message: `Erreur : ${error.message || 'enregistrement impossible'}` });
  } else {
    appendHistory({
      kind: 'out',
      html: `<span style="color:var(--term-cyan)">✓ Question #${data.ordre} enregistrée — [${theme}] « ${text} »</span>`,
    });
    callbacks.onToast?.(t(lang, 'sessionSaved'), 'save');
  }
  callbacks.onRender?.();
}

/** Modifie une question existante */
export async function saveModifyQuestionFromForm(text, lang, callbacks) {
  const ordre = formateurState.modifyMode?.ordre;
  if (!ordre || !text) return;

  const { data, error } = await modifierQuestionParOrdre(ordre, text, lang);
  formateurState.modifyMode = null;

  if (error) {
    appendHistory({ kind: 'error', level: 'danger', message: `Erreur : ${error.message || 'modification impossible'}` });
  } else {
    appendHistory({
      kind: 'out',
      html: `<span style="color:var(--term-cyan)">✓ Question #${ordre} modifiée — « ${text} »</span>`,
    });
    callbacks.onToast?.(t(lang, 'sessionSaved'), 'save');
  }
  callbacks.onRender?.();
}

function launchThemeLabel(complement, target) {
  if (complement?.theme === 'ecole' || complement?.theme === 'école') {
    return { nom: 'Campagne École 2026', theme: 'École' };
  }
  if (complement?.theme === 'cybersecurite') {
    return { nom: 'Campagne Cybersécurité 2026', theme: 'Cybersécurité' };
  }
  if (target === 'enquete') {
    const th = complement?.theme || 'cybersécurite';
    return { nom: `Enquête ${th}`, theme: th };
  }
  return { nom: 'Campagne CCC', theme: complement?.theme || 'Général' };
}

/** Exécution des commandes formateur */
export async function executeCommand(res, lang, callbacks) {
  const { action, target, complement, stackResult } = res;

  if (action === 'help') {
    appendHistory({ kind: 'out', html: `
      <div style="color:var(--term-muted);margin-bottom:6px">// commandes disponibles</div>
      ${[['afficher les statistiques', 'tableau de bord'],
        ['afficher les participants', 'liste détaillée des inscrits'],
        ['afficher les erreurs', 'erreurs fréquentes (base)'],
        ['afficher les commandes', 'historique des commandes'],
        ['chercher adolescents de Kinshasa', 'filtrer par profil & ville'],
        ['lister tout', 'questions & campagnes en base'],
        ['ajouter question', 'créer une question'],
        ['modifier question 3', 'modifier une question par numéro'],
        ['supprimer question 4', 'désactiver une question'],
        ['lancer enquête cybersécurité', 'démarrer enquête thématique'],
        ['lancer campagne école', 'nouvelle campagne scolaire'],
        ['exporter rapport', 'export CSV/PDF'],
        ['recommencer session', 'réinitialiser la borne'],
        ['analyser afficher les stats', 'debug pile LL(1)'],
        ['effacer', 'vider le terminal']].map(([c, d]) =>
        `<div style="display:flex;gap:14px"><span style="color:var(--term-orange);min-width:260px">${c}</span><span style="color:var(--term-muted)">${d}</span></div>`
      ).join('')}` });
    return;
  }

  if (action === 'clear') { formateurState.history = []; return; }
  if (action === 'quit') { callbacks.onQuit?.(); return; }
  if (action === 'restart') { callbacks.onRestart?.(); return; }

  if (action === 'analyze' && stackResult) {
    appendHistory({ kind: 'stack', steps: stackResult.steps });
    const grammar = getGrammarInfo();
    appendHistory({ kind: 'out', html: `
      <div style="color:var(--term-muted);font-size:12px;margin-top:8px">// Grammaire LL(1)</div>
      ${grammar.productions.map((p) => `<div style="color:var(--term-cyan)">${p}</div>`).join('')}` });
    return;
  }

  if (action === 'show') {
    if (target === 'participants') {
      await showParticipantsList(lang, buildFiltersFromCommand(null, complement), callbacks);
      return;
    }
    if (target === 'cities') {
      const { data } = await fetchParticipants({});
      const stats = computeStatsFromParticipants(data);
      appendHistory({ kind: 'out', html: `
        <div style="padding:16px;background:#121212;border-radius:12px;border:1px solid var(--term-line);margin-top:8px">
          <div style="color:var(--term-muted);font-size:12px;margin-bottom:12px">// participants par ville</div>
          ${barChart(stats.cities.length ? stats.cities : STATS.cities, 'var(--term-orange)')}
        </div>` });
    } else if (target === 'profiles') {
      const { data } = await fetchParticipants({});
      const stats = computeStatsFromParticipants(data);
      appendHistory({ kind: 'out', html: `
        <div style="padding:16px;background:#121212;border-radius:12px;border:1px solid var(--term-line);margin-top:8px">
          <div style="color:var(--term-muted);font-size:12px;margin-bottom:12px">// répartition par profil</div>
          ${donutChart(stats.profiles.length ? stats.profiles : STATS.profiles)}
        </div>` });
    } else if (target === 'errors') {
      const { data } = await afficherErreursFrequentes();
      if (!data?.length) {
        appendHistory({ kind: 'out', html: `<span style="color:var(--term-muted)">Aucune erreur enregistrée pour l'instant.</span>` });
      } else {
        const rows = data.map((e) =>
          `<div style="display:flex;gap:16px;padding:3px 0">
            <span style="color:var(--term-orange);min-width:180px">${e.entree_fautive || '—'}</span>
            <span style="color:var(--term-muted)">${e.type_erreur || '?'}</span>
            <span style="color:var(--term-cyan)">${e.occurrences}×</span>
          </div>`).join('');
        appendHistory({ kind: 'out', html: `
          <div style="padding:12px;background:#121212;border-radius:8px;border:1px solid var(--term-line)">
            <div style="color:var(--term-muted);font-size:12px;margin-bottom:8px">// erreurs fréquentes</div>${rows}
          </div>` });
      }
    } else if (target === 'commandes') {
      const { data } = await aggregateCommandesFrequentes();
      if (!data?.length) {
        appendHistory({ kind: 'out', html: `<span style="color:var(--term-muted)">Aucune commande journalisée.</span>` });
      } else {
        const rows = data.map((c) =>
          `<div style="display:flex;gap:16px"><span style="color:var(--term-orange)">${c.label}</span><span style="color:var(--term-cyan)">${c.occurrences}×</span></div>`).join('');
        appendHistory({ kind: 'out', html: `
          <div style="padding:12px;background:#121212;border-radius:8px;border:1px solid var(--term-line)">
            <div style="color:var(--term-muted);font-size:12px;margin-bottom:8px">// commandes les plus fréquentes</div>${rows}
          </div>` });
      }
    } else {
      const metrics = await loadDashboardMetrics();
      appendHistory({ kind: 'out', html: miniDash(lang, metrics) });
    }
    return;
  }

  if (action === 'list') {
    if (target === 'participants') {
      await showParticipantsList(lang, {}, callbacks);
      return;
    }

    const [{ data: questions }, { data: campagnes }] = await Promise.all([
      listerQuestions(),
      listerCampagnes(),
    ]);

    appendHistory({ kind: 'out', html: `
      <div style="color:var(--term-muted);margin-bottom:8px">// questions en base (${questions?.length || 0})</div>
      ${renderQuestionsTable(questions || [], lang)}
      <div style="color:var(--term-muted);margin:16px 0 8px">// campagnes (${campagnes?.length || 0})</div>
      ${renderCampagnesTable(campagnes || [])}
      <div style="color:var(--term-muted);margin:16px 0 8px">// modules de conversation (graphe)</div>
      ${Object.entries(getAllGraphs()).map(([profil]) => {
        const modules = listConversationModules(profil);
        return `<div style="margin-bottom:8px;color:rgba(255,255,255,.6)">${profil} · ${modules.length} nœuds</div>`;
      }).join('')}` });
    return;
  }

  if (action === 'add') {
    formateurState.addMode = true;
    formateurState.modifyMode = null;
    return;
  }

  if (action === 'search') {
    const filters = buildFiltersFromCommand(target, complement);
    await showParticipantsList(lang, filters, callbacks);
    return;
  }

  if (action === 'launch') {
    const { nom, theme } = launchThemeLabel(complement, target);
    const { data, error } = await lancerCampagne({ nom, theme });
    if (error) {
      appendHistory({ kind: 'error', level: 'danger', message: `Impossible de lancer : ${error.message}` });
    } else {
      appendHistory({
        kind: 'out',
        html: `<span style="color:var(--term-orange)">▸ Campagne active — <b>${data.nom}</b> · thème ${data.theme}</span>`,
      });
    }
    return;
  }

  if (action === 'export') {
    const fmt = target === 'pdf' ? 'PDF' : 'CSV';
    appendHistory({ kind: 'out', html: `<span style="color:var(--term-cyan)">✓ Export ${fmt} généré</span>` });
    callbacks.onExport?.(target === 'pdf' ? 'pdf' : 'csv');
    return;
  }

  if (action === 'delete' && target === 'question') {
    const ordre = complement?.number;
    if (!ordre) {
      appendHistory({ kind: 'error', level: 'warning', message: 'Précisez le numéro — ex. : supprimer question 4', suggestion: 'supprimer question 4' });
      return;
    }
    const { data, error } = await desactiverQuestionParOrdre(ordre);
    if (error || !data) {
      appendHistory({ kind: 'error', level: 'danger', message: error?.message || `Question #${ordre} introuvable` });
    } else {
      appendHistory({ kind: 'out', html: `<span style="color:var(--term-cyan)">✓ Question #${ordre} désactivée (conservée en base)</span>` });
    }
    return;
  }

  if (action === 'modify' && target === 'question') {
    const ordre = complement?.number;
    if (!ordre) {
      appendHistory({ kind: 'error', level: 'warning', message: 'Précisez le numéro — ex. : modifier question 3', suggestion: 'modifier question 3' });
      return;
    }
    const { data, error } = await obtenirQuestionParOrdre(ordre);
    if (error || !data) {
      appendHistory({ kind: 'error', level: 'danger', message: error?.message || `Question #${ordre} introuvable` });
      return;
    }
    formateurState.modifyMode = {
      ordre,
      id: data.id,
      theme: data.theme,
      text: libelleQuestion(data, lang),
    };
    formateurState.addMode = false;
    formateurState.selectedTheme = data.theme || 'Cybersécurité';
    return;
  }

  appendHistory({ kind: 'out', html: `<span style="color:var(--term-muted)">Commande exécutée : ${action} → ${target || '—'}</span>` });
}

export function updateFormateurLivePreview() {
  const input = document.getElementById('formateur-input');
  const tokensEl = document.getElementById('formateur-tokens');
  if (!input || !tokensEl) return;

  const text = input.value;
  formateurState.input = text;

  if (!text.trim()) {
    tokensEl.innerHTML = '';
    tokensEl.hidden = true;
    return;
  }

  tokensEl.innerHTML = renderTokens(tokenize(text));
  tokensEl.hidden = false;
}

export async function submitCommand(line, lang, callbacks) {
  const trimmed = line.trim();
  if (!trimmed) return;

  formateurState.lastCmd = trimmed;
  appendHistory({ kind: 'input', text: trimmed });

  const res = parse(trimmed);
  appendHistory({ kind: 'analyse', tokens: res.tokens });

  if (res.autoFixed) {
    appendHistory({ kind: 'error', level: 'info', message: 'Correction automatique appliquée (confiance > 80%)' });
  }

  if (res.ok) {
    await executeCommand(res, lang, callbacks);
    callbacks.onJournal?.(trimmed, res);
  } else if (res.level) {
    appendHistory({ kind: 'error', level: res.level, message: res.message, suggestion: res.suggestion });
    callbacks.onError?.(res);
  }

  formateurState.input = '';
}
