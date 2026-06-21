/* ============================================================
   KebaCode CCC — Client Supabase + fonctions DB
   ============================================================ */

import { SUPABASE_URL, SUPABASE_ANON_KEY, FORMATEUR_AUTH_KEY, FORMATEUR_AUTH_TTL_MS } from './config.js';

let supabase = null;
let offline = false;

/** Initialise le client Supabase */
export function initSupabase() {
  try {
    if (window.supabase && SUPABASE_URL !== 'VOTRE_URL_SUPABASE') {
      supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      offline = !navigator.onLine;
      return { data: supabase, error: null };
    }
    offline = true;
    return { data: null, error: { message: 'Supabase non configuré — mode offline' } };
  } catch (e) {
    offline = true;
    return { data: null, error: e };
  }
}

export function isOffline() { return offline || !supabase; }
export function setOffline(val) { offline = val; }

export async function listerSessionsParticipants() {
  if (isOffline()) return { data: null, error: null };
  try {
    const { data, error } = await supabase.from('session')
      .select(`
        id, statut, etat, contexte, created_at, updated_at, duree,
        recommandation ( parcours_key, score, conseil )
      `)
      .order('created_at', { ascending: false })
      .limit(200);
    const filtered = (data || []).filter(
      (row) => row.contexte && (row.contexte.userName || row.contexte.profile),
    );
    return { data: filtered, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

export const VILLES = [
  'Kinshasa', 'Lubumbashi', 'Goma', 'Bukavu', 'Kisangani', 'Matadi',
];

async function getVilleId(nomVille) {
  if (!supabase || !nomVille) return null;
  const { data } = await supabase.from('ville')
    .select('id').eq('nom_ville', nomVille).maybeSingle();
  return data?.id || null;
}

export async function creerUtilisateur(pseudo, nomVille, trancheAge) {
  if (isOffline()) {
    return { data: { id: crypto.randomUUID(), pseudo, tranche_age: trancheAge }, error: null };
  }
  try {
    const id_ville = await getVilleId(nomVille);
    const { data, error } = await supabase.from('utilisateur').insert({
      pseudo: pseudo || 'Anonyme',
      id_ville,
      tranche_age: trancheAge || null,
    }).select().single();
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function lierSessionUtilisateur(idSession, idUtilisateur) {
  if (isOffline() || !idSession) return { data: null, error: null };
  try {
    const { data, error } = await supabase.from('session')
      .update({ id_utilisateur: idUtilisateur, updated_at: new Date().toISOString() })
      .eq('id', idSession).select().single();
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function enregistrerRecommandation(idSession, parcoursKey, score = 0) {
  if (isOffline() || !idSession) return { data: null, error: null };
  try {
    const { data: existing } = await supabase.from('recommandation')
      .select('id').eq('id_session', idSession).maybeSingle();
    if (existing?.id) {
      const { data, error } = await supabase.from('recommandation')
        .update({ parcours_key: parcoursKey, score })
        .eq('id', existing.id).select().single();
      return { data, error };
    }
    const { data, error } = await supabase.from('recommandation').insert({
      id_session: idSession,
      parcours_key: parcoursKey,
      score,
    }).select().single();
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function finaliserSession(idSession, etat, contexte, statut = 'terminee') {
  if (isOffline()) return { data: { id: idSession, statut }, error: null };
  try {
    const { data, error } = await supabase.from('session')
      .update({
        statut,
        etat,
        contexte,
        updated_at: new Date().toISOString(),
      })
      .eq('id', idSession).select().single();
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

// ---------- SESSIONS ----------

export async function creerSession(idUtilisateur, idCampagne, mode = 'public', contexteInitial = {}) {
  if (isOffline()) {
    const id = crypto.randomUUID();
    return { data: { id, mode, statut: 'en_cours', contexte: contexteInitial }, error: null };
  }
  try {
    const { data, error } = await supabase.from('session').insert({
      id_utilisateur: idUtilisateur,
      id_campagne: idCampagne,
      mode,
      statut: 'en_cours',
      etat: 'SAISIE_NOM',
      contexte: contexteInitial,
    }).select().single();
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function terminerSession(idSession, statut = 'terminee') {
  if (isOffline()) return { data: { id: idSession, statut }, error: null };
  try {
    const { data, error } = await supabase.from('session')
      .update({ statut, updated_at: new Date().toISOString() })
      .eq('id', idSession).select().single();
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function sauvegarderProgression(idSession, etat, contexteJSON) {
  if (isOffline()) {
    localStorage.setItem(`ccc_progress_${idSession}`, JSON.stringify({ etat, contexte: contexteJSON }));
    return { data: { ok: true }, error: null };
  }
  try {
    const { data, error } = await supabase.from('session')
      .update({ etat, contexte: contexteJSON, updated_at: new Date().toISOString() })
      .eq('id', idSession).select().single();
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function recupererSession(idUtilisateur) {
  if (isOffline()) return { data: null, error: null };
  try {
    const { data, error } = await supabase.from('session')
      .select('*').eq('id_utilisateur', idUtilisateur)
      .eq('statut', 'en_cours').order('created_at', { ascending: false }).limit(1).maybeSingle();
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function listerSessionsAbandonnees() {
  if (isOffline()) return { data: [], error: null };
  try {
    const { data, error } = await supabase.from('session')
      .select('*').eq('statut', 'abandonnee').order('updated_at', { ascending: false });
    return { data, error };
  } catch (e) {
    return { data: [], error: e };
  }
}

// ---------- RÉPONSES & QUESTIONS ----------

export async function enregistrerReponse(idSession, idQuestion, valeur, dureeSaisie = 0) {
  if (isOffline()) return { data: { idSession, idQuestion, valeur }, error: null };
  try {
    const { data, error } = await supabase.from('reponse').insert({
      id_session: idSession,
      id_question_ext: idQuestion,
      valeur,
      duree_saisie: dureeSaisie,
    }).select().single();
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function listerParticipantsParVille() {
  if (isOffline()) return { data: [], error: null };
  try {
    const { data, error } = await supabase.from('v_stats_par_ville').select('*');
    return { data, error };
  } catch (e) {
    return { data: [], error: e };
  }
}

export async function compterParticipantsParCampagne() {
  if (isOffline()) return { data: [], error: null };
  try {
    const { data, error } = await supabase.from('v_tableau_bord').select('*');
    return { data, error };
  } catch (e) {
    return { data: [], error: e };
  }
}

export async function calculerTauxInteret() {
  if (isOffline()) return { data: { taux: 75 }, error: null };
  try {
    const { data, error } = await supabase.from('v_tableau_bord').select('taux_completion').maybeSingle();
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function profilsOrientesScratch() {
  if (isOffline()) return { data: [], error: null };
  try {
    const { data, error } = await supabase.from('recommandation')
      .select('*').eq('parcours_key', 'enfant');
    return { data, error };
  } catch (e) {
    return { data: [], error: e };
  }
}

export async function profilsOrientesPython() {
  if (isOffline()) return { data: [], error: null };
  try {
    const { data, error } = await supabase.from('recommandation')
      .select('*').in('parcours_key', ['ado', 'python_avance']);
    return { data, error };
  } catch (e) {
    return { data: [], error: e };
  }
}

export async function identifierFuteursMentors() {
  if (isOffline()) return { data: [], error: null };
  try {
    const { data, error } = await supabase.from('recommandation')
      .select('*').eq('parcours_key', 'mentor');
    return { data, error };
  } catch (e) {
    return { data: [], error: e };
  }
}

export async function afficherErreursFrequentes() {
  if (isOffline()) {
    const rows = lireOffline(OFFLINE_ERREURS_KEY);
    const counts = {};
    rows.forEach((r) => {
      const key = r.entree_fautive || r.message || '?';
      counts[key] = (counts[key] || 0) + 1;
    });
    const data = Object.entries(counts)
      .map(([entree_fautive, occurrences]) => ({ entree_fautive, type_erreur: 'commande', occurrences }))
      .sort((a, b) => b.occurrences - a.occurrences)
      .slice(0, 15);
    return { data, error: null };
  }
  try {
    const { data, error } = await supabase.from('v_erreurs_frequentes').select('*');
    return { data, error };
  } catch (e) {
    return { data: [], error: e };
  }
}

export async function commandesFrequentes() {
  if (isOffline()) return { data: [], error: null };
  try {
    const { data, error } = await supabase.from('commande')
      .select('action, objet').limit(100);
    return { data, error };
  } catch (e) {
    return { data: [], error: e };
  }
}

export async function reponsesParTrancheAge() {
  if (isOffline()) return { data: [], error: null };
  try {
    const { data, error } = await supabase.from('utilisateur')
      .select('tranche_age, id').not('tranche_age', 'is', null);
    return { data, error };
  } catch (e) {
    return { data: [], error: e };
  }
}

export async function adolescentsKinshasaPython() {
  if (isOffline()) return { data: [], error: null };
  try {
    const { data, error } = await supabase.from('recommandation')
      .select('*, session(*)').eq('parcours_key', 'ado').limit(50);
    return { data, error };
  } catch (e) {
    return { data: [], error: e };
  }
}

// ---------- QUESTIONS & CAMPAGNES (FORMATEUR) ----------

const OFFLINE_QUESTIONS_KEY = 'ccc_questions_offline';
const OFFLINE_CAMPAGNES_KEY = 'ccc_campagnes_offline';
const OFFLINE_COMMANDES_KEY = 'ccc_commandes_offline';
const OFFLINE_ERREURS_KEY = 'ccc_erreurs_offline';

export function libelleQuestion(q, lang = 'fr') {
  if (!q?.texte) return '—';
  if (typeof q.texte === 'string') return q.texte;
  return q.texte[lang] || q.texte.fr || Object.values(q.texte)[0] || '—';
}

function lireOffline(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch (_) {
    return [];
  }
}

function ecrireOffline(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export async function listerQuestions({ activesSeulement = false } = {}) {
  if (isOffline()) {
    let data = lireOffline(OFFLINE_QUESTIONS_KEY);
    if (activesSeulement) data = data.filter((q) => q.actif !== false);
    return { data: data.sort((a, b) => (a.ordre || 0) - (b.ordre || 0)), error: null };
  }
  try {
    let query = supabase.from('question').select('*').order('ordre', { ascending: true });
    if (activesSeulement) query = query.eq('actif', true);
    const { data, error } = await query;
    return { data: data || [], error };
  } catch (e) {
    return { data: [], error: e };
  }
}

export async function creerQuestion({ texte, theme, profilCible = 'tous', typeReponse = 'closed' }) {
  const payload = { fr: texte };
  if (isOffline()) {
    const questions = lireOffline(OFFLINE_QUESTIONS_KEY);
    const ordre = questions.reduce((m, q) => Math.max(m, q.ordre || 0), 0) + 1;
    const q = {
      id: crypto.randomUUID(),
      id_externe: `q${ordre}`,
      texte: payload,
      theme,
      ordre,
      actif: true,
      profil_cible: profilCible,
      type_reponse: typeReponse,
    };
    questions.push(q);
    ecrireOffline(OFFLINE_QUESTIONS_KEY, questions);
    return { data: q, error: null };
  }
  try {
    const { data: last } = await supabase.from('question')
      .select('ordre').order('ordre', { ascending: false }).limit(1).maybeSingle();
    const ordre = (last?.ordre || 0) + 1;
    const { data, error } = await supabase.from('question').insert({
      id_externe: `q${ordre}`,
      texte: payload,
      theme,
      ordre,
      actif: true,
      profil_cible: profilCible,
      type_reponse: typeReponse,
    }).select().single();
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function obtenirQuestionParOrdre(ordre) {
  if (!ordre) return { data: null, error: { message: 'Numéro requis' } };
  if (isOffline()) {
    const q = lireOffline(OFFLINE_QUESTIONS_KEY).find((row) => row.ordre === ordre);
    return { data: q || null, error: q ? null : { message: 'Question introuvable' } };
  }
  try {
    const { data, error } = await supabase.from('question')
      .select('*').eq('ordre', ordre).maybeSingle();
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function modifierQuestionParOrdre(ordre, nouveauTexte, lang = 'fr') {
  const { data: existing, error: findErr } = await obtenirQuestionParOrdre(ordre);
  if (findErr || !existing) return { data: null, error: findErr || { message: 'Question introuvable' } };

  const texte = typeof existing.texte === 'object' && existing.texte
    ? { ...existing.texte, [lang]: nouveauTexte }
    : { [lang]: nouveauTexte };

  if (isOffline()) {
    const questions = lireOffline(OFFLINE_QUESTIONS_KEY).map((q) =>
      q.ordre === ordre ? { ...q, texte } : q);
    ecrireOffline(OFFLINE_QUESTIONS_KEY, questions);
    return { data: { ...existing, texte }, error: null };
  }
  return modifierQuestion(existing.id, texte);
}

export async function desactiverQuestionParOrdre(ordre) {
  const { data: existing, error: findErr } = await obtenirQuestionParOrdre(ordre);
  if (findErr || !existing) return { data: null, error: findErr || { message: 'Question introuvable' } };

  if (isOffline()) {
    const questions = lireOffline(OFFLINE_QUESTIONS_KEY).map((q) =>
      q.ordre === ordre ? { ...q, actif: false } : q);
    ecrireOffline(OFFLINE_QUESTIONS_KEY, questions);
    return { data: { ...existing, actif: false }, error: null };
  }
  return desactiverQuestion(existing.id);
}

export async function listerCampagnes() {
  if (isOffline()) {
    return { data: lireOffline(OFFLINE_CAMPAGNES_KEY), error: null };
  }
  try {
    const { data, error } = await supabase.from('campagne')
      .select('*').order('created_at', { ascending: false });
    return { data: data || [], error };
  } catch (e) {
    return { data: [], error: e };
  }
}

export async function lancerCampagne({ nom, theme }) {
  const label = nom || `Campagne ${theme || 'CCC'}`;
  const themeVal = theme || 'Général';
  if (isOffline()) {
    const camps = lireOffline(OFFLINE_CAMPAGNES_KEY).map((c) =>
      c.statut === 'active' ? { ...c, statut: 'terminee' } : c);
    const camp = {
      id: crypto.randomUUID(),
      nom: label,
      theme: themeVal,
      statut: 'active',
      date_debut: new Date().toISOString().slice(0, 10),
    };
    camps.unshift(camp);
    ecrireOffline(OFFLINE_CAMPAGNES_KEY, camps);
    return { data: camp, error: null };
  }
  try {
    await supabase.from('campagne').update({ statut: 'terminee' }).eq('statut', 'active');
    const { data, error } = await supabase.from('campagne').insert({
      nom: label,
      theme: themeVal,
      statut: 'active',
      date_debut: new Date().toISOString().slice(0, 10),
    }).select().single();
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function aggregateCommandesFrequentes() {
  if (isOffline()) {
    const rows = lireOffline(OFFLINE_COMMANDES_KEY);
    const counts = {};
    rows.forEach((r) => {
      const key = `${r.action || '?'} ${r.objet || ''}`.trim() || r.texte_brut || '?';
      counts[key] = (counts[key] || 0) + 1;
    });
    const data = Object.entries(counts)
      .map(([label, occurrences]) => ({ label, occurrences }))
      .sort((a, b) => b.occurrences - a.occurrences)
      .slice(0, 15);
    return { data, error: null };
  }
  try {
    const { data, error } = await supabase.from('commande').select('action, objet, texte_brut');
    if (error) return { data: [], error };
    const counts = {};
    (data || []).forEach((r) => {
      const key = r.texte_brut || `${r.action || ''} ${r.objet || ''}`.trim();
      counts[key] = (counts[key] || 0) + 1;
    });
    const aggregated = Object.entries(counts)
      .map(([label, occurrences]) => ({ label, occurrences }))
      .sort((a, b) => b.occurrences - a.occurrences)
      .slice(0, 15);
    return { data: aggregated, error: null };
  } catch (e) {
    return { data: [], error: e };
  }
}

// ---------- ADMINISTRATION ----------

export async function modifierQuestion(idQuestion, nouveauTexte) {
  if (isOffline()) return { data: { id: idQuestion, texte: nouveauTexte }, error: null };
  try {
    const { data, error } = await supabase.from('question')
      .update({ texte: nouveauTexte }).eq('id', idQuestion).select().single();
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function desactiverQuestion(idQuestion) {
  if (isOffline()) return { data: { id: idQuestion, actif: false }, error: null };
  try {
    const { data, error } = await supabase.from('question')
      .update({ actif: false }).eq('id', idQuestion).select().single();
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function exporterRapportCampagne(idCampagne) {
  if (isOffline()) return { data: { format: 'csv', campagne: idCampagne }, error: null };
  try {
    const { data, error } = await supabase.from('v_tableau_bord').select('*');
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function tableauDeBordSynthetique() {
  if (isOffline()) return { data: null, error: null };
  try {
    const { data, error } = await supabase.from('v_tableau_bord').select('*').maybeSingle();
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

// ---------- COMMANDES FORMATEUR ----------

export async function journaliserCommande(idSession, texteBrut, textCorrige, action, objet, statut = 'ok') {
  if (isOffline()) {
    const list = lireOffline(OFFLINE_COMMANDES_KEY);
    list.push({ texte_brut: texteBrut, action, objet, statut, created_at: Date.now() });
    ecrireOffline(OFFLINE_COMMANDES_KEY, list);
    return { data: { texteBrut, action, objet }, error: null };
  }
  try {
    const { data, error } = await supabase.from('commande').insert({
      id_session: idSession,
      texte_brut: texteBrut,
      texte_corrige: textCorrige,
      action,
      objet,
      statut,
    }).select().single();
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function journaliserErreur(idSession, typeErreur, message, entreeFautive) {
  if (isOffline()) {
    const list = lireOffline(OFFLINE_ERREURS_KEY);
    list.push({ type_erreur: typeErreur, message, entree_fautive: entreeFautive, created_at: Date.now() });
    ecrireOffline(OFFLINE_ERREURS_KEY, list);
    return { data: { typeErreur, message }, error: null };
  }
  try {
    const { data, error } = await supabase.from('erreur').insert({
      id_session: idSession,
      type_erreur: typeErreur,
      message,
      entree_fautive: entreeFautive,
    }).select().single();
    return { data, error };
  } catch (e) {
    return { data: null, error: e };
  }
}

/** Synchronise les données locales au retour en ligne */
export async function syncOfflineData() {
  if (isOffline()) return { data: null, error: { message: 'Toujours offline' } };
  const keys = Object.keys(localStorage).filter((k) => k.startsWith('ccc_progress_'));
  const results = [];
  for (const key of keys) {
    try {
      const raw = JSON.parse(localStorage.getItem(key));
      const idSession = key.replace('ccc_progress_', '');
      const { data, error } = await sauvegarderProgression(idSession, raw.etat, raw.contexte);
      if (!error) { localStorage.removeItem(key); results.push(data); }
    } catch (_) { /* ignorer */ }
  }
  return { data: results, error: null };
}

// ---------- AUTHENTIFICATION FORMATEUR ----------

/** Comptes de démo (mode hors ligne) — mot de passe : ccc2026 */
const OFFLINE_FORMATEURS = [
  {
    id: 'demo-formateur-1',
    email: 'formateur@ccc.cd',
    password: 'ccc2026',
    prenom: 'Marie',
    nom: 'Kabila',
  },
  {
    id: 'demo-formateur-2',
    email: 'admin@ccc.cd',
    password: 'ccc2026',
    prenom: 'Jean',
    nom: 'Formateur',
  },
];

export function sauvegarderAuthFormateur(profil) {
  const payload = {
    ...profil,
    expiresAt: Date.now() + FORMATEUR_AUTH_TTL_MS,
  };
  localStorage.setItem(FORMATEUR_AUTH_KEY, JSON.stringify(payload));
  return payload;
}

export function restaurerAuthFormateur() {
  try {
    const raw = localStorage.getItem(FORMATEUR_AUTH_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data?.id || !data.expiresAt) return null;
    if (Date.now() > data.expiresAt) {
      localStorage.removeItem(FORMATEUR_AUTH_KEY);
      return null;
    }
    return data;
  } catch (_) {
    return null;
  }
}

export function deconnecterFormateur() {
  localStorage.removeItem(FORMATEUR_AUTH_KEY);
}

function verifierFormateurLocal(email, motDePasse) {
  const match = OFFLINE_FORMATEURS.find(
    (f) => f.email.toLowerCase() === email && f.password === motDePasse,
  );
  if (!match) return null;
  return sauvegarderAuthFormateur({
    id: match.id,
    email: match.email,
    prenom: match.prenom,
    nom: match.nom,
  });
}

export async function authentifierFormateur(email, motDePasse) {
  const normalizedEmail = (email || '').trim().toLowerCase();
  if (!normalizedEmail || !motDePasse) {
    return { ok: false, error: 'missing', message: 'Email et mot de passe requis.' };
  }

  if (isOffline()) {
    const profil = verifierFormateurLocal(normalizedEmail, motDePasse);
    if (!profil) {
      return { ok: false, error: 'invalid', message: 'Identifiants incorrects.' };
    }
    return { ok: true, data: profil };
  }

  let rpcIndisponible = false;

  try {
    const { data, error } = await supabase.rpc('verifier_formateur', {
      p_email: normalizedEmail,
      p_mot_de_passe: motDePasse,
    });

    if (error) {
      console.warn('[Auth] RPC verifier_formateur:', error.message || error);
      rpcIndisponible = true;
    } else {
      const row = Array.isArray(data) ? data[0] : data;
      if (row?.ok) {
        const profil = sauvegarderAuthFormateur({
          id: row.id,
          email: row.email,
          prenom: row.prenom,
          nom: row.nom,
        });
        return { ok: true, data: profil };
      }
    }
  } catch (e) {
    console.warn('[Auth] Exception RPC:', e);
    rpcIndisponible = true;
  }

  const profilLocal = verifierFormateurLocal(normalizedEmail, motDePasse);
  if (profilLocal) {
    return { ok: true, data: profilLocal, fallback: rpcIndisponible };
  }

  if (rpcIndisponible) {
    return {
      ok: false,
      error: 'invalid',
      message: 'Identifiants incorrects. Vérifiez email et code (ex. ccc2026).',
    };
  }

  return { ok: false, error: 'invalid', message: 'Email ou mot de passe incorrect.' };
}
