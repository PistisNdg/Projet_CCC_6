/* ============================================================
   KebaCode CCC — UI « Atlas Bento »
   ============================================================ */

import { t, PROFILES } from './data.js';
import { getReco } from './recos-i18n.js';
import { DEV_MODE } from './config.js';

export function $(sel, root = document) { return root.querySelector(sel); }
export function $$(sel, root = document) { return root.querySelectorAll(sel); }
export function render(html) { $('#root').innerHTML = html; }
export function clearRoot() { $('#root').innerHTML = ''; }

/** Marque hexagonale K (remplace les triangles du prototype) */
export function brandMark(size = 'md') {
  const sizes = {
    sm: 'brand-mark--sm',
    md: 'brand-mark--md',
    lg: 'brand-mark--lg',
  };
  return `<span class="brand-mark ${sizes[size] || sizes.md}" aria-hidden="true">K</span>`;
}

/** @deprecated alias */
export const triangleMark = (px) => brandMark(px > 60 ? 'lg' : px > 30 ? 'md' : 'sm');

/** Motif pointillé + diagonales */
export function bgMesh() {
  return '<div class="bg-mesh"></div><div class="bg-diagonal"></div>';
}

/** @deprecated */
export const bgTriangles = () => bgMesh();

/** Header fin en haut */
export function headerBar({ dark = false, lang = 'fr', profile = null, userName = '', online = true, etat = '', step = null, title = '' } = {}) {
  const cls = ['header-bar', dark ? 'header-bar--dark' : '', title ? '' : ''].filter(Boolean).join(' ');
  const prof = profile ? PROFILES.find((p) => p.id === profile) : null;

  return `
    <header class="${cls}">
      <div class="header-bar__brand">${brandMark('sm')}<span class="header-bar__title">Keba<em>Code</em></span></div>
      ${title ? `<span class="header-bar__meta">${title}</span>` : ''}
      <div class="header-bar__spacer"></div>
      ${userName ? `<span class="header-bar__meta">${userName}</span>` : ''}
      ${prof ? profileChip(prof, lang) : ''}
      ${DEV_MODE && etat ? `<span class="fsm-badge">${etat}</span>` : ''}
    </header>`;
}

/** Dock utilitaire en bas (langue + statut) */
export function dockBar({ dark = false, lang = 'fr', online = true, hideLang = false, hideOnline = false } = {}) {
  const onlineCls = online ? 'online-badge--on' : 'online-badge--off';
  const onlineLabel = online ? t(lang, 'online') : t(lang, 'offline');

  return `
    <footer class="dock-bar${dark ? ' dock-bar--dark' : ''}${hideLang && hideOnline ? ' dock-bar--empty' : ''}">
      ${hideLang ? '' : langSelector(lang)}
      ${hideOnline ? '' : `<span class="online-badge ${onlineCls}"><span class="online-badge__dot"></span>${onlineLabel}</span>`}
    </footer>`;
}

/** Shell complet : header + contenu implicite + dock */
export function appShell(opts = {}) {
  return headerBar(opts) + dockBar(opts);
}

/** @deprecated — utilise headerBar + dockBar */
export function topBar(opts = {}) {
  return headerBar(opts) + dockBar(opts);
}

export function langSelector(lang) {
  const langs = [['fr', 'FR'], ['en', 'EN'], ['ln', 'LN'], ['sw', 'SW']];
  return `<div class="lang-pills">${langs.map(([code, label]) =>
    `<button class="lang-pill${lang === code ? ' lang-pill--active' : ''}" data-action="changer_langue" data-lang="${code}">${label}</button>`
  ).join('')}</div>`;
}

export function profileChip(profile, lang) {
  const color = profile.tone === 'child' ? 'var(--cyan)' : profile.tone === 'teen' ? 'var(--orange)' : 'var(--ink-soft)';
  return `<span class="profile-chip">
    <span class="profile-chip__dot" style="background:${color}">${profile.initial}</span>
    ${profile.label[lang] || profile.label.fr}
  </span>`;
}

/** @deprecated */
export const profileBadge = profileChip;

export function stepRail(current, total) {
  const items = Array.from({ length: total }, (_, i) => {
    let cls = 'step-rail__item';
    if (i < current - 1) cls += ' step-rail__item--done';
    else if (i === current - 1) cls += ' step-rail__item--active';
    return `<div class="${cls}"></div>`;
  }).join('');
  return `<div class="step-rail">${items}</div>`;
}

export function btn({ variant = 'primary', block = false, lg = false, text = '', id = '', attrs = '' } = {}) {
  const cls = ['btn', `btn--${variant}`, block ? 'btn--block' : '', lg ? 'btn--lg' : ''].filter(Boolean).join(' ');
  return `<button class="${cls}" ${id ? `id="${id}"` : ''} ${attrs}>${text}</button>`;
}

export function progressBar() {
  return '';
}

let toastContainer = null;

export function showToast(msg, level = 'info', duration = 3400) {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  const el = document.createElement('div');
  el.className = `toast toast--${level}`;
  el.textContent = msg;
  toastContainer.appendChild(el);
  setTimeout(() => el.remove(), duration);
}

export function clearToasts() {
  if (toastContainer) toastContainer.innerHTML = '';
}

