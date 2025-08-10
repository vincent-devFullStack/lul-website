"use client";

import { useState, useEffect, useCallback } from "react";
import { readConsent, clearConsent } from "@/lib/consent";

export function useCookieConsent() {
  const [consent, setConsent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Chargement initial (après hydratation côté client)
  useEffect(() => {
    try {
      const c = readConsent();
      setConsent(c || null);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const hasConsent = useCallback(
    (type = "functional") => {
      if (!consent) return false;
      return consent[type] === true;
    },
    [consent]
  );

  // Ex: accès admin/auth requiert "functional"
  const canUseAuth = useCallback(() => hasConsent("functional"), [hasConsent]);

  const resetConsent = useCallback(() => {
    try {
      clearConsent();
      setConsent(null);
      // supprime aussi un éventuel cookie d'auth
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
    } finally {
      // recharge pour réafficher la bannière et nettoyer l'état
      if (typeof window !== "undefined") window.location.reload();
    }
  }, []);

  return {
    consent,
    loading,
    hasConsent,
    canUseAuth,
    resetConsent,
    hasGivenConsent: consent !== null,
  };
}
