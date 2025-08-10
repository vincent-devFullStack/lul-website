// src/lib/consent.js
export const CONSENT_KEY = "cookie-consent:v2";

// Lit le consentement (et migre l'ancienne clé si présente)
export function readConsent() {
  try {
    const raw =
      localStorage.getItem(CONSENT_KEY) ||
      localStorage.getItem("cookie-consent"); // migration
    if (!raw) return null;
    const c = JSON.parse(raw);
    const valid =
      c && c.necessary === true && typeof c.functional === "boolean";
    return valid ? c : null;
  } catch {
    return null;
  }
}

// Ecrit le consentement (structure normalisée)
export function writeConsent(partial) {
  const payload = {
    necessary: true,
    functional: !!partial.functional,
  };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(payload));
  // Nettoie l'ancienne clé si elle existe
  localStorage.removeItem("cookie-consent");

  // Notifie les autres onglets éventuels
  try {
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: CONSENT_KEY,
        newValue: JSON.stringify(payload),
      })
    );
  } catch {}
}

// Supprime le consentement
export function clearConsent() {
  localStorage.removeItem(CONSENT_KEY);
  localStorage.removeItem("cookie-consent");
}

// Renvoie true si on doit afficher le bandeau
export function needsConsent() {
  return readConsent() == null;
}
