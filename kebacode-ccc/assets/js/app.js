/* ============================================================
   KebaCode CCC — Orchestrateur principal
   ============================================================ */

import { SESSION_KEY } from './config.js';
import { FSM, ETATS, InactivityManager } from './engine.js';
import { t, getToneKey, recommander } from './data.js';
import {
  initConversation, bootstrapConversation, applyChoice, restoreConversation,
} from './conversation.js';
import { render, showToast, helpBubble, genererFichePDF, showCountdown } from './ui.js';
import { tokenize } from './lexer.js';
import { parse } from './parser.js';
import {
  initSupabase, isOffline, setOffline, syncOfflineData,
  creerSession, sauvegarderProgression,
  enregistrerReponse, journaliserCommande, journaliserErreur,
  creerUtilisateur, lierSessionUtilisateur, enregistrerRecommandation,
  finaliserSession,
  authentifierFormateur, restaurerAuthFormateur, deconnecterFormateur,
} from './supabase.js';

import { renderAccueil } from './screens/accueil.js';
import { renderChoixRole } from './screens/choix-role.js';
import { renderNom, updateNomButton } from './screens/nom.js';
import { renderVille, updateVilleButton } from './screens/ville.js';
import { renderProfil } from './screens/profil.js';
import { renderEnquete, scrollChatToBottom, updateSendButton } from './screens/enquete.js';
import { renderAnalyse, ANALYSE_DELAY } from './screens/analyse.js';
import { renderRecommandation } from './screens/recommandation.js';
import { renderAuthFormateur, updateAuthSubmitButton } from './screens/auth-formateur.js';
import {
  renderFormateur, submitCommand, getFormateurState,
  resetFormateurState, updateFormateurLivePreview,
  saveQuestionFromForm, saveModifyQuestionFromForm,
} from './screens/formateur.js';
import { renderStatistiques, doExportCSV } from './screens/statistiques.js';
import { fetchParticipants, computeStatsFromParticipants, participantsToCSV } from './participants.js';
import { renderFin, FIN_DELAY } from './screens/fin.js';
import { initVirtualKeyboard, hideVirtualKeyboard } from './virtual-keyboard.js';

// Expose pour debug console
window.__CCC_LEXER = { tokenize };
window.__CCC_PARSER = { parse };

class App {
  constructor() {
    this.fsm = new FSM();
    this.inactivity = new InactivityManager();
    this.state = {
      lang: 'fr',
      etat: ETATS.ACCUEIL,
      profile: null,
      userName: '',
      ville: '',
      utilisateurId: null,
      answers: [],
      conversation: null,
      openDraft: '',
      sessionId: null,
      recoResult: null,
      helpLevel: 0,
      online: navigator.onLine,
      savedSession: null,
      questionStartTime: null,
      participantsData: null,
      participantsFilter: '',
      participantsStats: null,
      formateur: null,
      authError: '',
      authLoading: false,
      authEmailDraft: '',
      authPasswordDraft: '',
      authFocusField: 'email',
      authShowPassword: false,
    };
    this._analyseTimer = null;
    this._finTimer = null;
  }

  async init() {
    initSupabase();

    window.addEventListener('online', () => {
      this.state.online = true;
      setOffline(false);
      syncOfflineData();
      showToast(t(this.state.lang, 'online'), 'save');
      this.render();
    });
    window.addEventListener('offline', () => {
      this.state.online = false;
      setOffline(true);
      showToast(t(this.state.lang, 'offline'), 'warning');
      this.render();
    });

    const saved = this.fsm.restaurer();
    if (saved?.contexte) {
      this.state = { ...this.state, ...saved.contexte, savedSession: saved };
      if (saved.contexte.conversation) {
        this.state.conversation = restoreConversation(saved.contexte.conversation, this.state.lang);
        this.state.answers = this.state.conversation?.answers || [];
      }
    } else {
      try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (raw) {
          const data = JSON.parse(raw);
          if (data.contexte) this.state.savedSession = data;
        }
      } catch (_) { /* ignorer */ }
    }

    const auth = restaurerAuthFormateur();
    if (auth) this.state.formateur = auth;

