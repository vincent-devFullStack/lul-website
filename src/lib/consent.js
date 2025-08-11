// src/lib/consent.js
export const CONSENT_VERSION = 2;
export const CONSENT_KEY = `cookie-consent:v${CONSENT_VERSION}`;
const LEGACY_KEY = "cookie-consent";
const PING_KEY = "cookie-consent:ping"; // force un storage event cross-tab

function ls() {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

// Lit le consentement (et migre l'ancienne clé si présente)
export function readConsent() {
  const storage = ls();
  if (!storage) return null;

  try {
    const raw = storage.getItem(CONSENT_KEY) ?? storage.getItem(LEGACY_KEY);
    if (!raw) return null;

    const c = JSON.parse(raw);
    // On ne garde que "functional" (necessary est toujours true dans notre modèle)
    if (typeof c?.functional !== "boolean") return null;

    return { necessary: true, functional: !!c.functional };
  } catch {
    return null;
  }
}

// Écrit le consentement (structure normalisée)
export function writeConsent(partial) {
  const storage = ls();
  if (!storage) return;

  const payload = {
    necessary: true,
    functional: !!partial?.functional,
  };

  try {
    storage.setItem(CONSENT_KEY, JSON.stringify(payload));
    storage.removeItem(LEGACY_KEY);
    // Notifie les autres onglets même si la valeur n'a pas changé
    storage.setItem(PING_KEY, String(Date.now()));
  } catch {
    // quota exceeded / privacy mode — on ignore
  }

  return payload;
}

// Supprime le consentement
export function clearConsent() {
  const storage = ls();
  if (!storage) return;

  try {
    storage.removeItem(CONSENT_KEY);
    storage.removeItem(LEGACY_KEY);
    storage.setItem(PING_KEY, String(Date.now()));
  } catch {}
}

// Renvoie true si on doit afficher le bandeau
export function needsConsent() {
  return readConsent() == null;
}
