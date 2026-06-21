/* ============================================================
   KebaCode CCC — Écran conversation (style dialogue)
   ============================================================ */

import { t } from '../data.js';
import { getCurrentNode, resolveMessage, resolveChoiceLabel, estimateProgress } from '../conversation.js';
import { renderIllustration } from '../illustrations.js';
import { headerBar, dockBar, stepRail, btn } from '../ui.js';

const BOT_NAME = 'Keba';

function botAvatar() {
  return `<div class="chat-avatar chat-avatar--bot" aria-hidden="true">K</div>`;
}

function userAvatar(initial) {
  return `<div class="chat-avatar chat-avatar--user" aria-hidden="true">${initial || '?'}</div>`;
}

function renderBubble(msg, profile, userName) {
  const isBot = msg.role === 'bot';
  const initial = userName ? userName.charAt(0).toUpperCase() : '?';
  const illus = isBot && msg.illustration && profile !== 'enfant'
    ? renderIllustration(msg.illustration) : '';

  return `<div class="chat-row chat-row--${isBot ? 'bot' : 'user'}">
    ${isBot ? botAvatar() : ''}
    <div class="chat-bubble-wrap">
      ${isBot ? `<span class="chat-sender">${BOT_NAME}</span>` : ''}
      <div class="chat-bubble chat-bubble--${isBot ? 'bot' : 'user'}">${msg.text}</div>
      ${illus}
    </div>
    ${!isBot ? userAvatar(initial) : ''}
  </div>`;
}

function renderHistory(conv, profile, userName) {
  const display = [];
  conv.history.forEach((h) => {
    const node = conv.graph[h.nodeId];
    display.push({
      role: h.role,
      text: h.text,
      illustration: h.role === 'bot' && node ? node.illustration : null,
    });
  });
  return display.map((m) => renderBubble(m, profile, userName)).join('');
}

function renderChoices(node, conv, lang, tone) {
  if (!node?.choices?.length) return '';

  return `<div class="chat-replies" data-action-stop>
    ${node.choices.map((c) => {
      const label = resolveChoiceLabel(c, node, conv, tone);
      return `<button class="chat-reply" data-action="conv_choix" data-choice-id="${c.id}">${label}</button>`;
    }).join('')}
  </div>`;
}

function renderOpenInput(node, lang, draft = '') {
  return `<div class="chat-open" data-action-stop>
    <textarea class="chat-open__input" id="conv-open-input" rows="2"
      placeholder="${t(lang, 'yourAnswer')}" data-vk="text" data-action-input="conv_open">${draft}</textarea>
    <button class="chat-open__send btn btn--primary" data-action="conv_envoyer" id="btn-conv-send"
      ${draft.trim() ? '' : 'disabled'}>${t(lang, 'sendReply')}</button>
  </div>`;
}

export function renderEnquete(state) {
  const lang = state.lang;
  const conv = state.conversation;
  const profile = state.profile;
  const tone = profile === 'enfant' ? 'child' : profile === 'ado' ? 'teen' : 'adult';
  const toneCls = profile === 'enfant' ? 'tone-child' : profile === 'ado' ? 'tone-teen' : 'tone-adult';
  const node = conv ? getCurrentNode(conv) : null;
  const progress = conv ? estimateProgress(conv) : 0;
  const isChild = profile === 'enfant';

  const activeIllus = isChild && node?.illustration && !conv?.history.some((h) => h.nodeId === node.id && h.role === 'bot')
    ? renderIllustration(node.illustration)
    : '';

  const currentBotText = node && !node.autoNext ? resolveMessage(node, conv, tone) : '';
  const showCurrentQuestion = node && currentBotText &&
    !conv.history.some((h) => h.nodeId === node.id && h.role === 'bot' && h.text === currentBotText);

  let footerHtml = '';
  if (node?.kind === 'open') {
    footerHtml = renderOpenInput(node, lang, state.openDraft || '');
  } else if (node?.choices) {
    footerHtml = renderChoices(node, conv, lang, tone);
  }

  return `
    <div class="screen chat-screen fade-enter ${toneCls}">
      ${headerBar({ lang, profile, userName: state.userName, online: state.online, etat: state.etat, title: '04 · Discussion' })}
      ${stepRail(4, 4)}
      <div class="chat-progress">
        <div class="chat-progress__fill" style="width:${progress}%"></div>
        <span class="chat-progress__label">${t(lang, 'chatProgress')}</span>
      </div>
      <div class="chat-layout ${isChild ? 'chat-layout--child' : ''}">
        ${isChild ? `<aside class="chat-visual-panel">${activeIllus || (node?.illustration ? renderIllustration(node.illustration) : '')}</aside>` : ''}
        <div class="chat-main scroll-y" id="chat-thread">
          <div class="chat-thread-inner">
            ${conv ? renderHistory(conv, profile, state.userName) : ''}
            ${showCurrentQuestion ? renderBubble({ role: 'bot', text: currentBotText, illustration: node.illustration }, profile, state.userName) : ''}
          </div>
        </div>
      </div>
      <div class="chat-footer">
        ${footerHtml}
        ${node ? '' : btn({ variant: 'primary', block: true, text: t(lang, 'finishChat'), attrs: 'data-action="terminer_conversation"' })}
      </div>
      ${dockBar({ lang, online: state.online })}
    </div>`;
}

export function scrollChatToBottom() {
  requestAnimationFrame(() => {
    const el = document.getElementById('chat-thread');
    if (el) el.scrollTop = el.scrollHeight;
  });
}

export function updateSendButton(hasText) {
  const btnEl = document.getElementById('btn-conv-send');
  if (btnEl) btnEl.disabled = !hasText;
}
