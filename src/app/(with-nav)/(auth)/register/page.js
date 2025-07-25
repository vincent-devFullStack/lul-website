import "../../../../styles/pages/register.css";
import Link from "next/link";

export default function Register() {
  return (
    <div className="register-container rounded-lg">
      <h1 className="text-2xl font-bold">S'inscrire</h1>
      <form className="register-form">
        <div className="register-form-item">
          <label htmlFor="email">Adresse email</label>
          <input type="text" placeholder="Email" required />
        </div>
        <div className="register-form-item">
          <label htmlFor="password">PIN Administrateur</label>
          <input
            type="password"
            placeholder="Code PIN administrateur"
            required
          />
        </div>
        <div className="register-form-item">
          <label htmlFor="password">Mot de passe</label>
          <input type="password" placeholder="Mot de passe" required />
        </div>
        <div className="register-form-item">
          <label htmlFor="password">Confirmation du mot de passe</label>
          <input
            type="password"
            placeholder="Confirmation du mot de passe"
            required
          />
        </div>
        <button type="submit">S'inscrire</button>
      </form>
      <div className="register-links text-[15px] text-gray-800">
        <p>
          <Link href="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
