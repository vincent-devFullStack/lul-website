// app/(with-nav)/about/page.js
export { metadata } from "./metadata"; // ← nécessaire pour que Next prenne la meta en compte

import AboutClient from "./AboutClient";

export default function Page() {
  return <AboutClient />;
}
