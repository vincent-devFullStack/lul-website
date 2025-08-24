// app/(with-nav)/mentions-legales/page.js
export { metadata } from "./metadata";

import MentionsLegalesClient from "./MentionsLegalesClient";

export default function Page() {
  return (
    <section>
      <h1 className="sr-only">Mentions légales</h1>
      <MentionsLegalesClient />
    </section>
  );
}
