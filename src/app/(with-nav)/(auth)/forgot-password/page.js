"use client";

import "../../../../styles/pages/forgot-password.css";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [step, setStep] = useState(1);
  const [message, setMessage] = useState(null);
  const [token, setToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (step === 1) {
      try {
        const res = await fetch("/api/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, pin }),
        });

        const data = await res.json();

        if (res.ok) {
          setToken(data.token?.trim()); // on stocke le token retourné
          setStep(2);
        } else {
          setMessage(`❌ ${data.error || "Erreur inconnue."}`);
        }
      } catch {
        setMessage("❌ Une erreur réseau est survenue.");
      }
    } else if (step === 2) {
      if (newPassword !== confirmPassword) {
        setMessage("❌ Les mots de passe ne correspondent pas.");
        return;
      }

      try {
        const res = await fetch(`/api/reset-password/${token}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: newPassword }),
        });

        const data = await res.json();

        if (res.ok) {
          setMessage("✅ Mot de passe réinitialisé.");
          setTimeout(() => router.push("/login"), 2000);
        } else {
          setMessage(`❌ ${data.error || "Erreur inconnue."}`);
        }
      } catch {
        setMessage("❌ Erreur réseau.");
      }
    }
  };

  return (
    <div className="forgot-password-container rounded-lg">
      <h1 className="text-2xl font-bold">Mot de passe oublié ?</h1>

      <form onSubmit={handleSubmit} className="forgot-password-form">
        {step === 1 && (
          <>
            <div className="forgot-password-form-item">
              <label htmlFor="email">Adresse email</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="forgot-password-form-item">
              <label htmlFor="pin">PIN Administrateur</label>
              <input
                type="password"
                placeholder="Code PIN administrateur"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="forgot-password-form-item">
              <label htmlFor="newPassword">Nouveau mot de passe</label>
              <input
                type="password"
                placeholder="Nouveau mot de passe"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="forgot-password-form-item">
              <label htmlFor="confirmPassword">
                Confirmation du mot de passe
              </label>
              <input
                type="password"
                placeholder="Confirmation du mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <div className="forgot-password-actions text-[15px] text-gray-800 text-center my-2">
          <Link href="/login" className="button-cancel">
            Annuler
          </Link>
          <button type="submit" className="forgot-password-form-item-submit">
            {step === 1 ? "Réinitialiser le mot de passe" : "Valider"}
          </button>
        </div>

        {message && (
          <p className="text-sm text-center mt-3 text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
}
