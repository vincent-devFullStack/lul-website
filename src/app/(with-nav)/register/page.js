// app/(with-nav)/register/page.js
export { metadata } from "./metadata";

import RegisterClient from "./RegisterClient";

export default function Page() {
  return (
    <section>
      <h1 className="sr-only">Inscription</h1>
      <RegisterClient />
    </section>
  );
}
