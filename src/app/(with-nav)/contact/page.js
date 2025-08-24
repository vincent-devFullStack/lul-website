// app/(with-nav)/contact/page.js
export { metadata } from "./metadata"; // ← important pour la meta

import ContactClient from "./ContactClient";

export default function Page() {
  return (
    <section>
      <h1 className="sr-only">Contact</h1>
      <ContactClient />
    </section>
  );
}
