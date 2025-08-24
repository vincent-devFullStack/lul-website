// app/(with-nav)/credits-artistiques/page.js
export { metadata } from "./metadata";

import CreditsArtistiquesClient from "./CreditsArtistiquesClient";

export default function Page() {
  return (
    <section>
      <h1 className="sr-only">Crédits artistiques</h1>
      <CreditsArtistiquesClient />
    </section>
  );
}
