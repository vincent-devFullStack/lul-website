"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import "@/styles/pages/forgot-password.css";

export default function ResetPassword() {
  const router = useRouter();
  const params = useParams();
  const { token } = params;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setMessage("Lien de réinitialisation invalide.");
      router.push("/login");
    }
  }, [token, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 6) {
      setMessage("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Mot de passe réinitialisé avec succès !");
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setMessage(`${data.error || "Erreur inconnue."}`);
      }
    } catch {
      setMessage("Erreur réseau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container rounded-lg">
      <h1 className="text-2xl font-bold">Nouveau mot de passe</h1>

      <form onSubmit={handleSubmit} className="forgot-password-form">
        <div className="forgot-password-form-item">
          <label htmlFor="password">Nouveau mot de passe</label>
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <div className="forgot-password-form-item">
          <label htmlFor="confirmPassword">Confirmation du mot de passe</label>
          <input
            type="password"
            placeholder="Confirmation du mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <div className="forgot-password-actions text-[15px] text-gray-800 text-center my-2">
          <Link href="/login" className="button-cancel">
            Retour à la connexion
          </Link>
          <button
            type="submit"
            className="forgot-password-form-item-submit"
            disabled={isLoading}
          >
            {isLoading ? "Réinitialisation..." : "Réinitialiser"}
          </button>
        </div>

        {message && (
          <p className="text-sm text-center mt-3 text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
}
