"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import "@/styles/pages/forgot-password.css";

export default function ResetPassword() {
  const router = useRouter();
  const params = useParams();
  const token = Array.isArray(params?.token) ? params.token[0] : params?.token;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redirige si l'URL ne contient pas de token
  useEffect(() => {
    if (!token) {
      setMessage("❌ Lien de réinitialisation invalide.");
      router.replace("/login");
    }
  }, [token, router, setMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setMessage(null);

    if (password !== confirmPassword) {
      setMessage("❌ Les mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 8) {
      setMessage("❌ Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setIsLoading(true);

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
      }

      setMessage("✅ Mot de passe réinitialisé avec succès. Redirection…");
      setTimeout(() => router.replace("/login"), 2500);
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

  return (
    <div className="forgot-password-container rounded-lg">
      <h1 className="text-2xl font-bold">Nouveau mot de passe</h1>

      <form onSubmit={handleSubmit} className="forgot-password-form" noValidate>
        <div className="forgot-password-form-item">
          <label htmlFor="password">Nouveau mot de passe</label>
          <input
            id="password"
            type="password"
            placeholder="Nouveau mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            disabled={isLoading}
          />
          <small className="text-gray-600">
            Au moins 8 caractères (recommandé : lettres, chiffres, symbole).
          </small>
        </div>

        <div className="forgot-password-form-item">
          <label htmlFor="confirmPassword">Confirmation du mot de passe</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirmation du mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            disabled={isLoading}
          />
        </div>

        <div className="forgot-password-actions text-[15px] text-gray-800 text-center my-2">
          <Link href="/login" className="button-cancel">
            Retour à la connexion
          </Link>
          <button
            type="submit"
            className="forgot-password-form-item-submit"
            disabled={isLoading || !token}
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
