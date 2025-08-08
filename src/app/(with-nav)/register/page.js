"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import "../../../styles/pages/register.css";
import "../../../styles/pages/forgot-password.css";

export default function Register() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (password !== confirm) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          confirmPassword: confirm,
          pin,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        login();
        router.push("/accueil");
      } else {
        setMessage(`${data.error || "Erreur inconnue"}`);
      }
    } catch (err) {
      setMessage("Erreur réseau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container rounded-lg">
      <h1 className="text-2xl font-bold">S'inscrire</h1>

      <form className="register-form" onSubmit={handleSubmit}>
        <div className="register-form-item">
          <label htmlFor="email">Adresse email</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="register-form-item">
          <label htmlFor="pin">PIN Administrateur</label>
          <input
            id="pin"
            type="password"
            placeholder="Code PIN administrateur"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
          />
        </div>

        <div className="register-form-item">
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="register-form-item">
          <label htmlFor="confirm">Confirmation du mot de passe</label>
          <input
            id="confirm"
            type="password"
            placeholder="Confirmation du mot de passe"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Création..." : "S'inscrire"}
        </button>
      </form>

      {message && (
        <p
          className={`text-sm text-center mt-4 ${
            message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <div className="register-links text-[15px] text-gray-800 mt-4">
        <p>
          <Link href="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
