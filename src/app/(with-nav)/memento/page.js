export { metadata } from "./metadata";

import MementoClient from "./MementoClient";

export default function Page() {
  return (
    <section>
      <h1 className="sr-only">Mementos — citations et collaborations</h1>
      <MementoClient />
    </section>
  );
}
