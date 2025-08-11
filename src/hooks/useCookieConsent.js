"use client";

import { useState, useEffect, useCallback } from "react";
import { readConsent, writeConsent, clearConsent } from "@/lib/consent";

export function useCookieConsent() {
  const [consent, setConsent] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1) Chargement initial côté client
  useEffect(() => {
    try {
      setConsent(readConsent() || null);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2) Synchro cross-tab + même onglet
  useEffect(() => {
    const refresh = () => setConsent(readConsent() || null);

    const onStorage = () => refresh(); // un autre onglet a modifié les prefs
    const onCustom = () => refresh(); // même onglet (voir dispatch ci-dessous)

    window.addEventListener("storage", onStorage);
    window.addEventListener("consent:changed", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("consent:changed", onCustom);
    };
  }, []);

  const hasConsent = useCallback(
    (type = "functional") => !!consent && consent[type] === true,
    [consent]
  );

  // Accès auth = nécessite les cookies fonctionnels
  const canUseAuth = useCallback(() => hasConsent("functional"), [hasConsent]);

  // (Optionnel) Mise à jour depuis n’importe où (sinon continue d’écrire dans ta bannière)
  const updateConsent = useCallback((next) => {
    writeConsent(next);
    setConsent(readConsent() || null);
    // notifie les autres hooks dans le même onglet
    window.dispatchEvent(new Event("consent:changed"));
  }, []);

  const resetConsent = useCallback(() => {
    clearConsent();
    setConsent(null);

    // supprime aussi un éventuel cookie d'auth httpOnly côté client (nom côté serveur)
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";

    // notifie les autres hooks dans le même onglet
    window.dispatchEvent(new Event("consent:changed"));
  }, []);

  return {
    consent,
    loading,
    hasConsent,
    canUseAuth,
    updateConsent, // <- pratique si tu veux centraliser l’écriture
    resetConsent,
    hasGivenConsent: consent !== null,
  };
}
