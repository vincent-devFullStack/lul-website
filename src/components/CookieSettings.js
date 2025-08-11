"use client";

import { useCookieConsent } from "@/hooks/useCookieConsent";
import { useMemo, useState } from "react";

export default function CookieSettings({ compact = false }) {
  const { consent, resetConsent, hasGivenConsent } = useCookieConsent();
  const [loading, setLoading] = useState(false);

  const functionalAccepted = !!consent?.functional;

  const statusLabel = useMemo(
    () => (functionalAccepted ? "✅ Acceptés" : "❌ Refusés"),
    [functionalAccepted]
  );

  const handleReset = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await resetConsent(); // fait réapparaître la bannière
    } finally {
      setLoading(false);
    }
  };

  if (!hasGivenConsent) {
    return (
      <div className={`cookie-settings ${compact ? "compact" : ""}`}>
        <p>Aucune préférence de cookies définie.</p>
        <p className="text-sm opacity-70">
          Cliquez sur « Modifier mes préférences » pour choisir.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="cookie-btn cookie-btn-customize"
        >
          Modifier mes préférences
        </button>
      </div>
    );
  }

  return (
    <div
      className={`cookie-settings ${compact ? "compact" : ""} ${
        loading ? "loading" : ""
      }`}
    >
      <h3>Vos préférences de cookies</h3>

      <div className="cookie-preferences">
        <div className="preference-item">
          <span>Cookies nécessaires</span>
          <span className="status accepted">✅ Acceptés</span>
        </div>

        <div className="preference-item">
          <span>Cookies fonctionnels</span>
          <span
            className={`status ${functionalAccepted ? "accepted" : "rejected"}`}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      <div role="status" aria-live="polite" className="sr-only">
        {loading ? "Chargement…" : ""}
      </div>

      <button
        type="button"
        onClick={handleReset}
        className="cookie-btn cookie-btn-customize"
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? "Chargement..." : "Modifier mes préférences"}
      </button>

      <p className="text-xs opacity-70 mt-2">
        Remet à zéro vos choix et réaffiche la bannière cookies.
      </p>
    </div>
  );
}
