/* ============================================================
   KebaCode CCC — Clavier visuel flottant (focus uniquement)
   Majuscules / minuscules · caractères spéciaux
   ============================================================ */

const ACCENTS_LOWER = ['é', 'è', 'ê', 'à', 'ù', 'ç', 'î', 'ï', 'ö', 'ü'];
const ACCENTS_UPPER = ['É', 'È', 'Ê', 'À', 'Ù', 'Ç', 'Î', 'Ï', 'Ö', 'Ü'];

const SYMBOL_ROWS = [
  ['@', '#', '$', '%', '&', '*', '(', ')', '-', '+'],
  ['=', '/', '\\', '|', ':', ';', '"', "'", ',', '.'],
  ['?', '!', '[', ']', '{', '}', '~', '^', '_', '`'],
  ['«', '»', '…', '°', '§', '€', '•', '<', '>', '×'],
];

const DIGITS = '0123456789'.split('');

let container = null;
let keysEl = null;
let resizeObserver = null;
let activeInput = null;
let hideTimer = null;
let currentLayout = 'text';
let letterCase = 'lower';
let symbolPanel = false;

function isVkTarget(el) {
  if (!el || el.disabled) return false;
  if (el.tagName === 'TEXTAREA') return true;
  if (el.tagName === 'INPUT') {
    const type = (el.type || 'text').toLowerCase();
    return ['text', 'email', 'password', 'search'].includes(type);
  }
  return false;
}

function resolveLayout(el) {
  const vk = el.dataset.vk;
  if (vk) return vk;
  if (el.type === 'email') return 'email';
  if (el.id === 'formateur-input') return 'command';
  return 'text';
}

function isDarkContext(el) {
  return !!el.closest('.formateur-screen, .auth-formateur, .screen--dark');
}

function isUpper() {
  return letterCase === 'upper';
}

function letterRows() {
  const up = isUpper();
  return [
    (up ? 'AZERTYUIOP' : 'azertyuiop').split(''),
    (up ? 'QSDFGHJKLM' : 'qsdfghjklm').split(''),
  ];
}

function accentRow() {
  return isUpper() ? [...ACCENTS_UPPER] : [...ACCENTS_LOWER];
}

function escAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function keyBtn(label, action, { span = 1, active = false, cls = '' } = {}) {
  const activeCls = active ? ' vk-key--active' : '';
  const extra = cls ? ` ${cls}` : '';
  return `<button type="button" class="vk-key${activeCls}${extra}" data-vk-action="${action}" style="grid-column:span ${span}">${label}</button>`;
}

function charBtn(char) {
  return `<button type="button" class="vk-key" data-key="${escAttr(char)}">${char}</button>`;
}

function renderLetterPanel(layout) {
  const rows = letterRows();
  const acc = accentRow();

  let html = '';
  html += rows[0].map(charBtn).join('');
  html += rows[1].map(charBtn).join('');

  html += keyBtn(isUpper() ? '⇩ min' : '⇧ MAJ', 'shift', { span: 2, active: isUpper() });
  html += (isUpper() ? 'WXCVBN' : 'wxcvbn').split('').map(charBtn).join('');
  html += keyBtn('⌫', 'backspace', { span: 2 });

  html += keyBtn('#@&', 'symbols', { span: 2, active: symbolPanel });
  html += acc.slice(0, 8).map(charBtn).join('');

  html += acc.slice(8, 10).map(charBtn).join('');
  html += ["'", '-', '_', '.', ',', ';', ':', '!'].map(charBtn).join('');

  html += DIGITS.map(charBtn).join('');

  if (layout === 'email') {
    html += ['@', '.', '+', '='].map(charBtn).join('');
    html += keyBtn('Espace', 'space', { span: 4 });
    html += keyBtn('↵', 'enter', { span: 2, cls: 'vk-key--enter' });
  } else if (layout === 'command') {
    html += keyBtn('↵', 'enter', { span: 2, cls: 'vk-key--enter' });
    html += keyBtn('Espace', 'space', { span: 6 });
    html += ['(', ')'].map(charBtn).join('');
  } else {
    html += keyBtn('Espace', 'space', { span: 8 });
    html += keyBtn('↵', 'enter', { span: 2, cls: 'vk-key--enter' });
  }

  return html;
}

