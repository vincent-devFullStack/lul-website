"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "@/styles/pages/forgot-password.css";

export default function ResetPasswordClient({ token }) {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  // si l’URL est cassée, on affiche un état clair
  const hasToken = typeof token === "string" && token.length > 0;

  // règle de complexité simple (évite 12345678)
  const strongEnough = useMemo(() => {
    if (password.length < 8) return false;
    const classes = [
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ].filter(Boolean).length;
    return classes >= 2; // au moins 2 classes de caractères
  }, [password]);

  const passwordsMatch = password === confirmPassword;

  useEffect(() => {
    setMessage(null);
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!hasToken) {
      setMessage("❌ Lien de réinitialisation invalide.");
      return;
    }
    if (!passwordsMatch) {
      setMessage("❌ Les mots de passe ne correspondent pas.");
      return;
    }
    if (!strongEnough) {
      setMessage(
        "❌ Mot de passe trop faible (8+ caractères, mélange conseillé)."
      );
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch(
        `/api/reset-password/${encodeURIComponent(token)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
          cache: "no-store",
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessage(`❌ ${data?.error || "Erreur inconnue."}`);
        return;
        // côté serveur: invalider le token après usage; throttle + logging
      }

      setMessage("✅ Mot de passe réinitialisé avec succès. Redirection…");
      setTimeout(() => router.replace("/login"), 1800);
    } catch {
      setMessage("❌ Erreur réseau.");
    } finally {
      setIsLoading(false);
    }
  };

  const msgClass = !message
    ? ""
    : message.startsWith("✅")
      ? "text-green-600"
      : "text-red-600";

  // état sans token clair et non-bloquant
  if (!hasToken) {
    return (
      <div className="forgot-password-container rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Lien invalide</h2>
        <p className="mb-4">
          Le lien de réinitialisation semble incorrect ou incomplet.
        </p>
        <div className="forgot-password-actions">
          <Link href="/forgot-password" className="button-cancel">
            Demander un nouveau lien
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-container rounded-lg">
      <h2 className="text-2xl font-bold">Nouveau mot de passe</h2>

      <form onSubmit={handleSubmit} className="forgot-password-form" noValidate>
        <div className="forgot-password-form-item">
          <label htmlFor="password">Nouveau mot de passe</label>
          <div className="relative">
            <input
              id="password"
              type={showPw ? "text" : "password"}
              placeholder="Nouveau mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              disabled={isLoading}
              aria-invalid={!strongEnough}
              aria-describedby="pw-help"
            />
            <button
              type="button"
              className="pw-toggle"
              onClick={() => setShowPw((s) => !s)}
              aria-label={
                showPw ? "Masquer le mot de passe" : "Afficher le mot de passe"
              }
            >
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>
          <small id="pw-help" className="text-gray-600 block mt-1">
            8+ caractères. Mélange recommandé&nbsp;: lettres, chiffres, symbole.
          </small>
        </div>

        <div className="forgot-password-form-item">
          <label htmlFor="confirmPassword">Confirmation du mot de passe</label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showPw2 ? "text" : "password"}
              placeholder="Confirmation du mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              disabled={isLoading}
              aria-invalid={!passwordsMatch}
            />
            <button
              type="button"
              className="pw-toggle"
              onClick={() => setShowPw2((s) => !s)}
              aria-label={
                showPw2 ? "Masquer la confirmation" : "Afficher la confirmation"
              }
            >
              {showPw2 ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <div className="forgot-password-actions text-[15px] text-gray-800 text-center my-2 flex items-center justify-between gap-3">
          <Link href="/login" className="button-cancel">
            Retour à la connexion
          </Link>
          <button
            type="submit"
            className="forgot-password-form-item-submit"
            disabled={isLoading || !passwordsMatch || !strongEnough}
            aria-busy={isLoading}
          >
            {isLoading ? "Réinitialisation..." : "Réinitialiser"}
          </button>
        </div>

        {message && (
          <p
            className={`text-sm text-center mt-3 font-medium ${msgClass}`}
            aria-live="polite"
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