export function helpBubble(level, lang) {
  const msg = level === 1 ? t(lang, 'needHelp') : t(lang, 'inactivity40');
  return `
    <div class="help-bubble" data-help-level="${level}">
      <span>${msg}</span>
      <div class="help-bubble__actions">
        ${level === 1 ? `
          <button class="btn btn--primary" data-action="aide_oui" style="min-height:36px;padding:0 14px;font-size:13px">${t(lang, 'yesHelp')}</button>
          <button class="btn btn--ghost" data-action="aide_non" style="min-height:36px;padding:0 14px;font-size:13px">${t(lang, 'noThanks')}</button>
        ` : ''}
      </div>
    </div>`;
}

export function loader(label = '') {
  return `
    <div class="loader-wrap">
      <div class="loader-orbit">
        <div class="loader-orbit__ring"></div>
        ${brandMark('md')}
      </div>
      ${label ? `<div class="loader-label">${label}</div>` : ''}
    </div>`;
}

export function barChart(data, accent = 'var(--orange)') {
  const max = Math.max(...data.map((d) => d.value), 1);
  return `<div class="chart-bars">${data.map((d) => `
    <div class="chart-bar-row">
      <span class="chart-bar-label">${d.label}</span>
      <div class="chart-bar-track">
        <div class="chart-bar-fill" style="width:${Math.round(d.value / max * 100)}%;background:${accent}"></div>
      </div>
      <span class="chart-bar-value">${d.value}</span>
    </div>`).join('')}</div>`;
}

export function donutChart(data) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let offset = 0;
  const r = 50;
  const cx = 60;
  const cy = 60;
  const circum = 2 * Math.PI * r;
  const segments = data.map((d) => {
    const pct = d.value / total;
    const dash = pct * circum;
    const seg = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${d.color || 'var(--orange)'}"
      stroke-width="18" stroke-dasharray="${dash} ${circum - dash}" stroke-dashoffset="${-offset}"
      transform="rotate(-90 ${cx} ${cy})"/>`;
    offset += dash;
    return seg;
  }).join('');
  const legend = data.map((d) =>
    `<div style="display:flex;align-items:center;gap:8px;font-size:12px;margin:4px 0;font-weight:500">
      <span style="width:10px;height:10px;border:2px solid var(--ink);border-radius:2px;background:${d.color || 'var(--orange)'}"></span>
      ${d.label} (${d.value})
    </div>`).join('');
  return `<div style="display:flex;gap:20px;align-items:center;flex-wrap:wrap">
    <svg width="120" height="120" viewBox="0 0 120 120">${segments}</svg>
    <div>${legend}</div>
  </div>`;
}

export function lineChart(data) {
  const max = Math.max(...data.map((d) => d.v), 1);
  const w = 280;
  const h = 80;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (d.v / max) * h;
    return `${x},${y}`;
  }).join(' ');
  const labels = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    return `<text x="${x}" y="${h + 16}" text-anchor="middle" font-size="10" fill="var(--ink-faint)" font-family="IBM Plex Mono">${d.d}</text>`;
  }).join('');
  return `<svg width="${w}" height="${h + 20}" viewBox="0 0 ${w} ${h + 20}">
    <polyline points="${pts}" fill="none" stroke="var(--cyan)" stroke-width="3" stroke-linejoin="round"/>
    ${data.map((d, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - (d.v / max) * h;
      return `<rect x="${x - 4}" y="${y - 4}" width="8" height="8" fill="var(--orange)" stroke="var(--ink)" stroke-width="1"/>`;
    }).join('')}
    ${labels}
  </svg>`;
}

export function metric(value, label, accent = 'var(--orange)') {
  return `<div class="metric">
    <div class="metric__value" style="color:${accent}">${value}</div>
    <div class="metric__label">${label}</div>
  </div>`;
}

export function genererFichePDF(recoKey, profile, answers, lang) {
  const reco = getReco(recoKey, lang) || {};
  const prof = PROFILES.find((p) => p.id === profile);
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${t(lang, 'recommended')}</title>
    <style>body{font-family:sans-serif;padding:40px;color:#121820}h1{color:#E87722}</style></head><body>
    <h1>${reco.track || ''}</h1><p>${reco.tag || ''}</p>
    <p><strong>${t(lang, 'colProfile')} :</strong> ${prof?.label[lang] || profile}</p>
    <ol>${(reco.steps || []).map((s) => `<li>${s}</li>`).join('')}</ol>
    <p>${reco.club || ''}</p>
  </body></html>`;
}

export function renderToken(tk) {
  const typeMap = { verbe: 'verbe', objet: 'objet', article: 'article', complement: 'complement', prep: 'article', filtre: 'complement', nombre: 'complement', inconnu: 'inconnu' };
  const cls = typeMap[tk.type] || 'inconnu';
  return `<span class="token token--${cls}">
    <span class="token__word">${tk.value}</span>
    <span class="token__label">${tk.type === 'inconnu' ? 'inconnu' : tk.type}</span>
  </span>`;
}

export function renderTokens(tokens) {
  return tokens.map(renderToken).join('');
}

export function exportCSV(rows, filename = 'export.csv') {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function showCountdown(seconds, msg, onDone) {
  let remaining = seconds;
  const overlay = document.createElement('div');
  overlay.className = 'countdown-overlay';
  overlay.innerHTML = `<div class="countdown-overlay__num">${remaining}</div><div class="countdown-overlay__msg">${msg}</div>`;
  document.body.appendChild(overlay);
  const interval = setInterval(() => {
    remaining--;
    overlay.querySelector('.countdown-overlay__num').textContent = remaining;
    if (remaining <= 0) {
      clearInterval(interval);
      overlay.remove();
      onDone?.();
    }
  }, 1000);
}
