"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../../../../styles/pages/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      console.log("res.status", res.status);
      console.log("res.ok", res.ok);
      console.log("data", data);

      if (res.status === 200 || res.ok) {
        setMessage("✅ Connexion réussie.");
        setTimeout(() => {
          router.push("/accueil");
        }, 1500);
      } else {
        setMessage(`❌ ${data.error || "Erreur inconnue"}`);
      }
    } catch (err) {
      console.error("❌ Erreur réseau ou serveur :", err);
      setMessage("❌ Erreur réseau ou serveur.");
    }
  };

  return (
    <div className="login-container rounded-lg">
      <h1 className="text-2xl font-bold">Se connecter</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-form-item">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
          />
        </div>
        <button type="submit">Se connecter</button>
      </form>

      {message && (
        <p className="text-sm text-center mt-4 text-red-600">{message}</p>
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
