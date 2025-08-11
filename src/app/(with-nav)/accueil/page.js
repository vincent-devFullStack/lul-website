export const revalidate = 3600;

import { unstable_cache } from "next/cache";
import { getAllRooms } from "@/lib/mongodb";
import AccueilPlanInteractif from "./components/PlanClient";

const getAllRoomsCached = unstable_cache(
  async () => {
    const rows = await getAllRooms();
    return (rows || []).map((r) => ({
      _id: r?._id?.toString?.() ?? r?._id ?? "",
      slug: r?.slug ?? "",
      name: r?.name ?? "",
      description: r?.description ?? "",
      status: r?.status ?? "open",
      displayOrder: Number.isFinite?.(r?.displayOrder) ? r.displayOrder : 9999,
      coordinates: r?.coordinates
        ? {
            top: r.coordinates.top,
            left: r.coordinates.left,
            width: r.coordinates.width,
            height: r.coordinates.height,
          }
        : null,
      artworks: Array.isArray(r?.artworks)
        ? r.artworks.map((a) => ({
            _id: a?._id?.toString?.() ?? a?._id ?? "",
            title: a?.title ?? "",
            description: a?.description ?? "",
            imageUrl: a?.imageUrl ?? "",
            artist: a?.artist ?? "",
          }))
        : [],
    }));
  },
  ["rooms:list"],
  { revalidate: 3600, tags: ["rooms"] }
);

export const metadata = {
  title: "Plan interactif des salles",
  description:
    "Explorez les salles du musée virtuel via le plan interactif et accédez aux collections.",
  alternates: { canonical: "https://www.iconodule.fr/accueil" },
};

export default async function AccueilPage() {
  const salles = await getAllRoomsCached();
  return <AccueilPlanInteractif salles={salles} />;
}
