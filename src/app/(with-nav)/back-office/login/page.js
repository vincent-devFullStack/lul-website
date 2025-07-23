import Link from "next/link";

export default function BackOffice() {
  return (
    <>
      <div className="login-container rounded-lg">
          <h1 className="text-2xl font-bold">Se connecter</h1>
        <form className="login-form">
          <div className="login-form-item">
            <label htmlFor="email">Email</label>
            <input type="text" placeholder="Email" required/>
          </div>
          <div className="login-form-item">
            <label htmlFor="password">Mot de passe</label>
            <input type="password" placeholder="Password" required/>
          </div>
          <button type="submit">Se connecter</button>
        </form>
          <div className="login-links text-sm text-gray-800">
            <p>
              <Link href="/back-office/register">Créer un compte</Link>
            </p>
            <p>
              <Link href="/back-office/forgot-password">Mot de passe oublié ?</Link>
            </p>
          </div>
      </div>
    </>
  )
}