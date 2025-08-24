// app/(with-nav)/politique-confidentialite/page.js
export { metadata } from "./metadata";

import PolitiqueConfidentialiteClient from "./PolitiqueConfidentialiteClient";

export default function Page() {
  return (
    <section>
      <h1 className="sr-only">Politique de confidentialité</h1>
      <PolitiqueConfidentialiteClient />
    </section>
  );
}
