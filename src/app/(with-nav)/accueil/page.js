// Server Component
export const revalidate = 3600; // ISR: régénère au plus tôt toutes les 1h

import { getAllRooms } from "@/lib/mongodb"; // on va direct en DB (plus rapide que passer par /api)
import AccueilPlanInteractif from "./components/PlanClient"; // client component

export default async function AccueilPage() {
  // Charge les salles côté serveur => HTML prêt tout de suite (meilleur LCP)
  const salles = await getAllRooms(); // [{ _id, slug, name, description, coordinates, status, artworks, ... }]

  return <AccueilPlanInteractif salles={salles} />;
}
