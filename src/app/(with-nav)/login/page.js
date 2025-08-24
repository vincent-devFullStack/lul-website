// app/(with-nav)/login/page.js
export { metadata } from "./metadata";

import LoginClient from "./LoginClient";

export default function Page() {
  return (
    <section>
      <h1 className="sr-only">Connexion</h1>
      <LoginClient />
    </section>
  );
}
