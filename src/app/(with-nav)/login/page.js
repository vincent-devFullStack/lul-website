"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import Link from "next/link";
import "../../../styles/pages/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated, loading } = useAuth();
  const { canUseAuth } = useCookieConsent();

  // ✅ Redirection si déjà connecté - MAIS pas immédiatement
  useEffect(() => {
    if (!loading && isAuthenticated) {
      console.log("👤 Utilisateur déjà connecté, redirection vers /accueil");
      router.replace("/accueil"); // ✅ Utiliser replace au lieu de push
    }
  }, [isAuthenticated, loading, router]);

  // ✅ Ne pas afficher la page si en cours de chargement ou déjà connecté
  if (loading) {
    return (
      <div className="login-container rounded-lg">
        <div className="text-center">
          <p>Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // ✅ Si déjà connecté, ne pas afficher le formulaire
  if (isAuthenticated) {
    return (
      <div className="login-container rounded-lg">
        <div className="text-center">
          <p>Vous êtes déjà connecté. Redirection...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // ✅ Empêcher les soumissions multiples

    setIsSubmitting(true);
    setMessage(null);

    // ✅ Vérifier le consentement aux cookies
    if (!canUseAuth()) {
      setMessage(
        "❌ Vous devez accepter les cookies fonctionnels pour vous connecter."
      );
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("🔄 Tentative de connexion...");

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("📡 Réponse API:", { status: res.status, data });

      if (res.ok && data.token) {
        const loginSuccess = login(data.token);
        if (loginSuccess) {
          setMessage("✅ Connexion réussie.");
          console.log("🎉 Connexion réussie, redirection vers /accueil");

          // ✅ Attendre un peu puis rediriger
          setTimeout(() => {
            router.replace("/accueil");
          }, 1000);
        } else {
          setMessage(
            "❌ Impossible de se connecter : cookies fonctionnels requis."
          );
        }
      } else {
        setMessage(`❌ ${data.error || "Erreur inconnue"}`);
      }
    } catch (err) {
      console.error("❌ Erreur réseau ou serveur :", err);
      setMessage("❌ Erreur réseau ou serveur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Fonction pour déterminer la couleur du message
  const getMessageClass = () => {
    if (!message) return "";
    if (message.includes("✅")) return "text-green-600";
    if (message.includes("❌")) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="login-container rounded-lg">
      <h1 className="text-2xl font-bold">Se connecter</h1>

      {/* ✅ Avertissement cookies */}
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

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-form-item">
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
        <div className="login-form-item">
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
        <p className={`text-sm text-center mt-4 ${getMessageClass()}`}>
          {message}
        </p>
      )}

      <div className="login-links text-[15px] text-gray-800 mt-2">
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
