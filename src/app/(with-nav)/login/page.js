"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import Link from "next/link";
import styles from "@/styles/pages/login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated, loading } = useAuth();
  const { canUseAuth } = useCookieConsent();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/accueil");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className={`${styles["login-container"]} rounded-lg`}>
        <div className="text-center">
          <p>Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className={`${styles["login-container"]} rounded-lg`}>
        <div className="text-center">
          <p>Vous êtes déjà connecté. Redirection...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setMessage(null);

    if (!canUseAuth()) {
      setMessage(
        "❌ Vous devez accepter les cookies fonctionnels pour vous connecter."
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
        cache: "no-store",
      });

      if (!res.ok) {
        let err = "Erreur inconnue";
        try {
          const data = await res.json();
          err = data?.error || err;
        } catch {}
        setMessage(`❌ ${err}`);
        return;
      }

      let ok = await login(); // appelle /api/me
      if (!ok) {
        await new Promise((r) => setTimeout(r, 150));
        ok = await login();
      }
      if (!ok) {
        setMessage("❌ Connexion en cours, réessayez.");
        return;
      }

      setMessage("✅ Connexion réussie.");
      router.replace("/accueil");
      router.refresh();
    } catch (err) {
      console.error(err);
      setMessage("❌ Erreur réseau ou serveur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const msgClass = !message
    ? ""
    : message.includes("✅")
      ? "text-green-600"
      : message.includes("❌")
        ? "text-red-600"
        : "text-gray-600";

  return (
    <div className={`${styles["login-container"]} rounded-lg`}>
      <h1 className="text-2xl font-bold">Se connecter</h1>

      {!canUseAuth() && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-yellow-800 text-sm">
            ⚠️ <strong>Cookies requis :</strong> Vous devez accepter les cookies
            fonctionnels pour utiliser l'authentification.
            <button
              onClick={() => window.location.reload()}
              className="underline ml-1"
            >
              Actualiser la page
            </button>
            pour configurer vos préférences.
          </p>
        </div>
      )}

      <form className={styles["login-form"]} onSubmit={handleSubmit}>
        <div className={styles["login-form-item"]}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className={styles["login-form-item"]}>
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      {message && (
        <p className={`text-sm text-center mt-4 ${msgClass}`}>{message}</p>
      )}

      <div className="text-[15px] text-gray-800 mt-2">
        <p>
          <Link href="/register">Créer un compte</Link>
        </p>
        <p>
          <Link href="/forgot-password">Mot de passe oublié ?</Link>
        </p>
      </div>
    </div>
  );
}
