"use client";

import { useState, useEffect } from "react";
import { needsConsent, writeConsent } from "@/lib/consent";
import "@/styles/components/cookie-consent.css";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Affiche la bannière uniquement si aucun consentement n'est stocké
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (needsConsent()) {
      const t = setTimeout(() => setShowBanner(true), 500);
      return () => clearTimeout(t);
    }
  }, []);

  const reloadIfAuthPage = () => {
    if (
      window.location.pathname.startsWith("/admin") ||
      window.location.pathname === "/login"
    ) {
      window.location.reload();
    }
  };

  const acceptAll = () => {
    writeConsent({ functional: true });
    setShowBanner(false);
    reloadIfAuthPage();
  };

  const rejectAll = () => {
    writeConsent({ functional: false }); // écriture unifiée (clé v2)
    setShowBanner(false);
    clearNonNecessaryCookies();

    // Redirige hors admin si l’auth n’est plus utilisable
    if (window.location.pathname.startsWith("/admin")) {
      window.location.href = "/accueil";
    }
  };

  const savePreferences = (preferences) => {
    writeConsent({ functional: !!preferences.functional });
    setShowBanner(false);
    setShowDetails(false);

    if (!preferences.functional) {
      clearNonNecessaryCookies();
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/accueil";
        return;
      }
    }

    reloadIfAuthPage();
  };

  const clearNonNecessaryCookies = () => {
    // supprime le token d’auth si présent
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
  };

  if (!showBanner) return null;

  return (
    <>
      <div className="cookie-overlay" />

      <div className="cookie-banner" role="dialog" aria-modal="true">
        <div className="cookie-content">
          <div className="cookie-header">
            <h3 className="cookie-title">🍪 Gestion des cookies</h3>
          </div>

          <div className="cookie-text">
            <p>
              Nous utilisons des cookies pour améliorer votre expérience sur
              L&apos;Iconodule. Certains cookies sont{" "}
              <strong>nécessaires</strong> au fonctionnement du site
              (navigation, sécurité), d&apos;autres sont{" "}
              <strong>fonctionnels</strong> (authentification, préférences).
            </p>
            <p className="cookie-info">
              <strong>
                Nous n&apos;utilisons aucun cookie de tracking, publicité ou
                analyse comportementale.
              </strong>
            </p>
          </div>

          <div className="cookie-actions">
            <button
              onClick={acceptAll}
              className="cookie-btn cookie-btn-accept"
            >
              Accepter tous les cookies
            </button>

            <button
              onClick={rejectAll}
              className="cookie-btn cookie-btn-reject"
            >
              Refuser les cookies fonctionnels
            </button>

            <button
              onClick={() => setShowDetails(true)}
              className="cookie-btn cookie-btn-customize"
            >
              Personnaliser
            </button>
          </div>

          <div className="cookie-links">
            <a
              href="/politique-confidentialite"
              target="_blank"
              rel="noopener noreferrer"
            >
              Politique de confidentialité
            </a>
            <a
              href="/mentions-legales"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mentions légales
            </a>
          </div>
        </div>
      </div>

      {showDetails && (
        <CookieDetailsModal
          onSave={savePreferences}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
}

function CookieDetailsModal({ onSave, onClose }) {
  const [preferences, setPreferences] = useState({ functional: true });

  const handleSave = () => onSave(preferences);

  return (
    <div className="cookie-modal-overlay">
      <div className="cookie-modal">
        <div className="cookie-modal-header">
          <h3>Préférences des cookies</h3>
          <button onClick={onClose} className="cookie-modal-close">
            &times;
          </button>
        </div>

        <div className="cookie-modal-content">
          <div className="cookie-category">
            <div className="cookie-category-header">
              <h4>Cookies nécessaires</h4>
              <span className="cookie-status cookie-status-required">
                Obligatoires
              </span>
            </div>
            <p>
              Ces cookies sont essentiels au fonctionnement du site. Ils
              permettent la navigation de base et les fonctionnalités de
              sécurité.
            </p>
            <div className="cookie-examples">
              <strong>Exemples :</strong> Session utilisateur, sécurité CSRF,
              préférences de langue
            </div>
          </div>

          <div className="cookie-category">
            <div className="cookie-category-header">
              <h4>Cookies fonctionnels</h4>
              <label className="cookie-toggle">
                <input
                  type="checkbox"
                  checked={preferences.functional}
                  onChange={(e) =>
                    setPreferences({ functional: e.target.checked })
                  }
                />
                <span className="cookie-toggle-slider" />
              </label>
            </div>
            <p>
              Ces cookies permettent l&apos;authentification et la mémorisation
              de vos préférences.{" "}
              <strong>Nécessaires pour accéder à l&apos;administration.</strong>
            </p>
            <div className="cookie-examples">
              <strong>Exemples :</strong> Token d&apos;authentification,
              préférences utilisateur
            </div>
          </div>

          <div className="cookie-note">
            <p>
              <strong>Note :</strong> Ce site n&apos;utilise aucun cookie
              d&apos;analyse, de tracking ou de marketing. Seuls les cookies
              essentiels et fonctionnels sont employés.
            </p>
          </div>
        </div>

        <div className="cookie-modal-actions">
          <button onClick={onClose} className="cookie-btn cookie-btn-secondary">
            Annuler
          </button>
          <button onClick={handleSave} className="cookie-btn cookie-btn-accept">
            Enregistrer mes préférences
          </button>
        </div>
      </div>
    </div>
  );
}
