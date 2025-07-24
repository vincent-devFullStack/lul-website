import "../../../../styles/pages/forgot-password.css";

import Link from "next/link";
export default function ForgotPassword() {
  return (
    <div className="forgot-password-container rounded-lg">
      <h1 className="text-2xl font-bold">Mot de passe oublié ?</h1>
      <form className="forgot-password-form">
        <div className="forgot-password-form-item">
          <label htmlFor="email">Adresse email</label>
          <input type="text" placeholder="Email" required />
        </div>
        <div className="forgot-password-form-item">
          <label htmlFor="password">PIN Administrateur</label>
          <input
            type="password"
            placeholder="Code PIN administrateur"
            required
          />
        </div>
        <div className="forgot-password-actions text-[15px] text-gray-800 text-center my-2">
          <Link href="/login" className="button-cancel">
            Annuler
          </Link>
          <button type="submit" className="forgot-password-form-item-submit">
            Réinitialiser le mot de passe
          </button>
        </div>
      </form>
    </div>
  );
}
