// app/(with-nav)/reset-password/[token]/page.js
import ResetPasswordClient from "./ResetPasswordClient";
export { metadata } from "./metadata";

export default function Page({ params }) {
  const token = Array.isArray(params?.token)
    ? params.token[0]
    : params?.token || "";
  return (
    <section>
      <h1 className="sr-only">Réinitialisation du mot de passe</h1>
      <ResetPasswordClient token={token} />
    </section>
  );
}
