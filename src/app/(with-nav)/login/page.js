"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import Link from "next/link";
import styles from "@/styles/pages/login.module.css";

export default function Login() {
  const router = useRouter();
  const { login, isAuthenticated, loading } = useAuth();
  const { canUseAuth } = useCookieConsent();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mémo: état courant des cookies (évite de recalculer à chaque render)
  const cookiesOk = useMemo(() => canUseAuth(), [canUseAuth]);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/accueil");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className={`${styles["login-container"]} rounded-lg`}>
        <div className="text-center">
          <p>Vérification de l&apos;authentification...</p>
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

    if (!cookiesOk) {
      setMessage(
        "❌ Vous devez accepter les cookies fonctionnels pour vous connecter."
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const emailTrimmed = email.trim().toLowerCase();
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: emailTrimmed, password }),
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

      // Met à jour le contexte d'auth
      let ok = await login();
      if (!ok) {
        // petit retry si le cookie vient juste d'être posé
        await new Promise((r) => setTimeout(r, 400));
        ok = await login();
      }
      if (!ok) {
        setMessage(
          "Connexion en cours… si rien ne se passe, actualisez la page."
        );
        setTimeout(() => window.location.reload(), 2500);
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
    <main>
      <div className={`${styles["login-container"]} rounded-lg`}>
        <h1 className="text-2xl font-bold">Se connecter</h1>

        {!cookiesOk && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800 text-sm">
              ⚠️ <strong>Cookies requis :</strong> vous devez accepter les
              cookies fonctionnels pour utiliser l&apos;authentification.{" "}
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="underline ml-1"
              >
                Actualiser la page
              </button>{" "}
              après avoir modifié vos préférences.
            </p>
          </div>
        )}

        <form
          className={styles["login-form"]}
          onSubmit={handleSubmit}
          autoComplete="on"
          aria-describedby="login-status"
          noValidate
        >
          {/* Désactive tout le formulaire pendant l’envoi ou si cookies refusés */}
          <fieldset
            disabled={isSubmitting || !cookiesOk}
            aria-busy={isSubmitting}
          >
            <div className={styles["login-form-item"]}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                inputMode="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                autoFocus
              />
            </div>

            <div className={styles["login-form-item"]}>
              <label htmlFor="password">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                enterKeyHint="go"
              />
            </div>

            <button type="submit">
              {isSubmitting ? "Connexion..." : "Se connecter"}
            </button>
          </fieldset>

          <div
            id="login-status"
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className={`text-sm text-center mt-4 min-h-[1.25rem] ${msgClass}`}
          >
            {message}
          </div>
        </form>

        <nav
          className="text-[15px] text-gray-800 mt-2 space-y-1"
          aria-label="Liens annexes"
        >
          <p>
            <Link href="/register">Créer un compte</Link>
          </p>
          <p>
            <Link href="/forgot-password">Mot de passe oublié ?</Link>
          </p>
        </nav>
      </div>
    </main>
  );
}
