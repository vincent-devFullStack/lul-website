"use client";

import { useState, useEffect } from "react";
import "@/styles/components/cookie-consent.css";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // ✅ Vérifier si l'utilisateur a déjà fait un choix
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // ✅ Délai pour laisser charger la page
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem(
      "cookie-consent",
      JSON.stringify({
        necessary: true,
        functional: true,
        analytics: false,
        marketing: false,
      })
    );
    setShowBanner(false);

    // ✅ Recharger seulement si nécessaire
    if (
      window.location.pathname.startsWith("/admin") ||
      window.location.pathname === "/login"
    ) {
      window.location.reload();
    }
  };

  const rejectAll = () => {
    localStorage.setItem(
      "cookie-consent",
      JSON.stringify({
        necessary: true,
        functional: false,
        analytics: false,
        marketing: false,
      })
    );
    setShowBanner(false);
    clearNonNecessaryCookies();

    // ✅ Redirection intelligente
    if (window.location.pathname.startsWith("/admin")) {
      window.location.href = "/accueil";
    }
    // ✅ Pas de rechargement systématique
  };

  const savePreferences = (preferences) => {
    localStorage.setItem(
      "cookie-consent",
      JSON.stringify({
        necessary: true,
        functional: preferences.functional,
        analytics: false,
        marketing: false,
      })
    );
    setShowBanner(false);
    setShowDetails(false);

    if (!preferences.functional) {
      clearNonNecessaryCookies();
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/accueil";
      }
    }

    // ✅ Recharger seulement si on est sur des pages qui nécessitent l'auth
    if (
      window.location.pathname.startsWith("/admin") ||
      window.location.pathname === "/login"
    ) {
      window.location.reload();
    }
  };

  const clearNonNecessaryCookies = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // ✅ Ne supprime plus tout
    // localStorage.clear();
  };

  if (!showBanner) return null;

  return (
    <>
      <div className="cookie-overlay" />

      <div className="cookie-banner">
        <div className="cookie-content">
          <div className="cookie-header">
            <h3 className="cookie-title">🍪 Gestion des cookies</h3>
          </div>

          <div className="cookie-text">
            <p>
              Nous utilisons des cookies pour améliorer votre expérience sur
              L'Iconodule. Certains cookies sont <strong>nécessaires</strong> au
              fonctionnement du site (navigation, sécurité), d'autres sont{" "}
              <strong>fonctionnels</strong> (authentification, préférences).
            </p>
            <p className="cookie-info">
              <strong>
                Nous n'utilisons aucun cookie de tracking, publicité ou analyse
                comportementale.
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

      {/* ✅ Modal simplifiée */}
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
  const [preferences, setPreferences] = useState({
    functional: true,
  });

  const handleSave = () => {
    onSave(preferences);
  };

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
          {/* ✅ Cookies nécessaires */}
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

          {/* ✅ Cookies fonctionnels */}
          <div className="cookie-category">
            <div className="cookie-category-header">
              <h4>Cookies fonctionnels</h4>
              <label className="cookie-toggle">
                <input
                  type="checkbox"
                  checked={preferences.functional}
                  onChange={(e) =>
                    setPreferences({
                      functional: e.target.checked,
                    })
                  }
                />
                <span className="cookie-toggle-slider"></span>
              </label>
            </div>
            <p>
              Ces cookies permettent l'authentification et la mémorisation de
              vos préférences.{" "}
              <strong>Nécessaires pour accéder à l'administration.</strong>
            </p>
            <div className="cookie-examples">
              <strong>Exemples :</strong> Token d'authentification, préférences
              utilisateur
            </div>
          </div>

          {/* ✅ Note explicative */}
          <div className="cookie-note">
            <p>
              <strong>Note :</strong> Ce site n'utilise aucun cookie d'analyse,
              de tracking ou de marketing. Seuls les cookies essentiels et
              fonctionnels sont employés.
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