function renderSymbolPanel(layout) {
  let html = SYMBOL_ROWS.map((row) => row.map(charBtn).join('')).join('');

  html += keyBtn('ABC', 'letters', { span: 2, active: true, cls: 'vk-key--mode' });
  html += ['@', '#', '€', '°', '…', '«', '»', '•'].map(charBtn).join('');

  html += DIGITS.map(charBtn).join('');

  if (layout === 'command') {
    html += keyBtn('↵', 'enter', { span: 2, cls: 'vk-key--enter' });
    html += keyBtn('Espace', 'space', { span: 6 });
    html += keyBtn('⌫', 'backspace', { span: 2 });
  } else if (layout === 'email') {
    html += ['@', '.'].map(charBtn).join('');
    html += keyBtn('Espace', 'space', { span: 6 });
    html += keyBtn('⌫', 'backspace', { span: 2 });
  } else {
    html += keyBtn('Espace', 'space', { span: 8 });
    html += keyBtn('⌫', 'backspace', { span: 2 });
  }

  return html;
}

function renderKeys(layout) {
  if (!keysEl) return;
  currentLayout = layout;
  keysEl.innerHTML = symbolPanel
    ? renderSymbolPanel(layout)
    : renderLetterPanel(layout);
  scheduleOffsetUpdate();
}

function setVkOffset(px) {
  document.documentElement.style.setProperty('--vk-offset', `${Math.max(0, Math.round(px))}px`);
}

function measureAndApplyOffset() {
  if (!container?.classList.contains('vk-visible')) {
    setVkOffset(0);
    return;
  }
  const h = container.getBoundingClientRect().height;
  setVkOffset(h);
  if (activeInput) scrollInputIntoView(activeInput);
}

let offsetFrame = null;
function scheduleOffsetUpdate() {
  cancelAnimationFrame(offsetFrame);
  offsetFrame = requestAnimationFrame(() => {
    offsetFrame = requestAnimationFrame(measureAndApplyOffset);
  });
}

function findScrollParent(el) {
  let parent = el.parentElement;
  while (parent && parent !== document.body) {
    const style = getComputedStyle(parent);
    const scrollable = style.overflowY === 'auto' || style.overflowY === 'scroll';
    if (scrollable && parent.scrollHeight > parent.clientHeight) return parent;
    parent = parent.parentElement;
  }
  return null;
}

