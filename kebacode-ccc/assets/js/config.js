/* ============================================================
   KebaCode CCC — Configuration globale
   ============================================================ */

export const SUPABASE_URL = 'https://okkjpkfynjheigjxhzrv.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ra2pwa2Z5bmpoZWlnanhoenJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwMjAxNjAsImV4cCI6MjA5NzU5NjE2MH0.WLNum1hhnkqGL_bWVyfdhRafIPJIXFkcd2wURgkN7Mk';

export const TIMEOUTS = {
  AIDE: 20000,
  REFORMULER: 40000,
  SAUVEGARDER: 60000,
  FERMER: 90000,
};

export const SESSION_KEY = 'ccc_session_v1';
export const FORMATEUR_AUTH_KEY = 'ccc_formateur_auth';
/** Durée de session formateur (8 h) */
export const FORMATEUR_AUTH_TTL_MS = 8 * 60 * 60 * 1000;
export const LEVENSHTEIN_MAX = 2;

export const DEV_MODE = true;
