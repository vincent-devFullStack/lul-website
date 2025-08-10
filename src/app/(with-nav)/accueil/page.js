export const revalidate = 3600;

import { getAllRooms } from "@/lib/mongodb";
import AccueilPlanInteractif from "./components/PlanClient";

export default async function AccueilPage() {
  const salles = await getAllRooms();
  return <AccueilPlanInteractif salles={salles} />;
}