function scrollInputIntoView(el) {
  if (el.dataset.vkScroll === 'minimal' || el.id === 'nom-input') return;

  const kbOffset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--vk-offset')) || 0;
  if (kbOffset <= 0) return;

  const margin = 12;
  const maxBottom = window.innerHeight - kbOffset - margin;
  const rect = el.getBoundingClientRect();

  if (rect.top >= margin && rect.bottom <= maxBottom) return;

  const scrollEl = findScrollParent(el);
  if (scrollEl) {
    if (rect.bottom > maxBottom) {
      scrollEl.scrollTop += rect.bottom - maxBottom;
    }
    return;
  }

  if (rect.bottom > maxBottom) {
    el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}

function insertAtCursor(input, text) {
  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? input.value.length;
  input.value = `${input.value.slice(0, start)}${text}${input.value.slice(end)}`;
  const pos = start + text.length;
  input.setSelectionRange(pos, pos);
}

function applyKey(input, key) {
  if (key === 'backspace') {
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    if (start !== end) {
      input.value = input.value.slice(0, start) + input.value.slice(end);
      input.setSelectionRange(start, start);
    } else if (start > 0) {
      input.value = input.value.slice(0, start - 1) + input.value.slice(start);
      input.setSelectionRange(start - 1, start - 1);
    }
    return;
  }

  if (key === 'enter') {
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    return;
  }

  insertAtCursor(input, key);
}

function emitInput() {
  if (!activeInput) return;
  activeInput.focus();
  activeInput.dispatchEvent(new Event('input', { bubbles: true }));
}

function handleAction(action) {
  switch (action) {
    case 'shift':
      letterCase = letterCase === 'lower' ? 'upper' : 'lower';
      renderKeys(currentLayout);
      break;
    case 'symbols':
      symbolPanel = true;
      renderKeys(currentLayout);
      break;
    case 'letters':
      symbolPanel = false;
      renderKeys(currentLayout);
      break;
    case 'backspace':
      if (activeInput) applyKey(activeInput, 'backspace');
      emitInput();
      break;
    case 'space':
      if (activeInput) applyKey(activeInput, ' ');
      emitInput();
      break;
    case 'enter':
      if (activeInput) applyKey(activeInput, 'enter');
      break;
    default:
      break;
  }
}

function showKeyboard(el) {
  clearTimeout(hideTimer);
  activeInput = el;
  letterCase = 'lower';
  symbolPanel = false;
  renderKeys(resolveLayout(el));

  container.classList.toggle('vk-container--dark', isDarkContext(el));
  container.classList.remove('vk-animate');
  void container.offsetWidth;
  container.classList.add('vk-visible', 'vk-animate');
  container.setAttribute('aria-hidden', 'false');

  document.body.classList.add('vk-open');
  scheduleOffsetUpdate();
}

function hideKeyboard() {
  container.classList.remove('vk-visible', 'vk-animate');
  container.setAttribute('aria-hidden', 'true');
  setVkOffset(0);
  document.body.classList.remove('vk-open');
  activeInput = null;
  symbolPanel = false;
  letterCase = 'lower';
}

function onFocusIn(e) {
  if (!isVkTarget(e.target)) return;
  showKeyboard(e.target);
}

function onFocusOut(e) {
  if (!isVkTarget(e.target)) return;
  hideTimer = setTimeout(() => {
    if (document.activeElement === activeInput) return;
    if (container.contains(document.activeElement)) return;
    hideKeyboard();
  }, 120);
}

function onKeyClick(e) {
  const btn = e.target.closest('.vk-key');
  if (!btn || !activeInput) return;

  const action = btn.dataset.vkAction;
  if (action) {
    handleAction(action);
    if (!['backspace', 'space', 'enter'].includes(action)) activeInput.focus();
    return;
  }

  const key = btn.dataset.key;
  if (!key) return;
  if (key === '×') {
    handleAction('letters');
    activeInput.focus();
    return;
  }

  applyKey(activeInput, key);
  emitInput();
}

/** Initialise le clavier global (une seule instance, body) */
export function initVirtualKeyboard() {
  if (container) return;

  container = document.createElement('div');
  container.className = 'vk-container';
  container.setAttribute('aria-hidden', 'true');
  container.innerHTML = `
    <div class="vk-panel" data-action-stop>
      <div class="vk-keys"></div>
    </div>`;

  keysEl = container.querySelector('.vk-keys');
  document.body.appendChild(container);

  resizeObserver = new ResizeObserver(() => scheduleOffsetUpdate());
  resizeObserver.observe(container);

  container.addEventListener('mousedown', (e) => {
    if (e.target.closest('.vk-key')) e.preventDefault();
  });
  container.addEventListener('click', onKeyClick);

  document.addEventListener('focusin', onFocusIn, true);
  document.addEventListener('focusout', onFocusOut, true);
}

/** Masque le clavier (ex. changement d'écran) */
export function hideVirtualKeyboard() {
  clearTimeout(hideTimer);
  hideKeyboard();
}
