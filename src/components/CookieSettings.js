"use client";

import { useCookieConsent } from "@/hooks/useCookieConsent";
import { useState } from "react";

export default function CookieSettings({ compact = false }) {
  const { consent, resetConsent, hasGivenConsent } = useCookieConsent();
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    try {
      await resetConsent();
    } finally {
      setLoading(false);
    }
  };

  if (!hasGivenConsent) {
    return (
      <div className={`cookie-settings ${compact ? "compact" : ""}`}>
        <p>Aucune préférence de cookies définie.</p>
      </div>
    );
  }

  return (
    <div
      className={`cookie-settings ${
        compact ? "compact" : ""
      } ${loading ? "loading" : ""}`}
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
            className={`status ${
              consent?.functional ? "accepted" : "rejected"
            }`}
          >
            {consent?.functional ? "✅ Acceptés" : "❌ Refusés"}
          </span>
        </div>
      </div>

      <button onClick={handleReset} className="cookie-btn cookie-btn-customize">
        {loading ? "Chargement..." : "Modifier mes préférences"}
      </button>
    </div>
  );
}
