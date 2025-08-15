// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { useAuth } from "@/context/AuthContext";
// import { useCookieConsent } from "@/hooks/useCookieConsent";
// import "@/styles/pages/register.css";

// export default function Register() {
//   const router = useRouter();
//   const { login } = useAuth();
//   const { canUseAuth } = useCookieConsent();

//   const [email, setEmail] = useState("");
//   const [pin, setPin] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [message, setMessage] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const passwordsMatch = password === confirm;
//   const passwordStrongEnough = password.length >= 8;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (isLoading) return;
//     setMessage(null);

//     if (!canUseAuth()) {
//       setMessage(
//         "❌ Vous devez accepter les cookies fonctionnels pour vous inscrire."
//       );
//       return;
//     }

//     if (!passwordsMatch) {
//       setMessage("❌ Les mots de passe ne correspondent pas.");
//       return;
//     }
//     if (!passwordStrongEnough) {
//       setMessage("❌ Le mot de passe doit contenir au moins 8 caractères.");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const res = await fetch("/api/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({
//           email,
//           password,
//           confirmPassword: confirm,
//           pin,
//         }),
//         cache: "no-store",
//       });

//       const data = await res.json().catch(() => ({}));

//       if (!res.ok) {
//         setMessage(`❌ ${data?.error || "Erreur inconnue"}`);
//         return;
//       }

//       // Tente de récupérer la session
//       await login();
//       setMessage("✅ Compte créé. Redirection...");
//       router.replace("/accueil");
//       router.refresh();
//     } catch {
//       setMessage("❌ Erreur réseau.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const msgClass = !message
//     ? ""
//     : message.startsWith("✅")
//       ? "text-green-600"
//       : "text-red-600";

//   return (
//     <div className="register-container rounded-lg">
//       <h1 className="text-2xl font-bold">S'inscrire</h1>

//       {!canUseAuth() && (
//         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
//           <p className="text-yellow-800 text-sm">
//             ⚠️ <strong>Cookies requis :</strong> vous devez accepter les cookies
//             fonctionnels pour créer un compte. Actualisez la page après avoir
//             fait votre choix dans la bannière de consentement.
//           </p>
//         </div>
//       )}

//       <form className="register-form" onSubmit={handleSubmit} noValidate>
//         <div className="register-form-item">
//           <label htmlFor="email">Adresse email</label>
//           <input
//             id="email"
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             autoComplete="email"
//             inputMode="email"
//             autoCapitalize="off"
//             autoCorrect="off"
//             disabled={isLoading}
//           />
//         </div>

//         <div className="register-form-item">
//           <label htmlFor="pin">PIN Administrateur</label>
//           <input
//             id="pin"
//             type="password"
//             placeholder="Code PIN administrateur"
//             value={pin}
//             onChange={(e) => setPin(e.target.value)}
//             required
//             inputMode="numeric"
//             pattern="\d*"
//             autoComplete="one-time-code"
//             disabled={isLoading}
//           />
//         </div>

//         <div className="register-form-item">
//           <label htmlFor="password">Mot de passe</label>
//           <input
//             id="password"
//             type="password"
//             placeholder="Mot de passe"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             minLength={8}
//             autoComplete="new-password"
//             disabled={isLoading}
//             aria-invalid={!passwordStrongEnough}
//           />
//           <small className="text-gray-600">
//             Au moins 8 caractères (recommandé : lettres, chiffres, symbole).
//           </small>
//         </div>

//         <div className="register-form-item">
//           <label htmlFor="confirm">Confirmation du mot de passe</label>
//           <input
//             id="confirm"
//             type="password"
//             placeholder="Confirmation du mot de passe"
//             value={confirm}
//             onChange={(e) => setConfirm(e.target.value)}
//             required
//             minLength={8}
//             autoComplete="new-password"
//             disabled={isLoading}
//             aria-invalid={!passwordsMatch}
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={
//             isLoading ||
//             !canUseAuth() ||
//             !passwordsMatch ||
//             !passwordStrongEnough
//           }
//         >
//           {isLoading ? "Création..." : "S'inscrire"}
//         </button>

//         {/* Zone de feedback accessible */}
//         <p
//           className={`text-sm text-center mt-4 ${msgClass}`}
//           aria-live="polite"
//         >
//           {message}
//         </p>
//       </form>

//       <div className="register-links text-[15px] text-gray-800 mt-4">
//         <p>
//           <Link href="/login">Se connecter</Link>
//         </p>
//       </div>
//     </div>
//   );
// }
