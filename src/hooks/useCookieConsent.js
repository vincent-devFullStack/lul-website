"use client";

import { useState, useEffect } from "react";

export function useCookieConsent() {
  const [consent, setConsent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cookie-consent");
      if (stored) {
        setConsent(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Erreur lecture consentement cookies:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const hasConsent = (type = "functional") => {
    if (!consent) return false;
    return consent[type] === true;
  };

  const canUseAuth = () => {
    return hasConsent("functional");
  };

  const resetConsent = () => {
    localStorage.removeItem("cookie-consent");
    setConsent(null);

    // ✅ Supprimer les cookies
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    window.location.reload();
  };

  return {
    consent,
    loading,
    hasConsent,
    canUseAuth,
    resetConsent,
    hasGivenConsent: consent !== null,
  };
}
