// app/(with-nav)/forgot-password/page.js
export { metadata } from "./metadata";

import ForgotPasswordClient from "./ForgotPasswordClient";

export default function Page() {
  return (
    <section>
      <h1 className="sr-only">Mot de passe oublié</h1>
      <ForgotPasswordClient />
    </section>
  );
}
