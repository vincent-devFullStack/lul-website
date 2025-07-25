import Link from "next/link";
import "../../../../styles/pages/login.css";

export default function BackOffice() {
  return (
    <>
      <div className="login-container rounded-lg">
        <h1 className="text-2xl font-bold">Se connecter</h1>
        <form className="login-form">
          <div className="login-form-item">
            <label htmlFor="email">Email</label>
            <input type="text" placeholder="Email" required />
          </div>
          <div className="login-form-item">
            <label htmlFor="password">Mot de passe</label>
            <input type="password" placeholder="Mot de passe" required />
          </div>
          <button type="submit">Se connecter</button>
        </form>
        <div className="login-links text-[15px]/5 text-gray-800">
          <p>
            <Link href="/register">Créer un compte</Link>
          </p>
          <p>
            <Link href="/forgot-password">Mot de passe oublié ?</Link>
          </p>
        </div>
      </div>
    </>
  );
}