    initVirtualKeyboard();
    this.setupEventListeners();
    this.render();
    this.startInactivity();
  }

  render() {
    hideVirtualKeyboard();
    this.state.etat = this.fsm.etat;
    const s = this.state;

    switch (this.fsm.etat) {
      case ETATS.ACCUEIL:
        render(renderAccueil(s));
        break;
      case ETATS.CHOIX_MODE:
        render(renderChoixRole(s));
        break;
      case ETATS.SAISIE_NOM:
        render(renderNom(s));
        updateNomButton();
        break;
      case ETATS.SAISIE_VILLE:
        render(renderVille(s));
        updateVilleButton();
        break;
      case ETATS.IDENTIFICATION_PROFIL:
        render(renderProfil(s));
        break;
      case ETATS.ENQUETE:
        render(renderEnquete(s));
        scrollChatToBottom();
        break;
      case ETATS.ANALYSE_REPONSES:
        render(renderAnalyse(s));
        break;
      case ETATS.RECOMMANDATION:
        render(renderRecommandation(s));
        break;
      case ETATS.AUTH_FORMATEUR:
        render(renderAuthFormateur(s));
        updateAuthSubmitButton();
        break;
      case ETATS.MODE_FORMATEUR:
      case ETATS.ANALYSE_COMMANDE:
        if (!this.requireFormateurAuth()) break;
        render(renderFormateur(s));
        this.focusFormateurInput();
        break;
      case ETATS.STATISTIQUES:
        render(renderStatistiques(s));
        break;
      case ETATS.FIN_SESSION:
        render(renderFin(s));
        break;
      case ETATS.SAUVEGARDE:
        this.doSave();
        break;
      default:
        render(renderAccueil(s));
    }

    this.renderHelpBubble();
  }

  async goTo(event, data = {}) {
    Object.assign(this.state, data);
    const ctx = { etatSauvegarde: this.state.savedSession?.etat };
    this.fsm.transition(event, ctx);
    this.state.etat = this.fsm.etat;

    if (this.fsm.etat === ETATS.ENQUETE && !this.state.conversation) {
      await this.ensureUtilisateur();
      this.startConversation();
    }

    if (this.fsm.etat === ETATS.ANALYSE_REPONSES) {
      this.render();
      clearTimeout(this._analyseTimer);
      this._analyseTimer = setTimeout(async () => {
        this.state.recoResult = recommander(this.state.conversation?.answers || this.state.answers, this.state.profile);
        this.persist();
        if (this.state.sessionId && this.state.recoResult?.key) {
          await enregistrerRecommandation(
            this.state.sessionId,
            this.state.recoResult.key,
            this.state.recoResult.parcoursScores?.[this.state.recoResult.key] || 0,
          );
        }
        this.goTo('terminee');
      }, ANALYSE_DELAY);
      return;
    }

    if (this.fsm.etat === ETATS.FIN_SESSION) {
      this.render();
      clearTimeout(this._finTimer);
      this._finTimer = setTimeout(() => this.resetSession(), FIN_DELAY);
      this.finalizeSessionInDb('terminee');
      return;
    }

    if (this.fsm.etat === ETATS.SAUVEGARDE) {
      await this.doSave();
      this.fsm.transition('ok');
      showToast(t(this.state.lang, 'sessionSaved'), 'save');
      this.render();
      return;
    }

    if (this.fsm.etat === ETATS.STATISTIQUES) {
      this.persist();
      this.render();
      this.loadParticipantsForStats(this.state.participantsFilter || '');
      this.inactivity.bump();
      this.startInactivity();
      return;
    }

    this.persist();
    this.render();
    this.inactivity.bump();
    this.startInactivity();
  }

  async doSave() {
    const payload = {
      etat: this.fsm.etat,
      contexte: this.buildContexte(),
    };
    this.fsm.sauvegarder(payload.contexte);
    if (this.state.sessionId) {
      await sauvegarderProgression(this.state.sessionId, this.fsm.etat, payload.contexte);
    }
  }

  buildContexte() {
    const conv = this.state.conversation;
    return {
      ...this.state,
      sessionId: this.state.sessionId,
      conversation: conv ? {
        profileId: conv.profileId,
        lang: conv.lang || this.state.lang,
        currentNodeId: conv.currentNodeId,
        traits: conv.traits,
        history: conv.history,
        answers: conv.answers,
      } : null,
      formateur: this.state.formateur ? {
        id: this.state.formateur.id,
        email: this.state.formateur.email,
        prenom: this.state.formateur.prenom,
        nom: this.state.formateur.nom,
      } : null,
    };
  }

  async persistToDb() {
    if (!this.state.sessionId || isOffline()) return;
    const ctx = this.buildContexte();
    await sauvegarderProgression(this.state.sessionId, this.fsm.etat, ctx);
  }

  async ensureSession() {
    if (this.state.sessionId) return;
    const ctx = this.buildContexte();
    const { data, error } = await creerSession(null, null, 'public', ctx);
    if (data?.id) {
      this.state.sessionId = data.id;
      this.persist();
    } else if (error) {
      console.warn('[App] Erreur création session:', error);
    }
  }

  async ensureUtilisateur() {
    if (this.state.utilisateurId || !this.state.sessionId) return;
    const { data, error } = await creerUtilisateur(
      this.state.userName || 'Anonyme',
      this.state.ville,
      this.state.profile,
    );
    if (data?.id) {
      this.state.utilisateurId = data.id;
      await lierSessionUtilisateur(this.state.sessionId, data.id);
      this.persist();
    } else if (error) {
      console.warn('[App] Erreur création utilisateur:', error);
    }
  }

  async finalizeSessionInDb(statut = 'terminee') {
    await this.persistToDb();
    if (!this.state.sessionId) return;
    const ctx = this.buildContexte();
    await finaliserSession(this.state.sessionId, this.fsm.etat, ctx, statut);
    if (this.state.recoResult?.key) {
      await enregistrerRecommandation(
        this.state.sessionId,
        this.state.recoResult.key,
        this.state.recoResult.parcoursScores?.[this.state.recoResult.key] || 0,
      );
    }
  }

  persist() {
    const ctx = this.buildContexte();
    this.fsm.sauvegarder(ctx);
    this.persistToDb();
  }

  resetSession() {
    clearTimeout(this._analyseTimer);
    clearTimeout(this._finTimer);
    localStorage.removeItem(SESSION_KEY);
    deconnecterFormateur();
    resetFormateurState();
    this.state = {
      lang: this.state.lang,
      etat: ETATS.ACCUEIL,
      profile: null,
      userName: '',
      ville: '',
      utilisateurId: null,
      answers: [],
      conversation: null,
      openDraft: '',
      sessionId: null,
      recoResult: null,
      helpLevel: 0,
      online: navigator.onLine,
      savedSession: null,
      questionStartTime: null,
      participantsData: null,
      participantsFilter: '',
      participantsStats: null,
      formateur: null,
      authError: '',
      authLoading: false,
      authEmailDraft: '',
      authPasswordDraft: '',
      authFocusField: 'email',
      authShowPassword: false,
    };
    this.fsm.reset();
    this.inactivity.stop();
    this.render();
    this.startInactivity();
  }

  startInactivity() {
    const skip = [ETATS.ACCUEIL, ETATS.CHOIX_MODE, ETATS.AUTH_FORMATEUR, ETATS.MODE_FORMATEUR, ETATS.ANALYSE_COMMANDE, ETATS.STATISTIQUES, ETATS.FIN_SESSION, ETATS.ANALYSE_REPONSES];
    if (skip.includes(this.fsm.etat)) {
      this.inactivity.stop();
      return;
    }

    this.inactivity.start(this.fsm.etat, {
      onAide: () => {
        this.state.helpLevel = 1;
        this.renderHelpBubble();
      },
      onReformuler: () => {
        this.state.helpLevel = 2;
        this.renderHelpBubble();
      },
      onSauvegarder: async () => {
        await this.doSave();
        showToast(t(this.state.lang, 'sessionSaved'), 'save');
      },
      onFermer: () => {
        showCountdown(3, t(this.state.lang, 'finSub'), () => this.resetSession());
      },
    });
  }

  requireFormateurAuth() {
    if (!this.state.formateur) {
      const auth = restaurerAuthFormateur();
      if (auth) this.state.formateur = auth;
    }
    if (!this.state.formateur) {
      this.fsm.forcerEtat(ETATS.AUTH_FORMATEUR);
      this.render();
      return false;
    }
    return true;
  }

  async ensureFormateurSession() {
    if (this.state.sessionId) {
      await sauvegarderProgression(this.state.sessionId, this.fsm.etat, this.buildContexte());
      return;
    }
    const { data, error } = await creerSession(null, null, 'formateur', this.buildContexte());
    if (data?.id) {
      this.state.sessionId = data.id;
      this.persist();
    } else if (error) {
      console.warn('[App] Erreur session formateur:', error);
    }
  }

  renderHelpBubble() {
    const existing = document.querySelector('.help-bubble');
    if (existing) existing.remove();
    if (!this.state.helpLevel) return;
    const bubble = document.createElement('div');
    bubble.innerHTML = helpBubble(this.state.helpLevel, this.state.lang);
    const el = bubble.firstElementChild;
    if (el) document.body.appendChild(el);
  }

  bump() {
    this.state.helpLevel = 0;
    const bubble = document.querySelector('.help-bubble');
    if (bubble) bubble.remove();
    this.inactivity.bump();
  }

  pushToast(msg, level = 'info') {
    showToast(msg, level);
  }

  startConversation() {
    this.state.conversation = initConversation(this.state.profile, this.state.userName, this.state.lang);
    const tone = getToneKey(this.state.profile);
    bootstrapConversation(this.state.conversation, tone);
    this.state.answers = this.state.conversation.answers;
    this.state.questionStartTime = Date.now();
  }

  getConvTone() {
    return getToneKey(this.state.profile);
  }

  focusFormateurInput(preserveCursor = true) {
    requestAnimationFrame(() => {
      const input = document.getElementById('formateur-input');
      if (input) {
        const pos = preserveCursor ? input.value.length : 0;
        input.focus();
        input.setSelectionRange(pos, pos);
      }
      const out = document.getElementById('formateur-output');
      if (out) out.scrollTop = out.scrollHeight;
    });
  }

  setupEventListeners() {
    const root = document.getElementById('root');
    root.addEventListener('click', (e) => this.handleEvent(e));
    root.addEventListener('input', (e) => this.handleInput(e));
    root.addEventListener('keydown', (e) => this.handleKeydown(e));
    document.body.addEventListener('click', (e) => {
      if (e.target.closest('[data-action="aide_oui"]')) { this.bump(); this.state.helpLevel = 0; }
      if (e.target.closest('[data-action="aide_non"]')) { this.bump(); this.state.helpLevel = 0; const b = document.querySelector('.help-bubble'); if (b) b.remove(); }
    });
  }

  handleInput(e) {
    this.bump();
    const action = e.target.dataset.actionInput;

    if (action === 'saisie_nom') {
      this.state.userName = e.target.value;
      updateNomButton();
    }
    if (action === 'auth_email') {
      this.state.authEmailDraft = e.target.value;
      this.state.authFocusField = 'email';
      this.state.authError = '';
      updateAuthSubmitButton();
    }
    if (action === 'auth_password') {
      this.state.authPasswordDraft = e.target.value;
      this.state.authFocusField = 'password';
      this.state.authError = '';
      updateAuthSubmitButton();
    }
    if (action === 'formateur_input') {
      updateFormateurLivePreview();
    }
    if (action === 'conv_open') {
      this.state.openDraft = e.target.value;
      updateSendButton(!!e.target.value.trim());
    }
  }

  handleKeydown(e) {
    if (e.target.id === 'formateur-input' && e.key === 'Enter') {
      e.preventDefault();
      this.handleFormateurSubmit(e.target.value);
    }
    if (e.target.id === 'formateur-input' && e.key === 'ArrowUp') {
      e.preventDefault();
      e.target.value = getFormateurState().lastCmd || '';
      updateFormateurLivePreview();
    }
  }

  handleEvent(e) {
    if (e.target.closest('[data-action-stop]') && !e.target.closest('[data-action]')) return;
    this.bump();

    const el = e.target.closest('[data-action]');
    if (!el) return;

    const action = el.dataset.action;
    this.dispatch(action, el);
  }

  dispatch(action, el) {
    switch (action) {
      case 'choisir_langue':
        this.state.lang = el.dataset.lang;
        this.goTo('choisir_langue');
        break;

      case 'retour_accueil':
        this.goTo('retour');
        break;

      case 'demarrer':
        this.goTo('demarrer');
        this.ensureSession();
        break;

      case 'mode_formateur': {
        resetFormateurState();
        this.state.authError = '';
        this.state.authLoading = false;
        const existing = restaurerAuthFormateur();
        if (existing) {
          this.state.formateur = existing;
          this.fsm.forcerEtat(ETATS.MODE_FORMATEUR);
          this.render();
          void this.ensureFormateurSession();
          this.startInactivity();
        } else {
          this.goTo('mode_formateur');
        }
        break;
      }

      case 'retour_auth_formateur':
        this.state.authError = '';
        this.goTo('retour');
        break;

      case 'submit_auth_formateur':
        void this.handleFormateurLogin();
        break;

      case 'auth_focus_email':
        this.state.authFocusField = 'email';
        document.getElementById('auth-email')?.focus();
        break;

      case 'auth_focus_password':
        this.state.authFocusField = 'password';
        document.getElementById('auth-password')?.focus();
        break;

      case 'toggle_auth_password':
        this.state.authShowPassword = !this.state.authShowPassword;
        this.render();
        break;

      case 'deconnexion_formateur':
        deconnecterFormateur();
        this.state.formateur = null;
        this.state.sessionId = null;
        resetFormateurState();
        this.goTo('quitter');
        break;

      case 'quitter_formateur':
        resetFormateurState();
        this.goTo('quitter');
        break;

      case 'reprendre':
        if (this.state.savedSession?.contexte) {
          Object.assign(this.state, this.state.savedSession.contexte);
          if (this.state.conversation) {
            this.state.conversation = restoreConversation(this.state.conversation, this.state.lang);
            this.state.answers = this.state.conversation?.answers || [];
          }
          this.fsm.forcerEtat(this.state.savedSession.etat || ETATS.ENQUETE);
          this.render();
          this.startInactivity();
        }
        break;

      case 'nouvelle_session':
        localStorage.removeItem(SESSION_KEY);
        this.state.savedSession = null;
        this.render();
        break;

      case 'continuer_nom':
        void this.ensureSession().then(() => {
          this.goTo('continuer');
        });
        break;

      case 'skip_nom':
        this.state.userName = t(this.state.lang, 'anonymous') || 'Visiteur';
        this.state.ville = 'Kinshasa';
        void this.ensureSession().then(() => {
          this.goTo('skip');
        });
        break;

      case 'continuer_ville':
        void this.ensureSession().then(() => {
          this.goTo('continuer');
        });
        break;

      case 'retour_ville':
        this.goTo('retour');
        break;

      case 'choisir_ville':
        this.state.ville = el.dataset.ville;
        document.querySelectorAll('.ville-card').forEach((c) => {
          c.classList.toggle('ville-card--active', c.dataset.ville === el.dataset.ville);
        });
        updateVilleButton();
        break;

      case 'retour_profil':
        this.goTo('retour');
        break;

      case 'choisir_profil':
        this.state.profile = el.dataset.profilId;
        this.state.conversation = null;
        this.state.openDraft = '';
        this.goTo('choisir_profil');
        break;

      case 'conv_choix':
        this.handleConvChoice(el.dataset.choiceId);
        break;

      case 'conv_envoyer':
        this.handleConvOpen(document.getElementById('conv-open-input')?.value || '');
        break;

      case 'terminer_conversation':
        this.goTo('terminer');
        break;

      case 'rejoindre_club':
        this.finalizeSessionInDb('terminee');
        this.goTo('rejoindre');
        break;

      case 'recommencer':
        this.resetSession();
        break;

      case 'telecharger_pdf':
        this.downloadPDF();
        break;

      case 'toggle_accordion':
        el.closest('.accordion')?.classList.toggle('accordion--open');
        break;

      case 'voir_stats':
        this.goTo('voir_stats');
        break;

      case 'retour_stats':
        this.goTo('retour');
        break;

      case 'export_csv':
        doExportCSV(this.state.participantsData, this.state.lang);
        showToast('Export CSV généré', 'save');
        break;

      case 'filter_participants':
        this.loadParticipantsForStats(el.dataset.profil || '');
        break;

      case 'export_pdf_stats':
        window.print();
        break;

      case 'cmd_suggestion':
        this.handleFormateurSubmit(el.dataset.cmd);
        break;

      case 'select_theme':
        getFormateurState().selectedTheme = el.dataset.theme;
        if (getFormateurState().modifyMode) {
          getFormateurState().modifyMode.theme = el.dataset.theme;
        }
        break;

      case 'save_question': {
        const text = document.getElementById('add-q-text')?.value?.trim();
        const theme = getFormateurState().selectedTheme || 'Cybersécurité';
        if (text) {
          void saveQuestionFromForm(text, theme, this.state.lang, {
            ...this.formateurCallbacks(),
            onRender: () => this.render(),
          });
        }
        break;
      }

      case 'save_modify_question': {
        const text = document.getElementById('add-q-text')?.value?.trim();
        if (text) {
          void saveModifyQuestionFromForm(text, this.state.lang, {
            ...this.formateurCallbacks(),
            onRender: () => this.render(),
          });
        }
        break;
      }

      case 'cancel_add':
        getFormateurState().addMode = false;
        getFormateurState().modifyMode = null;
        this.render();
        break;

      case 'changer_langue':
        this.state.lang = el.dataset.lang;
        if (this.state.conversation) this.state.conversation.lang = this.state.lang;
        this.render();
        break;

      default:
        break;
    }
  }

  handleConvChoice(choiceId) {
    const conv = this.state.conversation;
    if (!conv) return;

    const tone = this.getConvTone();
    const result = applyChoice(conv, choiceId, tone);
    this.state.answers = conv.answers;
    this.persistAnswer(conv.history.at(-1)?.nodeId);

    if (result.done) {
      this.goTo('terminer');
    } else {
      this.render();
      scrollChatToBottom();
    }
  }

  handleConvOpen(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const conv = this.state.conversation;
    if (!conv) return;

    const tone = this.getConvTone();
    const result = applyChoice(conv, null, tone, trimmed);
    this.state.answers = conv.answers;
    this.state.openDraft = '';
    this.persistAnswer(conv.history.at(-1)?.nodeId);

    if (result.done) {
      this.goTo('terminer');
    } else {
      this.render();
      scrollChatToBottom();
    }
  }

  persistAnswer(nodeId) {
    const ans = this.state.answers[this.state.answers.length - 1];
    const duree = this.state.questionStartTime ? Date.now() - this.state.questionStartTime : 0;
    if (this.state.sessionId && ans) {
      enregistrerReponse(this.state.sessionId, nodeId || ans.questionId, ans.label || ans.value || '', duree);
    }
    this.state.questionStartTime = Date.now();
  }

  async loadParticipantsForStats(profilFilter = '') {
    const filters = profilFilter ? { profil: profilFilter } : {};
    const { data, source } = await fetchParticipants(filters);
    const { data: allData } = await fetchParticipants({});
    this.state.participantsData = data;
    this.state.participantsFilter = profilFilter;
    this.state.participantsSource = source;
    this.state.participantsStats = computeStatsFromParticipants(allData);
    if (this.fsm.etat === ETATS.STATISTIQUES) this.render();
  }

  async handleFormateurLogin() {
    const email = document.getElementById('auth-email')?.value?.trim()
      || this.state.authEmailDraft?.trim();
    const password = document.getElementById('auth-password')?.value
      || this.state.authPasswordDraft || '';

    if (!email || !password) {
      this.state.authError = t(this.state.lang, 'authErrorMissing');
      this.render();
      return;
    }

    this.state.authLoading = true;
    this.state.authEmailDraft = email;
    this.state.authPasswordDraft = password;
    this.state.authError = '';
    this.render();

    const result = await authentifierFormateur(email, password);
    this.state.authLoading = false;

    if (!result.ok) {
      this.state.authError = result.message || t(this.state.lang, 'authErrorInvalid');
      this.render();
      return;
    }

    this.state.formateur = result.data;
    this.state.authError = '';
    this.state.authPasswordDraft = '';
    showToast(`${t(this.state.lang, 'authWelcome')} ${result.data.prenom}`, 'save');
    resetFormateurState();
    this.goTo('login_ok');
    void this.ensureFormateurSession();
  }

  async handleFormateurSubmit(line) {
    await submitCommand(line, this.state.lang, {
      ...this.formateurCallbacks(),
      onRender: () => this.render(),
    });
    this.render();
  }

  formateurCallbacks() {
    return {
      onQuit: () => this.goTo('quitter'),
      onRestart: () => {
        showToast('Session réinitialisée', 'save');
        this.resetSession();
      },
      onToast: (msg, level) => showToast(msg, level),
      onExport: async (target) => {
        if (target === 'csv') {
          const { data } = await fetchParticipants({});
          doExportCSV(data, this.state.lang);
        } else {
          window.print();
        }
        showToast(t(this.state.lang, 'sessionSaved'), 'save');
      },
      onJournal: (raw, res) => {
        journaliserCommande(this.state.sessionId, raw, res.suggestion || raw, res.action, res.target, res.ok ? 'ok' : 'erreur');
      },
      onError: (res) => {
        journaliserErreur(this.state.sessionId, res.level, res.message, rawFromRes(res));
        if (res.level === 'warning') showToast('Commande incomplète', 'warning');
        if (res.level === 'danger') showToast('Commande inconnue', 'danger');
      },
    };
  }

  downloadPDF() {
    const recoKey = this.state.recoResult?.key;
    if (!recoKey) return;
    const html = genererFichePDF(recoKey, this.state.profile, this.state.answers, this.state.lang);
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); w.print(); }
  }
}

function rawFromRes(res) {
  return res.tokens?.map((t) => t.value).join(' ') || '';
}

const app = new App();
document.addEventListener('DOMContentLoaded', () => app.init());

export default app;
