"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "@/styles/pages/forgot-password.css";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const controllerRef = useRef(null);
  const statusRef = useRef(null);

  useEffect(() => {
    if (message) statusRef.current?.focus();
  }, [message, statusRef]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setMessage(null);
    setIsLoading(true);

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), pin: pin.trim() }),
        signal: controller.signal,
        cache: "no-store",
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        // pas de JSON => ignore
      }

      if (res.ok) {
        setMessage({
          type: "success",
          text: "Un email de réinitialisation a été envoyé à votre adresse.",
        });
        setTimeout(() => router.push("/login"), 2500);
      } else {
        setMessage({
          type: "error",
          text: data?.error || "Erreur inconnue.",
        });
      }
    } catch (err) {
      if (err?.name !== "AbortError") {
        setMessage({ type: "error", text: "Une erreur réseau est survenue." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const msgClass =
    message?.type === "success"
      ? "text-green-700"
      : message?.type === "error"
        ? "text-red-700"
        : "";

  return (
    <main className="forgot-password-container rounded-lg">
      <h1 className="text-2xl font-bold mb-2">Mot de passe oublié&nbsp;?</h1>
      <p className="mb-4 text-sm text-gray-700">
        Saisissez votre adresse email et le PIN administrateur pour recevoir un
        lien de réinitialisation.
      </p>

      <form onSubmit={handleSubmit} className="forgot-password-form" noValidate>
        <div className="forgot-password-form-item">
          <label htmlFor="email">Adresse email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="votre@email.fr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
          />
        </div>

        <div className="forgot-password-form-item">
          <label htmlFor="pin">PIN administrateur</label>
          <input
            id="pin"
            name="pin"
            type="password"
            placeholder="Code PIN administrateur"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
            autoComplete="one-time-code"
            inputMode="numeric"
            pattern="[0-9]*"
            aria-describedby="pin-help"
          />
          <small id="pin-help" className="block text-xs text-gray-600 mt-1">
            4–6 chiffres (fourni par l’administrateur).
          </small>
        </div>

        <div className="forgot-password-actions text-[15px] text-gray-800 text-center my-2 flex items-center justify-between gap-3">
          <Link href="/login" className="button-cancel">
            Retour à la connexion
          </Link>
          <button
            type="submit"
            className="forgot-password-form-item-submit"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? "Envoi…" : "Envoyer le lien"}
          </button>
        </div>

        {message && (
          <p
            ref={statusRef}
            tabIndex={-1}
            role="status"
            aria-live="polite"
            className={`text-sm text-center mt-3 font-medium ${msgClass}`}
          >
            {message.text}
          </p>
        )}
      </form>
    </main>
  );
}
