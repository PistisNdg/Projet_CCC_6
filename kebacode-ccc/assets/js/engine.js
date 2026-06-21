/* ============================================================
   KebaCode CCC — Moteur d'états (FSM) + gestion timeouts
   ============================================================ */

import { SESSION_KEY, TIMEOUTS } from './config.js';

export const ETATS = {
  ACCUEIL: 'ACCUEIL',
  SAISIE_NOM: 'SAISIE_NOM',
  SAISIE_VILLE: 'SAISIE_VILLE',
  IDENTIFICATION_PROFIL: 'IDENTIFICATION_PROFIL',
  CHOIX_MODE: 'CHOIX_MODE',
  ENQUETE: 'ENQUETE',
  ANALYSE_REPONSES: 'ANALYSE_REPONSES',
  RECOMMANDATION: 'RECOMMANDATION',
  AUTH_FORMATEUR: 'AUTH_FORMATEUR',
  MODE_FORMATEUR: 'MODE_FORMATEUR',
  ANALYSE_COMMANDE: 'ANALYSE_COMMANDE',
  STATISTIQUES: 'STATISTIQUES',
  ERREUR: 'ERREUR',
  SAUVEGARDE: 'SAUVEGARDE',
  FIN_SESSION: 'FIN_SESSION',
};

/** Matrice de transitions valides */
const TRANSITIONS = {
  [ETATS.ACCUEIL]: {
    choisir_langue: ETATS.CHOIX_MODE,
    reprendre: null,
  },
  [ETATS.CHOIX_MODE]: {
    demarrer: ETATS.SAISIE_NOM,
    mode_formateur: ETATS.AUTH_FORMATEUR,
    retour: ETATS.ACCUEIL,
  },
  [ETATS.AUTH_FORMATEUR]: {
    login_ok: ETATS.MODE_FORMATEUR,
    retour: ETATS.CHOIX_MODE,
  },
  [ETATS.SAISIE_NOM]: {
    continuer: ETATS.SAISIE_VILLE,
    skip: ETATS.IDENTIFICATION_PROFIL,
    retour: ETATS.CHOIX_MODE,
  },
  [ETATS.SAISIE_VILLE]: {
    continuer: ETATS.IDENTIFICATION_PROFIL,
    retour: ETATS.SAISIE_NOM,
  },
  [ETATS.IDENTIFICATION_PROFIL]: {
    choisir_profil: ETATS.ENQUETE,
    retour: ETATS.SAISIE_VILLE,
  },
  [ETATS.ENQUETE]: {
    repondre: ETATS.ENQUETE,
    terminer: ETATS.ANALYSE_REPONSES,
    retour: ETATS.IDENTIFICATION_PROFIL,
    inactivite_60: ETATS.SAUVEGARDE,
  },
  [ETATS.ANALYSE_REPONSES]: {
    terminee: ETATS.RECOMMANDATION,
  },
  [ETATS.RECOMMANDATION]: {
    rejoindre: ETATS.FIN_SESSION,
    recommencer: ETATS.ACCUEIL,
  },
  [ETATS.MODE_FORMATEUR]: {
    saisir_cmd: ETATS.ANALYSE_COMMANDE,
    voir_stats: ETATS.STATISTIQUES,
    quitter: ETATS.CHOIX_MODE,
    deconnexion: ETATS.CHOIX_MODE,
  },
  [ETATS.ANALYSE_COMMANDE]: {
    ok: ETATS.MODE_FORMATEUR,
    erreur: ETATS.MODE_FORMATEUR,
  },
  [ETATS.STATISTIQUES]: {
    retour: ETATS.MODE_FORMATEUR,
  },
  [ETATS.SAUVEGARDE]: {
    ok: ETATS.ACCUEIL,
  },
  [ETATS.FIN_SESSION]: {
    delai: ETATS.ACCUEIL,
  },
  [ETATS.ERREUR]: {
    ok: null,
    timeout: ETATS.ACCUEIL,
  },
};

export class FSM {
  constructor() {
    this._etat = ETATS.ACCUEIL;
    this._etatPrecedent = null;
  }

  get etat() {
    return this._etat;
  }

  peutTransitionner(evenement) {
    const map = TRANSITIONS[this._etat];
    return map && evenement in map;
  }

  transition(evenement, contexte = {}) {
    const map = TRANSITIONS[this._etat];
    if (!map || !(evenement in map)) {
      console.warn(`[FSM] Transition invalide : ${this._etat} + ${evenement}`);
      this._etatPrecedent = this._etat;
      this._etat = ETATS.ERREUR;
      return this._etat;
    }

    let suivant = map[evenement];

    if (evenement === 'reprendre' && contexte.etatSauvegarde) {
      suivant = contexte.etatSauvegarde;
    }
    if (evenement === 'ok' && this._etat === ETATS.ERREUR && this._etatPrecedent) {
      suivant = this._etatPrecedent;
    }

    const avant = this._etat;
    this._etatPrecedent = avant;
    this._etat = suivant || avant;

    console.log(`[FSM] ${avant} → ${this._etat} (event: ${evenement})`);
    return this._etat;
  }

  executer(etat, contexte) {
    return { etat, contexte };
  }

  sauvegarder(contexte) {
    try {
      const data = {
        etat: this._etat,
        contexte,
        savedAt: Date.now(),
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('[FSM] Erreur sauvegarde localStorage:', e);
    }
  }

  restaurer() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (data.etat) {
        this._etat = data.etat;
        console.log(`[FSM] Session restaurée → ${this._etat}`);
      }
      return data;
    } catch (e) {
      console.warn('[FSM] Erreur restauration:', e);
      return null;
    }
  }

  reset() {
    this._etatPrecedent = this._etat;
    this._etat = ETATS.ACCUEIL;
    console.log('[FSM] Reset → ACCUEIL');
    return this._etat;
  }

  forcerEtat(etat) {
    this._etatPrecedent = this._etat;
    this._etat = etat;
  }
}

/** Gestionnaire d'inactivité avec timeouts progressifs */
export class InactivityManager {
  constructor() {
    this._timers = {};
    this._callbacks = {};
    this._etat = null;
    this._active = false;
  }

  start(etat, callbacks) {
    this.stop();
    this._etat = etat;
    this._callbacks = callbacks || {};
    this._active = true;
    this._schedule();
  }

  _schedule() {
    if (!this._active) return;

    this._timers.aide = setTimeout(() => {
      this._callbacks.onAide?.();
      this._timers.reformuler = setTimeout(() => {
        this._callbacks.onReformuler?.();
        this._timers.sauvegarder = setTimeout(() => {
          this._callbacks.onSauvegarder?.();
          this._timers.fermer = setTimeout(() => {
            this._callbacks.onFermer?.();
          }, TIMEOUTS.FERMER - TIMEOUTS.SAUVEGARDER);
        }, TIMEOUTS.SAUVEGARDER - TIMEOUTS.REFORMULER);
      }, TIMEOUTS.REFORMULER - TIMEOUTS.AIDE);
    }, TIMEOUTS.AIDE);
  }

  reset() {
    if (!this._active) return;
    Object.values(this._timers).forEach(clearTimeout);
    this._timers = {};
    this._schedule();
  }

  bump() {
    this.reset();
  }

  stop() {
    this._active = false;
    Object.values(this._timers).forEach(clearTimeout);
    this._timers = {};
  }
}
