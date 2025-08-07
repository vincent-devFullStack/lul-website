"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "@/styles/pages/forgot-password.css";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pin }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(
          "✅ Un email de réinitialisation a été envoyé à votre adresse."
        );
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setMessage(`❌ ${data.error || "Erreur inconnue."}`);
      }
    } catch {
      setMessage("❌ Une erreur réseau est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Fonction pour déterminer la couleur du message
  const getMessageClass = () => {
    if (!message) return "";
    if (message.includes("✅")) return "text-green-600";
    if (message.includes("❌")) return "text-red-600";
    return "text-gray-700";
  };

  return (
    <div className="forgot-password-container rounded-lg">
      <h1 className="text-2xl font-bold">Mot de passe oublié ?</h1>

      <form onSubmit={handleSubmit} className="forgot-password-form">
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

        <div className="forgot-password-actions text-[15px] text-gray-800 text-center my-2">
          <Link href="/login" className="button-cancel">
            Retour à la connexion
          </Link>
          <button
            type="submit"
            className="forgot-password-form-item-submit"
            disabled={isLoading}
          >
            {isLoading ? "Envoi..." : "Envoyer le lien"}
          </button>
        </div>

        {message && (
          <p
            className={`text-sm text-center mt-3 font-medium ${getMessageClass()}`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
